import * as a from "valibot"

export const orderConfirmationBodySchema = a.looseObject({})
export const orderConfirmationListInputSchema = a.object({
  page: a.optional(a.number()),
})

export type OrderConfirmationBody = a.InferOutput<typeof orderConfirmationBodySchema>
export type OrderConfirmationListInput = a.InferOutput<typeof orderConfirmationListInputSchema>
