# ANOM_WEB Desktop OS

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

```json
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
```

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/ptcl/anom_web.git

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build pour production
npm run build
```

## 🏗️ Architecture

### Structure des composants
```
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
```

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
*Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')}*