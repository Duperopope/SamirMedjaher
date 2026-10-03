/**
 * 🏪 TAMAGOTCHI SHOP LOGIC
 * Gestion complète de la boutique : achats, inventaire, équipement
 */

// ============================================
// CATALOGUE SHOP
// ============================================

const SHOP_CATALOG = {
    food: [
        {
            id: 'burger',
            name: 'Burger Gourmet',
            icon: '🍔',
            description: '+40 faim, +20 humeur',
            price: 50,
            effects: { hunger: 40, mood: 20 }
        },
        {
            id: 'pizza',
            name: 'Pizza Complète',
            icon: '🍕',
            description: '+60 faim, +30 humeur',
            price: 100,
            effects: { hunger: 60, mood: 30 }
        },
        {
            id: 'sushi',
            name: 'Sushi Premium',
            icon: '🍣',
            description: '+80 faim, +50 humeur, +10 XP',
            price: 200,
            effects: { hunger: 80, mood: 50, xp: 10 }
        },
        {
            id: 'cake',
            name: 'Gâteau Magique',
            icon: '🎂',
            description: 'Full restore + Boost 10min',
            price: 500,
            effects: { hunger: 100, mood: 100, boost: true }
        }
    ],
    
    skins: [
        {
            id: 'sunglasses',
            name: 'Chat Cool',
            icon: '😎',
            description: 'Lunettes de soleil stylées',
            price: 1000,
            requiredLevel: 6
        },
        {
            id: 'business',
            name: 'Chat Business',
            icon: '👔',
            description: 'Costume professionnel',
            price: 1500,
            requiredLevel: 8
        },
        {
            id: 'gamer',
            name: 'Chat Gamer',
            icon: '🎮',
            description: 'Casque gaming',
            price: 2000,
            requiredLevel: 10
        },
        {
            id: 'halloween',
            name: 'Chat Halloween',
            icon: '🎃',
            description: 'Édition spéciale',
            price: 2500,
            requiredLevel: 12
        },
        {
            id: 'christmas',
            name: 'Chat Noël',
            icon: '🎅',
            description: 'Édition festive',
            price: 2500,
            requiredLevel: 12
        },
        {
            id: 'royal',
            name: 'Chat Royal',
            icon: '👑',
            description: 'Couronne dorée',
            price: 5000,
            requiredLevel: 15
        },
        {
            id: 'legendary',
            name: 'Chat Légendaire',
            icon: '🔥',
            description: 'Aura de feu',
            price: 10000,
            requiredLevel: 21
        }
    ],
    
    boosters: [
        {
            id: 'xpBoost',
            name: 'Boost XP x2',
            icon: '⚡',
            description: 'Double XP pendant 10 minutes',
            price: 300,
            duration: 600000  // 10 minutes en ms
        },
        {
            id: 'coinBoost',
            name: 'Boost Coins x2',
            icon: '💰',
            description: 'Double coins pendant 10 minutes',
            price: 500,
            duration: 600000
        },
        {
            id: 'autoFeed',
            name: 'Auto-Feed',
            icon: '🤖',
            description: 'Nourrit Éric automatiquement pendant 1h',
            price: 400,
            duration: 3600000  // 1 heure
        },
        {
            id: 'moodProtection',
            name: 'Protection Mood',
            icon: '🛡️',
            description: 'Mood ne baisse pas pendant 30 min',
            price: 600,
            duration: 1800000  // 30 minutes
        }
    ],
    
    lootboxes: [
        {
            id: 'lootBoxBasic',
            name: 'Box Basique',
            icon: '📦',
            description: '50-150 coins, chance skin commun',
            price: 200,
            rewards: {
                coinsMin: 50,
                coinsMax: 150,
                skinChance: 0.1  // 10% chance
            }
        },
        {
            id: 'lootBoxPremium',
            name: 'Box Premium',
            icon: '🎁',
            description: '100-500 coins, chance skin rare',
            price: 500,
            rewards: {
                coinsMin: 100,
                coinsMax: 500,
                skinChance: 0.3  // 30% chance
            }
        },
        {
            id: 'lootBoxLegendary',
            name: 'Box Légendaire',
            icon: '💎',
            description: '500-2000 coins, chance skin légendaire',
            price: 1000,
            rewards: {
                coinsMin: 500,
                coinsMax: 2000,
                skinChance: 0.5,  // 50% chance
                legendaryChance: 0.05  // 5% chance skin légendaire
            }
        }
    ]
};

