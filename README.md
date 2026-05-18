# Anthony Dalleau — Portfolio

Portfolio one-page immersif pour développeur web créatif. Skyline procédural, scène Three.js atmosphérique, animations GSAP ScrollTrigger et parallaxe multi-couches.

## Stack

| Catégorie | Outil |
|---|---|
| Build | Vite 5, vite-plugin-glsl |
| 3D / WebGL | Three.js, GLSL custom shaders |
| Animation | GSAP 3 + ScrollTrigger, SplitType |
| Scroll | Lenis (smooth scroll) |
| UI | Swiper 12, AOS |
| Particules | tsParticles (slim) |
| Qualité | ESLint 10, Prettier 3 |

## Démarrage

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production → dist/
npm run preview   # prévisualiser le build
npm run lint      # vérifier le code
npm run format    # formater le code
```

## Structure

```
src/
├── core/
│   └── mouse.js              # Bus souris partagé (un seul listener)
├── scenes/
│   └── MainScene.js          # Scène Three.js — sphère shader + particules city-lights
├── animations/
│   └── ScrollAnimations.js   # GSAP ScrollTrigger — split text, panels épinglés, compteurs
├── effects/
│   ├── CityParallax.js       # Skyline SVG procédural multi-couches
│   └── ParallaxEffect.js     # Parallaxe scroll + tilt souris
├── components/
│   └── Loader.js             # Écran de chargement animé
├── shaders/
│   ├── vertex.glsl           # Bruit simplex + distorsion ondulante
│   └── fragment.glsl         # Blend couleurs + fresnel rim light
├── main.js                   # Point d'entrée — classe App
└── style.css                 # Feuille maître avec CSS custom properties
```

## Déploiement

GitHub Pages via GitHub Actions. Le workflow se déclenche sur chaque push vers `main`.

Le `base` Vite est configuré sur `/Teste-claud/` pour correspondre au chemin GitHub Pages.

## Architecture

- **Lenis** pilote le scroll fluide et émet ses événements vers **GSAP ScrollTrigger**
- **Three.js** rend sur un `<canvas>` derrière le contenu HTML
- **CityParallax** génère les silhouettes de ville en SVG procédural (LCG déterministe)
- **mouse.js** centralise le tracking souris — `MainScene`, `ParallaxEffect` et le curseur custom lisent depuis ce bus commun
- **gsap.context()** scope les animations de `ScrollAnimations` et `ParallaxEffect` pour un `destroy()` propre
