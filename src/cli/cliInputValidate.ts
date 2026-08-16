import * as a from "valibot"
import { createResult, createResultError, type Result } from "#result"

export function cliInputValidate<TSchema extends a.GenericSchema>(
  schema: TSchema,
  input: unknown,
  op = "cliInputValidate",
): Result<a.InferOutput<TSchema>> {
  const parsed = a.safeParse(schema, input)
  if (!parsed.success) return createResultError(op, a.summarize(parsed.issues), cliInputErrorData(input))

  return createResult(parsed.output)
}

function cliInputErrorData(input: unknown): string | null {
  if (typeof input === "string") return input
  try {
    return JSON.stringify(input) ?? null
  } catch {
    return String(input)
  }
}
