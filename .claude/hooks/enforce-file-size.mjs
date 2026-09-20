#!/usr/bin/env node
/** PreToolUse hook: blocks a Write/Edit that would push a source file past 250 lines. */
import { readFileSync } from 'node:fs'

const LIMIT = 250

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

if (!/\.(vue|ts)$/.test(path) || path.includes('/node_modules/')) process.exit(0)

const content =
  typeof input.content === 'string'
    ? input.content
    : typeof input.new_string === 'string'
      ? null
      : null

let lines = 0
if (content !== null) {
  lines = content.split('\n').length
} else {
  try {
    lines = readFileSync(path, 'utf8').split('\n').length
  } catch {
    process.exit(0)
  }
}

if (lines > LIMIT) {
  console.error(
    `File size rule (CLAUDE.md → 250 lines): ${path} would be ${lines} lines.\n` +
      'Split it instead: child components in _components/, logic into a composable, ' +
      'types into src/types/. See .claude/rules/vue-components.md section 2.',
  )
  process.exit(2)
}
process.exit(0)
