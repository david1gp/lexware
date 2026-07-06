import { expect, test } from "bun:test"
import { voucherListGet } from "./voucherListGet.js"
import { voucherListList } from "./voucherListList.js"
import { lexwareTestClient } from "../shared/lexwareTestClient.test.js"

test("voucherListGet gets hyphenated voucher list path", async () => {
  const { client, calls } = lexwareTestClient()
  await voucherListGet(client, "vl1")
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/voucher-lists/vl1")
})

test("voucherListList uses implementation list path", async () => {
  const { client, calls } = lexwareTestClient()
  await voucherListList(client, { status: "open", voucherNumber: "R-1" })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/voucherlist?status=open&voucherNumber=R-1")
})
