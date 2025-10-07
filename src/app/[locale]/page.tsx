"use client"
import { BungieLoginButton } from '@/components/auth/BungieLoginButton'
import InitialLoadingScreen from './loading'
import Image from 'next/image'
import MaintenanceMode from '@/components/commun/MaintenanceMode';

import ScrollEffectProvider from '@/components/provider/ScrollEffectProvider';
import Footer from '@/components/commun/Footer';

export default function HomePage() {
  const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (MAINTENANCE_MODE) {

    return (

      <section className="relative">
        <Footer />
        <ScrollEffectProvider >
          <section id="page_wrapper" suppressHydrationWarning>
            <MaintenanceMode />
          </section>
        </ScrollEffectProvider>
      </section>

    )

      ;
  }
  return (
    <>
      <div className='os__container' />
      <InitialLoadingScreen />
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <Image src="/img/protocol_text_glitch.png" width={300} height={300} alt="Logo protocol anom" />
        <BungieLoginButton />
      </div>
    </>
  )
}
