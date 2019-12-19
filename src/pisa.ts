import {
  arrayify,
  hexlify,
  keccak256,
  toUtf8Bytes,
  toUtf8String
} from "./utils";
import { PisaClient, StorePair } from "./types";

export async function pisaRestore(pisaClient: PisaClient, wallet: any) {
  return (await pisaClient.restore(
    (digest: any) => wallet.signMessage(arrayify(digest)),
    wallet.address,
    await wallet.provider.getBlockNumber()
  )).map(b => JSON.parse(toUtf8String(arrayify(b.data))));
}

export async function pisaBackup(
  pair: StorePair,
  pisaClient: PisaClient,
  wallet: any
) {
  try {
    console.log(`Backing up store value at path ${pair.path}`);
    await pisaClient.backUp(
      digest => wallet.signMessage(arrayify(digest)),
      wallet.address,
      hexlify(toUtf8Bytes(JSON.stringify(pair))),
      await wallet.provider.getBlockNumber(),
      keccak256(toUtf8Bytes(pair.path)),
      pair.value.freeBalanceAppInstance.latestVersionNumber
    );
  } catch (e) {
    // If we get a "nonce too low" error, we'll log & ignore bc sometimes expected. See:
    // see: https://github.com/counterfactual/monorepo/issues/2497
    if (
      e.message &&
      e.message.match(/Appointment already exists and nonce too low./)
    ) {
      console.warn(e);
    } else {
      console.error(e);
    }
  }
}
