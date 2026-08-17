import type { PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"

export async function voucherDelete(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "voucherDelete"
  return lexwareRequest(client, {
    op,
    method: "DELETE",
    path: `/v1/vouchers/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
