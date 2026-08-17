import type { FlagParametersForType } from "@stricli/core"
import * as a from "valibot"
import {
  voucherAddressSchema,
  voucherBodySchema,
  voucherLineItemSchema,
  voucherUnitPriceSchema,
} from "../voucher/voucherSchemas.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { VoucherCreateInputFlags } from "./voucherCreateInput.js"

const voucherOptions = {
  title: cliOptionCreate(a.unwrap(voucherBodySchema.entries.title), "Voucher title", { optional: true }),
  voucherDate: cliOptionCreate(
    a.pipe(cliOptionSchemas.dateTime, a.unwrap(voucherBodySchema.entries.voucherDate)),
    "Voucher date",
    { optional: true },
  ),
  addressContactId: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.contactId), "Address contact ID", {
    optional: true,
  }),
  addressName: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.name), "Address name", { optional: true }),
  addressSupplement: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.supplement), "Address supplement", {
    optional: true,
  }),
  addressStreet: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.street), "Address street", {
    optional: true,
  }),
  addressCity: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.city), "Address city", { optional: true }),
  addressZip: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.zip), "Address ZIP code", { optional: true }),
  addressCountryCode: cliOptionCreate(a.unwrap(voucherAddressSchema.entries.countryCode), "Address country code", {
    optional: true,
  }),
  lineItemType: cliOptionCreate(a.unwrap(voucherLineItemSchema.entries.type), "Line-item type", {
    optional: true,
    variadic: true,
  }),
  lineItemName: cliOptionCreate(a.unwrap(voucherLineItemSchema.entries.name), "Line-item name", {
    optional: true,
    variadic: true,
  }),
  lineItemDescription: cliOptionCreate(a.unwrap(voucherLineItemSchema.entries.description), "Line-item description", {
    optional: true,
    variadic: true,
  }),
  lineItemQuantity: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, a.unwrap(voucherLineItemSchema.entries.quantity)),
    "Line-item quantity",
    {
      optional: true,
      variadic: true,
    },
  ),
  lineItemUnitName: cliOptionCreate(a.unwrap(voucherLineItemSchema.entries.unitName), "Line-item unit name", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceCurrency: cliOptionCreate(voucherUnitPriceSchema.entries.currency, "Line-item unit-price currency", {
    optional: true,
    variadic: true,
  }),
  lineItemUnitPriceNetAmount: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, a.unwrap(voucherUnitPriceSchema.entries.netAmount)),
    "Line-item unit-price net amount",
    { optional: true, variadic: true },
  ),
  lineItemUnitPriceGrossAmount: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, a.unwrap(voucherUnitPriceSchema.entries.grossAmount)),
    "Line-item unit-price gross amount",
    { optional: true, variadic: true },
  ),
  lineItemUnitPriceTaxRatePercentage: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, voucherUnitPriceSchema.entries.taxRatePercentage),
    "Line-item unit-price tax rate",
    { optional: true, variadic: true },
  ),
  lineItemDiscountPercentage: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, a.unwrap(voucherLineItemSchema.entries.discountPercentage)),
    "Line-item discount percentage",
    { optional: true, variadic: true },
  ),
  lineItemAmount: cliOptionCreate(
    a.pipe(cliOptionSchemas.number, a.unwrap(voucherLineItemSchema.entries.lineItemAmount)),
    "Line-item amount",
    { optional: true, variadic: true },
  ),
} satisfies FlagParametersForType<VoucherCreateInputFlags>

const voucherCreateOptions = voucherOptions

export { voucherCreateOptions, voucherOptions }
