import jsPDF from 'jspdf'

interface IEmblemData {
    name: string
    code: string
}

interface IContributorData {
    displayName: string
    email?: string
    bungieId?: string
    isAnonymous: boolean
}

interface IContractPdfData {
    contributor: IContributorData // Primary contributor (for backward compatibility)
    contributors?: IContributorData[] // Additional contributors
    emblems: IEmblemData[]
    cedantSignature: string
    cessionnaireSignature: string
    contractDate: Date
    contractId?: string
}

export const PROTOCOL_SIGNATURE_TEXT = "Equipe Protocol - AN0M ARCHIVES"

// Convert SVG string to PNG data URL for jsPDF
// Returns PNG at natural SVG dimensions to preserve aspect ratio
export async function svgToPng(svgString: string): Promise<string> {
    console.log('svgToPng called with svgLength:', svgString?.length)

    if (!svgString || !svgString.includes('<svg')) {
        console.log('Invalid SVG string')
        return ''
    }

    // Extract width and height from SVG
    const widthMatch = svgString.match(/width="(\d+)"/)
    const heightMatch = svgString.match(/height="(\d+)"/)
    const width = widthMatch ? parseInt(widthMatch[1]) : 200
    const height = heightMatch ? parseInt(heightMatch[1]) : 80
    console.log('Extracted SVG dimensions:', width, height)

    return new Promise((resolve) => {
        // Use base64 data URL instead of blob URL to avoid CSP issues
        const svgBase64 = btoa(unescape(encodeURIComponent(svgString)))
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`

        const img = new Image()
        img.onload = () => {
            console.log('Image loaded, natural dimensions:', img.naturalWidth, img.naturalHeight)
            const canvas = document.createElement('canvas')
            // Use natural dimensions or extracted dimensions
            const canvasWidth = img.naturalWidth || width
            const canvasHeight = img.naturalHeight || height
            canvas.width = canvasWidth
            canvas.height = canvasHeight
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                console.log('Failed to get canvas context')
                resolve('')
                return
            }

            // White background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)

            // Draw SVG at natural size
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

            const pngDataUrl = canvas.toDataURL('image/png')
            console.log('Generated PNG at', canvasWidth, 'x', canvasHeight)
            resolve(pngDataUrl)
        }
        img.onerror = (e) => {
            console.error('Error converting SVG to PNG:', e)
            resolve('')
        }
        img.src = dataUrl
    })
}

export function generateContractPdf(data: IContractPdfData): jsPDF {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const margin = 15
    const contentWidth = pageWidth - margin * 2
    let y = margin

    const addTitle = (text: string, size: number = 16) => {
        doc.setFontSize(size)
        doc.setFont('helvetica', 'bold')
        doc.text(text, pageWidth / 2, y, { align: 'center' })
        y += size * 0.5
    }

    const addSubtitle = (text: string, size: number = 12) => {
        doc.setFontSize(size)
        doc.setFont('helvetica', 'bold')
        doc.text(text, margin, y)
        y += size * 0.5
    }

    const addParagraph = (text: string, size: number = 10) => {
        doc.setFontSize(size)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(text, contentWidth)
        doc.text(lines, margin, y)
        y += lines.length * size * 0.4 + 2
    }

    const addLine = () => {
        doc.setDrawColor(100, 100, 100)
        doc.line(margin, y, pageWidth - margin, y)
        y += 5
    }

    const checkNewPage = (neededSpace: number = 30) => {
        if (y > 280 - neededSpace) {
            doc.addPage()
            y = margin
        }
    }

    const addCheckbox = (text: string, checked: boolean = false) => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const box = checked ? '[X]' : '[ ]'
        doc.text(`${box} ${text}`, margin + 5, y)
        y += 6
    }

    const addBullet = (text: string) => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`- ${text}`, margin + 5, y)
        y += 5
    }

    // ==================== PAGE 1: HEADER & FORM ====================

    addTitle('ACCORD DE CESSION DE CODES D\'EMBLEMES DESTINY 2', 14)
    y += 3
    addParagraph('Projet : AN0M-ARCHIVES (Protocol)', 11)
    addParagraph('Date du contrat : ' + data.contractDate.toLocaleDateString('fr-FR'), 10)
    if (data.contractId) {
        addParagraph('N. Contrat : ' + data.contractId, 10)
    }

    addLine()
    y += 3

    addSubtitle('FORMULAIRE DE CESSION', 12)
    y += 5

    addSubtitle('Informations du contributeur', 11)
    y += 3

    // Build all contributors list
    const allContributors = [data.contributor, ...(data.contributors || [])]

    if (allContributors.length === 1) {
        addParagraph('Nom/Pseudonyme : ' + (data.contributor.isAnonymous ? 'ANONYME' : data.contributor.displayName))
        addParagraph('Pseudonyme Bungie : ' + (data.contributor.bungieId || 'Non renseigne'))
    } else {
        addParagraph('Nombre de contributeurs : ' + allContributors.length)
        y += 2
        allContributors.forEach((c, idx) => {
            const name = c.isAnonymous ? 'ANONYME' : c.displayName
            addBullet(`Contributeur ${idx + 1}: ${name} (${c.bungieId || 'N/A'})`)
        })
    }
    addParagraph('Date : ' + data.contractDate.toLocaleDateString('fr-FR'))

    y += 5
    addLine()
    y += 5

    addSubtitle('Liste des codes a ceder', 11)
    y += 5

    // Table header
    doc.setFillColor(40, 40, 40)
    doc.rect(margin, y, contentWidth, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('N.', margin + 3, y + 5)
    doc.text('Nom de l\'embleme', margin + 15, y + 5)
    doc.text('Code complet', margin + 90, y + 5)
    doc.text('Valide', margin + 150, y + 5)
    y += 10
    doc.setTextColor(0, 0, 0)

    // Table rows
    data.emblems.forEach((emblem, index) => {
        checkNewPage(10)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)

        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245)
            doc.rect(margin, y - 4, contentWidth, 7, 'F')
        }

        doc.text(String(index + 1), margin + 3, y)
        doc.text(emblem.name.substring(0, 40), margin + 15, y)
        doc.text(emblem.code, margin + 90, y)
        doc.text('[ ]', margin + 153, y)
        y += 7
    })

    y += 5
    addParagraph('Nombre total de codes : ' + data.emblems.length)

    // ==================== PAGE 2: ATTESTATIONS ====================
    doc.addPage()
    y = margin

    addSubtitle('ATTESTATIONS ET ACCEPTATION', 12)
    y += 5

    addParagraph('Je, soussigne(e), atteste sur l\'honneur que :', 10)
    y += 3
    addCheckbox('Je suis le detenteur legitime de tous les codes listes ci-dessus', true)
    addCheckbox('Tous les codes sont valides et non utilises sur aucun compte Destiny 2', true)
    addCheckbox('Les informations fournies (noms d\'emblemes, codes) sont exactes', true)
    addCheckbox('J\'ai obtenu ces codes de maniere licite', true)
    addCheckbox('Je cede ces codes gratuitement et definitivement a l\'equipe Protocol', true)

    y += 5
    addParagraph('J\'accepte :', 10)
    y += 3
    addCheckbox('Les termes de l\'Accord de Cession ci-dessous', true)
    addCheckbox('Les CGU d\'AN0M-ARCHIVES', true)
    addCheckbox('La Politique de Confidentialite d\'AN0M-ARCHIVES', true)
    addCheckbox('D\'etre credite publiquement comme contributeur', !data.contributor.isAnonymous)
    addCheckbox('Je souhaite rester anonyme', data.contributor.isAnonymous)

    y += 10
    addLine()
    y += 5

    addSubtitle('CE QUE VOUS OBTENEZ EN RETOUR', 11)
    y += 5
    addParagraph('En contribuant, vous recevez automatiquement :')
    addBullet('Badge "Contributeur de Codes" sur votre profil agent')
    addBullet('Compteur de codes contribues visible')
    addBullet('Credit public dans la section Contributeurs (sauf anonymat)')
    addBullet('Acces potentiel a des avantages futurs exclusifs')
    addBullet('Reconnaissance eternelle de la communaute')

    // ==================== PAGE 3: PARTIES & ARTICLES ====================
    doc.addPage()
    y = margin

    addSubtitle('TERMES ET CONDITIONS', 12)
    y += 5
    addLine()
    y += 3

    addSubtitle('PARTIES', 11)
    y += 3
    addParagraph('CEDANT : ' + (data.contributor.isAnonymous ? 'Contributeur Anonyme' : data.contributor.displayName))
    addParagraph('CESSIONNAIRE : Equipe Protocol (AN0M-ARCHIVES)')
    addParagraph('REPRESENTANT LEGAL : Lucas Raffalli')

    y += 5
    addSubtitle('ARTICLE 1 - OBJET DE LA CESSION', 11)
    y += 3
    addParagraph('1.1 Le Cedant cede irrevocablement, gratuitement et definitivement les codes d\'emblemes Destiny 2 listes a l\'equipe Protocol.')
    addParagraph('1.2 Droits cedes : Usage dans AN0M-ARCHIVES, integration dans l\'application, distribution gratuite aux participants.')
    addParagraph('1.3 Droits NON cedes : Commercialisation, usage personnel par l\'equipe, droits de PI sur Destiny 2 (Bungie, Inc.).')

    checkNewPage(40)
    y += 3
    addSubtitle('ARTICLE 2 - ENGAGEMENTS DE L\'EQUIPE PROTOCOL', 11)
    y += 3
    addParagraph('L\'equipe Protocol s\'engage a : Utiliser les codes exclusivement pour AN0M-ARCHIVES, ne jamais les commercialiser, les distribuer 100% gratuitement, maintenir une tracabilite complete, et stocker les codes de maniere securisee.')

    checkNewPage(40)
    y += 3
    addSubtitle('ARTICLE 3 - RECONNAISSANCE DU CONTRIBUTEUR', 11)
    y += 3
    addParagraph('Le Cedant obtient le statut de "Contributeur de Codes" avec badge visible, compteur de codes, et mention dans la section Contributeurs (sauf anonymat demande).')

    checkNewPage(40)
    y += 3
    addSubtitle('ARTICLE 4 - RESPONSABILITES', 11)
    y += 3
    addParagraph('Le Cedant est responsable de l\'exactitude des informations et de la legitimite des codes. L\'equipe Protocol ne peut etre tenue responsable des codes invalides ou des problemes techniques avec l\'API Bungie.')

    checkNewPage(40)
    y += 3
    addSubtitle('ARTICLE 5 - REVOCATION ET RETRAIT', 11)
    y += 3
    addParagraph('Le Cedant peut demander le retrait de ses codes a tout moment. Les codes deja distribues ne peuvent pas etre revoques (limitation technique Bungie).')

    // ==================== PAGE 4: ARTICLES SUITE ====================
    doc.addPage()
    y = margin

    addSubtitle('ARTICLE 6 - DUREE ET PORTEE', 11)
    y += 3
    addParagraph('Cet accord est conclu pour une duree indeterminee. Portee geographique mondiale.')

    y += 3
    addSubtitle('ARTICLE 7 - PROPRIETE INTELLECTUELLE', 11)
    y += 3
    addParagraph('Destiny 2 et ses emblemes sont la propriete exclusive de Bungie, Inc. Cet accord concerne uniquement l\'usage communautaire de codes legitimement obtenus.')

    y += 3
    addSubtitle('ARTICLE 8 - DONNEES PERSONNELLES (RGPD)', 11)
    y += 3
    addParagraph('Donnees collectees : nom/pseudonyme, email, pseudonyme Bungie, codes. Conformement au RGPD, vos donnees ne sont jamais vendues ou partagees avec des tiers.')

    y += 3
    addSubtitle('ARTICLE 9 - CONFIDENTIALITE DES CODES', 11)
    y += 3
    addParagraph('Les codes sont conserves de maniere strictement confidentielle avec stockage crypte et acces limite aux administrateurs autorises.')

    y += 3
    addSubtitle('ARTICLE 10 - RESILIATION', 11)
    y += 3
    addParagraph('Le Cedant peut resilier via revocation. En cas de fermeture du projet, preavis de 30 jours minimum.')

    y += 3
    addSubtitle('ARTICLE 11 - MODIFICATIONS', 11)
    y += 3
    addParagraph('Toute modification importante necessite notification par email 30 jours avant application.')

    y += 3
    addSubtitle('ARTICLE 12 - CLAUSES LEGALES', 11)
    y += 3
    addParagraph('Cet accord est regi par le droit francais. En cas de litige : resolution amiable, puis mediation, puis tribunaux francais.')

    // ==================== PAGE 5: ATTESTATION & SIGNATURES ====================
    doc.addPage()
    y = margin

    addSubtitle('ATTESTATION FINALE DE TRANSPARENCE', 12)
    y += 5

    addParagraph('L\'equipe Protocol atteste solennellement et publiquement que :')
    y += 3
    addCheckbox('Aucun code n\'est ni ne sera jamais vendu ou commercialise', true)
    addCheckbox('Tous les codes sont distribues 100% gratuitement', true)
    addCheckbox('Aucun membre de l\'equipe n\'utilise les codes personnellement', true)
    addCheckbox('Tous les contributeurs sont credites (sauf anonymat)', true)
    addCheckbox('Le projet reste a but non lucratif et communautaire', true)

    y += 10
    addLine()
    y += 5

    addSubtitle('CONFIRMATION FINALE', 12)
    y += 5
    addCheckbox('J\'ai lu et compris l\'integralite de cet accord', true)
    addCheckbox('J\'ai fourni des informations exactes et veridiques', true)
    addCheckbox('J\'atteste de la legitimite et validite de mes codes', true)
    addCheckbox('J\'accepte tous les termes et conditions', true)

    y += 10
    addParagraph('Date de signature electronique : ' + data.contractDate.toLocaleDateString('fr-FR') + ' a ' + data.contractDate.toLocaleTimeString('fr-FR'))

    // ==================== SIGNATURES ====================
    y += 10
    addLine()
    y += 10

    addSubtitle('SIGNATURES', 12)
    y += 10

    const sigBoxWidth = (contentWidth - 10) / 2
    const sigBoxHeight = 30

    // Cedant signature
    doc.setDrawColor(100, 100, 100)
    doc.rect(margin, y, sigBoxWidth, sigBoxHeight)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('CEDANT', margin + 2, y + 5)
    doc.text(data.contributor.isAnonymous ? 'Anonyme' : data.contributor.displayName, margin + 2, y + 10)

    // Cédant signature (drawn by user, converted to PNG)
    if (data.cedantSignature && data.cedantSignature.startsWith('data:image/png')) {
        try {
            // Calculate dimensions preserving aspect ratio
            const maxWidth = sigBoxWidth - 10
            const maxHeight = sigBoxHeight - 15

            // Create temp image to get natural dimensions
            const tempImg = new Image()
            tempImg.src = data.cedantSignature

            // Use a reasonable aspect ratio based on typical signature canvas (roughly 4:1)
            // The signature box is wider than tall, so we fit to height
            const imgWidth = maxWidth
            const imgHeight = maxHeight

            doc.addImage(data.cedantSignature, 'PNG', margin + 5, y + 12, imgWidth, imgHeight)
        } catch (e) {
            console.error('Error adding cedant signature:', e)
        }
    }

    // Cessionnaire signature box
    doc.rect(margin + sigBoxWidth + 10, y, sigBoxWidth, sigBoxHeight)
    doc.text('CESSIONNAIRE', margin + sigBoxWidth + 12, y + 5)
    doc.text('Equipe Protocol (AN0M-ARCHIVES)', margin + sigBoxWidth + 12, y + 10)

    // Draw Cessionnaire signature as italic text directly (more reliable than image)
    doc.setFontSize(16)
    doc.setFont('times', 'italic')
    doc.setTextColor(0, 0, 0)
    doc.text('Equipe Protocol', margin + sigBoxWidth + 20, y + 22)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    y += sigBoxHeight + 15

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Document genere automatiquement par AN0M-ARCHIVES - Version 2.0', pageWidth / 2, 285, { align: 'center' })
    doc.text('Ce document fait foi de l\'accord de cession entre les parties.', pageWidth / 2, 290, { align: 'center' })

    return doc
}

export async function downloadContractPdf(data: IContractPdfData, filename?: string) {
    // Convert Cédant SVG signature to PNG for jsPDF
    let cedantSignaturePng = ''
    if (data.cedantSignature && data.cedantSignature.includes('<svg')) {
        cedantSignaturePng = await svgToPng(data.cedantSignature)
    }

    const pdfData = {
        ...data,
        cedantSignature: cedantSignaturePng
    }

    const doc = generateContractPdf(pdfData)
    const finalFilename = filename || 'contrat-cession-' + (data.contractId || Date.now()) + '.pdf'
    doc.save(finalFilename)
}

export async function getContractPdfBlob(data: IContractPdfData): Promise<Blob> {
    // Convert Cédant SVG signature to PNG for jsPDF
    let cedantSignaturePng = ''
    if (data.cedantSignature && data.cedantSignature.includes('<svg')) {
        cedantSignaturePng = await svgToPng(data.cedantSignature)
    }

    const pdfData = {
        ...data,
        cedantSignature: cedantSignaturePng
    }

    const doc = generateContractPdf(pdfData)
    return doc.output('blob')
}
