# Pipeline AI Visuals — Claude + Canva + Replicate

## Comment ça marche

Quand tu demandes à Claude de créer un site avec des visuels, voici le flux automatique :

```
Tu : "Crée un site pour mon app de fitness"
       ↓
Claude génère les visuels Canva (logo, hero, banners)
       ↓
Claude exporte les assets en PNG/JPG
       ↓
Claude télécharge les fichiers dans site/assets/images/
       ↓
Claude génère la vidéo via Replicate API
       ↓
Claude écrit le HTML/CSS/JS avec les vrais assets intégrés
       ↓
Claude commit et push sur ta branche
```

## Setup Replicate (génération vidéo)

1. Crée un compte sur https://replicate.com
2. Génère une clé API dans Settings → API Tokens
3. Exporte la variable :
   ```bash
   export REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx
   ```
4. Lance la génération :
   ```bash
   npm run generate-video "ton prompt vidéo ici"
   ```

## Modèles vidéo disponibles via Replicate

| Modèle | Usage | Temps |
|--------|-------|-------|
| `wavespeedai/wan-2.1-t2v-480p` | Text → Video 480p | ~30s |
| `stability-ai/stable-video-diffusion` | Image → Video | ~20s |
| `lucataco/animate-diff` | Animation stylisée | ~45s |

## Structure du projet

```
site/
├── index.html          ← Site web
├── style.css           ← Styles
└── assets/
    ├── images/
    │   └── hero.png    ← Généré par Canva MCP ✅
    └── videos/         ← Générés par Replicate
scripts/
└── generate-visuals.js ← Script Replicate
```
