import Container from '@/components/commun/container'
import React from 'react'
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import ImageLueur from '@/components/commun/ImageLueur';

export default function LegalPage() {
  const t = useTranslations();
  return (
    <>
      <Container height='fit-title' textAlign='center'>
        <ImageLueur/>
        <section className='flex flex-col justify-center items-center text-center w-full mb-8'>
          <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('legal.title')}>
            {t('legal.title')}
          </h1>
          <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mb-8'>
            {t('legal.subtitle')}
          </p>
        </section>
      </Container>
      <Container height='screen' pb textAlign='left' className='pt-10'>
        <section className='w-full max-w-6xl mx-auto z-10 relative px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Link href='/legal/legal-notice' className='group'>
              <div className='border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:border-white/20 h-full'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center'>
                    <svg className='w-6 h-6 text-blue-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                    </svg>
                  </div>
                  <h2 className='text-white font-semibold text-xl group-hover:text-blue-300 transition-colors'>
                    {t('legal.cards.legalNotice.title')}
                  </h2>
                </div>
                <p className='text-[var(--light-dark-3)] text-sm leading-relaxed'>
                  {t('legal.cards.legalNotice.description')}
                </p>
                <div className='mt-6 flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors'>
                  {t('legal.readMore')} →
                </div>
              </div>
            </Link>

            <Link href='/legal/privacy' className='group'>
              <div className='border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:border-white/20 h-full'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center'>
                    <svg className='w-6 h-6 text-green-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <h2 className='text-white font-semibold text-xl group-hover:text-green-300 transition-colors'>
                    {t('legal.cards.privacy.title')}
                  </h2>
                </div>
                <p className='text-[var(--light-dark-3)] text-sm leading-relaxed'>
                  {t('legal.cards.privacy.description')}
                </p>
                <div className='mt-6 flex items-center text-green-400 text-sm font-medium group-hover:text-green-300 transition-colors'>
                  {t('legal.readMore')} →
                </div>
              </div>
            </Link>

            <Link href='/legal/terms' className='group'>
              <div className='border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:border-white/20 h-full'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center'>
                    <svg className='w-6 h-6 text-purple-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' />
                    </svg>
                  </div>
                  <h2 className='text-white font-semibold text-xl group-hover:text-purple-300 transition-colors'>
                    {t('legal.cards.terms.title')}
                  </h2>
                </div>
                <p className='text-[var(--light-dark-3)] text-sm leading-relaxed'>
                  {t('legal.cards.terms.description')}
                </p>
                <div className='mt-6 flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors'>
                  {t('legal.readMore')} →
                </div>
              </div>
            </Link>
          </div>
        </section>
      </Container>
    </>
  )
}
