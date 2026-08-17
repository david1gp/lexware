import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type InvoiceBody, invoiceUpdateInputSchema } from "./invoiceSchemas.js"

export async function invoiceUpdate(
  client: LexwareClient,
  id: string,
  input: InvoiceBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "invoiceUpdate"
  const r = a.safeParse(invoiceUpdateInputSchema, { id, invoice: input })
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/invoice/${encodeURIComponent(r.output.id)}`,
    body: r.output.invoice,
    schema: lexwareUnknownResponseSchema,
  })
}
