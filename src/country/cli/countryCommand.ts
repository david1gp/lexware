import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { countryList } from "../api/countryList.js"
import type { CliClientInput } from "../../cli/cliClientCreate.js"
import { cliClientOptions } from "../../cli/cliClientOptions.js"
import type { CliCommandContext } from "../../cli/cliCommandContext.js"
import { cliCommandExecute } from "../../cli/cliCommandExecute.js"

const countryListInputSchema = a.object({})
type CountryListFlags = CliClientInput

const countryListCommand = buildCommand({
  func(this: CliCommandContext, flags: CountryListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: {},
      inputSchema: countryListInputSchema,
      execute: (client) => countryList(client),
      op: "countryList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
    },
  },
  docs: {
    brief: "List countries",
  },
})

export const countryCommand = buildRouteMap({
  routes: {
    list: countryListCommand,
  },
  docs: {
    brief: "Country commands",
  },
})
