import * as a from "valibot"

const dunningLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])
const dunningNonNegativeNumberSchema = a.pipe(a.number(), a.minValue(0))
const dunningPercentageSchema = a.pipe(a.number(), a.minValue(0), a.maxValue(100))

type DunningCreateInputFlags = {
  readonly precedingSalesVoucherId: string
  readonly finalize?: boolean
  readonly title?: string
  readonly voucherDate?: string
  readonly extraLineItemType?: ("custom" | "material" | "service" | "text")[]
  readonly extraLineItemName?: string[]
  readonly extraLineItemDescription?: string[]
  readonly extraLineItemQuantity?: number[]
  readonly extraLineItemUnitName?: string[]
  readonly extraLineItemUnitPriceCurrency?: "EUR"[]
  readonly extraLineItemUnitPriceNetAmount?: number[]
  readonly extraLineItemUnitPriceGrossAmount?: number[]
  readonly extraLineItemUnitPriceTaxRatePercentage?: number[]
  readonly extraLineItemDiscountPercentage?: number[]
  readonly extraLineItemAmount?: number[]
  readonly totalNetAmount?: number
  readonly currency?: string
}

export type { DunningCreateInputFlags }

function dunningExtraLineItemFlagArrays(flags: DunningCreateInputFlags): readonly (readonly unknown[])[] {
  return [
    flags.extraLineItemType,
    flags.extraLineItemName,
    flags.extraLineItemDescription,
    flags.extraLineItemQuantity,
    flags.extraLineItemUnitName,
    flags.extraLineItemUnitPriceCurrency,
    flags.extraLineItemUnitPriceNetAmount,
    flags.extraLineItemUnitPriceGrossAmount,
    flags.extraLineItemUnitPriceTaxRatePercentage,
    flags.extraLineItemDiscountPercentage,
    flags.extraLineItemAmount,
  ].filter((value): value is string[] | number[] => value !== undefined && value.length > 0)
}

function dunningExtraLineItemCount(flags: DunningCreateInputFlags): number {
  return Math.max(...dunningExtraLineItemFlagArrays(flags).map((values) => values.length), 0)
}

const dunningCreateFlagsSchema = a.pipe(
  a.object({
    precedingSalesVoucherId: a.pipe(a.string(), a.minLength(1)),
    finalize: a.optional(a.boolean()),
    title: a.optional(a.string()),
    voucherDate: a.optional(a.string()),
    extraLineItemType: a.optional(a.array(dunningLineItemTypeSchema)),
    extraLineItemName: a.optional(a.array(a.string())),
    extraLineItemDescription: a.optional(a.array(a.string())),
    extraLineItemQuantity: a.optional(a.array(dunningNonNegativeNumberSchema)),
    extraLineItemUnitName: a.optional(a.array(a.string())),
    extraLineItemUnitPriceCurrency: a.optional(a.array(a.literal("EUR"))),
    extraLineItemUnitPriceNetAmount: a.optional(a.array(dunningNonNegativeNumberSchema)),
    extraLineItemUnitPriceGrossAmount: a.optional(a.array(dunningNonNegativeNumberSchema)),
    extraLineItemUnitPriceTaxRatePercentage: a.optional(a.array(dunningPercentageSchema)),
    extraLineItemDiscountPercentage: a.optional(a.array(dunningPercentageSchema)),
    extraLineItemAmount: a.optional(a.array(dunningNonNegativeNumberSchema)),
    totalNetAmount: a.optional(dunningNonNegativeNumberSchema),
    currency: a.optional(a.string()),
  }),
  a.check((flags) => {
    const arrays = dunningExtraLineItemFlagArrays(flags)
    if (arrays.length === 0) return true

    const itemCount = arrays[0]?.length ?? 0
    return itemCount >= 1 && itemCount <= 300 && arrays.every((values) => values.length === itemCount)
  }, "extra line-item options must contain between 1 and 300 values with matching cardinality"),
)

