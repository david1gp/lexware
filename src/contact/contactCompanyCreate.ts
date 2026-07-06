import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { contactCompanyBodySchema, type ContactCompanyBody } from "./contactSchemas.js"

export async function contactCompanyCreate(
  client: LexwareClient,
  input: ContactCompanyBody,
): PromiseResult<LexwareUnknownResponse> {
  const op = "contactCompanyCreate"
  const r = a.safeParse(contactCompanyBodySchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    method: "POST",
    path: "/v1/contacts",
    body: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
