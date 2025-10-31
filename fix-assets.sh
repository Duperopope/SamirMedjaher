#!/bin/bash
# Script de correction automatique des assets
# Auteur: Assistant IA Full Stack
# Date: 31 Octobre 2025

set -e  # Arrêter en cas d'erreur

echo "🔧 Script de Correction des Assets - CV Interactif"
echo "=================================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Répertoire du projet
PROJECT_DIR="/home/user/webapp"
cd "$PROJECT_DIR"

# Étape 1 : Créer la structure de dossiers
echo -e "${BLUE}📁 Étape 1/5 : Création de la structure de dossiers${NC}"
mkdir -p assets/images
mkdir -p assets/pdf
echo -e "${GREEN}✅ Dossiers créés : assets/images/, assets/pdf/${NC}"
echo ""

# Étape 2 : Télécharger des images de remplacement (Flaticon CDN)
echo -e "${BLUE}🖼️ Étape 2/5 : Téléchargement d'images de remplacement (temporaire)${NC}"
echo -e "${YELLOW}⚠️ Ces images sont temporaires. Remplacez-les par vos propres assets si possible.${NC}"

# Télécharger des images de chats depuis un CDN libre
if command -v curl &> /dev/null; then
    echo "Téléchargement des images..."
    
    # Image principale (chat normal)
    curl -L -o "assets/images/eric-normal.png" \
        "https://cdn-icons-png.flaticon.com/128/1998/1998661.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-normal.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat affamé
    curl -L -o "assets/images/eric-hungry.png" \
        "https://cdn-icons-png.flaticon.com/128/1046/1046784.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-hungry.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat content (nourri)
    curl -L -o "assets/images/eric-fed.png" \
        "https://cdn-icons-png.flaticon.com/128/2620/2620074.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-fed.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat heureux
    curl -L -o "assets/images/eric-happy.png" \
        "https://cdn-icons-png.flaticon.com/128/1998/1998661.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-happy.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat triste
    curl -L -o "assets/images/eric-unhappy.png" \
        "https://cdn-icons-png.flaticon.com/128/1998/1998664.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-unhappy.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat endormi
    curl -L -o "assets/images/eric-sleeping.png" \
        "https://cdn-icons-png.flaticon.com/128/832/832229.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-sleeping.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat dans une boîte
    curl -L -o "assets/images/eric-boxed.png" \
        "https://cdn-icons-png.flaticon.com/128/616/616408.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-boxed.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Chat KO
    curl -L -o "assets/images/eric-ko.png" \
        "https://cdn-icons-png.flaticon.com/128/609/609803.png" 2>/dev/null && \
        echo -e "${GREEN}  ✓ eric-ko.png${NC}" || echo -e "${RED}  ✗ Échec${NC}"
    
    # Image principale pour le tag <img>
    cp "assets/images/eric-normal.png" "assets/images/eric-cat.png"
    echo -e "${GREEN}  ✓ eric-cat.png (copie de normal)${NC}"
    
    echo -e "${GREEN}✅ Images téléchargées dans assets/images/${NC}"
else
    echo -e "${RED}❌ curl n'est pas installé. Impossible de télécharger les images.${NC}"
    echo -e "${YELLOW}⚠️ Veuillez ajouter manuellement les images dans assets/images/${NC}"
fi
echo ""

# Étape 3 : Créer des placeholders PDF
echo -e "${BLUE}📄 Étape 3/5 : Création de placeholders pour les PDFs${NC}"
echo -e "${YELLOW}⚠️ Placez vos vrais PDFs dans assets/pdf/ (CV_Samir_Medjaher_FR.pdf et _EN.pdf)${NC}"
touch assets/pdf/CV_Samir_Medjaher_FR.pdf
touch assets/pdf/CV_Samir_Medjaher_EN.pdf
echo -e "${GREEN}✅ Placeholders PDF créés${NC}"
echo ""

# Étape 4 : Backup de index.html
echo -e "${BLUE}💾 Étape 4/5 : Sauvegarde de index.html${NC}"
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Backup créé${NC}"
echo ""

# Étape 5 : Modifier index.html
echo -e "${BLUE}✏️ Étape 5/5 : Modification de index.html${NC}"

