import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { contactCompanyCreate } from "../contact/contactCompanyCreate.js"
import { contactDelete } from "../contact/contactDelete.js"
import { contactGet } from "../contact/contactGet.js"
import { contactList } from "../contact/contactList.js"
import { contactPersonCreate } from "../contact/contactPersonCreate.js"
import { contactUpdate } from "../contact/contactUpdate.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"

const contactRoleSchema = a.pipe(
  a.object({
    customer: a.optional(a.object({})),
    vendor: a.optional(a.object({})),
  }),
  a.check(
    (input) => input.customer !== undefined || input.vendor !== undefined,
    "At least one contact role is required",
  ),
)

const contactCompanyContactPersonSchema = a.object({
  salutation: a.optional(a.string()),
  firstName: a.optional(a.string()),
  lastName: cliOptionSchemas.nonEmptyString,
  primary: a.optional(a.boolean()),
  emailAddress: a.optional(a.string()),
  phoneNumber: a.optional(a.string()),
})

const contactCompanySchema = a.object({
  name: cliOptionSchemas.nonEmptyString,
  taxNumber: a.optional(a.string()),
  vatRegistrationId: a.optional(a.string()),
  allowTaxFreeInvoices: a.optional(a.boolean()),
  contactPersons: a.optional(a.pipe(a.array(contactCompanyContactPersonSchema), a.maxLength(1))),
})

const contactPersonSchema = a.object({
  salutation: a.optional(a.string()),
  firstName: cliOptionSchemas.nonEmptyString,
  lastName: cliOptionSchemas.nonEmptyString,
})

const contactAddressSchema = a.object({
  supplement: a.optional(a.string()),
  street: a.optional(a.string()),
  zip: a.optional(a.string()),
  city: a.optional(a.string()),
  countryCode: cliOptionSchemas.nonEmptyString,
})

const contactAddressesSchema = a.object({
  billing: a.optional(a.pipe(a.array(contactAddressSchema), a.maxLength(1))),
  shipping: a.optional(a.pipe(a.array(contactAddressSchema), a.maxLength(1))),
})

const contactXRechnungSchema = a.pipe(
  a.object({
    buyerReference: a.optional(a.string()),
    vendorNumberAtCustomer: a.optional(a.string()),
  }),
  a.check(
    (input) =>
      (input.buyerReference === undefined && input.vendorNumberAtCustomer === undefined) ||
      (input.buyerReference !== undefined && input.vendorNumberAtCustomer !== undefined),
    "XRechnung buyer reference and vendor number must be provided together",
  ),
)

const contactEmailAddressesSchema = a.object({
  business: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  office: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  private: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  other: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
})

const contactPhoneNumbersSchema = a.object({
  business: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  office: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  mobile: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  private: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  fax: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
  other: a.optional(a.pipe(a.array(a.string()), a.maxLength(1))),
})

const contactInputEntries = {
  roles: contactRoleSchema,
  company: a.optional(contactCompanySchema),
  person: a.optional(contactPersonSchema),
  addresses: a.optional(contactAddressesSchema),
  xRechnung: a.optional(contactXRechnungSchema),
  emailAddresses: a.optional(contactEmailAddressesSchema),
  phoneNumbers: a.optional(contactPhoneNumbersSchema),
  note: a.optional(a.pipe(a.string(), a.maxLength(1000))),
  archived: a.optional(a.boolean()),
  version: a.optional(a.number()),
} as const

const contactCompanyCreateInputSchema = a.object({
  ...contactInputEntries,
  company: contactCompanySchema,
})

const contactPersonCreateInputSchema = a.object({
  ...contactInputEntries,
  person: contactPersonSchema,
})

const contactUpdateBodySchema = a.pipe(
  a.object(contactInputEntries),
  a.check(
    (input) =>
      (input.company === undefined && input.person !== undefined) ||
      (input.company !== undefined && input.person === undefined),
    "Exactly one company or person contact must be provided",
  ),
)

const contactUpdateInputSchema = a.object({
  id: cliOptionSchemas.id,
  body: contactUpdateBodySchema,
})

