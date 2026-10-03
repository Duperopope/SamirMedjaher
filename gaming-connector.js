/**
 * 🔌 GAMING CONNECTOR
 * Version 1.0 - Connexion entre Dashboard et tous les systèmes gaming
 * 
 * Ce fichier fait le pont entre :
 * - gaming-dashboard.js (UI du dashboard)
 * - gaming-minigames-advanced.js (mini-jeux)
 * - tamagotchi-shop.js (boutique)
 * - tamagotchi-gameplay.js (coins, XP, gameplay)
 * - tamagotchi-enhanced.js (Éric le tamagotchi)
 */

console.log('🔌 Gaming Connector v1.0 loading...');

// ============================================
// MINI-GAMES INTEGRATION
// ============================================

/**
 * Ouvre un mini-jeu depuis le dashboard
 * @param {string} gameId - ID du jeu: 'memory', 'simon', 'reaction', 'coinrush'
 */
function openMinigame(gameId) {
    console.log(`🎮 Opening minigame: ${gameId}`);
    
    // Map des jeux disponibles
    const games = {
        'coinrush': () => {
            if (typeof CoinRush !== 'undefined') {
                // Créer modal de jeu
                showMinigameModal('Coin Rush', 'minigame-coinrush-container');
                CoinRush.init('minigame-coinrush-container');
            } else {
                showNotification('❌ Coin Rush not loaded', 'error');
            }
        },
        'memory': () => {
            if (typeof MemoryGame !== 'undefined') {
                showMinigameModal('Memory Match', 'minigame-memory-container');
                MemoryGame.init('minigame-memory-container');
            } else {
                showNotification('❌ Memory Game not loaded', 'error');
            }
        },
        'simon': () => {
            if (typeof SimonGame !== 'undefined') {
                showMinigameModal('Simon Says', 'minigame-simon-container');
                SimonGame.init('minigame-simon-container');
            } else {
                showNotification('❌ Simon Game not loaded', 'error');
            }
        },
        'reaction': () => {
            if (typeof ReactionGame !== 'undefined') {
                showMinigameModal('Reaction Time', 'minigame-reaction-container');
                ReactionGame.init('minigame-reaction-container');
            } else {
                showNotification('❌ Reaction Game not loaded', 'error');
            }
        }
    };
    
    if (games[gameId]) {
        games[gameId]();
    } else {
        showNotification(`❌ Game ${gameId} not found`, 'error');
    }
}

/**
 * Affiche une modal pour le mini-jeu
 */
