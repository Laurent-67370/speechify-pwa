# SpeechifyPro PWA

Application web progressive (PWA) de lecture audio de documents avec surlignage synchronisé, librairie Gutenberg intégrée et support des gros romans sans freeze.

**URL** : https://laurent-67370.github.io/speechify-pwa/

---

## Fonctionnalités

### 📥 Import de documents
- **PDF** — extraction texte complète multi-pages (PDF.js)
- **TXT / MD / HTML** — import direct
- **EPUB** — extraction native via JSZip (chapitres, titre auto, nettoyage HTML)
- **URL article web** — proxy CORS cascade (lhusser.fr → allorigins → corsproxy)
- **OCR image** — Tesseract.js 100% client, français + anglais
- **Saisie manuelle** — titre + texte libre
- **Limite** : 200 000 mots max à l'import (tronquage automatique avec avertissement)

### 🔊 Lecture audio
- Synthèse vocale Web Speech API
- Sélecteur de voix trié par qualité (⭐ Google HD en premier)
- Retry auto ×15 + bouton 🔄 Actualiser
- Vitesse 0.5x–3x **par document** (mémorisée)
- Tonalité (pitch) 0.5–2.0
- Pause configurable entre paragraphes
- Mode lecture **Par phrase** (fluide Android) ou **Par §**
- Skip ±15 secondes

### 🖊️ Surlignage synchronisé
- **Fenêtre glissante 600 mots** — aucun freeze quelle que soit la taille du document
- Mots lus grisés, mot actif surligné en violet
- Curseur de calibrage sync
- Clic sur un mot pour reprendre depuis ce point

### 🌑 Mode Zen
- Fond noir total, téléprompter centré
- **Fenêtre glissante 400 mots** — stable même sur romans de 200 000 mots
- Reconstruction automatique de la fenêtre à chaque avancée
- Barre de progression, contrôles intégrés

### 📚 Librairie gratuite (Gutenberg)
- 24 classiques du domaine public (romans, philosophie, poésie, sciences)
- Carrousels par catégorie : Coups de cœur, Romans, Philosophie, En français
- Recherche par titre ou auteur, filtres par catégorie
- Modal détail avec :
  - **▶ Lire maintenant** — import TXT direct dans l'app
  - **⬇ Télécharger EPUB** — fichier pour liseuse / Moon+ Reader
  - **🔗 Tous les formats** — page Gutenberg complète
- URLs hardcodées (pas de dépendance à l'API Gutendex)

### 🔖 Marque-pages
- Ajout à la position courante avec aperçu texte + %
- Reprise directe depuis un marque-page
- Stockage par document en localStorage

### 📊 Statistiques
- Minutes écoutées aujourd'hui vs objectif (modifiable)
- Graphique hebdomadaire animé
- Total global + progression par document

### 🎯 Objectif quotidien
- Compteur de minutes par jour
- Historique 7 jours
- Reset automatique à minuit

### 🔔 Notifications
- Notification système à la fin de chaque lecture
- Via Service Worker (PWA) ou API Notification

### 🌙 Interface
- Thème sombre / clair persisté
- Onboarding 4 étapes (première utilisation)
- Partage natif Android / copie lien desktop
- Nav SVG inline (toujours visible, pas de dépendance Lucide)
- Page Aide complète (❓ top-bar)

### 💾 Stockage & persistance
- Documents → IndexedDB
- Préférences → localStorage (thème, vitesse, voix, position, objectif)
- Vitesse mémorisée par document
- Marque-pages par document

---

## Architecture technique

### Fichiers

```
speechify-pwa/
├── index.html       — App complète (HTML + CSS + JS, ~94k chars)
├── catalog.js       — Catalogue Gutenberg + fonctions librairie (~15k chars)
├── sw.js            — Service Worker v4 (cache offline + notifications)
├── manifest.json    — Manifest PWA
├── README.md
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

### Séparation du code
Le script principal (`index.html`) est limité à ~94 000 chars pour contourner
la limite du parser V8 sur Xiaomi HyperOS. Le catalogue et les fonctions
librairie sont dans `catalog.js`, chargé séparément avant le script principal.

### Fenêtre glissante
Pour les gros documents (romans complets), le DOM n'affiche jamais plus de
600 mots (lecteur) ou 400 mots (mode Zen) à la fois. La fenêtre se reconstruit
automatiquement à chaque avancée de la lecture.

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Synthèse vocale | Web Speech API |
| Extraction PDF | PDF.js 3.4 |
| OCR image | Tesseract.js 5 |
| Import EPUB | JSZip 3.10 |
| Import URL | Proxy PHP lhusser.fr + fallbacks CORS |
| Catalogue livres | Project Gutenberg (URLs directes) |
| Stockage docs | IndexedDB |
| Préférences | localStorage |
| Icônes UI | Lucide Icons + SVG inline nav |
| Polices | Satoshi (Fontshare) |
| Offline | Service Worker Cache-First v4 |
| Notifications | Service Worker Push API |

**Compatibilité** : Chrome Android ✅ · Safari iOS ✅ · Firefox ✅ · Chrome desktop ✅

---

## Navigation

| Bouton nav | Page | Contenu |
|------------|------|---------|
| 🏠 Accueil | home | Dashboard, carrousel, objectif du jour |
| 🎧 Lire | reader | Lecteur audio + réglages |
| 📖 Biblio | library | Tes documents importés |
| 📚 Librairie | library-store | Classiques Gutenberg |
| ⬆ Importer | import | PDF, EPUB, TXT, URL, OCR |
| ❓ (top-bar) | help | Guide d'utilisation |
| 📊 (top-bar) | stats | Statistiques détaillées |

---

## Déploiement

### GitHub Pages (actuel)
```bash
git add . && git commit -m "Update" && git push
```
Redéploiement automatique en ~1 minute.

### Proxy CORS PHP
Fichier `proxy.php` sur `lhusser.fr/proxy.php` — permet d'importer
des articles web depuis n'importe quel site.

---

## Installation PWA

### Android (Chrome)
Menu ⋮ → **Ajouter à l'écran d'accueil**

### iOS (Safari)
Bouton Partager → **Sur l'écran d'accueil**

---

## Voix recommandées (Android)

Paramètres → Accessibilité → Synthèse vocale → Google TTS → Options → **Installer les données vocales** → Français (France)

Sur Xiaomi HyperOS, essayer **Microsoft Edge** pour accéder aux voix neurales HD.

---

## Historique des versions

| Version | Ajouts principaux |
|---------|------------------|
| v1–v7 | Base PWA, PDF, surlignage, IndexedDB, OCR, import URL |
| v8 | Pitch, pause §, mode phrase/§, tri voix Google |
| v9 | Marque-pages, vitesse/doc, partage natif |
| v10 | Onboarding, stats, notifications fin lecture |
| v11 | Fix nav SVG inline, lucide sans defer |
| v12–v25 | Fixes crash V8 Xiaomi HyperOS (apostrophes, taille script) |
| v26 | Stats responsive |
| v27 | Retry voix ×15, bouton Actualiser |
| v28 | Page Aide complète — **base stable** |
| v29–v31 | Librairie Gutenberg, import EPUB, fenêtre glissante anti-freeze |

---

## Auteur

Laurent Husser — [lhusser.fr](https://lhusser.fr)
