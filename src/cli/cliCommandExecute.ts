import * as a from "valibot"
import { createResultError, type Result } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientCreate } from "./cliClientCreate.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliInputValidate } from "./cliInputValidate.js"
import { cliResultWrite } from "./cliResultWrite.js"

type CliCommandExecuteInput<TSchema extends a.GenericSchema, TResult> = {
  readonly clientInput: CliClientInput
  readonly input: unknown
  readonly inputSchema: TSchema
  readonly execute: (client: LexwareClient, input: a.InferOutput<TSchema>) => Result<TResult> | Promise<Result<TResult>>
  readonly op?: string
}

export async function cliCommandExecute<TSchema extends a.GenericSchema, TResult>(
  context: CliCommandContext,
  options: CliCommandExecuteInput<TSchema, TResult>,
): Promise<void> {
  const inputResult = cliInputValidate(options.inputSchema, options.input, options.op ?? "cliCommandInput")
  if (!inputResult.success) {
    cliResultWrite(context.process, inputResult)
    return
  }

  const clientResult = cliClientCreate(options.clientInput, context.process.env)
  if (!clientResult.success) {
    cliResultWrite(context.process, clientResult)
    return
  }

  let result: Result<TResult>
  try {
    result = await options.execute(clientResult.data, inputResult.data)
  } catch (error) {
    result = createResultError(
      options.op ?? "cliCommandExecute",
      error instanceof Error ? error.message : String(error),
    )
  }

  cliResultWrite(context.process, result)
}
