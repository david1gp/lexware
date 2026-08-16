import * as a from "valibot"
import { cliOptionCreate } from "./cliOptionCreate.js"

export function cliOptionEnum<const TValues extends readonly [string, ...string[]]>(
  values: TValues,
  brief: string,
  configuration?: {
    readonly default?: string | readonly string[]
    readonly hidden?: boolean
    readonly inferEmpty?: boolean
    readonly optional?: boolean
    readonly placeholder?: string
    readonly variadic?: boolean | string
  },
) {
  const schema = a.picklist(values)
  if (configuration === undefined) return cliOptionCreate(schema, brief)

  return cliOptionCreate(schema, brief, configuration)
}
