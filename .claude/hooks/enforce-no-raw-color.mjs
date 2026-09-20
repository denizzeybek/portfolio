#!/usr/bin/env node
/** PreToolUse hook: keeps raw colours and arbitrary values out of components. */
import { readFileSync } from 'node:fs'

const read = () => {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return null
  }
}

const payload = read()
const input = payload?.tool_input ?? {}
const path = input.file_path ?? ''
const text = input.content ?? input.new_string ?? ''

if (!path.includes('/src/') || !/\.vue$/.test(path) || typeof text !== 'string') process.exit(0)

const findings = []
if (/#[0-9a-fA-F]{3,8}\b/.test(text)) findings.push('a raw hex colour')
if (/\b(?:rgb|hsl)a?\(/.test(text)) findings.push('an rgb()/hsl() colour')
if (/\b(?:text|bg|border)-(?:gray|zinc|slate|neutral|stone|red|green|blue)-\d{2,3}\b/.test(text))
  findings.push("Tailwind's stock palette")
if (/\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/.test(text)) findings.push('an arbitrary colour value')

if (findings.length > 0) {
  console.error(
    `Styling rule (.claude/rules/styling.md): ${path} contains ${findings.join(', ')}.\n` +
      'Use a semantic token from src/assets/main.css (bg-canvas, text-ink-muted, border-line, ' +
      'text-accent…). If the value is missing, add it to @theme first.',
  )
  process.exit(2)
}
process.exit(0)
