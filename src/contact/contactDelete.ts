import type { PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"

export async function contactDelete(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "contactDelete"
  return lexwareRequest(client, {
    op,
    method: "DELETE",
    path: `/v1/contacts/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
