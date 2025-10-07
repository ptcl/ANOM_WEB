import { NextResponse } from 'next/server';
import { getAllNewsArticles, getAllNewsCategories } from '@/lib/news';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'fr';

        const articles = getAllNewsArticles(locale);
        const categories = getAllNewsCategories(locale);

        return NextResponse.json({
            articles,
            categories: ['all', ...categories]
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            {
                articles: [],
                categories: ['all'],
                error: 'Failed to fetch news articles'
            },
            { status: 500 }
        );
    }
}