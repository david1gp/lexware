import * as a from "valibot"

const quotationLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])
const quotationTaxTypeSchema = a.picklist([
  "net",
  "gross",
  "vatfree",
  "intraCommunitySupply",
  "constructionService13b",
  "externalService13b",
  "thirdPartyCountryService",
  "thirdPartyCountryDelivery",
  "photovoltaicEquipment",
])
const quotationTaxSubTypeSchema = a.picklist(["distanceSales", "electronicServices"])
const quotationCountryCodeSchema = a.pipe(a.string(), a.regex(/^[A-Z]{2}$/))
const quotationNonNegativeNumberSchema = a.pipe(a.number(), a.minValue(0))
const quotationPercentageSchema = a.pipe(a.number(), a.minValue(0), a.maxValue(100))
const quotationIntegerSchema = a.pipe(a.number(), a.integer(), a.minValue(0))

type QuotationCreateInputFlags = {
  readonly title?: string
  readonly introduction?: string
  readonly remark?: string
  readonly language?: "de" | "en"
  readonly printLayoutId?: string
  readonly voucherDate?: string
  readonly expirationDate?: string
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
  readonly lineItemOptional?: boolean[]
  readonly lineItemAlternative?: boolean[]
  readonly lineItemSubItemParentIndex?: number[]
  readonly lineItemSubItemId?: string[]
  readonly lineItemSubItemType?: ("custom" | "material" | "service" | "text")[]
  readonly lineItemSubItemName?: string[]
  readonly lineItemSubItemDescription?: string[]
  readonly lineItemSubItemQuantity?: number[]
  readonly lineItemSubItemUnitName?: string[]
  readonly lineItemSubItemUnitPriceCurrency?: "EUR"[]
  readonly lineItemSubItemUnitPriceNetAmount?: number[]
  readonly lineItemSubItemUnitPriceGrossAmount?: number[]
  readonly lineItemSubItemUnitPriceTaxRatePercentage?: number[]
  readonly lineItemSubItemDiscountPercentage?: number[]
  readonly lineItemSubItemAmount?: number[]
  readonly lineItemSubItemAlternative?: boolean[]
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
    | "photovoltaicEquipment"
  readonly taxConditionsTaxSubType?: "distanceSales" | "electronicServices"
  readonly taxConditionsTaxTypeNote?: string
  readonly paymentConditionsPaymentTermLabel?: string
  readonly paymentConditionsPaymentTermDuration?: number
  readonly paymentConditionsPaymentDiscountConditionsDiscountPercentage?: number
  readonly paymentConditionsPaymentDiscountConditionsDiscountRange?: number
}

export type { QuotationCreateInputFlags }

function quotationLineItemFlagArrays(flags: QuotationCreateInputFlags): readonly (readonly unknown[])[] {
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
    flags.lineItemOptional,
    flags.lineItemAlternative,
  ].filter((value): value is string[] | number[] | boolean[] => value !== undefined && value.length > 0)
}

function quotationSubItemFlagArrays(flags: QuotationCreateInputFlags): readonly (readonly unknown[])[] {
  return [
    flags.lineItemSubItemParentIndex,
    flags.lineItemSubItemId,
    flags.lineItemSubItemType,
    flags.lineItemSubItemName,
    flags.lineItemSubItemDescription,
    flags.lineItemSubItemQuantity,
    flags.lineItemSubItemUnitName,
    flags.lineItemSubItemUnitPriceCurrency,
    flags.lineItemSubItemUnitPriceNetAmount,
    flags.lineItemSubItemUnitPriceGrossAmount,
    flags.lineItemSubItemUnitPriceTaxRatePercentage,
    flags.lineItemSubItemDiscountPercentage,
    flags.lineItemSubItemAmount,
    flags.lineItemSubItemAlternative,
  ].filter((value): value is string[] | number[] | boolean[] => value !== undefined && value.length > 0)
}

function quotationLineItemCount(flags: QuotationCreateInputFlags): number {
  return Math.max(...quotationLineItemFlagArrays(flags).map((values) => values.length), 0)
}

const quotationCreateFlagsSchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    language: a.optional(a.picklist(["de", "en"])),
    printLayoutId: a.optional(a.pipe(a.string(), a.minLength(1))),
    voucherDate: a.optional(a.string()),
    expirationDate: a.optional(a.string()),
    addressContactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    addressName: a.optional(a.string()),
    addressSupplement: a.optional(a.string()),
    addressStreet: a.optional(a.string()),
    addressCity: a.optional(a.string()),
    addressZip: a.optional(a.string()),
    addressCountryCode: a.optional(quotationCountryCodeSchema),
    lineItemId: a.optional(a.array(a.pipe(a.string(), a.minLength(1)))),
    lineItemType: a.optional(a.array(quotationLineItemTypeSchema)),
    lineItemName: a.optional(a.array(a.string())),
    lineItemDescription: a.optional(a.array(a.string())),
    lineItemQuantity: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemUnitName: a.optional(a.array(a.string())),
    lineItemUnitPriceCurrency: a.optional(a.array(a.literal("EUR"))),
    lineItemUnitPriceNetAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemUnitPriceGrossAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemUnitPriceTaxRatePercentage: a.optional(a.array(quotationPercentageSchema)),
    lineItemDiscountPercentage: a.optional(a.array(quotationPercentageSchema)),
    lineItemAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemOptional: a.optional(a.array(a.boolean())),
    lineItemAlternative: a.optional(a.array(a.boolean())),
    lineItemSubItemParentIndex: a.optional(a.array(quotationIntegerSchema)),
    lineItemSubItemId: a.optional(a.array(a.pipe(a.string(), a.minLength(1)))),
    lineItemSubItemType: a.optional(a.array(quotationLineItemTypeSchema)),
    lineItemSubItemName: a.optional(a.array(a.string())),
    lineItemSubItemDescription: a.optional(a.array(a.string())),
    lineItemSubItemQuantity: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemSubItemUnitName: a.optional(a.array(a.string())),
    lineItemSubItemUnitPriceCurrency: a.optional(a.array(a.literal("EUR"))),
    lineItemSubItemUnitPriceNetAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemSubItemUnitPriceGrossAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemSubItemUnitPriceTaxRatePercentage: a.optional(a.array(quotationPercentageSchema)),
    lineItemSubItemDiscountPercentage: a.optional(a.array(quotationPercentageSchema)),
    lineItemSubItemAmount: a.optional(a.array(quotationNonNegativeNumberSchema)),
    lineItemSubItemAlternative: a.optional(a.array(a.boolean())),
    totalPriceCurrency: a.optional(a.literal("EUR")),
    totalPriceTotalNetAmount: a.optional(quotationNonNegativeNumberSchema),
    totalPriceTotalGrossAmount: a.optional(quotationNonNegativeNumberSchema),
    totalPriceTotalTaxAmount: a.optional(quotationNonNegativeNumberSchema),
    totalPriceTotalDiscountAbsolute: a.optional(quotationNonNegativeNumberSchema),
    totalPriceTotalDiscountPercentage: a.optional(quotationPercentageSchema),
    taxConditionsTaxType: a.optional(quotationTaxTypeSchema),
    taxConditionsTaxSubType: a.optional(quotationTaxSubTypeSchema),
    taxConditionsTaxTypeNote: a.optional(a.string()),
    paymentConditionsPaymentTermLabel: a.optional(a.string()),
    paymentConditionsPaymentTermDuration: a.optional(quotationIntegerSchema),
    paymentConditionsPaymentDiscountConditionsDiscountPercentage: a.optional(quotationPercentageSchema),
    paymentConditionsPaymentDiscountConditionsDiscountRange: a.optional(quotationIntegerSchema),
  }),
  a.check((flags) => {
    const arrays = quotationLineItemFlagArrays(flags)
    if (arrays.length === 0) return false

    const itemCount = arrays[0]?.length ?? 0
    return itemCount >= 1 && itemCount <= 300 && arrays.every((values) => values.length === itemCount)
  }, "line-item options must contain between 1 and 300 values with matching cardinality"),
  a.check((flags) => {
    const arrays = quotationSubItemFlagArrays(flags)
    if (arrays.length === 0) return true

    const subItemCount = arrays[0]?.length ?? 0
    const itemCount = quotationLineItemCount(flags)
    const parentIndexes = flags.lineItemSubItemParentIndex
    return (
      parentIndexes !== undefined &&
      subItemCount >= 1 &&
      subItemCount <= 300 &&
      arrays.every((values) => values.length === subItemCount) &&
      parentIndexes.every((parentIndex) => parentIndex < itemCount)
    )
  }, "subitem options must contain matching values and valid parent line-item indexes"),
)

