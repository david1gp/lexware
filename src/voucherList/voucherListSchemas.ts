import * as a from "valibot"

export const voucherListListInputEntries = {
  page: a.number(),
  status: a.string(),
  voucherNumber: a.string(),
}

export const voucherListListInputSchema = a.object({
  page: a.optional(voucherListListInputEntries.page),
  status: a.optional(voucherListListInputEntries.status),
  voucherNumber: a.optional(voucherListListInputEntries.voucherNumber),
})

export type VoucherListListInput = a.InferOutput<typeof voucherListListInputSchema>
