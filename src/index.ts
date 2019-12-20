import {
  DEFAULT_STORE_PREFIX,
  DEFAULT_STORE_SEPARATOR,
  PATH_CHANNEL,
  PATH_PROPOSED_APP_INSTANCE_ID
} from './constants'
import InternalStore from './store'
import { PisaClient, StoreFactoryOptions, StorePair, Wallet } from './types'
import {
  arrayify,
  hexlify,
  keccak256,
  safeJsonParse,
  safeJsonStringify,
  toUtf8Bytes,
  toUtf8String
} from './utils'

export default class ConnextStore {
  private store: InternalStore

  private prefix: string = DEFAULT_STORE_PREFIX
  private separator: string = DEFAULT_STORE_SEPARATOR
  private pisaClient: PisaClient | null = null
  private wallet: Wallet | null = null

  constructor (storage: Storage, opts?: StoreFactoryOptions) {
    this.store = new InternalStore(storage)

    if (opts) {
      this.prefix = opts.prefix || DEFAULT_STORE_PREFIX
      this.separator = opts.separator || DEFAULT_STORE_SEPARATOR
      this.pisaClient = opts.pisaClient || null
      this.wallet = opts.wallet || null
    }
  }

  public async get (path: string) {
    const raw = await this.store.getItem(`${path}`)
    const partialMatches = await this.getPartialMatches(path)
    return partialMatches || raw
  }

  public async set (pairs: StorePair[], shouldBackup?: boolean) {
    for (const pair of pairs) {
      await this.store.setItem(pair.path, pair.value)

      if (
        shouldBackup &&
        this.pisaClient &&
        this.wallet &&
        pair.path.match(/\/xpub.*\/channel\/0x[0-9a-fA-F]{40}/) &&
        pair.value.freeBalanceAppInstance
      ) {
        await this.pisaBackup(pair)
      }
    }
  }

  public async reset (): Promise<void> {
    // TODO: Should we also scrub legacy channel prefixes?
    const channelPrefix = `${this.prefix}${this.separator}`
    // get all keys in local storage that match prefix
    const entries = this.store.getEntries()
    entries.forEach(([key, value]: [string, any]) => {
      if (key.includes(channelPrefix)) {
        this.store.removeItem(key)
      }
    })
  }

  public async restore (): Promise<any[]> {
    return this.pisaClient ? this.pisaRestore() : []
  }

  /// ////////////////////////////////////////////
  /// // PRIVATE METHODS

  private async getPartialMatches (path: string) {
    // Handle partial matches so the following line works -.-
    // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
    if (
      path.endsWith(PATH_CHANNEL) ||
      path.endsWith(PATH_PROPOSED_APP_INSTANCE_ID)
    ) {
      const partialMatches = {}
      const keys = this.store.getKeys()
      for (const k of keys) {
        const pathToFind = `${path}${this.separator}`
        if (k.includes(pathToFind)) {
          const value = await this.store.getItem(k)
          partialMatches[k.replace(pathToFind, '')] = value
        }
      }
      return partialMatches
    }
    return null
  }

  /// ////////////////////////////////////////////
  /// // WALLET METHODS

  private getWallet (): Wallet {
    if (!this.wallet) {
      throw new Error('No Wallet was provided')
    }
    return this.wallet
  }

  private getWalletSigner (): (digest: any) => Promise<string> {
    const wallet = this.getWallet()
    return (digest: any): Promise<string> =>
      wallet.signMessage(arrayify(digest))
  }

  private getWalletAddress (): string {
    const wallet = this.getWallet()
    return wallet.address
  }

  private getBlockNumber (): Promise<number> {
    const wallet = this.getWallet()
    return wallet.provider.getBlockNumber()
  }

  /// ////////////////////////////////////////////
  /// // PISA METHODS

  private getPisaClient (): PisaClient {
    if (!this.pisaClient) {
      throw new Error('No Pisa Client was provided')
    }
    return this.pisaClient
  }

  private async pisaRestore (): Promise<any[]> {
    const pisaClient = this.getPisaClient()
    const signer = this.getWalletSigner()
    const address = this.getWalletAddress()
    const blockNumber = await this.getBlockNumber()
    const backupState = await pisaClient.restore(signer, address, blockNumber)
    return backupState.map((b: any) =>
      safeJsonParse(toUtf8String(arrayify(b.data)))
    )
  }

  private async pisaBackup (pair: StorePair): Promise<void> {
    const pisaClient = this.getPisaClient()
    const signer = this.getWalletSigner()
    const address = this.getWalletAddress()
    const blockNumber = await this.getBlockNumber()
    const data = hexlify(toUtf8Bytes(safeJsonStringify(pair)))
    const id = keccak256(toUtf8Bytes(pair.path))
    const nonce = pair.value.freeBalanceAppInstance.latestVersionNumber
    try {
      await pisaClient.backUp(signer, address, data, blockNumber, id, nonce)
    } catch (e) {
      // If we get a 'nonce too low' error, we'll log & ignore bc sometimes expected. See:
      // see: https://github.com/counterfactual/monorepo/issues/2497
      if (
        e.message &&
        e.message.match(/Appointment already exists and nonce too low./)
      ) {
        console.warn(e)
      } else {
        console.error(e)
      }
    }
  }
}