const dunningUnitPriceSchema = a.pipe(
  a.object({
    currency: a.literal("EUR"),
    netAmount: a.optional(dunningNonNegativeNumberSchema),
    grossAmount: a.optional(dunningNonNegativeNumberSchema),
    taxRatePercentage: dunningPercentageSchema,
  }),
  a.check(
    (price) => price.netAmount !== undefined || price.grossAmount !== undefined,
    "extra line-item unit price requires netAmount or grossAmount",
  ),
)

const dunningExtraLineItemSchema = a.pipe(
  a.object({
    type: a.optional(dunningLineItemTypeSchema),
    name: a.pipe(a.string(), a.minLength(1)),
    description: a.optional(a.string()),
    quantity: a.optional(dunningNonNegativeNumberSchema),
    unitName: a.optional(a.string()),
    unitPrice: a.optional(dunningUnitPriceSchema),
    discountPercentage: a.optional(dunningPercentageSchema),
    lineItemAmount: a.optional(dunningNonNegativeNumberSchema),
  }),
  a.check((item) => {
    if (item.type === undefined || item.type === "text") return true

    return (
      item.quantity !== undefined &&
      item.unitName !== undefined &&
      item.unitName.length > 0 &&
      item.unitPrice !== undefined
    )
  }, "non-text extra line items require quantity, unitName, and unitPrice"),
)

function dunningExtraLineItemFromFlags(flags: DunningCreateInputFlags, index: number): unknown {
  const unitPriceProvided = [
    flags.extraLineItemUnitPriceCurrency,
    flags.extraLineItemUnitPriceNetAmount,
    flags.extraLineItemUnitPriceGrossAmount,
    flags.extraLineItemUnitPriceTaxRatePercentage,
  ].some((values) => values !== undefined && values.length > 0)

  return {
    type: flags.extraLineItemType?.[index],
    name: flags.extraLineItemName?.[index],
    description: flags.extraLineItemDescription?.[index],
    quantity: flags.extraLineItemQuantity?.[index],
    unitName: flags.extraLineItemUnitName?.[index],
    unitPrice: unitPriceProvided
      ? {
          currency: flags.extraLineItemUnitPriceCurrency?.[index],
          netAmount: flags.extraLineItemUnitPriceNetAmount?.[index],
          grossAmount: flags.extraLineItemUnitPriceGrossAmount?.[index],
          taxRatePercentage: flags.extraLineItemUnitPriceTaxRatePercentage?.[index],
        }
      : undefined,
    discountPercentage: flags.extraLineItemDiscountPercentage?.[index],
    lineItemAmount: flags.extraLineItemAmount?.[index],
  }
}

function dunningCreateInputFromFlags(flags: DunningCreateInputFlags): unknown {
  const itemCount = dunningExtraLineItemCount(flags)

  return {
    precedingSalesVoucherId: flags.precedingSalesVoucherId,
    finalize: flags.finalize,
    title: flags.title,
    voucherDate: flags.voucherDate,
    extraLineItems:
      itemCount === 0
        ? undefined
        : Array.from({ length: itemCount }, (_, index) => dunningExtraLineItemFromFlags(flags, index)),
    totalNetAmount: flags.totalNetAmount,
    currency: flags.currency,
  }
}

const dunningCreateOperationSchema = a.object({
  precedingSalesVoucherId: a.pipe(a.string(), a.minLength(1)),
  finalize: a.optional(a.boolean()),
  title: a.optional(a.string()),
  voucherDate: a.optional(a.string()),
  extraLineItems: a.optional(a.array(dunningExtraLineItemSchema)),
  totalNetAmount: a.optional(dunningNonNegativeNumberSchema),
  currency: a.optional(a.string()),
})

export const dunningCreateInputSchema = a.pipe(
  dunningCreateFlagsSchema,
  a.transform((flags) => dunningCreateInputFromFlags(flags) as a.InferInput<typeof dunningCreateOperationSchema>),
  dunningCreateOperationSchema,
)
