import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `https://filezy.io/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://filezy.io',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://filezy.io/tools',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolPages,
    {
      url: 'https://filezy.io/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://filezy.io/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://filezy.io/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://filezy.io/blog/compress-pdf-free-online',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://filezy.io/blog/remove-background-from-image-free',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://filezy.io/blog/pdf-tools-without-uploading-files',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://filezy.io/alternatives/smallpdf',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://filezy.io/alternatives/ilovepdf',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://filezy.io/alternatives/tinywow',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
