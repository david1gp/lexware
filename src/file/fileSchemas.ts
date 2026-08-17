import * as a from "valibot"
import { lexwareIdSchema } from "../shared/lexwareSchemas.js"

export const fileTypeSchema = a.pipe(a.string(), a.minLength(1))

export const fileFilenameSchema = a.pipe(a.string(), a.minLength(1))

export const fileContentTypeSchema = a.string()

export const fileDataSchema = a.unknown()

export const fileIdSchema = lexwareIdSchema

export const fileUploadInputSchema = a.object({
  type: fileTypeSchema,
  filename: fileFilenameSchema,
  contentType: a.optional(fileContentTypeSchema),
  data: fileDataSchema,
})

export type FileUploadInput = a.InferOutput<typeof fileUploadInputSchema>

export const fileDownloadInputSchema = a.object({
  id: fileIdSchema,
})

export type FileDownloadInput = a.InferOutput<typeof fileDownloadInputSchema>
