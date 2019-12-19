import { ethers } from "ethers";
import { PisaClient as IPisaClient } from "pisa-client";

export type PisaClient = IPisaClient;
export type Wallet = ethers.Wallet;

export interface StorePair {
  path: string;
  value: any;
}

export type Signer = (digest: any) => Promise<string>;

export interface InternalStore {
  verifyStore(): Promise<void>;
  getStore(): Promise<Storage>;
  getItem(path: string): Promise<string | null>;
  setItem(path: string, value: any): Promise<void>;
  getKeys(): Promise<string[]>;
  getEntries(): Promise<[string, any][]>;
}

export interface StoreFactoryOptions {
  pisaClient?: IPisaClient | null;
  prefix?: string;
  separator?: string;
  store?: InternalStore;
  wallet?: Wallet | null;
}
