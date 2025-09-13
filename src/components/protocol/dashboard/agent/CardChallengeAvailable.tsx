import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';

interface CardChallengeAvailableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    challengeData: any;
    isLoading: boolean;
    error: string | null;
}

export default function CardChallengeAvailable({ challengeData, isLoading, error }: CardChallengeAvailableProps) {
    if (error) {
        return (
            <section className='CardChallengeAvailable w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
                <div className="flex flex-col p-4 gap-2">
                    <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigme Disponible</span>
                    <div className="text-red-500 text-sm">Erreur: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='CardChallengeAvailable w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <div className="flex flex-col p-4 gap-2">
                <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigme Disponible</span>
                {isLoading ? (
                    <Skeleton className='h-10 w-24' />
                ) : (
                    <span className='font-bold text-xl md:text-2xl 3xl:text-2xl'>{challengeData?.count ?? 0}</span>
                )}
            </div>
        </section>
    )
}