import { buildCommand, buildRouteMap } from "@stricli/core"
import type * as a from "valibot"
import { dunningCreate } from "../api/dunningCreate.js"
import { dunningGet } from "../api/dunningGet.js"
import { dunningCreateInputSchema } from "../schema/dunningSchemas.js"
import { lexwareIdInputSchema } from "../../shared/lexwareSchemas.js"
import type { CliClientInput } from "../../cli/cliClientCreate.js"
import { cliClientOptions } from "../../cli/cliClientOptions.js"
import type { CliCommandContext } from "../../cli/cliCommandContext.js"
import { cliCommandExecute } from "../../cli/cliCommandExecute.js"
import { cliOptionCreate } from "../../cli/cliOptionCreate.js"
import type { DunningCreateInputFlags } from "./dunningCreateInput.js"
import { dunningCreateInputFromFlags } from "./dunningCreateInput.js"
import { dunningCreateOptions } from "./dunningCreateOptions.js"

type DunningIdFlags = CliClientInput & a.InferOutput<typeof lexwareIdInputSchema>
type DunningCreateFlags = CliClientInput & DunningCreateInputFlags

const dunningCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: DunningCreateFlags) {
    const { accessToken, baseUrl, ...inputFlags } = flags

    return cliCommandExecute(this, {
      clientInput: { accessToken, baseUrl },
      input: dunningCreateInputFromFlags(inputFlags),
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
      inputSchema: lexwareIdInputSchema,
      execute: (client, input) => dunningGet(client, input.id),
      op: "dunningGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(lexwareIdInputSchema.entries.id, "Dunning ID"),
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
