import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { RouterLinkStub } from '@vue/test-utils'

import UiLink from './UiLink.vue'

const stubs = { RouterLink: RouterLinkStub }

describe('UiLink', () => {
  it('renders a router link when to is given', () => {
    const wrapper = mount(UiLink, { props: { to: '/notes/x' }, global: { stubs } })

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/notes/x')
  })

  it('renders an anchor when href is given', () => {
    const wrapper = mount(UiLink, { props: { href: '/cv.pdf' }, global: { stubs } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/cv.pdf')
  })

  it('marks external links with rel=noreferrer', () => {
    const external = mount(UiLink, { props: { href: 'https://example.com' }, global: { stubs } })
    const internal = mount(UiLink, { props: { href: '/cv.pdf' }, global: { stubs } })

    expect(external.attributes('rel')).toBe('noreferrer')
    expect(internal.attributes('rel')).toBeUndefined()
  })

  it('drops the underline when asked', () => {
    const wrapper = mount(UiLink, { props: { href: '#x', underline: false }, global: { stubs } })

    expect(wrapper.classes().join(' ')).toContain('no-underline')
  })
})
