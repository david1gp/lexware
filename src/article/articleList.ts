import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type ArticleListInput, articleListInputSchema } from "./articleSchemas.js"

export async function articleList(
  client: LexwareClient,
  input: ArticleListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "articleList"
  const r = a.safeParse(articleListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  return lexwareRequest(client, {
    op,
    path: "/v1/articles",
    query: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
