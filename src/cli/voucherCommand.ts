import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { voucherCreate } from "../voucher/voucherCreate.js"
import { voucherDelete } from "../voucher/voucherDelete.js"
import { voucherGet } from "../voucher/voucherGet.js"
import { voucherList } from "../voucher/voucherList.js"
import { voucherUpdate } from "../voucher/voucherUpdate.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { VoucherCreateInputFlags } from "./voucherCreateInput.js"
import {
  voucherBodyInputFromFlags,
  voucherBodyInputSchema,
  voucherCreateFlagsSchema,
  voucherCreateInputSchema,
} from "./voucherCreateInput.js"
import { voucherCreateOptions, voucherOptions } from "./voucherCreateOptions.js"

const voucherListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
})
type VoucherListFlags = CliClientInput & a.InferOutput<typeof voucherListInputSchema>

const voucherIdInputSchema = a.object({ id: cliOptionSchemas.id })
type VoucherIdFlags = CliClientInput & a.InferOutput<typeof voucherIdInputSchema>
type VoucherCreateFlags = CliClientInput & VoucherCreateInputFlags
type VoucherUpdateFlags = CliClientInput & VoucherCreateInputFlags & VoucherIdFlags

const voucherUpdateInputSchema = a.pipe(
  a.intersect([voucherIdInputSchema, voucherCreateFlagsSchema]),
  a.transform((flags) => ({ id: flags.id, voucher: voucherBodyInputFromFlags(flags) })),
  a.object({ id: cliOptionSchemas.id, voucher: voucherBodyInputSchema }),
)

const voucherCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherCreateFlags) {
    const { accessToken, baseUrl, ...input } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input,
      inputSchema: voucherCreateInputSchema,
      execute: voucherCreate,
      op: "voucherCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...voucherCreateOptions,
    },
  },
  docs: {
    brief: "Create a voucher",
  },
})

const voucherUpdateCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherUpdateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: flags,
      inputSchema: voucherUpdateInputSchema,
      execute: (client, input) => voucherUpdate(client, input.id, input.voucher),
      op: "voucherUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Voucher ID"),
      ...voucherOptions,
    },
  },
  docs: {
    brief: "Update a voucher",
  },
})

const voucherListCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { page: flags.page, status: flags.status },
      inputSchema: voucherListInputSchema,
      execute: voucherList,
      op: "voucherList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
      status: cliOptionCreate(cliOptionSchemas.string, "Voucher status", { optional: true }),
    },
  },
  docs: {
    brief: "List vouchers",
  },
})

const voucherGetCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: voucherIdInputSchema,
      execute: (client, input) => voucherGet(client, input.id),
      op: "voucherGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Voucher ID"),
    },
  },
  docs: {
    brief: "Get a voucher",
  },
})

const voucherDeleteCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: voucherIdInputSchema,
      execute: (client, input) => voucherDelete(client, input.id),
      op: "voucherDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Voucher ID"),
    },
  },
  docs: {
    brief: "Delete a voucher",
  },
})

export const voucherCommand = buildRouteMap({
  routes: {
    create: voucherCreateCommand,
    update: voucherUpdateCommand,
    list: voucherListCommand,
    get: voucherGetCommand,
    delete: voucherDeleteCommand,
  },
  docs: {
    brief: "Voucher commands",
  },
})
