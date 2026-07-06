import { expect, test } from "bun:test"
import { voucherCreate } from "./voucherCreate.js"
import { voucherUpdate } from "./voucherUpdate.js"
import { lexwareTestClient } from "../shared/lexwareTestClient.test.js"

test("voucherCreate posts voucher", async () => {
  const { client, calls } = lexwareTestClient()
  await voucherCreate(client, { lineItems: [{ name: "item" }] })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/vouchers")
  expect(calls[0]?.init?.method).toBe("POST")
})

test("voucherUpdate uses singular voucher path", async () => {
  const { client, calls } = lexwareTestClient()
  await voucherUpdate(client, "v1", { lineItems: [{ name: "item" }] })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/voucher/v1")
  expect(calls[0]?.init?.method).toBe("PUT")
})
