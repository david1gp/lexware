import { type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"

export async function voucherGet(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "voucherGet"
  return lexwareRequest(client, {
    op,
    path: `/v1/vouchers/${encodeURIComponent(id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
