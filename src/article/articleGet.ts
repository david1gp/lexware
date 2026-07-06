import type { PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"

export async function articleGet(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "articleGet"
  return lexwareRequest(client, {
    op,
    path: `/v1/articles/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
