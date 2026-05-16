# Brief Emergent — Génération de sites premium

Ce document est ta **directive type** à donner à Emergent (ou tout autre outil de génération de site) pour produire des sites premium dans le même esprit que `index.html`.

---

## 1. Prompt à copier-coller dans Emergent

> Crée un site web premium pour [NOM DE L'ENTREPRISE], secteur [SECTEUR], cible [CIBLE CLIENT].
>
> **Objectif business** : générer plus de demandes de devis / ventes en ligne et fidéliser les clients existants.
>
> **Style visuel** : moderne et premium, inspiré de Stripe / Vercel / Linear.
> - Mode sombre par défaut (fond `#0a0a0f`, cartes `#16161f`)
> - Typographie : `Space Grotesk` pour les titres, `Inter` pour le corps
> - Couleurs d'accent : gradient violet/indigo `#6366f1 → #a855f7 → #ec4899`
> - Animations subtiles : reveal au scroll, hover sur les cartes (translateY -4px), pulse sur badges
> - Glow effects derrière les éléments mis en avant
> - Espacement généreux (sections en 120px de padding vertical)
>
> **Structure obligatoire** (dans cet ordre) :
> 1. Header sticky avec backdrop-blur
> 2. Hero avec badge "scarcity" (places limitées / offre exclusive), titre en 2 lignes dont une en gradient, sous-titre, 2 CTA (primaire + ghost), 3 stats clés
> 3. Section "Avant / Après" : montre visuellement la valeur apportée
> 4. Grille de services (6 cartes avec icône, titre, description)
> 5. Process en 4 étapes numérotées
> 6. Résultats chiffrés (3 KPIs en gros) + témoignage client
> 7. Offre commerciale avec prix barré + nouveau prix + liste de bénéfices
> 8. Formulaire de contact / audit gratuit
> 9. Footer avec colonnes
>
> **Règles de copywriting** :
> - Titres orientés bénéfice client, pas description du service
> - Verbe d'action + chiffre concret quand c'est possible
> - Ton direct, vouvoiement
> - Toujours montrer la rareté (places limitées, offre temporaire)
> - Garantie ou risque inversé quand c'est possible
>
> **Performance** :
> - HTML/CSS/JS pur (ou React+Vite si interactif)
> - Pas de framework CSS lourd
> - Polices via Google Fonts en preconnect
> - Images en lazy loading
> - Score Lighthouse > 90 sur tous les axes
>
> **Reférence visuelle** : voir `index.html` joint comme exemple de rendu attendu.

---

## 2. Comment adapter pour chaque client

À chaque nouveau projet, remplace dans le brief :

| Variable | Exemple |
|---|---|
| `[NOM DE L'ENTREPRISE]` | "Atelier Dupont" |
| `[SECTEUR]` | "Plomberie haut de gamme" |
| `[CIBLE CLIENT]` | "Propriétaires de maisons de luxe en région parisienne" |
| Objectif business | Adapter selon le client (B2B vs B2C, devis vs e-commerce, etc.) |

---

## 3. Checklist qualité avant livraison

- [ ] Le titre du hero contient un bénéfice mesurable
- [ ] Le CTA principal est visible sans scroller
- [ ] Au moins 3 preuves sociales (témoignages, logos, chiffres)
- [ ] L'offre a un prix clair, un avant/après ou une raison d'agir maintenant
- [ ] Le site charge en moins de 2s sur mobile
- [ ] Tous les liens internes fonctionnent
- [ ] Le formulaire de contact est testé
- [ ] Mentions légales et politique de confidentialité ajoutées
- [ ] Favicon et meta OpenGraph configurés
- [ ] Tracking analytics installé

---

## 4. Variations de palette par secteur

Si le client n'aime pas le violet/indigo, voici des alternatives premium :

- **Luxe / Bijouterie / Mode** : Noir + or (`#000000` + `#d4af37`), serif (Playfair Display)
- **Tech / SaaS** : Bleu profond + cyan (`#0a0a0f` + gradient `#3b82f6 → #06b6d4`)
- **Bien-être / Naturel** : Crème + vert sauge (`#faf7f2` + `#7c9474`)
- **Restauration / Gastro** : Terracotta + crème (`#1a0f0a` + gradient `#dc8b54 → #f4a261`)
- **Finance / Conseil** : Marine + blanc cassé (`#0c1e3a` + `#f8f7f2`), serif

---

## 5. Argumentaire de vente associé

Quand tu présentes ton service à un prospect, voici le pitch type :

> "Votre site actuel ne convertit pas parce qu'il manque 3 choses : une promesse claire en 3 secondes, des preuves visibles, et un parcours qui guide vers l'action. On les ajoute, on optimise le reste, et vous récupérez en moyenne 2,8× plus de prospects qualifiés. Délai : 21 jours. Garantie résultats."

**Trois objections classiques à anticiper :**
- *"On a déjà un site"* → "Justement. On part de l'existant, on ne casse rien, et on augmente vos résultats."
- *"C'est cher"* → "L'audit gratuit vous montre combien vous perdez aujourd'hui en visiteurs non convertis. Le ROI est généralement atteint en 2 mois."
- *"On verra plus tard"* → "L'offre fondateurs est limitée à 3 places ce mois-ci. Après, le tarif passe à 4 800€."
