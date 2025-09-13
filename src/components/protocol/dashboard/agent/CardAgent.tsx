import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IAgent } from '@/types/agent'
import { formatAgentDate } from '@/lib/utils';
import axios from 'axios'
import ComponentSvg from '@/components/svg/ComponentSvg';

type CardAgentProps = {
    agent?: IAgent | null
    agentData: IAgent | null;
    isLoading: boolean;
    error: string | null;
}


export default function CardAgent({ agent, agentData, isLoading, error }: CardAgentProps) {
    const [barcode, setBarcode] = useState<string | null>(null);
    useEffect(() => {
        const fetchBarcode = async () => {
            if (!agent?.protocol?.customName) return;
            try {
                const clarityApiUrl = process.env.NEXT_PUBLIC_CLARITY_API_URL || 'http://localhost:3001';
                
                if (!process.env.NEXT_PUBLIC_CLARITY_API_URL) {
                    console.log('⚠️ NEXT_PUBLIC_CLARITY_API_URL non configurée, utilisation de localhost:3001');
                }
                
                const res = await axios.get(
                    `${clarityApiUrl}/generator/code/bar?text=${encodeURIComponent(agent.protocol.customName)}`,
                    { responseType: 'arraybuffer' }
                );
                const base64 = Buffer.from(res.data, 'binary').toString('base64');
                setBarcode(`data:image/png;base64,${base64}`);
            } catch (err) {
                console.log('❌ Erreur lors de la génération du code-barres:', err);
                setBarcode(null);
            }
        };
        fetchBarcode();
    }, [agent?.protocol?.customName]);
    if (isLoading) {
        return (
            <section className='CardAgent hidden min-[1750px]:flex w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded items-center justify-center'>
                <div className="animate-pulse text-center">
                    <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-300 rounded"></div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className='CardAgent hidden min-[1750px]:flex w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-red-500 flex flex-col rounded items-center justify-center'>
                <div className="text-red-500 text-center">
                    <p>Erreur de chargement</p>
                    <p className="text-sm">{error}</p>
                </div>
            </section>
        )
    }

    if (!agentData) {
        return (
            <section className='CardAgent hidden min-[1750px]:flex w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded items-center justify-center'>
                <div className="text-gray-500 text-center">
                    <p>Aucune donnée d&apos;agent disponible</p>
                </div>
            </section>
        )
    }
    return (
        <section className='CardAgent hidden min-[1750px]:flex w-full max-w-[560px] h-full bg-[var(--bg-card-agent)] border-2 border-[var(--border-1)] flex flex-col rounded'>
            <section className='CardAgent__header mt-4 flex flex-col gap-2'>
                <div className='h-2 w-full bg-[var(--ThemeColorAccent)]' />
                <ComponentSvg variant='card1' width={547} height={76} color='var(--ThemeColorAccent)' text={agent?.protocol?.customName} smallText={`${agent?.bungieUser?.membershipId} - AR0001`} />
            </section>
            <section className='CardAgent__body flex w-full p-4 items-center justify-between'>
                <section className='CardAgent__image p-1 h-fit border-2 border-[var(--ThemeColorAccent)] rounded'>
                    <Image src={agentData?.bungieUser?.profilePicturePath ? `https://www.bungie.net${agentData?.bungieUser?.profilePicturePath}` : '/default-agent.png'} alt='Agent Image' width={240} height={250} className='rounded' />
                </section>
                <div className='flex flex-col h-full justify-between py-5'>
                    <div className='bg-[var(--ThemeColorAccent)] w-[2.5px] h-[32px]' />
                    <div className='bg-[var(--ThemeColorAccent)] w-[2.5px] h-[32px]' />
                </div>
                <section className='CardAgent__information h-full py-2 flex flex-col gap-2 justify-between'>
                    <div className='group1 flex flex-col gap-1'>
                        <div className="label flex flex-col">
                            <span className="label text-xs">DisplayName:</span>{' '}
                            <span className="text-sm font-bold px-2">{agentData.protocol?.customName}</span>
                        </div>
                        <div className="label flex flex-col">
                            <span className="label text-xs">Species:</span>{' '}
                            <span className="text-sm font-bold px-2">{agentData?.protocol?.species}</span>
                        </div>
                        <div className="label flex flex-col">
                            <span className="label text-xs">Role:</span>{' '}
                            <span className="text-sm font-bold px-2">{agentData?.protocol?.role}</span>
                        </div>
                        <div className="label flex flex-col">
                            <span className="label text-xs">Affiliation:</span>{' '}
                            <span className="text-sm font-bold px-2">{agentData?.protocol?.group}</span>
                        </div>
                        <div className="label flex flex-col">
                            <span className="label text-xs">Rejoins:</span>{' '}
                            <span className="text-sm font-bold px-2">{formatAgentDate(agentData?.protocol?.protocolJoinedAt)}</span>
                        </div>
                    </div>
                    <div className='group1 flex flex-col gap-1'>

                    </div>
                </section>
                <section className='CardAgent__codebar '>
                    {<></> && barcode && (
                        <Image src={barcode} alt="Code barre" width={39} height={64} className='relative left-4' />
                    )}
                </section>
            </section>
        </section>
    )
}
