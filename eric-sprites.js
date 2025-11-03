/**
 * 🐱 ERIC SPRITES SYSTEM
 * Système de sprites SVG animés pour Eric le Chat
 * Version: 1.0
 * 
 * États disponibles:
 * - idle: État de repos (animation respiration)
 * - happy: Content et joyeux (queue qui remue)
 * - hungry: Affamé (expression triste + estomac grogne)
 * - sad: Triste (oreilles baissées)
 * - eating: En train de manger (animation bouche)
 * - playing: Joue avec une balle (animation dynamique)
 * - sleeping: Endormi (yeux fermés + zzz)
 * - excited: Super excité (saute de joie)
 * - love: Amoureux (coeurs dans les yeux)
 */

// ============================================
// CONFIGURATION SPRITES
// ============================================

const SPRITE_CONFIG = {
    // Taille du canvas SVG
    viewBox: '0 0 200 200',
    
    // Couleurs du chat (modifiable selon évolution)
    colors: {
        chaton: {
            body: '#FF9D42',      // Orange clair
            belly: '#FFD8A8',     // Beige
            eyes: '#2D3E50',      // Gris foncé
            nose: '#FF6B9D',      // Rose
            stripes: '#E67E22',   // Orange foncé
            outline: '#2C3E50'    // Contour sombre
        },
        adulte: {
            body: '#FF8833',
            belly: '#FFC080',
            eyes: '#1A252F',
            nose: '#FF5577',
            stripes: '#D65000',
            outline: '#1A252F'
        },
        pro: {
            body: '#06B6D4',      // Cyan (tech)
            belly: '#67E8F9',
            eyes: '#0F172A',
            nose: '#8B5CF6',      // Violet
            stripes: '#0891B2',
            outline: '#0F172A'
        },
        legendaire: {
            body: '#8B5CF6',      // Violet légendaire
            belly: '#C4B5FD',
            eyes: '#FCD34D',      // Yeux dorés
            nose: '#F59E0B',
            stripes: '#6D28D9',
            outline: '#4C1D95'
        }
    }
};

// ============================================
// GÉNÉRATEUR DE SPRITES SVG
// ============================================

class EricSprites {
    constructor(evolution = 'chaton') {
        this.evolution = evolution;
        this.colors = SPRITE_CONFIG.colors[evolution];
    }
    
    /**
     * Génère le corps de base d'Eric
     */
    generateBody() {
        return `
            <!-- Corps principal (ellipse) -->
            <ellipse cx="100" cy="120" rx="60" ry="50" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"/>
            
            <!-- Ventre (ellipse plus claire) -->
            <ellipse cx="100" cy="130" rx="40" ry="35" 
                fill="${this.colors.belly}"/>
            
            <!-- Rayures -->
            <path d="M 70 100 Q 80 105, 90 100" 
                stroke="${this.colors.stripes}" 
                stroke-width="2" 
                fill="none"/>
            <path d="M 110 100 Q 120 105, 130 100" 
                stroke="${this.colors.stripes}" 
                stroke-width="2" 
                fill="none"/>
        `;
    }
    
