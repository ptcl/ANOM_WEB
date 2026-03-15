'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface IContributorResult {
    bungieId: string
    displayName: string
    avatar?: string
}

interface ContributorSearchProps {
    onSelect: (contributor: IContributorResult) => void
    excludeIds?: string[] // IDs to exclude from results (already added)
    placeholder?: string
}

// TODO: Replace with actual API call when backend route is ready
// GET /api/protocol/agents/search?q={query}
async function searchAgents(query: string): Promise<IContributorResult[]> {
    // Mock data for development
    const mockAgents: IContributorResult[] = [
        { bungieId: 'mock-1', displayName: 'Agent_Alpha', avatar: undefined },
        { bungieId: 'mock-2', displayName: 'Guardian_Beta', avatar: undefined },
        { bungieId: 'mock-3', displayName: 'Titan_Gamma', avatar: undefined },
        { bungieId: 'mock-4', displayName: 'Warlock_Delta', avatar: undefined },
        { bungieId: 'mock-5', displayName: 'Hunter_Epsilon', avatar: undefined },
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Filter by query
    if (!query.trim()) return []

    return mockAgents.filter(agent =>
        agent.displayName.toLowerCase().includes(query.toLowerCase())
    )
}

export default function ContributorSearch({ onSelect, excludeIds = [], placeholder }: ContributorSearchProps) {
    const t = useTranslations()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<IContributorResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true)
                try {
                    const data = await searchAgents(query)
                    // Filter out already selected contributors
                    const filtered = data.filter(agent => !excludeIds.includes(agent.bungieId))
                    setResults(filtered)
                    setIsOpen(true)
                } catch (error) {
                    console.error('Search error:', error)
                    setResults([])
                }
                setIsLoading(false)
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, excludeIds])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (contributor: IContributorResult) => {
        onSelect(contributor)
        setQuery('')
        setResults([])
        setIsOpen(false)
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--black-400)]" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || t('protocol.contract.contributors.searchPlaceholder')}
                    className="w-full pl-7 pr-3 py-1.5 bg-[var(--black-600)] border border-[var(--black-400)] rounded text-[var(--white-1)] text-xs font-ibm placeholder:text-[var(--black-400)] focus:outline-none focus:border-[var(--theme-accent)]"
                />
                {isLoading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border border-[var(--theme-accent)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--black-600)] border border-[var(--black-400)] rounded shadow-lg max-h-40 overflow-y-auto">
                    {results.map((agent) => (
                        <button
                            key={agent.bungieId}
                            type="button"
                            onClick={() => handleSelect(agent)}
                            className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-[var(--black-500)] transition-colors text-left"
                        >
                            <div className="w-5 h-5 rounded-full bg-[var(--black-400)] flex items-center justify-center flex-shrink-0">
                                <UserPlus className="w-3 h-3 text-[var(--black-200)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[var(--white-1)] font-ibm truncate">
                                    {agent.displayName}
                                </p>
                                <p className="text-[10px] text-[var(--black-300)] font-ibm truncate">
                                    {agent.bungieId}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--black-600)] border border-[var(--black-400)] rounded p-2">
                    <p className="text-xs text-[var(--black-300)] text-center font-ibm">
                        {t('protocol.contract.contributors.noResults')}
                    </p>
                </div>
            )}
        </div>
    )
}


