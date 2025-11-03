/**
 * 🎮 TAMAGOTCHI GAMEPLAY SYSTEM
 * Version 2.0 - Vraie boucle de jeu addictive
 * 
 * Features:
 * - Système de coins (monnaie virtuelle)
 * - Shop avec nourriture premium & skins
 * - Évolution d'Éric (4 formes : chaton → adulte → pro → légendaire)
 * - XP et niveaux
 * - Daily rewards & streak system
 * - Quêtes principales
 * - Conséquences réelles mood/hunger
 * - Mini-jeux améliorés avec difficulté
 */

// ============================================
// STUB FUNCTIONS (Prevent errors when called before definition)
// ============================================
function checkQuestCompletion(questId) {
    console.log(`🔧 [STUB] checkQuestCompletion(${questId}) called - Implementation pending`);
    // Will be implemented below
}

// ============================================
// ÉTAT DU JEU (Extension de tamaState)
// ============================================

let gameState = {
    // Économie
    coins: 0,
    coinsLifetime: 0,  // Total gagné (pour achievements)
    
    // Progression
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    
    // Évolution d'Éric
    evolution: 'chaton',  // chaton | adulte | pro | legendaire
    skin: 'default',      // Skin actuel équipé
    
    // Daily system
    lastVisit: Date.now(),
    streak: 0,
    dailyRewardClaimed: false,
    dailyChallenges: [],
    
    // Quêtes
    quests: {
        firstImpression: { completed: false, progress: 0, max: 3 },      // Atteindre niveau 3
        cvExplorer: { completed: false, progress: 0, max: 5 },           // Voir 5 sections
        miniGameMaster: { completed: false, progress: 0, max: 4 },       // Gagner 10 fois chaque jeu
        streakMaster: { completed: false, progress: 0, max: 7 }          // 7 jours consécutifs
    },
    
    // Stats
    stats: {
        cvSectionsVisited: new Set(),
        emailsSent: 0,
        downloadsCV: 0,
        minigamesWon: 0,
        minigamesPlayed: 0,
        coinsSpent: 0,
        skinsUnlocked: ['default'],
        itemsBought: 0
    },
    
    // Inventaire
    inventory: {
        boosters: {
            xpBoost: 0,           // Nombre de boosters XP x2
            coinBoost: 0,         // Nombre de boosters coins x2
            autoFeed: 0,          // Nombre d'auto-feed 1h
            moodProtection: 0     // Nombre de protections mood
        },
        foods: {
            burger: 0,
            pizza: 0,
            sushi: 0,
            cake: 0
        }
    },
    
    // Boosters actifs
    activeBooters: {
        xpBoost: { active: false, expiresAt: 0 },
        coinBoost: { active: false, expiresAt: 0 },
        autoFeed: { active: false, expiresAt: 0 },
        moodProtection: { active: false, expiresAt: 0 }
    }
};

// ============================================
// CONFIGURATION GAMEPLAY
// ============================================

