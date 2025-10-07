import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllNewsArticles } from '@/lib/news'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Dates fixes pour les pages statiques (meilleur pour le cache)
    const staticLastModified = new Date('2024-01-01')

    const staticRoutes: Array<{
        path: string
        priority: number
        changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    }> = [
            { path: '', priority: 1, changeFrequency: 'weekly' },
            { path: '/resources', priority: 0.9, changeFrequency: 'weekly' },
            { path: '/resources/faq', priority: 0.8, changeFrequency: 'monthly' },
            { path: '/resources/news', priority: 0.8, changeFrequency: 'daily' },
            { path: '/legal', priority: 0.5, changeFrequency: 'yearly' },
        ]

    const staticPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
        staticRoutes.map((route) => ({
            url: `${baseUrl}/${locale}${route.path}`,
            lastModified: staticLastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
            alternates: {
                languages: routing.locales.reduce((acc, loc) => {
                    acc[loc] = `${baseUrl}/${loc}${route.path}`
                    return acc
                }, {} as Record<string, string>)
            }
        }))
    )

    // Collecte tous les articles de toutes les langues
    const allArticlesBySlug = new Map<string, {
        slug: string
        locales: Set<string>
        latestDate: Date
    }>()

    routing.locales.forEach((locale) => {
        try {
            const articles = getAllNewsArticles(locale)
            articles.forEach((article) => {
                if (!allArticlesBySlug.has(article.slug)) {
                    allArticlesBySlug.set(article.slug, {
                        slug: article.slug,
                        locales: new Set([locale]),
                        latestDate: new Date(article.date)
                    })
                } else {
                    const existing = allArticlesBySlug.get(article.slug)!
                    existing.locales.add(locale)
                    const articleDate = new Date(article.date)
                    if (articleDate > existing.latestDate) {
                        existing.latestDate = articleDate
                    }
                }
            })
        } catch (error) {
            console.error(`Failed to load news articles for locale ${locale}:`, error)
        }
    })

    const newsPages: MetadataRoute.Sitemap = Array.from(allArticlesBySlug.values()).flatMap(
        (article) => {
            return Array.from(article.locales).map((locale) => ({
                url: `${baseUrl}/${locale}/resources/news/${article.slug}`,
                lastModified: article.latestDate,
                changeFrequency: 'monthly' as const,
                priority: 0.7,
                alternates: {
                    languages: Array.from(article.locales).reduce((acc, loc) => {
                        acc[loc] = `${baseUrl}/${loc}/resources/news/${article.slug}`
                        return acc
                    }, {} as Record<string, string>)
                }
            }))
        }
    )

    return [...staticPages, ...newsPages]
}