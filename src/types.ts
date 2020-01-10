import { ethers } from 'ethers'
import { PisaClient as IPisaClient } from 'pisa-client'

export type PisaClient = IPisaClient
export type Wallet = ethers.Wallet

export type InitCallback = (data: AsyncStorageData) => void

export interface AsyncStorageData {
  [key: string]: any
}

export interface StorePair {
  path: string
  value: any
}

export type Signer = (digest: any) => Promise<string>

export interface StoreFactoryOptions {
  pisaClient?: IPisaClient | null
  prefix?: string
  separator?: string
  wallet?: Wallet | null
}

export interface StorageWrapper {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  getKeys(): Promise<string[]>
  getEntries(): Promise<[string, any][]>
  clear(prefix: string): Promise<void>
}

// Source: https://github.com/react-native-community/async-storage/blob/LEGACY/types/index.d.ts
export interface AsyncStorage {
  getItem(
    key: string,
    callback?: (error?: Error, result?: string) => void
  ): Promise<string | null>
  setItem(
    key: string,
    value: string,
    callback?: (error?: Error) => void
  ): Promise<void>
  removeItem(key: string, callback?: (error?: Error) => void): Promise<void>
  mergeItem(
    key: string,
    value: string,
    callback?: (error?: Error) => void
  ): Promise<void>
  clear(callback?: (error?: Error) => void): Promise<void>
  getAllKeys(
    callback?: (error?: Error, keys?: string[]) => void
  ): Promise<string[]>

  multiSet(
    keyValuePairs: string[][],
    callback?: (errors?: Error[]) => void
  ): Promise<void>
  multiRemove(
    keys: string[],
    callback?: (errors?: Error[]) => void
  ): Promise<void>
  multiMerge(
    keyValuePairs: string[][],
    callback?: (errors?: Error[]) => void
  ): Promise<void>
  multiGet(
    keys: string[],
    callback?: (errors?: Error[], result?: [string, string | null][]) => void
  ): Promise<[string, string | null][]>
}