const GAMEPLAY_CONFIG = {
    // Gains de coins
    COIN_REWARDS: {
        EMAIL_SENT: 50,
        CV_DOWNLOAD: 100,
        SKILL_VIEWED: 25,
        VIDEO_WATCHED: 75,
        ACHIEVEMENT_UNLOCK: 150,
        MINIGAME_WIN_EASY: 20,
        MINIGAME_WIN_MEDIUM: 50,
        MINIGAME_WIN_HARD: 100,
        MINIGAME_WIN_EXPERT: 250,
        ERIC_HAPPY_PER_MIN: 10,  // Si mood > 80
        DAILY_REWARD_BASE: 200,
        STREAK_BONUS_MULTIPLIER: 1.5,  // x1.5 par jour de streak
        SECTION_EXPLORED: 30
    },
    
    // XP
    XP_REWARDS: {
        MINIGAME_WIN: 10,
        ERIC_FED: 5,
        ERIC_PLAYED: 8,
        QUEST_COMPLETED: 100,
        LEVEL_UP_MULTIPLIER: 1.2  // XP needed increases 20% per level
    },
    
    // Évolution
    EVOLUTION_THRESHOLDS: {
        CHATON: 1,      // Niveau 1-5
        ADULTE: 6,      // Niveau 6-10
        PRO: 11,        // Niveau 11-20
        LEGENDAIRE: 21  // Niveau 21+
    },
    
    // Bonus évolution
    EVOLUTION_BONUSES: {
        chaton: { coinMultiplier: 1.0, xpMultiplier: 1.0 },
        adulte: { coinMultiplier: 1.1, xpMultiplier: 1.1 },
        pro: { coinMultiplier: 1.25, xpMultiplier: 1.2 },
        legendaire: { coinMultiplier: 1.5, xpMultiplier: 1.5 }
    },
    
    // Conséquences mood/hunger
    MOOD_CONSEQUENCES: {
        HAPPY_THRESHOLD: 80,
        SAD_THRESHOLD: 20,
        HAPPY_COIN_BONUS: 0.25,      // +25% coins
        HAPPY_XP_BONUS: 0.15,         // +15% XP
        SAD_COIN_PENALTY: -0.5,       // -50% coins
        SAD_XP_PENALTY: -0.25,        // -25% XP
        SAD_SHOP_DISABLED: true
    },
    
    HUNGER_CONSEQUENCES: {
        HUNGRY_THRESHOLD: 20,
        HUNGRY_COIN_PENALTY: -0.3,    // -30% coins
        HUNGRY_MOOD_SPEED: 2.0,       // Mood décroit 2x plus vite
        HUNGRY_MINIGAMES_DISABLED: true
    },
    
    // Shop prices
    SHOP_PRICES: {
        // Nourriture
        burger: 50,
        pizza: 100,
        sushi: 200,
        cake: 500,
        
        // Skins
        skin_sunglasses: 1000,
        skin_business: 1500,
        skin_gamer: 2000,
        skin_halloween: 2500,
        skin_christmas: 2500,
        skin_royal: 5000,
        skin_legendary: 10000,
        
        // Boosters
        xpBoost: 300,
        coinBoost: 500,
        autoFeed: 400,
        moodProtection: 600,
        
        // Loot boxes
        lootBoxBasic: 200,
        lootBoxPremium: 500,
        lootBoxLegendary: 1000
    },
    
    // Daily challenges
    DAILY_CHALLENGES_POOL: [
        { id: 'play5games', type: 'minigames', target: 5, reward: 100, description: 'Jouer 5 mini-jeux' },
        { id: 'keepHappy30', type: 'mood', target: 30, reward: 150, description: 'Garder Éric heureux 30 min' },
        { id: 'sendEmail', type: 'cv', target: 1, reward: 200, description: 'Envoyer un email depuis le CV' },
        { id: 'downloadCV', type: 'cv', target: 1, reward: 250, description: 'Télécharger le CV PDF' },
        { id: 'unlock2Achievements', type: 'achievements', target: 2, reward: 300, description: 'Débloquer 2 achievements' },
        { id: 'changeTheme', type: 'cv', target: 1, reward: 50, description: 'Changer le thème du CV' }
    ]
};

// ============================================
// SYSTÈME DE COINS
// ============================================

/**
 * Ajouter des coins avec multiplicateurs
 */
