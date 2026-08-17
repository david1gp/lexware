import type { PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"

export async function dunningGet(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "dunningGet"
  return lexwareRequest(client, {
    op,
    path: `/v1/dunnings/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
