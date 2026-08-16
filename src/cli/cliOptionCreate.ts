import type { CommandContext } from "@stricli/core"
import * as a from "valibot"

type CliOptionConfiguration = {
  readonly default?: string | readonly string[]
  readonly hidden?: boolean
  readonly inferEmpty?: boolean
  readonly optional?: boolean
  readonly placeholder?: string
  readonly variadic?: boolean | string
}

export function cliOptionCreate<TSchema extends a.GenericSchema>(
  schema: TSchema,
  brief: string,
): {
  readonly kind: "parsed"
  readonly brief: string
  readonly parse: (this: CommandContext, input: string) => a.InferOutput<TSchema>
}
export function cliOptionCreate<TSchema extends a.GenericSchema, const TConfiguration extends CliOptionConfiguration>(
  schema: TSchema,
  brief: string,
  configuration: TConfiguration,
): {
  readonly kind: "parsed"
  readonly brief: string
  readonly parse: (this: CommandContext, input: string) => a.InferOutput<TSchema>
} & TConfiguration
export function cliOptionCreate<TSchema extends a.GenericSchema>(
  schema: TSchema,
  brief: string,
  configuration: CliOptionConfiguration = {},
) {
  return {
    kind: "parsed" as const,
    brief,
    parse(this: CommandContext, input: string): a.InferOutput<TSchema> {
      const parsed = a.safeParse(schema, input)
      if (!parsed.success) throw new Error(a.summarize(parsed.issues))

      return parsed.output
    },
    ...configuration,
  }
}
