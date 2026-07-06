import { createResultError, type PromiseResult } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareRequest } from "../shared/lexwareRequest.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { orderConfirmationListInputSchema, type OrderConfirmationListInput } from "./orderConfirmationSchemas.js"

export async function orderConfirmationList(
  client: LexwareClient,
  input: OrderConfirmationListInput = {},
): PromiseResult<LexwareUnknownResponse> {
  const op = "orderConfirmationList"
  const r = a.safeParse(orderConfirmationListInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))
  return lexwareRequest(client, {
    op,
    path: "/v1/order-confirmations",
    query: r.output,
    schema: lexwareUnknownResponseSchema,
  })
}
