import * as a from "valibot"

const invoiceLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])
const invoiceTaxTypeSchema = a.picklist([
  "net",
  "gross",
  "vatfree",
  "intraCommunitySupply",
  "constructionService13b",
  "externalService13b",
  "thirdPartyCountryService",
  "thirdPartyCountryDelivery",
])
const invoiceTaxSubTypeSchema = a.picklist(["distanceSales", "electronicServices"])
const invoiceShippingTypeSchema = a.picklist(["service", "serviceperiod", "delivery", "deliveryperiod", "none"])
const invoiceCountryCodeSchema = a.pipe(a.string(), a.regex(/^[A-Z]{2}$/))
const invoiceNonNegativeNumberSchema = a.pipe(a.number(), a.minValue(0))
const invoicePercentageSchema = a.pipe(a.number(), a.minValue(0), a.maxValue(100))
const invoiceVersionSchema = a.pipe(a.number(), a.integer(), a.minValue(0))

type InvoiceCreateInputFlags = {
  readonly title?: string
  readonly introduction?: string
  readonly remark?: string
  readonly voucherDate?: string
  readonly addressContactId?: string
  readonly addressName?: string
  readonly addressSupplement?: string
  readonly addressStreet?: string
  readonly addressCity?: string
  readonly addressZip?: string
  readonly addressCountryCode?: string
  readonly lineItemId?: string[]
  readonly lineItemType?: ("custom" | "material" | "service" | "text")[]
  readonly lineItemName?: string[]
  readonly lineItemDescription?: string[]
  readonly lineItemQuantity?: number[]
  readonly lineItemUnitName?: string[]
  readonly lineItemUnitPriceCurrency?: "EUR"[]
  readonly lineItemUnitPriceNetAmount?: number[]
  readonly lineItemUnitPriceGrossAmount?: number[]
  readonly lineItemUnitPriceTaxRatePercentage?: number[]
  readonly lineItemDiscountPercentage?: number[]
  readonly lineItemAmount?: number[]
  readonly totalPriceCurrency?: "EUR"
  readonly totalPriceTotalNetAmount?: number
  readonly totalPriceTotalGrossAmount?: number
  readonly totalPriceTotalTaxAmount?: number
  readonly totalPriceTotalDiscountAbsolute?: number
  readonly totalPriceTotalDiscountPercentage?: number
  readonly taxConditionsTaxType?:
    | "net"
    | "gross"
    | "vatfree"
    | "intraCommunitySupply"
    | "constructionService13b"
    | "externalService13b"
    | "thirdPartyCountryService"
    | "thirdPartyCountryDelivery"
  readonly taxConditionsTaxSubType?: "distanceSales" | "electronicServices"
  readonly taxConditionsTaxTypeNote?: string
  readonly shippingConditionsShippingType?: "service" | "serviceperiod" | "delivery" | "deliveryperiod" | "none"
  readonly shippingConditionsShippingDate?: string
  readonly shippingConditionsShippingEndDate?: string
  readonly paymentConditionsPaymentTermLabel?: string
  readonly paymentConditionsPaymentTermDuration?: number
  readonly paymentConditionsPaymentDiscountConditionsDiscountPercentage?: number
  readonly paymentConditionsPaymentDiscountConditionsDiscountRange?: number
  readonly xRechnungBuyerReference?: string
  readonly finalize?: boolean
  readonly version?: number
}

export type { InvoiceCreateInputFlags }

function invoiceFlagArrays(flags: InvoiceCreateInputFlags): readonly (readonly unknown[])[] {
  return [
    flags.lineItemId,
    flags.lineItemType,
    flags.lineItemName,
    flags.lineItemDescription,
    flags.lineItemQuantity,
    flags.lineItemUnitName,
    flags.lineItemUnitPriceCurrency,
    flags.lineItemUnitPriceNetAmount,
    flags.lineItemUnitPriceGrossAmount,
    flags.lineItemUnitPriceTaxRatePercentage,
    flags.lineItemDiscountPercentage,
    flags.lineItemAmount,
  ].filter((value): value is string[] | number[] => value !== undefined && value.length > 0)
}

const invoiceCreateFlagsSchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    voucherDate: a.optional(a.string()),
    addressContactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    addressName: a.optional(a.string()),
    addressSupplement: a.optional(a.string()),
    addressStreet: a.optional(a.string()),
    addressCity: a.optional(a.string()),
    addressZip: a.optional(a.string()),
    addressCountryCode: a.optional(invoiceCountryCodeSchema),
    lineItemId: a.optional(a.array(a.pipe(a.string(), a.minLength(1)))),
    lineItemType: a.optional(a.array(invoiceLineItemTypeSchema)),
    lineItemName: a.optional(a.array(a.string())),
    lineItemDescription: a.optional(a.array(a.string())),
    lineItemQuantity: a.optional(a.array(a.number())),
    lineItemUnitName: a.optional(a.array(a.string())),
    lineItemUnitPriceCurrency: a.optional(a.array(a.literal("EUR"))),
    lineItemUnitPriceNetAmount: a.optional(a.array(invoiceNonNegativeNumberSchema)),
    lineItemUnitPriceGrossAmount: a.optional(a.array(invoiceNonNegativeNumberSchema)),
    lineItemUnitPriceTaxRatePercentage: a.optional(a.array(invoicePercentageSchema)),
    lineItemDiscountPercentage: a.optional(a.array(invoicePercentageSchema)),
    lineItemAmount: a.optional(a.array(invoiceNonNegativeNumberSchema)),
    totalPriceCurrency: a.optional(a.literal("EUR")),
    totalPriceTotalNetAmount: a.optional(invoiceNonNegativeNumberSchema),
    totalPriceTotalGrossAmount: a.optional(invoiceNonNegativeNumberSchema),
    totalPriceTotalTaxAmount: a.optional(invoiceNonNegativeNumberSchema),
    totalPriceTotalDiscountAbsolute: a.optional(invoiceNonNegativeNumberSchema),
    totalPriceTotalDiscountPercentage: a.optional(invoicePercentageSchema),
    taxConditionsTaxType: a.optional(invoiceTaxTypeSchema),
    taxConditionsTaxSubType: a.optional(invoiceTaxSubTypeSchema),
    taxConditionsTaxTypeNote: a.optional(a.string()),
    shippingConditionsShippingType: a.optional(invoiceShippingTypeSchema),
    shippingConditionsShippingDate: a.optional(a.string()),
    shippingConditionsShippingEndDate: a.optional(a.string()),
    paymentConditionsPaymentTermLabel: a.optional(a.string()),
    paymentConditionsPaymentTermDuration: a.optional(a.pipe(a.number(), a.integer(), a.minValue(0))),
    paymentConditionsPaymentDiscountConditionsDiscountPercentage: a.optional(invoicePercentageSchema),
    paymentConditionsPaymentDiscountConditionsDiscountRange: a.optional(a.pipe(a.number(), a.integer(), a.minValue(0))),
    xRechnungBuyerReference: a.optional(a.string()),
    finalize: a.optional(a.boolean()),
    version: a.optional(invoiceVersionSchema),
  }),
  a.check((flags) => {
    const arrays = invoiceFlagArrays(flags)
    if (arrays.length === 0) return false

    const itemCount = arrays[0]?.length ?? 0
    return itemCount <= 300 && arrays.every((values) => values.length === itemCount)
  }, "line-item options must contain between 1 and 300 values with matching cardinality"),
)

const invoiceAddressSchema = a.pipe(
  a.object({
    contactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    name: a.optional(a.string()),
    supplement: a.optional(a.string()),
    street: a.optional(a.string()),
    city: a.optional(a.string()),
    zip: a.optional(a.string()),
    countryCode: a.optional(invoiceCountryCodeSchema),
  }),
  a.check(
    (address) =>
      address.contactId !== undefined ||
      (address.name !== undefined && address.name.length > 0 && address.countryCode !== undefined),
    "address requires contactId or name and countryCode",
  ),
)

const invoiceUnitPriceSchema = a.pipe(
  a.object({
    currency: a.literal("EUR"),
    netAmount: a.optional(invoiceNonNegativeNumberSchema),
    grossAmount: a.optional(invoiceNonNegativeNumberSchema),
    taxRatePercentage: invoicePercentageSchema,
  }),
  a.check(
    (price) => price.netAmount !== undefined || price.grossAmount !== undefined,
    "line-item unit price requires netAmount or grossAmount",
  ),
)

