# Julia — Eau de Parfum

Landing page d'annonce du parfum **Julia** (sortie le 20 janvier 2027).

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Motion** — révélations de texte, preloader, marquee, compte à rebours
- **Three.js** — flacon `parfum.glb` fixe à l'écran, rotation pilotée par le scroll, titre « JULIA » rendu en 3D derrière le verre
- **LottieFiles** (`@lottiefiles/dotlottie-react`) — anneau du preloader et indicateur de scroll
- **Lucide** — icônes

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Structure

| Fichier | Rôle |
| --- | --- |
| `components/Experience.tsx` | Orchestration : scène 3D, preloader, sections |
| `components/PerfumeScene.tsx` | Scène Three.js (flacon, matériaux verre / liquide / bouchon doré, titre 3D) |
| `components/Preloader.tsx` | Preloader animé (compteur, lettres, anneau Lottie, rideau) |
| `components/Hero.tsx`, `Manifesto.tsx`, `Notes.tsx`, `Marquee.tsx`, `Launch.tsx` | Sections de la page |
| `lib/lottie.ts` | Animations Lottie (JSON) |
| `lib/constants.ts` | Date de sortie, courbes d'easing |

Chaque section porte un attribut `data-bottle="x,y,échelle"` (et `data-bottle-m` pour le mobile) :
la scène interpole la position du flacon entre les sections pendant le scroll, tandis que la
progression globale du scroll pilote sa rotation (2 tours complets).

Le moteur WASM de Lottie est copié dans `public/lottie/` au `postinstall` (aucun appel CDN).

## Crédits

Modèle 3D « Parfum Bottle » par AT design studio — [Sketchfab](https://sketchfab.com/3d-models/parfum-bottle-eb42a7f2b2c14af1b1908d15eac175a2), licence Sketchfab Standard.
