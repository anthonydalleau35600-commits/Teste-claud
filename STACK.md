# Stack de référence

## Build

| Paquet | Version | Usage |
|---|---|---|
| `vite` | ^5.4 | Serveur de dev et bundler |
| `vite-plugin-glsl` | ^1.3 | Import de fichiers `.glsl` dans les modules JS |

## 3D / WebGL

| Paquet | Version | Usage |
|---|---|---|
| `three` | ^0.169 | Moteur 3D WebGL — scènes, meshes, lumières, caméras |

## Animation

| Paquet | Version | Usage |
|---|---|---|
| `gsap` | ^3.12 | Animation platform — tweens, ScrollTrigger, context |
| `split-type` | ^0.3 | Découpe le texte en chars/words/lines pour GSAP |

## Scroll

| Paquet | Version | Usage |
|---|---|---|
| `lenis` | ^1.1 | Scroll fluide natif-like, émet vers GSAP ScrollTrigger |

## UI / Interaction

| Paquet | Version | Usage |
|---|---|---|
| `swiper` | ^12.1 | Slider tactile — section projets |
| `aos` | ^2.3 | Animate On Scroll — révélations CSS simples |

## Particules

| Paquet | Version | Usage |
|---|---|---|
| `@tsparticles/slim` | ^3.7 | Champ de particules interactif dans le hero |

## Qualité

| Paquet | Version | Usage |
|---|---|---|
| `eslint` | ^10 | Linting JS |
| `@eslint/js` | ^10 | Config recommandée ESLint (flat config) |
| `globals` | ^17 | Définitions globals navigateur pour ESLint |
| `prettier` | ^3 | Formatage de code |
| `eslint-config-prettier` | ^10 | Désactive les règles ESLint conflictuelles avec Prettier |

## Commandes

```bash
npm run dev       # Serveur de dev (port 3000)
npm run build     # Build production → dist/
npm run preview   # Prévisualiser le build
npm run lint      # Vérifier le code avec ESLint
npm run format    # Formater avec Prettier
```