// ============================================
// UI SHOP
// ============================================

let currentShopTab = 'food';

/**
 * Ouvrir le shop
 */
function openShop() {
    const shopModal = document.getElementById('shopModal');
    if (!shopModal) {
        createShopModal();
    }
    
    const modal = document.getElementById('shopModal');
    modal.classList.add('active');
    
    renderShopContent();
}

/**
 * Fermer le shop
 */
function closeShop() {
    const modal = document.getElementById('shopModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Créer la structure HTML du shop
 */
function createShopModal() {
    const shopHTML = `
        <div id="shopModal" class="shop-modal">
            <div class="shop-container">
                <div class="shop-header">
                    <h2 class="shop-title">🏪 Boutique</h2>
                    <div class="shop-balance" id="shopBalance">
                        🪙 ${window.gameplaySystem.gameState.coins}
                    </div>
                    <button class="shop-close" onclick="closeShop()">✕</button>
                </div>
                
                <div class="shop-tabs">
                    <button class="shop-tab active" data-tab="food" onclick="switchShopTab('food')">
                        🍔 Nourriture
                    </button>
                    <button class="shop-tab" data-tab="skins" onclick="switchShopTab('skins')">
                        😎 Skins
                    </button>
                    <button class="shop-tab" data-tab="boosters" onclick="switchShopTab('boosters')">
                        ⚡ Boosters
                    </button>
                    <button class="shop-tab" data-tab="lootboxes" onclick="switchShopTab('lootboxes')">
                        🎁 Loot Boxes
                    </button>
                    <button class="shop-tab" data-tab="inventory" onclick="switchShopTab('inventory')">
                        🎒 Inventaire
                    </button>
                </div>
                
                <div class="shop-content" id="shopContent">
                    <!-- Content dynamique -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', shopHTML);
}

/**
 * Changer d'onglet shop
 */
function switchShopTab(tab) {
    currentShopTab = tab;
    
    // Update tabs UI
    document.querySelectorAll('.shop-tab').forEach(t => {
        t.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    renderShopContent();
}

/**
 * Render le contenu du shop
 */
function renderShopContent() {
    const content = document.getElementById('shopContent');
    const gameState = window.gameplaySystem.gameState;
    
    // Update balance
    const balance = document.getElementById('shopBalance');
    if (balance) {
        balance.textContent = `🪙 ${gameState.coins}`;
    }
    
    let html = '';
    
    switch (currentShopTab) {
        case 'food':
            html = renderFoodTab();
            break;
        case 'skins':
            html = renderSkinsTab();
            break;
        case 'boosters':
            html = renderBoostersTab();
            break;
        case 'lootboxes':
            html = renderLootboxesTab();
            break;
        case 'inventory':
            html = renderInventoryTab();
            break;
    }
    
    content.innerHTML = html;
}

/**
 * Render onglet nourriture
 */
function renderFoodTab() {
    let html = '<div class="shop-grid">';
    
    SHOP_CATALOG.food.forEach(item => {
        const canBuy = window.gameplaySystem.gameState.coins >= item.price;
        
        html += `
            <div class="shop-item ${!canBuy ? 'locked' : ''}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-price">🪙 ${item.price}</div>
                <button class="shop-item-btn" 
                        ${!canBuy ? 'disabled' : ''}
                        onclick="buyFood('${item.id}')">
                    Acheter
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Render onglet skins
 */
function renderSkinsTab() {
    const gameState = window.gameplaySystem.gameState;
    let html = '<div class="shop-grid">';
    
    SHOP_CATALOG.skins.forEach(item => {
        const isOwned = gameState.stats.skinsUnlocked.includes(item.id);
        const isEquipped = gameState.skin === item.id;
        const canBuy = gameState.coins >= item.price;
        const levelOk = gameState.level >= item.requiredLevel;
        const locked = !levelOk || (!isOwned && !canBuy);
        
        let btnText = 'Acheter';
        let btnClass = 'shop-item-btn';
        let btnAction = `buySkin('${item.id}')`;
        
        if (isEquipped) {
            btnText = '✓ Équipé';
            btnClass += ' equipped';
            btnAction = '';
        } else if (isOwned) {
            btnText = 'Équiper';
            btnClass += ' equip';
            btnAction = `equipSkin('${item.id}')`;
        }
        
        html += `
            <div class="shop-item ${locked ? 'locked' : ''} ${isOwned ? 'owned' : ''}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">
                    ${item.description}<br>
                    <small>Niveau ${item.requiredLevel} requis</small>
                </div>
                ${!isOwned ? `<div class="shop-item-price">🪙 ${item.price}</div>` : ''}
                <button class="${btnClass}" 
                        ${locked || isEquipped ? 'disabled' : ''}
                        onclick="${btnAction}">
                    ${btnText}
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Render onglet boosters
 */
function renderBoostersTab() {
    const gameState = window.gameplaySystem.gameState;
    let html = '<div class="shop-grid">';
    
    SHOP_CATALOG.boosters.forEach(item => {
        const canBuy = gameState.coins >= item.price;
        const count = gameState.inventory.boosters[item.id] || 0;
        
        html += `
            <div class="shop-item ${!canBuy ? 'locked' : ''}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">
                    ${item.description}
                    ${count > 0 ? `<br><small>En stock: ${count}</small>` : ''}
                </div>
                <div class="shop-item-price">🪙 ${item.price}</div>
                <button class="shop-item-btn" 
                        ${!canBuy ? 'disabled' : ''}
                        onclick="buyBooster('${item.id}')">
                    Acheter
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Render onglet loot boxes
 */
function renderLootboxesTab() {
    const gameState = window.gameplaySystem.gameState;
    let html = '<div class="shop-grid">';
    
    SHOP_CATALOG.lootboxes.forEach(item => {
        const canBuy = gameState.coins >= item.price;
        
        html += `
            <div class="shop-item ${!canBuy ? 'locked' : ''}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-price">🪙 ${item.price}</div>
                <button class="shop-item-btn" 
                        ${!canBuy ? 'disabled' : ''}
                        onclick="buyLootbox('${item.id}')">
                    Ouvrir!
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Render onglet inventaire
 */
function renderInventoryTab() {
    const gameState = window.gameplaySystem.gameState;
    let html = '<div class="inventory-grid">';
    
    // Boosters
    Object.entries(gameState.inventory.boosters).forEach(([id, count]) => {
        if (count > 0) {
            const item = SHOP_CATALOG.boosters.find(b => b.id === id);
            if (item) {
                const isActive = gameState.activeBooters[id]?.active;
                
                html += `
                    <div class="inventory-item">
                        <div class="inventory-item-icon">${item.icon}</div>
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-count">x${count}</div>
                        <button class="inventory-item-use" 
                                ${isActive ? 'disabled' : ''}
                                onclick="useBooster('${id}')">
                            ${isActive ? 'Actif!' : 'Utiliser'}
                        </button>
                    </div>
                `;
            }
        }
    });
    
    // Foods
    Object.entries(gameState.inventory.foods).forEach(([id, count]) => {
        if (count > 0) {
            const item = SHOP_CATALOG.food.find(f => f.id === id);
            if (item) {
                html += `
                    <div class="inventory-item">
                        <div class="inventory-item-icon">${item.icon}</div>
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-count">x${count}</div>
                        <button class="inventory-item-use" 
                                onclick="useFood('${id}')">
                            Nourrir Éric
                        </button>
                    </div>
                `;
            }
        }
    });
    
    if (html === '<div class="inventory-grid">') {
        html += '<p style="grid-column: 1/-1; text-align:center; color:#94a3b8; padding:2rem;">Inventaire vide. Achète des items dans le shop!</p>';
    }
    
    html += '</div>';
    return html;
}

// ============================================
// ACTIONS SHOP
// ============================================

/**
 * Acheter de la nourriture
 */
function buyFood(foodId) {
    const item = SHOP_CATALOG.food.find(f => f.id === foodId);
    if (!item) return;
    
    if (window.gameplaySystem.spendCoins(item.price)) {
        // Ajouter à l'inventaire
        const gameState = window.gameplaySystem.gameState;
        gameState.inventory.foods[foodId] = (gameState.inventory.foods[foodId] || 0) + 1;
        gameState.stats.itemsBought++;
        
        window.gameplaySystem.saveGameState();
        
        showNotification(`✅ ${item.name} acheté! (Inventaire)`, 'success');
        renderShopContent();
        
        // Animation
        animatePurchase();
    }
}

/**
 * Utiliser nourriture de l'inventaire
 */
function useFood(foodId) {
    const item = SHOP_CATALOG.food.find(f => f.id === foodId);
    const gameState = window.gameplaySystem.gameState;
    
    if (!item || !gameState.inventory.foods[foodId]) return;
    
    // Appliquer effets
    if (item.effects.hunger) {
        tamaState.hunger = Math.min(100, tamaState.hunger + item.effects.hunger);
    }
    if (item.effects.mood) {
        tamaState.mood = Math.min(100, tamaState.mood + item.effects.mood);
    }
    if (item.effects.xp) {
        window.gameplaySystem.addXP(item.effects.xp, 'premium_food');
    }
    
    // Boost special cake
    if (item.effects.boost) {
        activateBoost('coinBoost', 600000);
        showNotification('🎂 Boost Coins x2 activé pendant 10 min!', 'epic');
    }
    
    // Retirer de l'inventaire
    gameState.inventory.foods[foodId]--;
    window.gameplaySystem.saveGameState();
    
    updateTamaVisuals();
    showNotification(`${item.icon} ${item.name} utilisé!`, 'success');
    renderShopContent();
}

/**
 * Acheter un skin
 */
function buySkin(skinId) {
    const item = SHOP_CATALOG.skins.find(s => s.id === skinId);
    const gameState = window.gameplaySystem.gameState;
    
    if (!item) return;
    
    // Check level
    if (gameState.level < item.requiredLevel) {
        showNotification(`❌ Niveau ${item.requiredLevel} requis!`, 'error');
        return;
    }
    
    if (window.gameplaySystem.spendCoins(item.price)) {
        gameState.stats.skinsUnlocked.push(skinId);
        gameState.stats.itemsBought++;
        
        window.gameplaySystem.saveGameState();
        
        showNotification(`✅ ${item.name} débloqué!`, 'success');
        renderShopContent();
        
        animatePurchase();
    }
}

/**
 * Équiper un skin
 */
function equipSkin(skinId) {
    const gameState = window.gameplaySystem.gameState;
    
    if (!gameState.stats.skinsUnlocked.includes(skinId)) return;
    
    gameState.skin = skinId;
    window.gameplaySystem.saveGameState();
    
    updateEricVisual();
    showNotification('✅ Skin équipé!', 'success');
    renderShopContent();
}

/**
 * Acheter un booster
 */
function buyBooster(boosterId) {
    const item = SHOP_CATALOG.boosters.find(b => b.id === boosterId);
    if (!item) return;
    
    if (window.gameplaySystem.spendCoins(item.price)) {
        const gameState = window.gameplaySystem.gameState;
        gameState.inventory.boosters[boosterId] = (gameState.inventory.boosters[boosterId] || 0) + 1;
        gameState.stats.itemsBought++;
        
        window.gameplaySystem.saveGameState();
        
        showNotification(`✅ ${item.name} acheté!`, 'success');
        renderShopContent();
        
        animatePurchase();
    }
}

/**
 * Utiliser un booster
 */
function useBooster(boosterId) {
    const item = SHOP_CATALOG.boosters.find(b => b.id === boosterId);
    const gameState = window.gameplaySystem.gameState;
    
    if (!item || !gameState.inventory.boosters[boosterId]) return;
    
    // Activer le booster
    activateBoost(boosterId, item.duration);
    
    // Retirer de l'inventaire
    gameState.inventory.boosters[boosterId]--;
    window.gameplaySystem.saveGameState();
    
    showNotification(`${item.icon} ${item.name} activé!`, 'epic');
    renderShopContent();
}

/**
 * Activer un boost
 */
function activateBoost(boosterId, duration) {
    const gameState = window.gameplaySystem.gameState;
    
    gameState.activeBooters[boosterId] = {
        active: true,
        expiresAt: Date.now() + duration
    };
    
    window.gameplaySystem.saveGameState();
    
    // Timer pour désactiver
    setTimeout(() => {
        gameState.activeBooters[boosterId].active = false;
        window.gameplaySystem.saveGameState();
        showNotification('⏰ Boost terminé!', 'info');
    }, duration);
}

/**
 * Acheter une loot box
 */
function buyLootbox(boxId) {
    const item = SHOP_CATALOG.lootboxes.find(b => b.id === boxId);
    if (!item) return;
    
    if (window.gameplaySystem.spendCoins(item.price)) {
        openLootbox(item);
    }
}

/**
 * Ouvrir une loot box avec animation
 */
function openLootbox(item) {
    // Animation d'ouverture
    const animation = document.createElement('div');
    animation.className = 'lootbox-animation';
    animation.innerHTML = `
        <div class="lootbox-icon">${item.icon}</div>
        <div class="lootbox-reveal" id="lootboxReveal"></div>
    `;
    document.body.appendChild(animation);
    
    // Shake pendant 2 secondes
    setTimeout(() => {
        // Calculer récompenses
        const rewards = calculateLootboxRewards(item);
        
        // Afficher
        const reveal = document.getElementById('lootboxReveal');
        reveal.innerHTML = `
            <div>✨ Tu as gagné:</div>
            ${rewards.coins ? `<div>🪙 ${rewards.coins} coins</div>` : ''}
            ${rewards.skin ? `<div>😎 ${rewards.skin.name}</div>` : ''}
        `;
        
        // Appliquer récompenses
        if (rewards.coins) {
            window.gameplaySystem.addCoins(rewards.coins, 'lootbox');
        }
        if (rewards.skin) {
            const gameState = window.gameplaySystem.gameState;
            if (!gameState.stats.skinsUnlocked.includes(rewards.skin.id)) {
                gameState.stats.skinsUnlocked.push(rewards.skin.id);
                window.gameplaySystem.saveGameState();
            }
        }
        
        // Fermer après 3 secondes
        setTimeout(() => {
            animation.remove();
            renderShopContent();
        }, 3000);
    }, 2000);
}

/**
 * Calculer récompenses loot box
 */
function calculateLootboxRewards(item) {
    const rewards = {};
    
    // Coins garantis
    const coinsRange = item.rewards.coinsMax - item.rewards.coinsMin;
    rewards.coins = item.rewards.coinsMin + Math.floor(Math.random() * coinsRange);
    
    // Chance de skin
    if (Math.random() < item.rewards.skinChance) {
        const availableSkins = SHOP_CATALOG.skins.filter(s => {
            const gameState = window.gameplaySystem.gameState;
            return !gameState.stats.skinsUnlocked.includes(s.id) &&
                   gameState.level >= s.requiredLevel;
        });
        
        if (availableSkins.length > 0) {
            // Legendary chance
            if (item.rewards.legendaryChance && Math.random() < item.rewards.legendaryChance) {
                const legendarySkins = availableSkins.filter(s => s.price >= 5000);
                if (legendarySkins.length > 0) {
                    rewards.skin = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
                }
            }
            
            // Sinon skin normal
            if (!rewards.skin) {
                rewards.skin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
            }
        }
    }
    
    return rewards;
}

/**
 * Animation achat
 */
function animatePurchase() {
    const shopContainer = document.querySelector('.shop-container');
    if (shopContainer) {
        shopContainer.classList.add('purchase-success');
        setTimeout(() => {
            shopContainer.classList.remove('purchase-success');
        }, 500);
    }
    
    // Vibration
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// ============================================
// INITIALISATION
// ============================================

function initShop() {
    console.log('🏪 Shop system initialized');
    
    // Shop trigger removed - now accessible via dashboard only
}

/**
 * Fonction générique pour acheter un item depuis le dashboard
 * @param {string} category - 'food', 'skins', 'boosters', 'lootboxes'
 * @param {string} itemId - ID de l'item
 */
function buyItem(category, itemId) {
    console.log(`🛒 buyItem(${category}, ${itemId})`);
    
    switch(category) {
        case 'food':
            return buyFood(itemId);
        case 'skins':
            return buySkin(itemId);
        case 'boosters':
            return buyBooster(itemId);
        case 'lootboxes':
            return buyLootbox(itemId);
        default:
            console.error(`❌ Unknown category: ${category}`);
            return false;
    }
}

/**
 * Fonction générique pour utiliser un item depuis l'inventaire
 * @param {string} category - 'food', 'boosters'
 * @param {string} itemId - ID de l'item
 */
function useItem(category, itemId) {
    console.log(`📦 useItem(${category}, ${itemId})`);
    
    switch(category) {
        case 'food':
            return useFood(itemId);
        case 'boosters':
            return useBooster(itemId);
        default:
            console.error(`❌ Unknown category: ${category}`);
            return false;
    }
}

// Exposer globalement
window.shopSystem = {
    openShop,
    closeShop,
    initShop,
    buyItem,      // ← Nouvelle fonction générique
    buyFood,
    useFood,
    useItem,      // ← Nouvelle fonction générique
    buySkin,
    equipSkin,
    buyBooster,
    useBooster,
    buyLootbox,
    SHOP_CATALOG,  // ← Exposer le catalogue aussi
    activateBoost,
    renderShopContent
};
