import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { IContract } from '@/types/contract';

interface CardContractProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contractData: IContract | any;
    isLoading: boolean;
    error: string | null;
}
export default function CardContractTotal({ contractData, isLoading, error }: CardContractProps) {

    if (error) {
        return (
            <section className='CardChallengeComplete w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
                <Skeleton className='h-full w-full' />
            </section>
        );
    }
    return (
        <section className='CardChallengeAvailable w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <div className="flex flex-col p-4 gap-2">
                <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>Contrats total</span>
                {isLoading ? (
                    <Skeleton className='h-full w-full' />
                ) : (
                        <span className='font-bold text-xl md:text-2xl 3xl:text-2xl'>{Array.isArray(contractData) ? contractData.length : 0}</span>
                )}
            </div>
        </section>
    )
}
