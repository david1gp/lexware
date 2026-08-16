import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { quotationCreate } from "../quotation/quotationCreate.js"
import { quotationDelete } from "../quotation/quotationDelete.js"
import { quotationGet } from "../quotation/quotationGet.js"
import { quotationList } from "../quotation/quotationList.js"
import { quotationUpdate } from "../quotation/quotationUpdate.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { QuotationCreateInputFlags } from "./quotationCreateInput.js"
import {
  quotationBodyInputFromFlags,
  quotationBodyInputSchema,
  quotationCreateFlagsSchema,
  quotationCreateInputSchema,
} from "./quotationCreateInput.js"
import { quotationCreateOptions, quotationOptions } from "./quotationCreateOptions.js"

const quotationListInputSchema = a.object({
  page: a.optional(a.number()),
})
type QuotationListFlags = CliClientInput & a.InferOutput<typeof quotationListInputSchema>

const quotationIdInputSchema = a.object({ id: cliOptionSchemas.id })
type QuotationIdFlags = CliClientInput & a.InferOutput<typeof quotationIdInputSchema>
type QuotationCreateFlags = CliClientInput & QuotationCreateInputFlags
type QuotationUpdateFlags = CliClientInput & QuotationCreateInputFlags & QuotationIdFlags

const quotationUpdateInputSchema = a.pipe(
  a.intersect([quotationIdInputSchema, quotationCreateFlagsSchema]),
  a.transform((flags) => ({ id: flags.id, quotation: quotationBodyInputFromFlags(flags) })),
  a.object({ id: cliOptionSchemas.id, quotation: quotationBodyInputSchema }),
)

const quotationCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationCreateFlags) {
    const { accessToken, baseUrl, ...input } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input,
      inputSchema: quotationCreateInputSchema,
      execute: quotationCreate,
      op: "quotationCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...quotationCreateOptions,
    },
  },
  docs: {
    brief: "Create a quotation",
  },
})

const quotationUpdateCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationUpdateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: flags,
      inputSchema: quotationUpdateInputSchema,
      execute: (client, input) => quotationUpdate(client, input.id, input.quotation),
      op: "quotationUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Quotation ID"),
      ...quotationOptions,
    },
  },
  docs: {
    brief: "Update a quotation",
  },
})

const quotationListCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { page: flags.page },
      inputSchema: quotationListInputSchema,
      execute: quotationList,
      op: "quotationList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
    },
  },
  docs: {
    brief: "List quotations",
  },
})

const quotationGetCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: quotationIdInputSchema,
      execute: (client, input) => quotationGet(client, input.id),
      op: "quotationGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Quotation ID"),
    },
  },
  docs: {
    brief: "Get a quotation",
  },
})

const quotationDeleteCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: quotationIdInputSchema,
      execute: (client, input) => quotationDelete(client, input.id),
      op: "quotationDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Quotation ID"),
    },
  },
  docs: {
    brief: "Delete a quotation",
  },
})

export const quotationCommand = buildRouteMap({
  routes: {
    create: quotationCreateCommand,
    update: quotationUpdateCommand,
    list: quotationListCommand,
    get: quotationGetCommand,
    delete: quotationDeleteCommand,
  },
  docs: {
    brief: "Quotation commands",
  },
})
