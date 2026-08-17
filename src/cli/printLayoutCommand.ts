import { buildCommand, buildRouteMap } from "@stricli/core"
import { printLayoutList } from "../printLayout/printLayoutList.js"
import { type CliClientInput, cliClientCreate } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliResultWrite } from "./cliResultWrite.js"

type PrintLayoutListFlags = CliClientInput

const printLayoutListCommand = buildCommand({
  async func(this: CliCommandContext, flags: PrintLayoutListFlags) {
    const clientResult = cliClientCreate(flags, this.process.env)
    if (!clientResult.success) {
      cliResultWrite(this.process, clientResult)
      return
    }

    const result = await printLayoutList(clientResult.data)
    cliResultWrite(this.process, result)
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
