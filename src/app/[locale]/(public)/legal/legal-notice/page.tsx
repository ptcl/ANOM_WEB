import Container from '@/components/commun/container'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { getLegalContent } from '@/lib/legal'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import ImageLueur from '@/components/commun/ImageLueur'

export default async function LegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations();
    const content = getLegalContent('legal-notice', locale);

    if (!content) {
        return (
            <>
                <Container height='fit-title' textAlign='center'>
                    <ImageLueur />
                    <section className='flex flex-col justify-center items-center text-center w-full mb-8'>
                        <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('legal.title')}>
                            {t('legal.title')}
                        </h1>
                        <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mb-8'>
                            {t('legal.subtitle')}
                        </p>
                    </section>
                </Container>

                <Container height="fit" textAlign="left">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-white mb-4">{t('legal.noFound')}</h2>
                        <p className="text-[var(--light-dark-3)] mb-6">
                            {t('legal.noFound')}
                        </p>
                        <Link href="/legal" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                            {t('legal.back')}
                        </Link>
                    </div>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container height='fit-title' textAlign='center'>
                <ImageLueur />
                <nav className="mb-8 z-10">
                    <Link href="/legal" className="text-blue-400 hover:text-blue-300 text-sm">
                        {t('legal.back')}
                    </Link>
                </nav>
                <section className='flex flex-col justify-center items-center text-center w-full mb-8'>
                    <h1 className='leading-8 md:leading-25 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('legal.cards.legalNotice.title')}>
                        {t('legal.cards.legalNotice.title')}
                    </h1>
                    <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mb-8'>
                        {t('legal.cards.legalNotice.description')}
                    </p>
                </section>
            </Container>

            <Container height='fit' pb textAlign='left'>
                <div className="w-full max-w-4xl mx-auto z-10 relative px-4">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <MarkdownRenderer content={content} />
                    </div>
                </div>
            </Container>
        </>
    );
}
