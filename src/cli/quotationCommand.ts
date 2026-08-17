import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { quotationCreate } from "../quotation/quotationCreate.js"
import { quotationDelete } from "../quotation/quotationDelete.js"
import { quotationGet } from "../quotation/quotationGet.js"
import { quotationList } from "../quotation/quotationList.js"
import {
  quotationCreateInputSchema as quotationCreateDomainInputSchema,
  quotationListInputSchema,
  quotationUpdateInputSchema as quotationUpdateDomainInputSchema,
} from "../quotation/quotationSchemas.js"
import { quotationUpdate } from "../quotation/quotationUpdate.js"
import { lexwareIdInputSchema, lexwareIdSchema } from "../shared/lexwareSchemas.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { QuotationCreateInputFlags } from "./quotationCreateInput.js"
import { quotationBodyInputFromFlags } from "./quotationCreateInput.js"
import { quotationCreateOptions, quotationOptions } from "./quotationCreateOptions.js"

type QuotationListFlags = CliClientInput & a.InferOutput<typeof quotationListInputSchema>

type QuotationIdFlags = CliClientInput & a.InferOutput<typeof lexwareIdInputSchema>
type QuotationCreateFlags = CliClientInput & QuotationCreateInputFlags
type QuotationUpdateFlags = CliClientInput & QuotationCreateInputFlags & QuotationIdFlags

const quotationCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: QuotationCreateFlags) {
    const { accessToken, baseUrl, ...input } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input: quotationBodyInputFromFlags(input),
      inputSchema: quotationCreateDomainInputSchema,
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
      input: {
        id: flags.id,
        quotation: quotationBodyInputFromFlags(flags),
      },
      inputSchema: quotationUpdateDomainInputSchema,
      execute: (client, input) => quotationUpdate(client, input.id, input.quotation),
      op: "quotationUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdSchema, "Quotation ID"),
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
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => quotationGet(client, input.id),
      op: "quotationGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdSchema, "Quotation ID"),
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
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => quotationDelete(client, input.id),
      op: "quotationDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdSchema, "Quotation ID"),
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
