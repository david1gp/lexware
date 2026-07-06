import { type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"

export async function countryList(client: LexwareClient): PromiseResult<LexwareUnknownResponse> {
  const op = "countryList"
  return lexwareRequest(client, { op, path: "/v1/countries", schema: lexwareUnknownResponseSchema })
}
