import Container from '@/components/commun/container'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <Container className='rounded-md gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-[auto_1fr] gap-4 w-full h-full'>
                {/* Stats Cards Skeletons */}
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="w-full gap-2 rounded bg-[var(--black-6)] p-6">
                        <Skeleton className="h-6 w-32 mb-2 bg-[var(--grey-accent1)]" />
                        <Skeleton className="h-4 w-48 mb-4 bg-[var(--grey-accent1)]" />
                        <Skeleton className="h-8 w-16 bg-[var(--grey-accent1)]" />
                    </Card>
                ))}

                {/* Bottom Section Skeletons */}
                <div className='col-span-2 lg:col-span-2 h-full'>
                    <Skeleton className='h-full w-full rounded bg-[var(--black-6)]' />
                </div>
                <div className='col-span-2 lg:col-span-2 h-full'>
                    <Skeleton className='h-full w-full rounded bg-[var(--black-6)]' />
                </div>
            </div>
        </Container>
    )
}
