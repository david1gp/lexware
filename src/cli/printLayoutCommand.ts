import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { printLayoutList } from "../printLayout/printLayoutList.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"

const printLayoutListInputSchema = a.object({})
type PrintLayoutListFlags = CliClientInput

const printLayoutListCommand = buildCommand({
  func(this: CliCommandContext, flags: PrintLayoutListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: {},
      inputSchema: printLayoutListInputSchema,
      execute: (client) => printLayoutList(client),
      op: "printLayoutList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
    },
  },
  docs: {
    brief: "List print layouts",
  },
})

export const printLayoutCommand = buildRouteMap({
  routes: {
    list: printLayoutListCommand,
  },
  docs: {
    brief: "Print layout commands",
  },
})