const quotationAddressSchema = a.pipe(
  a.object({
    contactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    name: a.optional(a.string()),
    supplement: a.optional(a.string()),
    street: a.optional(a.string()),
    city: a.optional(a.string()),
    zip: a.optional(a.string()),
    countryCode: a.optional(quotationCountryCodeSchema),
  }),
  a.check(
    (address) =>
      address.contactId !== undefined ||
      (address.name !== undefined && address.name.length > 0 && address.countryCode !== undefined),
    "address requires contactId or name and countryCode",
  ),
)

const quotationUnitPriceSchema = a.pipe(
  a.object({
    currency: a.literal("EUR"),
    netAmount: a.optional(quotationNonNegativeNumberSchema),
    grossAmount: a.optional(quotationNonNegativeNumberSchema),
    taxRatePercentage: quotationPercentageSchema,
  }),
  a.check(
    (price) => price.netAmount !== undefined || price.grossAmount !== undefined,
    "line-item unit price requires netAmount or grossAmount",
  ),
)

const quotationSubItemSchema = a.pipe(
  a.object({
    id: a.optional(a.pipe(a.string(), a.minLength(1))),
    type: quotationLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(quotationNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(quotationUnitPriceSchema),
    discountPercentage: a.optional(quotationPercentageSchema),
    lineItemAmount: a.optional(quotationNonNegativeNumberSchema),
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

const quotationLineItemSchema = a.pipe(
  a.object({
    id: a.optional(a.pipe(a.string(), a.minLength(1))),
    type: quotationLineItemTypeSchema,
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(quotationNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(quotationUnitPriceSchema),
    discountPercentage: a.optional(quotationPercentageSchema),
    lineItemAmount: a.optional(quotationNonNegativeNumberSchema),
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

const quotationTotalPriceSchema = a.object({
  currency: a.literal("EUR"),
  totalNetAmount: a.optional(quotationNonNegativeNumberSchema),
  totalGrossAmount: a.optional(quotationNonNegativeNumberSchema),
  totalTaxAmount: a.optional(quotationNonNegativeNumberSchema),
  totalDiscountAbsolute: a.optional(quotationNonNegativeNumberSchema),
  totalDiscountPercentage: a.optional(quotationPercentageSchema),
})

const quotationTaxConditionsSchema = a.object({
  taxType: quotationTaxTypeSchema,
  taxSubType: a.optional(quotationTaxSubTypeSchema),
  taxTypeNote: a.optional(a.string()),
})

const quotationPaymentDiscountConditionsSchema = a.object({
  discountPercentage: a.optional(quotationPercentageSchema),
  discountRange: a.optional(quotationIntegerSchema),
})

const quotationPaymentConditionsSchema = a.object({
  paymentTermLabel: a.optional(a.string()),
  paymentTermDuration: a.optional(quotationIntegerSchema),
  paymentDiscountConditions: a.optional(quotationPaymentDiscountConditionsSchema),
})

const quotationBodyInputSchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    introduction: a.optional(a.string()),
    remark: a.optional(a.string()),
    language: a.optional(a.picklist(["de", "en"])),
    printLayoutId: a.optional(a.pipe(a.string(), a.minLength(1))),
    voucherDate: a.pipe(a.string(), a.isoDateTime()),
    expirationDate: a.pipe(a.string(), a.isoDateTime()),
    address: quotationAddressSchema,
    lineItems: a.pipe(a.array(quotationLineItemSchema), a.minLength(1), a.maxLength(300)),
    totalPrice: quotationTotalPriceSchema,
    taxConditions: quotationTaxConditionsSchema,
    paymentConditions: a.optional(quotationPaymentConditionsSchema),
  }),
  a.check((quotation) => {
    const vatFree = new Set([
      "vatfree",
      "intraCommunitySupply",
      "constructionService13b",
      "externalService13b",
      "thirdPartyCountryService",
      "thirdPartyCountryDelivery",
      "photovoltaicEquipment",
    ])

    return quotation.lineItems.every((item) => {
      if (item.unitPrice === undefined) return item.type === "text"

      if (quotation.taxConditions.taxType === "gross" && item.unitPrice.grossAmount === undefined) return false
      if (quotation.taxConditions.taxType !== "gross" && item.unitPrice.netAmount === undefined) return false
      if (vatFree.has(quotation.taxConditions.taxType) && item.unitPrice.taxRatePercentage !== 0) return false

      return (
        item.subItems?.every((subItem) => {
          if (subItem.unitPrice === undefined) return subItem.type === "text"
          if (quotation.taxConditions.taxType === "gross" && subItem.unitPrice.grossAmount === undefined) return false
          if (quotation.taxConditions.taxType !== "gross" && subItem.unitPrice.netAmount === undefined) return false
          return !vatFree.has(quotation.taxConditions.taxType) || subItem.unitPrice.taxRatePercentage === 0
        }) ?? true
      )
    })
  }, "line-item unit prices must match the quotation tax conditions"),
)

function quotationUnitPriceFromFlags(
  currency: "EUR"[] | undefined,
  netAmount: number[] | undefined,
  grossAmount: number[] | undefined,
  taxRatePercentage: number[] | undefined,
  index: number,
): unknown {
  const unitPriceProvided = [currency, netAmount, grossAmount, taxRatePercentage].some(
    (values) => values !== undefined && values.length > 0,
  )

  if (!unitPriceProvided) return undefined

  return {
    currency: currency?.[index],
    netAmount: netAmount?.[index],
    grossAmount: grossAmount?.[index],
    taxRatePercentage: taxRatePercentage?.[index],
  }
}

function quotationSubItemFromFlags(flags: QuotationCreateInputFlags, index: number): unknown {
  return {
    id: flags.lineItemSubItemId?.[index],
    type: flags.lineItemSubItemType?.[index],
    name: flags.lineItemSubItemName?.[index],
    description: flags.lineItemSubItemDescription?.[index],
    quantity: flags.lineItemSubItemQuantity?.[index],
    unitName: flags.lineItemSubItemUnitName?.[index],
    unitPrice: quotationUnitPriceFromFlags(
      flags.lineItemSubItemUnitPriceCurrency,
      flags.lineItemSubItemUnitPriceNetAmount,
      flags.lineItemSubItemUnitPriceGrossAmount,
      flags.lineItemSubItemUnitPriceTaxRatePercentage,
      index,
    ),
    discountPercentage: flags.lineItemSubItemDiscountPercentage?.[index],
    lineItemAmount: flags.lineItemSubItemAmount?.[index],
    alternative: flags.lineItemSubItemAlternative?.[index] ?? true,
  }
}

function quotationBodyInputFromFlags(flags: QuotationCreateInputFlags): unknown {
  const itemCount = quotationLineItemCount(flags)
  const subItemsByParent = Array.from({ length: itemCount }, () => [] as unknown[])

  for (const [index, parentIndex] of (flags.lineItemSubItemParentIndex ?? []).entries()) {
    if (parentIndex < 0 || parentIndex >= itemCount) continue
    subItemsByParent[parentIndex]?.push(quotationSubItemFromFlags(flags, index))
  }

  const lineItems = Array.from({ length: itemCount }, (_, index) => {
    const subItems = subItemsByParent[index]
    return {
      id: flags.lineItemId?.[index],
      type: flags.lineItemType?.[index],
      name: flags.lineItemName?.[index],
      description: flags.lineItemDescription?.[index],
      quantity: flags.lineItemQuantity?.[index],
      unitName: flags.lineItemUnitName?.[index],
      unitPrice: quotationUnitPriceFromFlags(
        flags.lineItemUnitPriceCurrency,
        flags.lineItemUnitPriceNetAmount,
        flags.lineItemUnitPriceGrossAmount,
        flags.lineItemUnitPriceTaxRatePercentage,
        index,
      ),
      discountPercentage: flags.lineItemDiscountPercentage?.[index],
      lineItemAmount: flags.lineItemAmount?.[index],
      subItems: subItems === undefined || subItems.length === 0 ? undefined : subItems,
      optional: flags.lineItemOptional?.[index],
      alternative: flags.lineItemAlternative?.[index],
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
    language: flags.language,
    printLayoutId: flags.printLayoutId,
    voucherDate: flags.voucherDate,
    expirationDate: flags.expirationDate,
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
  }
}

const quotationCreateInputSchema = a.pipe(
  quotationCreateFlagsSchema,
  a.transform((flags) => quotationBodyInputFromFlags(flags) as a.InferInput<typeof quotationBodyInputSchema>),
  quotationBodyInputSchema,
)

export { quotationBodyInputFromFlags, quotationBodyInputSchema, quotationCreateFlagsSchema, quotationCreateInputSchema }
