import { REACT_NATIVE_STORE } from './constants'
import { StorageWrapper } from './types'

class AsyncStorageWrapper implements StorageWrapper {
  private asyncStorage: any
  private data: any
  private initializing: boolean = false

  constructor (asyncStorage: any) {
    this.asyncStorage = asyncStorage
    this.init()
  }

  async init (): Promise<void> {
    this.initializing = true
    this.data = await this.asyncStorage.getItem(REACT_NATIVE_STORE)
    this.initializing = false
  }

  async isInitializing (): Promise<void> {
    if (this.initializing) {
      throw new Error('AsyncStorage is still initializing')
    }
  }

  async getItem (key: string): Promise<string | null> {
    this.isInitializing()
    const result = this.data[`${key}`] || null
    return result
  }

  async setItem (key: string, value: string): Promise<void> {
    this.isInitializing()
    this.data[key] = value
    this.persist()
  }

  async removeItem (key: string): Promise<void> {
    this.isInitializing()
    delete this.data[key]
    this.persist()
  }

  async persist (): Promise<void> {
    await this.asyncStorage.setItem(
      REACT_NATIVE_STORE,
      JSON.stringify(this.data)
    )
  }

  async clear (): Promise<void> {
    await this.asyncStorage.removeItem(REACT_NATIVE_STORE)
  }

  async getKeys (): Promise<string[]> {
    return Object.keys(this.data)
  }

  async getEntries (): Promise<[string, any][]> {
    return Object.entries(this.data)
  }
}

export default AsyncStorageWrapper
