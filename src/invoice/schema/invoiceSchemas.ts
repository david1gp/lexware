import * as a from "valibot"
import {
  lexwareAddressSchema,
  lexwareCurrencySchema,
  lexwareDateTimeSchema,
  lexwareIdSchema,
  lexwareLineItemSchema,
  lexwareLineItemTypeSchema,
  lexwareNonNegativeIntegerSchema,
  lexwareNonNegativeNumberSchema,
  lexwarePaymentConditionsSchema,
  lexwarePaymentDiscountConditionsSchema,
  lexwarePercentageSchema,
  lexwareTaxConditionsSchema,
  lexwareTaxSubTypeSchema,
  lexwareTaxTypeSchema,
  lexwareTotalPriceSchema,
  lexwareUnitPriceSchema,
} from "../../shared/lexwareSchemas.js"

export const invoiceAddressSchema = lexwareAddressSchema
export const invoiceCurrencySchema = lexwareCurrencySchema
export const invoiceDateTimeSchema = lexwareDateTimeSchema
export const invoiceLineItemTypeSchema = lexwareLineItemTypeSchema
export const invoiceTaxTypeSchema = lexwareTaxTypeSchema
export const invoiceTaxSubTypeSchema = lexwareTaxSubTypeSchema
export const invoiceUnitPriceSchema = lexwareUnitPriceSchema
export const invoiceTotalPriceSchema = lexwareTotalPriceSchema
export const invoiceTaxConditionsSchema = lexwareTaxConditionsSchema
export const invoicePaymentDiscountConditionsSchema = lexwarePaymentDiscountConditionsSchema
export const invoicePaymentConditionsSchema = lexwarePaymentConditionsSchema

export const invoiceShippingTypeSchema = a.picklist(["service", "serviceperiod", "delivery", "deliveryperiod", "none"])

export const invoiceVersionSchema = lexwareNonNegativeIntegerSchema

