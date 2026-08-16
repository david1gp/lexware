import type { FlagParametersForType } from "@stricli/core"
import * as a from "valibot"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { VoucherCreateInputFlags } from "./voucherCreateInput.js"

const voucherLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])

const voucherOptions = {
  title: cliOptionCreate(cliOptionSchemas.string, "Voucher title", { optional: true }),
  voucherDate: cliOptionCreate(cliOptionSchemas.dateTime, "Voucher date", { optional: true }),
  addressContactId: cliOptionCreate(cliOptionSchemas.id, "Address contact ID", { optional: true }),
  addressName: cliOptionCreate(cliOptionSchemas.string, "Address name", { optional: true }),
  addressSupplement: cliOptionCreate(cliOptionSchemas.string, "Address supplement", { optional: true }),
  addressStreet: cliOptionCreate(cliOptionSchemas.string, "Address street", { optional: true }),
  addressCity: cliOptionCreate(cliOptionSchemas.string, "Address city", { optional: true }),
  addressZip: cliOptionCreate(cliOptionSchemas.string, "Address ZIP code", { optional: true }),
  addressCountryCode: cliOptionCreate(cliOptionSchemas.string, "Address country code", { optional: true }),
  lineItemType: cliOptionCreate(voucherLineItemTypeSchema, "Line-item type", { optional: true, variadic: true }),
  lineItemName: cliOptionCreate(cliOptionSchemas.string, "Line-item name", { optional: true, variadic: true }),
  lineItemDescription: cliOptionCreate(cliOptionSchemas.string, "Line-item description", {
    optional: true,
    variadic: true,
  }),
  lineItemQuantity: cliOptionCreate(cliOptionSchemas.number, "Line-item quantity", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitName: cliOptionCreate(cliOptionSchemas.string, "Line-item unit name", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceCurrency: cliOptionCreate(a.literal("EUR"), "Line-item unit-price currency", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceNetAmount: cliOptionCreate(cliOptionSchemas.number, "Line-item unit-price net amount", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceGrossAmount: cliOptionCreate(cliOptionSchemas.number, "Line-item unit-price gross amount", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceTaxRatePercentage: cliOptionCreate(cliOptionSchemas.number, "Line-item unit-price tax rate", {
    optional: true,
    variadic: true,
  }),
  lineItemDiscountPercentage: cliOptionCreate(cliOptionSchemas.number, "Line-item discount percentage", {
    optional: true,
    variadic: true,
  }),
  lineItemAmount: cliOptionCreate(cliOptionSchemas.number, "Line-item amount", { optional: true, variadic: true }),
} satisfies FlagParametersForType<VoucherCreateInputFlags>

const voucherCreateOptions = voucherOptions

export { voucherCreateOptions, voucherOptions }
