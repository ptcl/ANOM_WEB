# ANOM Protocol OS

> **Ce projet est abandonné et n'est plus maintenu.**
>
> Le développement d'ANOM Protocol OS a été définitivement arrêté. Le projet reposait entièrement sur l'univers et l'écosystème de **Destiny / Bungie**. La baisse significative et continue de la popularité de la franchise, le déclin de l'engagement de la communauté, ainsi que les décisions stratégiques de Bungie (restructurations internes, réduction de contenu, incertitude sur l'avenir de la licence) ont rendu ce projet non viable sur le long terme.
>
> Il est possible que quelques mises à jour mineures soient poussées sur le repo pour finaliser certains aspects en l'état, mais aucune nouvelle fonctionnalité ni maintenance active ne sera assurée.
>
> Pour les curieux : 2-3 codes d'emblèmes sont cachés quelque part dans le repo. Bonne chasse.

---

<div align="center">

![ANOM Banner](public/img/protocol_text_glitch.png)

**Interface web futuriste inspirée de l'univers Destiny - Système de gestion d'agents avec authentification Bungie.net**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 🚀 Aperçu

ANOM Protocol OS est une application web interactive qui simule un système d'exploitation futuriste inspiré de l'univers Destiny. L'application propose une expérience immersive avec authentification Bungie.net, gestion d'agents, défis interactifs et une interface de type "desktop OS" avec fenêtres multiples.

### ✨ Fonctionnalités principales

- BIENTÔT DISPONIBLE
## 🛠️ Stack technique

### Frontend
- **Next.js 15.4** - Framework React full-stack
- **React 19.1** - Bibliothèque UI avec les derniers hooks
- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état légère et performante
- **Axios** - Client HTTP pour les APIs

### UI/UX
- **Radix UI** - Composants accessibles (Avatar, Dropdown, etc.)
- **Lucide React** - Icônes SVG modernes
- **Lottie** - Animations vectorielles fluides
- **Class Variance Authority** - Gestion des variants CSS

### Intégrations
- **Bungie.net API** - Authentification et données Destiny
- **MongoDB** - Base de données pour la persistance
- **ANOM API** - API personnalisée pour notre application
- **Clarity API** - Génération de codes-barres (service personnel)

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte développeur Bungie.net

### 1. Clonage du projet

```bash
git clone https://github.com/ptcl/ANOM_WEB.git
cd ANOM_WEB
```

### 2. Installation des dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configuration

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp .env.example .env
```

Éditez `.env` avec vos propres valeurs :

```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLARITY_API_URL=http://localhost:3001

# MongoDB Connection
NEXT_PUBLIC_MONGODB_URI=mongodb://localhost:27017/anom

# Bungie OAuth Configuration
NEXT_PUBLIC_BUNGIE_CLIENT_ID=your_bungie_client_id
NEXT_PUBLIC_BUNGIE_CLIENT_SECRET=your_bungie_client_secret
BUNGIE_API_KEY=your_bungie_api_key
```

### 4. Configuration Bungie.net

1. Rendez-vous sur [Bungie.net Applications](https://www.bungie.net/en/Application)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/identity/bungie/callback` (développement)
   - `https://votre-domaine.com/identity/bungie/callback` (production)
4. Notez vos `Client ID`, `Client Secret` et `API Key`

### 5. Lancement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:3001`

## 🎯 Fonctionnalités détaillées

- BIENTÔT DISPONIBLE 

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build de production
npm run start        # Lance le serveur de production

# Qualité
npm run lint         # Vérification ESLint
```

## 🌐 Déploiement

### Variables d'environnement production

Assurez-vous de configurer ces variables sur votre plateforme de déploiement :

```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NEXT_PUBLIC_API_URL=https://votre-api.com
NEXT_PUBLIC_CLARITY_API_URL=https://votre-clarity-api.com
NEXT_PUBLIC_BUNGIE_CLIENT_ID=production_client_id
NEXT_PUBLIC_BUNGIE_CLIENT_SECRET=production_client_secret
BUNGIE_API_KEY=production_api_key
```

### Plateformes supportées

- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **Railway**

## 🤝 Contribution

Les contributions sont les bienvenues ! Rejoignez notre communauté :

### 💬 Discord Community
Rejoignez notre Discord pour discuter du projet, poser des questions et collaborer avec l'équipe :

[![Discord](https://img.shields.io/badge/Discord-Rejoindre-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/pTnqbQtgKn)

### Guidelines de développement

- Utilisez TypeScript pour tous les nouveaux fichiers
- Respectez les conventions ESLint configurées
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les nouvelles APIs dans les commentaires

## 🔒 Sécurité

- Toutes les APIs utilisent HTTPS
- Tokens JWT avec expiration automatique
- Content Security Policy configurée
- Variables sensibles externalisées

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur principal** : [Lucas Raffalli](https://github.com/LucasRaffalli)
- **Design UI/UX** : Inspiré de l'univers Bungie/Destiny
- **Backend API** : [BIENTÔT DISPONIBLE]

## 🙏 Remerciements

- **Bungie** pour l'univers Destiny et l'API
- **Communauté React/Next.js** pour les outils exceptionnels
- **Tous les contributeurs** qui rendent ce projet possible

---

<div align="center">
  
**Fait avec ❤️ pour la communauté Destiny**

[Documentation soon](./docs) • [Web](https://anom-archives.net) • [Signaler un bug](https://github.com/ptcl/ANOM_WEB/issues)

</div>