#!/bin/bash
# Script pour mettre à jour la version partout automatiquement
# Usage: ./update-version.sh 0.43

if [ -z "$1" ]; then
    echo "❌ Usage: ./update-version.sh <new_version>"
    echo "   Example: ./update-version.sh 0.43"
    exit 1
fi

NEW_VERSION="$1"
DATE=$(date +%Y-%m-%d)

echo "🔄 Mise à jour vers v${NEW_VERSION}..."

# 1. Mettre à jour VERSION.json
echo "📝 Updating VERSION.json..."
jq --arg ver "$NEW_VERSION" --arg date "$DATE" \
   '.current = $ver | .lastUpdate = $date | .nextVersion = ($ver | tonumber + 0.01 | tostring)' \
   VERSION.json > VERSION.json.tmp && mv VERSION.json.tmp VERSION.json

# 2. Mettre à jour CURRENT_VERSION dans index.html
echo "📝 Updating CURRENT_VERSION in index.html..."
sed -i "s/const CURRENT_VERSION = '[0-9.]*'/const CURRENT_VERSION = '${NEW_VERSION}'/" index.html

# 3. Mettre à jour tous les ?v= dans index.html
echo "📝 Updating all ?v= parameters in index.html..."
sed -i "s/\\.js?v=[0-9.]*/\.js?v=${NEW_VERSION}/g" index.html
sed -i "s/\\.css?v=[0-9.]*/\.css?v=${NEW_VERSION}/g" index.html

echo "✅ Version mise à jour vers v${NEW_VERSION}"
echo "📋 Fichiers modifiés:"
echo "   - VERSION.json (current: ${NEW_VERSION}, date: ${DATE})"
echo "   - index.html (CURRENT_VERSION + all ?v= parameters)"
echo ""
echo "🔧 Prochaines étapes:"
echo "   1. git add -A"
echo "   2. git commit -m \"v${NEW_VERSION}: [Description]\""
echo "   3. git push origin main"
