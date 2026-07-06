import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type ArticleBody, articleBodySchema } from "./articleSchemas.js"

export async function articleUpdate(
  client: LexwareClient,
  id: string,
  input: ArticleBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "articleUpdate"
  const r = a.safeParse(articleBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/articles/${encodeURIComponent(id)}`,
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
