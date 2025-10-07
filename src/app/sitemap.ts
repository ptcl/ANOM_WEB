import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllNewsArticles } from '@/lib/news'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const staticRoutes = [
        '',
        '/resources',
        '/resources/faq',
        '/resources/news',
        '/legal',
    ]

    const staticPages: MetadataRoute.Sitemap = []

    routing.locales.forEach((locale) => {
        staticRoutes.forEach((route) => {
            staticPages.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : route === '/resources' ? 0.9 : 0.8,
                alternates: {
                    languages: routing.locales.reduce((acc, loc) => {
                        acc[loc] = `${baseUrl}/${loc}${route}`
                        return acc
                    }, {} as Record<string, string>)
                }
            })
        })
    })

    const newsPages: MetadataRoute.Sitemap = []

    routing.locales.forEach((locale) => {
        try {
            const articles = getAllNewsArticles(locale)
            articles.forEach((article) => {
                newsPages.push({
                    url: `${baseUrl}/${locale}/resources/news/${article.slug}`,
                    lastModified: new Date(article.date),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                    alternates: {
                        languages: routing.locales.reduce((acc, loc) => {
                            acc[loc] = `${baseUrl}/${loc}/resources/news/${article.slug}`
                            return acc
                        }, {} as Record<string, string>)
                    }
                })
            })
        } catch (error) {
            console.warn(`Could not load news articles for locale ${locale}:`, error)
        }
    })

    return [...staticPages, ...newsPages]
}