import type { CommandContext, StricliProcess } from "@stricli/core"

export type CliCommandContext = Omit<CommandContext, "process"> & {
  readonly process: StricliProcess
}
