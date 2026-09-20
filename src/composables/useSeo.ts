import { watchEffect } from 'vue'

export const SITE_ORIGIN = 'https://denizzeybek.dev'
export const SITE_NAME = 'Deniz Zeybek'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og.png`

export interface ISeo {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  publishedAt?: string
  jsonLd?: Record<string, unknown>
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, value: string): void {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  const tag = existing ?? document.createElement('meta')
  tag.setAttribute(attribute, key)
  tag.setAttribute('content', value)
  if (existing === null) document.head.appendChild(tag)
}

function setLink(rel: string, href: string): void {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  const tag = existing ?? document.createElement('link')
  tag.setAttribute('rel', rel)
  tag.setAttribute('href', href)
  if (existing === null) document.head.appendChild(tag)
}

function setJsonLd(data: Record<string, unknown> | undefined): void {
  const existing = document.head.querySelector('script[data-seo-jsonld]')
  existing?.remove()
  if (data === undefined) return

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.dataset.seoJsonld = 'true'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Keeps the document head in step with the route. The same values are written into the
 * prerendered HTML at build time, so crawlers that do not run JavaScript see them too.
 */
export function useSeo(seo: () => ISeo): void {
  watchEffect(() => {
    const { title, description, path, type = 'website', publishedAt, jsonLd } = seo()
    const url = `${SITE_ORIGIN}${path}`

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setLink('canonical', url)

    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setMeta('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE)

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE)

    if (publishedAt !== undefined) {
      setMeta(
        'meta[property="article:published_time"]',
        'property',
        'article:published_time',
        publishedAt,
      )
    }

    setJsonLd(jsonLd)
  })
}
