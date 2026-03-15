'use client'
import Container from '@/components/commun/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { selectContractStats, useContractStore, IContract, IEmblem } from '@/store/contractStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ContractForm from '@/components/protocol/contract/ContractForm'
import ContractTable from '@/components/protocol/contract/ContractTable'

export interface IEditMode {
  isEditing: boolean
  contract: IContract | null
  emblem?: IEmblem | null
}

export default function AgentContractPage() {
  const t = useTranslations()
  const { contracts, isLoading, error, loadContracts, deleteContract } = useContractStore()
  const stats = useContractStore(selectContractStats)
  const [isMounted, setIsMounted] = useState(false)

  // Edit mode state
  const [editMode, setEditMode] = useState<IEditMode>({
    isEditing: false,
    contract: null,
    emblem: null
  })

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; contractId: string | null }>({
    open: false,
    contractId: null
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      await loadContracts()
      setIsMounted(true)
    }
    load()
  }, [loadContracts])

  // Handlers for table actions
  const handleEditContract = (contract: IContract) => {
    setEditMode({ isEditing: true, contract, emblem: null })
  }

  const handleEditEmblem = (contract: IContract, emblem: IEmblem) => {
    setEditMode({ isEditing: true, contract, emblem })
  }

  const handleCancelEdit = () => {
    setEditMode({ isEditing: false, contract: null, emblem: null })
  }

  const handleDeleteContract = (contractId: string) => {
    setDeleteDialog({ open: true, contractId })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.contractId) return

    setIsDeleting(true)
    try {
      await deleteContract(deleteDialog.contractId)
      await loadContracts(true)
    } finally {
      setIsDeleting(false)
      setDeleteDialog({ open: false, contractId: null })
    }
  }

  // Show skeleton while mounting or loading
  if (!isMounted || isLoading) {
    return (
      <Container className='rounded-md gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
        <div className='grid grid-cols-1 lg:grid-cols-4 grid-rows-[auto_1fr] gap-4 w-full h-full'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full gap-2 rounded bg-[var(--black-6)] p-6">
              <Skeleton className="h-6 w-32 mb-2 bg-[var(--black-900)]" />
              <Skeleton className="h-4 w-48 mb-4 bg-[var(--black-900)]" />
              <Skeleton className="h-8 w-16 bg-[var(--black-900)]" />
            </Card>
          ))}

          <div className='col-span-1 lg:col-span-2 h-full'>
            <Skeleton className='h-full w-full rounded bg-[var(--black-200)]' />
          </div>
          <div className='col-span-1 lg:col-span-2 h-full'>
            <Skeleton className='h-full w-full rounded bg-[var(--black-200)]' />
          </div>
        </div>
      </Container>
    )
  }

  return (
    <>
      <Container className='rounded-md gap-4' height='full' width='full' flexDirection='col' items='start' justify='start' >
        <section className='grid grid-cols-1 lg:grid-cols-4 grid-rows-[auto_1fr] gap-4 w-full h-full'>
          {/* Stat Cards */}
          <Card className="w-full rounded bg-[var(--black-6)]">
            <CardHeader className='text-start'>
              <CardTitle className='text-base md:text-xl uppercase'>{t('protocol.contract.stats.total')}</CardTitle>
              <CardDescription className='hidden xl:block md:text-sm'>
                {t('protocol.contract.stats.totalDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='text-start font-satoshi text-2xl font-bold'>
              {stats?.totalContracts ?? 0}
            </CardContent>
          </Card>
          <Card className="w-full rounded bg-[var(--black-6)]">
            <CardHeader className='text-start'>
              <CardTitle className='text-base md:text-xl uppercase'>{t('protocol.contract.stats.pending')}</CardTitle>
              <CardDescription className='hidden xl:block md:text-sm'>
                {t('protocol.contract.stats.pendingDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='text-start font-satoshi text-2xl font-bold'>
              {stats?.totalContractsPending ?? 0}
            </CardContent>
          </Card>
          <Card className="w-full rounded bg-[var(--black-6)]">
            <CardHeader className='text-start'>
              <CardTitle className='text-base md:text-xl uppercase'>{t('protocol.contract.stats.validated')}</CardTitle>
              <CardDescription className='hidden xl:block md:text-sm'>
                {t('protocol.contract.stats.validatedDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='text-start font-satoshi text-2xl font-bold'>
              {stats?.totalContractsValidated ?? 0}
            </CardContent>
          </Card>
          <Card className="w-full rounded bg-[var(--black-6)]">
            <CardHeader className='text-start'>
              <CardTitle className='text-base md:text-xl uppercase'>{t('protocol.contract.stats.revoked')}</CardTitle>
              <CardDescription className='hidden xl:block md:text-sm'>
                {t('protocol.contract.stats.revokedDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='text-start font-satoshi text-2xl font-bold'>
              {stats?.totalContractsRevoked ?? 0}
            </CardContent>
          </Card>

          {/* Contract Table (Left) */}
          <section className='col-span-1 lg:col-span-2 min-h-[400px]'>
            <ContractTable
              contracts={contracts}
              isLoading={isLoading}
              onEditContract={handleEditContract}
              onEditEmblem={handleEditEmblem}
              onDeleteContract={handleDeleteContract}
            />
          </section>

          {/* Contract Form (Right) */}
          <section className='col-span-1 lg:col-span-2 min-h-[400px]'>
            <ContractForm
              editMode={editMode}
              onCancelEdit={handleCancelEdit}
            />
          </section>
        </section>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-[var(--black-600)] border-[var(--black-400)]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-[var(--white-1)]">{t('protocol.contract.deleteDialog.title')}</DialogTitle>
            <DialogDescription className="text-[var(--black-200)]">
              {t('protocol.contract.deleteDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDeleteDialog({ open: false, contractId: null })}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-grotesk text-[var(--black-200)] hover:text-[var(--white-1)] transition-colors"
            >
              {t('commun.buttons.cancel')}
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-grotesk bg-[var(--danger)] text-white rounded hover:bg-[var(--danger)]/80 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? t('protocol.contract.deleteDialog.deleting') : t('protocol.contract.deleteDialog.confirm')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
