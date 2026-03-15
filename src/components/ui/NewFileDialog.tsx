'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useFileSystem } from '@/store/useFileSystem'

interface NewFileDialogProps {
    open: boolean
    onClose: () => void
    parentId?: string
}

const EXTENSIONS = ['txt', 'json', 'md', 'png', 'jpg', 'lua', 'js']

export default function NewFileDialog({ open, onClose, parentId = 'root' }: NewFileDialogProps) {
    const { createFile } = useFileSystem()
    const [fileName, setFileName] = useState('')
    const [extension, setExtension] = useState('txt')

    const handleCreate = () => {
        if (!fileName.trim()) return

        console.log('Creating file:', { fileName, extension, parentId })
        
        try {
            createFile({
                id: crypto.randomUUID(),
                name: fileName,
                type: 'file',
                extension,
                parentId,
                icon: '/svg/file_txt.svg',
                content: '',
            })
            console.log('File created successfully')
        } catch (error) {
            console.error('Error creating file:', error)
        }

        onClose()
        setFileName('')
        setExtension('txt')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[var(--background)] text-white border border-white/10">
                <DialogHeader>
                    <DialogTitle>Créer un fichier</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input placeholder="Nom du fichier" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                    <Select value={extension} onValueChange={setExtension}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Extension" />
                        </SelectTrigger>
                        <SelectContent>
                            {EXTENSIONS.map((ext) => (
                                <SelectItem key={ext} value={ext}>
                                    .{ext}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <button
                    onClick={handleCreate}
                    className="mt-4 w-full bg-white/10 hover:bg-white/20 transition py-2 rounded"
                >
                    Créer
                </button>
            </DialogContent>
        </Dialog>
    )
}
