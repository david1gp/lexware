export function cliJsonStringify(input: unknown): string {
  return (
    JSON.stringify(input, (_key, value: unknown) => {
      if (typeof value === "bigint") return value.toString()
      if (value === undefined) return null
      return value
    }) ?? "null"
  )
}
