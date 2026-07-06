import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type InvoiceBody, invoiceBodySchema } from "./invoiceSchemas.js"

export async function invoiceUpdate(
  client: LexwareClient,
  id: string,
  input: InvoiceBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "invoiceUpdate"
  const r = a.safeParse(invoiceBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/invoice/${encodeURIComponent(id)}`,
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
