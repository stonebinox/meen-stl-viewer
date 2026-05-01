export function getUrlParam(): string | null {
  try {
    const params = new URLSearchParams(window.location.search)
    const url = params.get('url')
    if (!url) return null
    // Validate protocol
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    return url
  } catch {
    return null
  }
}

export async function fetchUrlAsFile(url: string): Promise<File> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  const blob = await response.blob()
  // Infer filename from URL path
  const pathname = new URL(url).pathname
  const fileName = pathname.split('/').pop() ?? 'model'
  return new File([blob], fileName, { type: blob.type })
}
