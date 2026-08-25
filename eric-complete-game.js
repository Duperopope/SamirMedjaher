/**
 * 🎮 ERIC COMPLETE GAME SYSTEM
 * Jeu tamagotchi complet et immersif pour l'onglet Eric du dashboard
 * Version: 1.0
 * 
 * Fonctionnalités:
 * - Environnement 3D détaillé avec décor riche
 * - Barres de stats visuelles (hunger, mood, health, energy)
 * - Inventaire visuel avec drag & drop
 * - Mini-jeux intégrés
 * - Système de progression et récompenses
 * - Animations fluides et effets professionnels
 */

// ============================================
// CONFIGURATION DU JEU
// ============================================

const ERIC_COMPLETE_CONFIG = {
    // Dimensions de la zone de jeu
    width: '100%',
    height: '100%',
    
    // Stats d'Eric
    stats: {
        hunger: { max: 100, current: 100, color: '#F59E0B', icon: '🍖' },
        mood: { max: 100, current: 100, color: '#10B981', icon: '😊' },
        health: { max: 100, current: 100, color: '#EF4444', icon: '❤️' },
        energy: { max: 100, current: 100, color: '#06B6D4', icon: '⚡' }
    },
    
    // Décors disponibles
    rooms: {
        living: {
            name: 'Salon',
            background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
            furniture: ['sofa', 'tv', 'plant', 'lamp']
        },
        kitchen: {
            name: 'Cuisine',
            background: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
            furniture: ['fridge', 'stove', 'table', 'foodBowl']
        },
        bedroom: {
            name: 'Chambre',
            background: 'linear-gradient(180deg, #DDD6FE 0%, #C4B5FD 100%)',
            furniture: ['bed', 'nightstand', 'cushion', 'toyBox']
        },
        garden: {
            name: 'Jardin',
            background: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 100%)',
            furniture: ['tree', 'flowers', 'scratchPost', 'ball']
        }
    },
    
    // Items disponibles
    items: {
        foods: {
            fish: { name: 'Poisson', icon: '🐟', hunger: 30, mood: 10, cost: 10 },
            milk: { name: 'Lait', icon: '🥛', hunger: 20, mood: 5, cost: 5 },
            treat: { name: 'Friandise', icon: '🍪', hunger: 15, mood: 20, cost: 15 },
            premium: { name: 'Repas Premium', icon: '🍱', hunger: 50, mood: 30, cost: 50 }
        },
        toys: {
            ball: { name: 'Balle', icon: '⚽', mood: 20, energy: -10, cost: 20 },
            mouse: { name: 'Souris', icon: '🐭', mood: 25, energy: -15, cost: 25 },
            feather: { name: 'Plume', icon: '🪶', mood: 15, energy: -5, cost: 10 },
            laser: { name: 'Laser', icon: '🔴', mood: 30, energy: -20, cost: 40 }
        },
        care: {
            brush: { name: 'Brosse', icon: '🪮', health: 10, mood: 15, cost: 15 },
            medicine: { name: 'Médicament', icon: '💊', health: 50, cost: 30 },
            bed: { name: 'Lit Douillet', icon: '🛏️', energy: 30, cost: 50 },
            vitamins: { name: 'Vitamines', icon: '💉', health: 20, energy: 10, cost: 25 }
        }
    }
};

// ============================================
// CLASSE PRINCIPALE DU JEU
// ============================================

class EricCompleteGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentRoom = 'living';
        this.stats = JSON.parse(JSON.stringify(ERIC_COMPLETE_CONFIG.stats));
        this.inventory = this.loadInventory();
        this.coins = this.loadCoins();
        this.level = 1;
        this.xp = 0;
        this.bond = 0;
        this.dailyActions = [];
        this.dailyRewardClaimed = false;
        this.dailyKey = new Date().toISOString().slice(0, 10);
        this.lastActionAt = 0;
        this.loopId = null;
        this.isPlaying = false;
        this.miniGameActive = false;
        
        // Renderer isométrique
        this.isometricRenderer = null;
        this.currentEricState = 'idle';
        
        this.init();
    }
    
    /**
     * Initialise le jeu complet
     */
    init() {
        this.loadGameState();
        this.applyOfflineProgress();
        this.createGameLayout();
        this.startGameLoop();
        this.showFirstRunTip();
        console.log('🎮 Jeu Eric complet initialisé');
    }
    
    /**
     * Crée la structure HTML complète du jeu
     */
    createGameLayout() {
        this.container.innerHTML = `
            <div class="eric-game-container">
                <!-- Header avec stats -->
                <div class="game-header">
                    <div class="eric-portrait">
                        <img src="assets/images/game/eric-poses/alert.webp" alt="Portrait d'Éric" id="ericPortrait">
                        <div class="portrait-frame"></div>
                    </div>

                    <div class="game-identity">
                        <span class="game-kicker">Compagnon système</span>
                        <h2>Éric <em>// gardien de nuit</em></h2>
                        <p>Maintiens son équilibre et renforce votre lien.</p>
                    </div>
                    
                    <div class="stats-panel">
                        <div class="stat-bar" data-stat="hunger">
                            <div class="stat-icon">🍖</div>
                            <div class="stat-info">
                                <span class="stat-label">Faim</span>
                                <div class="stat-bar-bg">
                                    <div class="stat-bar-fill" style="width: 100%; background: #F59E0B;"></div>
                                </div>
                                <span class="stat-value">100/100</span>
                            </div>
                        </div>
                        
                        <div class="stat-bar" data-stat="mood">
                            <div class="stat-icon">😊</div>
                            <div class="stat-info">
                                <span class="stat-label">Humeur</span>
                                <div class="stat-bar-bg">
                                    <div class="stat-bar-fill" style="width: 100%; background: #10B981;"></div>
                                </div>
                                <span class="stat-value">100/100</span>
                            </div>
                        </div>
                        
                        <div class="stat-bar" data-stat="health">
                            <div class="stat-icon">❤️</div>
                            <div class="stat-info">
                                <span class="stat-label">Santé</span>
                                <div class="stat-bar-bg">
                                    <div class="stat-bar-fill" style="width: 100%; background: #EF4444;"></div>
                                </div>
                                <span class="stat-value">100/100</span>
                            </div>
                        </div>
                        
                        <div class="stat-bar" data-stat="energy">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <span class="stat-label">Énergie</span>
                                <div class="stat-bar-bg">
                                    <div class="stat-bar-fill" style="width: 100%; background: #06B6D4;"></div>
                                </div>
                                <span class="stat-value">100/100</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="currency-display">
                        <div class="level-count">
                            <span>Niv. <strong id="ericLevelDisplay">1</strong></span>
                            <div class="xp-track"><span id="ericXpFill"></span></div>
                        </div>
                        <div class="coins-count">
                            <span class="coin-icon">🪙</span>
                            <span id="ericCoinsDisplay">0</span>
                        </div>
                        <div class="bond-count" title="Lien avec Éric">
                            <span>Lien</span><strong id="ericBondDisplay">0</strong><span>%</span>
                        </div>
                    </div>
                </div>
                
                <!-- Zone de jeu principale -->
                <div class="game-main">
                    <!-- Sélecteur de pièces -->
                    <div class="room-selector">
                        <button class="room-btn active" data-room="living" title="Atelier musical — niveau 1">
                            <span class="room-index">01</span>
                            <span class="room-label">Musique</span>
                        </button>
                        <button class="room-btn" data-room="kitchen" title="Cuisine — progression requise">
                            <span class="room-index">02</span>
                            <span class="room-label">Cuisine</span>
                        </button>
                        <button class="room-btn" data-room="bedroom" title="Refuge — niveau 2 requis">
                            <span class="room-index">03</span>
                            <span class="room-label">Repos</span>
                        </button>
                        <button class="room-btn" data-room="garden" title="Serre des toits — progression requise">
                            <span class="room-index">04</span>
                            <span class="room-label">Terrasse</span>
                        </button>
                    </div>
                    
                    <!-- Environnement de jeu -->
                    <div class="game-environment" id="gameEnvironment">
                        <!-- Eric et décor seront rendus ici -->
                    </div>

                    <div class="eric-status" role="status" aria-live="polite">
                        <span class="status-dot"></span>
                        <span id="ericStatusText">Eric est prêt à jouer.</span>
                    </div>
                    
                    <!-- Panel d'actions rapides -->
                    <div class="quick-actions">
                        <button class="quick-action-btn" data-action="feed" title="Nourrir">
                            <span class="action-icon"><i class="fas fa-utensils"></i></span>
                            <span class="action-label">Nourrir</span>
                        </button>
                        <button class="quick-action-btn" data-action="play" title="Jouer">
                            <span class="action-icon"><i class="fas fa-feather-alt"></i></span>
                            <span class="action-label">Jouer</span>
                        </button>
                        <button class="quick-action-btn" data-action="care" title="Soigner">
                            <span class="action-icon"><i class="fas fa-heart"></i></span>
                            <span class="action-label">Soigner</span>
                        </button>
                        <button class="quick-action-btn" data-action="sleep" title="Dormir">
                            <span class="action-icon"><i class="fas fa-moon"></i></span>
                            <span class="action-label">Dormir</span>
                        </button>
                    </div>
                </div>
                
                <!-- Panel latéral : Inventaire & Shop -->
                <div class="game-sidebar">
                    <div class="sidebar-tabs">
                        <button class="sidebar-tab active" data-tab="inventory">
                            <span>🎒</span>
                            <span>Inventaire</span>
                        </button>
                        <button class="sidebar-tab" data-tab="shop">
                            <span>🛒</span>
                            <span>Boutique</span>
                        </button>
                        <button class="sidebar-tab" data-tab="minigames">
                            <span>🎮</span>
                            <span>Mini-jeux</span>
                        </button>
                    </div>
                    
                    <div class="sidebar-content">
                        <!-- Inventaire -->
                        <div id="inventoryTab" class="sidebar-panel active">
                            <h3 class="panel-title">📦 Mon Inventaire</h3>
                            <div class="inventory-grid" id="inventoryGrid">
                                <!-- Items seront rendus ici -->
                            </div>
                        </div>
                        
                        <!-- Boutique -->
                        <div id="shopTab" class="sidebar-panel">
                            <h3 class="panel-title">🛒 Boutique</h3>
                            <div class="shop-categories">
                                <button class="shop-category-btn active" data-category="foods">
                                    🍖 Nourriture
                                </button>
                                <button class="shop-category-btn" data-category="toys">
                                    🎾 Jouets
                                </button>
                                <button class="shop-category-btn" data-category="care">
                                    💊 Soins
                                </button>
                            </div>
                            <div class="shop-items" id="shopItems">
                                <!-- Items à vendre seront rendus ici -->
                            </div>
                        </div>
                        
                        <!-- Mini-jeux -->
                        <div id="minigamesTab" class="sidebar-panel">
                            <h3 class="panel-title">🎮 Mini-jeux</h3>
                            <div class="minigames-list">
                                <button class="minigame-card" data-game="memory">
                                    <span class="minigame-icon">🧩</span>
                                    <span class="minigame-name">Memory</span>
                                    <span class="minigame-reward">+20 🪙</span>
                                </button>
                                <button class="minigame-card" data-game="catch">
                                    <span class="minigame-icon">🎯</span>
                                    <span class="minigame-name">Attrape!</span>
                                    <span class="minigame-reward">+30 🪙</span>
                                </button>
                                <button class="minigame-card" data-game="puzzle">
                                    <span class="minigame-icon">🧩</span>
                                    <span class="minigame-name">Puzzle</span>
                                    <span class="minigame-reward">+40 🪙</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
        this.refreshRoomLocks();
        if (document.querySelector(`.room-btn[data-room="${this.currentRoom}"]`)?.disabled) {
            this.currentRoom = 'living';
        }
        this.renderEnvironment();
        this.renderInventory();
        this.renderShop('foods');
        this.updateStatsDisplay();
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.room === this.currentRoom);
        });
    }
    
    /**
     * Configure les event listeners
     */
    setupEventListeners() {
        // Boutons de pièces
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const room = btn.dataset.room;
                this.changeRoom(room);
            });
        });
        
        // Actions rapides
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Onglets sidebar
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchSidebarTab(tab.dataset.tab);
            });
        });
        
        // Catégories shop
        document.querySelectorAll('.shop-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.renderShop(btn.dataset.category);
            });
        });

        document.querySelectorAll('.minigame-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameMap = { memory: 'memory', catch: 'mouse', puzzle: 'simon' };
                if (typeof window.openMinigame === 'function') window.openMinigame(gameMap[btn.dataset.game]);
            });
        });
    }
    
    /**
     * Change de pièce
     */
    changeRoom(roomId) {
        const roomButton = document.querySelector(`.room-btn[data-room="${roomId}"]`);
        if (roomButton?.disabled) {
            this.setStatus(roomButton.title, '◆');
            return;
        }
        this.previousRoom = this.currentRoom;
        this.currentRoom = roomId;
        
        // Mettre à jour les boutons
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.room === roomId);
        });
        
        // Re-render l'environnement
        this.renderEnvironment();
    }
    
    /**
     * Rend l'environnement de la pièce actuelle
     */
    renderEnvironment() {
        const env = document.getElementById('gameEnvironment');
        const roomMeta = {
            living: { image: 'assets/images/game/eric-night-workshop.webp', position: 'center', label: 'Atelier musical', note: 'Niveau 1 — Le signal sous les toits.' },
            kitchen: { image: 'assets/images/game/eric-kitchen.webp', position: 'center', label: 'Cuisine & réserve', note: 'Niveau 2 — La piste lumineuse.' },
            bedroom: { image: 'assets/images/game/eric-refuge.webp', position: 'center', label: 'Le refuge cartographe', note: 'Niveau 3 — La fréquence perdue.' },
            garden: { image: 'assets/images/game/eric-rooftop.webp', position: 'center', label: 'Serre des toits', note: 'Niveau 4 — La balise endormie.' }
        }[this.currentRoom];

        env.style.setProperty('--scene-image', `url("${roomMeta.image}")`);
        env.style.setProperty('--scene-position', roomMeta.position);
        env.innerHTML = `
            <div class="room-container" data-room="${this.currentRoom}">
                <div class="scene-vignette"></div>
                <div class="scene-caption">
                    <span>${roomMeta.label}</span>
                    <small>${roomMeta.note}</small>
                </div>
                <button class="sound-toggle" id="ericSoundToggle" type="button" aria-label="Activer l’ambiance sonore" aria-pressed="false"><i class="fas fa-volume-mute"></i><span>Ambiance</span></button>
                <button class="eric-illustrated-stage" id="ericIllustratedStage" type="button" aria-label="Éric, personnage illustré animé">
                    <span id="ericAnimatedSprite" class="eric-sprite" role="img" aria-label="Éric, chat noir animé"></span>
                    <span class="illustrated-shadow"></span>
                </button>
                <aside class="adventure-card" id="adventureCard" aria-live="polite"></aside>
                <button class="adventure-hotspot" id="adventureHotspot" type="button" hidden></button>
                <div class="ambient-dust" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                <div class="room-effects" id="roomEffects"></div>
            </div>
        `;
        
        // Ajouter interactivité sur Eric
        const ericContainer = document.getElementById('ericCharacter');
        if (ericContainer) {
            ericContainer.addEventListener('click', () => {
                this.petEric();
            });
        }

        if (window.ericAdventure) window.ericAdventure.destroy();
        if (window.EricAdventure) {
            window.ericAdventure = new window.EricAdventure(this, env);
        }
    }

    refreshRoomLocks() {
        const storyStep = Number(localStorage.getItem('ericAdventureStep') || 0);
        const unlocked = {
            living: true,
            kitchen: storyStep >= 2,
            bedroom: storyStep >= 3 || this.level >= 2,
            garden: storyStep >= 5
        };
        document.querySelectorAll('.room-btn').forEach(button => {
            const locked = !unlocked[button.dataset.room];
            button.disabled = locked;
            button.classList.toggle('is-locked', locked);
        });
    }
    
    /**
     * Initialise le jeu Phaser professionnel
     */
    initPhaserGame() {
        console.log('🎮 Initialisation du jeu Phaser...');
        
        // Vérifier que Phaser est chargé
        if (typeof Phaser === 'undefined') {
            console.error('❌ Phaser non chargé ! Vérifiez le CDN.');
            return;
        }
        
        // Vérifier que le conteneur existe
        const container = document.getElementById('ericGameContainer');
        if (!container) {
            console.error('❌ Conteneur ericGameContainer introuvable');
            return;
        }
        
        // Initialiser le jeu Phaser
        if (window.initEricPhaserGame) {
            window.initEricPhaserGame();
            console.log('✅ Jeu Phaser initialisé avec succès');
        } else {
            console.error('❌ initEricPhaserGame non disponible');
        }
    }
    
    /**
     * Met à jour l'état du renderer HD
     */
    updateIsometricState() {
        if (!this.hdRenderer) return;
        
        const state = this.getCurrentState();
        this.hdRenderer.setState(state);
        
        // Mettre à jour l'indicateur d'état
        const indicator = document.querySelector('.state-indicator');
        if (indicator) {
            indicator.className = `state-indicator state-${state}`;
            indicator.textContent = this.getStateLabel();
        }
    }
    
    /**
     * Obtient l'état actuel du personnage
     */
    getCurrentState() {
        // Logique pour déterminer l'état actuel
        if (this.stats.energy.current < 20) return 'sleep';
        if (this.stats.hunger.current < 30) return 'sad';
        if (this.stats.mood.current > 80) return 'play';
        if (this.isPlaying) return 'play';
        return 'idle';
    }
    
    /**
     * Obtient le label de l'état
     */
    getStateLabel() {
        const labels = {
            idle: '😊 Au repos',
            walk: '🚶 En balade',
            eat: '🍖 Mange',
            play: '🎮 Joue',
            sleep: '😴 Dort',
            sad: '😢 Triste'
        };
        return labels[this.getCurrentState()] || '😊 Au repos';
    }
    
    /**
     * Fallback sur images PNG si le renderer n'est pas disponible
     */
    fallbackToImages(container) {
        const state = this.getCurrentState();
        const imageMap = {
            idle: 'eric-normal.png',
            walk: 'eric-normal.png',
            eat: 'eric-fed.png',
            play: 'eric-happy.png',
            sleep: 'eric-sleeping.png',
            sad: 'eric-unhappy.png'
        };
        
        container.innerHTML += `
            <img src="assets/images/${imageMap[state]}" alt="Eric" class="eric-fallback-image">
            <div class="eric-shadow"></div>
        `;
    }
    
    /**
     * Rend les décorations murales
     */
    renderWallDecor() {
        return `
            <div class="wall-item window">
                <div class="window-frame"></div>
                <div class="window-glass"></div>
            </div>
            <div class="wall-item clock">🕐</div>
            <div class="wall-item picture">🖼️</div>
        `;
    }
    
    /**
     * Rend les meubles de la pièce
     */
    renderFurniture(furniture) {
        const furnitureHTML = {
            sofa: '<div class="furniture sofa">🛋️</div>',
            tv: '<div class="furniture tv">📺</div>',
            plant: '<div class="furniture plant">🪴</div>',
            lamp: '<div class="furniture lamp">💡</div>',
            fridge: '<div class="furniture fridge">🧊</div>',
            stove: '<div class="furniture stove">🔥</div>',
            table: '<div class="furniture table">🪑</div>',
            foodBowl: '<div class="furniture food-bowl">🍖</div>',
            bed: '<div class="furniture bed">🛏️</div>',
            nightstand: '<div class="furniture nightstand">🕯️</div>',
            cushion: '<div class="furniture cushion">🧸</div>',
            toyBox: '<div class="furniture toy-box">🎁</div>',
            tree: '<div class="furniture tree">🌳</div>',
            flowers: '<div class="furniture flowers">🌺</div>',
            scratchPost: '<div class="furniture scratch-post">🌳</div>',
            ball: '<div class="furniture ball">⚽</div>'
        };
        
        return furniture.map(f => furnitureHTML[f] || '').join('');
    }
    
    /**
     * Gère les actions rapides
     */
    handleQuickAction(action) {
        if (Date.now() - this.lastActionAt < 700) {
            this.setStatus('Doucement ! Eric profite encore de la dernière action.', '⏳');
            return;
        }
        this.lastActionAt = Date.now();
        if (action !== 'sleep') this.sleepingUntil = 0;

        switch(action) {
            case 'feed':
                this.performAction({ id: 'feed', stat: 'hunger', amount: 18, energy: 2, state: 'eat', icon: '🐟', message: 'Eric a bien mangé.' });
                break;
            case 'play':
                if (this.stats.energy.current < 10) return this.setStatus('Eric est trop fatigué pour jouer.', '😴');
                this.performAction({ id: 'play', stat: 'mood', amount: 16, energy: -8, state: 'play', icon: '🎾', message: 'Belle partie ! Eric est ravi.' });
                break;
            case 'care':
                this.performAction({ id: 'care', stat: 'health', amount: 12, mood: 4, state: 'idle', icon: '🪮', message: 'Eric est propre et soigné.' });
                break;
            case 'sleep':
                this.performAction({ id: 'sleep', stat: 'energy', amount: 24, hunger: -4, state: 'sleep', icon: '💤', message: 'Une bonne sieste recharge Eric.' });
                break;
        }
    }

    performAction(action) {
        this.modifyStat(action.stat, action.amount, false);
        if (action.energy) this.modifyStat('energy', action.energy, false);
        if (action.mood) this.modifyStat('mood', action.mood, false);
        if (action.hunger) this.modifyStat('hunger', action.hunger, false);
        this.updateEricState(action.state);
        this.createParticleEffect(action.state === 'sleep' ? 'zzz' : action.state === 'play' ? 'hearts' : 'sparkles');
        this.awardProgress(8, 2);
        this.setStatus(action.message, action.icon);
        this.registerDailyAction(action.id);
        this.saveGameState();
        setTimeout(() => this.checkCriticalConditions(), action.state === 'sleep' ? 6500 : 1800);
    }

    registerDailyAction(actionId) {
        if (!this.dailyActions.includes(actionId)) this.dailyActions.push(actionId);
        if (this.dailyActions.length >= 3 && !this.dailyRewardClaimed) {
            this.dailyRewardClaimed = true;
            this.coins += 40;
            this.xp += 25;
            this.setStatus('Rituel de nuit accompli : +40 pièces et +25 XP.', '◆');
            this.createParticleEffect('stars');
        }
        this.renderInventory();
    }

    setStatus(message, icon = '🐾') {
        const status = document.getElementById('ericStatusText');
        if (status) status.textContent = `${icon} ${message}`;
    }

    awardProgress(xp, coins) {
        this.xp += xp;
        this.coins += coins;
        this.bond = Math.min(100, this.bond + 2);
        const threshold = this.level * 100;
        if (this.xp >= threshold) {
            this.xp -= threshold;
            this.level += 1;
            this.coins += 25;
            this.setStatus(`Niveau ${this.level} atteint ! Bonus de 25 pièces.`, '🏆');
        }
        this.updateStatsDisplay();
        this.refreshRoomLocks();
    }
    
    /**
     * Ouvre le menu de nourriture
     */
    openFeedMenu() {
        // Basculer vers l'onglet inventaire avec items food
        this.switchSidebarTab('inventory');
        // TODO: Filtrer pour montrer seulement la nourriture
    }
    
    /**
     * Initialise le renderer isométrique
     */
    initIsometricRenderer() {
        const ericContainer = document.getElementById('ericCharacter');
        if (!ericContainer) {
            console.warn('❌ Conteneur Eric introuvable');
            return;
        }
        
        // Vérifier si la classe IsometricRenderer est disponible
        if (typeof IsometricRenderer === 'undefined') {
            console.warn('⚠️ IsometricRenderer non chargé, utilisation du fallback PNG');
            this.useFallbackRenderer(ericContainer);
            return;
        }
        
        // Créer le renderer isométrique
        try {
            this.isometricRenderer = new IsometricRenderer(ericContainer);
            
            // Insérer le canvas
            ericContainer.innerHTML = '';
            ericContainer.appendChild(this.isometricRenderer.getCanvas());
            
            // Définir l'état initial
            this.updateEricState('idle');
            
            console.log('✅ Renderer isométrique initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du renderer:', error);
            this.useFallbackRenderer(ericContainer);
        }
    }
    
    /**
     * Utilise le renderer PNG de secours
     */
    useFallbackRenderer(container) {
        container.innerHTML = `
            <img src="assets/images/eric-normal.png" alt="Eric">
            <div class="eric-shadow"></div>
        `;
    }
    
    /**
     * Met à jour l'état visuel d'Eric
     */
    updateEricState(state) {
        this.currentEricState = state;
        if (state === 'sleep') this.sleepingUntil = Number.POSITIVE_INFINITY;
        if (window.ericAdventure) {
            const pose = state === 'play' || state === 'eat'
                ? 'happy'
                : state === 'sleep'
                    ? 'sleep'
                    : 'idle';
            const duration = pose === 'happy' ? 1600 : 0;
            window.ericAdventure.setPose(pose, duration);
        }

        // Mettre à jour les classes CSS
        const ericChar = document.getElementById('ericCharacter');
        if (ericChar) {
            ericChar.className = `eric-character is-${state}`;
        }
    }
    
    /**
     * Caresse Eric
     */
    petEric() {
        this.modifyStat('mood', 5);
        this.createParticleEffect('hearts');
        this.updateEricState('play');
        
        // Retour à idle après animation
        setTimeout(() => {
            this.updateEricState('idle');
        }, 2000);
        
        if (window.showNotification) {
            window.showNotification('💕 Eric ronronne de bonheur !', 'success');
        }
    }
    
    /**
     * Crée un effet de particules
     */
    createParticleEffect(type) {
        const effects = document.getElementById('roomEffects');
        if (!effects) return;
        const particles = {
            hearts: '❤️',
            stars: '⭐',
            sparkles: '✨',
            zzz: '💤'
        };
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particles[type] || '✨';
            particle.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
            particle.style.animationDelay = `${i * 0.1}s`;
            effects.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }
    
    /**
     * Joue une animation sur Eric (legacy)
     */
    playAnimation(animation) {
        // Les animations sont maintenant gérées par updateEricState
        const stateMapping = {
            'happy': 'play',
            'hungry': 'sad',
            'eating': 'eat',
            'sleeping': 'sleep'
        };
        this.updateEricState(stateMapping[animation] || animation);
    }
    
    /**
     * Met à jour l'affichage des stats
     */
    updateStatsDisplay() {
        Object.keys(this.stats).forEach(statName => {
            const stat = this.stats[statName];
            const element = document.querySelector(`[data-stat="${statName}"]`);
            
            if (element) {
                const fill = element.querySelector('.stat-bar-fill');
                const value = element.querySelector('.stat-value');
                const percentage = (stat.current / stat.max) * 100;
                
                fill.style.width = `${percentage}%`;
                value.textContent = `${Math.round(stat.current)}/${stat.max}`;
            }
        });
        
        const coinsDisplay = document.getElementById('ericCoinsDisplay');
        if (coinsDisplay) coinsDisplay.textContent = this.coins;
        const levelDisplay = document.getElementById('ericLevelDisplay');
        const xpFill = document.getElementById('ericXpFill');
        const bondDisplay = document.getElementById('ericBondDisplay');
        if (levelDisplay) levelDisplay.textContent = this.level;
        if (xpFill) xpFill.style.width = `${Math.min(100, (this.xp / (this.level * 100)) * 100)}%`;
        if (bondDisplay) bondDisplay.textContent = this.bond;
    }
    
    /**
     * Modifie une stat
     */
    modifyStat(statName, amount, persist = true) {
        if (this.stats[statName]) {
            this.stats[statName].current = Math.max(0, Math.min(
                this.stats[statName].max,
                this.stats[statName].current + amount
            ));
            this.updateStatsDisplay();
            if (persist) this.saveGameState();
        }
    }
    
    /**
     * Rend l'inventaire
     */
    renderInventory() {
        const grid = document.getElementById('inventoryGrid');
        const missionProgress = Math.min(3, this.dailyActions.length);
        const mission = `
            <div class="night-mission ${this.dailyRewardClaimed ? 'is-complete' : ''}">
                <span class="mission-eyebrow">Rituel de nuit</span>
                <strong>${this.dailyRewardClaimed ? 'Équilibre restauré' : 'Prends soin d’Éric de 3 façons'}</strong>
                <div class="mission-progress"><span style="width:${missionProgress / 3 * 100}%"></span></div>
                <small>${missionProgress}/3 · récompense 40 pièces + 25 XP</small>
            </div>`;
        const items = Object.entries(this.inventory)
            .filter(([id, item]) => item.count > 0)
            .map(([id, item]) => `
                <button type="button" class="inventory-item" data-item="${id}" title="Utiliser ${item.name}">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-count">${item.count}</span>
                    <span class="item-name">${item.name}</span>
                </button>
            `).join('') || '<p class="empty-message">La sacoche est vide.<br><small>La boutique contient de quoi gâter Éric.</small></p>';
        grid.innerHTML = mission + items;

        grid.querySelectorAll('.inventory-item').forEach(item => {
            item.addEventListener('click', () => this.useItem(item.dataset.item));
        });
    }

    useItem(itemId) {
        const item = this.inventory[itemId];
        if (!item || item.count < 1) return;
        ['hunger', 'mood', 'health', 'energy'].forEach(stat => {
            if (typeof item[stat] === 'number') this.modifyStat(stat, item[stat], false);
        });
        item.count -= 1;
        this.awardProgress(12, 0);
        this.updateEricState(item.hunger ? 'eat' : item.energy ? 'sleep' : 'play');
        this.setStatus(`${item.name} utilisé.`, item.icon);
        this.renderInventory();
        this.saveGameState();
    }
    
    /**
     * Rend la boutique
     */
    renderShop(category) {
        const items = ERIC_COMPLETE_CONFIG.items[category];
        const container = document.getElementById('shopItems');
        
        // Mettre à jour les boutons de catégorie
        document.querySelectorAll('.shop-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        container.innerHTML = Object.entries(items).map(([id, item]) => `
            <div class="shop-item" data-item="${id}">
                <span class="item-icon">${item.icon}</span>
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">🪙 ${item.cost}</span>
                </div>
                <button class="buy-btn" onclick="window.ericGame.buyItem('${category}', '${id}')">
                    Acheter
                </button>
            </div>
        `).join('');
    }
    
    /**
     * Achète un item
     */
    buyItem(category, itemId) {
        const item = ERIC_COMPLETE_CONFIG.items[category][itemId];
        
        if (this.coins >= item.cost) {
            this.coins -= item.cost;
            
            // Ajouter à l'inventaire
            if (!this.inventory[itemId]) {
                this.inventory[itemId] = { ...item, count: 0 };
            }
            this.inventory[itemId].count++;
            
            this.updateStatsDisplay();
            this.renderInventory();
            this.saveGameState();
            
            if (window.showNotification) {
                window.showNotification(`✅ ${item.icon} ${item.name} acheté !`, 'success');
            }
        } else {
            if (window.showNotification) {
                window.showNotification('❌ Pas assez de pièces !', 'error');
            }
        }
    }
    
    /**
     * Bascule l'onglet du sidebar
     */
    switchSidebarTab(tabName) {
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}Tab`);
        });
    }
    
    /**
     * Démarre la boucle de jeu
     */
    startGameLoop() {
        if (this.loopId) clearInterval(this.loopId);
        this.loopId = setInterval(() => {
            // Décrémenter les stats progressivement
            this.modifyStat('hunger', -0.5, false);
            this.modifyStat('mood', -0.3, false);
            this.modifyStat('energy', -0.2, false);
            
            // Vérifier les conditions critiques
            this.checkCriticalConditions();
            this.saveGameState();
        }, 10000); // Toutes les 10 secondes
    }
    
    /**
     * Vérifie les conditions critiques
     */
    checkCriticalConditions() {
        // Détermine l'état visuel selon les stats
        if (this.stats.hunger.current < 20) {
            if (this.currentEricState === 'idle') {
                this.updateEricState('sad');
            }
        } else if (this.stats.mood.current < 20) {
            if (this.currentEricState === 'idle') {
                this.updateEricState('sad');
            }
        } else if (this.stats.energy.current < 20) {
            if (this.currentEricState === 'idle') {
                this.updateEricState('sleep');
            }
        } else {
            // Retour à idle si les stats sont bonnes
            if (this.currentEricState === 'sad' || this.currentEricState === 'sleep') {
                if (this.currentEricState === 'sleep' && this.sleepingUntil > Date.now()) return;
                this.updateEricState('idle');
            }
        }
    }
    
    /**
     * Sauvegarde l'état du jeu
     */
    saveGameState() {
        localStorage.setItem('ericGameState', JSON.stringify({
            version: 2,
            stats: this.stats,
            inventory: this.inventory,
            coins: this.coins,
            level: this.level,
            xp: this.xp,
            bond: this.bond,
            dailyKey: this.dailyKey,
            dailyActions: this.dailyActions,
            dailyRewardClaimed: this.dailyRewardClaimed,
            currentRoom: this.currentRoom,
            lastSavedAt: Date.now()
        }));
    }
    
    /**
     * Charge l'état du jeu
     */
    loadGameState() {
        const saved = localStorage.getItem('ericGameState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.stats = state.stats || this.stats;
                this.inventory = state.inventory || this.inventory;
                this.coins = Number.isFinite(state.coins) ? state.coins : 100;
                this.level = state.level || 1;
                this.xp = state.xp || 0;
                this.bond = state.bond || 0;
                if (state.dailyKey === this.dailyKey) {
                    this.dailyActions = state.dailyActions || [];
                    this.dailyRewardClaimed = Boolean(state.dailyRewardClaimed);
                }
                this.currentRoom = state.currentRoom || 'living';
                this.lastSavedAt = state.lastSavedAt || Date.now();
            } catch (error) {
                console.warn('Sauvegarde Eric illisible, nouvelle partie démarrée.', error);
            }
        }
    }

    applyOfflineProgress() {
        if (!this.lastSavedAt) return;
        const minutesAway = Math.min(8 * 60, Math.max(0, (Date.now() - this.lastSavedAt) / 60000));
        if (minutesAway < 2) return;
        this.stats.hunger.current = Math.max(5, this.stats.hunger.current - minutesAway * 0.055);
        this.stats.mood.current = Math.max(5, this.stats.mood.current - minutesAway * 0.035);
        this.stats.energy.current = Math.max(5, this.stats.energy.current - minutesAway * 0.025);
        this.offlineMinutes = Math.round(minutesAway);
    }

    showFirstRunTip() {
        requestAnimationFrame(() => {
            if (this.offlineMinutes) {
                this.setStatus(`Tu étais absent ${this.offlineMinutes} min. Eric t'attendait.`, '👋');
            } else if (!localStorage.getItem('ericTutorialSeen')) {
                this.setStatus('Occupe-toi d’Eric, gagne de l’XP et utilise tes pièces dans la boutique.', '✨');
                localStorage.setItem('ericTutorialSeen', 'true');
            }
        });
    }
    
    /**
     * Charge l'inventaire
     */
    loadInventory() {
        const saved = localStorage.getItem('ericInventory');
        return saved ? JSON.parse(saved) : {};
    }
    
    /**
     * Charge les pièces
     */
    loadCoins() {
        return parseInt(localStorage.getItem('ericCoins')) || 100; // 100 pièces de départ
    }
}

// ============================================
// INITIALISATION
// ============================================

window.ericGame = null;

function initEricGame() {
    const tabEric = document.getElementById('tab-eric');
    if (tabEric && !window.ericGame) {
        window.ericGame = new EricCompleteGame('tab-eric');
        console.log('✅ Jeu Eric complet chargé');
    }
}

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initEricGame, 1000);
    });
} else {
    setTimeout(initEricGame, 1000);
}

console.log('📦 eric-complete-game.js chargé');
