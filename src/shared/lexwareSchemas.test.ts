import { expect, test } from "bun:test"
import * as a from "valibot"
import {
  lexwareAddressSchema,
  lexwareCountryCodeSchema,
  lexwareCurrencySchema,
  lexwareDateTimeSchema,
  lexwareIdSchema,
  lexwareLineItemSchema,
  lexwareNonNegativeIntegerSchema,
  lexwareNonNegativeNumberSchema,
  lexwarePaymentConditionsSchema,
  lexwarePercentageSchema,
  lexwareTaxConditionsSchema,
  lexwareTotalPriceSchema,
  lexwareUnitPriceSchema,
} from "./lexwareSchemas.js"

test("shared scalar schemas accept the common Lexware values", () => {
  expect(a.safeParse(lexwareIdSchema, "id").success).toBe(true)
  expect(a.safeParse(lexwareIdSchema, "").success).toBe(false)
  expect(a.safeParse(lexwareCountryCodeSchema, "DE").success).toBe(true)
  expect(a.safeParse(lexwareCountryCodeSchema, "de").success).toBe(false)
  expect(a.safeParse(lexwareDateTimeSchema, "2025-01-01T00:00").success).toBe(true)
  expect(a.safeParse(lexwareNonNegativeNumberSchema, 0).success).toBe(true)
  expect(a.safeParse(lexwareNonNegativeNumberSchema, -1).success).toBe(false)
  expect(a.safeParse(lexwareNonNegativeIntegerSchema, 1.5).success).toBe(false)
  expect(a.safeParse(lexwarePercentageSchema, 100).success).toBe(true)
  expect(a.safeParse(lexwarePercentageSchema, 100.1).success).toBe(false)
  expect(a.safeParse(lexwareCurrencySchema, "EUR").success).toBe(true)
})

test("the shared address keeps forward-compatible fields and its common identity rule", () => {
  const contactAddress = a.safeParse(lexwareAddressSchema, {
    contactId: "contact-1",
    futureField: "kept",
  })
  const namedAddress = a.safeParse(lexwareAddressSchema, {
    name: "Example GmbH",
    countryCode: "DE",
  })

  expect(contactAddress.success).toBe(true)
  expect(contactAddress.success && contactAddress.output.futureField).toBe("kept")
  expect(namedAddress.success).toBe(true)
  expect(a.safeParse(lexwareAddressSchema, { name: "Example GmbH" }).success).toBe(false)
})

test("shared prices and totals enforce common amount rules without closing objects", () => {
  const price = a.safeParse(lexwareUnitPriceSchema, {
    currency: "EUR",
    netAmount: 0,
    taxRatePercentage: 19,
    futureField: true,
  })

  expect(price.success).toBe(true)
  expect(price.success && price.output.futureField).toBe(true)
  expect(a.safeParse(lexwareUnitPriceSchema, { currency: "EUR", taxRatePercentage: 19 }).success).toBe(false)
  expect(a.safeParse(lexwareUnitPriceSchema, { currency: "EUR", netAmount: -1, taxRatePercentage: 19 }).success).toBe(
    false,
  )
  expect(
    a.safeParse(lexwareTotalPriceSchema, {
      currency: "EUR",
      totalNetAmount: 12,
      futureField: "kept",
    }).success,
  ).toBe(true)
  expect(a.safeParse(lexwareTotalPriceSchema, { currency: "EUR", totalTaxAmount: -1 }).success).toBe(false)
})

test("shared tax, payment, and line-item bases retain common structure", () => {
  expect(
    a.safeParse(lexwareTaxConditionsSchema, {
      taxType: "net",
      taxSubType: "distanceSales",
      futureField: true,
    }).success,
  ).toBe(true)
  expect(
    a.safeParse(lexwarePaymentConditionsSchema, {
      paymentTermDuration: 30,
      paymentDiscountConditions: { discountPercentage: 2, discountRange: 10 },
    }).success,
  ).toBe(true)
  expect(
    a.safeParse(lexwarePaymentConditionsSchema, {
      paymentTermDuration: -1,
    }).success,
  ).toBe(false)

  const lineItem = a.safeParse(lexwareLineItemSchema, {
    name: "Item",
    futureField: "kept",
  })
  expect(lineItem.success).toBe(true)
  expect(lineItem.success && lineItem.output.futureField).toBe("kept")
})
