'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFileSystem } from '@/store/useFileSystem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import WindowContainer from '@/components/desktop/windows/WindowContainer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FileViewerProps {
    fileId: string
    fileName: string
    fileExtension: string
    fileContent?: string | object
    fileIcon: string
    isOpen?: boolean
    onClose?: () => void
}

// Composant pour fichier texte
const TextViewer = ({ content, onContentChange }: { content: string, onContentChange: (content: string) => void }) => (
    <div className="h-full p-4">
        <textarea
            className="w-full h-full bg-transparent text-white resize-none border-none outline-none font-mono text-sm"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Écrivez votre texte ici..."
            draggable={false}
        />
    </div>
)

// Composant pour fichier JSON
const JsonViewer = ({ content, onContentChange }: { content: string, onContentChange: (content: string) => void }) => {
    const [isValidJson, setIsValidJson] = useState(true)
    const [formattedContent, setFormattedContent] = useState('')

    useEffect(() => {
        try {
            const parsed = JSON.parse(content || '{}')
            const formatted = JSON.stringify(parsed, null, 2)
            setFormattedContent(formatted)
            setIsValidJson(true)
        } catch {
            setFormattedContent(content || '{}')
            setIsValidJson(false)
        }
    }, [content])

    return (
        <div className="h-full p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">JSON Editor</span>
                {!isValidJson && (
                    <span className="text-red-400 text-xs">⚠️ JSON invalide</span>
                )}
            </div>
            <textarea
                className="flex-1 w-full bg-black/20 text-white resize-none border border-white/10 rounded p-2 font-mono text-sm"
                value={formattedContent}
                onChange={(e) => {
                    setFormattedContent(e.target.value)
                    onContentChange(e.target.value)
                }}
                placeholder='{\n  "key": "value"\n}'
                draggable={false}
            />
        </div>
    )
}

// Composant pour fichier Markdown
const MarkdownViewer = ({ content, onContentChange }: { content: string, onContentChange: (content: string) => void }) => {
    const [isPreview, setIsPreview] = useState(false)
    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <div className="h-full flex flex-col">
            <div className={`flex items-center justify-between border-b border-white/10 ${isMobile ? 'p-3' : 'p-2'}`}>
                <span className={`text-gray-400 ${isMobile ? 'text-base' : 'text-sm'}`}>Markdown Editor</span>
                <div className={`flex ${isMobile ? 'gap-3' : 'gap-2'}`}>
                    <button
                        onClick={() => setIsPreview(false)}
                        className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} rounded ${!isPreview ? 'bg-white/20' : 'bg-white/5'} transition-colors`}
                    >
                        ✏️ Éditer
                    </button>
                    <button
                        onClick={() => setIsPreview(true)}
                        className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} rounded ${isPreview ? 'bg-white/20' : 'bg-white/5'} transition-colors`}
                    >
                        👁️ Aperçu
                    </button>
                </div>
            </div>
            {isPreview ? (
                <div className="flex-1 overflow-auto bg-black/10">
                    <div className={`prose prose-invert max-w-none text-left ${isMobile ? 'p-4 prose-base' : 'p-6 prose-sm'}`}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Personnalisation des composants pour le thème sombre
                                h1: ({children}) => <h1 className="text-white text-2xl font-bold mb-4 border-b border-white/20 pb-2">{children}</h1>,
                                h2: ({children}) => <h2 className="text-white text-xl font-semibold mb-3 mt-6">{children}</h2>,
                                h3: ({children}) => <h3 className="text-white text-lg font-medium mb-2 mt-4">{children}</h3>,
                                p: ({children}) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                                ul: ({children}) => <ul className="text-gray-300 mb-3 ml-4 space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="text-gray-300 mb-3 ml-4 space-y-1">{children}</ol>,
                                li: ({children}) => <li className="list-disc marker:text-blue-400">{children}</li>,
                                blockquote: ({children}) => (
                                    <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-900/20 text-gray-300 italic mb-3">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({children, className}) => {
                                    const isInline = !className?.includes('language-')
                                    if (isInline) {
                                        return <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm">{children}</code>
                                    }
                                    return (
                                        <code className="block bg-gray-900 text-green-400 p-3 rounded-md overflow-x-auto text-sm font-mono mb-3">
                                            {children}
                                        </code>
                                    )
                                },
                                pre: ({children}) => <pre className="mb-3">{children}</pre>,
                                a: ({children, href}) => (
                                    <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                                table: ({children}) => (
                                    <div className="overflow-x-auto mb-3">
                                        <table className="min-w-full border border-gray-600">{children}</table>
                                    </div>
                                ),
                                th: ({children}) => (
                                    <th className="border border-gray-600 bg-gray-800 text-white px-3 py-2 text-left font-semibold">
                                        {children}
                                    </th>
                                ),
                                td: ({children}) => (
                                    <td className="border border-gray-600 text-gray-300 px-3 py-2">{children}</td>
                                ),
                                input: ({type, checked}) => {
                                    if (type === 'checkbox') {
                                        return (
                                            <input 
                                                type="checkbox" 
                                                checked={checked} 
                                                readOnly 
                                                className="mr-2 accent-blue-400"
                                            />
                                        )
                                    }
                                    return null
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <textarea
                    className={`flex-1 w-full bg-transparent text-white resize-none border-none outline-none font-mono ${isMobile ? 'p-4 text-base' : 'p-4 text-sm'}`}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    draggable={false}
                    placeholder="# Mon Document Markdown

## Fonctionnalités supportées

- **Texte en gras** et *italique*
- [Liens](https://example.com)
- `Code inline` et blocs de code
- Listes à puces et numérotées
- > Citations
- Tableaux avec GitHub Flavored Markdown
- [x] Cases à cocher
- [ ] Tâches à faire

```javascript
// Blocs de code avec syntaxe
function hello() {
  console.log('Hello World!')
}
```"
                />
            )}
        </div>
    )
}



// Composant pour fichiers de code
const CodeViewer = ({ content, extension, onContentChange }: { content: string, extension: string, onContentChange: (content: string) => void }) => (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-2 border-b border-white/10">
            <span className="text-sm text-gray-400">Code Editor - .{extension}</span>
            <span className="text-xs text-gray-500">Syntax highlighting à venir</span>
        </div>
        <textarea
            className="flex-1 w-full bg-black/20 text-white resize-none border-none outline-none p-4 font-mono text-sm"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`// Votre code ${extension} ici...`}
            draggable={false}
        />
    </div>
)

