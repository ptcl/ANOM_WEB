// Export des contenus Markdown pour les applications desktop

// Export des contenus Markdown
export const markdownFiles = {
    'ideas.md': `# Mes Idées 💡

## Projets en cours

- [x] ~~Système de fenêtres avec z-index~~
- [x] ~~Explorateur de fichiers avec breadcrumb~~
- [x] ~~Markdown viewer avec react-markdown~~
- [ ] Améliorer l'interface utilisateur
- [ ] Ajouter de nouvelles fonctionnalités
- [ ] Optimiser les performances

## Fonctionnalités techniques

### Backend
- **API REST** avec FastAPI
- **Base de données** PostgreSQL
- **Authentification** JWT + OAuth2
- **Cache** Redis pour les performances

### Frontend
- **Framework**: Next.js 14 avec App Router
- **UI**: Tailwind CSS + Shadcn/ui
- **State**: Zustand pour la gestion d'état
- **Animations**: Framer Motion
- **Markdown**: React-markdown + remark-gfm

## Architecture du projet

\`\`\`typescript
interface FileSystemStructure {
    files: Record<string, FileNode>
    folders: Record<string, FolderData>
}

interface WindowInfo {
    id: string
    title: string
    zIndex?: number
    isOpen: boolean
    position?: { x: number, y: number }
    size?: { width: number, height: number }
}

const bringToFront = (id: string) => {
    // Gestion intelligente du z-index
    if (maxZ >= 2000) {
        normalizeZIndexes() // Auto-reset
    }
    updateWindow(id, { zIndex: maxZ + 1 })
}
\`\`\`

## Tableaux de fonctionnalités

| Fonctionnalité | Status | Priorité | Développeur |
|----------------|--------|----------|-------------|
| Z-Index dynamique | ✅ Terminé | Haute | @dev |
| Markdown viewer | ✅ Terminé | Moyenne | @dev |
| Image viewer | ✅ Terminé | Moyenne | @dev |
| File explorer | ✅ Terminé | Haute | @dev |
| Context menus | ✅ Terminé | Haute | @dev |
| Drag & Drop | 🚧 En cours | Moyenne | @dev |
| Search system | 📋 Planifié | Basse | - |

## Prochaines étapes

### Phase 1 - Amélioration UX
- [ ] Animations de transition fluides
- [ ] Feedback visuel pour les actions
- [ ] Raccourcis clavier
- [ ] Mode plein écran pour les fenêtres

### Phase 2 - Fonctionnalités avancées
- [ ] Système de plugins
- [ ] Thèmes personnalisables
- [ ] Sauvegarde locale/cloud
- [ ] Partage de fichiers

### Phase 3 - Performance
- [ ] Lazy loading des composants
- [ ] Virtualisation des listes longues
- [ ] Cache intelligent
- [ ] Optimisation bundle size

## Citations importantes

> "La simplicité est la sophistication ultime." - Leonardo da Vinci
> 
> "Le code est plus souvent lu qu'écrit." - Guido van Rossum
>
> "Tout problème complexe a une solution simple, claire et fausse." - H.L. Mencken

## Ressources utiles

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

### Outils de développement
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

**Statistiques du projet :**
- 📁 Fichiers : 50+
- 📝 Lignes de code : 5000+
- 🔧 Composants : 25+
- ⚡ Performance : A+

*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*

---

## Changelog récent

### v0.3.0 - ${new Date().toLocaleDateString('fr-FR')}
- ✅ Ajout du système Z-index dynamique
- ✅ Amélioration du viewer Markdown
- ✅ Optimisation des performances
- 🐛 Correction bugs TaskBar

### v0.2.0 - Précédent
- ✅ Système de fichiers complet
- ✅ Explorateur avec breadcrumbs
- ✅ Context menus universels

### v0.1.0 - Initial
- ✅ Structure de base
- ✅ Système de fenêtres
- ✅ Applications de base`,

    'project-readme.md': `# ANOM_WEB Desktop OS

## 🚀 Vue d'ensemble

ANOM_WEB est une simulation complète d'un système d'exploitation de bureau construit avec **Next.js 14**, **TypeScript**, et **Tailwind CSS**. Il offre une expérience desktop native dans le navigateur.

## ✨ Fonctionnalités principales

### 🖥️ Gestionnaire de fenêtres
- Système de z-index dynamique
- Redimensionnement et déplacement
- Minimisation/maximisation
- Support mobile responsive

### 📁 Système de fichiers
- Explorateur avec navigation breadcrumb
- Support multi-formats (txt, md, json, images)
- Opérations CRUD complètes
- Structure hiérarchique

### 🎨 Interface utilisateur
- Thème sombre adaptatif
- Animations fluides (Framer Motion)
- Context menus universels
- TaskBar interactive

## 🛠️ Technologies utilisées

\`\`\`json
{
  "frontend": [
    "Next.js 14",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Shadcn/ui"
  ],
  "state": ["Zustand"],
  "markdown": ["react-markdown", "remark-gfm"],
  "build": ["Webpack", "ESLint", "Prettier"]
}
\`\`\`

## 📦 Installation

\`\`\`bash
# Cloner le repository
git clone https://github.com/ptcl/anom_web.git

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build pour production
npm run build
\`\`\`

## 🏗️ Architecture

### Structure des composants
\`\`\`
src/
├── components/
│   ├── desktop/
│   │   ├── applications/     # Apps du desktop
│   │   ├── WindowContainer   # Gestionnaire fenêtres
│   │   ├── FileViewer       # Viewers multi-format
│   │   └── FolderExplorer   # Navigation fichiers
│   └── ui/                  # Composants UI base
├── store/
│   ├── useWindowsStore.ts   # État des fenêtres
│   └── useFileSystem.ts     # Système de fichiers
└── content/
    └── desktopData/         # Données des fichiers
\`\`\`

## 🎯 Roadmap

- [ ] **v0.4.0** : Système de plugins
- [ ] **v0.5.0** : Thèmes personnalisables  
- [ ] **v0.6.0** : Sauvegarde cloud
- [ ] **v1.0.0** : Version stable

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT © PTCL Team

---
*Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')}*`
}

// Fonction utilitaire pour récupérer le contenu Markdown
export const getMarkdownContent = (filename: string): string => {
    return markdownFiles[filename as keyof typeof markdownFiles] || ''
}