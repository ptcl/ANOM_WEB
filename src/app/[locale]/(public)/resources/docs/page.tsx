import Container from '@/components/commun/container'
import React from 'react'
import { useTranslations } from 'next-intl';
import ImageLueur from '@/components/commun/ImageLueur';
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
