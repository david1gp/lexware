import { type PromiseResult } from "#result"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"

export async function printLayoutList(client: LexwareClient): PromiseResult<LexwareUnknownResponse> {
  const op = "printLayoutList"
  return lexwareRequest(client, { op, path: "/v1/print-layouts", schema: lexwareUnknownResponseSchema })
}
