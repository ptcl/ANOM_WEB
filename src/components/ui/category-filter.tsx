'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  getCategoryLabel: (category: string) => string
  className?: string
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange, getCategoryLabel, className }: CategoryFilterProps) {
  if (categories.length < 2) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200",
            "border border-white/20 backdrop-blur-sm cursor-pointer",
            selectedCategory === category
              ? "bg-white/20 text-white border-white/40"
              : "bg-black/20 text-[var(--light-dark-3)] hover:bg-white/10 hover:text-white"
          )}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  )
}