function addCoins(amount, source = 'unknown') {
    if (!gamingMode) return;
    
    let finalAmount = amount;
    
    // Appliquer multiplicateur évolution
    const evolutionBonus = GAMEPLAY_CONFIG.EVOLUTION_BONUSES[gameState.evolution];
    finalAmount *= evolutionBonus.coinMultiplier;
    
    // Appliquer booster actif
    if (gameState.activeBooters.coinBoost.active) {
        if (Date.now() < gameState.activeBooters.coinBoost.expiresAt) {
            finalAmount *= 2;
        } else {
            gameState.activeBooters.coinBoost.active = false;
        }
    }
    
    // Appliquer bonus mood
    if (tamaState.mood >= GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.HAPPY_THRESHOLD) {
        finalAmount *= (1 + GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.HAPPY_COIN_BONUS);
    }
    
    // Appliquer malus mood
    if (tamaState.mood <= GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.SAD_THRESHOLD) {
        finalAmount *= (1 + GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.SAD_COIN_PENALTY);
    }
    
    // Appliquer malus hunger
    if (tamaState.hunger <= GAMEPLAY_CONFIG.HUNGER_CONSEQUENCES.HUNGRY_THRESHOLD) {
        finalAmount *= (1 + GAMEPLAY_CONFIG.HUNGER_CONSEQUENCES.HUNGRY_COIN_PENALTY);
    }
    
    finalAmount = Math.floor(finalAmount);
    
    gameState.coins += finalAmount;
    gameState.coinsLifetime += finalAmount;
    
    // Notification unifiée (plus de fallback showCoinGain)
    if (typeof window.unifiedNotifications !== 'undefined') {
        window.unifiedNotifications.notifyCoinsGained(finalAmount, source);
    }
    // Ancien système showCoinGain() désactivé - tout passe par notifications unifiées
    
    // Sauvegarder
    saveGameState();
    updateGameUI();
    
    console.log(`💰 +${finalAmount} coins (source: ${source})`);
}

/**
 * Retirer des coins (achats)
 */
function spendCoins(amount) {
    if (gameState.coins < amount) {
        showNotification('❌ Pas assez de coins!', 'error');
        return false;
    }
    
    gameState.coins -= amount;
    gameState.stats.coinsSpent += amount;
    saveGameState();
    updateGameUI();
    
    console.log(`💸 -${amount} coins`);
    return true;
}

/**
 * Animation gain de coins
 */
function showCoinGain(amount, source) {
    const notification = document.createElement('div');
    notification.className = 'coin-gain-notification';
    notification.textContent = `+${amount} 🪙`;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 10003;
        box-shadow: 0 10px 40px rgba(251, 191, 36, 0.5);
        animation: coinGainAnim 1.5s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 1500);
}

