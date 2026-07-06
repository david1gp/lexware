import { expect, test } from "bun:test"
import { lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { printLayoutList } from "./printLayoutList.js"

test("printLayoutList gets print layouts", async () => {
  const { client, calls } = lexwareTestClient()
  await printLayoutList(client)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/print-layouts")
})
