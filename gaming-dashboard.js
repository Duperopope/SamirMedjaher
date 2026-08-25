/**
 * 🎮 GAMING DASHBOARD v2.0 - Next-Gen CV Gamification
 * Architecture modulaire complète avec tous les systèmes gaming avancés
 * 
 * Modules:
 * - Core State Management
 * - Tab Navigation System
 * - Quest System v2.0 (Narrative Chains)
 * - Event System (Seasonal & Timed)
 * - Achievement Tiers (Bronze → Legendary)
 * - Gacha/Lootbox System
 * - Prestige System
 * - Stats & Analytics
 * - Social Features (Local)
 */

/* ============================================
   🎯 GLOBAL DASHBOARD STATE
   ============================================ */

let dashboardState = {
    // UI State
    currentTab: 'eric',
    isOpen: false,
    
    // Player Progress
    totalPlaytime: 0,
    lastSessionStart: null,
    
    // Quest Progress
    activeQuests: [],
    completedQuests: [],
    currentQuestChain: 'welcome_arc',
    
    // Event State
    activeEvent: null,
    eventProgress: {},
    
    // Achievement Progress
    achievements: {},
    achievementPoints: 0,
    
    // Gacha State
    lootboxesOpened: 0,
    pityCounter: 0,
    
    // Prestige State
    prestigeLevel: 0,
    prestigeMultiplier: 1.0,
    prestigeUnlocks: [],
    
    // Stats Tracking
    metrics: {
        totalPlaytime: 0,
        coinsEarnedTotal: 0,
        coinsSpentTotal: 0,
        minigamesPlayed: 0,
        minigameWins: 0,
        achievementsUnlocked: 0,
        dailyStreakMax: 0,
        cvDownloads: 0,
        emailsSent: 0,
        sectionsVisited: {},
        lastPlayDate: null
    },
    
    // Social
    friendChallenges: [],
    sharedProfiles: []
};

/* ============================================
   📊 QUEST SYSTEM v2.0 - NARRATIVE CHAINS
   ============================================ */

const QUEST_CHAINS = {
    welcome_arc: {
        name: "Bienvenue dans le Gaming CV",
        icon: "👋",
        quests: [
            {
                id: "welcome_1",
                title: "Rencontre avec Éric",
                description: "Clique sur Éric pour faire connaissance",
                objectives: [
                    { type: "click_eric", required: 1, current: 0, label: "Cliquer sur Éric" }
                ],
                rewards: { coins: 100, xp: 50 },
                story: "🐱 Salut ! Moi c'est Éric. Je suis le compagnon gaming de ce CV. On va bien s'amuser ensemble !",
                unlocks: null
            },
            {
                id: "welcome_2",
                title: "Premier Repas",
                description: "Nourris Éric 3 fois",
                objectives: [
                    { type: "feed_eric", required: 3, current: 0, label: "Nourrir Éric" }
                ],
                rewards: { coins: 150, xp: 75 },
                story: "🍔 Miam ! J'adore manger ! Plus tu me nourris, plus je suis content !",
                unlocks: "shop_tab"
            },
            {
                id: "welcome_3",
                title: "Exploration du CV",
                description: "Visite 3 sections différentes du CV",
                objectives: [
                    { type: "visit_sections", required: 3, current: 0, label: "Sections visitées" }
                ],
                rewards: { coins: 200, xp: 100 },
                story: "📄 Ce CV cache plein de secrets. Explore bien partout !",
                unlocks: null
            },
            {
                id: "welcome_4",
                title: "Premier Niveau",
                description: "Atteins le niveau 2",
                objectives: [
                    { type: "reach_level", required: 2, current: 1, label: "Niveau actuel" }
                ],
                rewards: { coins: 300, xp: 150, skin: "bronze_badge" },
                story: "⭐ Bravo ! Tu progresses vite ! Débloquons maintenant les mini-jeux !",
                unlocks: "games_tab"
            }
        ]
    },
    
    gaming_master: {
        name: "Maître des Jeux",
        icon: "🎮",
        requiredLevel: 3,
        quests: [
            {
                id: "gaming_1",
                title: "Découverte des Mini-Jeux",
                description: "Joue à 3 mini-jeux différents",
                objectives: [
                    { type: "play_different_games", required: 3, current: 0, label: "Jeux essayés" }
                ],
                rewards: { coins: 250, xp: 125 },
                story: "🎮 Il y a plein de jeux sympas ! Essaie-les tous !",
                unlocks: null
            },
            {
                id: "gaming_2",
                title: "Première Victoire",
                description: "Gagne 5 mini-jeux",
                objectives: [
                    { type: "win_minigames", required: 5, current: 0, label: "Victoires" }
                ],
                rewards: { coins: 500, xp: 250 },
                story: "🏆 Tu deviens bon ! Continue comme ça !",
                unlocks: null
            },
            {
                id: "gaming_3",
                title: "Score Parfait",
                description: "Obtiens un score parfait dans n'importe quel mini-jeu",
                objectives: [
                    { type: "perfect_score", required: 1, current: 0, label: "Score parfait" }
                ],
                rewards: { coins: 1000, xp: 500, skin: "pro_gamer" },
                story: "💎 WOW ! Tu es un vrai PRO !",
                unlocks: "tournament_mode"
            }
        ]
    },
    
    recruiter_path: {
        name: "Chemin du Recruteur",
        icon: "💼",
        requiredLevel: 5,
        quests: [
            {
                id: "recruiter_1",
                title: "CV Complet",
                description: "Explore toutes les sections du CV",
                objectives: [
                    { type: "visit_all_sections", required: 1, current: 0, label: "Tout exploré" }
                ],
                rewards: { coins: 300, xp: 200 },
                story: "📋 Tu connais maintenant tout le parcours de Samir !",
                unlocks: null
            },
            {
                id: "recruiter_2",
                title: "Téléchargement du CV",
                description: "Télécharge le CV professionnel",
                objectives: [
                    { type: "download_cv", required: 1, current: 0, label: "CV téléchargé" }
                ],
                rewards: { coins: 1000, xp: 500 },
                story: "💼 Excellent ! Tu sembles intéressé par le profil !",
                unlocks: null
            },
            {
                id: "recruiter_3",
                title: "Contact Établi",
                description: "Envoie un email ou visite LinkedIn",
                objectives: [
                    { type: "make_contact", required: 1, current: 0, label: "Contact effectué" }
                ],
                rewards: { coins: 2000, xp: 1000, title: "Recruteur Intéressé" },
                story: "🎉 Merci beaucoup ! Samir sera ravi de discuter avec toi !",
                unlocks: "secret_message"
            }
        ]
    },
    
    collector_path: {
        name: "Collectionneur Ultime",
        icon: "💎",
        requiredLevel: 10,
        quests: [
            {
                id: "collector_1",
                title: "Richesse",
                description: "Accumule 10,000 coins",
                objectives: [
                    { type: "total_coins", required: 10000, current: 0, label: "Coins accumulés" }
                ],
                rewards: { coins: 2000, xp: 1000 },
                story: "💰 Tu es riche ! Le shop t'attend !",
                unlocks: null
            },
            {
                id: "collector_2",
                title: "Collection de Skins",
                description: "Débloque 5 skins différents",
                objectives: [
                    { type: "unlock_skins", required: 5, current: 0, label: "Skins débloqués" }
                ],
                rewards: { coins: 3000, xp: 1500 },
                story: "🎨 Ta collection grandit !",
                unlocks: null
            },
            {
                id: "collector_3",
                title: "Maître Collectionneur",
                description: "Débloque tous les achievements Bronze",
                objectives: [
                    { type: "unlock_bronze_achievements", required: 1, current: 0, label: "Tous les Bronze" }
                ],
                rewards: { coins: 5000, xp: 2500, title: "Collectionneur", skin: "collector_badge" },
                story: "👑 Tu es un vrai collectionneur ! Continue vers l'or !",
                unlocks: "prestige_option"
            }
        ]
    }
};

