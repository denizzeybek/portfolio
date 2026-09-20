import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import UiButton from '@/components/ui/UiButton.vue'

describe('UiButton', () => {
  it('renders a real button element by default', () => {
    const wrapper = mount(UiButton, { slots: { default: 'Save' } })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.text()).toBe('Save')
  })

  it('renders an anchor when href is given, without a button type', () => {
    const wrapper = mount(UiButton, { props: { href: 'mailto:someone@example.com' } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('mailto:someone@example.com')
    expect(wrapper.attributes('type')).toBeUndefined()
  })

  it.each([
    ['solid', 'bg-accent'],
    ['outline', 'border-accent'],
    ['ghost', 'border-line-strong'],
  ] as const)('applies the %s variant', (variant, expected) => {
    const wrapper = mount(UiButton, { props: { variant } })

    expect(wrapper.classes().join(' ')).toContain(expected)
  })

  it('keeps every size at a 44px minimum touch target', () => {
    for (const size of ['sm', 'md'] as const) {
      const wrapper = mount(UiButton, { props: { size } })
      expect(wrapper.classes().join(' ')).toContain('min-h-11')
    }
  })
})