type ContactCommonFlags = CliClientInput & {
  readonly customer?: boolean
  readonly vendor?: boolean
  readonly billingSupplement?: string
  readonly billingStreet?: string
  readonly billingZip?: string
  readonly billingCity?: string
  readonly billingCountryCode?: string
  readonly shippingSupplement?: string
  readonly shippingStreet?: string
  readonly shippingZip?: string
  readonly shippingCity?: string
  readonly shippingCountryCode?: string
  readonly xRechnungBuyerReference?: string
  readonly xRechnungVendorNumberAtCustomer?: string
  readonly emailBusiness?: string
  readonly emailOffice?: string
  readonly emailPrivate?: string
  readonly emailOther?: string
  readonly phoneBusiness?: string
  readonly phoneOffice?: string
  readonly phoneMobile?: string
  readonly phonePrivate?: string
  readonly phoneFax?: string
  readonly phoneOther?: string
  readonly note?: string
  readonly archived?: boolean
  readonly version?: number
}

type ContactCompanyFields = {
  readonly companyName?: string
  readonly companyTaxNumber?: string
  readonly companyVatRegistrationId?: string
  readonly companyAllowTaxFreeInvoices?: boolean
  readonly contactPersonSalutation?: string
  readonly contactPersonFirstName?: string
  readonly contactPersonLastName?: string
  readonly contactPersonPrimary?: boolean
  readonly contactPersonEmailAddress?: string
  readonly contactPersonPhoneNumber?: string
}

type ContactPersonFields = {
  readonly personSalutation?: string
  readonly personFirstName?: string
  readonly personLastName?: string
}

type ContactBodyFlags = ContactCommonFlags & ContactCompanyFields & ContactPersonFields

type ContactCompanyCreateFlags = ContactCommonFlags &
  ContactCompanyFields & {
    readonly companyName: string
  }

type ContactPersonCreateFlags = ContactCommonFlags &
  ContactPersonFields & {
    readonly personFirstName: string
    readonly personLastName: string
  }

type ContactUpdateFlags = ContactCommonFlags &
  ContactCompanyFields &
  ContactPersonFields & {
    readonly id: string
  }

const contactCommonOptions = {
  customer: cliOptionCreate(cliOptionSchemas.boolean, "Add the customer role", { optional: true }),
  vendor: cliOptionCreate(cliOptionSchemas.boolean, "Add the vendor role", { optional: true }),
  billingSupplement: cliOptionCreate(cliOptionSchemas.string, "Billing address supplement", { optional: true }),
  billingStreet: cliOptionCreate(cliOptionSchemas.string, "Billing street and number", { optional: true }),
  billingZip: cliOptionCreate(cliOptionSchemas.string, "Billing postal code", { optional: true }),
  billingCity: cliOptionCreate(cliOptionSchemas.string, "Billing city", { optional: true }),
  billingCountryCode: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Billing ISO 3166 alpha-2 country code", {
    optional: true,
  }),
  shippingSupplement: cliOptionCreate(cliOptionSchemas.string, "Shipping address supplement", { optional: true }),
  shippingStreet: cliOptionCreate(cliOptionSchemas.string, "Shipping street and number", { optional: true }),
  shippingZip: cliOptionCreate(cliOptionSchemas.string, "Shipping postal code", { optional: true }),
  shippingCity: cliOptionCreate(cliOptionSchemas.string, "Shipping city", { optional: true }),
  shippingCountryCode: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Shipping ISO 3166 alpha-2 country code", {
    optional: true,
  }),
  xRechnungBuyerReference: cliOptionCreate(cliOptionSchemas.string, "XRechnung buyer reference", { optional: true }),
  xRechnungVendorNumberAtCustomer: cliOptionCreate(cliOptionSchemas.string, "Vendor number at customer", {
    optional: true,
  }),
  emailBusiness: cliOptionCreate(cliOptionSchemas.string, "Business email address", { optional: true }),
  emailOffice: cliOptionCreate(cliOptionSchemas.string, "Office email address", { optional: true }),
  emailPrivate: cliOptionCreate(cliOptionSchemas.string, "Private email address", { optional: true }),
  emailOther: cliOptionCreate(cliOptionSchemas.string, "Other email address", { optional: true }),
  phoneBusiness: cliOptionCreate(cliOptionSchemas.string, "Business phone number", { optional: true }),
  phoneOffice: cliOptionCreate(cliOptionSchemas.string, "Office phone number", { optional: true }),
  phoneMobile: cliOptionCreate(cliOptionSchemas.string, "Mobile phone number", { optional: true }),
  phonePrivate: cliOptionCreate(cliOptionSchemas.string, "Private phone number", { optional: true }),
  phoneFax: cliOptionCreate(cliOptionSchemas.string, "Fax number", { optional: true }),
  phoneOther: cliOptionCreate(cliOptionSchemas.string, "Other phone number", { optional: true }),
  note: cliOptionCreate(cliOptionSchemas.string, "Contact note", { optional: true }),
  archived: cliOptionCreate(cliOptionSchemas.boolean, "Archived contact flag", { optional: true }),
  version: cliOptionCreate(cliOptionSchemas.integer, "Contact version", { optional: true }),
} as const

