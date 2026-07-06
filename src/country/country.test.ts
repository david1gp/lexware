import { expect, test } from "bun:test"
import { countryList } from "./countryList.js"
import { lexwareTestClient } from "../shared/lexwareTestClient.test.js"

test("countryList gets countries", async () => {
  const { client, calls } = lexwareTestClient()
  await countryList(client)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/countries")
})
