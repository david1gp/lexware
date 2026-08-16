import * as a from "valibot"

const cliOptionBooleanSchema = a.pipe(
  a.picklist(["true", "false"]),
  a.transform((input) => input === "true"),
)
const cliOptionDateSchema = a.pipe(a.string(), a.isoDate())
const cliOptionDateTimeSchema = a.pipe(a.string(), a.isoDateTime())
const cliOptionFiniteNumberSchema = a.pipe(
  a.string(),
  a.regex(/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/),
  a.transform((input) => Number(input)),
  a.finite(),
)
const cliOptionIntegerSchema = a.pipe(cliOptionFiniteNumberSchema, a.integer())
const cliOptionNonEmptyStringSchema = a.pipe(a.string(), a.minLength(1))
const cliOptionUrlSchema = a.pipe(a.string(), a.url())

export const cliOptionSchemas = {
  boolean: cliOptionBooleanSchema,
  date: cliOptionDateSchema,
  dateTime: cliOptionDateTimeSchema,
  id: cliOptionNonEmptyStringSchema,
  integer: cliOptionIntegerSchema,
  number: cliOptionFiniteNumberSchema,
  nonEmptyString: cliOptionNonEmptyStringSchema,
  string: a.string(),
  url: cliOptionUrlSchema,
} as const
