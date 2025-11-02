# 📌 Système de Versioning Automatique

## 🎯 Version Actuelle: **v0.2**

Le CV Gaming utilise un système de versioning automatique avec incréments de **0.01** par mise à jour.

---

## 📂 Fichiers Impliqués

```
webapp/
├── VERSION.json            # Source de vérité pour la version
├── bump-version.sh         # Script pour incrémenter automatiquement
├── index.html              # Affiche la version dans le footer
└── design-system.css       # Styles du footer version
```

---

## 🚀 Comment Mettre à Jour la Version

### Méthode 1: Automatique avec Script ⭐ RECOMMANDÉ

```bash
# Incrémenter de 0.01 avec description
./bump-version.sh "Fix: Correction bug reset 10 clics"

# Le script fait automatiquement:
# - Lit VERSION.json (v0.2)
# - Calcule next version (v0.21)
# - Met à jour VERSION.json
# - Ajoute l'entrée au changelog
# - Affiche les commandes git à exécuter
```

**Ensuite:**
```bash
git add VERSION.json
git commit -m "chore: v0.21 - Fix: Correction bug reset 10 clics"
git push origin main
```

### Méthode 2: Manuelle (Édition JSON)

1. **Ouvrir** `VERSION.json`
2. **Modifier** `"current"` de `"0.2"` → `"0.21"`
3. **Modifier** `"lastUpdate"` avec la date actuelle `"2025-11-03"`
4. **Ajouter** une entrée dans `"changelog"`:
   ```json
   {
     "version": "0.21",
     "date": "2025-11-03",
     "changes": [
       "🐛 Fix: Correction bug reset 10 clics"
     ]
   }
   ```
5. **Commit & Push**:
   ```bash
   git add VERSION.json
   git commit -m "chore: v0.21"
   git push origin main
   ```

---

## 📊 Système de Numérotation

### Format: `MAJOR.MINOR`

```
0.1  → Version initiale
0.2  → Refactoring UI complet (13 tâches)
0.21 → Prochaine petite mise à jour
0.3  → Prochaine mise à jour moyenne
1.0  → Version majeure (production finale)
```

### Quand Incrémenter:

| Type de Changement | Incrément | Exemple |
|-------------------|-----------|---------|
| **Bugfix mineur** | +0.01 | 0.2 → 0.21 |
| **Nouvelle fonctionnalité petite** | +0.01 | 0.2 → 0.21 |
| **Refactoring partiel** | +0.1 | 0.2 → 0.3 |
| **Nouvelle fonctionnalité majeure** | +0.1 | 0.2 → 0.3 |
| **Release production** | +1.0 | 0.9 → 1.0 |

---

## 🎨 Affichage dans le Footer

Le footer affiche automatiquement la version depuis `VERSION.json` :

```html
<!-- Footer automatique -->
<footer class="cv-footer">
    <div class="version-info">
        <span class="version-number">v0.2</span>
        <span class="version-separator">•</span>
        <span class="last-update">Dernière mise à jour: 2025-11-02</span>
    </div>
</footer>
```

**Script de chargement automatique:**
```javascript
async function loadVersion() {
    const response = await fetch('VERSION.json');
    const versionData = await response.json();
    document.getElementById('appVersion').textContent = versionData.current;
    document.getElementById('lastUpdate').textContent = versionData.lastUpdate;
}
```

---

## 📜 Changelog Complet

### **v0.2** (2025-11-02) - Refactoring UI Complet
✅ UI refactoring complet (13/13 tâches)  
🐛 Fix: Reset 10 clics avec détection pause  
🐛 Fix: Gaming Dashboard auto-open avec retry  
🐛 Fix: Bouton FR/EN border-radius circulaire  
🎨 Design-system.css créé avec variables CSS  
🎮 Menu contextuel Tamagotchi (4 options)  
📚 Documentation: Z-INDEX-HIERARCHY.md  
📦 Plan: MODULARIZATION_PLAN.md  
🏗️ Architecture scalable et production-ready

### **v0.1** (2025-10-30) - Version Initiale
🎉 Version initiale  
🎮 Gaming mode avec achievements  
🐱 Tamagotchi Éric intégré  
🏪 Boutique avec skins/boosters  
📊 Gaming Dashboard v2.0  
🎯 Mini-jeux avancés  
🌐 Multilingue FR/EN  
🎨 Personnalisation couleurs

---

## 🛠️ Dépendances du Script

Le script `bump-version.sh` nécessite:
- `jq` (JSON processor)
- `bc` (Calculator pour incréments décimaux)

**Installation si manquant:**
```bash
# macOS
brew install jq bc

# Ubuntu/Debian
sudo apt-get install jq bc

# Arch Linux
sudo pacman -S jq bc
```

---

## 📝 Exemples d'Utilisation

### Exemple 1: Bugfix
```bash
./bump-version.sh "Fix: Correction affichage mobile"
# v0.2 → v0.21
```

### Exemple 2: Nouvelle fonctionnalité
```bash
./bump-version.sh "Feat: Ajout système de notifications push"
# v0.21 → v0.22
```

### Exemple 3: Refactoring
```bash
./bump-version.sh "Refactor: Séparation CSS en modules"
# v0.22 → v0.23
```

### Exemple 4: Release majeure (manuelle)
Éditer manuellement `VERSION.json`:
```json
{
  "current": "1.0",
  "lastUpdate": "2025-12-01",
  "changelog": [
    {
      "version": "1.0",
      "date": "2025-12-01",
      "changes": [
        "🎉 Release production v1.0",
        "✅ Tous les tests passés",
        "📱 Mobile responsive parfait",
        "🚀 Performance optimisée",
        "🔒 Sécurité renforcée"
      ]
    }
  ]
}
```

---

## ✅ Checklist Avant Commit

Avant chaque mise à jour de version:

- [ ] Tester localement toutes les fonctionnalités
- [ ] Vérifier console (pas d'erreurs)
- [ ] Tester mobile responsive
- [ ] Mettre à jour VERSION.json
- [ ] Ajouter description claire dans changelog
- [ ] Commit avec message conventionnel (`chore: v0.21 - Description`)
- [ ] Push vers GitHub
- [ ] Vérifier déploiement GitHub Pages

---

## 🔗 Liens Utiles

- **GitHub**: https://github.com/Duperopope/SamirMedjaher
- **GitHub Pages**: https://duperopope.github.io/SamirMedjaher/
- **Documentation**: Voir `UI_AUDIT_REFACTORING_PLAN.md`, `Z-INDEX-HIERARCHY.md`, `MODULARIZATION_PLAN.md`

---

**Créé**: 2025-11-02  
**Dernière mise à jour**: 2025-11-02  
**Statut**: Production-ready
