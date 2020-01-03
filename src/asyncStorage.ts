import { REACT_NATIVE_STORE } from './constants'

class AsyncStorageWrapper implements Storage {
  private asyncStorage: any
  private data: any
  private initializing: boolean = false

  constructor (asyncStorage: any) {
    this.asyncStorage = asyncStorage
    this.init()
  }

  get length () {
    return this.data.length
  }

  async init (): Promise<void> {
    this.initializing = true
    this.data = await this.asyncStorage.getItem(REACT_NATIVE_STORE)
    this.initializing = false
  }

  isInitializing (): void {
    if (this.initializing) {
      throw new Error('AsyncStorage is still initializing')
    }
  }

  getItem (key: string): string | null {
    this.isInitializing()
    const result = this.data[`${key}`] || null
    return result
  }

  setItem (key: string, value: string): void {
    this.isInitializing()
    this.data[key] = value
    this.persist()
  }

  removeItem (key: string): void {
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

  clear = () => this.asyncStorage.removeItem(REACT_NATIVE_STORE)

  key (index: number): string | null {
    this.isInitializing()
    const result = this.data[index] || null
    return result
  }
}

export default AsyncStorageWrapper
