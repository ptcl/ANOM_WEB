import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Composant simple pour rendre le Markdown en HTML
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Fonction pour convertir le Markdown basique en HTML
  const markdownToHtml = (markdown: string): string => {
    let html = markdown;

    // PREMIÈRE PHASE : Détection et préparation des éléments complexes
    const tableMap = new Map<string, string>();
    const codeBlockMap = new Map<string, string>();
    const hrMap = new Map<string, string>();
    let tableIndex = 0;
    let codeBlockIndex = 0;
    let hrIndex = 0;

    // Fonction pour créer un tableau HTML à partir des données Markdown
    const createTableHTML = (headerCells: string[], dataRows: string[][]): string => {
      const headerHtml = headerCells.map((cell: string) =>
        `<th class="px-4 py-3 text-left font-semibold text-white border-b border-gray-600 bg-gray-800/50">${cell.replace(/\*\*(.*?)\*\*/g, '$1')}</th>`
      ).join('');

      const bodyHtml = dataRows.map(row => {
        const rowCells = row.slice(0, headerCells.length).map((cell: string) =>
          `<td class="px-4 py-3 text-[var(--light-dark-2)] border-b border-gray-700/50">${cell}</td>`
        ).join('');
        return `<tr class="hover:bg-gray-800/30 transition-colors">${rowCells}</tr>`;
      }).join('');

      return `<div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>`;
    };

    // Détecter tous les tableaux et les remplacer par des placeholders
    html = html.replace(/(\|[^\n]*\|[^\n]*(?:\n|$))+/g, (match) => {
      const lines = match.trim().split('\n').filter(line => line.trim() && line.includes('|'));

      if (lines.length < 2) return match;

      // Analyser la structure du tableau
      const allLines = lines.map(line => line.trim());
      const headerLine = allLines[0];
      const separatorLineIndex = allLines.findIndex(line =>
        /^\|?[\s\-:]+\|[\s\-:]*\|?/.test(line)
      );

      const dataLines = separatorLineIndex > 0
        ? allLines.slice(separatorLineIndex + 1)
        : allLines.slice(1);

      // Fonction pour extraire les cellules
      const extractCells = (line: string): string[] => {
        return line
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(cell => cell.trim());
      };

      const headerCells = extractCells(headerLine);
      if (headerCells.length === 0) return match;

      // Extraire les données
      const dataRows: string[][] = [];
      dataLines.forEach(line => {
        // Ignorer les lignes de séparation
        if (/^\|?[\s\-:]+\|/.test(line)) return;

        const dataCells = extractCells(line);
        if (dataCells.length === 0) return;

        // Ajuster le nombre de cellules
        while (dataCells.length < headerCells.length) {
          dataCells.push('');
        }
        dataRows.push(dataCells);
      });

      if (dataRows.length === 0) return match;

      // Créer le tableau HTML et le stocker
      const tableHTML = createTableHTML(headerCells, dataRows);
      const placeholder = `__TABLE_${tableIndex}__`;
      tableMap.set(placeholder, tableHTML);
      tableIndex++;

      return placeholder;
    });

    // Détecter et stocker les blocs de code
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, code) => {
      const langLabel = language ? `<span class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-t border-b border-gray-700">${language}</span>` : '';
      const trimmedCode = code.trim();

      const codeBlockHTML = `<div class="bg-gray-900/90 border border-gray-700 rounded-lg mb-6 overflow-hidden">
        ${langLabel}
        <pre class="overflow-x-auto p-4 ${langLabel ? 'pt-2' : 'pt-4'}"><code class="text-sm text-gray-300 font-mono leading-relaxed">${trimmedCode}</code></pre>
      </div>`;

      const placeholder = `__CODEBLOCK_${codeBlockIndex}__`;
      codeBlockMap.set(placeholder, codeBlockHTML);
      codeBlockIndex++;

      return placeholder;
    });

    // Détecter et stocker les séparateurs horizontaux (---, ***, ___)
    html = html.replace(/^(---|\*\*\*|___)$/gm, () => {
      const hrHTML = `<hr class="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />`;

      const placeholder = `__HR_${hrIndex}__`;
      hrMap.set(placeholder, hrHTML);
      hrIndex++;

      return placeholder;
    });

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mb-3 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mb-6">$1</h1>');

    // Bold et Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Liens
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Code inline (après les blocs de code pour éviter les conflits)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-800/80 text-blue-300 px-2 py-1 rounded text-sm font-mono border border-gray-700/50">$1</code>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-[var(--light-dark-3)] mb-4">$1</blockquote>');

    // Listes à puces
    html = html.replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>');
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside text-[var(--light-dark-2)] mb-4 ml-4">$1</ul>');

    // Listes numérotées
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="mb-1">$1</li>');

    // Paragraphes
    html = html.replace(/^(?!<[hul]|<\/[hul]|<pre|<blockquote)(.+)$/gm, '<p class="text-[var(--light-dark-2)] leading-relaxed mb-4">$1</p>');

    // Nettoyer les paragraphes vides
    html = html.replace(/<p[^>]*><\/p>/g, '');

    // Balises mark (pour la mise en évidence)
    html = html.replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded font-medium">$1</mark>');

    // PHASE FINALE : Remplacer tous les placeholders
    // Remplacer les blocs de code
    codeBlockMap.forEach((codeHTML, placeholder) => {
      html = html.replace(placeholder, codeHTML);
    });

    // Remplacer les séparateurs horizontaux
    hrMap.forEach((hrHTML, placeholder) => {
      html = html.replace(placeholder, hrHTML);
    });

    // Remplacer les tableaux
    tableMap.forEach((tableHTML, placeholder) => {
      html = html.replace(placeholder, tableHTML);
    });

    return html;
  };

  return (
    <div
      className={`prose prose-lg prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
}