// Animation CSS pour coin gain
if (!document.getElementById('coinGainStyle')) {
    const style = document.createElement('style');
    style.id = 'coinGainStyle';
    style.textContent = `
        @keyframes coinGainAnim {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -70%) scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// SYSTÈME XP & NIVEAUX
// ============================================

/**
 * Ajouter de l'XP
 */
function addXP(amount, source = 'unknown') {
    if (!gamingMode) return;
    
    let finalAmount = amount;
    
    // Appliquer multiplicateur évolution
    const evolutionBonus = GAMEPLAY_CONFIG.EVOLUTION_BONUSES[gameState.evolution];
    finalAmount *= evolutionBonus.xpMultiplier;
    
    // Appliquer booster actif
    if (gameState.activeBooters.xpBoost.active) {
        if (Date.now() < gameState.activeBooters.xpBoost.expiresAt) {
            finalAmount *= 2;
        } else {
            gameState.activeBooters.xpBoost.active = false;
        }
    }
    
    // Appliquer bonus mood
    if (tamaState.mood >= GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.HAPPY_THRESHOLD) {
        finalAmount *= (1 + GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.HAPPY_XP_BONUS);
    }
    
    // Appliquer malus mood
    if (tamaState.mood <= GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.SAD_THRESHOLD) {
        finalAmount *= (1 + GAMEPLAY_CONFIG.MOOD_CONSEQUENCES.SAD_XP_PENALTY);
    }
    
    finalAmount = Math.floor(finalAmount);
    
    gameState.xp += finalAmount;
    
    // Notification unifiée pour XP
    if (typeof window.unifiedNotifications !== 'undefined') {
        window.unifiedNotifications.notifyXPGained(finalAmount, gameState.level, source);
    }
    
    // Check level up
    checkLevelUp();
    
    saveGameState();
    updateGameUI();
    
    console.log(`⭐ +${finalAmount} XP (source: ${source})`);
}

/**
 * Vérifier et gérer level up
 */
function checkLevelUp() {
    while (gameState.xp >= gameState.xpToNextLevel) {
        gameState.xp -= gameState.xpToNextLevel;
        gameState.level++;
        
        // Calculer XP pour prochain niveau
        gameState.xpToNextLevel = Math.floor(
            100 * Math.pow(GAMEPLAY_CONFIG.XP_REWARDS.LEVEL_UP_MULTIPLIER, gameState.level - 1)
        );
        
        // Notification level up
        showLevelUpNotification();
        
        // Check évolution
        checkEvolution();
        
        // Récompense level up
        addCoins(gameState.level * 50, 'level_up');
        
        // Unlock achievement si besoin
        checkLevelAchievements();
    }
}

/**
 * Notification level up
 */
function showLevelUpNotification() {
    // Utiliser notification unifiée en priorité
    if (typeof window.unifiedNotifications !== 'undefined') {
        window.unifiedNotifications.notifyLevelUp(gameState.level);
    } else {
        showNotification(
            `🎉 Niveau ${gameState.level}! +${gameState.level * 50} coins`,
            'success',
            3000
        );
    }
    
    // Vibration
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }
}

// ============================================
// SYSTÈME D'ÉVOLUTION
// ============================================

/**
 * Vérifier et appliquer évolution
 */
function checkEvolution() {
    const level = gameState.level;
    let newEvolution = gameState.evolution;
    
    if (level >= GAMEPLAY_CONFIG.EVOLUTION_THRESHOLDS.LEGENDAIRE) {
        newEvolution = 'legendaire';
    } else if (level >= GAMEPLAY_CONFIG.EVOLUTION_THRESHOLDS.PRO) {
        newEvolution = 'pro';
    } else if (level >= GAMEPLAY_CONFIG.EVOLUTION_THRESHOLDS.ADULTE) {
        newEvolution = 'adulte';
    } else {
        newEvolution = 'chaton';
    }
    
    if (newEvolution !== gameState.evolution) {
        const oldEvolution = gameState.evolution;
        gameState.evolution = newEvolution;
        
        showEvolutionAnimation(oldEvolution, newEvolution);
        updateEricVisual();
        
        saveGameState();
    }
}

/**
 * Animation d'évolution
 */
function showEvolutionAnimation(oldEvolution, newEvolution) {
    const evolutionNames = {
        chaton: 'Chaton 🐱',
        adulte: 'Chat Adulte 😺',
        pro: 'Chat Pro 😎',
        legendaire: 'Chat Légendaire 👑'
    };
    
    showNotification(
        `✨ Évolution! ${evolutionNames[oldEvolution]} → ${evolutionNames[newEvolution]}`,
        'epic',
        5000
    );
    
    // Animation sparkle sur Éric
    const tamaElement = document.querySelector('.tamagotchi');
    if (tamaElement) {
        tamaElement.style.animation = 'evolutionSparkle 2s ease';
        setTimeout(() => {
            tamaElement.style.animation = '';
        }, 2000);
    }
}

/**
 * Mettre à jour l'apparence visuelle d'Éric
 */
function updateEricVisual() {
    const tamaElement = document.querySelector('.tamagotchi');
    if (!tamaElement) return;
    
    // Changer l'emoji selon évolution et skin
    let emoji = '🐱';
    
    switch (gameState.evolution) {
        case 'adulte':
            emoji = '😺';
            break;
        case 'pro':
            emoji = '😎';
            break;
        case 'legendaire':
            emoji = '👑';
            break;
        default:
            emoji = '🐱';
    }
    
    // Appliquer skin si équipé (override emoji)
    if (gameState.skin !== 'default') {
        emoji = getSkinEmoji(gameState.skin);
    }
    
    tamaElement.textContent = emoji;
    
    // Ajouter aura pour légendaire
    if (gameState.evolution === 'legendaire') {
        tamaElement.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)';
        tamaElement.style.border = '3px solid gold';
    }
}

/**
 * Obtenir emoji du skin
 */
function getSkinEmoji(skinId) {
    const skins = {
        default: '🐱',
        sunglasses: '😎',
        business: '👔',
        gamer: '🎮',
        halloween: '🎃',
        christmas: '🎅',
        royal: '👑',
        legendary: '🔥'
    };
    
    return skins[skinId] || '🐱';
}

// ============================================
// SYSTÈME DE DAILY REWARDS
// ============================================

/**
 * Vérifier daily reward
 */
function checkDailyReward() {
    const now = Date.now();
    const lastVisit = gameState.lastVisit;
    const timeDiff = now - lastVisit;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Check si nouveau jour
    const lastVisitDate = new Date(lastVisit).toDateString();
    const nowDate = new Date(now).toDateString();
    
    if (lastVisitDate !== nowDate) {
        // Nouveau jour
        
        // Check si streak continue (< 48h)
        if (timeDiff < oneDayMs * 2) {
            gameState.streak++;
        } else {
            // Streak cassé
            gameState.streak = 1;
        }
        
        gameState.dailyRewardClaimed = false;
        gameState.lastVisit = now;
        
        // Générer nouveaux daily challenges
        generateDailyChallenges();
        
        saveGameState();
        
        // Afficher popup daily reward
        showDailyRewardPopup();
    }
}

/**
 * Popup daily reward
 */
function showDailyRewardPopup() {
    if (gameState.dailyRewardClaimed) return;
    
    const streak = gameState.streak;
    const baseReward = GAMEPLAY_CONFIG.COIN_REWARDS.DAILY_REWARD_BASE;
    const streakMultiplier = Math.pow(GAMEPLAY_CONFIG.COIN_REWARDS.STREAK_BONUS_MULTIPLIER, streak - 1);
    const totalReward = Math.floor(baseReward * streakMultiplier);
    
    const popup = document.createElement('div');
    popup.className = 'daily-reward-popup';
    popup.innerHTML = `
        <div class="daily-reward-content">
            <h2>🎁 Daily Reward!</h2>
            <div class="streak-display">
                <span class="streak-number">${streak}</span>
                <span class="streak-label">Jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''} 🔥</span>
            </div>
            <div class="reward-amount">
                +${totalReward} 🪙 Coins
            </div>
            <button class="claim-reward-btn" onclick="claimDailyReward(${totalReward})">
                Collecter la récompense!
            </button>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10004;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(popup);
}

