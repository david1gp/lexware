import * as a from "valibot"

export const voucherListListInputSchema = a.object({
  page: a.optional(a.number()),
  status: a.optional(a.string()),
  voucherNumber: a.optional(a.string()),
})

export type VoucherListListInput = a.InferOutput<typeof voucherListListInputSchema>
