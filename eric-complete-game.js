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

const GAME_CONFIG = {
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
        this.stats = JSON.parse(JSON.stringify(GAME_CONFIG.stats));
        this.inventory = this.loadInventory();
        this.coins = this.loadCoins();
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
        this.createGameLayout();
        this.startGameLoop();
        this.loadGameState();
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
                        <img src="assets/images/eric-normal.png" alt="Eric" id="ericPortrait">
                        <div class="portrait-frame"></div>
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
                        <div class="coins-count">
                            <span class="coin-icon">🪙</span>
                            <span id="coinsDisplay">0</span>
                        </div>
                    </div>
                </div>
                
                <!-- Zone de jeu principale -->
                <div class="game-main">
                    <!-- Sélecteur de pièces -->
                    <div class="room-selector">
                        <button class="room-btn active" data-room="living" title="Salon">
                            <span class="room-icon">🛋️</span>
                            <span class="room-label">Salon</span>
                        </button>
                        <button class="room-btn" data-room="kitchen" title="Cuisine">
                            <span class="room-icon">🍳</span>
                            <span class="room-label">Cuisine</span>
                        </button>
                        <button class="room-btn" data-room="bedroom" title="Chambre">
                            <span class="room-icon">🛏️</span>
                            <span class="room-label">Chambre</span>
                        </button>
                        <button class="room-btn" data-room="garden" title="Jardin">
                            <span class="room-icon">🌳</span>
                            <span class="room-label">Jardin</span>
                        </button>
                    </div>
                    
                    <!-- Environnement de jeu -->
                    <div class="game-environment" id="gameEnvironment">
                        <!-- Eric et décor seront rendus ici -->
                    </div>
                    
                    <!-- Panel d'actions rapides -->
                    <div class="quick-actions">
                        <button class="quick-action-btn" data-action="feed" title="Nourrir">
                            <span class="action-icon">🍖</span>
                            <span class="action-label">Nourrir</span>
                        </button>
                        <button class="quick-action-btn" data-action="play" title="Jouer">
                            <span class="action-icon">🎾</span>
                            <span class="action-label">Jouer</span>
                        </button>
                        <button class="quick-action-btn" data-action="care" title="Soigner">
                            <span class="action-icon">💊</span>
                            <span class="action-label">Soigner</span>
                        </button>
                        <button class="quick-action-btn" data-action="sleep" title="Dormir">
                            <span class="action-icon">😴</span>
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
        this.renderEnvironment();
        this.renderInventory();
        this.renderShop('foods');
        this.updateStatsDisplay();
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
    }
    
    /**
     * Change de pièce
     */
    changeRoom(roomId) {
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
        const room = GAME_CONFIG.rooms[this.currentRoom];
        const env = document.getElementById('gameEnvironment');
        
        env.style.background = room.background;
        env.innerHTML = `
            <div class="room-container">
                <!-- Sol -->
                <div class="room-floor"></div>
                
                <!-- Murs décorés -->
                <div class="room-walls">
                    ${this.renderWallDecor()}
                </div>
                
                <!-- Meubles -->
                <div class="room-furniture">
                    ${this.renderFurniture(room.furniture)}
                </div>
                
                <!-- Eric au centre (rendu isométrique) -->
                <div class="eric-character isometric-character-container" id="ericCharacter">
                    <div class="isometric-floor"></div>
                    <div class="interaction-overlay"></div>
                    <div class="state-indicator state-${this.getCurrentState()}">${this.getStateLabel()}</div>
                    <!-- Le canvas isométrique sera inséré ici -->
                </div>
                
                <!-- Effets et particules -->
                <div class="room-effects" id="roomEffects"></div>
            </div>
        `;
        
        // Initialiser le renderer isométrique
        this.initIsometricRenderer();
        
        // Ajouter interactivité sur Eric
        const ericContainer = document.getElementById('ericCharacter');
        if (ericContainer) {
            ericContainer.addEventListener('click', () => {
                this.petEric();
            });
        }
    }
    
    /**
     * Initialise le renderer HD professionnel avec vraies assets
     */
    initIsometricRenderer() {
        const container = document.getElementById('ericCharacter');
        if (!container) return;
        
        // Créer le renderer HD avec vraies assets
        if (window.EricHDRenderer) {
            this.hdRenderer = new EricHDRenderer('ericCharacter');
            
            // Synchroniser l'état initial
            this.updateIsometricState();
            
            console.log('✅ HD Renderer initialisé avec vraies assets professionnelles');
        } else {
            console.warn('⚠️ EricHDRenderer non disponible, fallback sur images PNG');
            this.fallbackToImages(container);
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
        switch(action) {
            case 'feed':
                this.openFeedMenu();
                break;
            case 'play':
                this.openPlayMenu();
                break;
            case 'care':
                this.openCareMenu();
                break;
            case 'sleep':
                this.putToSleep();
                break;
        }
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
        
        if (this.isometricRenderer) {
            this.isometricRenderer.setState(state);
        } else {
            // Fallback: changer l'image PNG
            const img = document.querySelector('#ericCharacter img');
            if (img) {
                const stateImages = {
                    'idle': 'eric-normal.png',
                    'walk': 'eric-normal.png',
                    'eat': 'eric-fed.png',
                    'play': 'eric-happy.png',
                    'sleep': 'eric-sleeping.png',
                    'sad': 'eric-unhappy.png'
                };
                img.src = `assets/images/${stateImages[state] || 'eric-normal.png'}`;
            }
        }
        
        // Mettre à jour les classes CSS
        const ericChar = document.getElementById('ericCharacter');
        if (ericChar) {
            ericChar.className = `eric-character ${state}`;
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
                value.textContent = `${stat.current}/${stat.max}`;
            }
        });
        
        document.getElementById('coinsDisplay').textContent = this.coins;
    }
    
    /**
     * Modifie une stat
     */
    modifyStat(statName, amount) {
        if (this.stats[statName]) {
            this.stats[statName].current = Math.max(0, Math.min(
                this.stats[statName].max,
                this.stats[statName].current + amount
            ));
            this.updateStatsDisplay();
            this.saveGameState();
        }
    }
    
    /**
     * Rend l'inventaire
     */
    renderInventory() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = Object.entries(this.inventory)
            .filter(([id, item]) => item.count > 0)
            .map(([id, item]) => `
                <div class="inventory-item" data-item="${id}">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-count">${item.count}</span>
                    <span class="item-name">${item.name}</span>
                </div>
            `).join('') || '<p class="empty-message">Inventaire vide</p>';
    }
    
    /**
     * Rend la boutique
     */
    renderShop(category) {
        const items = GAME_CONFIG.items[category];
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
        const item = GAME_CONFIG.items[category][itemId];
        
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
        setInterval(() => {
            // Décrémenter les stats progressivement
            this.modifyStat('hunger', -0.5);
            this.modifyStat('mood', -0.3);
            this.modifyStat('energy', -0.2);
            
            // Vérifier les conditions critiques
            this.checkCriticalConditions();
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
                this.updateEricState('idle');
            }
        }
    }
    
    /**
     * Sauvegarde l'état du jeu
     */
    saveGameState() {
        localStorage.setItem('ericGameState', JSON.stringify({
            stats: this.stats,
            inventory: this.inventory,
            coins: this.coins,
            currentRoom: this.currentRoom
        }));
    }
    
    /**
     * Charge l'état du jeu
     */
    loadGameState() {
        const saved = localStorage.getItem('ericGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.stats = state.stats || this.stats;
            this.inventory = state.inventory || this.inventory;
            this.coins = state.coins || 0;
            this.currentRoom = state.currentRoom || 'living';
            this.updateStatsDisplay();
        }
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
