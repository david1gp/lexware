import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type QuotationBody, quotationBodySchema } from "./quotationSchemas.js"

export async function quotationUpdate(
  client: LexwareClient,
  id: string,
  input: QuotationBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "quotationUpdate"
  const r = a.safeParse(quotationBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/quotations/${encodeURIComponent(id)}`,
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
