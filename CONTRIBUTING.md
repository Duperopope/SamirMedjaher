# Guide de Contribution 🤝

Merci de votre intérêt pour contribuer au CV Interactif de Samir Medjaher !

## 🚀 Démarrage Rapide

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Ouvrir** `cv.html` dans un navigateur
4. **Tester** vos modifications
5. **Commit** et **Push** vos changements
6. **Créer** une Pull Request

## 🎯 Types de Contributions

### 🐛 Corrections de Bugs
- Identifier le problème dans les issues
- Reproduire le bug localement
- Corriger et tester la solution
- Documenter la correction

### ✨ Nouvelles Fonctionnalités
- **Achievements** : Ajouter de nouveaux succès dans l'objet `ACHIEVEMENTS`
- **Thèmes** : Créer de nouvelles palettes de couleurs
- **Particules** : Développer de nouveaux types d'animations
- **Langues** : Ajouter une nouvelle langue (ES, DE, IT...)

### 📝 Documentation
- Améliorer le README
- Ajouter des commentaires dans le code
- Créer des guides d'utilisation
- Traduire la documentation

## 🏗️ Architecture du Code

### Structure Principale
```
cv.html
├── Head (Meta, CSS)
├── Body (HTML Structure)
└── Script (JavaScript Logic)
    ├── Classes (TypewriterEffect, AdvancedParticleSystem)
    ├── Data Objects (translations, skillsData, ACHIEVEMENTS)
    ├── Core Functions (init, update, game logic)
    └── Event Handlers
```

### Système d'Achievements
```javascript
// Ajouter un nouvel achievement
const ACHIEVEMENTS = {
    mon_achievement: {
        id: 'mon_achievement',
        title: 'Mon Titre',
        description: 'Ma description ! 🎉',
        icon: '🎉'
    }
};

// L'activer quelque part
unlockAchievement('mon_achievement');
```

### Conventions de Code
- **Variables** : camelCase (`gameStats`, `currentLang`)
- **Fonctions** : camelCase descriptif (`unlockAchievement`, `updateGameDisplay`)
- **Constants** : UPPER_CASE (`ACHIEVEMENTS`, `colorThemes`)
- **IDs HTML** : camelCase (`gameHUD`, `portraitDialogue`)

## 🎮 Ajout d'Achievements

### Étapes
1. **Définir** l'achievement dans `ACHIEVEMENTS`
2. **Identifier** le point de déclenchement
3. **Ajouter** `unlockAchievement('id')` au bon endroit
4. **Tester** le déclenchement
5. **Documenter** dans le CHANGELOG

### Exemple Complet
```javascript
// 1. Dans ACHIEVEMENTS
new_explorer: {
    id: 'new_explorer',
    title: 'Nouvel Explorateur',
    description: 'Vous avez découvert une section cachée ! 🗺️',
    icon: '🗺️'
}

// 2. Dans la fonction appropriée
function exploreHiddenSection() {
    // Logique de la fonction...
    
    if (gamingMode) {
        unlockAchievement('new_explorer');
    }
}
```

## 🌍 Ajout d'une Langue

### Étapes
1. **Ajouter** la langue dans `translations`
2. **Créer** les `portraitMessages`
3. **Ajouter** les `languageSwitchMessages`
4. **Mettre à jour** la logique de changement
5. **Tester** toutes les fonctionnalités

### Structure Required
```javascript
const translations = {
    // ... existing languages
    es: {
        // Toutes les clés existantes traduites
        welcome: "Bienvenido",
        // ... etc
    }
};

const portraitMessages = {
    // ... existing languages  
    es: [
        "¡Hola! Soy Samir...",
        // ... plus de messages
    ]
};
```

## 🎨 Nouveaux Thèmes

### Structure d'un Thème
```javascript
const colorThemes = {
    monTheme: {
        name: 'Mon Thème',
        primary: '#couleur1',
        secondary: '#couleur2', 
        accent: '#couleur3'
    }
};
```

## 🧪 Tests

### Tests Manuels Requis
- [ ] Mode normal fonctionne
- [ ] Déblocage gaming (3 clics portrait)
- [ ] Tous les achievements se débloquent
- [ ] Changements de langue
- [ ] Responsive design
- [ ] Persistance localStorage

### Navigateurs à Tester
- Chrome/Chromium
- Firefox  
- Safari
- Edge

## 📋 Pull Request Guidelines

### Titre
- Format : `[TYPE] Description courte`
- Types : `FEAT`, `FIX`, `DOCS`, `STYLE`, `REFACTOR`

### Description
```markdown
## Changements
- Liste des modifications

## Tests Effectués  
- [ ] Test 1
- [ ] Test 2

## Screenshots (si applicable)
[Captures d'écran]
```

## 🚫 Ce qu'il NE faut PAS faire

- Modifier la structure HTML sans raison
- Casser la compatibilité avec le localStorage existant
- Ajouter des dépendances externes
- Supprimer des achievements existants
- Modifier les traductions sans vérifier la cohérence

## 📞 Contact

Pour toute question :
- **Issues GitHub** pour les bugs/suggestions
- **Email** : s.medjaher@gmail.com pour les questions complexes

Merci de contribuer ! 🎉