const contactCompanyOptions = {
  companyName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Company name"),
  companyTaxNumber: cliOptionCreate(cliOptionSchemas.string, "Company tax number", { optional: true }),
  companyVatRegistrationId: cliOptionCreate(cliOptionSchemas.string, "Company VAT registration ID", { optional: true }),
  companyAllowTaxFreeInvoices: cliOptionCreate(cliOptionSchemas.boolean, "Allow tax-free invoices", { optional: true }),
  contactPersonSalutation: cliOptionCreate(cliOptionSchemas.string, "Company contact person salutation", {
    optional: true,
  }),
  contactPersonFirstName: cliOptionCreate(cliOptionSchemas.string, "Company contact person first name", {
    optional: true,
  }),
  contactPersonLastName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Company contact person last name", {
    optional: true,
  }),
  contactPersonPrimary: cliOptionCreate(cliOptionSchemas.boolean, "Company contact person is primary", {
    optional: true,
  }),
  contactPersonEmailAddress: cliOptionCreate(cliOptionSchemas.string, "Company contact person email address", {
    optional: true,
  }),
  contactPersonPhoneNumber: cliOptionCreate(cliOptionSchemas.string, "Company contact person phone number", {
    optional: true,
  }),
} as const

const contactPersonOptions = {
  personSalutation: cliOptionCreate(cliOptionSchemas.string, "Person salutation", { optional: true }),
  personFirstName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Person first name", { optional: true }),
  personLastName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Person last name", { optional: true }),
} as const

const contactCompanyUpdateOptions = {
  ...contactCompanyOptions,
  companyName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Company name", { optional: true }),
} as const

const contactPersonCreateOptions = {
  ...contactPersonOptions,
  personFirstName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Person first name"),
  personLastName: cliOptionCreate(cliOptionSchemas.nonEmptyString, "Person last name"),
} as const

function contactAddressFromFlags(
  supplement: string | undefined,
  street: string | undefined,
  zip: string | undefined,
  city: string | undefined,
  countryCode: string | undefined,
):
  | {
      readonly city: string | undefined
      readonly countryCode: string | undefined
      readonly street: string | undefined
      readonly supplement: string | undefined
      readonly zip: string | undefined
    }
  | undefined {
  if (
    supplement === undefined &&
    street === undefined &&
    zip === undefined &&
    city === undefined &&
    countryCode === undefined
  ) {
    return undefined
  }

  return { supplement, street, zip, city, countryCode }
}

function contactCompanyContactPersonFromFlags(flags: ContactBodyFlags):
  | {
      readonly emailAddress: string | undefined
      readonly firstName: string | undefined
      readonly lastName: string | undefined
      readonly phoneNumber: string | undefined
      readonly primary: boolean | undefined
      readonly salutation: string | undefined
    }[]
  | undefined {
  if (
    flags.contactPersonSalutation === undefined &&
    flags.contactPersonFirstName === undefined &&
    flags.contactPersonLastName === undefined &&
    flags.contactPersonPrimary === undefined &&
    flags.contactPersonEmailAddress === undefined &&
    flags.contactPersonPhoneNumber === undefined
  ) {
    return undefined
  }

  return [
    {
      salutation: flags.contactPersonSalutation,
      firstName: flags.contactPersonFirstName,
      lastName: flags.contactPersonLastName,
      primary: flags.contactPersonPrimary,
      emailAddress: flags.contactPersonEmailAddress,
      phoneNumber: flags.contactPersonPhoneNumber,
    },
  ]
}

