import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { articleBodySchema, type ArticleBody } from "./articleSchemas.js"

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
