import { expect, test } from "bun:test"
import * as a from "valibot"
import { lexwareRequestBodyJson, lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { contactCompanyCreate } from "./contactCompanyCreate.js"
import { contactList } from "./contactList.js"
import {
  contactAddressesSchema,
  contactCompanyCreateInputSchema,
  contactEmailAddressesSchema,
  contactNoteSchema,
  contactPhoneNumbersSchema,
  contactUpdateBodySchema,
  contactXRechnungSchema,
} from "./contactSchemas.js"
import { contactUpdate } from "./contactUpdate.js"

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

test("contact request schemas keep contact cross-field rules", () => {
  expect(
    a.safeParse(contactCompanyCreateInputSchema, {
      roles: {},
      company: { name: "ACME" },
    }).success,
  ).toBe(false)
  expect(
    a.safeParse(contactCompanyCreateInputSchema, {
      roles: { customer: "yes" },
      company: { name: "ACME" },
    }).success,
  ).toBe(false)

  expect(
    a.safeParse(contactCompanyCreateInputSchema, {
      roles: { customer: {} },
      company: { name: "ACME", contactPersons: [{ firstName: "Ada" }] },
    }).success,
  ).toBe(false)

  expect(
    a.safeParse(contactCompanyCreateInputSchema, {
      roles: { customer: {} },
      company: { name: "ACME" },
      addresses: { billing: [{ city: "Berlin" }] },
    }).success,
  ).toBe(false)

  expect(a.safeParse(contactXRechnungSchema, { buyerReference: "buyer" }).success).toBe(false)
  expect(a.safeParse(contactAddressesSchema, { billing: [{ countryCode: "DE" }, { countryCode: "DE" }] }).success).toBe(
    false,
  )
  expect(a.safeParse(contactAddressesSchema, { billing: [{ countryCode: "de" }] }).success).toBe(false)
  expect(a.safeParse(contactAddressesSchema, { billing: [{ countryCode: "DEU" }] }).success).toBe(false)
  expect(a.safeParse(contactEmailAddressesSchema, { business: ["one", "two"] }).success).toBe(false)
  expect(a.safeParse(contactPhoneNumbersSchema, { mobile: ["one", "two"] }).success).toBe(false)
  expect(a.safeParse(contactNoteSchema, "x".repeat(1001)).success).toBe(false)
  expect(
    a.safeParse(contactUpdateBodySchema, {
      roles: { customer: {} },
    }).success,
  ).toBe(true)
  expect(a.safeParse(contactUpdateBodySchema, { version: 3 }).success).toBe(true)
  const partialUpdate = {
    company: { taxNumber: "123", futureCompanyField: true },
    person: { firstName: "Ada" },
    futureField: { enabled: true },
  }
  const partialUpdateResult = a.safeParse(contactUpdateBodySchema, partialUpdate)
  expect(partialUpdateResult.success).toBe(true)
  if (!partialUpdateResult.success) return
  expect(partialUpdateResult.output).toEqual(partialUpdate)
  expect(a.safeParse(contactUpdateBodySchema, { version: "3" }).success).toBe(false)
  expect(a.safeParse(contactUpdateBodySchema, { company: { taxNumber: 123 } }).success).toBe(false)
})

test("contactUpdate validates its body before sending", async () => {
  const { client, calls } = lexwareTestClient()
  const invalid = await contactUpdate(client, "contact-1", { version: "1" })
  expect(invalid.success).toBe(false)
  expect(calls).toHaveLength(0)

  const valid = await contactUpdate(client, "contact-1", {
    version: 3,
    futureField: { enabled: true },
  })
  expect(valid.success).toBe(true)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/contacts/contact-1")
  expect(calls[0]?.init?.method).toBe("PUT")
  expect(await lexwareRequestBodyJson(calls[0]!)).toEqual({
    version: 3,
    futureField: { enabled: true },
  })
})
