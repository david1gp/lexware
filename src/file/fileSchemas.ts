import * as a from "valibot"

export const fileUploadInputSchema = a.object({
  type: a.pipe(a.string(), a.minLength(1)),
  filename: a.pipe(a.string(), a.minLength(1)),
  contentType: a.optional(a.string()),
  data: a.unknown(),
})

export type FileUploadInput = a.InferOutput<typeof fileUploadInputSchema>
