import { utils } from 'ethers'
import { StorageWrapper } from './types'
import AsyncStorageWrapper from './asyncStorage'
import LocalStorageWrapper from './localStorage'

export function arrayify (
  value: string | ArrayLike<number> | utils.Hexable
): Uint8Array {
  return utils.arrayify(value)
}

export function hexlify (
  value: string | number | ArrayLike<number> | utils.Hexable
): string {
  return utils.hexlify(value)
}

export function keccak256 (data: utils.Arrayish): string {
  return utils.keccak256(data)
}

export function toUtf8Bytes (
  str: string,
  form?: utils.UnicodeNormalizationForm | undefined
): Uint8Array {
  return utils.toUtf8Bytes(str, form)
}

export function toUtf8String (
  bytes: utils.Arrayish,
  ignoreErrors?: boolean | undefined
): string {
  return utils.toUtf8String(bytes, ignoreErrors)
}

export function safeJsonParse (value: any): any {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function safeJsonStringify (value: any): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}

export function isAsyncStorage (storage: any) {
  const key = '__react_native_storage_test'
  const promiseTest = storage.setItem(key, 'test')
  storage.removeItem(key)
  return !!(
    typeof promiseTest !== 'undefined' &&
    typeof promiseTest.then !== 'undefined' &&
    typeof storage.length === 'undefined'
  )
}

export function wrapAsyncStorage (asyncStorage: any): StorageWrapper {
  const storage: StorageWrapper = new AsyncStorageWrapper(asyncStorage)
  return storage
}

export function wrapLocalStorage (localStorage: any): StorageWrapper {
  const storage: StorageWrapper = new LocalStorageWrapper(localStorage)
  return storage
}

export function parseStorage (storage: any): StorageWrapper {
  return isAsyncStorage(storage)
    ? wrapAsyncStorage(storage)
    : wrapLocalStorage(storage)
}