/**
 * Collecter daily reward
 */
function claimDailyReward(amount) {
    addCoins(amount, 'daily_reward');
    gameState.dailyRewardClaimed = true;
    saveGameState();
    
    // Fermer popup
    const popup = document.querySelector('.daily-reward-popup');
    if (popup) popup.remove();
    
    showNotification(`✅ Daily reward collecté! +${amount} coins`, 'success');
}

/**
 * Générer daily challenges
 */
function generateDailyChallenges() {
    const pool = GAMEPLAY_CONFIG.DAILY_CHALLENGES_POOL;
    const challenges = [];
    
    // Choisir 3 challenges aléatoires
    const shuffled = pool.sort(() => 0.5 - Math.random());
    challenges.push(...shuffled.slice(0, 3));
    
    gameState.dailyChallenges = challenges.map(c => ({
        ...c,
        progress: 0,
        claimed: false
    }));
    
    saveGameState();
}

// ============================================
// HOOKS SUR ACTIONS CV
// ============================================

/**
 * Hook sur email envoyé
 */
function onEmailSent() {
    if (!gamingMode) return;
    
    addCoins(GAMEPLAY_CONFIG.COIN_REWARDS.EMAIL_SENT, 'email_sent');
    gameState.stats.emailsSent++;
    
    // Progress daily challenge
    progressDailyChallenge('sendEmail');
    
    saveGameState();
}

/**
 * Hook sur CV téléchargé
 */