// Composant par défaut
const DefaultViewer = ({ fileName, extension }: { fileName: string, extension: string }) => (
    <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                📄
            </div>
            <p className="text-gray-400">Fichier {extension.toUpperCase()}</p>
            <p className="text-sm text-gray-500">{fileName}</p>
            <p className="text-xs text-gray-600 mt-2">Type de fichier non pris en charge</p>
        </div>
    </div>
)

export default function FileViewer({ fileId, fileName, fileExtension, fileContent, fileIcon, isOpen = false, onClose }: FileViewerProps) {
    const { updateFile } = useFileSystem()
    const [content, setContent] = useState(typeof fileContent === 'string' ? fileContent : JSON.stringify(fileContent || '', null, 2))
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Sauvegarder les modifications
    const handleSave = useCallback(() => {
        updateFile(fileId, { content })
        setHasUnsavedChanges(false)
    }, [fileId, content, updateFile])

    // Détecter les changements
    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent)
        setHasUnsavedChanges(true)
    }, [])

    // Sauvegarder automatiquement toutes les 3 secondes
    useEffect(() => {
        if (!hasUnsavedChanges) return
        const timer = setTimeout(handleSave, 3000)
        return () => clearTimeout(timer)
    }, [content, hasUnsavedChanges, handleSave])

    // Raccourci Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                handleSave()
            }
        }
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, handleSave])

    // Rendu du contenu selon l'extension
    const renderContent = () => {
        switch (fileExtension.toLowerCase()) {
            case 'txt':
                return <TextViewer content={content} onContentChange={handleContentChange} />
            
            case 'json':
                return <JsonViewer content={content} onContentChange={handleContentChange} />
            
            case 'md':
                return <MarkdownViewer content={content} onContentChange={handleContentChange} />
            
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
                // Les images sont gérées par le composant ImageViewer dédié
                return <div className="h-full flex items-center justify-center p-4">
                    <div className="text-center text-gray-400">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                            🖼️
                        </div>
                        <p>Cette image devrait être ouverte avec ImageViewer</p>
                        <p className="text-sm text-gray-500">{fileName}</p>
                    </div>
                </div>
            
            case 'js':
            case 'ts':
            case 'jsx':
            case 'tsx':
            case 'lua':
            case 'py':
            case 'css':
            case 'html':
                return <CodeViewer content={content} extension={fileExtension} onContentChange={handleContentChange} />
            
            default:
                return <DefaultViewer fileName={fileName} extension={fileExtension} />
        }
    }

    return (
        <WindowContainer
            id={`file-${fileId}`}
            title={`${fileName}${hasUnsavedChanges ? ' •' : ''}`}
            icon={fileIcon}
            isOpen={isOpen}
            onClose={onClose}
            width={800}
            height={600}
        >
            {renderContent()}
        </WindowContainer>
    )
}