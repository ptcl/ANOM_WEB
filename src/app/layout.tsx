import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: {
        default: 'Anom-Archives',
        template: '%s | Anom-Archives'
    },
    description: 'Anom-Archives est une expérience ARG communautaire immersive dans l\'univers de Destiny 2. Résolvez des mystères, plongez dans le lore de Bungie et débloquez des emblèmes exclusifs gratuits.',
    keywords: ['Destiny 2', 'ARG', 'Anom-Archives', 'Bungie', 'Community', 'Mystères', 'Emblèmes', 'Guardiens', 'Lore', 'Gaming', 'Vex', 'Cabal', 'Fallen', 'Hive', 'Exclusif', 'Gratuit', 'Événements', 'Jeux vidéo'],
    authors: [{ name: 'Lucas Raffalli' }],
    creator: 'Lucas Raffalli',
    publisher: 'Anom-Archives',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
        languages: {
            'fr': '/fr',
            'en': '/en',
            'it': '/it',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: '/',
        title: 'Anom-Archives - Destiny 2 ARG Community Experience',
        description: 'Expérience ARG communautaire immersive dans l\'univers de Destiny 2. Résolvez des mystères et débloquez des emblèmes exclusifs.',
        siteName: 'Anom-Archives',
        images: [
            {
                url: '/img/anom-archives.png',
                width: 1200,
                height: 630,
                alt: 'Anom-Archives - Destiny 2 ARG Experience',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Anom-Archives - Destiny 2 ARG Community Experience',
        description: 'Expérience ARG communautaire immersive dans l\'univers de Destiny 2. Résolvez des mystères et débloquez des emblèmes exclusifs.',
        site: '@AnomArchives',
        creator: '@Luclarity',
        images: ['/img/anom-archives.png'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}