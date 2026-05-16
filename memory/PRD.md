# PremiumRefonte — Site amélioré v2 (Immersion Vidéo)

## Problème initial
> "avec le liens aide moi a l'améliorer ... je veux pouvoire integer la video pour que je puisse mieux m'immerger mieux"
> Source: https://raw.githack.com/anthonydalleau35600-commits/Teste-claud/claude/video-frames-immersive-site-oC9Cg/index.html

## Choix utilisateur
- Vidéo dans Hero + Frames (les deux)
- Vidéo d'ambiance libre de droits (pas de fichier fourni)
- Effet : scroll-driven zoom/mouvement
- Modifier le code existant
- Esthétique : évoluer vers ambiance japonisante (encre, brume, érable rouge)

## Architecture
- Fichier unique : `index.html` autonome (HTML+CSS+JS inline)
- Sortie : `/app/index-improved.html` et `/app/frontend/public/site.html`
- Asset uploadé : image zen Veo utilisée comme poster fallback + arrière-plan

## Améliorations livrées (16/05/2026)
- ✅ Vidéos plein écran en boucle dans Hero + 4 frames + Contact (Mixkit CDN)
- ✅ Scroll-driven zoom/parallax (rAF + transform) sur Hero/Frames/Contact
- ✅ Poster fallback = image zen Veo de l'utilisateur (qualité d'image conservée si vidéo lente)
- ✅ IntersectionObserver play/pause auto = économie bande passante
- ✅ Esthétique japonisante : kanji décoratifs (縁 静寂 観 美 技 緣 道 信 始), Shippori Mincho, vermillon #d94e3a
- ✅ Effets cinématiques : grain de film SVG, vignette radiale, brume animée (4 nappes lentes)
- ✅ Bouton son flottant pour activer audio ambiance hero
- ✅ Side-dots avec kanji révélé au hover (序 心 技 道 信 始)
- ✅ Cursor custom avec ring qui s'agrandit sur les éléments interactifs
- ✅ Loader avec kanji 縁 (lien/destin)
- ✅ Stats animés, reveal au scroll, formulaire stylé glassmorphique
- ✅ Responsive complet + prefers-reduced-motion respecté
- ✅ data-testid sur tous les éléments interactifs

## Vidéos utilisées (royalty-free, Mixkit CDN)
- Hero : mixkit/4146 + image zen comme poster
- Frame 1 → 4 : mixkit/18260, 18259, 18261, 18262
- Contact : mixkit/18263
- Format : MP4 1080p avec fallback 720p (`<source>` multi-qualité)

## Backlog / Idées futures
- P1 : Remplacer les vidéos Mixkit par une vidéo Veo dédiée (chemin de pierres japonais) une fois fournie par l'utilisateur
- P1 : Audio d'ambiance dédié (rivière, vent) séparé du flux vidéo
- P2 : Animations GSAP pour transitions plus fluides entre frames
- P2 : Mode preview/cas clients (galerie de réalisations)
- P2 : Intégration Calendly pour booking direct depuis l'audit
- P2 : Newsletter / lead magnet PDF (guide refonte premium)

## Mode déploiement
1. Le fichier `/app/index-improved.html` est prêt à uploader sur GitHub (remplacer l'ancien `index.html`)
2. Preview live : https://frame-experience.preview.emergentagent.com/site.html
