import type { PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"

export async function orderConfirmationDelete(
  client: LexwareClient,
  id: string,
): PromiseResult<LexwareUnknownResponse> {
  const op = "orderConfirmationDelete"
  return lexwareRequest(client, {
    op,
    method: "DELETE",
    path: `/v1/order-confirmations/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
