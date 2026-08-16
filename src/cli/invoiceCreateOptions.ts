import type { FlagParametersForType } from "@stricli/core"
import * as a from "valibot"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { InvoiceCreateInputFlags } from "./invoiceCreateInput.js"

export const invoiceOptions = {
  title: cliOptionCreate(cliOptionSchemas.string, "Invoice title", { optional: true }),
  introduction: cliOptionCreate(cliOptionSchemas.string, "Invoice introduction", { optional: true }),
  remark: cliOptionCreate(cliOptionSchemas.string, "Invoice remark", { optional: true }),
  voucherDate: cliOptionCreate(cliOptionSchemas.dateTime, "Voucher date", { optional: true }),
  addressContactId: cliOptionCreate(cliOptionSchemas.id, "Address contact ID", { optional: true }),
  addressName: cliOptionCreate(cliOptionSchemas.string, "Address name", { optional: true }),
  addressSupplement: cliOptionCreate(cliOptionSchemas.string, "Address supplement", { optional: true }),
  addressStreet: cliOptionCreate(cliOptionSchemas.string, "Address street", { optional: true }),
  addressCity: cliOptionCreate(cliOptionSchemas.string, "Address city", { optional: true }),
  addressZip: cliOptionCreate(cliOptionSchemas.string, "Address ZIP code", { optional: true }),
  addressCountryCode: cliOptionCreate(cliOptionSchemas.string, "Address country code", { optional: true }),
  lineItemId: cliOptionCreate(cliOptionSchemas.id, "Line-item ID", { optional: true, variadic: true }),
  lineItemType: cliOptionCreate(a.picklist(["custom", "material", "service", "text"]), "Line-item type", {
    optional: true,
    variadic: true,
  }),
  lineItemName: cliOptionCreate(cliOptionSchemas.string, "Line-item name", { optional: true, variadic: true }),
  lineItemDescription: cliOptionCreate(cliOptionSchemas.string, "Line-item description", {
    optional: true,
    variadic: true,
  }),
  lineItemQuantity: cliOptionCreate(cliOptionSchemas.number, "Line-item quantity", { optional: true, variadic: true }),
  lineItemUnitName: cliOptionCreate(cliOptionSchemas.string, "Line-item unit name", { optional: true, variadic: true }),
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
  totalPriceCurrency: cliOptionCreate(a.literal("EUR"), "Total-price currency", { optional: true }),
  totalPriceTotalNetAmount: cliOptionCreate(cliOptionSchemas.number, "Total net amount", { optional: true }),
  totalPriceTotalGrossAmount: cliOptionCreate(cliOptionSchemas.number, "Total gross amount", { optional: true }),
  totalPriceTotalTaxAmount: cliOptionCreate(cliOptionSchemas.number, "Total tax amount", { optional: true }),
  totalPriceTotalDiscountAbsolute: cliOptionCreate(cliOptionSchemas.number, "Total discount amount", {
    optional: true,
  }),
  totalPriceTotalDiscountPercentage: cliOptionCreate(cliOptionSchemas.number, "Total discount percentage", {
    optional: true,
  }),
  taxConditionsTaxType: cliOptionCreate(
    a.picklist([
      "net",
      "gross",
      "vatfree",
      "intraCommunitySupply",
      "constructionService13b",
      "externalService13b",
      "thirdPartyCountryService",
      "thirdPartyCountryDelivery",
    ]),
    "Tax type",
    { optional: true },
  ),
  taxConditionsTaxSubType: cliOptionCreate(a.picklist(["distanceSales", "electronicServices"]), "Tax subtype", {
    optional: true,
  }),
  taxConditionsTaxTypeNote: cliOptionCreate(cliOptionSchemas.string, "Tax type note", { optional: true }),
  shippingConditionsShippingType: cliOptionCreate(
    a.picklist(["service", "serviceperiod", "delivery", "deliveryperiod", "none"]),
    "Shipping type",
    { optional: true },
  ),
  shippingConditionsShippingDate: cliOptionCreate(cliOptionSchemas.dateTime, "Shipping date", { optional: true }),
  shippingConditionsShippingEndDate: cliOptionCreate(cliOptionSchemas.dateTime, "Shipping end date", {
    optional: true,
  }),
  paymentConditionsPaymentTermLabel: cliOptionCreate(cliOptionSchemas.string, "Payment-term label", {
    optional: true,
  }),
  paymentConditionsPaymentTermDuration: cliOptionCreate(cliOptionSchemas.integer, "Payment-term duration", {
    optional: true,
  }),
  paymentConditionsPaymentDiscountConditionsDiscountPercentage: cliOptionCreate(
    cliOptionSchemas.number,
    "Payment discount percentage",
    { optional: true },
  ),
  paymentConditionsPaymentDiscountConditionsDiscountRange: cliOptionCreate(
    cliOptionSchemas.integer,
    "Payment discount range",
    { optional: true },
  ),
  xRechnungBuyerReference: cliOptionCreate(cliOptionSchemas.string, "XRechnung buyer reference", { optional: true }),
  version: cliOptionCreate(cliOptionSchemas.integer, "Invoice version", { optional: true }),
} satisfies FlagParametersForType<Omit<InvoiceCreateInputFlags, "finalize">>

export const invoiceCreateOptions = {
  ...invoiceOptions,
  finalize: cliOptionCreate(cliOptionSchemas.boolean, "Finalize invoice", { optional: true }),
} satisfies FlagParametersForType<InvoiceCreateInputFlags>
