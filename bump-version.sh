#!/bin/bash

# ============================================
# VERSION BUMPER SCRIPT
# Incrémente automatiquement la version de 0.01
# Usage: ./bump-version.sh "Description des changements"
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📌 CV Gaming Version Bumper${NC}"
echo ""

# Check if VERSION.json exists
if [ ! -f "VERSION.json" ]; then
    echo "❌ VERSION.json not found!"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(jq -r '.current' VERSION.json)
echo -e "Current version: ${YELLOW}v${CURRENT_VERSION}${NC}"

# Calculate next version
NEXT_VERSION=$(echo "$CURRENT_VERSION + 0.01" | bc)
NEXT_VERSION=$(printf "%.2f" $NEXT_VERSION)

echo -e "Next version: ${GREEN}v${NEXT_VERSION}${NC}"

# Get current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Get change description from argument
CHANGE_DESC="${1:-Minor updates and improvements}"

echo ""
echo -e "${BLUE}Changes to add:${NC}"
echo "  • $CHANGE_DESC"
echo ""

# Confirm
read -p "Proceed with version bump? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Create temporary file with updated version
jq --arg ver "$NEXT_VERSION" \
   --arg date "$CURRENT_DATE" \
   --arg change "$CHANGE_DESC" \
   '.current = $ver | 
    .lastUpdate = $date | 
    .changelog = [{
        version: $ver,
        date: $date,
        changes: [$change]
    }] + .changelog |
    .nextVersion = ($ver | tonumber + 0.01 | tostring)' \
   VERSION.json > VERSION.tmp && mv VERSION.tmp VERSION.json

echo ""
echo -e "${GREEN}✅ Version bumped to v${NEXT_VERSION}${NC}"
echo ""
echo "Next steps:"
echo "  1. git add VERSION.json"
echo "  2. git commit -m 'chore: bump version to v${NEXT_VERSION}'"
echo "  3. git push origin main"
echo ""
echo "Or use auto-commit:"
echo "  git add VERSION.json && git commit -m 'chore: v${NEXT_VERSION} - ${CHANGE_DESC}' && git push origin main"
