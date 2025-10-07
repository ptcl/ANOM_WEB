'use client'

import { useState, useEffect, useRef } from 'react'

interface UseStickyOnNavbarOptions {
  navbarHeight?: number // Hauteur de la navbar (défaut: 64px)
  offset?: number // Offset supplémentaire (défaut: 0)
}

export function useStickyOnNavbar({ navbarHeight = 64, offset = 0 }: UseStickyOnNavbarOptions = {}) {
  const [isSticky, setIsSticky] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const elementTop = rect.top
        const shouldStick = elementTop <= navbarHeight + offset

        setIsSticky(shouldStick)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Vérifier l'état initial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [navbarHeight, offset])

  return { isSticky, elementRef }
}