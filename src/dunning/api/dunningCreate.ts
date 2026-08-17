import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../../shared/LexwareClient.js"
import { lexwareErrorData } from "../../shared/lexwareErrorData.js"
import { lexwareRequest } from "../../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../../shared/lexwareSchemas.js"
import { type DunningCreateInput, dunningCreateInputSchema } from "../schema/dunningSchemas.js"

export async function dunningCreate(
  client: LexwareClient,
  input: DunningCreateInput,
): PromiseResult<LexwareUnknownResponse> {
  const op = "dunningCreate"
  const r = a.safeParse(dunningCreateInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  const invoice = await lexwareRequest(client, {
    op,
    path: `/v1/invoices/${encodeURIComponent(r.output.precedingSalesVoucherId)}`,
    schema: lexwareUnknownResponseSchema,
  })
  if (!invoice.success) return invoice

  const baseInvoice =
    typeof invoice.data === "object" && invoice.data !== null ? (invoice.data as Record<string, any>) : {}
  const baseLineItems = Array.isArray(baseInvoice.lineItems) ? baseInvoice.lineItems : []
  const body = {
    title: r.output.title,
    voucherDate: r.output.voucherDate,
    address: baseInvoice.address,
    lineItems: [...baseLineItems, ...(r.output.extraLineItems ?? [])],
    totalPrice: {
      currency: r.output.currency ?? (baseInvoice.totalPrice as Record<string, unknown> | undefined)?.currency ?? "EUR",
      totalNetAmount: r.output.totalNetAmount ?? 0,
    },
    taxConditions: baseInvoice.taxConditions ?? { taxType: "net" },
    shippingConditions: baseInvoice.shippingConditions,
  }

  return lexwareRequest(client, {
    op,
    method: "POST",
    path: "/v1/dunnings",
    query: {
      precedingSalesVoucherId: r.output.precedingSalesVoucherId,
      finalize: r.output.finalize,
    },
    body,
    schema: lexwareUnknownResponseSchema,
  })
}
