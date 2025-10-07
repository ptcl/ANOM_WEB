import Container from '@/components/commun/container'
import React from 'react'
import { useTranslations } from 'next-intl';
import ImageLueur from '@/components/commun/ImageLueur';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Documentation et Ressources',
    description: 'Découvrez toutes les ressources et documentations nécessaires pour participer à l\'expérience ARG Anom-Archives de Destiny 2. Guides, mystères et indices pour débloquer des emblèmes exclusifs.',
    keywords: ['Documentation', 'Ressources', 'Guide', 'ARG', 'Destiny 2', 'Anom-Archives', 'Mystères', 'Emblèmes', 'Tutoriel'],
    openGraph: {
        title: 'Documentation et Ressources - Anom-Archives',
        description: 'Toutes les ressources pour participer à l\'ARG Anom-Archives de Destiny 2.',
        type: 'website',
    },
};

export default function DocPage() {
    const t = useTranslations();

    return (
        <Container>
            <ImageLueur />
            <section className='flex flex-col justify-center items-center text-center w-full'>
                <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.title')}>
                    {t('resources.title')}
                </h1>
                <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto'>
                    {t('resources.subtitle')}
                </p>
            </section>

        </Container>
    )
}
