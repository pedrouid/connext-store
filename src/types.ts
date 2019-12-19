import { ethers } from "ethers";
import { PisaClient as IPisaClient } from "pisa-client";

export type PisaClient = IPisaClient;
export type Wallet = ethers.Wallet;

export interface StorePair {
  path: string;
  value: any;
}

export interface InternalStore {
  verifyStore(): void;
  getStore(): Storage;
  getItem(path: string): string | null;
  setItem(path: string, value: any): void;
  getKeys(): string[];
  getEntries(): [string, any][];
}

export interface StoreFactoryOptions {
  prefix: string;
  separator: string;
  pisaClient: IPisaClient | null;
  wallet: Wallet | null;
}
