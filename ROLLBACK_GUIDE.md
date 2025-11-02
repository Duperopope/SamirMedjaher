# 🔄 Rollback Guide - CV Gaming

## Quick Rollback to v0.22 (Stable)

Si la v0.23 cause des problèmes, voici comment revenir à la v0.22 stable :

### Option 1: Git Reset (Recommandé)

```bash
cd /home/user/webapp

# Revenir à v0.22
git reset --hard v0.22-stable

# Ou par commit hash
git reset --hard df9567d

# Redémarrer le serveur
fuser -k 3000/tcp 2>/dev/null || true
python3 -m http.server 3000 > /tmp/webapp.log 2>&1 &
```

### Option 2: Git Revert (Garder historique)

```bash
cd /home/user/webapp

# Créer un nouveau commit qui annule v0.23
git revert 38bd326 7479c4d --no-edit

# Redémarrer le serveur
fuser -k 3000/tcp 2>/dev/null || true
python3 -m http.server 3000 > /tmp/webapp.log 2>&1 &
```

### Option 3: Checkout spécifique

```bash
cd /home/user/webapp

# Créer une branche de sauvegarde
git branch backup-v0.23

# Revenir à v0.22
git checkout v0.22-stable

# Si satisfait, merger dans main
git checkout main
git reset --hard v0.22-stable
```

## Vérification après Rollback

```bash
# Check version
cat VERSION.json | grep current

# Check server
curl http://localhost:3000 | grep appVersion

# Check git log
git log --oneline -3
```

## Tags disponibles

- `v0.22-stable` (df9567d) - Version stable avant v0.23
- Commits:
  - `7479c4d` - v0.23 docs
  - `38bd326` - v0.23 code changes
  - `df9567d` - v0.22 stable ✅

## Debug Info

Si rollback ne résout pas le problème, check:

```bash
# Console browser pour erreurs JS
# F12 → Console

# Check fichiers chargés
ls -la /home/user/webapp/*.js
ls -la /home/user/webapp/*.css

# Vérifier intégrité HTML
grep -c "<!DOCTYPE html>" index.html  # devrait être 1
grep -c "</html>" index.html           # devrait être 1
```

## Contact

Si problème persiste après rollback, fournir:
1. Screenshot du bug
2. Console JavaScript errors (F12)
3. Description précise du comportement
