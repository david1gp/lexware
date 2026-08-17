import { expect, test } from "bun:test"
import * as a from "valibot"
import { lexwareJsonResponse, lexwareRequestBodyJson, lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { dunningCreate } from "./dunningCreate.js"
import { dunningCreateInputSchema, dunningExtraLineItemSchema } from "./dunningSchemas.js"

test("dunningCreate fetches invoice then posts dunning", async () => {
  const { client, calls } = lexwareTestClient([
    lexwareJsonResponse({
      address: { contactId: "c1" },
      lineItems: [{ name: "base" }],
      taxConditions: { taxType: "net" },
    }),
    lexwareJsonResponse({ id: "d1" }),
  ])
  const result = await dunningCreate(client, {
    precedingSalesVoucherId: "i1",
    finalize: true,
    extraLineItems: [{ name: "fee" }],
  })
  expect(result.success).toBe(true)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/invoices/i1")
  expect(String(calls[1]?.input)).toBe("https://api.lexware.io/v1/dunnings?precedingSalesVoucherId=i1&finalize=true")
  expect(await lexwareRequestBodyJson(calls[1]!)).toMatchObject({
    lineItems: [{ name: "base" }, { name: "fee" }],
  })
})

test("dunning schemas validate concrete extra line items and preserve extension fields", () => {
  const valid = a.safeParse(dunningCreateInputSchema, {
    precedingSalesVoucherId: "i1",
    voucherDate: "2025-01-01T00:00",
    extraLineItems: [
      {
        type: "service",
        name: "Fee",
        quantity: 1,
        unitName: "item",
        unitPrice: { currency: "EUR", netAmount: 10, taxRatePercentage: 19 },
        futureField: "kept",
      },
    ],
    totalNetAmount: 10,
    currency: "EUR",
  })

  expect(valid.success).toBe(true)
  expect(valid.success && valid.output.extraLineItems?.[0]?.futureField).toBe("kept")
  expect(
    a.safeParse(dunningExtraLineItemSchema, { name: "Fee", unitPrice: { currency: "EUR", taxRatePercentage: 19 } })
      .success,
  ).toBe(false)
})

test("dunning schemas reject invalid top-level and extra line-item values", () => {
  expect(
    a.safeParse(dunningCreateInputSchema, {
      precedingSalesVoucherId: "i1",
      extraLineItems: [{ type: "service", name: "Fee", quantity: 1, unitName: "item" }],
    }).success,
  ).toBe(false)
  expect(
    a.safeParse(dunningCreateInputSchema, {
      precedingSalesVoucherId: "i1",
      extraLineItems: [],
    }).success,
  ).toBe(false)
  expect(
    a.safeParse(dunningCreateInputSchema, {
      precedingSalesVoucherId: "i1",
      voucherDate: "not-a-date",
      totalNetAmount: -1,
      currency: "USD",
    }).success,
  ).toBe(false)
})
