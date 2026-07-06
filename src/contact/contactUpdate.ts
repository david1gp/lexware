import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import {
  type LexwareUnknownResponse,
  lexwareLooseBodySchema,
  lexwareUnknownResponseSchema,
} from "../shared/lexwareSchemas.js"

export async function contactUpdate(
  client: LexwareClient,
  id: string,
  input: unknown,
): PromiseResult<LexwareUnknownResponse> {
  const op = "contactUpdate"
  const r = a.safeParse(lexwareLooseBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "PUT",
    path: `/v1/contacts/${encodeURIComponent(id)}`,
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
