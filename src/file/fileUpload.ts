import { createResult, createResultError, type PromiseResult, resultTryParsingFetchErr } from "#result"
import * as a from "valibot"
import type { LexwareClient } from "../shared/LexwareClient.js"
import { lexwareErrorData } from "../shared/lexwareErrorData.js"
import { lexwareUnknownResponseSchema, type LexwareUnknownResponse } from "../shared/lexwareSchemas.js"
import { fileUploadInputSchema, type FileUploadInput } from "./fileSchemas.js"

export async function fileUpload(client: LexwareClient, input: FileUploadInput): PromiseResult<LexwareUnknownResponse> {
  const op = "fileUpload"
  const r = a.safeParse(fileUploadInputSchema, input)
  if (!r.success) return createResultError(op, a.summarize(r.issues), lexwareErrorData(input))

  const form = new FormData()
  form.set("type", r.output.type.toLowerCase())
  const blob = r.output.data instanceof Blob ? r.output.data : new Blob([r.output.data as BlobPart])
  form.set("file", blob, r.output.filename)

  const headers = new Headers({ Accept: "application/json", Authorization: `Bearer ${client.accessToken}` })
  let response: Response
  try {
    response = await client.fetch(new URL("/v1/files", client.baseUrl), { method: "POST", headers, body: form })
  } catch (error) {
    return createResultError(op, "Fetch failed", error instanceof Error ? error.message : String(error))
  }

  let text: string
  try {
    text = await response.text()
  } catch (error) {
    return createResultError(op, "Reading response failed", error instanceof Error ? error.message : String(error))
  }

  if (!response.ok) return resultTryParsingFetchErr(op, text, response.status, response.statusText)

  const textSchema = a.pipe(a.string(), a.parseJson(), lexwareUnknownResponseSchema)
  const parsed = text.length === 0 ? a.safeParse(lexwareUnknownResponseSchema, null) : a.safeParse(textSchema, text)
  if (!parsed.success) return createResultError(op, a.summarize(parsed.issues), text)
  return createResult(parsed.output)
}
