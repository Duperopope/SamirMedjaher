/**
 * 🎨 ERIC ISOMETRIC RENDERER
 * Moteur de rendu isométrique professionnel style Dofus/Wakfu
 * Version: 1.0
 * 
 * Sources & Références:
 * - Pikuma Isometric Projection: https://pikuma.com/blog/isometric-projection-in-games
 * - Dofus/Wakfu Art Style: 2D isometric avec ratio 2:1
 * - Formules mathématiques: Projection dimetric optimisée pour pixel art
 * 
 * Features:
 * - Projection isométrique 2:1 (2 pixels horizontal = 1 pixel vertical)
 * - Support 8 directions (N, NE, E, SE, S, SW, W, NW)
 * - Animation frame-by-frame fluide
 * - Système de sprites multi-états
 * - Effets visuels professionnels (ombres, highlights, particules)
 */

// ============================================
// CONFIGURATION ISOMÉTRIQUE
// ============================================

const ISOMETRIC_CONFIG = {
    // Dimensions des tiles (ratio 2:1 pour isométrique classique)
    TILE_WIDTH: 128,
    TILE_HEIGHT: 64,
    
    // Dimensions du sprite du personnage
    SPRITE_WIDTH: 128,
    SPRITE_HEIGHT: 160,
    
    // 8 directions cardinales (comme Dofus/Wakfu)
    DIRECTIONS: {
        'N': { angle: 0, col: 0 },      // Nord
        'NE': { angle: 45, col: 1 },    // Nord-Est
        'E': { angle: 90, col: 2 },     // Est
        'SE': { angle: 135, col: 3 },   // Sud-Est
        'S': { angle: 180, col: 4 },    // Sud
        'SW': { angle: 225, col: 5 },   // Sud-Ouest
        'W': { angle: 270, col: 6 },    // Ouest
        'NW': { angle: 315, col: 7 }    // Nord-Ouest
    },
    
    // États du personnage (mapping avec states du jeu)
    STATES: {
        'idle': { row: 0, frames: 4, fps: 8 },        // Au repos
        'walk': { row: 1, frames: 8, fps: 12 },       // Marche
        'eat': { row: 2, frames: 6, fps: 10 },        // Mange
        'play': { row: 3, frames: 8, fps: 14 },       // Joue
        'sleep': { row: 4, frames: 4, fps: 6 },       // Dort
        'sad': { row: 5, frames: 4, fps: 8 }          // Triste
    },
    
    // Configuration d'animation
    ANIMATION: {
        smoothTransition: true,
        transitionDuration: 200,  // ms
        easing: 'ease-out'
    },
    
    // Effets visuels
    EFFECTS: {
        shadow: true,
        highlight: true,
        particles: true,
        glow: true
    }
};

// ============================================
// CLASSE PRINCIPALE : MOTEUR ISOMÉTRIQUE
// ============================================

class IsometricRenderer {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.spriteSheet = null;
        this.currentState = 'idle';
        this.currentDirection = 'SE';
        this.currentFrame = 0;
        this.animationTimer = 0;
        this.position = { x: 0, y: 0, z: 0 };  // z = hauteur
        
