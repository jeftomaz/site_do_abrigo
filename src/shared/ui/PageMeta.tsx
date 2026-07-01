import { useEffect } from 'react'

const SITE_NAME = 'Abrigo'
const BASE_PATH = '/site_do_abrigo'

interface PageMetaProps {
  title: string
  description: string
  path: string
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
}

function canonicalUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(`${BASE_PATH}${normalizedPath}`, window.location.origin).toString()
}

export default function PageMeta({ title, description, path }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const url = canonicalUrl(path)

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', 'index, follow')
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertCanonical(url)
  }, [description, path, title])

  return null
}
