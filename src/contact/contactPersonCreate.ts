import * as a from "valibot"
import { createResultError, type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { type LexwareUnknownResponse, lexwareUnknownResponseSchema } from "../shared/lexwareSchemas.js"
import { type ContactPersonBody, contactPersonBodySchema } from "./contactSchemas.js"

export async function contactPersonCreate(
  client: LexwareClient,
  input: ContactPersonBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "contactPersonCreate"
  const r = a.safeParse(contactPersonBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "POST",
    path: "/v1/contacts",
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
