import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';

interface CardChallengeCompleteProps {
    agentProgress: unknown;
    isLoading: boolean;
    error: string | null;
}

export default function CardChallengeComplete({ agentProgress, isLoading, error }: CardChallengeCompleteProps) {

    let completedCount = 0;
    if (agentProgress && Array.isArray(agentProgress)) {
        for (let i = 0; i < agentProgress.length; i++) {
            const challenge = agentProgress[i];
            if (challenge.progress && challenge.progress.complete === true) {
                completedCount++;
            }
        }
    }

    if (error) {
        return (
            <section className='CardChallengeComplete w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
                <div className="flex flex-col p-4 gap-2">
                    <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigmes complétés</span>
                    <div className="text-red-500 text-sm">Erreur: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='CardChallengeComplete w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <div className="flex flex-col p-4 gap-2">
                <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Enigmes complétés</span>
                {isLoading ? (
                    <Skeleton className='h-10 w-24' />
                ) : (
                    <span className='font-bold text-xl md:text-2xl 3xl:text-2xl'>{completedCount}</span>
                )}
            </div>
        </section>
    )
}
