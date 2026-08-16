import { buildCommand, buildRouteMap } from "@stricli/core"
import * as a from "valibot"
import { articleCreate } from "../article/articleCreate.js"
import { articleDelete } from "../article/articleDelete.js"
import { articleGet } from "../article/articleGet.js"
import { articleList } from "../article/articleList.js"
import { articleUpdate } from "../article/articleUpdate.js"
import type { CliClientInput } from "./cliClientCreate.js"
import { cliClientOptions } from "./cliClientOptions.js"
import type { CliCommandContext } from "./cliCommandContext.js"
import { cliCommandExecute } from "./cliCommandExecute.js"
import { cliOptionCreate } from "./cliOptionCreate.js"
import { cliOptionSchemas } from "./cliOptionSchemas.js"

const articleListInputSchema = a.object({
  page: a.optional(a.number()),
  type: a.optional(a.picklist(["PRODUCT", "SERVICE"])),
})
type ArticleListFlags = CliClientInput & a.InferOutput<typeof articleListInputSchema>

const articleIdInputSchema = a.object({ id: cliOptionSchemas.id })
type ArticleIdFlags = CliClientInput & a.InferOutput<typeof articleIdInputSchema>

const articlePriceInputSchema = a.object({
  leadingPrice: a.picklist(["NET", "GROSS"]),
  netPrice: a.optional(a.number()),
  grossPrice: a.optional(a.number()),
  taxRate: a.optional(a.number()),
})

const articleBodyInputSchema = a.object({
  title: a.optional(a.string()),
  description: a.optional(a.string()),
  type: a.picklist(["PRODUCT", "SERVICE"]),
  articleNumber: a.optional(a.string()),
  gtin: a.optional(a.string()),
  note: a.optional(a.string()),
  unitName: a.optional(a.string()),
  version: a.optional(a.number()),
  price: a.optional(articlePriceInputSchema),
})

type ArticlePriceFlags = {
  readonly leadingPrice?: "NET" | "GROSS"
  readonly netPrice?: number
  readonly grossPrice?: number
  readonly taxRate?: number
}
type ArticleBodyFlags = CliClientInput & Omit<a.InferOutput<typeof articleBodyInputSchema>, "price"> & ArticlePriceFlags
type ArticleUpdateFlags = ArticleBodyFlags & a.InferOutput<typeof articleIdInputSchema>

const articleBodyOptions = {
  title: cliOptionCreate(cliOptionSchemas.string, "Article title", { optional: true }),
  description: cliOptionCreate(cliOptionSchemas.string, "Article description", { optional: true }),
  type: cliOptionCreate(a.picklist(["PRODUCT", "SERVICE"]), "Article type"),
  articleNumber: cliOptionCreate(cliOptionSchemas.string, "Article number", { optional: true }),
  gtin: cliOptionCreate(cliOptionSchemas.string, "Global Trade Item Number", { optional: true }),
  note: cliOptionCreate(cliOptionSchemas.string, "Article note", { optional: true }),
  unitName: cliOptionCreate(cliOptionSchemas.string, "Article unit name", { optional: true }),
  version: cliOptionCreate(cliOptionSchemas.number, "Article version", { optional: true }),
  leadingPrice: cliOptionCreate(a.picklist(["NET", "GROSS"]), "Leading price", { optional: true }),
  netPrice: cliOptionCreate(cliOptionSchemas.number, "Net price", { optional: true }),
  grossPrice: cliOptionCreate(cliOptionSchemas.number, "Gross price", { optional: true }),
  taxRate: cliOptionCreate(cliOptionSchemas.number, "Tax rate", { optional: true }),
}

const articleUpdateInputSchema = a.object({
  id: cliOptionSchemas.id,
  body: articleBodyInputSchema,
})

function articleBodyInputFromFlags(flags: ArticleBodyFlags): unknown {
  const hasPrice =
    flags.leadingPrice !== undefined ||
    flags.netPrice !== undefined ||
    flags.grossPrice !== undefined ||
    flags.taxRate !== undefined

  return {
    title: flags.title,
    description: flags.description,
    type: flags.type,
    articleNumber: flags.articleNumber,
    gtin: flags.gtin,
    note: flags.note,
    unitName: flags.unitName,
    version: flags.version,
    price: hasPrice
      ? {
          leadingPrice: flags.leadingPrice,
          netPrice: flags.netPrice,
          grossPrice: flags.grossPrice,
          taxRate: flags.taxRate,
        }
      : undefined,
  }
}

const articleCreateCommand = buildCommand({
  func(this: CliCommandContext, flags: ArticleBodyFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: articleBodyInputFromFlags(flags),
      inputSchema: articleBodyInputSchema,
      execute: articleCreate,
      op: "articleCreate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      ...articleBodyOptions,
    },
  },
  docs: {
    brief: "Create an article",
  },
})

const articleUpdateCommand = buildCommand({
  func(this: CliCommandContext, flags: ArticleUpdateFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id, body: articleBodyInputFromFlags(flags) },
      inputSchema: articleUpdateInputSchema,
      execute: (client, input) => articleUpdate(client, input.id, input.body),
      op: "articleUpdate",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Article ID"),
      ...articleBodyOptions,
    },
  },
  docs: {
    brief: "Update an article",
  },
})

const articleListCommand = buildCommand({
  func(this: CliCommandContext, flags: ArticleListFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { page: flags.page, type: flags.type },
      inputSchema: articleListInputSchema,
      execute: articleList,
      op: "articleList",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      page: cliOptionCreate(cliOptionSchemas.integer, "Page number", { optional: true }),
      type: cliOptionCreate(a.picklist(["PRODUCT", "SERVICE"]), "Article type", { optional: true }),
    },
  },
  docs: {
    brief: "List articles",
  },
})

const articleGetCommand = buildCommand({
  func(this: CliCommandContext, flags: ArticleIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: articleIdInputSchema,
      execute: (client, input) => articleGet(client, input.id),
      op: "articleGet",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Article ID"),
    },
  },
  docs: {
    brief: "Get an article",
  },
})

const articleDeleteCommand = buildCommand({
  func(this: CliCommandContext, flags: ArticleIdFlags) {
    return cliCommandExecute(this, {
      clientInput: { accessToken: flags.accessToken, baseUrl: flags.baseUrl },
      input: { id: flags.id },
      inputSchema: articleIdInputSchema,
      execute: (client, input) => articleDelete(client, input.id),
      op: "articleDelete",
    })
  },
  parameters: {
    flags: {
      ...cliClientOptions,
      id: cliOptionCreate(cliOptionSchemas.id, "Article ID"),
    },
  },
  docs: {
    brief: "Delete an article",
  },
})

export const articleCommand = buildRouteMap({
  routes: {
    create: articleCreateCommand,
    update: articleUpdateCommand,
    list: articleListCommand,
    get: articleGetCommand,
    delete: articleDeleteCommand,
  },
  docs: {
    brief: "Article commands",
  },
})