    /**
     * Génère la tête d'Eric
     */
    generateHead(expression = 'neutral') {
        const expressions = {
            neutral: {
                eyeY: 70,
                eyeRx: 8,
                eyeRy: 12,
                pupilY: 70,
                mouthPath: 'M 85 85 Q 100 90, 115 85'
            },
            happy: {
                eyeY: 68,
                eyeRx: 8,
                eyeRy: 10,
                pupilY: 68,
                mouthPath: 'M 85 85 Q 100 95, 115 85' // Sourire large
            },
            sad: {
                eyeY: 72,
                eyeRx: 6,
                eyeRy: 8,
                pupilY: 75,
                mouthPath: 'M 85 90 Q 100 85, 115 90' // Bouche triste
            },
            sleeping: {
                eyeY: 70,
                eyeRx: 10,
                eyeRy: 2,  // Yeux fermés
                pupilY: 70,
                mouthPath: 'M 90 85 Q 100 88, 110 85' // Petite bouche
            },
            eating: {
                eyeY: 70,
                eyeRx: 8,
                eyeRy: 12,
                pupilY: 80, // Regarde en bas
                mouthPath: 'M 85 85 L 100 95 L 115 85' // Bouche ouverte
            },
            love: {
                eyeY: 70,
                eyeRx: 8,
                eyeRy: 12,
                pupilY: 70,
                mouthPath: 'M 85 85 Q 100 88, 115 85', // Petit sourire
                heartsInEyes: true
            }
        };
        
        const expr = expressions[expression] || expressions.neutral;
        
        return `
            <!-- Tête (cercle) -->
            <circle cx="100" cy="80" r="45" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"/>
            
            <!-- Oreilles -->
            <path d="M 70 55 L 65 35 L 85 50 Z" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="ear-left"/>
            <path d="M 130 55 L 135 35 L 115 50 Z" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="ear-right"/>
            
            <!-- Yeux -->
            <g class="eyes">
                <ellipse cx="85" cy="${expr.eyeY}" rx="${expr.eyeRx}" ry="${expr.eyeRy}" 
                    fill="white" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                <ellipse cx="115" cy="${expr.eyeY}" rx="${expr.eyeRx}" ry="${expr.eyeRy}" 
                    fill="white" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                
                ${expr.heartsInEyes ? `
                    <!-- Coeurs dans les yeux -->
                    <path d="M 85 ${expr.eyeY} m -5 0 a 3 3 0 0 1 5 -2 a 3 3 0 0 1 5 2 l -5 6 z" 
                        fill="#FF1744"/>
                    <path d="M 115 ${expr.eyeY} m -5 0 a 3 3 0 0 1 5 -2 a 3 3 0 0 1 5 2 l -5 6 z" 
                        fill="#FF1744"/>
                ` : `
                    <!-- Pupilles -->
                    <circle cx="85" cy="${expr.pupilY}" r="5" 
                        fill="${this.colors.eyes}" 
                        class="pupil-left"/>
                    <circle cx="115" cy="${expr.pupilY}" r="5" 
                        fill="${this.colors.eyes}" 
                        class="pupil-right"/>
                `}
            </g>
            
            <!-- Nez -->
            <circle cx="100" cy="80" r="4" 
                fill="${this.colors.nose}"/>
            
            <!-- Bouche -->
            <path d="${expr.mouthPath}" 
                stroke="${this.colors.outline}" 
                stroke-width="2" 
                fill="none" 
                stroke-linecap="round"
                class="mouth"/>
            
            <!-- Moustaches -->
            <g class="whiskers">
                <line x1="60" y1="75" x2="40" y2="70" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                <line x1="60" y1="80" x2="40" y2="80" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                <line x1="60" y1="85" x2="40" y2="90" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                    
                <line x1="140" y1="75" x2="160" y2="70" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                <line x1="140" y1="80" x2="160" y2="80" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
                <line x1="140" y1="85" x2="160" y2="90" 
                    stroke="${this.colors.outline}" 
                    stroke-width="1.5"/>
            </g>
        `;
    }
    
    /**
     * Génère la queue d'Eric
     */
    generateTail(position = 'neutral') {
        const positions = {
            neutral: 'M 40 120 Q 20 110, 25 90',
            happy: 'M 40 120 Q 30 100, 40 80', // Queue dressée
            sad: 'M 40 120 Q 20 130, 15 140',  // Queue basse
            wagging: 'M 40 120 Q 20 110, 25 90' // Animation séparée
        };
        
        return `
            <path d="${positions[position]}" 
                stroke="${this.colors.outline}" 
                stroke-width="8" 
                fill="none" 
                stroke-linecap="round"
                class="tail"/>
        `;
    }
    
    /**
     * Génère les pattes d'Eric
     */
    generatePaws() {
        return `
            <!-- Pattes avant -->
            <ellipse cx="80" cy="160" rx="12" ry="18" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="paw-front-left"/>
            <ellipse cx="120" cy="160" rx="12" ry="18" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="paw-front-right"/>
            
            <!-- Pattes arrière (partiellement visibles) -->
            <ellipse cx="65" cy="155" rx="10" ry="15" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="paw-back-left"/>
            <ellipse cx="135" cy="155" rx="10" ry="15" 
                fill="${this.colors.body}" 
                stroke="${this.colors.outline}" 
                stroke-width="2"
                class="paw-back-right"/>
        `;
    }
    
