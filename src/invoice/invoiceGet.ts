import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import {
  type LexwareUnknownResponse,
  lexwareIdInputSchema,
  lexwareUnknownResponseSchema,
} from "../shared/lexwareSchemas.js"

export async function invoiceGet(client: LexwareClient, id: string): PromiseResult<LexwareUnknownResponse> {
  const op = "invoiceGet"
  const r = a.safeParse(lexwareIdInputSchema, { id })
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(id))
  return lexwareRequest(client, {
    op,
    path: `/v1/invoices/${encodeURIComponent(r.output.id)}`,
    schema: lexwareUnknownResponseSchema,
  })
}
