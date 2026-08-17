import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import type { CliClientInput } from "../../cli/cliClientCreate.js"
import { cliClientOptions } from "../../cli/cliClientOptions.js"
import type { CliCommandContext } from "../../cli/cliCommandContext.js"
import { cliCommandExecute } from "../../cli/cliCommandExecute.js"
import { cliOptionCreate } from "../../cli/cliOptionCreate.js"
import { cliOptionSchemas } from "../../cli/cliOptionSchemas.js"
import { lexwareIdInputSchema } from "../../shared/lexwareSchemas.js"
import { invoiceCreate } from "../api/invoiceCreate.js"
import { invoiceGet } from "../api/invoiceGet.js"
import { invoiceList } from "../api/invoiceList.js"
import { invoiceUpdate } from "../api/invoiceUpdate.js"
import {
  type InvoiceListInput,
  invoiceCreateInputSchema,
  invoiceListInputSchema,
  invoiceUpdateInputSchema,
} from "../schema/invoiceSchemas.js"
import type { InvoiceCreateInputFlags } from "./invoiceCreateInput.js"
import { invoiceBodyInputFromFlags, invoiceCreateInputFromFlags } from "./invoiceCreateInput.js"
import { invoiceCreateOptions, invoiceOptions } from "./invoiceCreateOptions.js"

type InvoiceListFlags = CliClientInput & InvoiceListInput

type InvoiceIdFlags = CliClientInput & { readonly id: string }
type InvoiceCreateFlags = CliClientInput & InvoiceCreateInputFlags
type InvoiceUpdateFlags = CliClientInput & Omit<InvoiceCreateInputFlags, "finalize"> & InvoiceIdFlags

const invoiceCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: InvoiceCreateFlags) {
    const { accessToken, baseUrl, ...inputFlags } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input: invoiceCreateInputFromFlags(inputFlags),
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
    const { accessToken, baseUrl, ...inputFlags } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input: { id: inputFlags.id, invoice: invoiceBodyInputFromFlags(inputFlags) },
      inputSchema: invoiceUpdateInputSchema,
      execute: (client, input) => invoiceUpdate(client, input.id, input.invoice),
      op: "invoiceUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Invoice ID"),
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
      page: cliOptionCreate(
        a.pipe(cliOptionSchemas.integer, a.unwrap(invoiceListInputSchema.entries.page)),
        "Page number",
        { optional: true },
      ),
      status: cliOptionCreate(a.unwrap(invoiceListInputSchema.entries.status), "Invoice status", { optional: true }),
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
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => invoiceGet(client, input.id),
      op: "invoiceGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Invoice ID"),
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
