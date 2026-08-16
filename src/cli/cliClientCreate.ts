import * as a from "valibot"
import { createResultError, type Result } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareClientCreate } from "../shared/lexwareClientCreate.js"
import { type CliEnvironment, cliAccessTokenResolve } from "./cliAccessTokenResolve.js"
import { cliInputValidate } from "./cliInputValidate.js"

const cliClientInputSchema = a.object({
  accessToken: a.optional(a.string()),
  baseUrl: a.optional(a.string()),
})

export type CliClientInput = a.InferOutput<typeof cliClientInputSchema>

export function cliClientCreate(input: CliClientInput, environment?: CliEnvironment): Result<LexwareClient> {
  const inputResult = cliInputValidate(cliClientInputSchema, input, "cliClientCreate")
  if (!inputResult.success) return inputResult

  const tokenResult = cliAccessTokenResolve(inputResult.data.accessToken, environment)
  if (!tokenResult.success) return tokenResult

  const clientResult = lexwareClientCreate({
    accessToken: tokenResult.data,
    baseUrl: inputResult.data.baseUrl,
  })
  if (!clientResult.success)
    return createResultError("cliClientCreate", clientResult.errorMessage, clientResult.errorData)

  return clientResult
}
