'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { type NewsArticle } from '@/lib/news';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { NewsArticleSkeleton } from '@/components/ui/news-skeleton';
import Container from '@/components/commun/container';
import { Badge } from '@/components/ui/badge';
import ImageLueur from '@/components/commun/ImageLueur';
import { ArticleJsonLd } from '@/components/seo/JsonLd';

export default function NewsArticleClientPage() {
    const params = useParams();
    const t = useTranslations();
    const slug = params.slug as string;
    const locale = params.locale as string;
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/news/${slug}?locale=${locale}`);
                const data = await response.json();

                if (response.ok) {
                    setArticle(data.article);
                } else {
                    console.error('Article not found:', data.error);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug, locale]);

    if (loading) {
        return <NewsArticleSkeleton />;
    }

    if (!article) {
        return (
            <Container className="bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col">
                <ImageLueur lueurImage='/img/glow/danger.png' />
                <section className='flex flex-col justify-center items-center text-center w-full py-20'>
                    <h1 className='leading-8 md:leading-26 gradient__danger font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto'>
                        404
                    </h1>
                    <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto text-white mt-4'>
                        {t('resources.news.notFoundTitle')}
                    </p>
                    <Link
                        href="/resources/news"
                        className='mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white'
                    >
                        {t('common.backToNews')}
                    </Link>
                </section>
            </Container>
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return (
        <Container className="bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col">
            <ArticleJsonLd article={article} locale={locale} baseUrl={baseUrl} />
            <ImageLueur />

            <section className="relative z-10 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <nav className="mb-8">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Link href="/resources" className="hover:text-white transition-colors">
                                {t('resources.title')}
                            </Link>
                            <span>/</span>
                            <Link href="/resources/news" className="hover:text-white transition-colors">
                                {t('resources.news.title')}
                            </Link>
                            <span>/</span>
                            <span className="text-white">{article.title}</span>
                        </div>
                    </nav>

                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                            <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            <span>•</span>
                            <span>{t('common.by')} {article.author}</span>
                            {article.readTime && (
                                <>
                                    <span>•</span>
                                    <span>{article.readTime} min {t('common.read')}</span>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <Badge variant="secondary">
                                {article.category}
                            </Badge>
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        {article.excerpt}
                    </p>
                </div>
            </section>

            <section className="relative z-10 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <MarkdownRenderer content={article.content} />
                    </div>
                </div>
            </section>

            <section className="relative z-10 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="border-t border-white/10 pt-8">
                        <Link
                            href="/resources/news"
                            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
                        >
                            ← {t('common.backToNews')}
                        </Link>
                    </div>
                </div>
            </section>
        </Container>
    );
}