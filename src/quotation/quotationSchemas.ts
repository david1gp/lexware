import * as a from "valibot"
import {
  lexwareAddressSchema,
  lexwareCurrencySchema,
  lexwareDateTimeSchema,
  lexwareIdInputSchema,
  lexwareIdSchema,
  lexwareLineItemTypeSchema,
  lexwareNonNegativeNumberSchema,
  lexwarePaymentConditionsSchema,
  lexwarePaymentDiscountConditionsSchema,
  lexwarePercentageSchema,
  lexwareTaxConditionsSchema,
  lexwareTaxSubTypeSchema,
  lexwareTaxTypeSchema,
  lexwareTotalPriceSchema,
  lexwareUnitPriceSchema,
} from "../shared/lexwareSchemas.js"

export const quotationLanguageSchema = a.picklist(["de", "en"])
export const quotationCurrencySchema = lexwareCurrencySchema
export const quotationLineItemTypeSchema = lexwareLineItemTypeSchema
export const quotationTaxTypeSchema = a.union([lexwareTaxTypeSchema, a.literal("photovoltaicEquipment")])
export const quotationTaxSubTypeSchema = lexwareTaxSubTypeSchema

export const quotationAddressSchema = lexwareAddressSchema
export const quotationDateTimeSchema = lexwareDateTimeSchema
export const quotationUnitPriceSchema = lexwareUnitPriceSchema
export const quotationTotalPriceSchema = lexwareTotalPriceSchema
export const quotationPaymentConditionsSchema = lexwarePaymentConditionsSchema
export const quotationPaymentDiscountConditionsSchema = lexwarePaymentDiscountConditionsSchema

export const quotationSubItemSchema = a.pipe(
  a.object({
    id: a.optional(lexwareIdSchema),
    type: quotationLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(lexwareNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(quotationUnitPriceSchema),
    discountPercentage: a.optional(lexwarePercentageSchema),
    lineItemAmount: a.optional(lexwareNonNegativeNumberSchema),
    alternative: a.literal(true),
  }),
  a.check((item) => {
    if (item.type === "text") return true

    return (
      item.quantity !== undefined &&
      item.unitName !== undefined &&
      item.unitName.length > 0 &&
      item.unitPrice !== undefined &&
      (item.type === "custom" || item.id !== undefined)
    )
  }, "subitems require alternative=true and the fields required by their type"),
)

export const quotationLineItemSchema = a.pipe(
  a.object({
    id: a.optional(lexwareIdSchema),
    type: quotationLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(lexwareNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(quotationUnitPriceSchema),
    discountPercentage: a.optional(lexwarePercentageSchema),
    lineItemAmount: a.optional(lexwareNonNegativeNumberSchema),
    subItems: a.optional(a.pipe(a.array(quotationSubItemSchema), a.maxLength(300))),
    optional: a.optional(a.boolean()),
    alternative: a.optional(a.boolean()),
  }),
  a.check((item) => {
    if (item.type === "text") return true

    return (
      item.quantity !== undefined &&
      item.unitName !== undefined &&
      item.unitName.length > 0 &&
      item.unitPrice !== undefined &&
      (item.type === "custom" || item.id !== undefined)
    )
  }, "custom, material, and service line items require quantity, unitName, and unitPrice; material and service also require id"),
)

export const quotationTaxConditionsSchema = a.looseObject({
  ...lexwareTaxConditionsSchema.entries,
  taxType: quotationTaxTypeSchema,
})

const quotationVatFreeTaxTypes = new Set([
  "vatfree",
  "intraCommunitySupply",
  "constructionService13b",
  "externalService13b",
  "thirdPartyCountryService",
  "thirdPartyCountryDelivery",
  "photovoltaicEquipment",
])

function quotationLineItemsMatchTaxConditions(
  lineItems: readonly a.InferOutput<typeof quotationLineItemSchema>[],
  taxConditions: a.InferOutput<typeof quotationTaxConditionsSchema>,
): boolean {
  return lineItems.every((item) => {
    if (item.unitPrice === undefined) return item.type === "text"

    if (taxConditions.taxType === "gross" && item.unitPrice.grossAmount === undefined) return false
    if (taxConditions.taxType !== "gross" && item.unitPrice.netAmount === undefined) return false
    if (quotationVatFreeTaxTypes.has(taxConditions.taxType) && item.unitPrice.taxRatePercentage !== 0) return false

    return (
      item.subItems?.every((subItem) => {
        if (subItem.unitPrice === undefined) return subItem.type === "text"
        if (taxConditions.taxType === "gross" && subItem.unitPrice.grossAmount === undefined) return false
        if (taxConditions.taxType !== "gross" && subItem.unitPrice.netAmount === undefined) return false
        return !quotationVatFreeTaxTypes.has(taxConditions.taxType) || subItem.unitPrice.taxRatePercentage === 0
      }) ?? true
    )
  })
}

const quotationRequestBodySchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    language: a.optional(quotationLanguageSchema),
    printLayoutId: a.optional(lexwareIdSchema),
    voucherDate: quotationDateTimeSchema,
    expirationDate: quotationDateTimeSchema,
    address: quotationAddressSchema,
    lineItems: a.pipe(a.array(quotationLineItemSchema), a.minLength(1), a.maxLength(300)),
    totalPrice: quotationTotalPriceSchema,
    taxConditions: quotationTaxConditionsSchema,
    paymentConditions: a.optional(quotationPaymentConditionsSchema),
  }),
  a.check((quotation) => {
    return quotationLineItemsMatchTaxConditions(quotation.lineItems, quotation.taxConditions)
  }, "line-item unit prices must match the quotation tax conditions"),
)