function contactBodyInputFromFlags(flags: ContactBodyFlags): unknown {
  const billing = contactAddressFromFlags(
    flags.billingSupplement,
    flags.billingStreet,
    flags.billingZip,
    flags.billingCity,
    flags.billingCountryCode,
  )
  const shipping = contactAddressFromFlags(
    flags.shippingSupplement,
    flags.shippingStreet,
    flags.shippingZip,
    flags.shippingCity,
    flags.shippingCountryCode,
  )
  const hasCompany =
    flags.companyName !== undefined ||
    flags.companyTaxNumber !== undefined ||
    flags.companyVatRegistrationId !== undefined ||
    flags.companyAllowTaxFreeInvoices !== undefined ||
    contactCompanyContactPersonFromFlags(flags) !== undefined
  const hasPerson =
    flags.personSalutation !== undefined || flags.personFirstName !== undefined || flags.personLastName !== undefined
  const hasXRechnung =
    flags.xRechnungBuyerReference !== undefined || flags.xRechnungVendorNumberAtCustomer !== undefined
  const hasEmailAddresses =
    flags.emailBusiness !== undefined ||
    flags.emailOffice !== undefined ||
    flags.emailPrivate !== undefined ||
    flags.emailOther !== undefined
  const hasPhoneNumbers =
    flags.phoneBusiness !== undefined ||
    flags.phoneOffice !== undefined ||
    flags.phoneMobile !== undefined ||
    flags.phonePrivate !== undefined ||
    flags.phoneFax !== undefined ||
    flags.phoneOther !== undefined

  return {
    roles: {
      customer: flags.customer === true ? {} : undefined,
      vendor: flags.vendor === true ? {} : undefined,
    },
    company: hasCompany
      ? {
          name: flags.companyName,
          taxNumber: flags.companyTaxNumber,
          vatRegistrationId: flags.companyVatRegistrationId,
          allowTaxFreeInvoices: flags.companyAllowTaxFreeInvoices,
          contactPersons: contactCompanyContactPersonFromFlags(flags),
        }
      : undefined,
    person: hasPerson
      ? {
          salutation: flags.personSalutation,
          firstName: flags.personFirstName,
          lastName: flags.personLastName,
        }
      : undefined,
    addresses:
      billing === undefined && shipping === undefined
        ? undefined
        : {
            billing: billing === undefined ? undefined : [billing],
            shipping: shipping === undefined ? undefined : [shipping],
          },
    xRechnung: hasXRechnung
      ? {
          buyerReference: flags.xRechnungBuyerReference,
          vendorNumberAtCustomer: flags.xRechnungVendorNumberAtCustomer,
        }
      : undefined,
    emailAddresses: hasEmailAddresses
      ? {
          business: flags.emailBusiness === undefined ? undefined : [flags.emailBusiness],
          office: flags.emailOffice === undefined ? undefined : [flags.emailOffice],
          private: flags.emailPrivate === undefined ? undefined : [flags.emailPrivate],
          other: flags.emailOther === undefined ? undefined : [flags.emailOther],
        }
      : undefined,
    phoneNumbers: hasPhoneNumbers
      ? {
          business: flags.phoneBusiness === undefined ? undefined : [flags.phoneBusiness],
          office: flags.phoneOffice === undefined ? undefined : [flags.phoneOffice],
          mobile: flags.phoneMobile === undefined ? undefined : [flags.phoneMobile],
          private: flags.phonePrivate === undefined ? undefined : [flags.phonePrivate],
          fax: flags.phoneFax === undefined ? undefined : [flags.phoneFax],
          other: flags.phoneOther === undefined ? undefined : [flags.phoneOther],
        }
      : undefined,
    note: flags.note,
    archived: flags.archived,
    version: flags.version,
  }
}

const contactCompanyCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactCompanyCreateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: contactBodyInputFromFlags(flags),
      inputSchema: contactCompanyCreateInputSchema,
      execute: contactCompanyCreate,
      op: "contactCompanyCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...contactCommonOptions,
      ...contactCompanyOptions,
    },
  },
  docs: {
    brief: "Create a company contact",
  },
})

const contactPersonCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactPersonCreateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: contactBodyInputFromFlags(flags),
      inputSchema: contactPersonCreateInputSchema,
      execute: contactPersonCreate,
      op: "contactPersonCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...contactCommonOptions,
      ...contactPersonCreateOptions,
    },
  },
  docs: {
    brief: "Create a person contact",
  },
})

const contactUpdateCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactUpdateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id, body: contactBodyInputFromFlags(flags) },
      inputSchema: contactUpdateInputSchema,
      execute: (client, input) => contactUpdate(client, input.id, input.body),
      op: "contactUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Contact ID"),
      ...contactCommonOptions,
      ...contactCompanyUpdateOptions,
      ...contactPersonOptions,
    },
  },
  docs: {
    brief: "Update a contact",
  },
})

const contactListInputSchema = a.object({
  page: a.optional(a.number()),
  size: a.optional(a.number()),
  filter_email: a.optional(a.string()),
  filter_name: a.optional(a.string()),
  filter_number: a.optional(a.string()),
  filter_customer: a.optional(a.boolean()),
  filter_vendor: a.optional(a.boolean()),
})
type ContactListFlags = CliClientInput & {
  readonly page?: number
  readonly size?: number
  readonly filterEmail?: string
  readonly filterName?: string
  readonly filterNumber?: string
  readonly filterCustomer?: boolean
  readonly filterVendor?: boolean
}

const contactIdInputSchema = a.object({ id: cliOptionSchemas.id })
type ContactIdFlags = CliClientInput & a.InferOutput<typeof contactIdInputSchema>

const contactListCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: {
        page: flags.page,
        size: flags.size,
        filter_email: flags.filterEmail,
        filter_name: flags.filterName,
        filter_number: flags.filterNumber,
        filter_customer: flags.filterCustomer,
        filter_vendor: flags.filterVendor,
      },
      inputSchema: contactListInputSchema,
      execute: contactList,
      op: "contactList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
      size: cliOptionCreate(cliOptionSchemas.integer, "Page size", { optional: true }),
      filterEmail: cliOptionCreate(cliOptionSchemas.string, "Filter by email", { optional: true }),
      filterName: cliOptionCreate(cliOptionSchemas.string, "Filter by name", { optional: true }),
      filterNumber: cliOptionCreate(cliOptionSchemas.string, "Filter by contact number", { optional: true }),
      filterCustomer: cliOptionCreate(cliOptionSchemas.boolean, "Filter customer contacts", { optional: true }),
      filterVendor: cliOptionCreate(cliOptionSchemas.boolean, "Filter vendor contacts", { optional: true }),
    },
  },
  docs: {
    brief: "List contacts",
  },
})

const contactGetCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: contactIdInputSchema,
      execute: (client, input) => contactGet(client, input.id),
      op: "contactGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Contact ID"),
    },
  },
  docs: {
    brief: "Get a contact",
  },
})

const contactDeleteCommand = buildCommand({
  func(this: CliCommandContext, flags: ContactIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: contactIdInputSchema,
      execute: (client, input) => contactDelete(client, input.id),
      op: "contactDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Contact ID"),
    },
  },
  docs: {
    brief: "Delete a contact",
  },
})

export const contactCommand = buildRouteMap({
  routes: {
    companyCreate: contactCompanyCreateCommand,
    personCreate: contactPersonCreateCommand,
    update: contactUpdateCommand,
    list: contactListCommand,
    get: contactGetCommand,
    delete: contactDeleteCommand,
  },
  docs: {
    brief: "Contact commands",
  },
})
