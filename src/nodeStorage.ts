import fs from 'fs'
import { AsyncStorage } from './types'
import { DEFAULT_NODE_FILE_EXTENSION } from './constants'

export function fsRead (path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

export function fsWrite (path: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function fsUnlink (path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export class NodeStorage implements AsyncStorage {
  private fileExtension: string = DEFAULT_NODE_FILE_EXTENSION

  constructor (fileExtension?: string) {
    this.fileExtension = fileExtension || DEFAULT_NODE_FILE_EXTENSION
  }

  getFilePath (key: string) {
    return `${key}${this.fileExtension}`
  }
  async setItem (key: string, data: any) {
    const path = this.getFilePath(key)
    return fsWrite(path, data)
  }
  async getItem (key: string) {
    const path = this.getFilePath(key)
    return fsRead(path)
  }
  async removeItem (key: string) {
    const path = this.getFilePath(key)
    return fsUnlink(path)
  }
}