export const quotationCreateBodySchema = quotationRequestBodySchema
export const quotationCreateInputSchema = quotationCreateBodySchema

const quotationUpdateAddressSchema = a.looseObject(a.partial(a.object(quotationAddressSchema.entries)).entries)
const quotationUpdateSubItemSchema = a.looseObject(a.partial(a.object(quotationSubItemSchema.entries)).entries)
const quotationUpdateLineItemSchema = a.looseObject({
  ...a.partial(a.object(quotationLineItemSchema.entries)).entries,
  subItems: a.optional(a.pipe(a.array(quotationUpdateSubItemSchema), a.maxLength(300))),
})
const quotationUpdateTotalPriceSchema = a.looseObject(a.partial(a.object(quotationTotalPriceSchema.entries)).entries)
const quotationUpdateTaxConditionsSchema = a.looseObject(
  a.partial(a.object(quotationTaxConditionsSchema.entries)).entries,
)

export const quotationUpdateBodySchema = a.pipe(
  a.looseObject({
    ...a.partial(a.object(quotationCreateBodySchema.entries)).entries,
    address: a.optional(quotationUpdateAddressSchema),
    lineItems: a.optional(a.pipe(a.array(quotationUpdateLineItemSchema), a.maxLength(300))),
    totalPrice: a.optional(quotationUpdateTotalPriceSchema),
    taxConditions: a.optional(quotationUpdateTaxConditionsSchema),
  }),
  a.check((quotation) => {
    const taxConditions = quotation.taxConditions
    if (taxConditions === undefined || quotation.lineItems === undefined) return true

    const parsedTaxConditions = a.safeParse(quotationTaxConditionsSchema, taxConditions)
    if (!parsedTaxConditions.success) return true

    const parsedLineItems: a.InferOutput<typeof quotationLineItemSchema>[] = []
    for (const item of quotation.lineItems) {
      const parsed = a.safeParse(quotationLineItemSchema, item)
      if (!parsed.success) return true
      parsedLineItems.push(parsed.output)
    }

    return quotationLineItemsMatchTaxConditions(parsedLineItems, parsedTaxConditions.output)
  }, "line-item unit prices must match the quotation tax conditions"),
)

export const quotationBodySchema = quotationUpdateBodySchema

export const quotationUpdateInputSchema = a.object({
  ...lexwareIdInputSchema.entries,
  quotation: quotationUpdateBodySchema,
})

export const quotationListInputSchema = a.object({
  page: a.optional(a.number()),
})

export type QuotationBody = a.InferOutput<typeof quotationBodySchema>
export type QuotationAddress = a.InferOutput<typeof quotationAddressSchema>
export type QuotationCreateInput = a.InferOutput<typeof quotationCreateInputSchema>
export type QuotationLineItem = a.InferOutput<typeof quotationLineItemSchema>
export type QuotationPaymentConditions = a.InferOutput<typeof quotationPaymentConditionsSchema>
export type QuotationPaymentDiscountConditions = a.InferOutput<typeof quotationPaymentDiscountConditionsSchema>
export type QuotationSubItem = a.InferOutput<typeof quotationSubItemSchema>
export type QuotationTaxConditions = a.InferOutput<typeof quotationTaxConditionsSchema>
export type QuotationTotalPrice = a.InferOutput<typeof quotationTotalPriceSchema>
export type QuotationUnitPrice = a.InferOutput<typeof quotationUnitPriceSchema>
export type QuotationUpdateInput = a.InferOutput<typeof quotationUpdateInputSchema>
export type QuotationListInput = a.InferOutput<typeof quotationListInputSchema>
