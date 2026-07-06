import * as a from "valibot"
import { lexwareLineItemSchema } from "../shared/lexwareSchemas.js"

export const invoiceBodySchema = a.looseObject({
  title: a.optional(a.string()),
  introduction: a.optional(a.string()),
  remark: a.optional(a.string()),
  voucherDate: a.optional(a.string()),
  address: a.optional(a.unknown()),
  lineItems: a.array(lexwareLineItemSchema),
  totalPrice: a.optional(a.unknown()),
  taxConditions: a.optional(a.unknown()),
  shippingConditions: a.optional(a.unknown()),
  paymentConditions: a.optional(a.unknown()),
  xRechnung: a.optional(a.unknown()),
})

export const invoiceCreateInputSchema = a.object({
  invoice: invoiceBodySchema,
  finalize: a.optional(a.boolean()),
})

export const invoiceListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
})

export type InvoiceBody = a.InferOutput<typeof invoiceBodySchema>
export type InvoiceCreateInput = a.InferOutput<typeof invoiceCreateInputSchema>
export type InvoiceListInput = a.InferOutput<typeof invoiceListInputSchema>
