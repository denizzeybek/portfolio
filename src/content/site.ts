/**
 * Non-translatable facts only. Every string a visitor reads lives in src/locales/*.json;
 * what stays here are addresses, technology names and the ids the locale files key against.
 */
export const CONTACT = {
  email: 'zeybekdeniz64@gmail.com',
  github: 'https://github.com/denizzeybek',
  githubLabel: 'github.com/denizzeybek',
  linkedin: 'https://linkedin.com/in/denizzeybek',
  linkedinLabel: 'linkedin.com/in/denizzeybek',
  cvUrl: '/cv.pdf',
} as const

export const STACK = [
  'Vue 3 · Nuxt · TypeScript',
  'React · React Native, hands-on',
  'Tailwind · Vitest · Playwright',
  'Node · NestJS · Module Federation',
  'Electron, desktop apps',
  'Claude Code, daily',
] as const

export interface IExperience {
  id: string
  company: string
  stack: string[]
}

/** CV-level context only — see .claude/rules/content.md. Copy lives under `experience.<id>`. */
export const EXPERIENCE: readonly IExperience[] = [
  {
    id: 'insiderone',
    company: 'InsiderOne',
    stack: ['Vue', 'TypeScript', 'Module Federation', 'Vitest', 'Playwright'],
  },
  {
    id: 'ruul',
    company: 'Ruul',
    stack: ['Vue 3', 'Nuxt', 'TypeScript', 'Pinia', 'Tailwind'],
  },
  {
    id: 'eclone',
    company: 'Eclone',
    stack: ['Vue', 'SQL', 'REST'],
  },
]
