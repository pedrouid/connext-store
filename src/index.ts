import { getPartialMatches } from "./utils";
import { DEFAULT_STORE_PREFIX, DEFAULT_STORE_SEPERATOR } from "./constants";
import { getItem, setItem, getEntries } from "./local";
import { StorePair, StoreFactoryOptions } from "./types";
import { pisaBackup, pisaRestore } from "./pisa";

export const storeFactory = (options?: StoreFactoryOptions) => {
  const _options = options || { pisaClient: null, wallet: null };
  const { pisaClient, wallet } = _options;

  async function get(path: string) {
    const raw = getItem(`${path}`);
    return getPartialMatches(path) || raw;
  }

  async function set(pairs: StorePair[], shouldBackup?: boolean) {
    for (const pair of pairs) {
      setItem(pair.path, pair.value);

      if (
        shouldBackup &&
        pisaClient &&
        pair.path.match(/\/xpub.*\/channel\/0x[0-9a-fA-F]{40}/) &&
        pair.value.freeBalanceAppInstance
      ) {
        await pisaBackup(pair, pisaClient, wallet);
      }
    }
  }

  async function reset() {
    // TODO: Should we also scrub legacy channel prefixes?
    const channelPrefix = `${DEFAULT_STORE_PREFIX}${DEFAULT_STORE_SEPERATOR}`;
    // get all keys in local storage that match prefix
    getEntries().forEach(([key, value]) => {
      if (key.includes(channelPrefix)) {
        console.log(`removing item: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  async function restore() {
    return pisaClient ? await pisaRestore(pisaClient, wallet) : [];
  }

  return {
    get,
    set,
    reset,
    restore
  };
};
