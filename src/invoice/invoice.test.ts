import { expect, test } from "bun:test"
import { lexwareRequestBodyJson, lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { invoiceCreate } from "./invoiceCreate.js"
import { invoiceUpdate } from "./invoiceUpdate.js"

test("invoiceCreate sends finalize query", async () => {
  const { client, calls } = lexwareTestClient()
  await invoiceCreate(client, {
    finalize: true,
    invoice: { lineItems: [{ name: "item" }] },
  })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/invoices?finalize=true")
  expect(await lexwareRequestBodyJson(calls[0]!)).toEqual({
    lineItems: [{ name: "item" }],
  })
})

test("invoiceUpdate uses singular invoice path", async () => {
  const { client, calls } = lexwareTestClient()
  await invoiceUpdate(client, "i1", { lineItems: [{ name: "item" }] })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/invoice/i1")
  expect(calls[0]?.init?.method).toBe("PUT")
})
