# 🧠 RÈGLES PROJET CV - MÉMOIRE SYSTÈME

## 🚨 RÈGLES CRITIQUES - À RESPECTER ABSOLUMENT

### 🔒 **MAIN BRANCH = COMMITS INTERDITS**
- **COMMITS INTERDITS** : 
  - `cv.html` ❌ (pas de commit)
  - `README.md` ❌ (pas de commit)
  - Tout fichier racine ❌ (pas de commit)
- **MODIFICATIONS OK** : On peut modifier pour tests ✅
- **POURQUOI** : Main = version stable production
- **SÉCURITÉ** : Si on plante l'alpha, git checkout pour revenir

### 🔬 **RD BRANCH = ZONE DE DÉVELOPPEMENT**
- **FICHIERS AUTORISÉS** :
  - `RD/` ✅ (tout le dossier)
  - `RD/README_RD.md` ✅
  - `RD/main_project_copy/` ✅
  - Nouveaux outils RD ✅
- **POURQUOI** : Zone R&D pour expérimentations

### ⏳ **MERGE = PLUS TARD**
- **ÉTAT ACTUEL** : Loin du merge
- **FOCUS** : Développement RD uniquement
- **PAS DE STRESS** : Main reste stable

---

## 🎯 **WORKFLOW RD CORRECT**

### ✅ **BON PROCESSUS :**
```bash
# 1. Toujours travailler sur RD
git checkout RD-development

# 2. Modifier SEULEMENT les fichiers RD/
# RD/main_project_copy/indexRD.html ✅
# RD/README_RD.md ✅
# RD/system_tester.js ✅

# 3. Commit et push RD
git add RD/
git commit -m "RD: modifications"
git push origin RD-development
```

### ❌ **PROCESSUS INTERDIT :**
```bash
# JAMAIS toucher à main
git add README.md ❌
git add cv.html ❌
# JAMAIS modifier racine ❌
```

---

## 🔧 **OUTILS DE MÉMOIRE**

### 📝 **Checklist avant commit :**
- [ ] Je suis sur branche RD-development ?
- [ ] Je modifie SEULEMENT des fichiers RD/ ?
- [ ] Je ne touche PAS à main/README.md ?
- [ ] Mon commit concerne uniquement RD ?

### 🚦 **Commandes de sécurité :**
```bash
# Vérifier la branche
git branch --show-current

# Vérifier les fichiers modifiés  
git status

# Si erreur : annuler
git reset --hard HEAD
```

---

## 📊 **ÉTAT ACTUEL PROJET**

### 🎯 **VERSION ACTUELLE :**
- **Main** : v1.2 (HUD Revolution) - STABLE ✅
- **RD** : v1.3 (Mobile First Revolution) - DEV 🔬

### 🗂️ **STRUCTURE FICHIERS :**
```
CV/
├── cv.html                    # ❌ INTERDIT
├── README.md                  # ❌ INTERDIT  
└── RD/                        # ✅ ZONE LIBRE
    ├── README_RD.md           # ✅ NOTRE DOC
    ├── main_project_copy/     # ✅ NOTRE CODE
    ├── system_tester.js       # ✅ NOS TESTS
    └── responsive_test.js     # ✅ NOS OUTILS
```

---

## 💾 **SAUVEGARDE DE CES RÈGLES**

Ce fichier DOIT être consulté avant chaque modification !

**Date création :** 2025-07-23  
**Statut :** RÈGLES PERMANENTES  
**Mise à jour :** À chaque erreur système identifiée

---

⚠️ **RAPPEL CONSTANT :** MAIN = INTOUCHABLE | RD = LIBRE ⚠️
