# Modern Web 3D Stack

Complete reference for all libraries installed in this project.

## Build Tools

| Library | Version | Usage |
|---------|---------|-------|
| `vite` | ^5.4 | Lightning-fast dev server and bundler |
| `vite-plugin-glsl` | ^1.3 | Import `.glsl` shader files directly in JS |

## 3D / WebGL

| Library | Version | Usage |
|---------|---------|-------|
| `three` | ^0.169 | Core 3D WebGL engine — scenes, meshes, lights, cameras |
| `@react-three/fiber` | ^8.17 | React renderer for Three.js |
| `@react-three/drei` | ^9.115 | Useful helpers for @react-three/fiber |
| `ogl` | ^1.0 | Lightweight WebGL library for custom renderers |
| `postprocessing` | ^6.36 | Post-processing effects (bloom, DOF, chromatic aberration) |

## React

| Library | Version | Usage |
|---------|---------|-------|
| `react` | ^18.3 | UI component library |
| `react-dom` | ^18.3 | React DOM renderer |
| `framer-motion` | ^11.11 | Declarative React animations |

## Animation

| Library | Version | Usage |
|---------|---------|-------|
| `gsap` | ^3.12 | Professional-grade animation platform |
| `animejs` | ^3.2 | Lightweight JavaScript animation library |
| `@theatre/core` | ^0.7 | Animation timeline for complex sequences |
| `@theatre/studio` | ^0.7 | Visual editor for Theatre.js animations |

## Scroll

| Library | Version | Usage |
|---------|---------|-------|
| `lenis` | ^1.1 | Smooth scroll with native-like feel |
| `@studio-freight/lenis` | ^1.0 | Alternative Lenis distribution |
| `locomotive-scroll` | ^4.1 | Scroll-based animations with parallax |
| `aos` | ^2.3 | Animate On Scroll — simple CSS-driven scroll reveals |
| `scrollreveal` | ^4.0 | Scroll-triggered element reveal animations |

## Text

| Library | Version | Usage |
|---------|---------|-------|
| `split-type` | ^0.3 | Split text into chars/words/lines for GSAP animation |

## UI / Interaction

| Library | Version | Usage |
|---------|---------|-------|
| `swiper` | ^11.1 | Touch-enabled slider / carousel |
| `@barba/core` | ^2.10 | Smooth page transitions (SPA-like) |

## Particles

| Library | Version | Usage |
|---------|---------|-------|
| `tsparticles` | ^3.7 | Full-featured particle system engine |
| `@tsparticles/slim` | ^3.7 | Slimmed-down tsParticles bundle |

## Physics

| Library | Version | Usage |
|---------|---------|-------|
| `matter-js` | ^0.19 | 2D rigid body physics engine |
| `cannon-es` | ^0.20 | 3D physics engine (Cannon.js ES module fork) |

## 2D Rendering

| Library | Version | Usage |
|---------|---------|-------|
| `pixi.js` | ^8.5 | High-performance 2D WebGL renderer |

## Quick Start

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Key File Locations

```
src/
├── main.js                    # App entry — boots all systems
├── style.css                  # Master stylesheet with CSS custom properties
├── shaders/
│   ├── vertex.glsl            # Simplex noise wave distortion shader
│   └── fragment.glsl          # Color blend + fresnel rim light shader
├── scenes/
│   └── MainScene.js           # Three.js scene — animated shader sphere + particles
├── animations/
│   └── ScrollAnimations.js    # GSAP ScrollTrigger — split text, panels, counters
├── effects/
│   └── ParallaxEffect.js      # Multi-layer parallax (scroll + mouse)
└── components/
    └── Loader.js              # Animated entry loader with progress bar
```

## Architecture Notes

- **Lenis** drives smooth scroll and emits scroll events to **GSAP ScrollTrigger**
- **Three.js** renders to a `<canvas>` behind the HTML content
- **GSAP ScrollTrigger** pins sections and drives scrub animations
- **SplitType** splits headings into characters for staggered reveals
- **tsParticles** renders an interactive particle field over the hero
- **Swiper** handles the project showcase slider
- **AOS** handles simple fade-in reveals on secondary elements
