import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareErrorData } from "../../shared/lexwareErrorData.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"
import { type QuotationBody, quotationUpdateInputSchema } from "../schema/quotationSchemas.js"

export async function quotationUpdate(
  client: LexwareClient,
  id: string,
  input: QuotationBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "quotationUpdate"
  const r = a.safeParse(quotationUpdateInputSchema, { id, quotation: input })
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/quotations/${encodeURIComponent(r.output.id)}`,
    body: r.output.quotation,
    schema: lexwareUnknownResponseSchema,
  })
}
