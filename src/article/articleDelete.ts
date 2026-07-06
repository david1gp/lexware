import { type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"

export async function articleDelete(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "articleDelete"
  return lexwareRequest(client, {
    op,
    method: "DELETE",
    path: `/v1/articles/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
