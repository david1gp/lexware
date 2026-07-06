export function lexwareFilenameFromContentDisposition(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1])

  const filenameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition)
  return filenameMatch?.[1] ?? null
}