    /**
     * Génère un sprite complet selon l'état
     */
    generateSprite(state = 'idle') {
        const stateConfig = {
            idle: {
                expression: 'neutral',
                tailPosition: 'neutral',
                animationClass: 'eric-idle'
            },
            happy: {
                expression: 'happy',
                tailPosition: 'happy',
                animationClass: 'eric-happy'
            },
            hungry: {
                expression: 'sad',
                tailPosition: 'sad',
                animationClass: 'eric-hungry'
            },
            sad: {
                expression: 'sad',
                tailPosition: 'sad',
                animationClass: 'eric-sad'
            },
            eating: {
                expression: 'eating',
                tailPosition: 'happy',
                animationClass: 'eric-eating'
            },
            playing: {
                expression: 'happy',
                tailPosition: 'wagging',
                animationClass: 'eric-playing'
            },
            sleeping: {
                expression: 'sleeping',
                tailPosition: 'neutral',
                animationClass: 'eric-sleeping'
            },
            love: {
                expression: 'love',
                tailPosition: 'happy',
                animationClass: 'eric-love'
            }
        };
        
        const config = stateConfig[state] || stateConfig.idle;
        
        return `
<svg viewBox="${SPRITE_CONFIG.viewBox}" 
     class="eric-sprite ${config.animationClass}" 
     xmlns="http://www.w3.org/2000/svg">
    
    <!-- Définitions pour les effets -->
    <defs>
        <!-- Ombre portée -->
        <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
        
        <!-- Gradient pour le brillant -->
        <radialGradient id="shine">
            <stop offset="0%" stop-color="white" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
    </defs>
    
    <!-- Ombre au sol -->
    <ellipse cx="100" cy="180" rx="50" ry="10" 
        fill="rgba(0,0,0,0.2)" 
        class="ground-shadow"/>
    
    <!-- Queue (en arrière-plan) -->
    ${this.generateTail(config.tailPosition)}
    
    <!-- Pattes -->
    ${this.generatePaws()}
    
    <!-- Corps -->
    ${this.generateBody()}
    
    <!-- Tête -->
    ${this.generateHead(config.expression)}
    
    <!-- Accessoires selon l'état -->
    ${this.generateAccessories(state)}
    
    <!-- Brillance pour effet 3D -->
    <ellipse cx="90" cy="110" rx="25" ry="20" 
        fill="url(#shine)" 
        opacity="0.4"/>
</svg>
        `;
    }
    
    /**
     * Génère des accessoires selon l'état
     */
    generateAccessories(state) {
        switch(state) {
            case 'eating':
                return `
                    <!-- Bol de nourriture -->
                    <g class="food-bowl">
                        <ellipse cx="100" cy="170" rx="20" ry="8" fill="#E74C3C"/>
                        <ellipse cx="100" cy="168" rx="18" ry="6" fill="#C0392B"/>
                        <circle cx="100" cy="165" r="8" fill="#F39C12"/>
                    </g>
                `;
            
            case 'playing':
                return `
                    <!-- Balle de jeu -->
                    <circle cx="140" cy="140" r="12" 
                        fill="#3498DB" 
                        stroke="#2980B9" 
                        stroke-width="2"
                        class="toy-ball"/>
                    <path d="M 140 128 Q 140 140, 152 140" 
                        stroke="white" 
                        stroke-width="1.5" 
                        fill="none"/>
                `;
            
            case 'sleeping':
                return `
                    <!-- ZZZ de sommeil -->
                    <text x="130" y="50" 
                        font-family="Arial" 
                        font-size="16" 
                        fill="${this.colors.outline}" 
                        opacity="0.7"
                        class="zzz">Z</text>
                    <text x="145" y="40" 
                        font-family="Arial" 
                        font-size="20" 
                        fill="${this.colors.outline}" 
                        opacity="0.5"
                        class="zzz">Z</text>
                    <text x="160" y="30" 
                        font-family="Arial" 
                        font-size="24" 
                        fill="${this.colors.outline}" 
                        opacity="0.3"
                        class="zzz">Z</text>
                `;
            
            case 'love':
                return `
                    <!-- Coeurs flottants -->
                    <path d="M 130 60 m -6 0 a 4 4 0 0 1 6 -3 a 4 4 0 0 1 6 3 l -6 8 z" 
                        fill="#FF1744" 
                        opacity="0.8"
                        class="floating-heart"/>
                    <path d="M 150 50 m -5 0 a 3 3 0 0 1 5 -2 a 3 3 0 0 1 5 2 l -5 6 z" 
                        fill="#FF1744" 
                        opacity="0.6"
                        class="floating-heart"/>
                `;
            
            case 'hungry':
                return `
                    <!-- Icône d'estomac qui gronde -->
                    <text x="110" y="130" 
                        font-family="Arial" 
                        font-size="20" 
                        class="hunger-icon">🍽️</text>
                `;
            
            default:
                return '';
        }
    }
}

// ============================================
// EXPORT
// ============================================

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EricSprites, SPRITE_CONFIG };
}

// Export global pour navigateur
if (typeof window !== 'undefined') {
    window.EricSprites = EricSprites;
    window.SPRITE_CONFIG = SPRITE_CONFIG;
}
