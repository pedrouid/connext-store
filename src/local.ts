import { safeJsonParse, safeJsonStringify } from "./utils";

export let _local: Storage;

if (
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined"
) {
  _local = window.localStorage;
}

export function verifyLocalStorage() {
  if (!_local) {
    throw new Error("localStorage is not available in window");
  }
}

export function getLocalStorage() {
  verifyLocalStorage();
  return _local;
}

export function getItem(path: string) {
  const local = getLocalStorage();
  let result = local.getItem(`${path}`);
  if (result) {
    result = safeJsonParse(result);
  }
  return result;
}

export function setItem(path: string, value: any) {
  const local = getLocalStorage();
  local.setItem(`${path}`, safeJsonStringify(value));
}

export function getKeys() {
  const local = getLocalStorage();
  return Object.keys(local);
}

export function getEntries() {
  const local = getLocalStorage();
  return Object.entries(local);
}
