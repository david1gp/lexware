import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareErrorData } from "../../shared/lexwareErrorData.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"
import { type QuotationListInput, quotationListInputSchema } from "../schema/quotationSchemas.js"

export async function quotationList(
  client: LexwareClient,
  input: QuotationListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "quotationList"
  const r = a.safeParse(quotationListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    path: "/v1/quotations",
    query: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
