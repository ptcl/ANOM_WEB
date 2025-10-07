import fs from 'fs';
import path from 'path';

// Fonction pour lire un fichier légal selon la locale
export function getLegalContent(fileName: string, locale: string = 'fr'): string | null {
  try {
    const contentDirectory = path.join(process.cwd(), 'src/app/content/legal');
    const filePath = path.join(contentDirectory, locale, `${fileName}.md`);
    
    if (!fs.existsSync(filePath)) {
      // Fallback vers le français si le fichier n'existe pas dans la langue demandée
      const fallbackPath = path.join(contentDirectory, 'fr', `${fileName}.md`);
      if (fs.existsSync(fallbackPath)) {
        return fs.readFileSync(fallbackPath, 'utf-8');
      }
      return null;
    }
    
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading legal file ${fileName}:`, error);
    return null;
  }
}

// Liste des pages légales disponibles
export const availableLegalPages = [
  'legal-notice',
  'privacy',
  'terms',
  'cookies'
] as const;

export type LegalPageType = typeof availableLegalPages[number];