import { ethers } from 'ethers'
import { PisaClient as IPisaClient } from 'pisa-client'
import Storage from 'react-native-storage'

export type PisaClient = IPisaClient
export type Wallet = ethers.Wallet

export interface StorePair {
  path: string
  value: any
}

export type Signer = (digest: any) => Promise<string>

export interface StoreFactoryOptions {
  pisaClient?: IPisaClient | null
  prefix?: string
  separator?: string
  storage: Storage
  wallet?: Wallet | null
}
