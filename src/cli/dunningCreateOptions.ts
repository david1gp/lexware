import type { FlagParametersForType } from "@stricli/core"
import * as a from "valibot"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { DunningCreateInputFlags } from "./dunningCreateInput.js"

const dunningLineItemTypeSchema = a.picklist(["custom", "material", "service", "text"])

export const dunningCreateOptions = {
  precedingSalesVoucherId: cliOptionCreate(cliOptionSchemas.id, "Preceding sales voucher ID"),
  finalize: cliOptionCreate(cliOptionSchemas.boolean, "Finalize dunning", { optional: true }),
  title: cliOptionCreate(cliOptionSchemas.string, "Dunning title", { optional: true }),
  voucherDate: cliOptionCreate(cliOptionSchemas.dateTime, "Voucher date", { optional: true }),
  extraLineItemType: cliOptionCreate(dunningLineItemTypeSchema, "Extra line-item type", {
    optional: true,
    variadic: true,
  }),
  extraLineItemName: cliOptionCreate(cliOptionSchemas.string, "Extra line-item name", {
    optional: true,
    variadic: true,
  }),
  extraLineItemDescription: cliOptionCreate(cliOptionSchemas.string, "Extra line-item description", {
    optional: true,
    variadic: true,
  }),
  extraLineItemQuantity: cliOptionCreate(cliOptionSchemas.number, "Extra line-item quantity", {
    optional: true,
    variadic: true,
  }),
  extraLineItemUnitName: cliOptionCreate(cliOptionSchemas.string, "Extra line-item unit name", {
    optional: true,
    variadic: true,
  }),
  extraLineItemUnitPriceCurrency: cliOptionCreate(a.literal("EUR"), "Extra line-item unit-price currency", {
    optional: true,
    variadic: true,
  }),
  extraLineItemUnitPriceNetAmount: cliOptionCreate(cliOptionSchemas.number, "Extra line-item unit-price net amount", {
    optional: true,
    variadic: true,
  }),
  extraLineItemUnitPriceGrossAmount: cliOptionCreate(
    cliOptionSchemas.number,
    "Extra line-item unit-price gross amount",
    { optional: true, variadic: true },
  ),
  extraLineItemUnitPriceTaxRatePercentage: cliOptionCreate(
    cliOptionSchemas.number,
    "Extra line-item unit-price tax rate",
    { optional: true, variadic: true },
  ),
  extraLineItemDiscountPercentage: cliOptionCreate(cliOptionSchemas.number, "Extra line-item discount percentage", {
    optional: true,
    variadic: true,
  }),
  extraLineItemAmount: cliOptionCreate(cliOptionSchemas.number, "Extra line-item amount", {
    optional: true,
    variadic: true,
  }),
  totalNetAmount: cliOptionCreate(cliOptionSchemas.number, "Total net amount", { optional: true }),
  currency: cliOptionCreate(cliOptionSchemas.string, "Currency", { optional: true }),
} satisfies FlagParametersForType<DunningCreateInputFlags>
