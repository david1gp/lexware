import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type VoucherListInput, voucherListInputSchema } from "./voucherSchemas.js"

export async function voucherList(
  client: LexwareClient,
  input: VoucherListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "voucherList"
  const r = a.safeParse(voucherListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    path: "/v1/vouchers",
    query: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
