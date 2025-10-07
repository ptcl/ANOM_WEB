import { Skeleton } from "./skeleton"

export function NewsCardSkeleton() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-6 space-y-4 shadow-sm">
      {/* Category badge */}
      <Skeleton className="h-5 w-20" />
      
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Meta info (date and reading time) */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function NewsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function NewsArticleSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header section */}
      <div className="space-y-6 mb-8">
        {/* Category badge */}
        <Skeleton className="h-5 w-20" />
        
        {/* Title */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
        </div>
        
        {/* Meta info */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-32" />
          <div className="w-1 h-1 bg-muted rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      {/* Content section */}
      <div className="space-y-6">
        {/* First paragraph */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Second paragraph */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Image placeholder */}
        <Skeleton className="h-64 w-full rounded-lg" />
        
        {/* Third paragraph */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>
        
        {/* Fourth paragraph */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}

export function CategoryFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-16 rounded-full" />
      ))}
    </div>
  )
}