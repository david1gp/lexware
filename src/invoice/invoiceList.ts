import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { invoiceListInputSchema, type InvoiceListInput } from "./invoiceSchemas.js"

export async function invoiceList(
  client: LexwareClient,
  input: InvoiceListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "invoiceList"
  const r = a.safeParse(invoiceListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, { op, path: "/v1/invoices", query: r.output, schema: lexwareUnknownResponseSchema })
}
