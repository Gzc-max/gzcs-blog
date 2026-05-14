/**
 * Lightweight frontmatter parser (browser-compatible, no gray-matter dependency)
 * Parses YAML-like frontmatter from markdown files.
 */
export interface Frontmatter {
  [key: string]: string | string[] | number | boolean
}

export function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: raw }
  }

  const rawYaml = match[1]
  const content = match[2]
  const data: Frontmatter = {}

  for (const line of rawYaml.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Remove quotes
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }

    // Parse arrays like [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean) as unknown as string
    }

    // Parse numbers
    if (/^\d+$/.test(value)) {
      value = parseInt(value, 10) as unknown as string
    }

    // Parse booleans
    if (value === 'true') value = true as unknown as string
    if (value === 'false') value = false as unknown as string

    data[key] = value as string | string[] | number | boolean
  }

  return { data, content }
}
