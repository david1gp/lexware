import type { StricliProcess } from "@stricli/core"
import type { Result } from "#result"
import { cliResultSerialize } from "./cliResultSerialize.js"

export function cliResultWrite<T>(process: StricliProcess, result: Result<T>): void {
  const stream = result.success ? process.stdout : process.stderr
  stream.write(`${cliResultSerialize(result)}\n`)
  if (!result.success) process.exitCode = 1
}
