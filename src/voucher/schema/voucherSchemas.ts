import * as a from "valibot"
import {
  lexwareAddressSchema,
  lexwareDateTimeSchema,
  lexwareIdSchema,
  lexwareLineItemBaseSchema,
  lexwareNonNegativeNumberSchema,
  lexwarePercentageSchema,
  lexwareUnitPriceSchema,
} from "../../shared/lexwareSchemas.js"

export const voucherAddressSchema = lexwareAddressSchema

export const voucherUnitPriceSchema = lexwareUnitPriceSchema

export const voucherLineItemSchema = a.looseObject({
  ...lexwareLineItemBaseSchema.entries,
  quantity: a.optional(lexwareNonNegativeNumberSchema),
  unitPrice: a.optional(voucherUnitPriceSchema),
  discountPercentage: a.optional(lexwarePercentageSchema),
  lineItemAmount: a.optional(lexwareNonNegativeNumberSchema),
})

export const voucherBodySchema = a.looseObject({
  title: a.optional(a.string()),
  voucherDate: a.optional(lexwareDateTimeSchema),
  address: a.optional(voucherAddressSchema),
  lineItems: a.pipe(a.array(voucherLineItemSchema), a.minLength(1), a.maxLength(300)),
})

export const voucherCreateInputSchema = voucherBodySchema

export const voucherUpdateInputSchema = a.object({
  id: lexwareIdSchema,
  voucher: voucherBodySchema,
})

export const voucherListInputEntries = {
  page: a.number(),
  status: a.string(),
}

export const voucherListInputSchema = a.object({
  page: a.optional(voucherListInputEntries.page),
  status: a.optional(voucherListInputEntries.status),
})

export type VoucherAddress = a.InferOutput<typeof voucherAddressSchema>
export type VoucherBody = a.InferOutput<typeof voucherBodySchema>
export type VoucherCreateInput = a.InferOutput<typeof voucherCreateInputSchema>
export type VoucherLineItem = a.InferOutput<typeof voucherLineItemSchema>
export type VoucherListInput = a.InferOutput<typeof voucherListInputSchema>
export type VoucherUnitPrice = a.InferOutput<typeof voucherUnitPriceSchema>
export type VoucherUpdateInput = a.InferOutput<typeof voucherUpdateInputSchema>
