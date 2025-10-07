// Utilitaires pour la communication entre composants via événements
import { useEffect } from 'react'

export interface SearchBarData {
    isVisible: boolean
    searchQuery: string
    onSearchChange: (value: string) => void
    placeholder: string
}

export const showNavbarSearch = (data: SearchBarData) => {
    window.dispatchEvent(new CustomEvent('showNavbarSearch', {
        detail: data
    }))
}

export const hideNavbarSearch = () => {
    window.dispatchEvent(new CustomEvent('hideNavbarSearch'))
}

export const useNavbarSearchEvents = (callback: (data: SearchBarData | null) => void) => {
    useEffect(() => {
        const handleShow = (event: CustomEvent<SearchBarData>) => {
            callback(event.detail)
        }

        const handleHide = () => {
            callback(null)
        }

        window.addEventListener('showNavbarSearch', handleShow as EventListener)
        window.addEventListener('hideNavbarSearch', handleHide)

        return () => {
            window.removeEventListener('showNavbarSearch', handleShow as EventListener)
            window.removeEventListener('hideNavbarSearch', handleHide)
        }
    }, [callback])
}