# Message d'information
echo -e "${YELLOW}Les modifications suivantes seront appliquées :${NC}"
echo "  1. Remplacement de l'image Tamagotchi Google Drive par assets/images/eric-cat.png"
echo "  2. Remplacement des icônes tamaIcons par les assets locaux"
echo "  3. Remplacement des liens PDF Google Drive par assets/pdf/"
echo ""

# Confirmation
echo -e "${YELLOW}⚠️ Voulez-vous appliquer ces modifications ? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    # Modification 1 : Image principale du Tamagotchi
    sed -i 's|https://drive\.google\.com/uc?export=view&id=1J7Wgb9A6TOLLjGM5410RGXrE5CCftY23|assets/images/eric-cat.png|g' index.html
    echo -e "${GREEN}  ✓ Image Tamagotchi mise à jour${NC}"
    
    # Modification 2 : Icônes tamaIcons (ligne ~722-730)
    # Remplacer le bloc tamaIcons complet
    sed -i '/const tamaIcons = {/,/};/{
        /const tamaIcons = {/!{
            /};/!d
        }
    }' index.html
    
    # Insérer le nouveau bloc tamaIcons
    sed -i '/const tamaIcons = {/a\
        normal:   "assets/images/eric-normal.png",\
        hungry:   "assets/images/eric-hungry.png",\
        fed:      "assets/images/eric-fed.png",\
        happy:    "assets/images/eric-happy.png",\
        unhappy:  "assets/images/eric-unhappy.png",\
        sleeping: "assets/images/eric-sleeping.png",\
        boxed:    "assets/images/eric-boxed.png",\
        ko:       "assets/images/eric-ko.png"' index.html
    
    echo -e "${GREEN}  ✓ Icônes tamaIcons mises à jour${NC}"
    
    # Modification 3 : Liens PDF (lignes ~1535-1537)
    sed -i "s|'https://drive\.google\.com/uc?export=download&id=1m2gYO3lF9H9zKT0QXNhMc-ugcgWkHnD0'|'assets/pdf/CV_Samir_Medjaher_FR.pdf'|g" index.html
    sed -i "s|'https://drive\.google\.com/uc?export=download&id=1yTQXDdlkjcYsX4RUXXIh9Wzwld-OXJaE'|'assets/pdf/CV_Samir_Medjaher_EN.pdf'|g" index.html
    
    # Ajouter l'attribut download
    sed -i "s|downloadLink\.href = 'assets/pdf/CV_Samir_Medjaher_FR\.pdf'|downloadLink.href = 'assets/pdf/CV_Samir_Medjaher_FR.pdf';\n                downloadLink.download = 'CV_Samir_Medjaher_FR.pdf'|g" index.html
    sed -i "s|downloadLink\.href = 'assets/pdf/CV_Samir_Medjaher_EN\.pdf'|downloadLink.href = 'assets/pdf/CV_Samir_Medjaher_EN.pdf';\n                downloadLink.download = 'CV_Samir_Medjaher_EN.pdf'|g" index.html
    
    echo -e "${GREEN}  ✓ Liens PDF mis à jour${NC}"
    
    echo ""
    echo -e "${GREEN}✅ Toutes les modifications ont été appliquées !${NC}"
    echo ""
    echo -e "${BLUE}📝 Résumé des changements :${NC}"
    echo "  - assets/images/ créé avec 8 images"
    echo "  - assets/pdf/ créé avec 2 placeholders"
    echo "  - index.html modifié (backup disponible)"
    echo "  - Tous les liens Google Drive remplacés"
    echo ""
    echo -e "${YELLOW}⚠️ Actions restantes :${NC}"
    echo "  1. Remplacez les PDFs placeholders par vos vrais CVs dans assets/pdf/"
    echo "  2. (Optionnel) Remplacez les images par vos propres assets"
    echo "  3. Testez en ouvrant index.html dans un navigateur"
    echo "  4. Si tout fonctionne, committez et pushez :"
    echo ""
    echo -e "${GREEN}     git add assets/ index.html${NC}"
    echo -e "${GREEN}     git commit -m '🐛 Fix: Remplace Google Drive par assets locaux'${NC}"
    echo -e "${GREEN}     git push origin main${NC}"
    echo ""
    echo -e "${GREEN}🎉 Correction terminée avec succès !${NC}"
else
    echo -e "${RED}❌ Modification annulée.${NC}"
    echo "Aucune modification n'a été appliquée à index.html"
fi

echo ""
echo "=================================================="
echo "Script terminé."
