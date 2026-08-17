import { expect, test } from "bun:test"
import * as a from "valibot"
import {
  fileContentTypeSchema,
  fileDataSchema,
  fileDownloadInputSchema,
  fileFilenameSchema,
  fileIdSchema,
  fileTypeSchema,
  fileUploadInputSchema,
} from "./fileSchemas.js"

test("file input schemas reuse domain leaves", () => {
  expect(a.safeParse(fileTypeSchema, "voucher").success).toBe(true)
  expect(a.safeParse(fileTypeSchema, "").success).toBe(false)
  expect(a.safeParse(fileFilenameSchema, "invoice.pdf").success).toBe(true)
  expect(a.safeParse(fileFilenameSchema, "").success).toBe(false)
  expect(a.safeParse(fileContentTypeSchema, "application/pdf").success).toBe(true)
  expect(a.safeParse(fileDataSchema, { binary: true }).success).toBe(true)
  expect(a.safeParse(fileIdSchema, "file-1").success).toBe(true)
  expect(a.safeParse(fileIdSchema, "").success).toBe(false)
})

test("file operation schemas keep supported binary data broad and exclude CLI paths", () => {
  const upload = a.safeParse(fileUploadInputSchema, {
    type: "voucher",
    filename: "invoice.pdf",
    contentType: "application/pdf",
    data: { binary: true },
  })
  const download = a.safeParse(fileDownloadInputSchema, { id: "file-1" })

  expect(upload.success).toBe(true)
  expect(download.success).toBe(true)
  expect(upload.success && "path" in upload.output).toBe(false)
  expect(download.success && "output" in download.output).toBe(false)
})
