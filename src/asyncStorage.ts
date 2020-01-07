import { REACT_NATIVE_STORE } from './constants'
import { StorageWrapper } from './types'
import { safeJsonStringify } from './utils'

class AsyncStorageWrapper implements StorageWrapper {
  private asyncStorage: any
  private data: any
  private initializing: boolean = false
  private initCallbacks: any[] = []

  constructor (asyncStorage: any) {
    this.asyncStorage = asyncStorage
    this.loadData()
  }

  loadData () {
    return new Promise(async (resolve, reject) => {
      if (this.initializing) {
        this.onInit((x: any) => resolve(x))
      } else {
        try {
          this.initializing = true
          const data = await this.fetch()
          this.data = data
          this.initializing = false
          this.triggerInit(data)
          resolve(data)
        } catch (e) {
          this.initializing = false
          reject(e)
        }
      }
    })
  }

  onInit (callback: any) {
    this.initCallbacks.push(callback)
  }

  triggerInit (result: any) {
    if (this.initCallbacks && this.initCallbacks.length) {
      this.initCallbacks.forEach(callback => callback(result))
    }
  }

  async getItem (key: string): Promise<string | null> {
    await this.loadData()
    const result = this.data[`${key}`] || null
    return result
  }

  async setItem (key: string, value: string): Promise<void> {
    await this.loadData()
    this.data[key] = value
    await this.persist()
  }

  async removeItem (key: string): Promise<void> {
    await this.loadData()
    delete this.data[key]
    await this.persist()
  }

  async persist (): Promise<void> {
    await this.asyncStorage.setItem(
      REACT_NATIVE_STORE,
      safeJsonStringify(this.data)
    )
  }

  async fetch (): Promise<any> {
    return (await this.asyncStorage.getItem(REACT_NATIVE_STORE)) || {}
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
