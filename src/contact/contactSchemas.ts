import * as a from "valibot"

export const contactAddressSchema = a.looseObject({
  supplement: a.optional(a.string()),
  street: a.optional(a.string()),
  zip: a.optional(a.string()),
  city: a.optional(a.string()),
  countryCode: a.optional(a.string()),
})

export const contactCompanyBodySchema = a.looseObject({
  roles: a.looseObject({
    customer: a.optional(a.unknown()),
    vendor: a.optional(a.unknown()),
  }),
  company: a.looseObject({
    name: a.pipe(a.string(), a.minLength(1)),
    allowTaxFreeInvoices: a.optional(a.boolean()),
    contactPersons: a.optional(a.array(a.unknown())),
  }),
  addresses: a.optional(a.unknown()),
  archived: a.optional(a.boolean()),
  version: a.optional(a.number()),
})

export const contactPersonBodySchema = a.looseObject({
  roles: a.looseObject({
    customer: a.optional(a.unknown()),
    vendor: a.optional(a.unknown()),
  }),
  person: a.looseObject({
    salutation: a.optional(a.string()),
    firstName: a.pipe(a.string(), a.minLength(1)),
    lastName: a.pipe(a.string(), a.minLength(1)),
  }),
  addresses: a.optional(a.unknown()),
  archived: a.optional(a.boolean()),
  version: a.optional(a.number()),
})

export const contactListInputSchema = a.object({
  page: a.optional(a.number()),
  size: a.optional(a.number()),
  filter_email: a.optional(a.string()),
  filter_name: a.optional(a.string()),
  filter_number: a.optional(a.string()),
  filter_customer: a.optional(a.boolean()),
  filter_vendor: a.optional(a.boolean()),
})

export type ContactCompanyBody = a.InferOutput<typeof contactCompanyBodySchema>
export type ContactPersonBody = a.InferOutput<typeof contactPersonBodySchema>
export type ContactListInput = a.InferOutput<typeof contactListInputSchema>
