# CV Interactif - Samir Medjaher 🎮

Un CV interactif moderne avec système de gamification avancé, développé en HTML/CSS/JavaScript pur.

## 🌟 Fonctionnalités Principales

### 💼 CV Professionnel
- **Interface bilingue** (Français/Anglais) avec commutation fluide
- **Design responsive** adaptatif à tous les écrans
- **Système de thèmes** personnalisables avec palette de couleurs
- **Effets de particules** configurables et animés
- **Portfolio vidéo** avec player YouTube intégré
- **Téléchargement PDF** du CV selon la langue sélectionnée

### 🎮 Système de Gamification (v1.1)

#### Mode Gaming Débloquable
- **Déblocage secret** : Cliquez 3 fois sur la photo de profil
- **HUD de jeu** avec score, XP, niveau et succès
- **Tamagotchi intégré** : "Éric" votre compagnon virtuel

#### Système de Succès Centralisé (18+ Achievements)
- **Gaming & Progression** : Niveaux, scores, déblocages
- **Contact & Social** : Email, GitHub, téléchargement PDF
- **Portrait & Lecture** : Dialogues complets, interactions répétées
- **Changement de Langue** : Messages spéciaux pour commutations rapides
- **Exploration Skills** : Découverte des compétences techniques
- **Portfolio** : Visionnage complet des vidéos
- **Personnalisation** : Thèmes et particules
- **Soins Tamagotchi** : Nourrir et faire évoluer Éric

#### Messages Intelligents
- **Dialogues portrait** avec rotation intelligente
- **Messages de bienvenue** différenciés première visite/retour
- **Réactions aux changements de langue** avec système de combo
- **Bulles de dialogue** positionnées dynamiquement

## 🚀 Mise à Jour v1.2 - "HUD Revolution"

### ✨ Nouvelles Fonctionnalités Majeures
- **Système de positionnement HUD complet** avec contrôles de précision
- **Interface de prévisualisation avancée** avec étiquettes contextuelles
- **Contrôles granulaires** pour tous les éléments gaming
- **Nouvelles positions par défaut optimisées** pour une meilleure UX
- **Presets de layouts** : Compact, Spacieux, avec sauvegarde automatique

### 🎯 Contrôles de Positionnement Intégrés
- **🐱 Éric (Tamagotchi)** : Position verticale/horizontale + taille (60-120px)
- **📊 Barre XP/HUD** : Position + échelle (70-130%)
- **📱 Zone Notifications** : Position verticale/horizontale personnalisable
- **🏆 Zone Achievements** : Positionnement précis avec étiquettes

### 🔧 Améliorations Techniques v1.2
- **Positions par défaut optimisées** :
  - Éric : 3.5rem bas, 2rem droite, 88px
  - HUD : 5rem bas, 2rem droite
  - Notifications : 11rem bas, 2rem droite
  - Achievements : 15.5rem bas, 1rem droite
- **Prévisualisation intelligente** avec étiquettes contextuelles
- **Sauvegarde automatique** de toutes les positions dans localStorage
- **Interface unifiée** dans l'onglet Gaming de la personnalisation

### 🎨 Système de Prévisualisation Avancé
- **Étiquettes dynamiques** : "🐱 Éric (Chat)", "📊 Barre XP/HUD"
- **Zones nommées** : "📱 Zone Notifications", "🏆 Zone Achievements"
- **Mode prévisualisation** avec overlay semi-transparent
- **Animation de pulsation** pour attirer l'attention sur les éléments

## 🚀 Mise à Jour v1.1 - "Achievement Revolution"

### ✨ Nouvelles Fonctionnalités
- **Système d'achievements entièrement centralisé** avec objet `ACHIEVEMENTS`
- **18+ nouveaux succès** couvrant toutes les interactions utilisateur
- **Tracking avancé** des compétences explorées et vidéos regardées
- **Persistance améliorée** avec Sets convertis en Arrays pour localStorage
- **Gestion des timers** optimisée pour les bulles de dialogue
- **Comptage dynamique** des achievements avec `calculateMaxAchievements()`

### 🔧 Améliorations Techniques
- **Architecture unifiée** : Fonction `unlockAchievement()` centralisée
- **Helpers de vérification** : `hasAchievement()`, `trackSkillHover()`, `trackVideoWatch()`
- **Intégration complète** : Tous les points d'interaction connectés au système
- **Résolution des bugs** : Timers de bulles, messages manquants, achievements perdus

### 🎯 Achievements Ajoutés
- **Core Gaming** : `gaming_unlocked`, `level_up_first`, `high_level`, `score_hunter`
- **Contact & Social** : `first_contact`, `github_explorer`, `pdf_downloader`
- **Portrait & Reading** : `portrait_all_read`, `portrait_addict`
- **Language Switching** : `jen_perds_mon_latin`, `faceclicker`, `philosophe`, `sagesse`
- **Skills & Learning** : `skill_explorer`, `skill_master`
- **Portfolio & Videos** : `video_watcher`, `portfolio_completionist`
- **Customization** : `theme_changer`, `particle_artist`
- **Tamagotchi** : `tama_feeder`, `tama_master`

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Animations** : CSS Transitions, Canvas API pour les particules
- **Persistance** : localStorage pour les données utilisateur
- **Intégrations** : YouTube API, Google Maps, EmailTo
- **Design** : Responsive Design, Mobile-First approach

