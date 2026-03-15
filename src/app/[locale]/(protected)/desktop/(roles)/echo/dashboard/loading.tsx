import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
    return (
        <>
            <Skeleton className='h-full max-h-40 w-full' />
            <Skeleton className='h-full w-full' />

        </>
    )
}
