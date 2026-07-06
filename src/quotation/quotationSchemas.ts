import * as a from "valibot"
import { lexwareLineItemSchema } from "../shared/lexwareSchemas.js"

export const quotationBodySchema = a.looseObject({
  title: a.optional(a.string()),
  introduction: a.optional(a.string()),
  remark: a.optional(a.string()),
  voucherDate: a.optional(a.string()),
  expirationDate: a.optional(a.string()),
  address: a.optional(a.unknown()),
  lineItems: a.optional(a.array(lexwareLineItemSchema)),
  totalPrice: a.optional(a.unknown()),
  taxConditions: a.optional(a.unknown()),
  paymentConditions: a.optional(a.unknown()),
})

export const quotationListInputSchema = a.object({ page: a.optional(a.number()) })

export type QuotationBody = a.InferOutput<typeof quotationBodySchema>
export type QuotationListInput = a.InferOutput<typeof quotationListInputSchema>
