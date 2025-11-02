# 📌 Système de Versioning - CV Gaming

**Version actuelle**: v0.21  
**Dernière mise à jour**: 2025-11-02

## 🎯 Convention de Versioning

Le projet utilise un système de versioning incrémental simple :

```
v0.XX
```

- **0** : Version majeure (beta/prototype)
- **XX** : Version mineure (+0.01 par update)

Exemples :
- `v0.1` → Version initiale
- `v0.2` → Refactorisation UI majeure
- `v0.21` → Bugfixes critiques
- `v0.22` → Prochaine version

## 📦 Fichiers du Système

### VERSION.json
Fichier principal contenant :
- `current` : Version actuelle
- `lastUpdate` : Date de dernière MAJ (YYYY-MM-DD)
- `changelog` : Historique des versions avec changements
- `nextVersion` : Version suivante calculée
- `autoIncrement` : Pas d'incrémentation (0.01)

### bump-version.sh
Script Bash pour incrémenter automatiquement la version.

**Prérequis** : `jq` (JSON processor)
```bash
# Installation sur Ubuntu/Debian
sudo apt install jq

# Installation sur macOS
brew install jq
```

## 🚀 Utilisation

### Méthode 1 : Script Automatique (Recommandé)

```bash
# Rendre le script exécutable (première fois)
chmod +x bump-version.sh

# Incrémenter la version avec description
./bump-version.sh "Description des changements"

# Exemple
./bump-version.sh "Fix: Correction bug header mobile"
```

Le script va :
1. ✅ Lire la version actuelle dans VERSION.json
2. ✅ Calculer la prochaine version (+0.01)
3. ✅ Demander confirmation
4. ✅ Mettre à jour VERSION.json avec nouveau changelog
5. ✅ Afficher les commandes git à exécuter

**Important** : Le script NE commit PAS automatiquement, il vous laisse contrôle.

### Méthode 2 : Manuelle

**Étape 1** : Éditer VERSION.json
```json
{
  "current": "0.22",  // Incrémenter de 0.01
  "lastUpdate": "2025-11-02",  // Date du jour
  "changelog": [
    {
      "version": "0.22",  // Nouvelle version
      "date": "2025-11-02",
      "changes": [
        "Description changement 1",
        "Description changement 2"
      ]
    },
    // ... anciennes versions
  ],
  "nextVersion": "0.23",  // Calculer +0.01
  "autoIncrement": 0.01
}
```

**Étape 2** : Commit et push
```bash
git add VERSION.json
git commit -m "chore: bump version to v0.22"
git push origin main
```

## 🔄 Workflow Git Recommandé

### Pour chaque mise à jour :

1. **Développer et tester les changements**
   ```bash
   # Faire vos modifications...
   git add .
   git commit -m "feat: Description des changements"
   ```

2. **Incrémenter la version**
   ```bash
   ./bump-version.sh "Description courte des changements"
   # Ou manuellement éditer VERSION.json
   ```

3. **Commit la version**
   ```bash
   git add VERSION.json
   git commit -m "chore: bump version to v0.XX"
   ```

4. **Push tout ensemble**
   ```bash
   git push origin main
   ```

### Ou en une seule commande :
```bash
# Après avoir fait ./bump-version.sh
git add VERSION.json && \
git commit -m "chore: v0.22 - Description changements" && \
git push origin main
```

## 📊 Affichage de la Version

La version s'affiche automatiquement dans le **footer** du CV :

```
v0.21 • Dernière mise à jour: 2025-11-02
```

Le footer charge automatiquement les données depuis `VERSION.json` via JavaScript :
```javascript
// Chargement automatique au DOMContentLoaded
loadVersion();  // Lit VERSION.json et met à jour le footer
```

**Fallback** : Si VERSION.json n'est pas accessible, valeurs hardcodées dans index.html :
```html
<span id="appVersion">0.21</span>
<span id="lastUpdate">2025-11-02</span>
```

## 🎨 Personnalisation du Footer

Le footer est stylisé dans `design-system.css` :

```css
.cv-footer {
    position: fixed;
    bottom: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    /* ... */
}
```

**Customisation** :
- Couleurs : Modifier les `rgba()` values
- Position : Changer `position: fixed` → `static` pour footer non-fixe
- Taille police : Ajuster `.version-info { font-size: ... }`

## 📜 Historique des Versions

### v0.21 (2025-11-02)
- 🐛 Fix: Bouton langue mobile responsive
- 🐛 Fix: Gaming mode charge correctement
- 🐛 Fix: Tamagotchi + HUD apparaissent
- 🎯 Footer version avec VERSION.json
- 📜 Script bump-version.sh créé

### v0.2 (2025-11-02)
- ✅ UI refactoring complet (13/13 tâches)
- 🐛 Fix: Reset 10 clics avec détection pause
- 🐛 Fix: Gaming Dashboard auto-open avec retry
- 🐛 Fix: Bouton FR/EN border-radius circulaire
- 🎨 Design-system.css créé avec variables CSS
- 🎮 Menu contextuel Tamagotchi (4 options)
- 📚 Documentation: Z-INDEX-HIERARCHY.md
- 📦 Plan: MODULARIZATION_PLAN.md

### v0.1 (2025-10-30)
- 🎉 Version initiale
- 🎮 Gaming mode avec achievements
- 🐱 Tamagotchi Éric intégré
- 🏪 Boutique avec skins/boosters
- 📊 Gaming Dashboard v2.0
- 🎯 Mini-jeux avancés
- 🌐 Multilingue FR/EN
- 🎨 Personnalisation couleurs

## 🔮 Prochaines Versions Planifiées

- **v0.22** : Optimisations performance
- **v0.23** : Nouveaux mini-jeux
- **v0.24** : Export statistiques gaming
- **v0.25** : Mode nuit/jour automatique
- **v0.3** : Refonte complète Gaming Dashboard

## ❓ FAQ

**Q: Pourquoi 0.XX et pas 1.XX ?**  
R: Le projet est en phase beta/prototype. Version 1.0 sera atteinte quand toutes les fonctionnalités planifiées seront stables.

**Q: Puis-je sauter des versions ?**  
R: Oui ! Si vous faites un gros update, vous pouvez passer de 0.21 → 0.25 par exemple. Respectez juste l'incrémentation cohérente.

**Q: Comment voir toutes les versions ?**  
R: `git log --oneline | grep "chore: bump version"` ou consulter le changelog dans VERSION.json

**Q: La version ne s'affiche pas dans le footer ?**  
R: Vérifiez la console navigateur (F12). Si VERSION.json n'est pas accessible, valeurs hardcodées sont utilisées.

## 🛠️ Maintenance

### Nettoyer l'historique
Si VERSION.json devient trop gros :

```javascript
// Garder seulement les 10 dernières versions
const changelog = versionData.changelog.slice(0, 10);
```

### Backup
Toujours garder une copie de VERSION.json avant modifications majeures :
```bash
cp VERSION.json VERSION.json.backup
```

---

**Créé** : 2025-11-02  
**Maintenu par** : Sam (@Duperopope)  
**Licence** : MIT
