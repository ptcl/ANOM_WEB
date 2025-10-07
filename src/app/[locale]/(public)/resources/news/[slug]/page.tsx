'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { type NewsArticle } from '@/lib/news';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { NewsArticleSkeleton } from '@/components/ui/news-skeleton';
import Container from '@/components/commun/container';
import { Badge } from '@/components/ui/badge';
import ImageLueur from '@/components/commun/ImageLueur';

export default function NewsArticlePage() {
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
                    setArticle(null);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug, locale]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className='bg-[var(--background)] overflow-hidden w-full min-h-screen relative flex flex-col py-20'>
                <ImageLueur />
                <div className="z-10 px-4">
                    <NewsArticleSkeleton />
                </div>
            </section>
        );
    }

    if (!article) {
        return (
            <section className='bg-[var(--background)] overflow-hidden w-full h-screen relative flex flex-col items-center justify-center text-center'>
                <ImageLueur />
                <div className="z-10 text-center">
                    <h1 className='leading-tight md:leading-none gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.title')}>
                        {t('resources.news.notFoundTitle')}
                    </h1>
                    <p className="text-[var(--light-dark-3)] mb-6 mt-4">
                        {t('resources.news.notFoundMessage')}
                    </p>
                    <Link href="/resources/news" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        {t('resources.news.back')}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <Container height='fit' >
                <ImageLueur />
                <div className="z-10 max-w-4xl mx-auto px-4 mt-40">
                    <nav className="mb-6">
                        <Link href="/resources/news" className="text-blue-400 hover:text-blue-300 text-sm">
                            {t('resources.news.back')}
                        </Link>
                    </nav>

                    <h1 className='leading-13.5 md:leading-26 gradient__vex font-semibold text-6xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.title')}>
                        {article.title}
                    </h1>
                    <p className="text-[var(--light-dark-2)] text-lg md:text-xl max-w-1xl mx-auto leading-relaxed mt-4">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4 flex-wrap mt-6">
                        <Badge asChild className="bg-blue-500 text-white dark:bg-blue-600" variant={'secondary'}>
                            <span>
                                {t(`resources.news.categories.${article?.category}`, { defaultValue: article?.category })}
                            </span>
                        </Badge>
                        <span className="text-[var(--light-dark-3)] text-sm">
                            {formatDate(article?.date)}
                        </span>
                        <span className="text-[var(--light-dark-3)] text-sm">
                            {article.readTime} {t('resources.news.minReading')}
                        </span>
                        <span className="text-[var(--light-dark-3)] text-sm">
                            {t('resources.news.by')} {article.author}
                        </span>
                    </div>
                    {article.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {article.tags.map((tag) => (
                                <Badge key={tag} asChild>
                                    <span>
                                        {tag}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </Container>

            <Container textAlign='left' height='fit' >
                <article className="max-w-4xl mx-auto px-4 z-10 relative">
                    <MarkdownRenderer content={article.content} className="prose prose-lg prose-invert max-w-none" />
                    <div className="border-t border-white/10 mt-12 pt-8">
                        <div className="flex justify-between items-center">
                            <Link href="/resources/news" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                                {t('resources.news.back')}
                            </Link>
                        </div>
                    </div>
                </article>
            </Container>
        </>
    );
}