import { Metadata } from 'next'
import { getNewsArticleBySlug } from '@/lib/news'
import NewsArticleClientPage from './client-page'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const article = getNewsArticleBySlug(slug, locale)

  if (!article) {
    return {
      title: 'Article non trouvé',
      description: 'L\'article demandé n\'existe pas.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const articleUrl = `${baseUrl}/${locale}/resources/news/${slug}`

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [
      ...article.tags,
      'Anom-Archives',
      'Destiny 2',
      'News',
      'Gaming',
      article.category
    ],
    authors: [{ name: article.author }],
    category: article.category,
    alternates: {
      canonical: articleUrl,
      languages: {
        'fr': `${baseUrl}/fr/resources/news/${slug}`,
        'en': `${baseUrl}/en/resources/news/${slug}`,
        'it': `${baseUrl}/it/resources/news/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      siteName: 'Anom-Archives',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
      section: article.category,
      locale: locale,
      images: [
        {
          url: '/img/anom_soon.webp',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      site: '@anom_archives',
      creator: '@anom_archives',
      images: ['/img/anom_soon.webp'],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default NewsArticleClientPage