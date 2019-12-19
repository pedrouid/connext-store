import { safeJsonParse, safeJsonStringify } from "./utils";

let local: Storage;

if (
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined"
) {
  local = window.localStorage;
}

export function verifyStore(): void {
  if (!local) {
    throw new Error("localStorage is not available in window");
  }
}

export function getStore(): Storage {
  verifyStore();
  return local;
}

export function getItem(path: string): string | null {
  const store = getStore();
  let result = store.getItem(`${path}`);
  if (result) {
    result = safeJsonParse(result);
  }
  return result;
}

export function setItem(path: string, value: any): void {
  const store = getStore();
  store.setItem(`${path}`, safeJsonStringify(value));
}

export function getKeys(): string[] {
  const store = getStore();
  return Object.keys(store);
}

export function getEntries(): [string, any][] {
  const store = getStore();
  return Object.entries(store);
}
