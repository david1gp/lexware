import * as a from "valibot"
import { lexwareLineItemSchema } from "../shared/lexwareSchemas.js"

export const voucherBodySchema = a.looseObject({
  title: a.optional(a.string()),
  voucherDate: a.optional(a.string()),
  address: a.optional(a.unknown()),
  lineItems: a.array(lexwareLineItemSchema),
})

export const voucherListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
})

export type VoucherBody = a.InferOutput<typeof voucherBodySchema>
export type VoucherListInput = a.InferOutput<typeof voucherListInputSchema>
