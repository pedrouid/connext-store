import { safeJsonParse, safeJsonStringify } from './utils'

class InternalStore {
  private _store: Storage

  constructor (storage: Storage) {
    this._store = storage
  }

  getStore (): Storage {
    if (!this._store) {
      throw new Error('Store is not available')
    }
    return this._store
  }

  getItem (path: string): string | null {
    const store = this.getStore()
    let result = store.getItem(`${path}`)
    if (result) {
      result = safeJsonParse(result)
    }
    return result
  }

  setItem (path: string, value: any): void {
    const store = this.getStore()
    store.setItem(`${path}`, safeJsonStringify(value))
  }

  removeItem (path: string): void {
    const store = this.getStore()
    store.removeItem(`${path}`)
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
