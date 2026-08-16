import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { invoiceCreate } from "../invoice/invoiceCreate.js"
import { invoiceGet } from "../invoice/invoiceGet.js"
import { invoiceList } from "../invoice/invoiceList.js"
import { invoiceUpdate } from "../invoice/invoiceUpdate.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { InvoiceCreateInputFlags } from "./invoiceCreateInput.js"
import {
  invoiceBodyInputFromFlags,
  invoiceBodyInputSchema,
  invoiceCreateFlagsSchema,
  invoiceCreateInputSchema,
} from "./invoiceCreateInput.js"
import { invoiceCreateOptions, invoiceOptions } from "./invoiceCreateOptions.js"

const invoiceListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
})
type InvoiceListFlags = CliClientInput & a.InferOutput<typeof invoiceListInputSchema>

const invoiceIdInputSchema = a.object({ id: cliOptionSchemas.id })
type InvoiceIdFlags = CliClientInput & a.InferOutput<typeof invoiceIdInputSchema>
type InvoiceCreateFlags = CliClientInput & InvoiceCreateInputFlags
type InvoiceUpdateFlags = CliClientInput & Omit<InvoiceCreateInputFlags, "finalize"> & InvoiceIdFlags

const invoiceUpdateInputSchema = a.pipe(
  a.intersect([invoiceIdInputSchema, invoiceCreateFlagsSchema]),
  a.transform((flags) => ({ id: flags.id, invoice: invoiceBodyInputFromFlags(flags) })),
  a.object({ id: cliOptionSchemas.id, invoice: invoiceBodyInputSchema }),
)

const invoiceCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: InvoiceCreateFlags) {
    const { accessToken, baseUrl, ...input } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input,
      inputSchema: invoiceCreateInputSchema,
      execute: invoiceCreate,
      op: "invoiceCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...invoiceCreateOptions,
    },
  },
  docs: {
    brief: "Create an invoice",
  },
})

const invoiceUpdateCommand = buildCommand({
  func(this: CliCommandContext, flags: InvoiceUpdateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: flags,
      inputSchema: invoiceUpdateInputSchema,
      execute: (client, input) => invoiceUpdate(client, input.id, input.invoice),
      op: "invoiceUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Invoice ID"),
      ...invoiceOptions,
    },
  },
  docs: {
    brief: "Update an invoice",
  },
})

const invoiceListCommand = buildCommand({
  func(this: CliCommandContext, flags: InvoiceListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { page: flags.page, status: flags.status },
      inputSchema: invoiceListInputSchema,
      execute: invoiceList,
      op: "invoiceList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
      status: cliOptionCreate(cliOptionSchemas.string, "Invoice status", { optional: true }),
    },
  },
  docs: {
    brief: "List invoices",
  },
})

const invoiceGetCommand = buildCommand({
  func(this: CliCommandContext, flags: InvoiceIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: invoiceIdInputSchema,
      execute: (client, input) => invoiceGet(client, input.id),
      op: "invoiceGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Invoice ID"),
    },
  },
  docs: {
    brief: "Get an invoice",
  },
})

export const invoiceCommand = buildRouteMap({
  routes: {
    create: invoiceCreateCommand,
    update: invoiceUpdateCommand,
    list: invoiceListCommand,
    get: invoiceGetCommand,
  },
  docs: {
    brief: "Invoice commands",
  },
})