## 🎨 Fonctionnalités Interactives

### Système de Particules Avancé
- **4 types** : Cercles, Étoiles, Triangles, formes personnalisées
- **5 mouvements** : Flottement, Spirale, Orbital, patterns avancés
- **Personnalisation** : Intensité, vitesse, taille, opacité
- **Presets** : Minimal, Classic, Dynamic, Cosmic

### Thèmes Visuels
- **6 thèmes prédéfinis** : Classic, Ocean, Forest, Sunset, Night, Purple
- **Couleurs personnalisées** : Sélecteur de couleurs intégré
- **Persistance** : Sauvegarde automatique des préférences

### Portfolio Interactif
- **Vidéos YouTube** intégrées avec overlay théâtral
- **Explanations dynamiques** avec effet machine à écrire
- **Navigation fluide** avec carrousel responsive

## 🚦 Installation & Utilisation

### Déploiement Simple
```bash
# Cloner le repository
git clone https://github.com/Duperopope/SamirMedjaher.git

# Ouvrir le fichier
# Simplement ouvrir cv.html dans un navigateur web moderne
```

### Fonctionnement
1. **Mode Normal** : CV professionnel classique
2. **Mode Gaming** : Cliquer 3x sur la photo pour débloquer
3. **Exploration** : Interagir avec tous les éléments pour débloquer des achievements
4. **Personnalisation** : Utiliser les outils de thème et particules
5. **🆕 Positionnement HUD** : Onglet Gaming > Prévisualiser > Ajuster les positions

### 🎮 Guide d'Utilisation HUD (v1.2)

#### Accès aux Contrôles
1. Ouvrir le **panneau de personnalisation** (icône palette)
2. Aller dans l'onglet **"Gaming"** 
3. Cliquer sur **"Prévisualiser"** pour voir tous les éléments HUD
4. Utiliser les **sliders** pour ajuster les positions en temps réel

#### Contrôles Disponibles
- **Position Éric** : Vertical (1-10rem) + Horizontal (1-10rem) + Taille (60-120px)
- **Position HUD** : Vertical (5-20rem) + Horizontal (1-10rem) + Échelle (70-130%)
- **Position Notifications** : Vertical (3-15rem) + Horizontal (1-10rem)
- **Position Achievements** : Vertical (8-20rem) + Horizontal (0-8rem)

#### Presets Rapides
- **Reset** : Positions par défaut optimisées
- **Layout Compact** : Interface resserrée pour petits écrans
- **Layout Spacieux** : Interface élargie pour grands écrans

#### Fonctionnalités Avancées
- **Sauvegarde automatique** : Toutes les positions sont persistées
- **Prévisualisation en temps réel** : Changements instantanés
- **Étiquettes contextuelles** : Identification claire de chaque élément
- **Mode overlay** : Prévisualisation non-intrusive avec z-index optimisé

## 📊 Statistiques de Développement

- **Lignes de code** : ~3200+ lignes
- **Fonctions JavaScript** : 60+ fonctions
- **Système d'achievements** : 18+ succès uniques
- **Contrôles HUD** : 10 paramètres ajustables
- **Langues supportées** : Français, Anglais
- **Responsive breakpoints** : Mobile, Tablet, Desktop

## 🤝 Contact

- **Email** : s.medjaher@gmail.com
- **GitHub** : [Duperopope](https://github.com/Duperopope)
- **LinkedIn** : [Samir Medjaher](https://www.linkedin.com/in/samir-medjaher/)

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔄 Changelog

### v1.2.0 (2025-07-23) - "HUD Revolution"
- ✅ Système de positionnement HUD complet et précis
- ✅ Contrôles granulaires pour tous les éléments gaming
- ✅ Prévisualisation avancée avec étiquettes contextuelles
- ✅ Nouvelles positions par défaut optimisées
- ✅ Presets de layouts (Compact/Spacieux) avec sauvegarde automatique
- ✅ Interface unifiée dans l'onglet Gaming
- ✅ Support complet des positions horizontales et verticales

### v1.1.0 (2025-07-22) - "Achievement Revolution"
- ✅ Système d'achievements centralisé complet
- ✅ 18+ nouveaux succès avec tracking avancé
- ✅ Résolution des bugs de timers et messages
- ✅ Architecture unifiée et optimisée
- ✅ Persistance améliorée avec Sets/Arrays

### v1.0.0 (2024) - "Release Initiale"
- 🎉 CV interactif avec gamification
- 🎮 Mode gaming avec Tamagotchi
- 🌍 Support bilingue FR/EN
- 🎨 Système de thèmes et particules
- 📱 Design responsive complet

---

*Développé avec ❤️ par Samir Medjaher*