        this.init();
    }
    
    /**
     * Initialise le renderer
     */
    init() {
        this.createCanvas();
        this.loadSpriteSheet();
        this.startAnimationLoop();
    }
    
    /**
     * Crée le canvas de rendu
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.canvas.className = 'eric-isometric-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration du contexte pour rendu haute qualité
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    /**
     * Charge le sprite sheet (généré dynamiquement)
     */
    loadSpriteSheet() {
        // Le sprite sheet sera généré par eric-isometric-sprites.js
        // Format: 8 colonnes (directions) × 6 lignes (états)
        this.spriteSheet = new Image();
        this.spriteSheet.onload = () => {
            console.log('✅ Sprite sheet isométrique chargé');
            this.render();
        };
        
        // Appel au générateur de sprites
        if (window.generateIsometricSpriteSheet) {
            window.generateIsometricSpriteSheet().then(dataUrl => {
                this.spriteSheet.src = dataUrl;
            });
        }
    }
    
    /**
     * Convertit coordonnées cartésiennes en coordonnées isométriques
     * Formule: x_screen = (x - y) * TILE_WIDTH/2
     *          y_screen = (x + y) * TILE_HEIGHT/2
     * Source: https://pikuma.com/blog/isometric-projection-in-games
     */
    cartesianToIsometric(x, y, z = 0) {
        const isoX = (x - y) * (ISOMETRIC_CONFIG.TILE_WIDTH / 2);
        const isoY = (x + y) * (ISOMETRIC_CONFIG.TILE_HEIGHT / 2) - z;
        return { x: isoX, y: isoY };
    }
    
    /**
     * Convertit coordonnées isométriques en coordonnées cartésiennes
     * Formule inverse pour picking/interaction
     */
    isometricToCartesian(isoX, isoY) {
        const cartX = (isoX / ISOMETRIC_CONFIG.TILE_WIDTH) + 
                     (2 * isoY / ISOMETRIC_CONFIG.TILE_HEIGHT);
        const cartY = -(isoX / ISOMETRIC_CONFIG.TILE_WIDTH) + 
                      (2 * isoY / ISOMETRIC_CONFIG.TILE_HEIGHT);
        return { x: cartX, y: cartY };
    }
    
    /**
     * Définit la position du personnage
     */
    setPosition(x, y, z = 0) {
        this.position = { x, y, z };
        this.render();
    }
    
    /**
     * Change l'état du personnage
     */
    setState(newState) {
        if (this.currentState !== newState && ISOMETRIC_CONFIG.STATES[newState]) {
            this.currentState = newState;
            this.currentFrame = 0;
            this.animationTimer = 0;
            
            console.log(`🎭 État changé: ${newState}`);
        }
    }
    
    /**
     * Change la direction du personnage
     */
    setDirection(angle) {
        // Trouve la direction la plus proche de l'angle
        let closestDir = 'SE';
        let minDiff = 360;
        
        for (const [dir, data] of Object.entries(ISOMETRIC_CONFIG.DIRECTIONS)) {
            let diff = Math.abs(data.angle - angle);
            if (diff > 180) diff = 360 - diff;
            if (diff < minDiff) {
                minDiff = diff;
                closestDir = dir;
            }
        }
        
        if (this.currentDirection !== closestDir) {
            this.currentDirection = closestDir;
            console.log(`🧭 Direction changée: ${closestDir} (${angle}°)`);
        }
    }
    
    /**
     * Lance la boucle d'animation
     */
    startAnimationLoop() {
        let lastTime = 0;
        
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= 1000 / this.getCurrentFPS()) {
                this.updateAnimation();
                this.render();
                lastTime = currentTime;
            }
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Met à jour l'animation
     */
    updateAnimation() {
        const state = ISOMETRIC_CONFIG.STATES[this.currentState];
        if (!state) return;
        
        this.currentFrame = (this.currentFrame + 1) % state.frames;
    }
    
    /**
     * Obtient le FPS actuel selon l'état
     */
    getCurrentFPS() {
        const state = ISOMETRIC_CONFIG.STATES[this.currentState];
        return state ? state.fps : 10;
    }
    
    /**
     * Rendu principal
     */
    render() {
        if (!this.spriteSheet || !this.spriteSheet.complete) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calcule la position isométrique
        const iso = this.cartesianToIsometric(
            this.position.x,
            this.position.y,
            this.position.z
        );
        
        // Centre du canvas
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Position finale
        const drawX = centerX + iso.x - ISOMETRIC_CONFIG.SPRITE_WIDTH / 2;
        const drawY = centerY + iso.y - ISOMETRIC_CONFIG.SPRITE_HEIGHT / 2;
        
        // Dessine l'ombre (si activée)
        if (ISOMETRIC_CONFIG.EFFECTS.shadow) {
            this.drawShadow(drawX, drawY);
        }
        
        // Dessine le sprite
        this.drawSprite(drawX, drawY);
        
        // Effets additionnels
        if (ISOMETRIC_CONFIG.EFFECTS.highlight) {
            this.drawHighlight(drawX, drawY);
        }
    }
    
    /**
     * Dessine le sprite depuis le sprite sheet
     */
    drawSprite(x, y) {
        const state = ISOMETRIC_CONFIG.STATES[this.currentState];
        const direction = ISOMETRIC_CONFIG.DIRECTIONS[this.currentDirection];
        
        if (!state || !direction) return;
        
        // Calcule la position dans le sprite sheet
        const frameX = this.currentFrame * ISOMETRIC_CONFIG.SPRITE_WIDTH;
        const frameY = (state.row * 8 + direction.col) * ISOMETRIC_CONFIG.SPRITE_HEIGHT;
        
        // Dessine le sprite
        this.ctx.drawImage(
            this.spriteSheet,
            frameX,
            frameY,
            ISOMETRIC_CONFIG.SPRITE_WIDTH,
            ISOMETRIC_CONFIG.SPRITE_HEIGHT,
            x,
            y,
            ISOMETRIC_CONFIG.SPRITE_WIDTH,
            ISOMETRIC_CONFIG.SPRITE_HEIGHT
        );
    }
    
    /**
     * Dessine l'ombre portée
     */
    drawShadow(x, y) {
        const shadowY = y + ISOMETRIC_CONFIG.SPRITE_HEIGHT - 20;
        const shadowWidth = ISOMETRIC_CONFIG.SPRITE_WIDTH * 0.6;
        const shadowHeight = 12;
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(
            x + ISOMETRIC_CONFIG.SPRITE_WIDTH / 2,
            shadowY,
            shadowWidth / 2,
            shadowHeight / 2,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.restore();
    }
    
    /**
     * Dessine un highlight/glow autour du personnage
     */
    drawHighlight(x, y) {
        if (this.currentState === 'play' || this.currentState === 'eat') {
            this.ctx.save();
            this.ctx.shadowColor = ISOMETRIC_CONFIG.EFFECTS.glow ? '#FFD700' : 'transparent';
            this.ctx.shadowBlur = 20;
            this.ctx.restore();
        }
    }
    
    /**
     * Obtient le canvas pour intégration
     */
    getCanvas() {
        return this.canvas;
    }
    
    /**
     * Détruit le renderer
     */
    destroy() {
        this.canvas = null;
        this.ctx = null;
        this.spriteSheet = null;
    }
}

// ============================================
// UTILITAIRES ISOMÉTRIQUES
// ============================================

/**
 * Classe utilitaire pour calculs isométriques
 */
class IsometricUtils {
    /**
     * Calcule la distance entre deux points en coordonnées cartésiennes
     */
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    /**
     * Calcule l'angle entre deux points
     */
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    }
    
    /**
     * Interpolation linéaire
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    /**
     * Easing ease-out
     */
    static easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// ============================================
// EXPORT
// ============================================

window.IsometricRenderer = IsometricRenderer;
window.IsometricUtils = IsometricUtils;
window.ISOMETRIC_CONFIG = ISOMETRIC_CONFIG;

console.log('✅ Eric Isometric Renderer chargé');
