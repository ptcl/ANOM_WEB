'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Trash2, X, Eye, EyeOff, FileDown, Users } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useContractStore, IContract, IEmblem } from '@/store/contractStore'
import { useAgentStore } from '@/store/agentStore'
import { IEditMode } from '@/app/[locale]/(protected)/desktop/(roles)/agent/contract/page'
import SignaturePad, { SignaturePadRef } from './SignaturePad'
import { downloadContractPdf } from '@/lib/generateContractPdf'
import ContributorSearch, { IContributorResult } from './ContributorSearch'
import ContributorChip from './ContributorChip'

interface IEmblemInput {
    name: string
    code: string
    image: File | null
    imagePreview: string | null
}

interface ContractFormProps {
    editMode: IEditMode
    onCancelEdit: () => void
}

// Protocol auto-signature - Simple SVG based signature (black for PDF visibility)
const PROTOCOL_AUTO_SIGNATURE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiPjx0ZXh0IHg9IjEwIiB5PSIzNSIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsIHNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXN0eWxlPSJpdGFsaWMiIGZpbGw9IiMwMDAwMDAiPsOJcXVpcGUgUHJvdG9jb2w8L3RleHQ+PC9zdmc+"

export default function ContractForm({ editMode, onCancelEdit }: ContractFormProps) {
    const t = useTranslations()
    const { createContract, updateContract, isLoading, loadContracts } = useContractStore()
    const agent = useAgentStore((state) => state.agent)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
    const cedantSignatureRef = useRef<SignaturePadRef>(null)

    const [emblems, setEmblems] = useState<IEmblemInput[]>([{ name: '', code: '', image: null, imagePreview: null }])
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [additionalContributors, setAdditionalContributors] = useState<IContributorResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Populate form when editing
    useEffect(() => {
        if (editMode.isEditing && editMode.contract) {
            if (editMode.emblem) {
                setEmblems([{
                    name: editMode.emblem.name,
                    code: editMode.emblem.code || '',
                    image: null,
                    imagePreview: null
                }])
            } else {
                const contractEmblems = editMode.contract.emblems.map(e => ({
                    name: e.name,
                    code: e.code || '',
                    image: null,
                    imagePreview: null
                }))
                setEmblems(contractEmblems.length > 0 ? contractEmblems : [{ name: '', code: '', image: null, imagePreview: null }])
            }
            setIsAnonymous(editMode.contract.contributor?.isAnonymous ?? false)
        }
    }, [editMode])

    const resetForm = () => {
        emblems.forEach(e => {
            if (e.imagePreview) URL.revokeObjectURL(e.imagePreview)
        })
        setEmblems([{ name: '', code: '', image: null, imagePreview: null }])
        setIsAnonymous(false)
        setAdditionalContributors([])
        setError(null)
        setSuccess(false)
        cedantSignatureRef.current?.clear()
    }

    const handleCancelEdit = () => {
        resetForm()
        onCancelEdit()
    }

    const addEmblem = () => {
        setEmblems([...emblems, { name: '', code: '', image: null, imagePreview: null }])
    }

    const removeEmblem = (index: number) => {
        if (emblems.length === 1) return
        if (emblems[index].imagePreview) {
            URL.revokeObjectURL(emblems[index].imagePreview!)
        }
        setEmblems(emblems.filter((_, i) => i !== index))
    }

    const updateEmblem = (index: number, field: 'name' | 'code', value: string) => {
        const updated = [...emblems]
        if (field === 'code') {
            // Remove non-alphanumeric chars, max 9 chars
            const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9)
            // Format as XXX-XXX-XXX
            let formatted = cleaned
            if (cleaned.length > 3) {
                formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3)
            }
            if (cleaned.length > 6) {
                formatted = formatted.slice(0, 7) + '-' + cleaned.slice(6)
            }
            updated[index][field] = formatted
        } else {
            updated[index][field] = value
        }
        setEmblems(updated)
    }

    const handleImageSelect = (index: number, file: File | null) => {
        const updated = [...emblems]
        if (updated[index].imagePreview) {
            URL.revokeObjectURL(updated[index].imagePreview!)
        }
        if (file) {
            updated[index].image = file
            updated[index].imagePreview = URL.createObjectURL(file)
        } else {
            updated[index].image = null
            updated[index].imagePreview = null
        }
        setEmblems(updated)
    }

    const triggerFileInput = (index: number) => {
        fileInputRefs.current[index]?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        const validEmblems = emblems.filter(e => e.name.trim() && e.code.trim())
        if (validEmblems.length === 0) {
            setError(t('protocol.contract.form.errorNoEmblems'))
            return
        }

        // Check signature
        if (cedantSignatureRef.current?.isEmpty()) {
            setError(t('protocol.contract.form.errorNoSignature'))
            return
        }

        if (!agent?.bungieUser) {
            setError(t('protocol.contract.form.errorNotConnected'))
            return
        }

        try {
            const contributorName = agent.bungieUser.cachedBungieGlobalDisplayName || agent.bungieUser.displayName || 'Agent'

            if (editMode.isEditing && editMode.contract) {
                await updateContract(editMode.contract.contractId, {})
                setSuccess(true)
                await loadContracts(true)
                handleCancelEdit()
            } else {
                // IMPORTANT: Capture signature BEFORE createContract to prevent ref loss on re-render
                const cedantSvg = cedantSignatureRef.current?.toSVG() || ''
                console.log('=== SIGNATURE DEBUG (BEFORE CREATE) ===')
                console.log('cedantSignatureRef.current:', cedantSignatureRef.current)
                console.log('cedantSvg length:', cedantSvg.length)
                console.log('cedantSvg content:', cedantSvg.substring(0, 200))

                // Create contract
                // Build all contributors array: current user first, then additional contributors
                const allContributors = [
                    {
                        bungieId: agent.bungieId || '',
                        displayName: contributorName,
                        isAnonymous: isAnonymous
                    },
                    ...additionalContributors.map(c => ({
                        bungieId: c.bungieId,
                        displayName: c.displayName,
                        isAnonymous: false
                    }))
                ]

                const result = await createContract({
                    emblems: validEmblems.map(e => ({ name: e.name, code: e.code })),
                    contributors: allContributors
                })

                // Generate and download PDF
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contractId = (result as any)?.contractId || `CTR-${Date.now()}`

                await downloadContractPdf({
                    contributor: {
                        displayName: contributorName,
                        bungieId: agent.bungieId || undefined,
                        isAnonymous: isAnonymous
                    },
                    contributors: additionalContributors.map(c => ({
                        displayName: c.displayName,
                        bungieId: c.bungieId,
                        isAnonymous: false
                    })),
                    emblems: validEmblems.map(e => ({ name: e.name, code: e.code })),
                    cedantSignature: cedantSvg,
                    cessionnaireSignature: PROTOCOL_AUTO_SIGNATURE,
                    contractDate: new Date(),
                    contractId: contractId
                })

                setSuccess(true)
                resetForm()
                await loadContracts(true)
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création du contrat')
        }
    }

    const formTitle = editMode.isEditing
        ? (editMode.emblem ? t('protocol.contract.form.titleEditEmblem') : t('protocol.contract.form.titleEditContract'))
        : t('protocol.contract.form.titleCreate')

    const submitButtonText = editMode.isEditing
        ? (isLoading ? t('protocol.contract.form.updating') : t('protocol.contract.form.update'))
        : (isLoading ? t('protocol.contract.form.submitting') : t('protocol.contract.form.submit'))

    return (
        <div className="h-full w-full bg-[var(--black-600)] border-2 border-[var(--black-500)] rounded-md p-4 flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-grotesk text-lg uppercase text-[var(--white-1)] tracking-wide">
                        {formTitle}
                    </h2>
                    {editMode.isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-[var(--black-200)] hover:text-[var(--white-1)] text-sm font-grotesk transition-colors flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            {t('commun.buttons.cancel')}
                        </button>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-xs font-ibm text-[var(--black-200)] gap-3 sm:gap-0">
                    <div className="text-left">
                        <span className="uppercase">{t('protocol.contract.form.cedant')}</span>
                        <div className="flex items-center gap-2 mt-1 justify-start">
                            <p className={`text-sm ${isAnonymous ? 'text-[var(--black-300)] line-through' : 'text-[var(--white-1)]'}`}>
                                {isAnonymous ? t('commun.anonymous') : (agent?.bungieUser?.cachedBungieGlobalDisplayName || 'JOUEUR#0000')}
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsAnonymous(!isAnonymous)}
                                className="p-1 rounded hover:bg-[var(--black-500)] transition-colors"
                                title={isAnonymous ? t('protocol.contract.form.visibility.show') : t('protocol.contract.form.visibility.hide')}
                            >
                                {isAnonymous ? (
                                    <EyeOff className="w-4 h-4 text-[var(--black-300)]" />
                                ) : (
                                    <Eye className="w-4 h-4 text-[var(--theme-accent-400)]" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <span className="uppercase">{t('protocol.contract.form.cessionnaire')}</span>
                        <p className="text-[var(--theme-accent-300)] text-sm mt-1">
                            {t('protocol.contract.form.protocolTeam')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contributors Section */}
            <div className="text-xs font-ibm text-[var(--black-200)] mb-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="uppercase">{t('protocol.contract.contributors.title')} ({1 + additionalContributors.length})</span>
                </div>

                {/* Contributors list */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {/* Current user */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/50 rounded text-[var(--theme-accent-400)]">
                        <span className="text-xs font-ibm">
                            {isAnonymous ? t('commun.anonymous') : (agent?.bungieUser?.cachedBungieGlobalDisplayName || 'You')}
                        </span>
                        <span className="text-[10px] text-[var(--white-1)] opacity-60">
                            {t('protocol.contract.contributors.you')}
                        </span>
                    </div>

                    {/* Additional contributors */}
                    {additionalContributors.map((contributor) => (
                        <div
                            key={contributor.bungieId}
                            className="flex items-center gap-1.5 px-2 py-1 bg-[var(--black-500)] border border-[var(--black-400)] rounded text-[var(--white-1)]"
                        >
                            <span className="text-xs font-ibm">{contributor.displayName}</span>
                            <button
                                type="button"
                                onClick={() => setAdditionalContributors(
                                    additionalContributors.filter(c => c.bungieId !== contributor.bungieId)
                                )}
                                className="text-[var(--black-300)] hover:text-[var(--danger)] transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Search input */}
                <ContributorSearch
                    onSelect={(contributor) => {
                        if (!additionalContributors.find(c => c.bungieId === contributor.bungieId)) {
                            setAdditionalContributors([...additionalContributors, contributor])
                        }
                    }}
                    excludeIds={[
                        agent?.bungieId || '',
                        ...additionalContributors.map(c => c.bungieId)
                    ]}
                />
            </div>

            {/* Emblem Table */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden border-2 border-[var(--black-500)] rounded-md">
                    <Table>
                        <TableHeader className='bg-[var(--black-500)]'>
                            <TableRow className="border-[var(--black-400)] hover:bg-transparent">
                                <TableHead className="hidden sm:table-cell w-[60px] text-[var(--black-200)] text-left">Nb/</TableHead>
                                <TableHead className="text-[var(--black-200)] text-left">{t('protocol.contract.form.emblem')}</TableHead>
                                <TableHead className="w-[120px] sm:w-[160px] text-[var(--black-200)] text-left">{t('protocol.contract.form.code')}</TableHead>
                                <TableHead className="w-[40px]" />
                            </TableRow>
                        </TableHeader>
                    </Table>
                    <div className="flex-1 overflow-y-auto max-h-[200px] sm:max-h-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <Table>
                            <TableBody>
                                {emblems.map((emblem, index) => (
                                    <TableRow key={index} className="border-[var(--black-400)] bg-[var(--black-600)]">
                                        <TableCell className="hidden sm:table-cell w-[60px] font-ibm text-sm text-[var(--white-1)]">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <input
                                                type="text"
                                                value={emblem.name}
                                                onChange={(e) => updateEmblem(index, 'name', e.target.value)}
                                                placeholder={t('protocol.contract.form.emblem')}
                                                className="w-full bg-transparent border-b border-[var(--black-400)] pb-1 text-sm text-[var(--white-1)] font-grotesk placeholder:text-[var(--black-400)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                                            />
                                        </TableCell>
                                        <TableCell className="w-[120px] sm:w-[160px]">
                                            <input
                                                type="text"
                                                value={emblem.code}
                                                onChange={(e) => updateEmblem(index, 'code', e.target.value)}
                                                placeholder="XXX-XXX-XXX"
                                                maxLength={11}
                                                className="w-full bg-transparent border-b border-[var(--black-400)] pb-1 text-sm text-[var(--white-1)] font-ibm placeholder:text-[var(--black-400)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                                            />
                                        </TableCell>
                                        <TableCell className="w-[40px]">
                                            {emblems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmblem(index)}
                                                    className="text-[var(--black-400)] hover:text-[var(--danger)] transition-colors p-1 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!editMode.emblem && (
                                    <TableRow className="border-[var(--black-400)] bg-[var(--black-500)] hover:bg-[var(--black-400)]">
                                        <TableCell colSpan={4} className="text-center">
                                            <button
                                                type="button"
                                                onClick={addEmblem}
                                                className="w-full py-2 text-[var(--black-200)] hover:text-[var(--white-1)] text-sm font-ibm transition-colors cursor-pointer"
                                            >
                                                {t('protocol.contract.form.addEmblem')}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Footer: Totals + Signatures side by side (on desktop) */}
                <div className="mt-4 pt-3 border-t border-dashed border-[var(--black-400)]">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Totals */}
                        <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 font-ibm text-sm min-w-[140px] justify-center lg:justify-start">
                            <div className="flex gap-2 lg:justify-between">
                                <span className="text-[var(--black-200)]">{t('protocol.contract.form.totals.emblems')}</span>
                                <span className="text-[var(--white-1)]">[{emblems.filter(e => e.name.trim()).length}]</span>
                            </div>
                            <div className="flex gap-2 lg:justify-between">
                                <span className="text-[var(--black-200)]">{t('protocol.contract.form.totals.codes')}</span>
                                <span className="text-[var(--white-1)]">[{emblems.filter(e => e.code.trim()).length}]</span>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SignaturePad
                                ref={cedantSignatureRef}
                                label={t('protocol.contract.signature.cedant')}
                            />
                            <SignaturePad
                                label={t('protocol.contract.signature.cessionnaire')}
                                autoSignature={PROTOCOL_AUTO_SIGNATURE}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <p className="mt-3 text-sm text-[var(--danger)] font-grotesk">{error}</p>
                )}
                {success && (
                    <p className="mt-3 text-sm text-[var(--success)] font-grotesk flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        {editMode.isEditing ? t('protocol.contract.form.successUpdate') : t('protocol.contract.form.successCreate')}
                    </p>
                )}

                {/* Submit - only show in edit mode */}
                {editMode.isEditing && (
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full button__style__anom py-2 px-4 text-[var(--white-1)] font-grotesk uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FileDown className="w-4 h-4" />
                        {submitButtonText}
                    </button>
                )}
            </form>
        </div>
    )
}
