# 🔧 Guide de Correction Rapide - CV Interactif

**Pour** : Samir Medjaher  
**Date** : 31 Octobre 2025  
**Objectif** : Corriger les liens Google Drive cassés en 10 minutes

---

## 🎯 Problème à Corriger

Votre site GitHub Pages (https://duperopope.github.io/SamirMedjaher/) affiche des erreurs :
- ❌ Images d'Éric (Tamagotchi) ne se chargent pas
- ❌ PDFs de CV non téléchargeables
- ⚠️ Erreur console : `ERR_BLOCKED_BY_ORB`

**Cause** : Google Drive bloque l'accès direct aux fichiers depuis d'autres sites.

**Solution** : Héberger les fichiers localement dans le projet.

---

## ⚡ Correction Automatique (Recommandé)

### Méthode A : Script Automatique

Un script a été préparé pour tout corriger automatiquement.

#### Étapes :

1. **Ouvrir un terminal** dans le dossier du projet
   ```bash
   cd /home/user/webapp
   ```

2. **Lancer le script**
   ```bash
   ./fix-assets.sh
   ```

3. **Suivre les instructions** à l'écran

4. **Placer vos PDFs** dans `assets/pdf/`
   - `CV_Samir_Medjaher_FR.pdf`
   - `CV_Samir_Medjaher_EN.pdf`

5. **Tester** en ouvrant `index.html` dans votre navigateur

6. **Committer et pusher**
   ```bash
   git add assets/ index.html
   git commit -m "🐛 Fix: Remplace Google Drive par assets locaux"
   git push origin main
   ```

7. **Vérifier** sur https://duperopope.github.io/SamirMedjaher/ (attendre 2-3 minutes)

**Temps estimé** : ⏱️ 10 minutes

---

## 🛠️ Correction Manuelle (Alternative)

Si le script ne fonctionne pas, voici comment faire manuellement.

### Étape 1 : Créer les dossiers

```bash
cd /home/user/webapp
mkdir -p assets/images
mkdir -p assets/pdf
```

### Étape 2 : Télécharger vos fichiers depuis Google Drive

**Images d'Éric** :
1. Ouvrir ce lien dans votre navigateur :
   ```
   https://drive.google.com/uc?export=view&id=1J7Wgb9A6TOLLjGM5410RGXrE5CCftY23
   ```
2. Télécharger l'image
3. La renommer en `eric-cat.png`
4. La placer dans `assets/images/`

**PDFs** :
1. Télécharger vos CVs depuis Google Drive :
   - PDF FR : `https://drive.google.com/uc?export=download&id=1m2gYO3lF9H9zKT0QXNhMc-ugcgWkHnD0`
   - PDF EN : `https://drive.google.com/uc?export=download&id=1yTQXDdlkjcYsX4RUXXIh9Wzwld-OXJaE`
2. Les renommer :
   - `CV_Samir_Medjaher_FR.pdf`
   - `CV_Samir_Medjaher_EN.pdf`
3. Les placer dans `assets/pdf/`

### Étape 3 : Modifier index.html

Ouvrir `index.html` dans un éditeur de texte et faire ces modifications :

#### Modification 1 : Image Tamagotchi (ligne ~106)

**AVANT** :
```html
src="https://drive.google.com/uc?export=view&id=1J7Wgb9A6TOLLjGM5410RGXrE5CCftY23"
```

**APRÈS** :
```html
src="assets/images/eric-cat.png"
```

#### Modification 2 : Icônes tamaIcons (ligne ~721-730)

**AVANT** :
```javascript
const tamaIcons = {
    normal:   'https://cdn-icons-png.flaticon.com/64/1998/1998661.png',
    hungry:   'https://cdn-icons-png.flaticon.com/64/1046/1046784.png',
    fed:      'https://cdn-icons-png.flaticon.com/64/2620/2620074.png',
    happy:    'https://drive.google.com/thumbnail?id=1J7Wgb9A6TOLLjGM5410RGXrE5CCftY23&sz=128',
    unhappy:  'https://cdn-icons-png.flaticon.com/64/1998/1998664.png',
    sleeping: 'https://cdn-icons-png.flaticon.com/64/832/832229.png',
    boxed:    'https://cdn-icons-png.flaticon.com/64/616/616408.png',
    ko:       'https://cdn-icons-png.flaticon.com/64/609/609803.png'
};
```

**APRÈS** :
```javascript
const tamaIcons = {
    normal:   'assets/images/eric-normal.png',
    hungry:   'https://cdn-icons-png.flaticon.com/64/1046/1046784.png',
    fed:      'https://cdn-icons-png.flaticon.com/64/2620/2620074.png',
    happy:    'assets/images/eric-cat.png',
    unhappy:  'https://cdn-icons-png.flaticon.com/64/1998/1998664.png',
    sleeping: 'https://cdn-icons-png.flaticon.com/64/832/832229.png',
    boxed:    'https://cdn-icons-png.flaticon.com/64/616/616408.png',
    ko:       'https://cdn-icons-png.flaticon.com/64/609/609803.png'
};
```

*Note : Vous pouvez créer eric-normal.png en copiant eric-cat.png*

#### Modification 3 : PDFs (lignes ~1535-1540)

**AVANT** :
```javascript
if (currentLang === 'fr') {
    downloadLink.href = 'https://drive.google.com/uc?export=download&id=1m2gYO3lF9H9zKT0QXNhMc-ugcgWkHnD0';
} else {
    downloadLink.href = 'https://drive.google.com/uc?export=download&id=1yTQXDdlkjcYsX4RUXXIh9Wzwld-OXJaE';
}
```

**APRÈS** :
```javascript
if (currentLang === 'fr') {
    downloadLink.href = 'assets/pdf/CV_Samir_Medjaher_FR.pdf';
    downloadLink.download = 'CV_Samir_Medjaher_FR.pdf';
} else {
    downloadLink.href = 'assets/pdf/CV_Samir_Medjaher_EN.pdf';
    downloadLink.download = 'CV_Samir_Medjaher_EN.pdf';
}
```

### Étape 4 : Sauvegarder et tester

1. Sauvegarder `index.html`
2. Ouvrir `index.html` dans votre navigateur
3. Vérifier que :
   - ✅ L'image d'Éric s'affiche
   - ✅ Le téléchargement des PDFs fonctionne

### Étape 5 : Committer et pusher

```bash
git add assets/ index.html
git commit -m "🐛 Fix: Remplace Google Drive par assets locaux - Corrige ERR_BLOCKED_BY_ORB"
git push origin main
```

### Étape 6 : Vérifier GitHub Pages

Attendre 2-3 minutes puis visiter :
https://duperopope.github.io/SamirMedjaher/

---

## ✅ Checklist de Validation

Après la correction, vérifiez que :

- [ ] Le CV s'affiche correctement
- [ ] L'image d'Éric (Tamagotchi) est visible
- [ ] Cliquer sur Éric fonctionne (mode gaming)
- [ ] Le téléchargement du PDF FR fonctionne
- [ ] Le téléchargement du PDF EN fonctionne
- [ ] Aucune erreur dans la console du navigateur (F12)
- [ ] Le site fonctionne sur GitHub Pages

---

## 🆘 En Cas de Problème

### Problème 1 : Le script ne s'exécute pas

**Solution** :
```bash
chmod +x fix-assets.sh
./fix-assets.sh
```

### Problème 2 : Impossible de télécharger depuis Google Drive

**Solution** :
Utiliser des images temporaires (déjà dans le script) ou fournir vos propres images.

### Problème 3 : Les modifications ne s'appliquent pas sur GitHub Pages

**Solutions** :
1. Attendre 5-10 minutes (cache GitHub)
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier que le commit a bien été poussé : `git log --oneline -1`

### Problème 4 : Les PDFs ne se téléchargent pas

**Vérification** :
```bash
# Vérifier que les PDFs existent
ls -lh assets/pdf/

# Taille des fichiers > 0 ?
```

Si la taille est 0, remplacez par vos vrais PDFs.

---

## 📞 Support

Si vous rencontrez des difficultés :

1. **Vérifier les logs** :
   ```bash
   git status
   git log --oneline -5
   ```

2. **Restaurer la sauvegarde** (si besoin) :
   ```bash
   cp index.html.backup.* index.html
   ```

3. **Demander de l'aide** :
   - Fournir les erreurs exactes de la console
   - Indiquer l'étape où ça bloque
   - Partager les logs git

---

## 🎉 Après la Correction

Une fois tout fonctionnel :

1. ✅ Votre CV est **100% autonome** (pas de dépendances externes)
2. ✅ **Plus rapide** (assets locaux)
3. ✅ **Plus fiable** (pas d'erreur CORB)
4. ✅ **Meilleure expérience** utilisateur

### Prochaines améliorations (optionnelles)

- 📝 Modulariser le code (séparer CSS/JS)
- 🧪 Ajouter des tests
- 🚀 Migration vers Hono + Cloudflare (voir ANALYSE_PROJET.md)

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- [RAPPORT_DIAGNOSTIC.md](RAPPORT_DIAGNOSTIC.md) - Diagnostic technique complet
- [ANALYSE_PROJET.md](ANALYSE_PROJET.md) - Analyse approfondie du projet
- [README.md](README.md) - Vue d'ensemble du projet

---

**Temps total estimé** : ⏱️ 10-30 minutes

**Niveau de difficulté** : ⭐️ Facile

**Besoin d'aide ?** Je suis là pour vous guider ! 🚀

---

*Guide créé le 31 octobre 2025*  
*Assistant IA Full Stack*
