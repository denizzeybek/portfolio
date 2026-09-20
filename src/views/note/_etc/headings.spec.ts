import { describe, expect, it } from 'vitest'

import { extractHeadings, slugifyHeading, withHeadingIds } from './headings'

const html = '<h2>The contract first</h2><p>text</p><h2>Where it <em>breaks</em></h2>'

describe('slugifyHeading', () => {
  it('makes an anchor-safe id', () => {
    expect(slugifyHeading('Types as guardrails')).toBe('types-as-guardrails')
  })
})

describe('extractHeadings', () => {
  it('lists every h2 with its id, stripping inline markup', () => {
    expect(extractHeadings(html)).toEqual([
      { id: 'the-contract-first', text: 'The contract first' },
      { id: 'where-it-breaks', text: 'Where it breaks' },
    ])
  })

  it('returns nothing when the note has no sections', () => {
    expect(extractHeadings('<p>just a paragraph</p>')).toEqual([])
  })
})

describe('withHeadingIds', () => {
  it('gives each h2 the id its outline link points at', () => {
    expect(withHeadingIds(html)).toContain('<h2 id="the-contract-first">The contract first</h2>')
  })
})
