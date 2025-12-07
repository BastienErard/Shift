# Shift

**Shift** est une application web de pixel art génératif qui affiche un paysage 2D évoluant en temps réel selon la météo, l'heure et les saisons.

## Aperçu

L'application présente une scène de campagne avec :
- Une maison cottage rustique avec cheminée fumante
- Une forêt en arrière-plan avec plusieurs plans de profondeur
- Une rivière traversée par un pont en bois
- Des arbres, buissons et textures de sol
- Des éléments célestes (soleil, lune, étoiles, nuages animés)
- Des effets météo (pluie, neige, éclairs)

### Modes de fonctionnement

- **Mode Live** : La scène s'adapte automatiquement à la météo réelle (via Open-Meteo API), l'heure locale et la saison
- **Mode Manuel** : Contrôle total sur tous les paramètres (moment de la journée, saison, météo, température, vent)

## Technologies

- **Next.js 16** avec App Router
- **React 19** avec React Compiler
- **TypeScript**
- **Tailwind CSS 4**
- **Canvas 2D API** pour le rendu pixel art
- **next-intl** pour l'internationalisation (FR/EN)

## Installation

```bash
# Cloner le repository
git clone <repo-url>
cd shift

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |

## Architecture du projet

```
shift/
├── app/                    # Routes Next.js (App Router)
│   └── [locale]/           # Routes internationalisées
├── components/             # Composants React
│   ├── canvas/             # Composants de rendu canvas
│   └── ShiftScene.tsx      # Composant principal de la simulation
├── lib/
│   ├── api/                # Clients API (météo)
│   ├── canvas/             # Moteur de rendu pixel art
│   │   ├── elements/       # Éléments visuels (maison, arbres, rivière, etc.)
│   │   ├── builder.ts      # Construction de la scène
│   │   ├── renderer.ts     # Rendu canvas
│   │   ├── palette.ts      # Palettes de couleurs
│   │   └── conditions.ts   # Types et utilitaires pour les conditions
│   ├── hooks/              # Hooks React personnalisés
│   └── utils/              # Utilitaires
├── messages/               # Fichiers de traduction (fr.json, en.json)
└── public/                 # Assets statiques
```

## Fonctionnalités

### Conditions météo
- **Ciel dégagé** : Soleil brillant, ciel bleu
- **Nuageux** : Nuages animés qui se déplacent avec le vent
- **Pluie** : Gouttes de pluie animées
- **Neige** : Flocons de neige, sol enneigé, rivière gelée
- **Orage** : Éclairs, pluie intense

### Moments de la journée
- **Aube** : Soleil levant à l'est, couleurs rosées
- **Matin** : Lumière douce
- **Midi** : Soleil au zénith
- **Après-midi** : Lumière chaude
- **Crépuscule** : Soleil couchant à l'ouest, couleurs orangées
- **Nuit** : Lune, étoiles, étoiles filantes

### Saisons
- **Printemps** : Végétation vert clair, fleurs
- **Été** : Vert forêt intense
- **Automne** : Couleurs orangées et brunes
- **Hiver** : Neige sur les toits et les arbres, rivière gelée si T° < -5°C

### Éléments dynamiques
- **Fumée de cheminée** : Visible quand T° < 15°C, animée avec le vent
- **Nuages** : Se déplacent selon la direction et vitesse du vent
- **Rivière** : Reflets animés, gel en cas de grand froid
- **Étoiles filantes** : Apparaissent la nuit de façon aléatoire

## API Météo

L'application utilise l'API [Open-Meteo](https://open-meteo.com/) (gratuite, sans clé API) pour récupérer :
- Température actuelle
- Couverture nuageuse
- Précipitations
- Vitesse et direction du vent
- Heures de lever/coucher du soleil

La géolocalisation du navigateur est utilisée pour obtenir les données météo locales.

## Canvas et rendu

Le rendu utilise l'API Canvas 2D avec :
- **Résolution** : 800x600 pixels (affiché à 400x300 avec `image-rendering: pixelated`)
- **Système de couches** : Ciel → Éléments célestes → Sol → Éléments terrestres
- **Animation** : 60 FPS via `requestAnimationFrame`
- **Z-index** : Éléments "sky" (soleil, nuages) vs "ground" (arbres, maison)

## Licence

Projet personnel - Tous droits réservés.
