import type { Result } from "#result"
import { cliJsonStringify } from "./cliJsonStringify.js"

export function cliResultSerialize<T>(result: Result<T>): string {
  return cliJsonStringify(result)
}
