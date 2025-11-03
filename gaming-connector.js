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
 */
function feedEricFromDashboard() {
    console.log('🍔 Feeding Éric...');
    
    // Try different possible function names
    if (typeof feedEric === 'function') {
        feedEric();
        showNotification('🍔 Éric a été nourri !', 'success');
    } else if (typeof window.tamaSystem !== 'undefined' && typeof window.tamaSystem.feed === 'function') {
        window.tamaSystem.feed();
        showNotification('🍔 Éric a été nourri !', 'success');
    } else if (typeof tamaState !== 'undefined') {
        // Manual hunger increase
        if (tamaState.hunger < 100) {
            tamaState.hunger = Math.min(100, tamaState.hunger + 30);
            if (typeof saveTamaState === 'function') saveTamaState();
            showNotification('🍔 Éric a été nourri ! (+30 faim)', 'success');
        } else {
            showNotification('🍔 Éric n\'a pas faim !', 'info');
        }
    } else {
        showNotification('❌ Système temporairement indisponible', 'error');
        console.warn('Tamagotchi functions not found. Available:', Object.keys(window).filter(k => k.toLowerCase().includes('tama')));
    }
}

/**
 * Jouer avec Éric
 */
function playWithEricFromDashboard() {
    console.log('🎾 Playing with Éric...');
    
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
 */
function showNotification(message, type = 'info') {
    // Réutilise le système de notifications existant
    if (typeof showGameNotification !== 'undefined') {
        showGameNotification(message);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
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
    showNotification
};

console.log('✅ Gaming Connector v1.0 loaded!');
