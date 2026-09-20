import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'

const LIMIT = 250
const patterns = ['src/**/*.{vue,ts}', '__tests__/**/*.ts']
const files = patterns.flatMap((pattern) =>
  globSync(pattern, { exclude: (p) => p.includes('node_modules') }),
)

const offenders = files
  .map((file) => ({ file, lines: readFileSync(file, 'utf8').split('\n').length }))
  .filter(({ lines }) => lines > LIMIT)
  .sort((a, b) => b.lines - a.lines)

if (offenders.length === 0) {
  console.log(`check:size — ${files.length} files, all within ${LIMIT} lines`)
  process.exit(0)
}

console.error(`check:size — ${offenders.length} file(s) over ${LIMIT} lines:\n`)
for (const { file, lines } of offenders) console.error(`  ${lines}  ${file}`)
console.error('\nSplit them: see .claude/rules/vue-components.md section 2.')
process.exit(1)
