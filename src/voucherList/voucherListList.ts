import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { voucherListListInputSchema, type VoucherListListInput } from "./voucherListSchemas.js"

export async function voucherListList(
  client: LexwareClient,
  input: VoucherListListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "voucherListList"
  const r = a.safeParse(voucherListListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, { op, path: "/v1/voucherlist", query: r.output, schema: lexwareUnknownResponseSchema })
}
