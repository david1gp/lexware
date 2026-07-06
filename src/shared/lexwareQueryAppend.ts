export type LexwareQuery = Record<string, string | number | boolean | null | undefined>

export function lexwareQueryAppend(url: URL, query?: LexwareQuery): void {
  if (!query) return
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    url.searchParams.set(key, String(value))
  }
}
