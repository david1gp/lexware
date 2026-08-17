import { expect, test } from "bun:test"
import { cliAccessTokenResolve } from "./cliAccessTokenResolve.js"

test("access-token resolution validates environment values as non-empty CLI strings", () => {
  expect(cliAccessTokenResolve(undefined, { LEXWARE_TOKEN: "token" })).toEqual({ success: true, data: "token" })
  expect(cliAccessTokenResolve(undefined, { LEXWARE_TOKEN: "" })).toEqual({
    success: false,
    op: "cliAccessTokenResolve",
    errorMessage: "An access token is required via --access-token or LEXWARE_TOKEN",
  })
})
