import {
  DEFAULT_STORE_SEPERATOR,
  PATH_CHANNEL,
  PATH_PROPOSED_APP_INSTANCE_ID
} from "./constants";
import { getItem, getKeys } from "./local";

export {
  arrayify,
  hexlify,
  keccak256,
  toUtf8Bytes,
  toUtf8String
} from "ethers/utils";

export function safeJsonParse(value: any) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function safeJsonStringify(value: any) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function getPartialMatches(path: string) {
  // Handle partial matches so the following line works -.-
  // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
  if (
    path.endsWith(PATH_CHANNEL) ||
    path.endsWith(PATH_PROPOSED_APP_INSTANCE_ID)
  ) {
    const partialMatches = {};
    for (const k of getKeys()) {
      if (k.includes(`${path}${DEFAULT_STORE_SEPERATOR}`)) {
        partialMatches[
          k.replace(`${path}${DEFAULT_STORE_SEPERATOR}`, "")
        ] = getItem(k);
      }
    }
    return partialMatches;
  }
  return null;
}
