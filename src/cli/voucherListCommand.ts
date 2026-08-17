import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { lexwareIdInputSchema } from "../shared/lexwareSchemas.js"
import { voucherListGet } from "../voucherList/voucherListGet.js"
import { voucherListList } from "../voucherList/voucherListList.js"
import { voucherListListInputEntries, voucherListListInputSchema } from "../voucherList/voucherListSchemas.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"

type VoucherListListFlags = CliClientInput & a.InferOutput<typeof voucherListListInputSchema>

type VoucherListIdFlags = CliClientInput & a.InferOutput<typeof lexwareIdInputSchema>

const voucherListListCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherListListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: {
        page: flags.page,
        status: flags.status,
        voucherNumber: flags.voucherNumber,
      },
      inputSchema: voucherListListInputSchema,
      execute: voucherListList,
      op: "voucherListList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(a.pipe(cliOptionSchemas.integer, voucherListListInputEntries.page), "Page number", {
        optional: true,
      }),
      status: cliOptionCreate(voucherListListInputEntries.status, "Voucher list status", { optional: true }),
      voucherNumber: cliOptionCreate(voucherListListInputEntries.voucherNumber, "Voucher number", { optional: true }),
    },
  },
  docs: {
    brief: "List voucher list entries",
  },
})

const voucherListGetCommand = buildCommand({
  func(this: CliCommandContext, flags: VoucherListIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => voucherListGet(client, input.id),
      op: "voucherListGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Voucher list ID"),
    },
  },
  docs: {
    brief: "Get a voucher list entry",
  },
})

export const voucherListCommand = buildRouteMap({
  routes: {
    list: voucherListListCommand,
    get: voucherListGetCommand,
  },
  docs: {
    brief: "Voucher list commands",
  },
})
