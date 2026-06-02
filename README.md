# SpeechifyPro PWA

Application web progressive (PWA) de lecture audio de documents PDF et textes avec surlignage synchronisé.

## Fonctionnalités

- 📄 Import PDF, TXT, MD — extraction automatique du texte
- 🔊 Lecture audio via synthèse vocale (Web Speech API)
- 🖊️ Surlignage mot par mot synchronisé avec l'audio
- 🎯 Mode Zen — téléprompter fond noir immersif
- ⚙️ Réglages vitesse, voix, synchronisation highlight
- 📚 Bibliothèque de documents avec recherche et filtres
- 💾 Stockage IndexedDB (pas de limite de taille)
- 🔄 Reprise automatique à la position de lecture
- 🌙 Thème sombre / clair persisté
- 📲 Installable en PWA (Android, iOS, desktop)
- ✈️ Fonctionne hors ligne après première visite

## Structure des fichiers

```
speechify-pwa/
├── index.html        ← Application complète (HTML/CSS/JS)
├── sw.js             ← Service Worker (cache offline)
├── manifest.json     ← Manifest PWA
├── README.md         ← Ce fichier
└── icons/
    ├── icon-192.png  ← Icône PWA 192×192
    └── icon-512.png  ← Icône PWA 512×512
```

## Déploiement

### GitHub Pages

1. Créer un repo GitHub `speechify-pwa`
2. Push tous les fichiers sur la branche `main`
3. Settings → Pages → Deploy from branch `main` / `/ (root)`
4. URL : `https://laurent-67370.github.io/speechify-pwa/`

### Netlify

Glisser-déposer le dossier sur [app.netlify.com](https://app.netlify.com) → Deploy manually.

### VPS (Nginx)

```bash
mkdir -p /var/www/speechify/icons
cp index.html sw.js manifest.json /var/www/speechify/
cp icons/*.png /var/www/speechify/icons/
```

Configurer Nginx avec HTTPS (obligatoire pour le Service Worker).

## Installation PWA sur Android

1. Ouvrir l'URL dans Chrome
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. L'app s'installe comme une application native

## Installation PWA sur iOS (Safari)

1. Ouvrir l'URL dans Safari
2. Bouton Partager → "Sur l'écran d'accueil"

## Notes techniques

- **Synthèse vocale** : Web Speech API — voix disponibles selon l'appareil
- **Stockage docs** : IndexedDB (contenu) + localStorage (préférences)
- **Compatibilité** : Chrome Android ✅ · Safari iOS ✅ · Firefox ✅ · Chrome desktop ✅
- **Offline** : Service Worker met en cache les ressources au premier chargement
- **Limite PDF** : pas de limite de taille (IndexedDB)

## Développé avec

- HTML / CSS / JavaScript vanilla
- [PDF.js](https://mozilla.github.io/pdf.js/) — extraction texte PDF
- [Lucide Icons](https://lucide.dev/) — icônes
- Web Speech API — synthèse vocale
- IndexedDB — stockage local
- Service Worker — mode offline

## Auteur

Laurent Husser — [lhusser.fr](https://lhusser.fr)
