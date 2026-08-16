import * as a from "valibot"
import { createResult, createResultError, type Result } from "#result"

export type CliEnvironment = Readonly<Record<string, string | undefined>>

export function cliAccessTokenResolve(accessToken?: string, environment: CliEnvironment = process.env): Result<string> {
  const op = "cliAccessTokenResolve"
  const token = accessToken ?? environment.LEXWARE_TOKEN ?? environment.LEXWARE_ACCESS_TOKEN
  const parsed = a.safeParse(a.pipe(a.string(), a.minLength(1)), token)
  if (!parsed.success) {
    return createResultError(op, "An access token is required via --access-token or LEXWARE_TOKEN")
  }

  return createResult(parsed.output)
}
