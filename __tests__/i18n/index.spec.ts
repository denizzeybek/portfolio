import { describe, expect, it } from 'vitest'

import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

import { resolveInitialLocale } from '@/i18n'

function keyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix === '' ? key : `${prefix}.${key}`),
  )
}

describe('resolveInitialLocale', () => {
  it('prefers a stored choice among the enabled locales', () => {
    expect(resolveInitialLocale('en', ['tr-TR'])).toBe('en')
  })

  it('ignores a stored locale that is not published yet', () => {
    expect(resolveInitialLocale('tr', ['tr-TR'])).toBe('en')
  })

  it('ignores a browser language that is not published yet', () => {
    expect(resolveInitialLocale(null, ['tr-TR', 'en-US'])).toBe('en')
  })

  it('ignores an unsupported stored value and an unsupported browser language', () => {
    expect(resolveInitialLocale('de', ['fr-FR'])).toBe('en')
  })

  it('defaults to English with no signal at all', () => {
    expect(resolveInitialLocale(null, [])).toBe('en')
  })
})

describe('locale files', () => {
  it('keep en and tr at key parity', () => {
    expect(keyPaths(tr).sort()).toEqual(keyPaths(en).sort())
  })

  it('leave no empty translation', () => {
    const empty = Object.entries({ en, tr }).flatMap(([name, messages]) =>
      keyPaths(messages)
        .filter((path) => {
          const value = path.split('.').reduce<unknown>(
            (node, key) => (node as Record<string, unknown>)[key],
            messages,
          )
          return typeof value !== 'string' || value.trim() === ''
        })
        .map((path) => `${name}.${path}`),
    )

    expect(empty).toEqual([])
  })
})
