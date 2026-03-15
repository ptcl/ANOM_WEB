'use client'
import React from 'react'
import DOMPurify from 'dompurify'
import Placeholder from '@/components/protocol/Placeholder';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Container from '@/components/commun/container';
import ImageLueur from '@/components/commun/ImageLueur';

interface FAQQuestion {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export default function ResourcesPage() {
    const t = useTranslations();

    return (
        <>
            <Container height='fit-title' textAlign='center' bgDefault>
                <ImageLueur />
                <section className='flex flex-col justify-center items-center text-center w-full'>
                    <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.title')}>
                        {t('resources.title')}
                    </h1>
                    <p className='font-grotesk text-[var(--black-600)] text-sm md:text-lg max-w-xl z-10 mx-auto'>
                        {t('resources.subtitle')}
                    </p>
                </section>

            </Container>
            <Container height='fit' pb textAlign='left' bgDefault>
                <section className='flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-6xl mx-auto px-4'>
                    <div className='w-full mx-auto h-100 md:h-150'>
                        <Placeholder text={t('placeholder.ressource.doc')} />
                    </div>
                    <div className='w-full h-100 md:h-150'>
                        <Placeholder text={t('placeholder.ressource.news')} />
                    </div>
                </section>
                <section className='h-fit p-4 w-150% md:w-1/2 mx-auto flex flex-col gap-4 mb-16 mt-16'>
                    <h2 className='font-grotesk text-[var(--theme-primary)] text-3xl font-bold -mb-3'>{t('resources.faq.title')}</h2>
                    <p className='font-grotesk text-[var(--black-600)] text-sm mb-4'>{t('resources.faq.subtitle')}</p>
                    <Accordion type="single" collapsible className='bg-[var(--black-5)] border-[1.5px] border-[var(--grey-accent1)] rounded-sm w-full px-4 cursor-pointer text-start'>
                        {(t.raw('resources.faq.questions') || []).slice(0, 10).map((question: FAQQuestion, index: number) => (
                            <AccordionItem key={question.id || `item-${index}`} value={question.id || `item-${index}`}>
                                <AccordionTrigger className='cursor-pointer'>
                                    {question.question}
                                </AccordionTrigger>
                                <AccordionContent className='text-[var(--black-500)]'>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.answer) }}
                                        className="[&_mark]:bg-[var(--protocol)]/20 [&_mark]:text-[var(--protocol)] [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded [&_mark]:font-medium"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                </section>
                <section className='flex flex-col justify-center items-center'>
                    <h2 className='font-grotesk text-[var(--white-1)] text-3xl font-bold text-center mb-1'>{t('resources.faq.needHelp.title')}</h2>
                    <p className='font-grotesk text-[var(--black-600)] text-sm text-center mb-2 w-full'>{t('resources.faq.needHelp.subtitle')}</p>
                    <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                        <Link href="https://discord.gg/pTnqbQtgKn" className='mx-auto hover__underline__3' target="_blank" rel="noopener noreferrer">
                            {t('commun.links.discord')}
                        </Link>
                        <Link href="/resources/news" className='mx-auto hover__underline__3' rel="noopener noreferrer">
                            {t('commun.links.news')}
                        </Link>
                        <Link href="/resources/faq" className='mx-auto hover__underline__3' rel="noopener noreferrer">
                            {t('commun.links.faq')}
                        </Link>
                    </div>
                </section>
            </Container>
        </>
    )
}
