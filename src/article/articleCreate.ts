import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { articleBodySchema, type ArticleBody } from "./articleSchemas.js"

export async function articleCreate(client: LexwareClient, input: ArticleBody): PromiseResult<LexwareUnknownResponse> {
  const op = "articleCreate"
  const r = a.safeParse(articleBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  return lexwareRequest(client, {
    op,
    method: "POST",
    path: "/v1/articles",
    body: { ...r.output, version: r.output.version ?? 0 },
    schema: lexwareUnknownResponseSchema,
  })
}