function onCVDownloaded() {
    if (!gamingMode) return;
    
    addCoins(GAMEPLAY_CONFIG.COIN_REWARDS.CV_DOWNLOAD, 'cv_download');
    gameState.stats.downloadsCV++;
    
    // Progress daily challenge
    progressDailyChallenge('downloadCV');
    
    saveGameState();
}

/**
 * Hook sur section visitée
 */
function onSectionVisited(sectionName) {
    if (!gamingMode) return;
    
    if (!gameState.stats.cvSectionsVisited.has(sectionName)) {
        gameState.stats.cvSectionsVisited.add(sectionName);
        addCoins(GAMEPLAY_CONFIG.COIN_REWARDS.SECTION_EXPLORED, 'section_explored');
        
        // Progress quête cvExplorer
        if (gameState.quests.cvExplorer.progress < gameState.quests.cvExplorer.max) {
            gameState.quests.cvExplorer.progress++;
            checkQuestCompletion('cvExplorer');
        }
    }
    
    saveGameState();
}

/**
 * Hook sur vidéo regardée
 */
function onVideoWatched() {
    if (!gamingMode) return;
    
    addCoins(GAMEPLAY_CONFIG.COIN_REWARDS.VIDEO_WATCHED, 'video_watched');
    saveGameState();
}

/**
 * Hook sur skill vue
 */
function onSkillViewed() {
    if (!gamingMode) return;
    
    addCoins(GAMEPLAY_CONFIG.COIN_REWARDS.SKILL_VIEWED, 'skill_viewed');
    saveGameState();
}

/**
 * Progression daily challenge
 */
function progressDailyChallenge(challengeId) {
    const challenge = gameState.dailyChallenges.find(c => c.id === challengeId);
    if (challenge && !challenge.claimed) {
        challenge.progress++;
        
        if (challenge.progress >= challenge.target) {
            challenge.completed = true;
            showNotification(`✅ Daily Challenge complété! Claim ta récompense!`, 'success');
        }
        
        saveGameState();
        updateGameUI();
    }
}

// ============================================
// PERSISTANCE
// ============================================

function saveGameState() {
    try {
        // Convertir Set en Array pour JSON
        const saveData = {
            ...gameState,
            stats: {
                ...gameState.stats,
                cvSectionsVisited: Array.from(gameState.stats.cvSectionsVisited)
            }
        };
        
        localStorage.setItem('tamagotchi_gameplay', JSON.stringify(saveData));
    } catch (e) {
        console.error('Erreur sauvegarde gameState:', e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('tamagotchi_gameplay');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Reconvertir Array en Set
            if (data.stats && data.stats.cvSectionsVisited) {
                data.stats.cvSectionsVisited = new Set(data.stats.cvSectionsVisited);
            }
            
            gameState = { ...gameState, ...data };
        }
    } catch (e) {
        console.error('Erreur chargement gameState:', e);
    }
}

// ============================================
// UI UPDATE
// ============================================

function updateGameUI() {
    // Mettre à jour le HUD avec coins et XP
    updateGameHUD();
}

function updateGameHUD() {
    // Cette fonction sera appelée depuis index.html pour update le HUD
    // On exposera gameState en global
}

// ============================================
// INITIALISATION
// ============================================

function initGameplaySystem() {
    console.log('🎮 Initialisation Gameplay System...');
    
    loadGameState();
    checkDailyReward();
    checkEvolution();
    updateEricVisual();
    
    console.log('✅ Gameplay System prêt!');
    console.log('State:', gameState);
}

// Exposer les fonctions globalement pour les hooks
window.gameplaySystem = {
    addCoins,
    spendCoins,
    addXP,
    onEmailSent,
    onCVDownloaded,
    onSectionVisited,
    onVideoWatched,
    onSkillViewed,
    initGameplaySystem,
    gameState  // Exposer l'état pour lecture
};

// Auto-init quand gaming mode activé
if (typeof gamingMode !== 'undefined' && gamingMode) {
    initGameplaySystem();
}
