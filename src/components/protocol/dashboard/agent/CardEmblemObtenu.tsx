/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { IChallenge, IAgentProgress } from '@/types/challenge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface CardEmblemObtenuProps {
    challengeData: any;
    isLoading: boolean;
    error: string | null;
}

export default function CardEmblemObtenu({ challengeData, isLoading, error }: CardEmblemObtenuProps) {
    const challenges = challengeData?.challenges || [];
    const obtainedEmblems = challenges.filter(
        (challenge: IChallenge) =>
            Array.isArray(challenge.AgentProgress) &&
            challenge.AgentProgress.some((agent: IAgentProgress) => agent.complete === true)
    );

    if (error) {
        return (
            <section className='CardEmblemObtenu w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
                <div className="flex flex-col p-4 gap-2">
                    <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>
                        Emblèmes Obtenus
                    </span>
                    <div className="text-red-500 text-sm">
                        Erreur de chargement: {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='CardEmblemObtenu w-full h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <div className="flex flex-col p-4 gap-2">
                <span className='font-medium text-base md:text-xl 3xl:text-2xl text-[var(--small-text)] uppercase'>
                    Emblèmes Obtenus
                </span>
                {isLoading ? (
                    <Skeleton className='h-31 w-full' />
                ) : (
                    <div className='relative'>
                        <span className='font-bold text-xl md:text-2xl 3xl:text-2xl'>
                            {obtainedEmblems.length}
                        </span>
                        {obtainedEmblems.length > 0 && (
                            <div className='overflow-y-scroll max-h-[200px] mt-4'>
                                <Table>
                                    <TableBody>
                                        {obtainedEmblems.map((challenge: IChallenge) => (
                                            <TableRow key={challenge.challengeId}>
                                                <TableCell>{challenge.title}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {obtainedEmblems.length === 0 && challenges.length > 0 && (
                            <div className="text-gray-400 text-sm mt-2">
                                Aucun emblème obtenu pour le moment
                            </div>
                        )}

                        {challenges.length === 0 && (
                            <div className="text-gray-400 text-sm mt-2">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}