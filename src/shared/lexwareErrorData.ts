export function lexwareErrorData(input: unknown): string | null {
  if (typeof input === "string") return input
  return JSON.stringify(input) ?? null
}
