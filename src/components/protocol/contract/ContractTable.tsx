'use client'

import React, { Fragment, useState } from 'react'
import { ChevronRight, ChevronDown, MoreVertical, Pencil, Trash2, Info } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslations } from 'next-intl'
import StatusBadge from '@/components/commun/StatusBadge'
import { IContract, IEmblem } from '@/store/contractStore'

// Map contract/emblem status to StatusBadge status
const mapStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        // Contract statuses
        'pending': 'PENDING',
        'validated': 'COMPLETE',
        'partial': 'PENDING',
        'cancelled': 'LOCKED',
        'revoked': 'LOCKED',
        // Emblem statuses
        'available': 'PENDING',
        'redeemed': 'COMPLETE',
        'rejected': 'LOCKED',
    }
    return statusMap[status.toLowerCase()] || status.toUpperCase()
}

interface ContractRowProps {
    contract: IContract
    onEditContract: (contract: IContract) => void
    onEditEmblem: (contract: IContract, emblem: IEmblem) => void
    onDeleteContract: (contractId: string) => void
}

function ContractRow({ contract, onEditContract, onEditEmblem, onDeleteContract }: ContractRowProps) {
    const t = useTranslations()
    const [isOpen, setIsOpen] = useState(false)
    const hasEmblems = contract.emblems && contract.emblems.length > 0

    const formatDate = (date: Date | string) => {
        const d = new Date(date)
        return d.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace('.', '')
    }

    const getContributorDisplay = () => {
        if (!contract.contributors || contract.contributors.length === 0) return '—'
        const firstContributor = contract.contributors[0]
        if (firstContributor.isAnonymous) return t('commun.anonymous')
        return firstContributor.displayName || firstContributor.bungieId || '—'
    }

    const hasMultipleContributors = () => {
        return contract.contributors && contract.contributors.length > 1
    }

    const getEmblemStatus = (emblem: IEmblem) => {
        if (contract.status === 'pending') {
            return 'PENDING'
        }
        return mapStatus(emblem.status)
    }

    // Get contract display name for mobile
    const getDisplayName = () => {
        return contract.contractId
    }

    return (
        <Fragment>
            {/* Main contract row */}
            <TableRow className="border-[var(--black-400)] bg-[var(--black-600)]">
                {/* Icon (40px) */}
                <TableCell className="w-[70px] lg:w-[40px] px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                        {/* Mobile: Info popover */}
                        <div className="lg:hidden">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="p-1 rounded hover:bg-[var(--black-400)] cursor-pointer transition-colors">
                                        <Info className="h-4 w-4 text-[var(--black-300)]" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-48 bg-[var(--black-600)] border-[var(--black-400)] p-2">
                                    <div className="space-y-1 text-xs font-ibm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.table.details.id')}</span>
                                            <span className="text-[var(--white-1)]">{contract.contractId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.table.details.contributor')}</span>
                                            <span className="text-[var(--white-1)]">{getContributorDisplay()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.table.details.date')}</span>
                                            <span className="text-[var(--white-1)]">{formatDate(contract.contractDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.table.details.codes')}</span>
                                            <span className="text-[var(--white-1)]">{contract.availableCodes}/{contract.totalCodes}</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Expand button */}
                        {hasEmblems && (
                            <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded hover:bg-[var(--black-400)] cursor-pointer transition-colors">
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                        )}
                    </div>
                </TableCell>

                {/* Contract ID - hidden on mobile */}
                <TableCell className="hidden lg:table-cell w-[200px] max-w-[200px] overflow-hidden font-ibm text-sm text-[var(--black-50)] text-left">
                    <span className="block truncate font-ibm" title={contract.contractId}>
                        {contract.contractId}
                    </span>
                </TableCell>

                {/* Emblem Name (mobile) / Contributor (desktop - 110px) */}
                <TableCell className="lg:w-[110px] text-[var(--black-50)] text-left">
                    {/* Mobile: show emblem name */}
                    <span className="lg:hidden block truncate font-grotesk text-sm" title={getDisplayName()}>
                        {getDisplayName()}
                    </span>
                    {/* Desktop: show contributor(s) */}
                    <div className="hidden lg:flex items-center gap-1">
                        <span className="truncate font-grotesk" title={getContributorDisplay()}>
                            {getContributorDisplay()}
                        </span>
                        {hasMultipleContributors() && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex-shrink-0 px-1.5 py-0.5 text-xs bg-[var(--black-500)] hover:bg-[var(--black-400)] text-[var(--black-200)] rounded cursor-pointer transition-colors">
                                        +{contract.contributors.length - 1}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 bg-[var(--black-600)] border-[var(--black-400)] p-3">
                                    <div className="space-y-2">
                                        <p className="text-xs font-ibm text-[var(--black-300)] uppercase">{t('protocol.contract.contributors.title')}</p>
                                        {contract.contributors.map((contrib, idx) => (
                                            <div key={idx} className="text-sm font-grotesk text-[var(--white-1)]">
                                                {contrib.isAnonymous ? t('commun.anonymous') : (contrib.displayName || contrib.bungieId || '—')}
                                                {idx === 0 && <span className="ml-2 text-xs text-[var(--theme-accent)]">{t('protocol.contract.contributors.you')}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </TableCell>

                {/* Date - hidden on mobile (160px) */}
                <TableCell className="hidden lg:table-cell w-[160px] font-ibm text-sm text-[var(--black-200)] text-left">
                    {formatDate(contract.contractDate)}
                </TableCell>

                {/* Codes - hidden on mobile (90px) */}
                <TableCell className="hidden lg:table-cell w-[90px] font-ibm text-sm text-left">
                    <div className="flex gap-1">
                        <span>{contract.availableCodes}</span>
                        <span className="text-[var(--black-200)]">/</span>
                        <span>{contract.totalCodes}</span>
                    </div>
                </TableCell>

                {/* Status (100px) */}
                <TableCell className="w-[50px] lg:w-[100px] text-right lg:text-left">
                    {/* Mobile: icon only */}
                    <div className="lg:hidden flex justify-end">
                        <StatusBadge status={mapStatus(contract.status)} iconOnly />
                    </div>
                    {/* Desktop: full badge */}
                    <div className="hidden lg:block">
                        <StatusBadge status={mapStatus(contract.status)} />
                    </div>
                </TableCell>

                {/* Actions (40px) */}
                <TableCell className="hidden lg:table-cell w-[40px]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-[var(--black-400)] cursor-pointer transition-colors">
                                <MoreVertical className="h-4 w-4 text-[var(--black-200)]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[var(--black-600)] border-[var(--black-400)]">
                            <DropdownMenuItem onClick={() => onEditContract(contract)} className="cursor-pointer text-[var(--white-1)] focus:bg-[var(--black-500)] focus:text-[var(--white-1)]">
                                <Pencil className="h-4 w-4 mr-2" />
                                {t('protocol.contract.table.actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[var(--black-400)]" />
                            <DropdownMenuItem onClick={() => onDeleteContract(contract.contractId)} className="cursor-pointer text-[var(--danger)] focus:bg-[var(--danger)]/10 focus:text-[var(--danger)]">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('protocol.contract.table.actions.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {/* Expandable emblem rows */}
            {isOpen && hasEmblems && contract.emblems.map((emblem: IEmblem, index: number) => (
                <TableRow key={`${contract.contractId}-emblem-${index}`} className="border-[var(--black-400)] bg-[var(--black-600)]">
                    <TableCell className="w-[70px] lg:w-[40px]">
                        {/* Mobile info for emblem */}
                        <div className="lg:hidden">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="p-1 rounded hover:bg-[var(--black-500)] cursor-pointer transition-colors">
                                        <Info className="h-3 w-3 text-[var(--black-400)]" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-48 bg-[var(--black-600)] border-[var(--black-400)] p-2">
                                    <div className="space-y-1 text-xs font-ibm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.table.details.id')}</span>
                                            <span className="text-[var(--white-1)]">{emblem.emblemId || '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--black-300)]">{t('protocol.contract.form.emblem')}:</span>
                                            <span className="text-[var(--white-1)] font-grotesk">{emblem.name}</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell w-[200px] max-w-[200px] overflow-hidden font-ibm text-xs text-[var(--black-300)] text-left">
                        <span className="block truncate font-ibm pl-4" title={emblem.emblemId}>
                            └ {emblem.emblemId || '—'}
                        </span>
                    </TableCell>
                    <TableCell className="text-[var(--black-300)] text-sm text-left lg:w-[110px]" colSpan={1}>
                        <span className="block truncate font-grotesk pl-2 lg:pl-0" title={emblem.name}>
                            {emblem.name}
                        </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell w-[160px]" />
                    <TableCell className="hidden lg:table-cell w-[90px]" />
                    <TableCell className="w-[50px] lg:w-[100px] text-right lg:text-left">
                        {/* Mobile: icon only */}
                        <div className="lg:hidden flex justify-end">
                            <StatusBadge status={getEmblemStatus(emblem)} iconOnly />
                        </div>
                        {/* Desktop: full badge */}
                        <div className="hidden lg:block">
                            <StatusBadge status={getEmblemStatus(emblem)} />
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell w-[40px]">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-[var(--black-500)] cursor-pointer transition-colors">
                                    <MoreVertical className="h-4 w-4 text-[var(--black-300)]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--black-600)] border-[var(--black-400)]">
                                <DropdownMenuItem onClick={() => onEditEmblem(contract, emblem)} className="cursor-pointer text-[var(--white-1)] focus:bg-[var(--black-500)] focus:text-[var(--white-1)]">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    {t('protocol.contract.table.actions.edit')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </Fragment>
    )
}

interface IContractTableProps {
    contracts: IContract[]
    isLoading?: boolean
    onEditContract: (contract: IContract) => void
    onEditEmblem: (contract: IContract, emblem: IEmblem) => void
    onDeleteContract: (contractId: string) => void
}

export default function ContractTable({ contracts, isLoading, onEditContract, onEditEmblem, onDeleteContract }: IContractTableProps) {
    const t = useTranslations()

    if (isLoading && contracts.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 bg-[var(--black-600)] rounded-md h-full">
                <div className="animate-pulse text-[var(--black-200)]">{t('commun.loading')}</div>
            </div>
        )
    }

    if (contracts.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 bg-[var(--black-600)] border-2 border-[var(--black-500)] rounded-md h-full">
                <div className="text-[var(--black-200)] font-grotesk">{t('protocol.contract.list.empty')}</div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-[var(--black-600)] border-2 border-[var(--black-500)] rounded-md shadow-xl overflow-hidden">
            <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full caption-bottom text-sm table-fixed">
                    <TableHeader className='bg-[var(--black-500)] sticky top-0 z-10'>
                        <TableRow className="border-[var(--black-400)] hover:bg-transparent">
                            <TableHead className="w-[70px] lg:w-[40px] px-2 text-center" />
                            <TableHead className="hidden lg:table-cell w-[200px] text-[var(--black-200)] text-left">{t('protocol.contract.table.contractId')}</TableHead>
                            <TableHead className="lg:w-[110px] text-[var(--black-200)] text-left">
                                <span className="lg:hidden">{t('protocol.contract.table.contracts')}</span>
                                <span className="hidden lg:inline">{t('protocol.contract.table.contributor')}</span>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell w-[160px] text-[var(--black-200)] text-left">{t('protocol.contract.table.date')}</TableHead>
                            <TableHead className="hidden lg:table-cell w-[90px] text-[var(--black-200)] text-left">{t('protocol.contract.table.codes')}</TableHead>
                            <TableHead className="w-[50px] lg:w-[100px] text-[var(--black-200)] text-right lg:text-left">{t('protocol.contract.table.status')}</TableHead>
                            <TableHead className="hidden lg:table-cell w-[40px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.map((contract) => (
                            <ContractRow
                                key={contract.contractId}
                                contract={contract}
                                onEditContract={onEditContract}
                                onEditEmblem={onEditEmblem}
                                onDeleteContract={onDeleteContract}
                            />
                        ))}
                    </TableBody>
                </table>
            </div>
        </div>
    )
}
