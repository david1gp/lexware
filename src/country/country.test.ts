import { expect, test } from "bun:test"
import { lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { countryList } from "./countryList.js"

test("countryList gets countries", async () => {
  const { client, calls } = lexwareTestClient()
  await countryList(client)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/countries")
})
