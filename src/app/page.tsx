"use client"
import { BungieLoginButton } from '@/components/auth/BungieLoginButton'
import InitialLoadingScreen from './loading'
import Image from 'next/image'

export default function HomePage() {

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