export const invoiceLineItemSchema = a.pipe(
  a.object({
    id: a.optional(lexwareIdSchema),
    type: invoiceLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(lexwareNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(invoiceUnitPriceSchema),
    discountPercentage: a.optional(lexwarePercentageSchema),
    lineItemAmount: a.optional(lexwareNonNegativeNumberSchema),
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

export const invoiceShippingConditionsSchema = a.pipe(
  a.object({
    shippingType: invoiceShippingTypeSchema,
    shippingDate: a.optional(invoiceDateTimeSchema),
    shippingEndDate: a.optional(invoiceDateTimeSchema),
  }),
  a.check((shipping) => {
    if (
      (shipping.shippingType === "service" ||
        shipping.shippingType === "serviceperiod" ||
        shipping.shippingType === "delivery" ||
        shipping.shippingType === "deliveryperiod") &&
      shipping.shippingDate === undefined
    ) {
      return false
    }

    if (
      (shipping.shippingType === "serviceperiod" || shipping.shippingType === "deliveryperiod") &&
      shipping.shippingEndDate === undefined
    ) {
      return false
    }

    if (shipping.shippingDate !== undefined && shipping.shippingEndDate !== undefined) {
      return Date.parse(shipping.shippingEndDate) >= Date.parse(shipping.shippingDate)
    }

    return true
  }, "shipping dates are required for the selected shipping type and shippingEndDate cannot precede shippingDate"),
)

export const invoiceXRechnungSchema = a.object({
  buyerReference: a.string(),
})

const invoiceVatFreeTaxTypes = new Set([
  "vatfree",
  "intraCommunitySupply",
  "constructionService13b",
  "externalService13b",
  "thirdPartyCountryService",
  "thirdPartyCountryDelivery",
])

function invoiceLineItemsMatchTaxConditions(
  lineItems: readonly a.InferOutput<typeof invoiceLineItemSchema>[],
  taxConditions: a.InferOutput<typeof invoiceTaxConditionsSchema>,
): boolean {
  return lineItems.every((item) => {
    if (item.unitPrice === undefined) return item.type === "text"

    if (taxConditions.taxType === "gross" && item.unitPrice.grossAmount === undefined) return false
    if (taxConditions.taxType !== "gross" && item.unitPrice.netAmount === undefined) return false
    if (invoiceVatFreeTaxTypes.has(taxConditions.taxType) && item.unitPrice.taxRatePercentage !== 0) return false

    return true
  })
}

const invoiceRequestBodySchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    voucherDate: invoiceDateTimeSchema,
    address: invoiceAddressSchema,
    lineItems: a.pipe(a.array(invoiceLineItemSchema), a.minLength(1), a.maxLength(300)),
    totalPrice: invoiceTotalPriceSchema,
    taxConditions: invoiceTaxConditionsSchema,
    shippingConditions: invoiceShippingConditionsSchema,
    paymentConditions: a.optional(invoicePaymentConditionsSchema),
    xRechnung: a.optional(invoiceXRechnungSchema),
    version: a.optional(invoiceVersionSchema),
  }),
  a.check(
    (invoice) => invoiceLineItemsMatchTaxConditions(invoice.lineItems, invoice.taxConditions),
    "line-item unit prices must match the invoice tax conditions",
  ),
)

export const invoiceCreateBodySchema = invoiceRequestBodySchema

const invoiceCompatibleLineItemSchema = a.pipe(
  lexwareLineItemSchema,
  a.check((item) => {
    if (item.type === undefined) return true
    return a.safeParse(invoiceLineItemSchema, item).success
  }, "line-item fields must match their type"),
)

export const invoiceUpdateBodySchema = a.pipe(
  a.looseObject({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    voucherDate: a.optional(invoiceDateTimeSchema),
    address: a.optional(invoiceAddressSchema),
    lineItems: a.array(invoiceCompatibleLineItemSchema),
    totalPrice: a.optional(invoiceTotalPriceSchema),
    taxConditions: a.optional(invoiceTaxConditionsSchema),
    shippingConditions: a.optional(invoiceShippingConditionsSchema),
    paymentConditions: a.optional(invoicePaymentConditionsSchema),
    xRechnung: a.optional(a.unknown()),
    version: a.optional(invoiceVersionSchema),
  }),
  a.check((invoice) => {
    if (invoice.taxConditions === undefined) return true
    const taxConditions = invoice.taxConditions

    return invoice.lineItems.every((item) => {
      if (item.type === undefined) return true
      const parsed = a.safeParse(invoiceLineItemSchema, item)
      return parsed.success && invoiceLineItemsMatchTaxConditions([parsed.output], taxConditions)
    })
  }, "line-item unit prices must match the invoice tax conditions"),
)

export const invoiceBodySchema = invoiceUpdateBodySchema

export const invoiceCreateInputSchema = a.object({
  invoice: invoiceCreateBodySchema,
  finalize: a.optional(a.boolean()),
})

export const invoiceUpdateInputSchema = a.object({
  id: lexwareIdSchema,
  invoice: invoiceUpdateBodySchema,
})

export const invoiceListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
})

export type InvoiceAddress = a.InferOutput<typeof invoiceAddressSchema>
export type InvoiceBody = a.InferOutput<typeof invoiceBodySchema>
export type InvoiceCreateBody = a.InferOutput<typeof invoiceCreateBodySchema>
export type InvoiceCreateInput = a.InferOutput<typeof invoiceCreateInputSchema>
export type InvoiceLineItem = a.InferOutput<typeof invoiceLineItemSchema>
export type InvoicePaymentConditions = a.InferOutput<typeof invoicePaymentConditionsSchema>
export type InvoicePaymentDiscountConditions = a.InferOutput<typeof invoicePaymentDiscountConditionsSchema>
export type InvoiceShippingConditions = a.InferOutput<typeof invoiceShippingConditionsSchema>
export type InvoiceTaxConditions = a.InferOutput<typeof invoiceTaxConditionsSchema>
export type InvoiceTotalPrice = a.InferOutput<typeof invoiceTotalPriceSchema>
export type InvoiceUnitPrice = a.InferOutput<typeof invoiceUnitPriceSchema>
export type InvoiceUpdateBody = a.InferOutput<typeof invoiceUpdateBodySchema>
export type InvoiceUpdateInput = a.InferOutput<typeof invoiceUpdateInputSchema>
export type InvoiceXRechnung = a.InferOutput<typeof invoiceXRechnungSchema>
export type InvoiceListInput = a.InferOutput<typeof invoiceListInputSchema>
