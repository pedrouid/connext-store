export {
  arrayify,
  hexlify,
  keccak256,
  toUtf8Bytes,
  toUtf8String
} from "ethers/utils";

export function safeJsonParse(value: any): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function safeJsonStringify(value: any): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}
