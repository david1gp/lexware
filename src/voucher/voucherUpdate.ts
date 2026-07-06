import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type VoucherBody, voucherBodySchema } from "./voucherSchemas.js"

export async function voucherUpdate(
  client: LexwareClient,
  id: string,
  input: VoucherBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "voucherUpdate"
  const r = a.safeParse(voucherBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/voucher/${encodeURIComponent(id)}`,
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
