# SpeechifyPro PWA

Application web progressive (PWA) de lecture audio de documents PDF et textes avec surlignage synchronisé.

## Fonctionnalités

### 📥 Import de documents
- Import PDF avec extraction texte complète (PDF.js)
- Import TXT / MD / HTML
- Import URL d'article web (proxy CORS multi-serveurs)
- OCR image (Tesseract.js — 100% client, français + anglais)
- Saisie manuelle de texte

### 🔊 Lecture audio
- Synthèse vocale via Web Speech API
- Sélecteur de voix avec tri qualité (⭐ Google HD en premier)
- Réglage vitesse (0.5x → 3x) par document
- Réglage tonalité (pitch 0.5 → 2.0)
- Pause configurable entre paragraphes
- Mode lecture par phrase (fluide Android) ou par paragraphe
- Skip ±15 secondes
- Persistance position de lecture par document

### 🖊️ Surlignage synchronisé
- Surlignage mot par mot en temps réel
- Mots lus grisés, mot actif en violet
- Curseur de calibrage sync highlight/audio
- Défilement automatique centré sur le mot actif

### 🎯 Mode Zen
- Overlay fond noir total, style téléprompter
- Texte agrandi centré, fondu haut/bas
- Surlignage synchronisé dans le zen
- Contrôles Lecture/Pause + Skip intégrés
- Barre de progression, fermeture par ✕ ou Échap

### 🔖 Marque-pages
- Ajout d'un marque-page à la position courante
- Aperçu du texte et pourcentage
- Reprise directe depuis un marque-page
- Gestion par document, stockage local

### 📚 Bibliothèque
- Recherche et filtres par type
- Tri par date
- Carrousel swipeable sur l'accueil
- Progression par document

### 📊 Statistiques
- Minutes écoutées aujourd'hui vs objectif
- Graphique hebdomadaire en barres
- Total global (documents + minutes)
- Progression par document

### 🎯 Objectif quotidien
- Compteur de minutes écoutées par jour
- Objectif personnalisable (tap sur le label)
- Historique conservé 7 jours
- Reset automatique à minuit

### 🔔 Notifications
- Notification système à la fin de chaque lecture
- Via Service Worker (PWA installée) ou API Notification
- Permission demandée automatiquement

### 🌙 Interface
- Thème sombre / clair persisté
- Onboarding 4 étapes à la première utilisation
- Mode Zen téléprompter
- Bouton partage natif Android / copie lien desktop
- Navigation par icônes SVG inline (toujours visibles)

### 💾 Stockage & persistance
- Documents → IndexedDB (pas de limite de taille)
- Préférences → localStorage (thème, vitesse, voix, position…)
- Vitesse de lecture sauvegardée par document
- Marque-pages par document
- Historique quotidien 7 jours

### 📲 PWA
- Installable sur Android, iOS, desktop
- Fonctionne hors ligne après première visite
- Service Worker avec cache intelligent
- Notification de mise à jour disponible
- Icônes 192×512px

---

## Structure des fichiers

```
speechify-pwa/
├── index.html        ← Application complète (HTML/CSS/JS)
├── sw.js             ← Service Worker (cache offline + notifications)
├── manifest.json     ← Manifest PWA
├── README.md         ← Ce fichier
└── icons/
    ├── icon-192.png  ← Icône PWA 192×192
    └── icon-512.png  ← Icône PWA 512×512
```

---

## Déploiement

### GitHub Pages (actuel)
URL : **https://laurent-67370.github.io/speechify-pwa/**

```bash
git add .
git commit -m "Update"
git push
```
GitHub Pages redéploie automatiquement en ~1 minute.

### Proxy CORS PHP (lhusser.fr)
Pour l'import d'URL, un proxy PHP est requis sur le serveur :
- Fichier : `proxy.php` à déposer sur `lhusser.fr/proxy.php`
- Permet de contourner les restrictions CORS des sites tiers

### Netlify
Glisser-déposer le dossier sur [app.netlify.com](https://app.netlify.com).

### VPS Nginx
```bash
mkdir -p /var/www/speechify/icons
cp index.html sw.js manifest.json proxy.php /var/www/speechify/
cp icons/*.png /var/www/speechify/icons/
```
HTTPS obligatoire pour le Service Worker.

---

## Installation PWA

### Android (Chrome)
1. Ouvrir l'URL dans Chrome
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. L'app s'installe comme une application native

### iOS (Safari)
1. Ouvrir l'URL dans Safari
2. Bouton Partager → "Sur l'écran d'accueil"

---

## Voix recommandées (Android)

Pour de meilleures voix françaises :
1. Paramètres → Accessibilité → Synthèse vocale
2. Moteur : Google Text-to-Speech
3. Options → Installer les données vocales
4. Télécharger Français (France) + Français (Canada)

Les voix Google apparaîtront avec le badge ⭐ Google en haut du sélecteur.

---

## Notes techniques

| Composant | Technologie |
|-----------|-------------|
| Synthèse vocale | Web Speech API |
| Extraction PDF | PDF.js 3.4 |
| OCR image | Tesseract.js 5 |
| Import URL | Proxy PHP lhusser.fr + fallback allorigins/corsproxy |
| Stockage docs | IndexedDB |
| Préférences | localStorage |
| Icônes UI | Lucide Icons + SVG inline nav |
| Polices | Satoshi (Fontshare) |
| Offline | Service Worker Cache-First |
| Notifications | Service Worker Push API |

**Compatibilité :** Chrome Android ✅ · Safari iOS ✅ · Firefox ✅ · Chrome desktop ✅

---

## Historique des versions

| Version | Fonctionnalités |
|---------|----------------|
| v1 | PWA de base, lecture PDF, surlignage |
| v2 | IndexedDB, persistance position, barre progression |
| v3 | Mode Zen, sélection texte popup |
| v4 | Fix Android synthesis-failed (chunked) |
| v5 | Sync surlignage timer-based |
| v6 | Carrousel home, objectif quotidien |
| v7 | Import URL (proxy cascade), OCR Tesseract |
| v8 | Voix qualité triées, pitch, pause §, mode phrase/§ |
| v9 | Marque-pages, vitesse/doc, partage natif |
| v10 | Onboarding, stats détaillées, notifications fin lecture |
| v11 | Fix icônes nav SVG inline, lucide sans defer |

---

## Auteur

Laurent Husser — [lhusser.fr](https://lhusser.fr)
