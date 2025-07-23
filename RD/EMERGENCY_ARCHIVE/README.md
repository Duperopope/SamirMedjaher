# Documentation du projet

## Objectifs
Ce projet vise à créer un site vitrine interactif hébergé sur GitHub Pages, avec les fonctionnalités suivantes :

1. **Landing Page bilingue** :
   - Traductions en anglais et français.
   - Navigation intuitive pour les professionnels et les clients.

2. **CV interactif pour les professionnels** :
   - Succès cachés et mini-jeux.
   - Téléchargement du CV.

3. **Jeux Unreal Engine pour les clients** :
   - Hébergement des jeux sur Google Drive.
   - Intégration via iframe.

4. **Cybersécurité** :
   - Protection contre les attaques XSS.
   - Hashage des mots de passe.

## Contraintes
- Hébergement gratuit sur GitHub Pages.
- Utilisation exclusive de Google Drive pour les ressources externes.
- Budget limité à 25 $ (Genspark + Copilot).
- Code maintenu dans un seul fichier HTML.

## Outils nécessaires
1. **GitHub Pages** : Hébergement gratuit.
2. **Google Drive** : Hébergement des fichiers volumineux.
3. **Copilot** : Génération de code optimisé.
4. **Terser et CSSNano** : Minification des fichiers.
5. **SHA-256 (crypto API)** : Hashage des mots de passe.
6. **JSON** : Gestion des traductions et des données utilisateur.

## Plan de développement
### Étape 1 : Configuration initiale
- Créer un dossier `RD` pour la documentation et les outils.
- Ajouter un fichier `README.md` pour centraliser les informations.

### Étape 2 : Outils de développement
- Automatisation avec GitHub Actions pour minifier les fichiers et déployer sur GitHub Pages.
- Scripts pour gérer les traductions et les données utilisateur.

### Étape 3 : Optimisation
- Implémenter la gestion de mémoire avec `localStorage` et `IndexedDB`.
- Réduire la taille des fichiers avec des outils de minification.

### Étape 4 : Tests et sécurité
- Valider les entrées utilisateur pour éviter les attaques XSS.
- Configurer une politique CSP pour sécuriser le site.

### Étape 5 : Déploiement
- Héberger le site sur GitHub Pages.
- Intégrer les jeux Unreal Engine via Google Drive.

# Research and Development (RD)

## Purpose
The RD folder is dedicated to experimentation, iterative development, and research. It serves as a sandbox for testing new ideas, implementing features, and documenting processes.

## Structure
- **memory_management.md**: Documentation and examples for optimizing memory usage.
- **active_development.yml**: GitHub Actions workflow for iterative development.
- **development-script.js**: Placeholder for automated development tasks.

## Guidelines
1. **Experiment Freely**:
   - Use this folder to test new approaches without constraints.
   - Document findings and lessons learned.

2. **Iterative Development**:
   - Implement features incrementally.
   - Use GitHub Actions to automate testing and deployment.

3. **Collaboration**:
   - Share insights and code with team members.
   - Use clear comments and logs for transparency.

4. **Testing and Validation**:
   - Validate all changes with automated tests.
   - Log errors and review them regularly.

## Notes
This folder is designed to be flexible and extensible, allowing for continuous improvement and innovation.
