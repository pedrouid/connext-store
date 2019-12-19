import {
  arrayify,
  hexlify,
  keccak256,
  toUtf8Bytes,
  toUtf8String,
  safeJsonStringify,
  safeJsonParse
} from "./utils";
import {
  DEFAULT_STORE_PREFIX,
  DEFAULT_STORE_SEPARATOR,
  PATH_CHANNEL,
  PATH_PROPOSED_APP_INSTANCE_ID
} from "./constants";
import { getItem, setItem, getKeys, getEntries } from "./local";
import { StorePair, StoreFactoryOptions, PisaClient, Wallet } from "./types";

export const defaultStoreOptions = {
  prefix: DEFAULT_STORE_PREFIX,
  separator: DEFAULT_STORE_SEPARATOR,
  pisaClient: null,
  wallet: null
};

export class ConnextStore {
  private prefix: string = DEFAULT_STORE_PREFIX;
  private separator: string = DEFAULT_STORE_SEPARATOR;
  private pisaClient: PisaClient | null;
  private wallet: Wallet | null;

  constructor(opts: StoreFactoryOptions = defaultStoreOptions) {
    this.prefix = opts.prefix;
    this.separator = opts.separator;
    this.pisaClient = opts.pisaClient;
    this.wallet = opts.wallet;
  }

  public async get(path: string) {
    const raw = getItem(`${path}`);
    return this.getPartialMatches(path) || raw;
  }

  public async set(pairs: StorePair[], shouldBackup?: boolean) {
    for (const pair of pairs) {
      setItem(pair.path, pair.value);

      if (
        shouldBackup &&
        this.pisaClient &&
        this.wallet &&
        pair.path.match(/\/xpub.*\/channel\/0x[0-9a-fA-F]{40}/) &&
        pair.value.freeBalanceAppInstance
      ) {
        await this.pisaBackup(pair);
      }
    }
  }

  public async reset() {
    // TODO: Should we also scrub legacy channel prefixes?
    const channelPrefix = `${this.prefix}${this.separator}`;
    // get all keys in local storage that match prefix
    getEntries().forEach(([key, value]) => {
      if (key.includes(channelPrefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  public async restore() {
    return this.pisaClient ? await this.pisaRestore() : [];
  }

  ///////////////////////////////////////////////
  ///// PRIVATE METHODS

  private getPartialMatches(path: string) {
    // Handle partial matches so the following line works -.-
    // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
    if (
      path.endsWith(PATH_CHANNEL) ||
      path.endsWith(PATH_PROPOSED_APP_INSTANCE_ID)
    ) {
      const partialMatches = {};
      for (const k of getKeys()) {
        if (k.includes(`${path}${this.separator}`)) {
          partialMatches[k.replace(`${path}${this.separator}`, "")] = getItem(
            k
          );
        }
      }
      return partialMatches;
    }
    return null;
  }

  ///////////////////////////////////////////////
  ///// WALLET METHODS

  private getWallet(): Wallet {
    if (!this.wallet) {
      throw new Error("No Wallet was provided");
    }
    return this.wallet;
  }

  private getWalletSigner() {
    const wallet = this.getWallet();
    return (digest: any) => wallet.signMessage(arrayify(digest));
  }

  private getWalletAddress() {
    const wallet = this.getWallet();
    return wallet.address;
  }

  private async getBlockNumber() {
    const wallet = this.getWallet();
    return await wallet.provider.getBlockNumber();
  }

  ///////////////////////////////////////////////
  ///// PISA METHODS

  private getPisaClient(): PisaClient {
    if (!this.pisaClient) {
      throw new Error("No Pisa Client was provided");
    }
    return this.pisaClient;
  }

  private async pisaRestore() {
    const pisaClient = this.getPisaClient();
    const signer = this.getWalletSigner();
    const address = this.getWalletAddress();
    const blockNumber = await this.getBlockNumber();
    const backupState = await pisaClient.restore(signer, address, blockNumber);
    return backupState.map(b => safeJsonParse(toUtf8String(arrayify(b.data))));
  }

  private async pisaBackup(pair: StorePair) {
    const pisaClient = this.getPisaClient();
    const signer = this.getWalletSigner();
    const address = this.getWalletAddress();
    const blockNumber = await this.getBlockNumber();
    const data = hexlify(toUtf8Bytes(safeJsonStringify(pair)));
    const id = keccak256(toUtf8Bytes(pair.path));
    const nonce = pair.value.freeBalanceAppInstance.latestVersionNumber;
    try {
      await pisaClient.backup(signer, address, data, blockNumber, id, nonce);
    } catch (e) {
      // If we get a "nonce too low" error, we'll log & ignore bc sometimes expected. See:
      // see: https://github.com/counterfactual/monorepo/issues/2497
      if (
        e.message &&
        e.message.match(/Appointment already exists and nonce too low./)
      ) {
        console.warn(e);
      } else {
        console.error(e);
      }
    }
  }
}
