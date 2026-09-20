import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import UiButton from '@/components/ui/UiButton.vue'

describe('UiButton as a download link', () => {
  it('passes the download attribute through to the anchor', () => {
    const wrapper = mount(UiButton, {
      props: { href: '/cv.pdf' },
      attrs: { download: 'Deniz-Zeybek-CV.pdf' },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('download')).toBe('Deniz-Zeybek-CV.pdf')
  })
})
