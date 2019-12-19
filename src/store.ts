import { safeJsonParse, safeJsonStringify } from './utils'

function setupStore (storage: Storage) {
  return storage
}

class InternalStore {
  private _store: Storage | undefined

  constructor (storage: Storage) {
    this._store = setupStore(storage)
  }

  async getStore (): Promise<Storage> {
    if (!this._store) {
      throw new Error('Store is not available')
    }
    return this._store
  }

  async getItem (path: string): Promise<string | null> {
    const store = await this.getStore()
    let result = store.getItem(`${path}`)
    if (result) {
      result = safeJsonParse(result)
    }
    return result
  }

  async setItem (path: string, value: any): Promise<void> {
    const store = await this.getStore()
    store.setItem(`${path}`, safeJsonStringify(value))
  }

  async getKeys (): Promise<string[]> {
    const store = await this.getStore()
    return Object.keys(store)
  }

  async getEntries (): Promise<[string, any][]> {
    const store = await this.getStore()
    return Object.entries(store)
  }
}

export default InternalStore
