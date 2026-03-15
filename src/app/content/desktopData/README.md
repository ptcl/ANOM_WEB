# Desktop Data Structure

Ce dossier contient toutes les données structurées pour les applications du desktop, séparées de la logique applicative pour maintenir un code propre et modulaire.

## 📁 Structure

```
desktopData/
├── index.ts              # Point d'entrée principal
├── documentsContent.ts   # Données pour l'app Documents
├── additionalContent.ts  # Autres contenus (Settings, Media)
└── README.md            # Cette documentation
```

## 🎯 Objectifs

1. **Séparation des préoccupations** : Données séparées de la logique
2. **Maintenabilité** : Facile à modifier sans toucher au code
3. **Extensibilité** : Simple d'ajouter de nouveaux contenus
4. **Type Safety** : Types TypeScript pour chaque structure

## 📝 Utilisation

### Import des données
```typescript
// Import principal
import { documentsContent } from '@/app/content/desktopData'

// Import via fonction utilitaire
import { getAppContent } from '@/app/content/desktopData'
const content = getAppContent('documents')
```

### Structure des données
```typescript
interface AppContentData {
    files: Array<{
        id: string
        name: string
        type: 'file'
        extension: string
        content: string
    }>
    folders: Record<string, {
        id: string
        name: string
        type: 'folder'
        files: Array<{...}>
    }>
}
```

## 🚀 Ajouter de nouveaux contenus

### 1. Créer le fichier de données
```typescript
// newAppContent.ts
export const newAppContent = {
    files: [
        {
            id: 'example-file',
            name: 'example.txt',
            type: 'file' as const,
            extension: 'txt',
            content: 'Contenu du fichier'
        }
    ],
    folders: {}
} as const

export type NewAppContentType = typeof newAppContent
```

### 2. Ajouter à l'index
```typescript
// index.ts
export { newAppContent, type NewAppContentType } from './newAppContent'
```

### 3. Mettre à jour getAppContent
```typescript
export const getAppContent = (appId: string) => {
    switch (appId) {
        case 'newApp':
            return newAppContent
        // ... autres cas
    }
}
```

## 📊 Contenus actuels

### Documents
- **Notes.txt** : Notes personnelles avec tâches
- **Ideas.md** : Documentation projet avec Markdown avancé
- **Assets/** : Images du projet (logos, wallpapers)
- **Projects/** : Fichiers de configuration et README

### Settings (futur)
- Configuration de l'application
- Paramètres utilisateur

### Media (futur)
- Screenshots
- Wallpapers
- Galerie d'images

## 🔧 Avantages de cette approche

1. **Performance** : Données statiques optimisées
2. **Scalabilité** : Facile d'ajouter du contenu
3. **Testabilité** : Données isolées testables
4. **Internationalisation** : Préparé pour i18n
5. **Version Control** : Historique des changements de contenu

## 🎨 Exemples de contenu riche

### Markdown avec GFM
- ✅ Cases à cocher
- 📊 Tableaux stylés
- 💻 Blocs de code avec syntaxe
- 🔗 Liens externes
- 📝 Citations formatées

### JSON avec validation
- Configuration d'application
- Métadonnées de fichiers
- Paramètres utilisateur

### Données d'images
- Chemins vers assets publics
- Métadonnées d'images
- Configurations d'affichage

---

*Structure créée le ${new Date().toLocaleDateString('fr-FR')}*