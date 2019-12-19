import Storage from 'react-native-storage'

function setupStore (storage: Storage) {
  const store = new Storage({
    defaultExpires: null,
    enableCache: true,
    size: 10000,
    storageBackend: storage
  })
  return store
}

class InternalStore {
  private _store: Storage | undefined

  constructor (storage: Storage) {
    this._store = setupStore(storage)
  }

  getStore (): Storage {
    if (!this._store) {
      throw new Error('Store is not available')
    }
    return this._store
  }

  async getItem (key: string): Promise<string | null> {
    const store = this.getStore()
    let result = await store.load({ key })
    return result
  }

  async setItem (key: string, data: any): Promise<void> {
    const store = this.getStore()
    await store.save({ key, data })
  }

  removeItem (key: string): void {
    const store = this.getStore()
    store.remove({ key })
  }

  getKeys (): string[] {
    const store = this.getStore()
    return Object.keys(store)
  }

  getEntries (): [string, any][] {
    const store = this.getStore()
    return Object.entries(store)
  }
}

export default InternalStore
