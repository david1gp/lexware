export type LexwareFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export type LexwareClient = {
  accessToken: string
  baseUrl: string
  fetch: LexwareFetch
}
