import * as a from "valibot"

export const lexwareUnknownResponseSchema = a.unknown()

export const lexwareIdInputSchema = a.object({
  id: a.pipe(a.string(), a.minLength(1)),
})

export const lexwarePageQuerySchema = a.object({
  page: a.optional(a.number()),
  size: a.optional(a.number()),
})

export const lexwareLineItemSchema = a.looseObject({
  type: a.optional(a.picklist(["custom", "material", "service", "text"])),
  name: a.optional(a.string()),
  description: a.optional(a.string()),
  quantity: a.optional(a.number()),
  unitName: a.optional(a.string()),
  unitPrice: a.optional(a.unknown()),
  discountPercentage: a.optional(a.number()),
  lineItemAmount: a.optional(a.number()),
})

export const lexwareLooseBodySchema = a.looseObject({})

export type LexwareUnknownResponse = a.InferOutput<typeof lexwareUnknownResponseSchema>