/* ============================================
   🎁 EVENT SYSTEM - SEASONAL & TIMED
   ============================================ */

const EVENT_CALENDAR = {
    halloween: {
        id: "halloween",
        name: "🎃 Halloween Spooky",
        startDate: { month: 10, day: 25 }, // 25 octobre
        endDate: { month: 11, day: 2 },     // 2 novembre
        rewards: {
            participation: { coins: 500, skin: "halloween_eric" },
            completion: { coins: 2000, xp: 1000, title: "Chasseur de Bonbons" }
        },
        challenges: [
            { id: "collect_candy", label: "Collecter 50 bonbons", required: 50, reward: 500 },
            { id: "spooky_minigame", label: "Gagner le mini-jeu Candy Collector", required: 1, reward: 1000 }
        ],
        theme: {
            background: "linear-gradient(135deg, #1a0033, #330066)",
            particles: "🎃👻🦇",
            music: "spooky"
        }
    },
    
    christmas: {
        id: "christmas",
        name: "🎄 Noël Festif",
        startDate: { month: 12, day: 20 },
        endDate: { month: 12, day: 26 },
        rewards: {
            participation: { coins: 1000, skin: "santa_eric" },
            completion: { coins: 5000, xp: 2500, title: "Esprit de Noël" }
        },
        challenges: [
            { id: "open_gifts", label: "Ouvrir 10 cadeaux", required: 10, reward: 1000 },
            { id: "daily_login", label: "Se connecter 7 jours de suite", required: 7, reward: 2000 }
        ],
        theme: {
            background: "linear-gradient(135deg, #0a3d62, #1e5f8b)",
            particles: "❄️🎁⛄",
            music: "jingle"
        }
    },
    
    weekend_boost: {
        id: "weekend_boost",
        name: "⚡ Weekend Boost",
        recurring: "weekly",
        startDay: 6, // Samedi
        endDay: 0,   // Dimanche
        rewards: {
            multiplier: 2.0,
            message: "Double XP & Coins ce weekend !"
        },
        theme: {
            badge: "🔥",
            notification: true
        }
    },
    
    friday_13: {
        id: "friday_13",
        name: "🔮 Vendredi 13 Mystère",
        dateCheck: (date) => date.getDay() === 5 && date.getDate() === 13,
        rewards: {
            mysteryBox: true,
            coins: 1300,
            message: "Jour de chance ! Mystery box gratuite !"
        }
    }
};

/* ============================================
   🏆 ACHIEVEMENT SYSTEM v3.0 - TIERS
   ============================================ */

const ACHIEVEMENT_TIERS = {
    bronze: { icon: '🥉', multiplier: 1.0, color: '#CD7F32', points: 10 },
    silver: { icon: '🥈', multiplier: 1.5, color: '#C0C0C0', points: 25 },
    gold: { icon: '🥇', multiplier: 2.0, color: '#FFD700', points: 50 },
    platinum: { icon: '💎', multiplier: 3.0, color: '#E5E4E2', points: 100 },
    legendary: { icon: '👑', multiplier: 5.0, color: '#9D00FF', points: 250 }
};

const ACHIEVEMENT_CATALOG = {
    coin_collector: {
        name: "Collectionneur de Coins",
        icon: "🪙",
        tiers: {
            bronze: { coins: 1000, reward: 100 },
            silver: { coins: 5000, reward: 300 },
            gold: { coins: 15000, reward: 1000 },
            platinum: { coins: 50000, reward: 5000 },
            legendary: { coins: 100000, reward: 20000, unlock: "legendary_coin_magnet" }
        }
    },
    
    gamer_pro: {
        name: "Gamer Professionnel",
        icon: "🎮",
        tiers: {
            bronze: { wins: 10, reward: 150 },
            silver: { wins: 50, reward: 500 },
            gold: { wins: 150, reward: 1500 },
            platinum: { wins: 500, reward: 7500 },
            legendary: { wins: 1000, reward: 25000, unlock: "pro_gamer_title" }
        }
    },
    
    level_master: {
        name: "Maître des Niveaux",
        icon: "⭐",
        tiers: {
            bronze: { level: 5, reward: 200 },
            silver: { level: 10, reward: 600 },
            gold: { level: 20, reward: 2000 },
            platinum: { level: 50, reward: 10000 },
            legendary: { level: 100, reward: 50000, unlock: "prestige_master" }
        }
    },
    
    daily_warrior: {
        name: "Guerrier Quotidien",
        icon: "📅",
        tiers: {
            bronze: { streak: 3, reward: 100 },
            silver: { streak: 7, reward: 400 },
            gold: { streak: 14, reward: 1200 },
            platinum: { streak: 30, reward: 6000 },
            legendary: { streak: 100, reward: 30000, unlock: "eternal_streak_badge" }
        }
    },
    
    eric_caretaker: {
        name: "Gardien d'Éric",
        icon: "🐱",
        tiers: {
            bronze: { feeds: 50, reward: 150 },
            silver: { feeds: 200, reward: 450 },
            gold: { feeds: 500, reward: 1500 },
            platinum: { feeds: 1500, reward: 7500 },
            legendary: { feeds: 5000, reward: 30000, unlock: "eric_best_friend" }
        }
    },
    
    shopaholic: {
        name: "Accro du Shopping",
        icon: "🛒",
        tiers: {
            bronze: { purchases: 10, reward: 100 },
            silver: { purchases: 50, reward: 350 },
            gold: { purchases: 150, reward: 1250 },
            platinum: { purchases: 500, reward: 6500 },
            legendary: { purchases: 1000, reward: 25000, unlock: "vip_shopper" }
        }
    }
};

