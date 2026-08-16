import { type ApplicationText, text_en } from "@stricli/core"
import { createResultError } from "#result"
import { cliJsonStringify } from "./cliJsonStringify.js"

function cliApplicationError(op: string, message: string): string {
  return cliJsonStringify(createResultError(op, message))
}

function cliExceptionMessage(exception: unknown): string {
  if (exception instanceof Error) return exception.message
  return String(exception)
}

export const cliApplicationText = {
  ...text_en,
  exceptionWhileParsingArguments(exception: unknown) {
    return cliApplicationError("cliArgumentParse", cliExceptionMessage(exception))
  },
  exceptionWhileLoadingCommandFunction(exception: unknown) {
    return cliApplicationError("cliCommandLoad", cliExceptionMessage(exception))
  },
  exceptionWhileLoadingCommandContext(exception: unknown) {
    return cliApplicationError("cliContextLoad", cliExceptionMessage(exception))
  },
  exceptionWhileRunningCommand(exception: unknown) {
    return cliApplicationError("cliCommandRun", cliExceptionMessage(exception))
  },
  commandErrorResult(error: Error) {
    return cliApplicationError("cliCommandRun", error.message)
  },
  noCommandRegisteredForInput(args: {
    readonly input: string
    readonly corrections: readonly string[]
    readonly ansiColor: boolean
  }) {
    const correction = args.corrections.length > 0 ? ` Did you mean ${args.corrections.join(", ")}?` : ""
    return cliApplicationError("cliCommandRoute", `No command registered for ${args.input}.${correction}`)
  },
  noTextAvailableForLocale(args: {
    readonly requestedLocale: string
    readonly defaultLocale: string
    readonly ansiColor: boolean
  }) {
    return cliApplicationError(
      "cliLocale",
      `No text available for locale ${args.requestedLocale}; using ${args.defaultLocale}`,
    )
  },
  exceptionWhileRunningIntegrationHook(args: {
    readonly exception: unknown
    readonly hook: string
    readonly integration: string
    readonly ansiColor: boolean
  }) {
    return cliApplicationError(
      "cliIntegrationHook",
      `${args.integration} failed during ${args.hook}: ${cliExceptionMessage(args.exception)}`,
    )
  },
  exceptionWhileRunningIntegrationFlag(args: {
    readonly exception: unknown
    readonly integration: string
    readonly ansiColor: boolean
  }) {
    return cliApplicationError(
      "cliIntegrationFlag",
      `${args.integration} failed: ${cliExceptionMessage(args.exception)}`,
    )
  },
} satisfies ApplicationText
