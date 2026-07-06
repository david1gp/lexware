import { lexwareClientCreate } from "./lexwareClientCreate.js"

export type LexwareCapturedRequest = {
  input: RequestInfo | URL
  init: RequestInit | undefined
}

export function lexwareJsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
}

export function lexwareTestClient(responses: Response[] = [lexwareJsonResponse({ ok: true })]) {
  const calls: LexwareCapturedRequest[] = []
  const client = lexwareClientCreate({
    accessToken: "token",
    fetch: async (input, init) => {
      calls.push({ input, init })
      return responses.shift() ?? lexwareJsonResponse({ ok: true })
    },
  })
  if (!client.success) throw new Error(client.errorMessage)
  return { client: client.data, calls }
}

export async function lexwareRequestBodyJson(call: LexwareCapturedRequest): Promise<unknown> {
  return JSON.parse(String(call.init?.body))
}
