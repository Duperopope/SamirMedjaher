/**
 * 🐈‍⬛ ERIC HD RENDERER
 * Système de rendu HD avec vraies assets professionnelles
 * Version: 1.0
 * 
 * Assets: Black Cat Sprites by Carysaurus
 * Source: https://carysaurus.itch.io/black-cat-sprites
 * License: Free for commercial use with attribution
 * 
 * Animations disponibles (FREE pack + previews):
 * - idle.gif : Chat noir au repos (5.7KB)
 * - run.gif : Chat noir qui court (7.0KB)
 * - eat.gif : Chat noir qui mange (3.9KB)
 * - sleep.gif : Chat noir qui dort (1.7KB)
 * - sit.gif : Chat noir assis (2.5KB)
 */

// ============================================
// CONFIGURATION HD RENDERER
// ============================================

const HD_RENDERER_CONFIG = {
    // Chemin vers les assets
    ASSETS_PATH: 'assets/sprites/black-cat/',
    
    // Mapping des états du jeu vers les animations
    STATE_ANIMATIONS: {
        'idle': 'idle.gif',       // Au repos
        'walk': 'run.gif',        // Marche/Course
        'eat': 'eat.gif',         // Mange
        'play': 'run.gif',        // Joue (utilise run)
        'sleep': 'sleep.gif',     // Dort
        'sad': 'sit.gif'          // Triste (assis)
    },
    
    // Dimensions d'affichage (upscale depuis 32x32 vers HD)
    DISPLAY_WIDTH: 256,   // 8x upscale pour rendu HD
    DISPLAY_HEIGHT: 256,
    
    // Configuration du conteneur
    CONTAINER: {
        width: '300px',
        height: '300px',
        background: 'transparent'
    },
    
    // Effets visuels
    EFFECTS: {
        shadow: true,
        scale: 1.2,           // Légèrement agrandi
        smoothing: true,      // Anti-aliasing
        glow: true            // Effet de glow selon l'état
    }
};

// ============================================
// CLASSE HD RENDERER
// ============================================

class EricHDRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentState = 'idle';
        this.imageElement = null;
        this.shadowElement = null;
        
        if (!this.container) {
            console.error('❌ Conteneur HD Renderer introuvable:', containerId);
            return;
        }
        
        this.init();
    }
    
    /**
     * Initialise le renderer HD
     */
    init() {
        console.log('🐈‍⬛ Initialisation HD Renderer...');
        
        // Nettoyer le conteneur
        this.container.innerHTML = '';
        
        // Créer la structure HTML
        this.createStructure();
        
        // Charger l'animation initiale
        this.setState('idle');
        
        console.log('✅ HD Renderer initialisé avec succès');
    }
    
    /**
     * Crée la structure HTML du renderer
     */
    createStructure() {
        // Wrapper pour le chat avec effets
        const wrapper = document.createElement('div');
        wrapper.className = 'hd-cat-wrapper';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-style: preserve-3d;
        `;
        
        // Ombre portée
        if (HD_RENDERER_CONFIG.EFFECTS.shadow) {
            this.shadowElement = document.createElement('div');
            this.shadowElement.className = 'hd-cat-shadow';
            this.shadowElement.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 120px;
                height: 20px;
                background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                filter: blur(8px);
                z-index: 1;
            `;
            wrapper.appendChild(this.shadowElement);
        }
        
        // Image du chat (GIF animé)
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'hd-cat-image';
        this.imageElement.alt = 'Eric le chat noir';
        this.imageElement.style.cssText = `
            width: ${HD_RENDERER_CONFIG.DISPLAY_WIDTH}px;
            height: ${HD_RENDERER_CONFIG.DISPLAY_HEIGHT}px;
            image-rendering: ${HD_RENDERER_CONFIG.EFFECTS.smoothing ? 'auto' : 'pixelated'};
            object-fit: contain;
            transform: scale(${HD_RENDERER_CONFIG.EFFECTS.scale});
            filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
            transition: all 0.3s ease;
            cursor: pointer;
            z-index: 2;
            position: relative;
        `;
        
        // Hover effect
        this.imageElement.addEventListener('mouseenter', () => {
            this.imageElement.style.transform = `scale(${HD_RENDERER_CONFIG.EFFECTS.scale * 1.05})`;
            this.imageElement.style.filter = 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.4)) brightness(1.1)';
        });
        
        this.imageElement.addEventListener('mouseleave', () => {
            this.imageElement.style.transform = `scale(${HD_RENDERER_CONFIG.EFFECTS.scale})`;
            this.imageElement.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))';
        });
        
        wrapper.appendChild(this.imageElement);
        
        // Effet de glow (selon l'état)
        if (HD_RENDERER_CONFIG.EFFECTS.glow) {
            const glowElement = document.createElement('div');
            glowElement.className = 'hd-cat-glow';
            glowElement.id = 'hdCatGlow';
            glowElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 215, 0, 0) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: none;
                z-index: 0;
            `;
            wrapper.appendChild(glowElement);
        }
        
        this.container.appendChild(wrapper);
    }
    
    /**
     * Change l'état du chat (et l'animation associée)
     */
    setState(newState) {
        if (this.currentState === newState) return;
        
        const animationFile = HD_RENDERER_CONFIG.STATE_ANIMATIONS[newState];
        
        if (!animationFile) {
            console.warn('⚠️ État inconnu:', newState);
            return;
        }
        
        this.currentState = newState;
        
        // Charger la nouvelle animation
        const animationPath = HD_RENDERER_CONFIG.ASSETS_PATH + animationFile;
        
        // Transition douce
        this.imageElement.style.opacity = '0';
        
        setTimeout(() => {
            this.imageElement.src = animationPath;
            this.imageElement.style.opacity = '1';
            
            // Appliquer les effets selon l'état
            this.applyStateEffects(newState);
            
            console.log(`🎭 État changé: ${newState} → ${animationFile}`);
        }, 150);
    }
    
    /**
     * Applique les effets visuels selon l'état
     */
    applyStateEffects(state) {
        const glowElement = document.getElementById('hdCatGlow');
        if (!glowElement) return;
        
        // Réinitialiser
        glowElement.style.opacity = '0';
        
        switch(state) {
            case 'play':
                // Glow doré pour jouer
                glowElement.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)';
                glowElement.style.opacity = '1';
                break;
                
            case 'eat':
                // Glow orange pour manger
                glowElement.style.background = 'radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%)';
                glowElement.style.opacity = '1';
                break;
                
            case 'sleep':
                // Glow bleu doux pour dormir
                glowElement.style.background = 'radial-gradient(circle, rgba(135, 206, 235, 0.2) 0%, transparent 70%)';
                glowElement.style.opacity = '1';
                break;
                
            case 'sad':
                // Pas de glow pour triste
                glowElement.style.opacity = '0';
                break;
                
            default:
                // Léger glow neutre pour idle/walk
                glowElement.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)';
                glowElement.style.opacity = '0.5';
        }
    }
    
    /**
     * Obtient l'état actuel
     */
    getState() {
        return this.currentState;
    }
    
    /**
     * Joue une animation temporaire puis revient à idle
     */
    playTemporaryAnimation(state, duration = 2000) {
        this.setState(state);
        
        setTimeout(() => {
            this.setState('idle');
        }, duration);
    }
    
    /**
     * Détruit le renderer
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.imageElement = null;
        this.shadowElement = null;
    }
}

// ============================================
// EXPORT
// ============================================

window.EricHDRenderer = EricHDRenderer;
window.HD_RENDERER_CONFIG = HD_RENDERER_CONFIG;

console.log('✅ Eric HD Renderer chargé - Vraies assets professionnelles !');
console.log('🐈‍⬛ Chat noir HD par Carysaurus - https://carysaurus.itch.io/black-cat-sprites');
