import React from 'react'
import { IChallengeApiResponse } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

interface CardChallengeActifProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    challengeData: any;
    isLoading: boolean;
    error: string | null;
}

export default function CardChallengeActif({ challengeData, isLoading, error }: CardChallengeActifProps) {

    const activeChallenges = challengeData?.challenges?.filter(
        (challenge: IChallengeApiResponse['challenges'][number]) => challenge.isComplete === false
    ) ?? [];

    if (error) {
        return (
            <section className='CardChallengeActif w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
                <div className="flex flex-col p-4 gap-2">
                    <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigme Actif</span>
                    <div className="text-red-500 text-sm">Erreur: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='CardChallengeActif w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <div className="flex flex-col p-4 gap-2">
                <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigme Actif</span>
                {isLoading ? (
                    <Skeleton className='h-10 w-24' />
                ) : (
                    <span className='font-bold text-xl md:text-2xl 3xl:text-2xl'>{activeChallenges.length}</span>
                )}
            </div>
        </section>
    )
}