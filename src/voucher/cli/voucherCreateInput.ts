import type { VoucherAddress, VoucherBody, VoucherLineItem, VoucherUnitPrice } from "../schema/voucherSchemas.js"

type VoucherCreateInputFlags = {
  readonly title?: VoucherBody["title"]
  readonly voucherDate?: VoucherBody["voucherDate"]
  readonly addressContactId?: VoucherAddress["contactId"]
  readonly addressName?: VoucherAddress["name"]
  readonly addressSupplement?: VoucherAddress["supplement"]
  readonly addressStreet?: VoucherAddress["street"]
  readonly addressCity?: VoucherAddress["city"]
  readonly addressZip?: VoucherAddress["zip"]
  readonly addressCountryCode?: VoucherAddress["countryCode"]
  readonly lineItemType?: NonNullable<VoucherLineItem["type"]>[]
  readonly lineItemName?: NonNullable<VoucherLineItem["name"]>[]
  readonly lineItemDescription?: NonNullable<VoucherLineItem["description"]>[]
  readonly lineItemQuantity?: NonNullable<VoucherLineItem["quantity"]>[]
  readonly lineItemUnitName?: NonNullable<VoucherLineItem["unitName"]>[]
  readonly lineItemUnitPriceCurrency?: NonNullable<VoucherUnitPrice["currency"]>[]
  readonly lineItemUnitPriceNetAmount?: NonNullable<VoucherUnitPrice["netAmount"]>[]
  readonly lineItemUnitPriceGrossAmount?: NonNullable<VoucherUnitPrice["grossAmount"]>[]
  readonly lineItemUnitPriceTaxRatePercentage?: NonNullable<VoucherUnitPrice["taxRatePercentage"]>[]
  readonly lineItemDiscountPercentage?: NonNullable<VoucherLineItem["discountPercentage"]>[]
  readonly lineItemAmount?: NonNullable<VoucherLineItem["lineItemAmount"]>[]
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
  const arrays = voucherLineItemFlagArrays(flags)
  const itemCount = arrays[0]?.length ?? 0
  const arraysHaveMatchingCardinality = arrays.every((values) => values.length === itemCount)
  const addressProvided = [
    flags.addressContactId,
    flags.addressName,
    flags.addressSupplement,
    flags.addressStreet,
    flags.addressCity,
    flags.addressZip,
    flags.addressCountryCode,
  ].some((value) => value !== undefined)

  const lineItems = Array.from({ length: arraysHaveMatchingCardinality ? itemCount : 0 }, (_, index) => ({
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

export { voucherBodyInputFromFlags }