const invoiceLineItemSchema = a.pipe(
  a.object({
    id: a.optional(a.pipe(a.string(), a.minLength(1))),
    type: invoiceLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(invoiceNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(invoiceUnitPriceSchema),
    discountPercentage: a.optional(invoicePercentageSchema),
    lineItemAmount: a.optional(invoiceNonNegativeNumberSchema),
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

const invoiceTotalPriceSchema = a.object({
  currency: a.literal("EUR"),
  totalNetAmount: a.optional(invoiceNonNegativeNumberSchema),
  totalGrossAmount: a.optional(invoiceNonNegativeNumberSchema),
  totalTaxAmount: a.optional(invoiceNonNegativeNumberSchema),
  totalDiscountAbsolute: a.optional(invoiceNonNegativeNumberSchema),
  totalDiscountPercentage: a.optional(invoicePercentageSchema),
})

const invoiceTaxConditionsSchema = a.object({
  taxType: invoiceTaxTypeSchema,
  taxSubType: a.optional(invoiceTaxSubTypeSchema),
  taxTypeNote: a.optional(a.string()),
})

const invoiceShippingConditionsSchema = a.pipe(
  a.object({
    shippingType: invoiceShippingTypeSchema,
    shippingDate: a.optional(a.pipe(a.string(), a.isoDateTime())),
    shippingEndDate: a.optional(a.pipe(a.string(), a.isoDateTime())),
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

const invoicePaymentDiscountConditionsSchema = a.object({
  discountPercentage: a.optional(invoicePercentageSchema),
  discountRange: a.optional(a.pipe(a.number(), a.integer(), a.minValue(0))),
})

const invoicePaymentConditionsSchema = a.object({
  paymentTermLabel: a.optional(a.string()),
  paymentTermDuration: a.optional(a.pipe(a.number(), a.integer(), a.minValue(0))),
  paymentDiscountConditions: a.optional(invoicePaymentDiscountConditionsSchema),
})

const invoiceXRechnungSchema = a.object({
  buyerReference: a.string(),
})

const invoiceBodyInputSchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    voucherDate: a.pipe(a.string(), a.isoDateTime()),
    address: invoiceAddressSchema,
    lineItems: a.pipe(a.array(invoiceLineItemSchema), a.minLength(1), a.maxLength(300)),
    totalPrice: invoiceTotalPriceSchema,
    taxConditions: invoiceTaxConditionsSchema,
    shippingConditions: invoiceShippingConditionsSchema,
    paymentConditions: a.optional(invoicePaymentConditionsSchema),
    xRechnung: a.optional(invoiceXRechnungSchema),
    version: a.optional(invoiceVersionSchema),
  }),
  a.check((invoice) => {
    const vatFree = new Set([
      "vatfree",
      "intraCommunitySupply",
      "constructionService13b",
      "externalService13b",
      "thirdPartyCountryService",
      "thirdPartyCountryDelivery",
    ])

    return invoice.lineItems.every((item) => {
      if (item.unitPrice === undefined) return item.type === "text"

      if (invoice.taxConditions.taxType === "gross" && item.unitPrice.grossAmount === undefined) return false
      if (invoice.taxConditions.taxType !== "gross" && item.unitPrice.netAmount === undefined) return false
      if (vatFree.has(invoice.taxConditions.taxType) && item.unitPrice.taxRatePercentage !== 0) return false
      return true
    })
  }, "line-item unit prices must match the invoice tax conditions"),
)

function invoiceBodyInputFromFlags(flags: InvoiceCreateInputFlags): unknown {
  const itemCount = Math.max(...invoiceFlagArrays(flags).map((values) => values.length), 0)
  const lineItems = Array.from({ length: itemCount }, (_, index) => {
    const unitPriceProvided = [
      flags.lineItemUnitPriceCurrency,
      flags.lineItemUnitPriceNetAmount,
      flags.lineItemUnitPriceGrossAmount,
      flags.lineItemUnitPriceTaxRatePercentage,
    ].some((values) => values !== undefined && values.length > 0)

    return {
      id: flags.lineItemId?.[index],
      type: flags.lineItemType?.[index],
      name: flags.lineItemName?.[index],
      description: flags.lineItemDescription?.[index],
      quantity: flags.lineItemQuantity?.[index],
      unitName: flags.lineItemUnitName?.[index],
      unitPrice: unitPriceProvided
        ? {
            currency: flags.lineItemUnitPriceCurrency?.[index],
            netAmount: flags.lineItemUnitPriceNetAmount?.[index],
            grossAmount: flags.lineItemUnitPriceGrossAmount?.[index],
            taxRatePercentage: flags.lineItemUnitPriceTaxRatePercentage?.[index],
          }
        : undefined,
      discountPercentage: flags.lineItemDiscountPercentage?.[index],
      lineItemAmount: flags.lineItemAmount?.[index],
    }
  })

  const paymentDiscountProvided =
    flags.paymentConditionsPaymentDiscountConditionsDiscountPercentage !== undefined ||
    flags.paymentConditionsPaymentDiscountConditionsDiscountRange !== undefined
  const paymentProvided =
    flags.paymentConditionsPaymentTermLabel !== undefined ||
    flags.paymentConditionsPaymentTermDuration !== undefined ||
    paymentDiscountProvided

  return {
    title: flags.title,
    introduction: flags.introduction,
    remark: flags.remark,
    voucherDate: flags.voucherDate,
    address: {
      contactId: flags.addressContactId,
      name: flags.addressName,
      supplement: flags.addressSupplement,
      street: flags.addressStreet,
      city: flags.addressCity,
      zip: flags.addressZip,
      countryCode: flags.addressCountryCode,
    },
    lineItems,
    totalPrice: {
      currency: flags.totalPriceCurrency,
      totalNetAmount: flags.totalPriceTotalNetAmount,
      totalGrossAmount: flags.totalPriceTotalGrossAmount,
      totalTaxAmount: flags.totalPriceTotalTaxAmount,
      totalDiscountAbsolute: flags.totalPriceTotalDiscountAbsolute,
      totalDiscountPercentage: flags.totalPriceTotalDiscountPercentage,
    },
    taxConditions: {
      taxType: flags.taxConditionsTaxType,
      taxSubType: flags.taxConditionsTaxSubType,
      taxTypeNote: flags.taxConditionsTaxTypeNote,
    },
    shippingConditions: {
      shippingType: flags.shippingConditionsShippingType,
      shippingDate: flags.shippingConditionsShippingDate,
      shippingEndDate: flags.shippingConditionsShippingEndDate,
    },
    paymentConditions: paymentProvided
      ? {
          paymentTermLabel: flags.paymentConditionsPaymentTermLabel,
          paymentTermDuration: flags.paymentConditionsPaymentTermDuration,
          paymentDiscountConditions: paymentDiscountProvided
            ? {
                discountPercentage: flags.paymentConditionsPaymentDiscountConditionsDiscountPercentage,
                discountRange: flags.paymentConditionsPaymentDiscountConditionsDiscountRange,
              }
            : undefined,
        }
      : undefined,
    xRechnung:
      flags.xRechnungBuyerReference === undefined ? undefined : { buyerReference: flags.xRechnungBuyerReference },
    version: flags.version,
  }
}

function invoiceCreateInputFromFlags(flags: InvoiceCreateInputFlags): unknown {
  return {
    invoice: invoiceBodyInputFromFlags(flags),
    finalize: flags.finalize,
  }
}

const invoiceCreateOperationSchema = a.object({
  invoice: invoiceBodyInputSchema,
  finalize: a.optional(a.boolean()),
})

export { invoiceBodyInputFromFlags, invoiceBodyInputSchema, invoiceCreateFlagsSchema, invoiceCreateInputFromFlags }

export const invoiceCreateInputSchema = a.pipe(
  invoiceCreateFlagsSchema,
  a.transform((flags) => invoiceCreateInputFromFlags(flags) as a.InferInput<typeof invoiceCreateOperationSchema>),
  invoiceCreateOperationSchema,
)
