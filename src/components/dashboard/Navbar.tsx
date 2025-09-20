import React from 'react'
import Image from 'next/image'
import { useUserStore } from '@/store/userStore'
import { useDashboard } from '@/hooks/useDashboard'

export default function Navbar() {
  // ✅ Option 1: Récupérer depuis le store Zustand
  const { agent, isAuthenticated } = useUserStore()
  
  // ✅ Option 2: Récupérer depuis notre hook dashboard
  const { profile } = useDashboard()

  // Image Bungie depuis le store
  const bungieProfilePicture = agent?.bungieUser?.profilePicturePath
  const bungieImageUrl = bungieProfilePicture 
    ? `https://www.bungie.net/${bungieProfilePicture}.jpg`
    : null

  // Ou depuis le hook dashboard
  const profilePicture = profile?.bungieUser.profilePicture
  const profileImageUrl = profilePicture
    ? `https://www.bungie.net/${profilePicture}`
    : null

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2>Navbar</h2>
      
      {/* Affichage depuis le store */}
      {isAuthenticated && agent && (
        <div className='flex items-center gap-3'>
          <Image 
            src={bungieImageUrl || '/default-avatar.jpg'} 
            alt="Avatar Bungie"
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            <p className='text-sm font-medium'>{agent.bungieUser?.displayName}</p>
            <p className='text-xs text-gray-500'>{agent.protocol?.agentName}</p>
          </div>
        </div>
      )}

      {/* Ou affichage depuis le hook */}
      {profile && (
        <div className='flex items-center gap-3 border-t pt-3'>
          <Image 
            src={profileImageUrl || '/default-avatar.jpg'} 
            alt="Avatar Profile"
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            <p className='text-sm font-medium'>{profile.bungieUser?.displayName}</p>
            <p className='text-xs text-gray-500'>{profile.protocol?.agentName}</p>
          </div>
        </div>
      )}
    </section>
  )
}
