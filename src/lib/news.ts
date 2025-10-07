import fs from 'fs';
import path from 'path';

export interface NewsArticle {
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    author: string;
    excerpt: string;
    content: string;
    readTime?: number;
}

const contentDirectory = path.join(process.cwd(), 'src/app/content/news');

function getNewsDirectory(locale: string = 'en'): string {
    return path.join(contentDirectory, locale);
}

function calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

function parseFrontmatter(fileContent: string): {
    data: Record<string, string | string[]>;
    content: string
} {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: fileContent };
    }

    const [, frontmatterStr, content] = match;
    const data: Record<string, string | string[]> = {};

    const lines = frontmatterStr.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) continue;

        const key = trimmed.substring(0, colonIndex).trim();
        let value: string = trimmed.substring(colonIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (value.startsWith('[') && value.endsWith(']')) {
            const arrayValue = value.slice(1, -1)
                .split(',')
                .map(item => item.trim().replace(/['"]/g, ''))
                .filter(item => item.length > 0);
            data[key] = arrayValue;
        } else {
            data[key] = value;
        }
    }

    return { data, content };
}

export function getAllNewsArticles(locale: string = 'fr'): NewsArticle[] {
    const newsDirectory = getNewsDirectory(locale);

    if (!fs.existsSync(newsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(newsDirectory);
    const allNewsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');

            const fullPath = path.join(newsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const { data, content } = parseFrontmatter(fileContents);

            const readTime = calculateReadTime(content);

            return {
                slug,
                content,
                readTime,
                title: (data.title as string) || '',
                date: (data.date as string) || '',
                category: (data.category as string) || '',
                tags: (data.tags as string[]) || [],
                author: (data.author as string) || '',
                excerpt: (data.excerpt as string) || '',
            };
        });

    return allNewsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsArticleBySlug(slug: string, locale: string = 'fr'): NewsArticle | null {
    try {
        const newsDirectory = getNewsDirectory(locale);
        const fullPath = path.join(newsDirectory, `${slug}.md`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = parseFrontmatter(fileContents);
        const readTime = calculateReadTime(content);

        return {
            slug,
            content,
            readTime,
            title: (data.title as string) || '',
            date: (data.date as string) || '',
            category: (data.category as string) || '',
            tags: (data.tags as string[]) || [],
            author: (data.author as string) || '',
            excerpt: (data.excerpt as string) || '',
        };
    } catch (error) {
        console.error(`Error reading article ${slug}:`, error);
        return null;
    }
}

export function getAllNewsSlugs(locale: string = 'fr'): string[] {
    const newsDirectory = getNewsDirectory(locale);

    if (!fs.existsSync(newsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(newsDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getNewsArticlesByCategory(category: string, locale: string = 'fr'): NewsArticle[] {
    const allArticles = getAllNewsArticles(locale);
    return allArticles.filter((article) => article.category === category);
}

export function getAllNewsCategories(locale: string = 'en'): string[] {
    const allArticles = getAllNewsArticles(locale);
    const categories = allArticles.map((article) => article.category);
    return Array.from(new Set(categories));
}

export function searchNewsArticles(query: string, locale: string = 'en'): NewsArticle[] {
    const allArticles = getAllNewsArticles(locale);
    const lowercaseQuery = query.toLowerCase();

    return allArticles.filter((article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
}