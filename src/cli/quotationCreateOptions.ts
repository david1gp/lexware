import type { FlagParametersForType } from "@stricli/core"
import * as a from "valibot"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { QuotationCreateInputFlags } from "./quotationCreateInput.js"

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

const quotationOptions = {
  title: cliOptionCreate(cliOptionSchemas.string, "Quotation title", { optional: true }),
  introduction: cliOptionCreate(cliOptionSchemas.string, "Quotation introduction", { optional: true }),
  remark: cliOptionCreate(cliOptionSchemas.string, "Quotation remark", { optional: true }),
  language: cliOptionCreate(a.picklist(["de", "en"]), "Quotation language", { optional: true }),
  printLayoutId: cliOptionCreate(cliOptionSchemas.id, "Quotation print-layout ID", { optional: true }),
  voucherDate: cliOptionCreate(cliOptionSchemas.dateTime, "Voucher date", { optional: true }),
  expirationDate: cliOptionCreate(cliOptionSchemas.dateTime, "Quotation expiration date", { optional: true }),
  addressContactId: cliOptionCreate(cliOptionSchemas.id, "Address contact ID", { optional: true }),
  addressName: cliOptionCreate(cliOptionSchemas.string, "Address name", { optional: true }),
  addressSupplement: cliOptionCreate(cliOptionSchemas.string, "Address supplement", { optional: true }),
  addressStreet: cliOptionCreate(cliOptionSchemas.string, "Address street", { optional: true }),
  addressCity: cliOptionCreate(cliOptionSchemas.string, "Address city", { optional: true }),
  addressZip: cliOptionCreate(cliOptionSchemas.string, "Address ZIP code", { optional: true }),
  addressCountryCode: cliOptionCreate(cliOptionSchemas.string, "Address country code", { optional: true }),
  lineItemId: cliOptionCreate(cliOptionSchemas.id, "Line-item ID", { optional: true, variadic: true }),
  lineItemType: cliOptionCreate(quotationLineItemTypeSchema, "Line-item type", { optional: true, variadic: true }),
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
  lineItemOptional: cliOptionCreate(cliOptionSchemas.boolean, "Line-item is optional", {
    optional: true,
    variadic: true,
  }),
  lineItemAlternative: cliOptionCreate(cliOptionSchemas.boolean, "Line-item is an alternative", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemParentIndex: cliOptionCreate(cliOptionSchemas.integer, "Subitem parent line-item index", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemId: cliOptionCreate(cliOptionSchemas.id, "Subitem ID", { optional: true, variadic: true }),
  lineItemSubItemType: cliOptionCreate(quotationLineItemTypeSchema, "Subitem type", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemName: cliOptionCreate(cliOptionSchemas.string, "Subitem name", { optional: true, variadic: true }),
  lineItemSubItemDescription: cliOptionCreate(cliOptionSchemas.string, "Subitem description", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemQuantity: cliOptionCreate(cliOptionSchemas.number, "Subitem quantity", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemUnitName: cliOptionCreate(cliOptionSchemas.string, "Subitem unit name", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemUnitPriceCurrency: cliOptionCreate(a.literal("EUR"), "Subitem unit-price currency", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemUnitPriceNetAmount: cliOptionCreate(cliOptionSchemas.number, "Subitem unit-price net amount", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemUnitPriceGrossAmount: cliOptionCreate(cliOptionSchemas.number, "Subitem unit-price gross amount", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemUnitPriceTaxRatePercentage: cliOptionCreate(cliOptionSchemas.number, "Subitem unit-price tax rate", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemDiscountPercentage: cliOptionCreate(cliOptionSchemas.number, "Subitem discount percentage", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemAmount: cliOptionCreate(cliOptionSchemas.number, "Subitem amount", {
    optional: true,
    variadic: true,
  }),
  lineItemSubItemAlternative: cliOptionCreate(cliOptionSchemas.boolean, "Subitem is an alternative", {
    optional: true,
    variadic: true,
  }),
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
  taxConditionsTaxType: cliOptionCreate(quotationTaxTypeSchema, "Tax type", { optional: true }),
  taxConditionsTaxSubType: cliOptionCreate(quotationTaxSubTypeSchema, "Tax subtype", { optional: true }),
  taxConditionsTaxTypeNote: cliOptionCreate(cliOptionSchemas.string, "Tax type note", { optional: true }),
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
} satisfies FlagParametersForType<QuotationCreateInputFlags>

const quotationCreateOptions = quotationOptions

export { quotationCreateOptions, quotationOptions }
