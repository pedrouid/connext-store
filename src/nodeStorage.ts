import fs from 'fs'
import { AsyncStorage } from './types'

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
  async setItem (key: string, data: any) {
    return fsWrite(key, data)
  }
  async getItem (key: string) {
    return fsRead(key)
  }
  async removeItem (key: string) {
    return fsUnlink(key)
  }
}
