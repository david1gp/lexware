import { buildCommand, buildRouteMap } from "@stricli/core"
import { orderConfirmationCreate } from "../api/orderConfirmationCreate.js"
import { orderConfirmationDelete } from "../api/orderConfirmationDelete.js"
import { orderConfirmationGet } from "../api/orderConfirmationGet.js"
import { orderConfirmationList } from "../api/orderConfirmationList.js"
import {
  type OrderConfirmationListInput,
  orderConfirmationBodySchema,
  orderConfirmationListInputSchema,
} from "../schema/orderConfirmationSchemas.js"
import { lexwareIdInputSchema } from "../../shared/lexwareSchemas.js"
import type { CliClientInput } from "../../cli/cliClientCreate.js"
import { cliClientOptions } from "../../cli/cliClientOptions.js"
import type { CliCommandContext } from "../../cli/cliCommandContext.js"
import { cliCommandExecute } from "../../cli/cliCommandExecute.js"
import { cliOptionCreate } from "../../cli/cliOptionCreate.js"
import { cliOptionSchemas } from "../../cli/cliOptionSchemas.js"

type OrderConfirmationListFlags = CliClientInput & OrderConfirmationListInput
type OrderConfirmationIdFlags = CliClientInput & { id: string }

type OrderConfirmationCreateFlags = CliClientInput

const orderConfirmationCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: OrderConfirmationCreateFlags) {
    const { accessToken, baseUrl } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input: {},
      inputSchema: orderConfirmationBodySchema,
      execute: orderConfirmationCreate,
      op: "orderConfirmationCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
    },
  },
  docs: {
    brief: "Create an order confirmation",
  },
})

const orderConfirmationListCommand = buildCommand({
  func(this: CliCommandContext, flags: OrderConfirmationListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { page: flags.page },
      inputSchema: orderConfirmationListInputSchema,
      execute: orderConfirmationList,
      op: "orderConfirmationList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
    },
  },
  docs: {
    brief: "List order confirmations",
  },
})

const orderConfirmationGetCommand = buildCommand({
  func(this: CliCommandContext, flags: OrderConfirmationIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => orderConfirmationGet(client, input.id),
      op: "orderConfirmationGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Order confirmation ID"),
    },
  },
  docs: {
    brief: "Get an order confirmation",
  },
})

const orderConfirmationDeleteCommand = buildCommand({
  func(this: CliCommandContext, flags: OrderConfirmationIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => orderConfirmationDelete(client, input.id),
      op: "orderConfirmationDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Order confirmation ID"),
    },
  },
  docs: {
    brief: "Delete an order confirmation",
  },
})

export const orderConfirmationCommand = buildRouteMap({
  routes: {
    create: orderConfirmationCreateCommand,
    list: orderConfirmationListCommand,
    get: orderConfirmationGetCommand,
    delete: orderConfirmationDeleteCommand,
  },
  docs: {
    brief: "Order confirmation commands",
  },
})
