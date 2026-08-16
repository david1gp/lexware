import { type Application, run, type StricliProcess } from "@stricli/core"
import { createResult, createResultError } from "#result"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliJsonStringify } from "./cliJsonStringify.js"

type CliRunOutput = {
  stdout: string
  stderr: string
}

export async function cliRun(
  application: Application<CliCommandContext>,
  inputs: readonly string[],
  process: StricliProcess,
): Promise<void> {
  const output: CliRunOutput = { stdout: "", stderr: "" }
  const runProcess = cliRunProcessCreate(process, output)

  try {
    await run(application, inputs, { process: runProcess })
  } catch (error) {
    runProcess.exitCode = 1
    output.stderr += `${cliJsonStringify(createResultError("cliRun", cliRunErrorMessage(error)))}\n`
  }

  cliRunOutputWrite(process, output)
}

function cliRunProcessCreate(process: StricliProcess, output: CliRunOutput): StricliProcess {
  return {
    env: process.env,
    get exitCode() {
      return process.exitCode
    },
    set exitCode(value) {
      process.exitCode = value
    },
    stdout: cliRunStreamCreate(process.stdout, output, "stdout"),
    stderr: cliRunStreamCreate(process.stderr, output, "stderr"),
  }
}

function cliRunStreamCreate(
  stream: StricliProcess["stdout"],
  output: CliRunOutput,
  key: keyof CliRunOutput,
): StricliProcess["stdout"] {
  return {
    write(value: string) {
      output[key] += value
    },
    getColorDepth: stream.getColorDepth === undefined ? undefined : (env) => stream.getColorDepth?.(env) ?? 1,
  }
}

function cliRunOutputWrite(process: StricliProcess, output: CliRunOutput): void {
  const stdout = cliRunOutputNormalize(output.stdout, true)
  if (stdout !== undefined) process.stdout.write(`${stdout}\n`)

  const stderr = cliRunOutputNormalize(output.stderr, false)
  if (stderr !== undefined) process.stderr.write(`${stderr}\n`)
}

function cliRunOutputNormalize(value: string, success: boolean): string | undefined {
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined

  try {
    JSON.parse(trimmed)
    return trimmed
  } catch {
    if (success) return cliJsonStringify(createResult(trimmed))
    return cliJsonStringify(createResultError("cliOutput", trimmed))
  }
}

function cliRunErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
