interface JsonLdProps {
  type: 'WebSite' | 'Article' | 'Organization' | 'BreadcrumbList'
  data: Record<string, unknown>
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Données structurées pour le site web principal
export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return (
    <JsonLd
      type="WebSite"
      data={{
        name: 'Anom-Archives',
        alternateName: 'ANOM-ARCHIVES',
        url: baseUrl,
        description: 'Expérience ARG communautaire immersive dans l\'univers de Destiny 2. Résolvez des mystères, plongez dans le lore de Bungie et débloquez des emblèmes exclusifs gratuits.',
        inLanguage: ['fr', 'en', 'it'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Anom-Archives',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/img/anom_soon.webp`
          }
        }
      }}
    />
  )
}

// Données structurées pour un article de news
export function ArticleJsonLd({ article, locale, baseUrl }: { 
  article: {
    title: string
    excerpt: string
    date: string
    author: string
    slug: string
    category: string
    tags: string[]
  }, 
  locale: string, 
  baseUrl: string 
}) {
  return (
    <JsonLd
      type="Article"
      data={{
        headline: article.title,
        description: article.excerpt,
        image: [`${baseUrl}/img/anom_soon.webp`],
        datePublished: article.date,
        dateModified: article.date,
        author: {
          '@type': 'Person',
          name: article.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'Anom-Archives',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/img/anom_soon.webp`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${locale}/resources/news/${article.slug}`
        },
        articleSection: article.category,
        keywords: article.tags,
        inLanguage: locale,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Anom-Archives',
          url: baseUrl
        }
      }}
    />
  )
}

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return (
    <JsonLd
      type="Organization"
      data={{
        name: 'Anom-Archives',
        alternateName: 'ANOM-ARCHIVES',
        url: baseUrl,
        logo: `${baseUrl}/img/anom-archives.png`,
        description: 'Expérience ARG communautaire immersive dans l\'univers de Destiny 2',
        foundingDate: '2025',
        sameAs: [
          'https://x.com/AnomArchives',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['French', 'English', 'Italian']
        }
      }}
    />
  )
}