import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { dunningCreate } from "../dunning/dunningCreate.js"
import { dunningGet } from "../dunning/dunningGet.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"
import type { DunningCreateInputFlags } from "./dunningCreateInput.js"
import { dunningCreateInputSchema } from "./dunningCreateInput.js"
import { dunningCreateOptions } from "./dunningCreateOptions.js"

const dunningIdInputSchema = a.object({ id: cliOptionSchemas.id })
type DunningIdFlags = CliClientInput & a.InferOutput<typeof dunningIdInputSchema>
type DunningCreateFlags = CliClientInput & DunningCreateInputFlags

const dunningCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: DunningCreateFlags) {
    const { accessToken, baseUrl, ...input } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input,
      inputSchema: dunningCreateInputSchema,
      execute: dunningCreate,
      op: "dunningCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...dunningCreateOptions,
    },
  },
  docs: {
    brief: "Create a dunning",
  },
})

const dunningGetCommand = buildCommand({
  func(this: CliCommandContext, flags: DunningIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: dunningIdInputSchema,
      execute: (client, input) => dunningGet(client, input.id),
      op: "dunningGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Dunning ID"),
    },
  },
  docs: {
    brief: "Get a dunning",
  },
})

export const dunningCommand = buildRouteMap({
  routes: {
    create: dunningCreateCommand,
    get: dunningGetCommand,
  },
  docs: {
    brief: "Dunning commands",
  },
})
