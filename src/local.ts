import { safeJsonParse, safeJsonStringify } from "./utils";

let local: Storage;

if (
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined"
) {
  local = window.localStorage;
}

export async function verifyStore(): Promise<void> {
  if (!local) {
    throw new Error("localStorage is not available in window");
  }
}

export async function getStore(): Promise<Storage> {
  verifyStore();
  return local;
}

export async function getItem(path: string): Promise<string | null> {
  const store = await getStore();
  let result = store.getItem(`${path}`);
  if (result) {
    result = safeJsonParse(result);
  }
  return result;
}

export async function setItem(path: string, value: any): Promise<void> {
  const store = await getStore();
  store.setItem(`${path}`, safeJsonStringify(value));
}

export async function getKeys(): Promise<string[]> {
  const store = await getStore();
  return Object.keys(store);
}

export async function getEntries(): Promise<[string, any][]> {
  const store = await getStore();
  return Object.entries(store);
}
