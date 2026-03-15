'use client'

import React, { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { useCoreSystem } from '@/store/useCoreSystem'

interface SearchBarProps {
    placeholder?: string
    className?: string
    disabled?: boolean
}

export default function SearchBar({
    placeholder = "Search Protocols...",
    className,
    disabled = false
}: SearchBarProps) {
    const [query, setQuery] = useState('')
    const items = useSearchIndex()
    const { closeCoreSystem } = useCoreSystem()

    const uniqueItems = useMemo(() => {
        const seen = new Set()
        return items.filter((item) => {
            if (seen.has(item.id)) return false
            seen.add(item.id)
            return true
        })
    }, [items])

    // 🔍 Fuzzy Search
    const fuse = useMemo(
        () =>
            new Fuse(uniqueItems, {
                keys: ['name', 'description', 'type'],
                threshold: 0.35,
            }),
        [uniqueItems]
    )

    const results = useMemo(() => {
        if (!query.trim()) return []
        return fuse.search(query).map((r) => r.item)
    }, [query, fuse])

    const handleClear = () => setQuery('')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelect = (item: any) => {
        item.onSelect?.()
        closeCoreSystem()
        setQuery('')
    }

    return (
        <div className={cn("relative flex flex-col gap-2 w-full", className)}>
            {/* Champ principal */}
            <InputGroup>
                <InputGroupAddon>
                    <Search className="w-4 h-4" />
                </InputGroupAddon>

                <InputGroupInput
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                />

                {query && (
                    <InputGroupAddon>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0 border-0 bg-transparent"
                            disabled={disabled}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </InputGroupAddon>
                )}
            </InputGroup>

            {/* Résultats */}
            {results.length > 0 && (
                <ul className="absolute top-full left-0 mt-2 w-full bg-white/5 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto backdrop-blur-sm z-50">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer transition"
                        >
                            {item.icon && <img src={item.icon} alt="" className="w-5 h-5 rounded-sm" />}
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">{item.name}</span>
                                <span className="text-xs text-gray-400">{item.type}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
