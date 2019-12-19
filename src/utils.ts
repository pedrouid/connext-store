import { utils } from 'ethers'

export function arrayify (
  value: string | ArrayLike<number> | utils.Hexable
): Uint8Array {
  return utils.arrayify(value)
}

export function hexlify (
  value: string | number | ArrayLike<number> | utils.Hexable
): string {
  return utils.hexlify(value)
}

export function keccak256 (data: utils.Arrayish): string {
  return utils.keccak256(data)
}

export function toUtf8Bytes (
  str: string,
  form?: utils.UnicodeNormalizationForm | undefined
): Uint8Array {
  return utils.toUtf8Bytes(str, form)
}

export function toUtf8String (
  bytes: utils.Arrayish,
  ignoreErrors?: boolean | undefined
): string {
  return utils.toUtf8String(bytes, ignoreErrors)
}

export function safeJsonParse (value: any): any {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function safeJsonStringify (value: any): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}
