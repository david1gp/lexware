import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { quotationBodySchema, type QuotationBody } from "./quotationSchemas.js"

export async function quotationCreate(
  client: LexwareClient,
  input: QuotationBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "quotationCreate"
  const r = a.safeParse(quotationBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "POST",
    path: "/v1/quotations",
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
