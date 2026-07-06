import { expect, test } from "bun:test"
import { lexwareRequestBodyJson, lexwareTestClient } from "../shared/lexwareTestClient.test.js"
import { articleCreate } from "./articleCreate.js"
import { articleList } from "./articleList.js"

test("articleList builds list query", async () => {
  const { client, calls } = lexwareTestClient()
  const result = await articleList(client, { page: 2, type: "PRODUCT" })
  expect(result.success).toBe(true)
  expect(String(calls[0]?.input)).toBe("https://api.lexware.io/v1/articles?page=2&type=PRODUCT")
  expect(calls[0]?.init?.method).toBe("GET")
  expect(new Headers(calls[0]?.init?.headers).get("Authorization")).toBe("Bearer token")
})

test("articleCreate validates input and defaults version", async () => {
  const { client, calls } = lexwareTestClient()
  const result = await articleCreate(client, {
    type: "SERVICE",
    title: "Consulting",
  })
  expect(result.success).toBe(true)
  expect(await lexwareRequestBodyJson(calls[0]!)).toEqual({
    type: "SERVICE",
    title: "Consulting",
    version: 0,
  })

  const invalid = await articleCreate(client, { type: "INVALID" } as never)
  expect(invalid.success).toBe(false)
  if (!invalid.success) expect(invalid.op).toBe("articleCreate")
})
