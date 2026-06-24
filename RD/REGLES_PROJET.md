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

### ⚠️ **ERREURS RÉCURRENTES À ÉVITER :**

#### 🚨 **CMD + GIT COMMIT MULTILINE = ÉCHEC**
```bash
# ❌ INTERDIT - CMD Windows  
git commit -m "Ligne 1
✅ Ligne 2
- Ligne 3"
# CMD essaie d'exécuter ✅ et - comme commandes !

# ✅ SOLUTION - Message simple
git commit -m "RD v1.3: Mobile First Revolution + AI Control System"

# ✅ ou Fichier temporaire
echo "Message long..." > commit_msg.txt
git commit -F commit_msg.txt
del commit_msg.txt
```

#### 🧠 **MÉMORISATION ERREURS :**
- **Erreur** : Messages commit multiligne sur CMD Windows
- **Symptôme** : "n'est pas reconnu en tant que commande"
- **Cause** : CMD interprète chaque ligne comme commande
- **Solution** : Messages courts ou fichier temporaire
- **Évolution** : Documenter dans règles pour éviter répétition

### � **ERREUR CRITIQUE NOUVELLE - TERMINAL POLLUTION**

#### ⚠️ **TERMINAL CMD CORROMPU DÉTECTÉ**
- **SYMPTÔMES CRITIQUES** :
  - `'ou' n'est pas reconnu en tant que commande`
  - `'-' n'est pas reconnu en tant que commande`  
  - `'Enumerating' n'est pas reconnu en tant que commande`
  - **TOUS LES MOTS** interprétés comme commandes
- **CAUSE** : Terminal CMD pollué/corrompu ou PATH système endommagé
- **DANGER** : ⚠️ **BLOQUE TOUS LES COMMITS ET OPÉRATIONS GIT**
- **SOLUTIONS URGENTES** :
```bash
# 1. IMMÉDIATE : Fermer/rouvrir terminal
exit
# Nouveau CMD ou PowerShell

# 2. ALTERNATIVE : PowerShell
powershell
cd G:\Code\CV

# 3. URGENCE : Vérifier PATH système
echo %PATH%
# Si PATH corrompu → Réparer variables environnement
```

#### 🧠 **APPRENTISSAGE SYSTÈME** :
- **Type erreur** : `terminal_corruption`  
- **Fréquence** : Critique mais rare
- **Prévention** : Surveiller pollution terminal
- **Auto-correction** : Impossible - action manuelle requise
- **Status** : 🚨 **ERREUR BLOQUANTE IDENTIFIÉE**

### �🔄 **SURVEILLANCE CONTINUE OBLIGATOIRE**

#### 🔍 **Système de Surveillance 24/7**
- **PROBLÈME** : Le chaos peut revenir sans surveillance
- **SOLUTION** : Surveillance continue automatisée avec seuils
- **OUTILS** : 
  - `continuous_surveillance.js` : Vérifications temps réel
  - `automated_surveillance.js` : Surveillance daemon 24/7  
  - `start_surveillance.bat` : Lancement facile Windows
- **SEUILS** : 
  - 20 fichiers = ALERTE (nettoyage recommandé)
  - 30 fichiers = CHAOS CRITIQUE (auto-cleanup)
- **FRÉQUENCE** : 
  - Check rapide : 5 minutes
  - Check complet : 30 minutes
  - Maintenance : quotidienne
- **AUTO-ACTIONS** : Nettoyage automatique si chaos détecté

#### ⚙️ **Commandes Surveillance**
```bash
# Check unique
node continuous_surveillance.js

# Surveillance continue daemon
node automated_surveillance.js --daemon

# Lancement Windows facile
start_surveillance.bat
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
