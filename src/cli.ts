#!/usr/bin/env node
import { buildApplication, buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { createResult } from "#result"
import { articleCommand } from "./cli/articleCommand.js"
import { cliApplicationText } from "./cli/cliApplicationText.js"
import { cliClientOptions } from "./cli/cliClientOptions.js"
import type { CliCommandContext } from "./cli/cliCommandContext.js"
import { cliInputValidate } from "./cli/cliInputValidate.js"
import { cliResultWrite } from "./cli/cliResultWrite.js"
import { cliRun } from "./cli/cliRun.js"
import { contactCommand } from "./cli/contactCommand.js"
import { countryCommand } from "./cli/countryCommand.js"
import { dunningCommand } from "./cli/dunningCommand.js"
import { fileCommand } from "./cli/fileCommand.js"
import { invoiceCommand } from "./cli/invoiceCommand.js"
import { orderConfirmationCommand } from "./cli/orderConfirmationCommand.js"
import { printLayoutCommand } from "./cli/printLayoutCommand.js"
import { quotationCommand } from "./cli/quotationCommand.js"
import { voucherCommand } from "./cli/voucherCommand.js"
import { voucherListCommand } from "./cli/voucherListCommand.js"

const lexwareRootInputSchema = a.object({
  baseUrl: a.optional(a.pipe(a.string(), a.url())),
})

type LexwareRootInput = a.InferOutput<typeof lexwareRootInputSchema>

const lexwareRootCommand = buildCommand({
  func(this: CliCommandContext, input: LexwareRootInput) {
    const inputResult = cliInputValidate(lexwareRootInputSchema, input, "cliRootCommand")
    if (!inputResult.success) {
      cliResultWrite(this.process, inputResult)
      return
    }

    if (inputResult.data.baseUrl === undefined) {
      cliResultWrite(this.process, createResult({ command: "lexware", brief: "Run Lexware Office API commands" }))
      return
    }

    cliResultWrite(this.process, createResult(inputResult.data))
  },
  parameters: {
    flags: {
      baseUrl: {
        ...cliClientOptions.baseUrl,
      },
    },
  },
  docs: {
    brief: "Run Lexware Office API commands",
  },
})

const lexwareRouteMap = buildRouteMap({
  routes: {
    root: lexwareRootCommand,
    article: articleCommand,
    contact: contactCommand,
    country: countryCommand,
    dunning: dunningCommand,
    file: fileCommand,
    invoice: invoiceCommand,
    orderConfirmation: orderConfirmationCommand,
    printLayout: printLayoutCommand,
    quotation: quotationCommand,
    voucher: voucherCommand,
    voucherList: voucherListCommand,
  },
  defaultCommand: "root",
  docs: {
    brief: "Run Lexware Office API commands",
    hideRoute: {
      root: true,
    },
  },
})

export const lexwareCommand = buildApplication(lexwareRouteMap, {
  name: "lexware",
  scanner: {
    caseStyle: "allow-kebab-for-camel",
  },
  documentation: {
    disableAnsiColor: true,
  },
  localization: {
    text: cliApplicationText,
  },
})

await cliRun(lexwareCommand, process.argv.slice(2), process)

if (process.exitCode !== undefined && process.exitCode !== null && process.exitCode !== 0) process.exitCode = 1
