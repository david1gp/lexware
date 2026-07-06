import { expect, test } from "bun:test"
import { lexwareRequestBodyJson, lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { contactCompanyCreate } from "./contactCompanyCreate.js"
import { contactList } from "./contactList.js"

test("contactCompanyCreate posts to contacts", async () => {
  const { client, calls } = lexwareTestClient()
  await contactCompanyCreate(client, {
    roles: { customer: {} },
    company: { name: "ACME" },
  })
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/contacts")
  expect(calls[0]?.init?.method).toBe("POST")
  expect(await lexwareRequestBodyJson(calls[0]!)).toEqual({
    roles: { customer: {} },
    company: { name: "ACME" },
  })
})

test("contactList builds filters", async () => {
  const { client, calls } = lexwareTestClient()
  await contactList(client, {
    filter_email: "foo@example.com",
    filter_customer: true,
    size: 50,
  })
  expect(String(calls[0]?.input)).toBe(
    "https://api.lexware.io/v1/contacts?size=50&filter_email=foo%40example.com&filter_customer=true",
  )
})
