import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { articleListInputSchema, type ArticleListInput } from "./articleSchemas.js"

export async function articleList(
  client: LexwareClient,
  input: ArticleListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "articleList"
  const r = a.safeParse(articleListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  return lexwareRequest(client, { op, path: "/v1/articles", query: r.output, schema: lexwareUnknownResponseSchema })
}
