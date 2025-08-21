import type { MetadataRoute } from 'next'
import { catalog } from '@/lib/products'
import { cases } from '@/lib/cases'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.thecurry.club'
  const staticPages = ['', '/how-it-works', '/products', '/case-studies', '/faqs', '/contact']
  const productPages = catalog.map(p => `/products/${p.slug}`)
  const casePages = cases.map(c => `/case-studies/${c.slug}`)
  return [
    ...posts.map(p=>({ url: `/news/${p.slug}`, lastModified: new Date(p.date) })),...staticPages, ...productPages, ...casePages].map(p => ({ url: base + p, changeFrequency: 'weekly' }))
}
