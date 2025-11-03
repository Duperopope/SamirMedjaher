/**
 * 🎨 ERIC ISOMETRIC SPRITE GENERATOR
 * Générateur procédural de sprites isométriques style Dofus/Wakfu
 * Version: 1.0
 * 
 * Références artistiques:
 * - Style Dofus/Wakfu: Coloré, cartoon, isométrique avec outlines épais
 * - Palette: Couleurs vives et saturées, ombres douces
 * - Proportions: Style chibi/cartoon (tête large, corps compact)
 * 
 * Génère un sprite sheet complet:
 * - 8 directions × 6 états = 48 sprites de base
 * - 4-8 frames par animation
 * - Format: Canvas → Data URL
 */

// ============================================
// CONFIGURATION ARTISTIQUE
// ============================================

const SPRITE_ART_CONFIG = {
    // Palette de couleurs style Dofus/Wakfu (chaude et vibrante)
    colors: {
        // Fourrure du chat (orange/roux vibrant)
        fur: {
            base: '#FF8C42',
            light: '#FFB366',
            dark: '#E67332',
            shadow: '#CC5A22'
        },
        // Ventre (crème clair)
        belly: {
            base: '#FFF5E1',
            light: '#FFFFFF',
            shadow: '#F5E5C8'
        },
        // Yeux (vert émeraude brillant)
        eyes: {
            base: '#2ECC71',
            light: '#5FE89C',
            pupil: '#1A5D3A',
            shine: '#FFFFFF'
        },
        // Nez et détails (rose)
        details: {
            nose: '#FF6B9D',
            paws: '#FF9966',
            tongue: '#FF7B8B'
        },
        // Outline (brun foncé épais style Dofus)
        outline: '#3D2817',
        
        // Effets spéciaux
        effects: {
            happy: '#FFD700',      // Particules dorées
            love: '#FF69B4',       // Cœurs roses
            sleep: '#87CEEB',      // Z bleus
            energy: '#F39C12'      // Éclairs orange
        }
    },
    
    // Style de dessin
    style: {
        outlineWidth: 3,           // Outline épais style cartoon
        shadowBlur: 4,             // Ombrage doux
        highlightIntensity: 0.3,   // Intensité des highlights
        roundness: 0.8             // Arrondissement des formes (0-1)
    },
    
    // Proportions du personnage (style chibi)
    proportions: {
        headSize: 0.45,        // Tête = 45% de la hauteur totale
        bodySize: 0.35,        // Corps = 35%
        legsSize: 0.20,        // Pattes = 20%
        earHeight: 0.25,       // Oreilles = 25% de la tête
        tailLength: 0.6        // Queue = 60% du corps
    }
};

// ============================================
// GÉNÉRATEUR DE SPRITES
// ============================================

class IsometricSpriteGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Dimensions du sprite sheet complet
        // 8 frames max × 8 directions × 6 états
        this.canvas.width = 128 * 8;  // 1024px
        this.canvas.height = 160 * 48; // 7680px (8 directions × 6 états)
        
        this.setupContext();
    }
    
    /**
     * Configure le contexte de dessin
     */
    setupContext() {
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    /**
     * Génère le sprite sheet complet
     */
    async generate() {
        console.log('🎨 Génération du sprite sheet isométrique...');
        
        const states = ['idle', 'walk', 'eat', 'play', 'sleep', 'sad'];
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        
        let row = 0;
        
        for (const state of states) {
            for (const direction of directions) {
                const frames = ISOMETRIC_CONFIG.STATES[state].frames;
                
                for (let frame = 0; frame < 8; frame++) {
                    const x = frame * 128;
                    const y = row * 160;
                    
                    if (frame < frames) {
                        this.drawCharacter(x, y, state, direction, frame, frames);
                    }
                }
                
                row++;
            }
        }
        
        console.log('✅ Sprite sheet généré !');
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Dessine un personnage à une position donnée
     */
    drawCharacter(x, y, state, direction, frame, totalFrames) {
        this.ctx.save();
        this.ctx.translate(x + 64, y + 80); // Centre du sprite
        
        // Rotation selon la direction
        const angle = ISOMETRIC_CONFIG.DIRECTIONS[direction].angle;
        const radians = (angle - 135) * Math.PI / 180; // Ajustement pour que SE soit par défaut
        
        // Animation de marche (balancement)
        const walkCycle = Math.sin((frame / totalFrames) * Math.PI * 2);
        const bounce = state === 'walk' ? walkCycle * 3 : 0;
        
        this.ctx.translate(0, bounce);
        
        // Dessine les parties du personnage (de l'arrière vers l'avant)
        this.drawTail(state, frame, totalFrames);
        this.drawBody(state, direction);
        this.drawLegs(state, frame, totalFrames, walkCycle);
        this.drawHead(state, direction, frame, totalFrames);
        this.drawEars(direction);
        this.drawFace(state, frame, totalFrames);
        this.drawEffects(state, frame, totalFrames);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine le corps
     */
    drawBody(state, direction) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        // Corps principal (forme ovale)
        this.ctx.save();
        
        // Ombre
        this.ctx.fillStyle = colors.fur.shadow;
        this.ctx.beginPath();
        this.ctx.ellipse(2, 2, 28, 22, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Corps
        this.ctx.fillStyle = colors.fur.base;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 28, 22, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Outline
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = SPRITE_ART_CONFIG.style.outlineWidth;
        this.ctx.stroke();
        
        // Ventre
        this.ctx.fillStyle = colors.belly.base;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 5, 18, 15, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Outline ventre
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(-8, -8, 10, 8, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine la tête
     */
    drawHead(state, direction, frame, totalFrames) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        this.ctx.save();
        this.ctx.translate(0, -35);
        
        // Animation de hochement de tête
        if (state === 'eat') {
            const nod = Math.sin((frame / totalFrames) * Math.PI * 4) * 5;
            this.ctx.rotate(nod * Math.PI / 180);
        }
        
        // Ombre de la tête
        this.ctx.fillStyle = colors.fur.shadow;
        this.ctx.beginPath();
        this.ctx.arc(2, 2, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tête principale
        this.ctx.fillStyle = colors.fur.base;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Outline tête
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = SPRITE_ART_CONFIG.style.outlineWidth;
        this.ctx.stroke();
        
        // Highlight tête
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(-8, -8, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Museau
        this.ctx.fillStyle = colors.belly.base;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 8, 15, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine les oreilles
     */
    drawEars(direction) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        this.ctx.save();
        this.ctx.translate(0, -50);
        
        // Oreille gauche
        this.drawEar(-15, -5, colors);
        
        // Oreille droite
        this.drawEar(15, -5, colors);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine une oreille
     */
    drawEar(x, y, colors) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Forme triangulaire arrondie
        this.ctx.fillStyle = colors.fur.dark;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(-8, -10, 0, -20);
        this.ctx.quadraticCurveTo(8, -10, 0, 0);
        this.ctx.fill();
        
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Intérieur rose
        this.ctx.fillStyle = colors.details.nose;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -2);
        this.ctx.quadraticCurveTo(-4, -8, 0, -14);
        this.ctx.quadraticCurveTo(4, -8, 0, -2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine le visage (yeux, nez, moustaches)
     */
    drawFace(state, frame, totalFrames) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        this.ctx.save();
        this.ctx.translate(0, -35);
        
        // Yeux
        const eyeY = state === 'sleep' ? 0 : -5;
        
        // Œil gauche
        this.drawEye(-10, eyeY, state === 'sleep', colors);
        
        // Œil droit
        this.drawEye(10, eyeY, state === 'sleep', colors);
        
        // Nez
        this.ctx.fillStyle = colors.details.nose;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 5);
        this.ctx.lineTo(-3, 8);
        this.ctx.lineTo(3, 8);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Bouche (sourit si content)
        if (state === 'play' || state === 'eat') {
            this.ctx.strokeStyle = colors.outline;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 10, 5, 0, Math.PI);
            this.ctx.stroke();
        }
        
        // Moustaches
        this.drawWhiskers(colors.outline);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine un œil
     */
    drawEye(x, y, sleeping, colors) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        if (sleeping) {
            // Yeux fermés
            this.ctx.strokeStyle = colors.outline;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 5, 0, Math.PI);
            this.ctx.stroke();
        } else {
            // Yeux ouverts
            // Blanc de l'œil
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 6, 7, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Iris
            this.ctx.fillStyle = colors.eyes.base;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 1, 4, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupille
            this.ctx.fillStyle = colors.eyes.pupil;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 2, 2, 3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reflet
            this.ctx.fillStyle = colors.eyes.shine;
            this.ctx.beginPath();
            this.ctx.arc(-1, -1, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Outline
            this.ctx.strokeStyle = colors.outline;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 6, 7, 0, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Dessine les moustaches
     */
    drawWhiskers(color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.5;
        
        // Moustaches gauches
        [-15, -20, -18].forEach((startX, i) => {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, 3 + i * 3);
            this.ctx.quadraticCurveTo(startX - 8, 3 + i * 2, startX - 15, 5 + i * 2);
            this.ctx.stroke();
        });
        
        // Moustaches droites
        [15, 20, 18].forEach((startX, i) => {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, 3 + i * 3);
            this.ctx.quadraticCurveTo(startX + 8, 3 + i * 2, startX + 15, 5 + i * 2);
            this.ctx.stroke();
        });
    }
    
    /**
     * Dessine les pattes
     */
    drawLegs(state, frame, totalFrames, walkCycle) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        // Animation de marche
        const leftLegAngle = state === 'walk' ? walkCycle * 20 : 0;
        const rightLegAngle = state === 'walk' ? -walkCycle * 20 : 0;
        
        // Patte arrière gauche
        this.drawLeg(-15, 15, leftLegAngle, colors);
        
        // Patte arrière droite
        this.drawLeg(15, 15, rightLegAngle, colors);
        
        // Patte avant gauche
        this.drawLeg(-10, 20, rightLegAngle, colors);
        
        // Patte avant droite
        this.drawLeg(10, 20, leftLegAngle, colors);
    }
    
    /**
     * Dessine une patte
     */
    drawLeg(x, y, angle, colors) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle * Math.PI / 180);
        
        // Patte
        this.ctx.fillStyle = colors.fur.base;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Patte (bout)
        this.ctx.fillStyle = colors.details.paws;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 10, 7, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine la queue
     */
    drawTail(state, frame, totalFrames) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        // Animation de balancement
        const swing = Math.sin((frame / totalFrames) * Math.PI * 2) * 15;
        
        this.ctx.save();
        this.ctx.translate(-25, 0);
        this.ctx.rotate((swing + 30) * Math.PI / 180);
        
        // Queue (forme courbe)
        this.ctx.strokeStyle = colors.outline;
        this.ctx.lineWidth = SPRITE_ART_CONFIG.style.outlineWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(-10, -20, -5, -40);
        this.ctx.lineWidth = 12;
        this.ctx.strokeStyle = colors.fur.base;
        this.ctx.stroke();
        
        this.ctx.lineWidth = SPRITE_ART_CONFIG.style.outlineWidth;
        this.ctx.strokeStyle = colors.outline;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine des effets spéciaux selon l'état
     */
    drawEffects(state, frame, totalFrames) {
        const colors = SPRITE_ART_CONFIG.colors;
        
        this.ctx.save();
        
        switch (state) {
            case 'play':
                // Étoiles brillantes
                this.drawStars(frame, totalFrames, colors.effects.happy);
                break;
                
            case 'sleep':
                // Z de sommeil
                this.drawSleepZ(frame, totalFrames, colors.effects.sleep);
                break;
                
            case 'eat':
                // Particules de nourriture
                this.drawFoodParticles(frame, totalFrames, colors.effects.energy);
                break;
                
            case 'sad':
                // Larmes
                this.drawTears(frame, totalFrames, '#4A90E2');
                break;
        }
        
        this.ctx.restore();
    }
    
    /**
     * Dessine des étoiles
     */
    drawStars(frame, totalFrames, color) {
        const progress = frame / totalFrames;
        const positions = [
            { x: -30, y: -60 },
            { x: 30, y: -55 },
            { x: 0, y: -70 }
        ];
        
        positions.forEach((pos, i) => {
            const delay = i * 0.3;
            const alpha = Math.sin((progress + delay) * Math.PI * 2);
            
            if (alpha > 0) {
                this.ctx.save();
                this.ctx.translate(pos.x, pos.y);
                this.ctx.globalAlpha = alpha;
                
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = SPRITE_ART_CONFIG.colors.outline;
                this.ctx.lineWidth = 2;
                
                // Étoile à 5 branches
                this.ctx.beginPath();
                for (let j = 0; j < 5; j++) {
                    const angle = (j * 4 * Math.PI / 5) - Math.PI / 2;
                    const r = j % 2 === 0 ? 8 : 4;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (j === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        });
    }
    
    /**
     * Dessine les Z de sommeil
     */
    drawSleepZ(frame, totalFrames, color) {
        const progress = frame / totalFrames;
        
        for (let i = 0; i < 3; i++) {
            const offset = (progress + i * 0.3) % 1;
            const y = -50 - offset * 30;
            const x = 30 + i * 5;
            const alpha = 1 - offset;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.strokeStyle = SPRITE_ART_CONFIG.colors.outline;
            this.ctx.lineWidth = 3;
            this.ctx.strokeText('Z', 0, 0);
            this.ctx.fillText('Z', 0, 0);
            this.ctx.restore();
        }
    }
    
    /**
     * Dessine des particules de nourriture
     */
    drawFoodParticles(frame, totalFrames, color) {
        const progress = frame / totalFrames;
        
        // Petits cercles qui montent
        for (let i = 0; i < 5; i++) {
            const offset = (progress + i * 0.2) % 1;
            const y = -20 - offset * 25;
            const x = -10 + i * 5 + Math.sin(offset * Math.PI * 2) * 5;
            const alpha = 1 - offset;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    /**
     * Dessine des larmes
     */
    drawTears(frame, totalFrames, color) {
        const progress = frame / totalFrames;
        
        // Larme gauche
        if (progress > 0.3) {
            const tearY = (progress - 0.3) * 40;
            this.ctx.save();
            this.ctx.translate(-8, -30 + tearY);
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = SPRITE_ART_CONFIG.colors.outline;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        // Larme droite (décalée)
        if (progress > 0.5) {
            const tearY = (progress - 0.5) * 40;
            this.ctx.save();
            this.ctx.translate(8, -30 + tearY);
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = SPRITE_ART_CONFIG.colors.outline;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
}

// ============================================
// FONCTION D'EXPORT PRINCIPALE
// ============================================

/**
 * Génère et retourne le sprite sheet complet
 */
async function generateIsometricSpriteSheet() {
    const generator = new IsometricSpriteGenerator();
    return await generator.generate();
}

// ============================================
// EXPORT
// ============================================

window.generateIsometricSpriteSheet = generateIsometricSpriteSheet;
window.IsometricSpriteGenerator = IsometricSpriteGenerator;
window.SPRITE_ART_CONFIG = SPRITE_ART_CONFIG;

console.log('✅ Eric Isometric Sprite Generator chargé');
