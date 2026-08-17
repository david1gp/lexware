import type { PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"

export async function contactGet(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "contactGet"
  return lexwareRequest(client, {
    op,
    path: `/v1/contacts/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
