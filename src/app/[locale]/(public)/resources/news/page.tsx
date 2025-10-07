'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { type NewsArticle } from '@/lib/news';
import SearchBar from '@/components/ui/search-bar';
import CategoryFilter from '@/components/ui/category-filter';
import { NewsListSkeleton, SearchBarSkeleton, CategoryFilterSkeleton } from '@/components/ui/news-skeleton';
import { useStickyOnNavbar } from '@/hooks/useStickyOnNavbar';
import { showNavbarSearch, hideNavbarSearch } from '@/lib/navbar-search-events';
import Container from '@/components/commun/container';
import { Badge } from '@/components/ui/badge';
import ImageLueur from '@/components/commun/ImageLueur';

export default function NewsPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [categories, setCategories] = useState<string[]>(['all']);
    const [loading, setLoading] = useState(true);

    const { isSticky, elementRef } = useStickyOnNavbar({ navbarHeight: 64 });

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`/api/news?locale=${locale}`);
                const data = await response.json();

                if (response.ok) {
                    setArticles(data.articles || []);
                    setCategories(data.categories || ['all']);
                } else {
                    console.error('Error fetching news:', data.error);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [locale]);

    useEffect(() => {
        if (isSticky && !loading) {
            showNavbarSearch({
                isVisible: true,
                searchQuery,
                onSearchChange: setSearchQuery,
                placeholder: t('resources.news.searchPlaceholder')
            });
        } else {
            hideNavbarSearch();
        }
    }, [isSticky, searchQuery, t, loading]);

    useEffect(() => {
        return () => {
            hideNavbarSearch();
        };
    }, []);

    const filteredArticles = useMemo(() => {
        let filtered = articles;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter((article: NewsArticle) =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    }, [articles, searchQuery, selectedCategory]);

    const getCategoryLabel = (category: string) => {
        if (category === 'all') return t('resources.news.categories.all');
        return t(`resources.news.categories.${category}`, { defaultValue: category });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Container height='fit-title' textAlign='center'>
                <ImageLueur />
                <section className='flex flex-col justify-center items-center text-center w-full mb-8'>
                    <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.news.title')}>
                        {t('resources.news.title')}
                    </h1>
                    <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mb-8'>
                        {t('resources.news.subtitle')}
                    </p>
                </section>

                <div ref={elementRef} className='w-full flex flex-col gap-4 px-4 max-w-2xl mx-auto justify-center items-center'>
                    {loading ? (
                        <>
                            <SearchBarSkeleton />
                            <CategoryFilterSkeleton />
                        </>
                    ) : (
                        <>
                            <div ref={elementRef} className="w-full transition-all duration-500 ease-out">
                                <div className={`transition-all duration-500 ease-out ${isSticky ? 'opacity-0 transform scale-95 translate-y-2 pointer-events-none' : 'opacity-100 transform scale-100 translate-y-0'}`}>
                                    <SearchBar placeholder={t('resources.news.searchPlaceholder')} value={searchQuery} onChange={setSearchQuery} className="w-full z-10 relative" />
                                </div>
                            </div>
                            <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} getCategoryLabel={getCategoryLabel} className="z-10 relative w-full" />
                        </>
                    )}
                </div>
            </Container>

            <Container height='fit' pb>
                <section className='w-full max-w-6xl mx-auto z-10 relative px-4'>
                    {loading ? (
                        <NewsListSkeleton count={3} />
                    ) : filteredArticles.length > 0 ? (
                        <div className={`grid gap-6 ${filteredArticles.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : filteredArticles.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {filteredArticles.map((article) => (
                                <article key={article.slug} className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded font-medium">
                                            {getCategoryLabel(article.category)}
                                        </span>
                                        <span className="text-[var(--light-dark-3)] text-xs">
                                            {article.readTime} {t('resources.news.minReading')}
                                        </span>
                                    </div>

                                    <h2 className="text-white font-semibold text-xl mb-3 line-clamp-2">
                                        {article.title}
                                    </h2>

                                    <p className="text-[var(--light-dark-3)] text-sm mb-4 line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-[var(--light-dark-3)] text-xs">
                                            <span>{formatDate(article.date)}</span>
                                            <span className="ml-2">{t('resources.news.by')} {article.author}</span>
                                        </div>

                                        <Link href={`/resources/news/${article.slug}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline">
                                            {t('resources.news.read')}
                                        </Link>
                                    </div>

                                    {article.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {article.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} asChild>
                                                    <span>
                                                        {tag}
                                                    </span>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <div className="text-center py-12 z-10 relative">
                            <p className="text-[var(--light-dark-3)] text-lg">
                                {t('resources.news.NoArticles')} {searchQuery}
                            </p>
                            <button onClick={() => setSearchQuery('')} className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline">
                                {t('commun.searchBar.clear')}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 z-10 relative">
                            <p className="text-[var(--light-dark-3)] text-lg">
                                {t('resources.news.NoArticles')}
                            </p>
                        </div>
                    )}
                </section>
            </Container>
        </>
    )
}
