import { createResult, createResultError, type Result } from "#result"
import * as a from "valibot"
import type { LexwareClient, LexwareFetch } from "./LexwareClient.js"

const lexwareClientCreateInputSchema = a.object({
  accessToken: a.pipe(a.string(), a.minLength(1)),
  baseUrl: a.optional(a.pipe(a.string(), a.url())),
  fetch: a.optional(a.unknown()),
})

export type LexwareClientCreateInput = {
  accessToken: string
  baseUrl?: string
  fetch?: LexwareFetch
}

export function lexwareClientCreate(input: LexwareClientCreateInput): Result<LexwareClient> {
  const op = "lexwareClientCreate"
  const r = a.safeParse(lexwareClientCreateInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), JSON.stringify(input))

  const fetchFn = input.fetch ?? globalThis.fetch
  if (typeof fetchFn !== "function") return createResultError(op, "fetch must be a function", JSON.stringify(input))

  return createResult({
    accessToken: r.output.accessToken,
    baseUrl: r.output.baseUrl ?? "https://api.lexware.io",
    fetch: fetchFn as LexwareFetch,
  })
}