/* ============================================
   🎰 GACHA / LOOTBOX SYSTEM
   ============================================ */

const LOOTBOX_CATALOG = {
    common: {
        name: "Boîte Commune",
        icon: "📦",
        price: 100,
        rarity: "common",
        drops: [
            { type: "coins", min: 50, max: 150, weight: 70 },
            { type: "food", items: ["burger", "pizza"], weight: 25 },
            { type: "skin", items: ["common_1", "common_2"], weight: 5 }
        ]
    },
    
    rare: {
        name: "Boîte Rare",
        icon: "🎁",
        price: 500,
        rarity: "rare",
        drops: [
            { type: "coins", min: 300, max: 700, weight: 40 },
            { type: "food", items: ["sushi", "cake"], weight: 30 },
            { type: "skin", items: ["rare_1", "rare_2", "rare_3"], weight: 20 },
            { type: "booster", items: ["xpBoost", "coinBoost"], weight: 10 }
        ]
    },
    
    epic: {
        name: "Boîte Épique",
        icon: "🎇",
        price: 1500,
        rarity: "epic",
        drops: [
            { type: "coins", min: 1000, max: 2000, weight: 30 },
            { type: "skin", items: ["epic_1", "epic_2", "epic_3", "epic_4"], weight: 50 },
            { type: "booster", items: ["megaBoost", "ultraBoost"], weight: 15 },
            { type: "exclusive", items: ["pet_1", "decoration_1"], weight: 5 }
        ]
    },
    
    legendary: {
        name: "Boîte Légendaire",
        icon: "👑",
        price: 5000,
        rarity: "legendary",
        drops: [
            { type: "coins", min: 3000, max: 8000, weight: 20 },
            { type: "skin", items: ["legendary_1", "legendary_2"], weight: 60 },
            { type: "title", items: ["legend", "collector", "master"], weight: 15 },
            { type: "pet", items: ["dragon", "phoenix", "unicorn"], weight: 5 }
        ]
    }
};

const PITY_SYSTEM = {
    enabled: true,
    guaranteedRareEvery: 10,
    guaranteedEpicEvery: 50,
    guaranteedLegendaryEvery: 100
};

/* ============================================
   ♻️ PRESTIGE SYSTEM
   ============================================ */

const PRESTIGE_CONFIG = {
    minLevel: 50,
    resetProgress: true,
    keepItems: ["skins", "achievements", "titles"],
    bonusPerPrestige: 0.1, // +10% permanent coins/xp per prestige
    prestigeRewards: [
        { level: 1, bonus: 0.1, title: "Prestige I", icon: "⭐" },
        { level: 2, bonus: 0.2, title: "Prestige II", icon: "🌟" },
        { level: 3, bonus: 0.3, title: "Prestige III", icon: "💫" },
        { level: 5, bonus: 0.5, title: "Prestige V", icon: "✨" },
        { level: 10, bonus: 1.0, title: "Prestige X", icon: "🔥" }
    ]
};

/* ============================================
   🎯 CORE DASHBOARD FUNCTIONS
   ============================================ */

/**
 * Initialize Gaming Dashboard
 */
function initGamingDashboard() {
    console.log('🎮 Gaming Dashboard v2.0 - Initializing...');
    
    // Load saved state
    loadDashboardState();
    
    // Check for active events
    checkActiveEvents();
    
    // Initialize quest system
    initQuestSystem();
    
    // Update metrics
    updatePlaytime();
    
    // Setup UI
    setupDashboardUI();
    
    console.log('✅ Gaming Dashboard v2.0 - Ready!');
}

/**
 * Load dashboard state from localStorage
 */
function loadDashboardState() {
    const saved = localStorage.getItem('gamingDashboardState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            dashboardState = { ...dashboardState, ...parsed };
        } catch (e) {
            console.error('Failed to load dashboard state:', e);
        }
    }
}

/**
 * Save dashboard state to localStorage
 */
function saveDashboardState() {
    try {
        localStorage.setItem('gamingDashboardState', JSON.stringify(dashboardState));
    } catch (e) {
        console.error('Failed to save dashboard state:', e);
    }
}

/**
 * Switch dashboard tab
 */
