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
    
    if (dashboardState.isOpen) {
        dashboard.classList.remove('hidden');
        dashboard.classList.add('active');
        
        // Start session timer
        dashboardState.lastSessionStart = Date.now();
    } else {
        dashboard.classList.remove('active');
        dashboard.classList.add('hidden');
        
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
    container.innerHTML = `
        <div class="eric-world">
            <h2>🐱 Monde d'Éric</h2>
            <div class="eric-stage">
                <!-- Éric will be rendered here by existing tamagotchi system -->
                <div id="eric-container"></div>
            </div>
            <div class="eric-actions">
                <button onclick="feedEricFromDashboard()" class="action-btn">
                    🍔 Nourrir
                </button>
                <button onclick="playWithEricFromDashboard()" class="action-btn">
                    🎾 Jouer
                </button>
                <button onclick="cuddleEricFromDashboard()" class="action-btn">
                    🤗 Câliner
                </button>
            </div>
        </div>
    `;
}

function renderShopTab(container) {
    container.innerHTML = `
        <div class="shop-dashboard">
            <h2>🛒 Boutique Gaming</h2>
            <p>Le shop existant sera intégré ici</p>
            <button onclick="window.shopSystem?.openShop()" class="action-btn">
                Ouvrir le Shop Complet
            </button>
        </div>
    `;
}

function renderGamesTab(container) {
    container.innerHTML = `
        <div class="games-dashboard">
            <h2>🎮 Mini-Jeux</h2>
            <div class="games-grid">
                <div class="game-card" onclick="openMinigame('memory')">
                    <div class="game-icon">🧠</div>
                    <h3>Memory Match</h3>
                    <p>Trouve les paires</p>
                </div>
                <div class="game-card" onclick="openMinigame('simon')">
                    <div class="game-icon">🎵</div>
                    <h3>Simon Says</h3>
                    <p>Mémorise la séquence</p>
                </div>
                <div class="game-card" onclick="openMinigame('reaction')">
                    <div class="game-icon">⚡</div>
                    <h3>Reaction Time</h3>
                    <p>Teste tes réflexes</p>
                </div>
                <div class="game-card" onclick="openMinigame('coinrush')">
                    <div class="game-icon">🪙</div>
                    <h3>Coin Rush</h3>
                    <p class="new-badge">NOUVEAU</p>
                    <p>Course aux pièces</p>
                </div>
            </div>
        </div>
    `;
}

function renderStatsTab(container) {
    container.innerHTML = `
        <div class="stats-dashboard">
            <h2>📊 Statistiques</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>🪙 ${dashboardState.metrics.coinsEarnedTotal.toLocaleString()}</h3>
                    <p>Coins Gagnés Total</p>
                </div>
                <div class="stat-card">
                    <h3>🎮 ${dashboardState.metrics.minigameWins}</h3>
                    <p>Victoires Mini-Jeux</p>
                </div>
                <div class="stat-card">
                    <h3>🏆 ${dashboardState.metrics.achievementsUnlocked}</h3>
                    <p>Achievements Débloqués</p>
                </div>
                <div class="stat-card">
                    <h3>🔥 ${dashboardState.metrics.dailyStreakMax}</h3>
                    <p>Meilleure Série</p>
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
            <h2>⭐ ${currentChain.icon} ${currentChain.name}</h2>
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
                    🪙 ${quest.rewards.coins} | ⭐ ${quest.rewards.xp}XP
                    ${quest.rewards.skin ? `| 🎨 ${quest.rewards.skin}` : ''}
                </div>
                ${isCompleted ? '<div class="completed-badge">✅ Complété</div>' : ''}
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
                <h2>🎁 Événements</h2>
                <p class="no-event">Aucun événement actif pour le moment</p>
                <p>Reviens plus tard pour des événements spéciaux !</p>
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
                        <div class="challenge-reward">🪙 ${challenge.reward}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAchievementsTab(container) {
    let html = `
        <div class="achievements-dashboard">
            <h2>🏆 Achievements</h2>
            <div class="achievement-points">
                <h3>${dashboardState.achievementPoints} Points</h3>
            </div>
            <div class="achievements-list">
    `;
    
    Object.entries(ACHIEVEMENT_CATALOG).forEach(([key, achievement]) => {
        html += `
            <div class="achievement-category">
                <h3>${achievement.icon} ${achievement.name}</h3>
                <div class="achievement-tiers">
        `;
        
        Object.entries(achievement.tiers).forEach(([tier, data]) => {
            const tierInfo = ACHIEVEMENT_TIERS[tier];
            const isUnlocked = checkAchievementUnlocked(key, tier);
            
            html += `
                <div class="achievement-tier ${isUnlocked ? 'unlocked' : ''}">
                    <div class="tier-icon" style="color: ${tierInfo.color}">${tierInfo.icon}</div>
                    <div class="tier-info">
                        <h4>${tier.toUpperCase()}</h4>
                        <p>${Object.values(data)[0]} ${Object.keys(data)[0]}</p>
                        <span class="tier-reward">🪙 ${data.reward}</span>
                    </div>
                    ${isUnlocked ? '<span class="unlocked-badge">✅</span>' : ''}
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
