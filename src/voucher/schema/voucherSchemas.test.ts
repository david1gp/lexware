import { expect, test } from "bun:test"
import * as a from "valibot"
import { voucherBodyInputFromFlags } from "../cli/voucherCreateInput.js"
import {
  voucherAddressSchema,
  voucherBodySchema,
  voucherCreateInputSchema,
  voucherListInputSchema,
  voucherUnitPriceSchema,
  voucherUpdateInputSchema,
} from "./voucherSchemas.js"

test("voucher body schema validates the assembled address and line-item rules", () => {
  const parsed = a.safeParse(
    voucherBodySchema,
    voucherBodyInputFromFlags({
      title: "Office supplies",
      voucherDate: "2025-01-01T00:00",
      addressName: "Example GmbH",
      addressCountryCode: "DE",
      lineItemName: ["Paper"],
      lineItemQuantity: [2],
      lineItemUnitPriceCurrency: ["EUR"],
      lineItemUnitPriceNetAmount: [10],
      lineItemUnitPriceTaxRatePercentage: [19],
    }),
  )

  expect(parsed.success).toBe(true)
  expect(parsed.success && parsed.output.lineItems[0]?.unitPrice).toEqual({
    currency: "EUR",
    netAmount: 10,
    taxRatePercentage: 19,
  })
})

test("voucher domain schemas reject invalid nested values", () => {
  expect(a.safeParse(voucherAddressSchema, { name: "Example GmbH" }).success).toBe(false)
  expect(a.safeParse(voucherUnitPriceSchema, { currency: "EUR", taxRatePercentage: 19 }).success).toBe(false)
  expect(
    a.safeParse(voucherBodySchema, {
      voucherDate: "not-a-date",
      lineItems: [{ quantity: -1 }],
    }).success,
  ).toBe(false)
})

test("voucher create validation rejects mismatched or oversized variadic arrays", () => {
  expect(
    a.safeParse(
      voucherCreateInputSchema,
      voucherBodyInputFromFlags({ lineItemName: ["Paper", "Pens"], lineItemQuantity: [2] }),
    ).success,
  ).toBe(false)
  expect(
    a.safeParse(voucherCreateInputSchema, {
      lineItems: Array.from({ length: 301 }, () => ({ name: "Item" })),
    }).success,
  ).toBe(false)
})

test("voucher final schemas cover create, update, and list inputs", () => {
  const body = { lineItems: [{ name: "Paper" }] }

  expect(a.safeParse(voucherCreateInputSchema, body).success).toBe(true)
  expect(a.safeParse(voucherUpdateInputSchema, { id: "voucher-1", voucher: body }).success).toBe(true)
  expect(a.safeParse(voucherListInputSchema, { page: 2, status: "open" }).success).toBe(true)
})
