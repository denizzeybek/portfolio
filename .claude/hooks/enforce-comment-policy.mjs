#!/usr/bin/env node
/** PreToolUse hook: only TODO/FIXME/HACK and lint directives may use // comments. */
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

if (!/\.(vue|ts|mjs)$/.test(path) || typeof text !== 'string') process.exit(0)

const allowed =
  /^\/\/\s*(TODO|FIXME|HACK)\b|^\/\/\s*eslint-|^\/\/\s*@ts-|^\/\/\s*prettier-ignore|^\/\/\s*<reference/

const bad = text
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('//') && !allowed.test(line))

if (bad.length > 0) {
  console.error(
    `Comment policy (.claude/rules/comment-policy.md): ${bad.length} disallowed // comment(s) in ${path}:\n` +
      bad.slice(0, 5).map((l) => `  ${l}`).join('\n') +
      '\nUse a /** JSDoc */ block when the explanation earns its place, or delete it.',
  )
  process.exit(2)
}
process.exit(0)
