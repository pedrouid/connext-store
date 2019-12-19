import { ethers } from "ethers";
import { PisaClient as IPisaClient } from "pisa-client";

export type PisaClient = IPisaClient;
export type Wallet = ethers.Wallet;

export interface StorePair {
  path: string;
  value: any;
}

export interface StoreFactoryOptions {
  prefix: string;
  separator: string;
  pisaClient: IPisaClient | null;
  wallet: Wallet | null;
}
