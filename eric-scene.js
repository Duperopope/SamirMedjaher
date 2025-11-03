/**
 * 🎬 ERIC SCENE SYSTEM
 * Scène interactive 3D/isométrique pour le tamagotchi
 * Version: 1.0
 * 
 * Fonctionnalités:
 * - Scène isométrique avec perspective
 * - Décor interactif (sol, murs, objets)
 * - Système de drag & drop pour objets
 * - Interactions avec Eric (feed, play, pet)
 * - Effets de particules
 * - Système de jour/nuit
 * - Animations de décor
 */

// ============================================
// CONFIGURATION DE LA SCÈNE
// ============================================

const SCENE_CONFIG = {
    // Dimensions de la scène
    width: 400,
    height: 400,
    
    // Thèmes disponibles
    themes: {
        day: {
            skyGradient: ['#87CEEB', '#E0F6FF'],
            floorColor: '#90EE90',
            wallColor: '#DEB887',
            shadowOpacity: 0.3,
            lightness: 1
        },
        sunset: {
            skyGradient: ['#FF6B6B', '#FFA07A'],
            floorColor: '#98D8C8',
            wallColor: '#D4A574',
            shadowOpacity: 0.4,
            lightness: 0.9
        },
        night: {
            skyGradient: ['#1A1A2E', '#16213E'],
            floorColor: '#4A5568',
            wallColor: '#2D3748',
            shadowOpacity: 0.6,
            lightness: 0.7
        },
        gaming: {
            skyGradient: ['#667eea', '#764ba2'],
            floorColor: '#06B6D4',
            wallColor: '#8B5CF6',
            shadowOpacity: 0.5,
            lightness: 1.1
        }
    },
    
    // Objets de décor
    decorObjects: {
        foodBowl: { x: 100, y: 300, size: 40 },
        waterBowl: { x: 300, y: 300, size: 35 },
        scratchPost: { x: 50, y: 250, size: 60 },
        toyBall: { x: 200, y: 280, size: 30 },
        cushion: { x: 320, y: 200, size: 50 }
    }
};

// ============================================
// CLASSE SCENE
// ============================================

class EricScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.theme = 'day';
        this.timeOfDay = 0; // 0-24 hours
        this.weatherEffect = null;
        this.particles = [];
        this.decorObjects = {};
        
        this.init();
    }
    
    /**
     * Initialise la scène
     */
    init() {
        this.createSceneStructure();
        this.createBackground();
        this.createFloor();
        this.createWalls();
        this.createDecorObjects();
        this.createEricContainer();
        this.createInteractionButtons();
        this.startTimeOfDayCycle();
        this.setupEventListeners();
    }
    
    /**
     * Crée la structure HTML de la scène
     */
    createSceneStructure() {
        this.container.innerHTML = `
            <div class="eric-scene-container">
                <!-- Fond (ciel) -->
                <div class="scene-background" id="sceneBackground"></div>
                
                <!-- Murs arrière -->
                <div class="scene-walls" id="sceneWalls"></div>
                
                <!-- Sol isométrique -->
                <div class="scene-floor" id="sceneFloor"></div>
                
                <!-- Zone des objets de décor -->
                <div class="scene-decor" id="sceneDecor"></div>
                
                <!-- Eric (personnage principal) -->
                <div class="scene-eric-container" id="sceneEricContainer"></div>
                
                <!-- Effets de particules -->
                <div class="scene-particles" id="sceneParticles"></div>
                
                <!-- Effets météo (optionnel) -->
                <div class="scene-weather" id="sceneWeather"></div>
                
                <!-- Boutons d'interaction -->
                <div class="scene-interactions" id="sceneInteractions"></div>
                
                <!-- Indicateur temps/météo -->
                <div class="scene-time-indicator" id="sceneTimeIndicator">
                    <span id="timeDisplay">12:00</span>
                    <span id="weatherIcon">☀️</span>
                </div>
            </div>
        `;
        
        this.elements = {
            background: document.getElementById('sceneBackground'),
            walls: document.getElementById('sceneWalls'),
            floor: document.getElementById('sceneFloor'),
            decor: document.getElementById('sceneDecor'),
            ericContainer: document.getElementById('sceneEricContainer'),
            particles: document.getElementById('sceneParticles'),
            weather: document.getElementById('sceneWeather'),
            interactions: document.getElementById('sceneInteractions'),
            timeDisplay: document.getElementById('timeDisplay'),
            weatherIcon: document.getElementById('weatherIcon')
        };
    }
    
    /**
     * Crée le fond avec dégradé de ciel
     */
    createBackground() {
        const theme = SCENE_CONFIG.themes[this.theme];
        this.elements.background.style.background = `
            linear-gradient(180deg, 
                ${theme.skyGradient[0]} 0%, 
                ${theme.skyGradient[1]} 100%)
        `;
    }
    
    /**
     * Crée le sol isométrique
     */
    createFloor() {
        const theme = SCENE_CONFIG.themes[this.theme];
        this.elements.floor.innerHTML = `
            <svg viewBox="0 0 400 200" class="floor-svg">
                <!-- Grille isométrique du sol -->
                <defs>
                    <pattern id="floor-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 0 20 L 20 10 L 40 20 L 20 30 Z" 
                            fill="${theme.floorColor}" 
                            stroke="rgba(0,0,0,0.1)" 
                            stroke-width="0.5"/>
                    </pattern>
                    
                    <!-- Ombre radiale -->
                    <radialGradient id="floor-shadow">
                        <stop offset="0%" stop-color="rgba(0,0,0,${theme.shadowOpacity})" />
                        <stop offset="100%" stop-color="rgba(0,0,0,0)" />
                    </radialGradient>
                </defs>
                
                <!-- Sol principal -->
                <path d="M 0 100 L 200 0 L 400 100 L 200 200 Z" 
                    fill="url(#floor-pattern)"/>
                
                <!-- Ombre centrale où se tient Eric -->
                <ellipse cx="200" cy="140" rx="60" ry="20" 
                    fill="url(#floor-shadow)" 
                    class="eric-floor-shadow"/>
            </svg>
        `;
    }
    
    /**
     * Crée les murs avec perspective
     */
    createWalls() {
        const theme = SCENE_CONFIG.themes[this.theme];
        this.elements.walls.innerHTML = `
            <svg viewBox="0 0 400 300" class="walls-svg">
                <defs>
                    <!-- Texture des murs -->
                    <pattern id="wall-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill="${theme.wallColor}"/>
                        <rect width="19" height="19" fill="rgba(255,255,255,0.05)"/>
                    </pattern>
                </defs>
                
                <!-- Mur gauche -->
                <path d="M 0 150 L 0 50 L 200 0 L 200 100 Z" 
                    fill="url(#wall-pattern)" 
                    opacity="0.9"/>
                
                <!-- Mur droit -->
                <path d="M 400 150 L 400 50 L 200 0 L 200 100 Z" 
                    fill="url(#wall-pattern)" 
                    opacity="0.85"/>
                
                <!-- Fenêtre gauche -->
                <rect x="50" y="80" width="60" height="40" 
                    fill="#87CEEB" 
                    stroke="#654321" 
                    stroke-width="2" 
                    rx="3"/>
                <line x1="80" y1="80" x2="80" y2="120" 
                    stroke="#654321" 
                    stroke-width="2"/>
                <line x1="50" y1="100" x2="110" y2="100" 
                    stroke="#654321" 
                    stroke-width="2"/>
                
                <!-- Fenêtre droite -->
                <rect x="290" y="80" width="60" height="40" 
                    fill="#87CEEB" 
                    stroke="#654321" 
                    stroke-width="2" 
                    rx="3"/>
                <line x1="320" y1="80" x2="320" y2="120" 
                    stroke="#654321" 
                    stroke-width="2"/>
                <line x1="290" y1="100" x2="350" y2="100" 
                    stroke="#654321" 
                    stroke-width="2"/>
            </svg>
        `;
    }
    
    /**
     * Crée les objets de décor interactifs
     */
    createDecorObjects() {
        const objects = SCENE_CONFIG.decorObjects;
        
        // Bol de nourriture
        this.createDecorObject('foodBowl', objects.foodBowl, `
            <div class="decor-object food-bowl" data-object="foodBowl">
                <svg viewBox="0 0 80 80" width="80" height="80">
                    <!-- Bol -->
                    <ellipse cx="40" cy="60" rx="30" ry="10" fill="#E74C3C"/>
                    <ellipse cx="40" cy="55" rx="28" ry="8" fill="#C0392B"/>
                    <!-- Nourriture -->
                    <circle cx="40" cy="50" r="12" fill="#F39C12"/>
                    <circle cx="35" cy="48" r="8" fill="#F1C40F"/>
                    <circle cx="45" cy="48" r="8" fill="#F1C40F"/>
                </svg>
                <div class="object-label">🍖</div>
            </div>
        `);
        
        // Bol d'eau
        this.createDecorObject('waterBowl', objects.waterBowl, `
            <div class="decor-object water-bowl" data-object="waterBowl">
                <svg viewBox="0 0 70 70" width="70" height="70">
                    <!-- Bol -->
                    <ellipse cx="35" cy="55" rx="25" ry="8" fill="#3498DB"/>
                    <ellipse cx="35" cy="50" rx="23" ry="6" fill="#2980B9"/>
                    <!-- Eau -->
                    <ellipse cx="35" cy="48" rx="20" ry="4" fill="#AED6F1" opacity="0.8"/>
                </svg>
                <div class="object-label">💧</div>
            </div>
        `);
        
        // Griffoir
        this.createDecorObject('scratchPost', objects.scratchPost, `
            <div class="decor-object scratch-post" data-object="scratchPost">
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <!-- Base -->
                    <ellipse cx="50" cy="90" rx="30" ry="8" fill="#8B4513"/>
                    <!-- Poteau -->
                    <rect x="40" y="30" width="20" height="60" fill="#A0522D"/>
                    <!-- Texture griffures -->
                    <line x1="42" y1="40" x2="42" y2="80" stroke="#654321" stroke-width="2"/>
                    <line x1="50" y1="35" x2="50" y2="85" stroke="#654321" stroke-width="2"/>
                    <line x1="58" y1="40" x2="58" y2="80" stroke="#654321" stroke-width="2"/>
                    <!-- Plateforme en haut -->
                    <ellipse cx="50" cy="30" rx="25" ry="8" fill="#8B4513"/>
                </svg>
                <div class="object-label">🌳</div>
            </div>
        `);
        
        // Balle de jeu
        this.createDecorObject('toyBall', objects.toyBall, `
            <div class="decor-object toy-ball" data-object="toyBall" draggable="true">
                <svg viewBox="0 0 60 60" width="60" height="60">
                    <defs>
                        <radialGradient id="ball-gradient">
                            <stop offset="0%" stop-color="#FF6B6B"/>
                            <stop offset="100%" stop-color="#C0392B"/>
                        </radialGradient>
                    </defs>
                    <!-- Balle -->
                    <circle cx="30" cy="30" r="25" fill="url(#ball-gradient)"/>
                    <!-- Motif -->
                    <path d="M 30 5 Q 30 30, 55 30" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M 5 30 Q 30 30, 30 55" stroke="white" stroke-width="2" fill="none"/>
                    <!-- Brillance -->
                    <circle cx="20" cy="20" r="8" fill="white" opacity="0.5"/>
                </svg>
                <div class="object-label">⚽</div>
            </div>
        `);
        
        // Coussin
        this.createDecorObject('cushion', objects.cushion, `
            <div class="decor-object cushion" data-object="cushion">
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <!-- Coussin -->
                    <ellipse cx="50" cy="70" rx="45" ry="15" fill="#9B59B6"/>
                    <ellipse cx="50" cy="65" rx="43" ry="13" fill="#8E44AD"/>
                    <!-- Motif -->
                    <circle cx="50" cy="65" r="15" fill="#A569BD" opacity="0.5"/>
                </svg>
                <div class="object-label">🛋️</div>
            </div>
        `);
    }
    
    /**
     * Crée un objet de décor
     */
    createDecorObject(id, position, html) {
        const wrapper = document.createElement('div');
        wrapper.className = 'decor-object-wrapper';
        wrapper.style.left = position.x + 'px';
        wrapper.style.top = position.y + 'px';
        wrapper.innerHTML = html;
        
        this.elements.decor.appendChild(wrapper);
        this.decorObjects[id] = {
            element: wrapper,
            position: position,
            interactive: true
        };
    }
    
    /**
     * Crée le conteneur pour Eric
     */
    createEricContainer() {
        // Eric sera inséré ici par le système de sprites
        this.elements.ericContainer.innerHTML = `
            <div id="ericSpriteDisplay" class="eric-display">
                <!-- Le sprite SVG d'Eric sera inséré ici -->
            </div>
        `;
    }
    
    /**
     * Crée les boutons d'interaction
     */
    createInteractionButtons() {
        this.elements.interactions.innerHTML = `
            <div class="interaction-buttons">
                <button class="interaction-btn feed-btn" data-action="feed" title="Nourrir Eric">
                    <span class="btn-icon">🍖</span>
                    <span class="btn-label">Feed</span>
                </button>
                
                <button class="interaction-btn play-btn" data-action="play" title="Jouer avec Eric">
                    <span class="btn-icon">🎾</span>
                    <span class="btn-label">Play</span>
                </button>
                
                <button class="interaction-btn pet-btn" data-action="pet" title="Caresser Eric">
                    <span class="btn-icon">💕</span>
                    <span class="btn-label">Pet</span>
                </button>
                
                <button class="interaction-btn sleep-btn" data-action="sleep" title="Mettre Eric au lit">
                    <span class="btn-icon">😴</span>
                    <span class="btn-label">Sleep</span>
                </button>
                
                <button class="interaction-btn clean-btn" data-action="clean" title="Nettoyer">
                    <span class="btn-icon">🧹</span>
                    <span class="btn-label">Clean</span>
                </button>
            </div>
        `;
    }
    
    /**
     * Configure les événements
     */
    setupEventListeners() {
        // Boutons d'interaction
        const buttons = this.elements.interactions.querySelectorAll('.interaction-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleInteraction(action);
            });
        });
        
        // Drag & drop pour les objets
        const draggableObjects = this.elements.decor.querySelectorAll('[draggable="true"]');
        draggableObjects.forEach(obj => {
            obj.addEventListener('dragstart', this.handleDragStart.bind(this));
            obj.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
        
        // Clic sur les objets
        Object.values(this.decorObjects).forEach(obj => {
            obj.element.addEventListener('click', (e) => {
                this.handleObjectClick(obj);
            });
        });
    }
    
    /**
     * Gère une interaction avec Eric
     */
    handleInteraction(action) {
        console.log(`🎮 Interaction: ${action}`);
        
        // Émettre un événement personnalisé pour le système de gameplay
        const event = new CustomEvent('ericInteraction', {
            detail: { action: action }
        });
        window.dispatchEvent(event);
        
        // Effets visuels selon l'action
        switch(action) {
            case 'feed':
                this.createParticleEffect('food', { x: 200, y: 150 });
                break;
            case 'play':
                this.createParticleEffect('stars', { x: 200, y: 150 });
                break;
            case 'pet':
                this.createParticleEffect('hearts', { x: 200, y: 150 });
                break;
            case 'sleep':
                this.changeTheme('night');
                break;
            case 'clean':
                this.createParticleEffect('sparkles', { x: 200, y: 150 });
                break;
        }
    }
    
    /**
     * Gère le drag start
     */
    handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
    }
    
    /**
     * Gère le drag end
     */
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    /**
     * Gère le clic sur un objet
     */
    handleObjectClick(obj) {
        console.log('🖱️ Objet cliqué:', obj);
        // Animation de clic
        obj.element.classList.add('clicked');
        setTimeout(() => {
            obj.element.classList.remove('clicked');
        }, 300);
    }
    
    /**
     * Crée un effet de particules
     */
    createParticleEffect(type, position) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${type}`;
            
            // Position aléatoire autour du point
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 30;
            
            particle.style.left = position.x + 'px';
            particle.style.top = position.y + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            // Emoji selon le type
            const emojis = {
                hearts: ['❤️', '💕', '💖', '💗'],
                stars: ['⭐', '✨', '🌟', '💫'],
                food: ['🍖', '🍗', '🥩', '🍕'],
                sparkles: ['✨', '💫', '🌟', '⚡']
            };
            
            particle.textContent = emojis[type][Math.floor(Math.random() * emojis[type].length)];
            
            this.elements.particles.appendChild(particle);
            
            // Supprimer après l'animation
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }
    
    /**
     * Change le thème de la scène
     */
    changeTheme(newTheme) {
        if (SCENE_CONFIG.themes[newTheme]) {
            this.theme = newTheme;
            this.createBackground();
            this.createFloor();
            this.createWalls();
        }
    }
    
    /**
     * Démarre le cycle jour/nuit
     */
    startTimeOfDayCycle() {
        // Mettre à jour toutes les minutes
        setInterval(() => {
            this.timeOfDay = (this.timeOfDay + 0.1) % 24;
            this.updateTimeOfDay();
        }, 60000); // 1 minute
        
        // Initialisation
        this.updateTimeOfDay();
    }
    
    /**
     * Met à jour l'heure du jour
     */
    updateTimeOfDay() {
        const hours = Math.floor(this.timeOfDay);
        const minutes = Math.floor((this.timeOfDay % 1) * 60);
        
        this.elements.timeDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Changer le thème selon l'heure
        if (hours >= 6 && hours < 18) {
            if (this.theme !== 'day') this.changeTheme('day');
            this.elements.weatherIcon.textContent = '☀️';
        } else if (hours >= 18 && hours < 20) {
            if (this.theme !== 'sunset') this.changeTheme('sunset');
            this.elements.weatherIcon.textContent = '🌅';
        } else {
            if (this.theme !== 'night') this.changeTheme('night');
            this.elements.weatherIcon.textContent = '🌙';
        }
    }
}

// ============================================
// EXPORT
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EricScene, SCENE_CONFIG };
}

if (typeof window !== 'undefined') {
    window.EricScene = EricScene;
    window.SCENE_CONFIG = SCENE_CONFIG;
}
