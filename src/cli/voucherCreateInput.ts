import * as a from "valibot"

const voucherLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])
const voucherCountryCodeSchema = a.pipe(a.string(), a.regex(/^[A-Z]{2}$/))
const voucherNonNegativeNumberSchema = a.pipe(a.number(), a.minValue(0))
const voucherPercentageSchema = a.pipe(voucherNonNegativeNumberSchema, a.maxValue(100))

type VoucherCreateInputFlags = {
  readonly title?: string
  readonly voucherDate?: string
  readonly addressContactId?: string
  readonly addressName?: string
  readonly addressSupplement?: string
  readonly addressStreet?: string
  readonly addressCity?: string
  readonly addressZip?: string
  readonly addressCountryCode?: string
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
}

export type { VoucherCreateInputFlags }

function voucherLineItemFlagArrays(flags: VoucherCreateInputFlags): readonly (readonly unknown[])[] {
  return [
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

const voucherCreateFlagsSchema = a.pipe(
  a.object({
    title: a.optional(a.string()),
    voucherDate: a.optional(a.pipe(a.string(), a.isoDateTime())),
    addressContactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    addressName: a.optional(a.string()),
    addressSupplement: a.optional(a.string()),
    addressStreet: a.optional(a.string()),
    addressCity: a.optional(a.string()),
    addressZip: a.optional(a.string()),
    addressCountryCode: a.optional(voucherCountryCodeSchema),
    lineItemType: a.optional(a.array(voucherLineItemTypeSchema)),
    lineItemName: a.optional(a.array(a.string())),
    lineItemDescription: a.optional(a.array(a.string())),
    lineItemQuantity: a.optional(a.array(voucherNonNegativeNumberSchema)),
    lineItemUnitName: a.optional(a.array(a.string())),
    lineItemUnitPriceCurrency: a.optional(a.array(a.literal("EUR"))),
    lineItemUnitPriceNetAmount: a.optional(a.array(voucherNonNegativeNumberSchema)),
    lineItemUnitPriceGrossAmount: a.optional(a.array(voucherNonNegativeNumberSchema)),
    lineItemUnitPriceTaxRatePercentage: a.optional(a.array(voucherPercentageSchema)),
    lineItemDiscountPercentage: a.optional(a.array(voucherPercentageSchema)),
    lineItemAmount: a.optional(a.array(voucherNonNegativeNumberSchema)),
  }),
  a.check((flags) => {
    const arrays = voucherLineItemFlagArrays(flags)
    if (arrays.length === 0) return false

    const itemCount = arrays[0]?.length ?? 0
    return itemCount >= 1 && itemCount <= 300 && arrays.every((values) => values.length === itemCount)
  }, "line-item options must contain between 1 and 300 values with matching cardinality"),
)

const voucherAddressSchema = a.pipe(
  a.object({
    contactId: a.optional(a.pipe(a.string(), a.minLength(1))),
    name: a.optional(a.string()),
    supplement: a.optional(a.string()),
    street: a.optional(a.string()),
    city: a.optional(a.string()),
    zip: a.optional(a.string()),
    countryCode: a.optional(voucherCountryCodeSchema),
  }),
  a.check(
    (address) =>
      address.contactId !== undefined ||
      (address.name !== undefined && address.name.length > 0 && address.countryCode !== undefined),
    "address requires contactId or name and countryCode",
  ),
)

const voucherUnitPriceSchema = a.pipe(
  a.object({
    currency: a.literal("EUR"),
    netAmount: a.optional(voucherNonNegativeNumberSchema),
    grossAmount: a.optional(voucherNonNegativeNumberSchema),
    taxRatePercentage: voucherPercentageSchema,
  }),
  a.check(
    (price) => price.netAmount !== undefined || price.grossAmount !== undefined,
    "line-item unit price requires netAmount or grossAmount",
  ),
)

const voucherLineItemSchema = a.object({
  type: a.optional(voucherLineItemTypeSchema),
  name: a.optional(a.string()),
  description: a.optional(a.string()),
  quantity: a.optional(voucherNonNegativeNumberSchema),
  unitName: a.optional(a.string()),
  unitPrice: a.optional(voucherUnitPriceSchema),
  discountPercentage: a.optional(voucherPercentageSchema),
  lineItemAmount: a.optional(voucherNonNegativeNumberSchema),
})

const voucherBodyInputSchema = a.object({
  title: a.optional(a.string()),
  voucherDate: a.optional(a.pipe(a.string(), a.isoDateTime())),
  address: a.optional(voucherAddressSchema),
  lineItems: a.pipe(a.array(voucherLineItemSchema), a.minLength(1), a.maxLength(300)),
})

function voucherUnitPriceFromFlags(flags: VoucherCreateInputFlags, index: number): unknown {
  const unitPriceProvided = [
    flags.lineItemUnitPriceCurrency,
    flags.lineItemUnitPriceNetAmount,
    flags.lineItemUnitPriceGrossAmount,
    flags.lineItemUnitPriceTaxRatePercentage,
  ].some((values) => values !== undefined && values.length > 0)

  if (!unitPriceProvided) return undefined

  return {
    currency: flags.lineItemUnitPriceCurrency?.[index],
    netAmount: flags.lineItemUnitPriceNetAmount?.[index],
    grossAmount: flags.lineItemUnitPriceGrossAmount?.[index],
    taxRatePercentage: flags.lineItemUnitPriceTaxRatePercentage?.[index],
  }
}

function voucherBodyInputFromFlags(flags: VoucherCreateInputFlags): unknown {
  const itemCount = Math.max(...voucherLineItemFlagArrays(flags).map((values) => values.length), 0)
  const addressProvided = [
    flags.addressContactId,
    flags.addressName,
    flags.addressSupplement,
    flags.addressStreet,
    flags.addressCity,
    flags.addressZip,
    flags.addressCountryCode,
  ].some((value) => value !== undefined)

  const lineItems = Array.from({ length: itemCount }, (_, index) => ({
    type: flags.lineItemType?.[index],
    name: flags.lineItemName?.[index],
    description: flags.lineItemDescription?.[index],
    quantity: flags.lineItemQuantity?.[index],
    unitName: flags.lineItemUnitName?.[index],
    unitPrice: voucherUnitPriceFromFlags(flags, index),
    discountPercentage: flags.lineItemDiscountPercentage?.[index],
    lineItemAmount: flags.lineItemAmount?.[index],
  }))

  return {
    title: flags.title,
    voucherDate: flags.voucherDate,
    address: addressProvided
      ? {
          contactId: flags.addressContactId,
          name: flags.addressName,
          supplement: flags.addressSupplement,
          street: flags.addressStreet,
          city: flags.addressCity,
          zip: flags.addressZip,
          countryCode: flags.addressCountryCode,
        }
      : undefined,
    lineItems,
  }
}

const voucherCreateInputSchema = a.pipe(
  voucherCreateFlagsSchema,
  a.transform((flags) => voucherBodyInputFromFlags(flags) as a.InferInput<typeof voucherBodyInputSchema>),
  voucherBodyInputSchema,
)

export { voucherBodyInputFromFlags, voucherBodyInputSchema, voucherCreateFlagsSchema, voucherCreateInputSchema }
