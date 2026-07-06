import * as a from "valibot"
import { lexwareLineItemSchema } from "../shared/lexwareSchemas.js"

export const dunningCreateInputSchema = a.object({
  precedingSalesVoucherId: a.pipe(a.string(), a.minLength(1)),
  finalize: a.optional(a.boolean()),
  title: a.optional(a.string()),
  voucherDate: a.optional(a.string()),
  extraLineItems: a.optional(a.array(lexwareLineItemSchema)),
  totalNetAmount: a.optional(a.number()),
  currency: a.optional(a.string()),
})

export type DunningCreateInput = a.InferOutput<typeof dunningCreateInputSchema>