function switchDashboardTab(tabId) {
    dashboardState.currentTab = tabId;
    
    // Hide all tab contents
    document.querySelectorAll('.dashboard-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.dashboard-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(`tab-${tabId}`);
    const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (targetTab) targetTab.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
    
    // Render tab content
    renderTabContent(tabId);
    
    saveDashboardState();
}

/**
 * Render tab content dynamically
 */
function renderTabContent(tabId) {
    const container = document.getElementById(`tab-${tabId}`);
    if (!container) return;
    
    switch(tabId) {
        case 'eric':
            renderEricTab(container);
            break;
        case 'shop':
            renderShopTab(container);
            break;
        case 'games':
            renderGamesTab(container);
            break;
        case 'stats':
            renderStatsTab(container);
            break;
        case 'quests':
            renderQuestsTab(container);
            break;
        case 'events':
            renderEventsTab(container);
            break;
        case 'achievements':
            renderAchievementsTab(container);
            break;
        case 'settings':
            renderSettingsTab(container);
            break;
    }
}

/**
 * Setup Dashboard UI
 */
function setupDashboardUI() {
    // Create dashboard container if it doesn't exist
    let dashboard = document.getElementById('gamingDashboard');
    if (!dashboard) {
        dashboard = document.createElement('div');
        dashboard.id = 'gamingDashboard';
        dashboard.className = 'gaming-dashboard hidden';
        document.body.appendChild(dashboard);
    }
    
    // Initial tab
    switchDashboardTab(dashboardState.currentTab);
}

/**
 * Toggle dashboard visibility
 */
function toggleDashboard() {
    const dashboard = document.getElementById('gamingDashboard');
    if (!dashboard) return;
    
    dashboardState.isOpen = !dashboardState.isOpen;
    
    // Get Éric tamagotchi element
    const tamagotchi = document.getElementById('tamagotchi');
    
    if (dashboardState.isOpen) {
        dashboard.classList.remove('hidden');
        dashboard.classList.add('active');
        
        // Hide Éric when dashboard is open
        if (tamagotchi) {
            tamagotchi.style.display = 'none';
        }
        
        // Start session timer
        dashboardState.lastSessionStart = Date.now();
    } else {
        dashboard.classList.remove('active');
        dashboard.classList.add('hidden');
        
        // Show Éric when dashboard is closed (if gaming mode is active)
        if (tamagotchi && localStorage.getItem('gamingMode') === 'true') {
            tamagotchi.style.display = 'flex';
        }
        
        // Update playtime
        updatePlaytime();
    }
    
    saveDashboardState();
}

/**
 * Update playtime metrics
 */
function updatePlaytime() {
    if (dashboardState.lastSessionStart) {
        const sessionTime = Date.now() - dashboardState.lastSessionStart;
        dashboardState.metrics.totalPlaytime += sessionTime;
        dashboardState.lastSessionStart = Date.now();
        saveDashboardState();
    }
}

/* ============================================
   📊 TAB RENDERING FUNCTIONS
   ============================================ */

function renderEricTab(container) {
    // Le jeu illustré est désormais la source de vérité de l'onglet Éric.
    // L'ancien renderer ne doit jamais réécrire la scène après son montage.
    if (window.EricCompleteGame) {
        if (container.querySelector('.eric-game-container')) return;
        if (window.ericGame?.adventure) window.ericGame.adventure.destroy();
        window.ericGame = new EricCompleteGame(container.id);
        return;
    }

    // Get Eric state
    const ericState = window.gamingConnector ? window.gamingConnector.getEricState() : null;
    const icon = ericState?.icon || '🐱';
    const mood = ericState?.mood || 50;
    const hunger = ericState?.hunger || 50;
    const level = ericState?.level || 1;
    const evolution = ericState?.evolution || 'baby';
    
    container.innerHTML = `
        <div class="eric-world">
            <h2>🐱 Monde d'Éric</h2>
            
            <!-- Eric Display -->
            <div class="eric-stage" id="ericStage">
                <div class="eric-character" id="ericCharacter">
                    <div class="eric-icon" id="ericIcon">${icon}</div>
                    <div class="eric-level">Niveau ${level}</div>
                    <div class="eric-evolution">${evolution}</div>
                </div>
                <!-- Animation overlays -->
                <div class="eric-animation-overlay" id="ericAnimationOverlay"></div>
            </div>
            
            <!-- Eric Stats -->
            <div class="eric-stats">
                <div class="stat-bar">
                    <div class="stat-label">
                        <span>😊 Humeur</span>
                        <span>${mood}%</span>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-fill mood" style="width: ${mood}%"></div>
                    </div>
                </div>
                
                <div class="stat-bar">
                    <div class="stat-label">
                        <span>🍔 Faim</span>
                        <span>${hunger}%</span>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-fill hunger" style="width: ${hunger}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Eric Actions -->
            <div class="eric-actions">
                <button onclick="feedEricFromDashboard()" class="eric-action-btn">
                    <span class="action-icon">🍔</span>
                    <span class="action-label">Nourrir</span>
                </button>
                <button onclick="playWithEricFromDashboard()" class="eric-action-btn">
                    <span class="action-icon">🎾</span>
                    <span class="action-label">Jouer</span>
                </button>
                <button onclick="cuddleEricFromDashboard()" class="eric-action-btn">
                    <span class="action-icon">🤗</span>
                    <span class="action-label">Câliner</span>
                </button>
            </div>
            
            <!-- Quick Feed Menu -->
            <div class="quick-feed-menu">
                <h3>🍽️ Nourriture Rapide</h3>
                <div class="quick-feed-items">
                    <button onclick="quickFeed('burger')" class="quick-feed-btn">
                        🍔 Burger (50🪙)
                    </button>
                    <button onclick="quickFeed('pizza')" class="quick-feed-btn">
                        🍕 Pizza (100🪙)
                    </button>
                    <button onclick="quickFeed('sushi')" class="quick-feed-btn">
                        🍣 Sushi (200🪙)
                    </button>
                </div>
            </div>
        </div>
    `;
}

function quickFeed(foodId) {
    console.log(`🍔 Quick feeding: ${foodId}`);
    
    // Try to buy and use immediately
    if (typeof buyShopItem === 'function') {
        buyShopItem('food', foodId);
        setTimeout(() => {
            if (typeof useInventoryItem === 'function') {
                useInventoryItem(foodId, 'food');
            }
        }, 100);
    }
}

function getShopGlyph(category, itemId = '') {
    const id = itemId.toLowerCase();
    if (id.includes('pizza')) return 'fa-pizza-slice';
    if (id.includes('burger')) return 'fa-burger';
    if (id.includes('sushi') || id.includes('fish')) return 'fa-fish';
    if (id.includes('cake') || id.includes('gateau')) return 'fa-cake-candles';
    return ({ food:'fa-bowl-food', skins:'fa-mask-face', boosters:'fa-flask', lootboxes:'fa-box-open' })[category] || 'fa-gem';
}

function renderShopTab(container) {
    // Get player coins
    const playerCoins = (typeof gameState !== 'undefined' && gameState.coins) ? gameState.coins : 0;
    const playerLevel = (typeof gameState !== 'undefined' && gameState.level) ? gameState.level : 1;
    
    container.innerHTML = `
        <div class="shop-dashboard">
            <div class="shop-header">
                <h2><i class="fas fa-briefcase"></i><span><small>Intendance</small>Boutique nocturne</span></h2>
                <div class="player-coins">
                    <span class="coins-icon"><i class="fas fa-coins"></i></span>
                    <span class="coins-amount">${playerCoins.toLocaleString()}</span>
                    <span class="coins-label">Coins</span>
                </div>
            </div>
            
            <!-- Shop Categories Tabs -->
            <div class="shop-categories">
                <button class="shop-category-btn active" onclick="switchShopCategory('food')">
                    <i class="fas fa-utensils"></i> Provisions
                </button>
                <button class="shop-category-btn" onclick="switchShopCategory('skins')">
                    <i class="fas fa-palette"></i> Apparences
                </button>
                <button class="shop-category-btn" onclick="switchShopCategory('boosters')">
                    <i class="fas fa-bolt"></i> Talismans
                </button>
                <button class="shop-category-btn" onclick="switchShopCategory('lootboxes')">
                    <i class="fas fa-box-open"></i> Trouvailles
                </button>
                <button class="shop-category-btn" onclick="switchShopCategory('inventory')">
                    <i class="fas fa-archive"></i> Réserve
                </button>
            </div>
            
            <!-- Shop Content Area -->
            <div id="shop-content-area" class="shop-content-area">
                <!-- Will be populated by switchShopCategory() -->
            </div>
        </div>
    `;
    
    // Initialize with food category
    switchShopCategory('food');
}

function switchShopCategory(category) {
    // Update active button
    document.querySelectorAll('.shop-category-btn').forEach(btn => btn.classList.remove('active'));
    event?.target?.classList?.add('active');
    
    const contentArea = document.getElementById('shop-content-area');
    if (!contentArea) return;
    
    const playerCoins = (typeof gameState !== 'undefined' && gameState.coins) ? gameState.coins : 0;
    const playerLevel = (typeof gameState !== 'undefined' && gameState.level) ? gameState.level : 1;
    
    // Get catalog from shop system
    const catalog = (typeof SHOP_CATALOG !== 'undefined') ? SHOP_CATALOG : {
        food: [],
        skins: [],
        boosters: [],
        lootboxes: []
    };
    
    let html = '<div class="shop-items-grid">';
    
    if (category === 'inventory') {
        // Show inventory
        html += renderInventoryInShop();
    } else {
        // Show items from catalog
        const items = catalog[category] || [];
        
        items.forEach(item => {
            const canAfford = playerCoins >= item.price;
            const levelOk = !item.requiredLevel || playerLevel >= item.requiredLevel;
            const canBuy = canAfford && levelOk;
            
            html += `
                <div class="shop-item-card ${!canBuy ? 'locked' : ''}">
                    <div class="shop-item-icon"><i class="fas ${getShopGlyph(category, item.id)}"></i></div>
                    <div class="shop-item-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        ${item.requiredLevel ? `<span class="level-requirement ${!levelOk ? 'not-met' : ''}">Niveau ${item.requiredLevel} requis</span>` : ''}
                    </div>
                    <div class="shop-item-footer">
                        <span class="item-price ${!canAfford ? 'cannot-afford' : ''}">
                            <i class="fas fa-coins"></i> ${item.price}
                        </span>
                        <button 
                            class="buy-btn ${!canBuy ? 'disabled' : ''}" 
                            onclick="buyShopItem('${category}', '${item.id}')"
                            ${!canBuy ? 'disabled' : ''}>
                            ${!levelOk ? '<i class="fas fa-lock"></i> Verrouillé' : !canAfford ? '<i class="fas fa-coins"></i> Insuffisant' : '<i class="fas fa-plus"></i> Acquérir'}
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    contentArea.innerHTML = html;
}

function renderInventoryInShop() {
    const inventory = (typeof gameState !== 'undefined' && gameState.inventory) ? gameState.inventory : {
        foods: {},
        boosters: {},
        skins: []
    };
    
    let html = '<h3><i class="fas fa-archive"></i> Votre réserve</h3>';
    
    // Foods
    html += '<div class="inventory-section"><h4><i class="fas fa-utensils"></i> Provisions</h4><div class="inventory-items">';
    Object.entries(inventory.foods || {}).forEach(([id, count]) => {
        if (count > 0) {
            const item = SHOP_CATALOG?.food?.find(f => f.id === id);
            if (item) {
                html += `
                    <div class="inventory-item-card">
                        <div class="inventory-item-icon"><i class="fas ${getShopGlyph('food', id)}"></i></div>
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-count">x${count}</div>
                        <button class="use-btn" onclick="useInventoryItem('${id}', 'food')">Utiliser</button>
                    </div>
                `;
            }
        }
    });
    html += '</div></div>';
    
    // Boosters
    html += '<div class="inventory-section"><h4><i class="fas fa-bolt"></i> Talismans</h4><div class="inventory-items">';
    Object.entries(inventory.boosters || {}).forEach(([id, count]) => {
        if (count > 0) {
            const item = SHOP_CATALOG?.boosters?.find(b => b.id === id);
            if (item) {
                html += `
                    <div class="inventory-item-card">
                        <div class="inventory-item-icon"><i class="fas ${getShopGlyph('boosters', id)}"></i></div>
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-count">x${count}</div>
                        <button class="use-btn" onclick="useInventoryItem('${id}', 'booster')">Utiliser</button>
                    </div>
                `;
            }
        }
    });
    html += '</div></div>';
    
    // Skins
    html += '<div class="inventory-section"><h4><i class="fas fa-palette"></i> Apparences acquises</h4><div class="inventory-items">';
    (inventory.skins || []).forEach(skinId => {
        const skin = SHOP_CATALOG?.skins?.find(s => s.id === skinId);
        if (skin) {
            html += `
                <div class="inventory-item-card">
                    <div class="inventory-item-icon"><i class="fas fa-mask-face"></i></div>
                    <div class="inventory-item-name">${skin.name}</div>
                    <button class="equip-btn" onclick="equipSkin('${skinId}')">Équiper</button>
                </div>
            `;
        }
    });
    html += '</div></div>';
    
    return html;
}

function buyShopItem(category, itemId) {
    console.log(`🛒 Buying ${category}/${itemId}`);
    
    if (typeof window.shopSystem !== 'undefined' && window.shopSystem.buyItem) {
        window.shopSystem.buyItem(category, itemId);
        // Refresh shop display
        setTimeout(() => renderShopTab(document.getElementById('tab-shop')), 100);
    } else {
        showNotification('❌ Shop system not loaded', 'error');
    }
}

function equipSkin(skinId) {
    console.log(`👕 Equipping skin: ${skinId}`);
    
    if (typeof window.shopSystem !== 'undefined' && window.shopSystem.equipSkin) {
        window.shopSystem.equipSkin(skinId);
        showNotification(`✅ Skin ${skinId} équipé !`, 'success');
    } else {
        showNotification('❌ Shop system not loaded', 'error');
    }
}

function renderGamesTab(container) {
    container.innerHTML = `
        <div class="games-dashboard">
            <h2><i class="fas fa-gamepad"></i><span><small>Entraînement</small>Épreuves nocturnes</span></h2>
            <div class="games-grid">
                <div class="game-card" onclick="openMinigame('memory')">
                    <div class="game-icon"><i class="fas fa-clone"></i></div>
                    <h3>Constellations</h3>
                    <p>Retrouver les signes jumeaux</p>
                </div>
                <div class="game-card" onclick="openMinigame('simon')">
                    <div class="game-icon"><i class="fas fa-wave-square"></i></div>
                    <h3>Fréquence</h3>
                    <p>Mémoriser le chant de la balise</p>
                </div>
                <div class="game-card" onclick="openMinigame('reaction')">
                    <div class="game-icon"><i class="fas fa-crosshairs"></i></div>
                    <h3>Lueur fugitive</h3>
                    <p>Attraper le signal avant sa disparition</p>
                </div>
                <div class="game-card" onclick="openMinigame('coinrush')">
                    <div class="game-icon"><i class="fas fa-route"></i></div>
                    <h3>Course des toits</h3>
                    <p class="new-badge">NOUVEAU</p>
                    <p>Tracer le meilleur passage nocturne</p>
                </div>
            </div>
        </div>
    `;
}

function renderStatsTab(container) {
    container.innerHTML = `
        <div class="stats-dashboard">
            <h2><i class="fas fa-chart-line"></i><span><small>Carnet de route</small>Progression d’Éric</span></h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-coins"></i><h3>${dashboardState.metrics.coinsEarnedTotal.toLocaleString()}</h3>
                    <p>Pièces découvertes</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-gamepad"></i><h3>${dashboardState.metrics.minigameWins}</h3>
                    <p>Épreuves remportées</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-medal"></i><h3>${dashboardState.metrics.achievementsUnlocked}</h3>
                    <p>Souvenirs révélés</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-moon"></i><h3>${dashboardState.metrics.dailyStreakMax}</h3>
                    <p>Nuits consécutives</p>
                </div>
            </div>
            <div class="stats-charts">
                <canvas id="statsChart"></canvas>
            </div>
        </div>
    `;
}

function renderQuestsTab(container) {
    const currentChain = QUEST_CHAINS[dashboardState.currentQuestChain];
    if (!currentChain) return;
    
    let html = `
        <div class="quests-dashboard">
            <h2><i class="fas fa-compass"></i><span><small>Journal d’aventure</small>${currentChain.name}</span></h2>
            <div class="quests-list">
    `;
    
    currentChain.quests.forEach(quest => {
        const progress = getQuestProgress(quest.id);
        const isCompleted = isQuestCompleted(quest.id);
        
        html += `
            <div class="quest-card ${isCompleted ? 'completed' : ''}">
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
                <div class="quest-objectives">
                    ${quest.objectives.map(obj => `
                        <div class="objective">
                            <span>${obj.label}</span>
                            <span class="progress">${obj.current}/${obj.required}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="quest-rewards">
                    <i class="fas fa-coins"></i> ${quest.rewards.coins} <span class="reward-separator"></span><i class="fas fa-star"></i> ${quest.rewards.xp} XP
                    ${quest.rewards.skin ? `<span class="reward-separator"></span><i class="fas fa-palette"></i> ${quest.rewards.skin}` : ''}
                </div>
                ${isCompleted ? '<div class="completed-badge"><i class="fas fa-check"></i> Accomplie</div>' : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderEventsTab(container) {
    const activeEvent = dashboardState.activeEvent;
    
    if (!activeEvent) {
        container.innerHTML = `
            <div class="events-dashboard">
                <h2><i class="fas fa-calendar-alt"></i><span><small>Phénomènes rares</small>Événements</span></h2>
                <div class="no-event"><i class="fas fa-cloud-moon"></i><strong>La nuit est calme</strong><p>De nouveaux phénomènes apparaîtront au fil des aventures.</p></div>
            </div>
        `;
        return;
    }
    
    const event = EVENT_CALENDAR[activeEvent];
    container.innerHTML = `
        <div class="events-dashboard active-event">
            <h2>${event.name}</h2>
            <div class="event-info">
                <p>Participe à cet événement spécial pour gagner des récompenses exclusives !</p>
            </div>
            <div class="event-challenges">
                ${event.challenges.map(challenge => `
                    <div class="challenge-card">
                        <h3>${challenge.label}</h3>
                        <div class="challenge-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(dashboardState.eventProgress[challenge.id] || 0) / challenge.required * 100}%"></div>
                            </div>
                            <span>${dashboardState.eventProgress[challenge.id] || 0} / ${challenge.required}</span>
                        </div>
                        <div class="challenge-reward"><i class="fas fa-coins"></i> ${challenge.reward}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAchievementsTab(container) {
    let html = `
        <div class="achievements-dashboard">
            <h2><i class="fas fa-trophy"></i><span><small>Cabinet des souvenirs</small>Trophées</span></h2>
            <div class="achievement-points">
                <h3>${dashboardState.achievementPoints} Points</h3>
            </div>
            <div class="achievements-list">
    `;
    
    Object.entries(ACHIEVEMENT_CATALOG).forEach(([key, achievement]) => {
        html += `
            <div class="achievement-category">
                <h3><i class="fas fa-star"></i> ${achievement.name}</h3>
                <div class="achievement-tiers">
        `;
        
        Object.entries(achievement.tiers).forEach(([tier, data]) => {
            const tierInfo = ACHIEVEMENT_TIERS[tier];
            const isUnlocked = checkAchievementUnlocked(key, tier);
            
            html += `
                <div class="achievement-tier ${isUnlocked ? 'unlocked' : ''}">
                    <div class="tier-icon" style="--tier-color: ${tierInfo.color}"><i class="fas fa-medal"></i></div>
                    <div class="tier-info">
                        <h4>${tier.toUpperCase()}</h4>
                        <p>${Object.values(data)[0]} ${Object.keys(data)[0]}</p>
                        <span class="tier-reward"><i class="fas fa-coins"></i> ${data.reward}</span>
                    </div>
                    ${isUnlocked ? '<span class="unlocked-badge"><i class="fas fa-check"></i></span>' : ''}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderSettingsTab(container) {
    container.innerHTML = `
        <div class="settings-dashboard">
            <h2><i class="fas fa-sliders-h"></i><span><small>Préférences du voyage</small>Réglages</span></h2>
            
            <!-- HUD Settings -->
            <div class="settings-section">
                <h3><i class="fas fa-eye"></i> Interface</h3>
                <div class="settings-group">
                    <label>
                        <span>Opacité HUD (%)</span>
                        <input type="range" id="hudOpacity" min="0" max="100" value="90" 
                               oninput="updateHudOpacity(this.value)">
                        <span id="hudOpacityValue">90%</span>
                    </label>
                    <label>
                        <span>Opacité Fond (%)</span>
                        <input type="range" id="hudBgOpacity" min="0" max="100" value="80" 
                               oninput="updateHudBgOpacity(this.value)">
                        <span id="hudBgOpacityValue">80%</span>
                    </label>
                </div>
            </div>
            
            <!-- Position Settings -->
            <div class="settings-section">
                <h3><i class="fas fa-arrows-alt"></i> Position du compagnon</h3>
                <div class="settings-group">
                    <label>
                        <span>Position Éric (Bas - rem)</span>
                        <input type="range" id="ericBottom" min="0" max="20" step="0.5" value="2" 
                               oninput="updateEricPosition()">
                        <span id="ericBottomValue">2rem</span>
                    </label>
                    <label>
                        <span>Position Éric (Droite - rem)</span>
                        <input type="range" id="ericRight" min="0" max="20" step="0.5" value="2" 
                               oninput="updateEricPosition()">
                        <span id="ericRightValue">2rem</span>
                    </label>
                    <label>
                        <span>Taille Éric (px)</span>
                        <input type="range" id="ericSize" min="60" max="120" value="80" 
                               oninput="updateEricSize()">
                        <span id="ericSizeValue">80px</span>
                    </label>
                </div>
            </div>
            
            <!-- Reset Button -->
            <div class="settings-section">
                <h3><i class="fas fa-toolbox"></i> Données de voyage</h3>
                <button onclick="resetGamingSettings()" class="action-btn danger">
                    <i class="fas fa-undo"></i> Réinitialiser les réglages
                </button>
                <button onclick="exportGamingData()" class="action-btn">
                    <i class="fas fa-file-export"></i> Exporter les données
                </button>
            </div>
        </div>
    `;
    
    // Load saved settings
    loadHudSettings();
    loadHudPositions();
}

/* ============================================
   🎯 QUEST SYSTEM FUNCTIONS
   ============================================ */

function initQuestSystem() {
    // Load quest progress
    if (!dashboardState.activeQuests.length) {
        // Start with welcome arc
        const welcomeChain = QUEST_CHAINS.welcome_arc;
        if (welcomeChain) {
            dashboardState.activeQuests.push(welcomeChain.quests[0].id);
        }
    }
}

function getQuestProgress(questId) {
    return dashboardState.metrics[`quest_${questId}`] || 0;
}

function isQuestCompleted(questId) {
    return dashboardState.completedQuests.includes(questId);
}

function updateQuestProgress(questId, objectiveType, amount = 1) {
    // Find quest
    let quest = null;
    let chain = null;
    
    for (const [chainKey, chainData] of Object.entries(QUEST_CHAINS)) {
        const foundQuest = chainData.quests.find(q => q.id === questId);
        if (foundQuest) {
            quest = foundQuest;
            chain = chainKey;
            break;
        }
    }
    
    if (!quest) return;
    
    // Update objectives
    quest.objectives.forEach(obj => {
        if (obj.type === objectiveType) {
            obj.current = Math.min(obj.current + amount, obj.required);
        }
    });
    
    // Check if quest completed
    const allCompleted = quest.objectives.every(obj => obj.current >= obj.required);
    
    if (allCompleted && !isQuestCompleted(questId)) {
        completeQuest(quest, chain);
    }
    
    saveDashboardState();
}

function completeQuest(quest, chain) {
    // Mark as completed
    dashboardState.completedQuests.push(quest.id);
    
    // Give rewards
    if (window.gameplaySystem) {
        window.gameplaySystem.addCoins(quest.rewards.coins, 'quest_complete');
        window.gameplaySystem.addXP(quest.rewards.xp);
    }
    
    // Show story
    showQuestStory(quest.story);
    
    // Unlock next quest in chain
    const chainData = QUEST_CHAINS[chain];
    const currentIndex = chainData.quests.findIndex(q => q.id === quest.id);
    if (currentIndex !== -1 && currentIndex < chainData.quests.length - 1) {
        const nextQuest = chainData.quests[currentIndex + 1];
        dashboardState.activeQuests.push(nextQuest.id);
    }
    
    // Show completion notification
    showNotification(`✅ Quête Complétée : ${quest.title}`, 'success');
    
    saveDashboardState();
}

function showQuestStory(story) {
    const notification = document.createElement('div');
    notification.className = 'quest-story-popup';
    notification.innerHTML = `
        <div class="story-content">
            <p>${story}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
}

/* ============================================
   🎁 EVENT SYSTEM FUNCTIONS
   ============================================ */

function checkActiveEvents() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = now.getDay();
    
    // Check seasonal events
    for (const [key, event] of Object.entries(EVENT_CALENDAR)) {
        if (event.recurring === 'weekly') {
            // Weekend boost
            if (dayOfWeek >= event.startDay || dayOfWeek <= event.endDay) {
                activateEvent(key);
                return;
            }
        } else if (event.dateCheck) {
            // Special date check (Friday 13)
            if (event.dateCheck(now)) {
                activateEvent(key);
                return;
            }
        } else if (event.startDate && event.endDate) {
            // Date range events
            const inRange = 
                (month > event.startDate.month || (month === event.startDate.month && day >= event.startDate.day)) &&
                (month < event.endDate.month || (month === event.endDate.month && day <= event.endDate.day));
            
            if (inRange) {
                activateEvent(key);
                return;
            }
        }
    }
    
    // No active event
    dashboardState.activeEvent = null;
}

function activateEvent(eventKey) {
    if (dashboardState.activeEvent !== eventKey) {
        dashboardState.activeEvent = eventKey;
        const event = EVENT_CALENDAR[eventKey];
        
        showNotification(`🎉 ${event.name} est maintenant actif !`, 'event');
        
        // Apply theme if exists
        if (event.theme) {
            applyEventTheme(event.theme);
        }
        
        saveDashboardState();
    }
}

function applyEventTheme(theme) {
    if (theme.background) {
        document.documentElement.style.setProperty('--event-bg', theme.background);
    }
    if (theme.particles) {
        // Could trigger particle system with themed particles
    }
}

/* ============================================
   🏆 ACHIEVEMENT FUNCTIONS
   ============================================ */

function checkAchievementUnlocked(achievementKey, tier) {
    const achievement = dashboardState.achievements[achievementKey];
    return achievement && achievement[tier] === true;
}

function unlockAchievement(achievementKey, tier = 'bronze') {
    if (!dashboardState.achievements[achievementKey]) {
        dashboardState.achievements[achievementKey] = {};
    }
    
    // Safety check: ensure tier is valid
    if (!tier || !ACHIEVEMENT_TIERS[tier]) {
        console.warn(`⚠️ Invalid tier for achievement ${achievementKey}:`, tier, '- using bronze as fallback');
        tier = 'bronze';
    }
    
    if (!dashboardState.achievements[achievementKey][tier]) {
        dashboardState.achievements[achievementKey][tier] = true;
        
        const tierInfo = ACHIEVEMENT_TIERS[tier];
        dashboardState.achievementPoints += tierInfo.points;
        dashboardState.metrics.achievementsUnlocked++;
        
        const achievement = ACHIEVEMENT_CATALOG[achievementKey];
        if (!achievement || !achievement.tiers || !achievement.tiers[tier]) {
            console.warn(`⚠️ Achievement ${achievementKey} not found in catalog or missing tier ${tier}`);
            return;
        }
        const reward = achievement.tiers[tier].reward;
        
        if (window.gameplaySystem) {
            window.gameplaySystem.addCoins(reward, 'achievement_unlock');
        }
        
        showAchievementUnlock(achievement.name, tier);
        
        saveDashboardState();
    }
}

function showAchievementUnlock(name, tier) {
    const tierInfo = ACHIEVEMENT_TIERS[tier];
    showNotification(`${tierInfo.icon} Achievement Débloqué : ${name} (${tier.toUpperCase()})`, 'achievement');
}

/* ============================================
   🎰 GACHA / LOOTBOX FUNCTIONS
   ============================================ */

function openLootbox(boxType) {
    const box = LOOTBOX_CATALOG[boxType];
    if (!box) return;
    
    // Check if player has enough coins
    if (!window.gameplaySystem || !window.gameplaySystem.spendCoins(box.price)) {
        showNotification('❌ Pas assez de coins !', 'error');
        return;
    }
    
    // Increment counters
    dashboardState.lootboxesOpened++;
    dashboardState.pityCounter++;
    
    // Determine drop with pity system
    const drop = rollLootboxDrop(box, dashboardState.pityCounter);
    
    // Reset pity if legendary
    if (drop.rarity === 'legendary') {
        dashboardState.pityCounter = 0;
    }
    
    // Show opening animation
    showLootboxOpening(box, drop);
    
    // Give rewards
    applyLootboxRewards(drop);
    
    saveDashboardState();
}

function rollLootboxDrop(box, pityCounter) {
    // Pity system override
    if (PITY_SYSTEM.enabled) {
        if (pityCounter >= PITY_SYSTEM.guaranteedLegendaryEvery) {
            return { type: 'skin', item: 'legendary_pity', rarity: 'legendary', value: 0 };
        }
    }
    
    // Normal roll
    const totalWeight = box.drops.reduce((sum, drop) => sum + drop.weight, 0);
    let roll = Math.random() * totalWeight;
    
    for (const drop of box.drops) {
        roll -= drop.weight;
        if (roll <= 0) {
            // Select item from drop
            if (drop.type === 'coins') {
                return {
                    type: 'coins',
                    value: Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min,
                    rarity: box.rarity
                };
            } else if (drop.items) {
                const item = drop.items[Math.floor(Math.random() * drop.items.length)];
                return {
                    type: drop.type,
                    item: item,
                    rarity: box.rarity,
                    value: 0
                };
            }
        }
    }
    
    // Fallback
    return { type: 'coins', value: 50, rarity: 'common' };
}

function showLootboxOpening(box, drop) {
    // Create animation overlay
    const overlay = document.createElement('div');
    overlay.className = 'lootbox-opening-overlay';
    overlay.innerHTML = `
        <div class="lootbox-animation">
            <div class="box-icon">${box.icon}</div>
            <h2>Ouverture...</h2>
            <div class="loading-spinner"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Show result after animation
    setTimeout(() => {
        overlay.innerHTML = `
            <div class="lootbox-result ${drop.rarity}">
                <h2>🎉 Récompense !</h2>
                <div class="drop-display">
                    ${drop.type === 'coins' ? `🪙 ${drop.value} Coins` : `${getDropIcon(drop.type)} ${drop.item}`}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="claim-btn">
                    Récupérer
                </button>
            </div>
        `;
    }, 2000);
}

function getDropIcon(type) {
    const icons = {
        food: '🍔',
        skin: '🎨',
        booster: '⚡',
        title: '👑',
        pet: '🐾'
    };
    return icons[type] || '🎁';
}

function applyLootboxRewards(drop) {
    if (drop.type === 'coins' && window.gameplaySystem) {
        window.gameplaySystem.addCoins(drop.value, 'lootbox');
    } else if (drop.type === 'skin') {
        // Add skin to inventory
        if (!window.gameplaySystem.gameState.stats.skinsUnlocked.includes(drop.item)) {
            window.gameplaySystem.gameState.stats.skinsUnlocked.push(drop.item);
        }
    }
    // Add other reward types as needed
}

/* ============================================
   ♻️ PRESTIGE FUNCTIONS
   ============================================ */

function canPrestige() {
    if (!window.gameplaySystem) return false;
    return window.gameplaySystem.gameState.level >= PRESTIGE_CONFIG.minLevel;
}

function performPrestige() {
    if (!canPrestige()) {
        showNotification('❌ Niveau 50 requis pour Prestige !', 'error');
        return;
    }
    
    // Confirm
    if (!confirm('Êtes-vous sûr de vouloir faire Prestige ? Votre niveau sera réinitialisé mais vous gagnerez +10% coins/XP permanent !')) {
        return;
    }
    
    // Increment prestige
    dashboardState.prestigeLevel++;
    dashboardState.prestigeMultiplier += PRESTIGE_CONFIG.bonusPerPrestige;
    
    // Reset progress but keep items
    if (window.gameplaySystem) {
        const gameState = window.gameplaySystem.gameState;
        
        // Keep skins, achievements, titles
        const keepData = {
            skinsUnlocked: [...gameState.stats.skinsUnlocked],
            achievementsUnlocked: dashboardState.achievementPoints,
            completedQuests: [...dashboardState.completedQuests]
        };
        
        // Reset
        gameState.level = 1;
        gameState.xp = 0;
        gameState.coins = 0;
        
        // Restore kept data
        gameState.stats.skinsUnlocked = keepData.skinsUnlocked;
        
        window.gameplaySystem.saveGameState();
    }
    
    // Show prestige notification
    const prestigeReward = PRESTIGE_CONFIG.prestigeRewards.find(r => r.level === dashboardState.prestigeLevel);
    if (prestigeReward) {
        showNotification(`${prestigeReward.icon} Prestige ${dashboardState.prestigeLevel} Atteint ! +${prestigeReward.bonus * 100}% permanent !`, 'prestige');
    }
    
    saveDashboardState();
}

/* ============================================
   🔧 UTILITY FUNCTIONS
   ============================================ */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('active'), 100);
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ============================================
   🌐 GLOBAL API EXPOSURE
   ============================================ */

window.gamingDashboard = {
    init: initGamingDashboard,
    toggle: toggleDashboard,
    switchTab: switchDashboardTab,
    
    // Quest API
    updateQuest: updateQuestProgress,
    completeQuest: completeQuest,
    
    // Event API
    checkEvents: checkActiveEvents,
    
    // Achievement API
    unlockAchievement: unlockAchievement,
    
    // Gacha API
    openLootbox: openLootbox,
    
    // Prestige API
    canPrestige: canPrestige,
    prestige: performPrestige,
    
    // State access
    getState: () => dashboardState,
    saveState: saveDashboardState
};

console.log('🎮 Gaming Dashboard v2.0 - Module loaded!');