function showMinigameModal(gameName, containerId) {
    const modal = document.createElement('div');
    modal.className = 'minigame-modal active';
    modal.innerHTML = `
        <div class="minigame-modal-overlay" onclick="closeMinigameModal()"></div>
        <div class="minigame-modal-content">
            <div class="minigame-modal-header">
                <h2>🎮 ${gameName}</h2>
                <button class="minigame-close-btn" onclick="closeMinigameModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="${containerId}" class="minigame-container"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Ferme la modal de mini-jeu
 */
function closeMinigameModal() {
    const modal = document.querySelector('.minigame-modal');
    if (modal) {
        modal.remove();
    }
}

// ============================================
// SHOP INTEGRATION
// ============================================

/**
 * Ouvre le shop complet dans une modal
 */
function openShopFromDashboard() {
    console.log('🛒 Opening shop...');
    if (typeof window.shopSystem !== 'undefined' && window.shopSystem.openShop) {
        window.shopSystem.openShop();
    } else {
        showNotification('❌ Shop system not loaded', 'error');
    }
}

/**
 * Achète un item depuis le dashboard
 */
function buyItemFromDashboard(itemId, category) {
    if (typeof window.shopSystem !== 'undefined' && window.shopSystem.buyItem) {
        window.shopSystem.buyItem(category, itemId);
    } else {
        showNotification('❌ Shop system not loaded', 'error');
    }
}

// ============================================
// ÉRIC TAMAGOTCHI INTEGRATION
// ============================================

/**
 * Nourrir Éric depuis le dashboard
 * Version v2.0 - Avec vérification d'inventaire et utilisation automatique du food
 */
function feedEricFromDashboard() {
    console.log('🍔 Feeding Éric...');
    
    // 1. Vérifier si le joueur a de la nourriture dans l'inventaire
    const gameState = (typeof window.gameplaySystem !== 'undefined') 
        ? window.gameplaySystem.gameState 
        : null;
    
    // Debug logs (décommenter si besoin de diagnostiquer)
    // console.log('📦 DEBUG gameState:', gameState);
    // console.log('📦 DEBUG inventory:', gameState?.inventory);
    // console.log('📦 DEBUG foods:', gameState?.inventory?.foods);
    
    if (!gameState || !gameState.inventory || !gameState.inventory.foods) {
        showNotification('❌ Système d\'inventaire non chargé', 'error');
        console.error('❌ gameState not properly loaded:', {
            hasGameplaySystem: typeof window.gameplaySystem !== 'undefined',
            hasGameState: !!gameState,
            hasInventory: !!gameState?.inventory,
            hasFoods: !!gameState?.inventory?.foods
        });
        return;
    }
    
    // 2. Trouver le premier item de nourriture disponible dans l'inventaire
    const availableFoods = Object.entries(gameState.inventory.foods).filter(([id, count]) => count > 0);
    // console.log('📦 DEBUG availableFoods:', availableFoods);
    
    if (availableFoods.length === 0) {
        // Pas de nourriture disponible
        showNotification('🚫 Vous n\'avez pas de nourriture !', 'error');
        setTimeout(() => {
            showNotification('💡 Achetez-en dans l\'onglet Shop 🛒', 'info');
        }, 1500);
        return;
    }
    
    // 3. Utiliser le premier item disponible
    const [foodId, currentCount] = availableFoods[0];
    
    // Trouver les détails de l'item dans le catalogue
    const SHOP_CATALOG = window.shopSystem?.SHOP_CATALOG || {
        food: [
            { id: 'burger', name: 'Burger Gourmet', icon: '🍔', effects: { hunger: 40, mood: 20 } },
            { id: 'pizza', name: 'Pizza Complète', icon: '🍕', effects: { hunger: 60, mood: 30 } },
            { id: 'sushi', name: 'Sushi Premium', icon: '🍣', effects: { hunger: 80, mood: 50, xp: 10 } },
            { id: 'cake', name: 'Gâteau Magique', icon: '🎂', effects: { hunger: 100, mood: 100, boost: true } }
        ]
    };
    
    const foodItem = SHOP_CATALOG.food.find(f => f.id === foodId);
    
    if (!foodItem) {
        showNotification('❌ Item introuvable dans le catalogue', 'error');
        return;
    }
    
    // 4. Vérifier si Éric a vraiment faim
    if (typeof tamaState !== 'undefined' && tamaState.hunger >= 100) {
        showNotification('🍔 Éric n\'a pas faim ! (Faim: 100%)', 'info');
        return;
    }
    
    // 5. Jouer l'animation de manger
    playEricAnimation('eating');
    
    // 6. Appliquer les effets du food item
    if (typeof tamaState !== 'undefined') {
        // Appliquer hunger
        if (foodItem.effects.hunger) {
            const oldHunger = tamaState.hunger || 50;
            tamaState.hunger = Math.min(100, oldHunger + foodItem.effects.hunger);
            const hungerGain = tamaState.hunger - oldHunger;
            console.log(`  ↗️ Hunger: ${oldHunger} → ${tamaState.hunger} (+${hungerGain})`);
        }
        
        // Appliquer mood
        if (foodItem.effects.mood) {
            const oldMood = tamaState.mood || 50;
            tamaState.mood = Math.min(100, oldMood + foodItem.effects.mood);
            const moodGain = tamaState.mood - oldMood;
            console.log(`  ↗️ Mood: ${oldMood} → ${tamaState.mood} (+${moodGain})`);
        }
        
        // Appliquer XP bonus
        if (foodItem.effects.xp && typeof window.gameplaySystem !== 'undefined') {
            window.gameplaySystem.addXP(foodItem.effects.xp, 'premium_food');
            console.log(`  ⭐ XP bonus: +${foodItem.effects.xp}`);
        }
        
        // Boost spécial du gâteau
        if (foodItem.effects.boost && typeof window.shopSystem !== 'undefined') {
            // Activer boost coins x2 pendant 10 min
            if (typeof window.shopSystem.activateBoost === 'function') {
                window.shopSystem.activateBoost('coinBoost', 600000);
                setTimeout(() => {
                    showNotification('🎂 Boost Coins x2 activé pendant 10 min !', 'epic');
                }, 1000);
            }
        }
        
        // Sauvegarder l'état du tamagotchi
        if (typeof saveTamaState === 'function') saveTamaState();
        
        // Rafraîchir l'affichage des stats
        refreshEricStats();
    }
    
    // 7. Décrémenter l'inventaire
    gameState.inventory.foods[foodId]--;
    const remainingCount = gameState.inventory.foods[foodId];
    
    // Sauvegarder gameState
    if (typeof window.gameplaySystem !== 'undefined' && typeof window.gameplaySystem.saveGameState === 'function') {
        window.gameplaySystem.saveGameState();
    }
    
    // 8. Notification de succès avec détails
    showNotification(
        `${foodItem.icon} ${foodItem.name} utilisé ! (${remainingCount} restant${remainingCount > 1 ? 's' : ''})`,
        'success'
    );
    
    // 9. Rafraîchir l'affichage du shop/inventaire si ouvert
    if (typeof window.shopSystem !== 'undefined' && typeof window.shopSystem.renderShopContent === 'function') {
        window.shopSystem.renderShopContent();
    }
    
    console.log(`✅ ${foodItem.name} utilisé avec succès ! Inventaire: ${remainingCount}`);
}

/**
 * Jouer avec Éric
 */
function playWithEricFromDashboard() {
    console.log('🎾 Playing with Éric...');
    
    // Play playing animation
    playEricAnimation('playing');
    
    if (typeof playWithTama === 'function') {
        playWithTama();
        showNotification('🎾 Éric s\'amuse !', 'success');
    } else if (typeof window.tamaSystem !== 'undefined' && typeof window.tamaSystem.play === 'function') {
        window.tamaSystem.play();
        showNotification('🎾 Éric s\'amuse !', 'success');
    } else if (typeof tamaState !== 'undefined') {
        // Manual mood increase
        if (tamaState.mood < 100) {
            tamaState.mood = Math.min(100, tamaState.mood + 20);
            if (typeof saveTamaState === 'function') saveTamaState();
            showNotification('🎾 Éric s\'amuse ! (+20 humeur)', 'success');
            
            // Update stats display
            refreshEricStats();
        } else {
            showNotification('🎾 Éric est déjà très heureux !', 'info');
        }
    } else {
        showNotification('❌ Système temporairement indisponible', 'error');
    }
}

/**
 * Câliner Éric
 */
function cuddleEricFromDashboard() {
    console.log('🤗 Cuddling Éric...');
    
    // Play cuddling animation
    playEricAnimation('cuddling');
    
    if (typeof cuddleEric === 'function') {
        cuddleEric();
        showNotification('🤗 Éric est heureux !', 'success');
    } else if (typeof window.tamaSystem !== 'undefined' && typeof window.tamaSystem.cuddle === 'function') {
        window.tamaSystem.cuddle();
        showNotification('🤗 Éric est heureux !', 'success');
    } else if (typeof tamaState !== 'undefined') {
        // Manual mood + hunger increase
        tamaState.mood = Math.min(100, (tamaState.mood || 50) + 15);
        tamaState.hunger = Math.min(100, (tamaState.hunger || 50) + 5);
        if (typeof saveTamaState === 'function') saveTamaState();
        showNotification('🤗 Éric est heureux ! (+15 humeur, +5 faim)', 'success');
        
        // Update stats display
        refreshEricStats();
    } else {
        showNotification('❌ Système temporairement indisponible', 'error');
    }
}

/**
 * Récupère l'état d'Éric pour l'afficher dans le dashboard
 */
function getEricState() {
    if (typeof tamaState !== 'undefined') {
        return {
            icon: tamaState.icon || '🐱',
            mood: tamaState.mood || 50,
            hunger: tamaState.hunger || 50,
            level: tamaState.level || 1,
            evolution: tamaState.evolution || 'baby'
        };
    }
    return null;
}

// ============================================
// INVENTORY INTEGRATION
// ============================================

/**
 * Utilise un item depuis l'inventaire
 */
function useInventoryItem(itemId, itemType) {
    console.log(`📦 Using item: ${itemId} (${itemType})`);
    
    if (typeof window.shopSystem !== 'undefined' && window.shopSystem.useItem) {
        window.shopSystem.useItem(itemType, itemId);
    } else {
        showNotification('❌ Inventory system not loaded', 'error');
    }
}

/**
 * Récupère l'inventaire complet
 */
function getInventory() {
    if (typeof gameState !== 'undefined' && gameState.inventory) {
        return gameState.inventory;
    }
    return { foods: {}, boosters: {}, skins: [] };
}

// ============================================
// LOOTBOX INTEGRATION
// ============================================

/**
 * Ouvre une lootbox
 */
function openLootboxFromDashboard(lootboxType = 'basic') {
    console.log(`🎁 Opening lootbox: ${lootboxType}`);
    
    if (typeof window.gamingDashboard !== 'undefined' && window.gamingDashboard.openLootbox) {
        window.gamingDashboard.openLootbox(lootboxType);
    } else {
        showNotification('❌ Lootbox system not loaded', 'error');
    }
}

// ============================================
// NOTIFICATION HELPER
// ============================================

/**
 * Affiche une notification temporaire
 * Version v2.0 - Utilise le système unifié
 */
function showNotification(message, type = 'info') {
    // Utiliser le système unifié si disponible
    if (typeof window.unifiedNotifications !== 'undefined' && window.unifiedNotifications.show) {
        window.unifiedNotifications.show(message, type);
    } else if (typeof showGameNotification !== 'undefined') {
        // Fallback sur l'ancien système
        showGameNotification(message);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ============================================
// ÉRIC ANIMATIONS
// ============================================

/**
 * Joue une animation visuelle sur Éric
 * @param {string} type - 'eating', 'playing', 'cuddling'
 */
function playEricAnimation(type) {
    const ericIcon = document.getElementById('ericIcon');
    const ericCharacter = document.getElementById('ericCharacter');
    const overlay = document.getElementById('ericAnimationOverlay');
    
    if (!ericIcon || !ericCharacter || !overlay) return;
    
    // Remove previous animations
    ericCharacter.classList.remove('eric-eating', 'eric-playing', 'eric-cuddling');
    overlay.innerHTML = '';
    
    // Animation configs
    const animations = {
        eating: {
            class: 'eric-eating',
            particles: ['🍔', '🍕', '🍣', '😋', '💚'],
            duration: 2000
        },
        playing: {
            class: 'eric-playing',
            particles: ['🎾', '⚽', '🎮', '😄', '⭐'],
            duration: 2500
        },
        cuddling: {
            class: 'eric-cuddling',
            particles: ['💕', '💖', '✨', '🤗', '😊'],
            duration: 2000
        }
    };
    
    const anim = animations[type];
    if (!anim) return;
    
    // Add animation class
    ericCharacter.classList.add(anim.class);
    
    // Create particle effects
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'eric-particle';
            particle.textContent = anim.particles[Math.floor(Math.random() * anim.particles.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            overlay.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }, i * 150);
    }
    
    // Remove animation class after duration
    setTimeout(() => {
        ericCharacter.classList.remove(anim.class);
    }, anim.duration);
}

/**
 * Rafraîchit l'affichage des stats d'Éric dans le dashboard
 */
function refreshEricStats() {
    // Get current stats
    const mood = (typeof tamaState !== 'undefined') ? (tamaState.mood || 50) : 50;
    const hunger = (typeof tamaState !== 'undefined') ? (tamaState.hunger || 50) : 50;
    
    // Update stat bars with animation
    const moodFill = document.querySelector('.stat-fill.mood');
    const hungerFill = document.querySelector('.stat-fill.hunger');
    
    if (moodFill) {
        moodFill.style.width = `${mood}%`;
        moodFill.parentElement.parentElement.querySelector('.stat-label span:last-child').textContent = `${mood}%`;
    }
    
    if (hungerFill) {
        hungerFill.style.width = `${hunger}%`;
        hungerFill.parentElement.parentElement.querySelector('.stat-label span:last-child').textContent = `${hunger}%`;
    }
}

// ============================================
// EXPOSE GLOBALLY
// ============================================

window.gamingConnector = {
    openMinigame,
    closeMinigameModal,
    openShopFromDashboard,
    buyItemFromDashboard,
    feedEricFromDashboard,
    playWithEricFromDashboard,
    cuddleEricFromDashboard,
    getEricState,
    useInventoryItem,
    getInventory,
    openLootboxFromDashboard,
    showNotification,
    playEricAnimation,
    refreshEricStats
};

console.log('✅ Gaming Connector v1.1 loaded!');
