/**
 * 🎨 ERIC ISOMETRIC SPRITES GENERATOR
 * Générateur procédural de sprites isométriques style Dofus/Wakfu
 * Version: 1.0
 * 
 * Génère un sprite sheet complet avec:
 * - 8 directions (N, NE, E, SE, S, SW, W, NW)
 * - 6 états (idle, walk, eat, play, sleep, sad)
 * - Animations frame-by-frame
 * - Style coloré et professionnel
 * 
 * Format du sprite sheet: 8 colonnes × 48 lignes (6 états × 8 directions)
 * Dimensions: 1024px × 7680px (128px × 160px par sprite)
 */

// ============================================
// CONFIGURATION DES SPRITES
// ============================================

const SPRITE_CONFIG = {
    // Palette de couleurs style Dofus/Wakfu
    colors: {
        // Corps du chat (orange vif)
        bodyMain: '#FF8C42',
        bodyShade: '#E67029',
        bodyHighlight: '#FFB07A',
        
        // Ventre (blanc crème)
        bellyMain: '#FFF5E1',
        bellyShade: '#FFE4B5',
        
        // Yeux (verts expressifs)
        eyeMain: '#4ADE80',
        eyePupil: '#065F46',
        eyeHighlight: '#DCFCE7',
        
        // Accessoires
        collar: '#EF4444',
        collarTag: '#FCD34D',
        
        // Ombres et contours
        outline: '#1F2937',
        shadow: 'rgba(0, 0, 0, 0.3)',
        
        // Effets spéciaux
        sparkle: '#FFD700',
        heart: '#EC4899',
        zzz: '#94A3B8'
    },
    
    // Proportions du chat isométrique
    proportions: {
        // Corps
        bodyWidth: 50,
        bodyHeight: 40,
        bodyDepth: 45,
        
        // Tête
        headRadius: 22,
        headOffsetY: -35,
        
        // Oreilles
        earWidth: 12,
        earHeight: 15,
        
        // Queue
        tailLength: 35,
        tailWidth: 8,
        
        // Pattes
        legWidth: 8,
        legHeight: 15,
        
        // Yeux
        eyeRadius: 5,
        pupilRadius: 3
    }
};

// ============================================
// GÉNÉRATEUR DE SPRITE SHEET
// ============================================

class IsometricSpriteGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 128 * 8;  // 8 directions
        this.canvas.height = 160 * 48; // 6 états × 8 directions
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration du contexte
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
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
                const frames = this.getFrameCount(state);
                
                for (let frame = 0; frame < frames; frame++) {
                    const x = frame * 128;
                    const y = row * 160;
                    
                    this.drawCharacter(x, y, state, direction, frame, frames);
                }
                
                row++;
            }
        }
        
        console.log('✅ Sprite sheet généré !');
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Obtient le nombre de frames par état
     */
    getFrameCount(state) {
        const frameCounts = {
            'idle': 4,
            'walk': 8,
            'eat': 6,
            'play': 8,
            'sleep': 4,
            'sad': 4
        };
        return frameCounts[state] || 4;
    }
    
    /**
     * Dessine un personnage complet
     */
    drawCharacter(x, y, state, direction, frame, totalFrames) {
        // Centre du sprite
        const centerX = x + 64;
        const centerY = y + 120;
        
        // Sauvegarde du contexte
        this.ctx.save();
        
        // Animation parameters
        const t = frame / totalFrames;
        const angle = this.getDirectionAngle(direction);
        
        // Dessine les composants dans l'ordre (back to front)
        this.drawTail(centerX, centerY, angle, state, t);
        this.drawBody(centerX, centerY, angle, state, t);
        this.drawLegs(centerX, centerY, angle, state, t);
        this.drawHead(centerX, centerY, angle, state, t);
        this.drawEars(centerX, centerY, angle, state, t);
        this.drawFace(centerX, centerY, angle, state, t);
        this.drawEffects(centerX, centerY, state, t);
        
        // Restaure le contexte
        this.ctx.restore();
    }
    
    /**
     * Obtient l'angle de la direction
     */
    getDirectionAngle(direction) {
        const angles = {
            'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
            'S': 180, 'SW': 225, 'W': 270, 'NW': 315
        };
        return angles[direction] || 135;
    }
    
    /**
     * Dessine le corps principal (isométrique)
     */
    drawBody(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        
        // Corps principal (ellipse isométrique)
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Rotation selon la direction
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Animation de respiration
        const breathe = state === 'sleep' ? Math.sin(t * Math.PI * 2) * 2 : 0;
        
        // Ombre du corps
        this.ctx.fillStyle = SPRITE_CONFIG.colors.shadow;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 15, prop.bodyWidth/2, prop.bodyHeight/3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Corps principal (projection isométrique)
        this.drawIsometricBox(
            -prop.bodyWidth/2,
            -prop.bodyHeight/2,
            prop.bodyWidth,
            prop.bodyHeight,
            prop.bodyDepth + breathe,
            SPRITE_CONFIG.colors.bodyMain,
            SPRITE_CONFIG.colors.bodyShade
        );
        
        // Ventre (ellipse blanche)
        this.ctx.fillStyle = SPRITE_CONFIG.colors.bellyMain;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 5, prop.bodyWidth/3, prop.bodyHeight/2.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Contour du ventre
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Collier
        this.ctx.fillStyle = SPRITE_CONFIG.colors.collar;
        this.ctx.fillRect(-prop.bodyWidth/3, -prop.bodyHeight/2 - 5, prop.bodyWidth * 2/3, 6);
        
        // Médaille du collier
        this.ctx.fillStyle = SPRITE_CONFIG.colors.collarTag;
        this.ctx.beginPath();
        this.ctx.arc(0, -prop.bodyHeight/2 - 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine une boîte isométrique (pour le corps)
     */
    drawIsometricBox(x, y, width, height, depth, colorMain, colorShade) {
        // Face avant
        this.ctx.fillStyle = colorMain;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x, y + height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Contour
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Face de côté (ombre)
        this.ctx.fillStyle = colorShade;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width + depth/2, y - depth/2);
        this.ctx.lineTo(x + width + depth/2, y + height - depth/2);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    /**
     * Dessine la tête
     */
    drawHead(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        const headY = y + prop.headOffsetY;
        
        this.ctx.save();
        this.ctx.translate(x, headY);
        
        // Rotation selon direction
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Animation de tête selon l'état
        let headBob = 0;
        if (state === 'walk') {
            headBob = Math.sin(t * Math.PI * 2) * 3;
        }
        
        // Tête (cercle)
        this.ctx.fillStyle = SPRITE_CONFIG.colors.bodyMain;
        this.ctx.beginPath();
        this.ctx.arc(0, headBob, prop.headRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Contour
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Zone blanche du museau
        this.ctx.fillStyle = SPRITE_CONFIG.colors.bellyMain;
        this.ctx.beginPath();
        this.ctx.arc(0, headBob + 5, prop.headRadius * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine les oreilles
     */
    drawEars(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        const headY = y + prop.headOffsetY;
        
        this.ctx.save();
        this.ctx.translate(x, headY);
        
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Animation des oreilles (nervosité ou attention)
        const earWiggle = state === 'play' ? Math.sin(t * Math.PI * 4) * 5 : 0;
        
        // Oreille gauche
        this.drawEar(-prop.headRadius * 0.6, -prop.headRadius * 0.8, -15 + earWiggle);
        
        // Oreille droite
        this.drawEar(prop.headRadius * 0.6, -prop.headRadius * 0.8, 15 - earWiggle);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine une oreille
     */
    drawEar(x, y, angle) {
        const prop = SPRITE_CONFIG.proportions;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle * Math.PI / 180);
        
        // Oreille (triangle)
        this.ctx.fillStyle = SPRITE_CONFIG.colors.bodyMain;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-prop.earWidth/2, prop.earHeight);
        this.ctx.lineTo(prop.earWidth/2, prop.earHeight);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Contour
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Intérieur rose
        this.ctx.fillStyle = '#FFB3D9';
        this.ctx.beginPath();
        this.ctx.moveTo(0, prop.earHeight * 0.3);
        this.ctx.lineTo(-prop.earWidth/4, prop.earHeight * 0.8);
        this.ctx.lineTo(prop.earWidth/4, prop.earHeight * 0.8);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine le visage (yeux, nez, bouche)
     */
    drawFace(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        const headY = y + prop.headOffsetY;
        
        this.ctx.save();
        this.ctx.translate(x, headY);
        
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Position des yeux selon l'état
        let eyeY = 0;
        let eyeOpenness = 1;
        
        if (state === 'sleep') {
            eyeOpenness = 0.1; // Yeux fermés
        } else if (state === 'sad') {
            eyeY = 2;
        }
        
        // Yeux
        this.drawEye(-8, eyeY, eyeOpenness, state);
        this.drawEye(8, eyeY, eyeOpenness, state);
        
        // Nez
        this.ctx.fillStyle = '#D946EF';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 8);
        this.ctx.lineTo(-3, 5);
        this.ctx.lineTo(3, 5);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Bouche selon l'état
        this.drawMouth(0, 10, state);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine un œil
     */
    drawEye(x, y, openness, state) {
        const prop = SPRITE_CONFIG.proportions;
        
        // Blanc de l'œil
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, prop.eyeRadius, prop.eyeRadius * openness, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Contour
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        if (openness > 0.5) {
            // Iris
            this.ctx.fillStyle = SPRITE_CONFIG.colors.eyeMain;
            this.ctx.beginPath();
            this.ctx.arc(x, y, prop.eyeRadius * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupille
            this.ctx.fillStyle = SPRITE_CONFIG.colors.eyePupil;
            this.ctx.beginPath();
            this.ctx.arc(x, y, prop.pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reflet
            this.ctx.fillStyle = SPRITE_CONFIG.colors.eyeHighlight;
            this.ctx.beginPath();
            this.ctx.arc(x - 1, y - 1, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * Dessine la bouche
     */
    drawMouth(x, y, state) {
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        
        if (state === 'sad') {
            // Bouche triste
            this.ctx.arc(x, y + 5, 5, 0.2 * Math.PI, 0.8 * Math.PI);
        } else if (state === 'eat') {
            // Bouche ouverte
            this.ctx.arc(x, y, 5, 0, Math.PI);
        } else {
            // Bouche souriante
            this.ctx.arc(x, y, 5, 0.2 * Math.PI, 0.8 * Math.PI, true);
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Dessine les pattes
     */
    drawLegs(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Animation de marche
        let legOffset = 0;
        if (state === 'walk') {
            legOffset = Math.sin(t * Math.PI * 2) * 5;
        }
        
        // Pattes avant
        this.drawLeg(-15, 10, legOffset);
        this.drawLeg(15, 10, -legOffset);
        
        // Pattes arrière
        this.drawLeg(-20, 15, -legOffset);
        this.drawLeg(20, 15, legOffset);
        
        this.ctx.restore();
    }
    
    /**
     * Dessine une patte
     */
    drawLeg(x, y, offset) {
        const prop = SPRITE_CONFIG.proportions;
        
        this.ctx.fillStyle = SPRITE_CONFIG.colors.bodyMain;
        this.ctx.fillRect(x - prop.legWidth/2, y + offset, prop.legWidth, prop.legHeight);
        
        // Contour
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - prop.legWidth/2, y + offset, prop.legWidth, prop.legHeight);
        
        // Patte (bout arrondi)
        this.ctx.beginPath();
        this.ctx.arc(x, y + offset + prop.legHeight, prop.legWidth/2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    /**
     * Dessine la queue
     */
    drawTail(x, y, angle, state, t) {
        const prop = SPRITE_CONFIG.proportions;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        const rotOffset = (angle - 135) * Math.PI / 180;
        this.ctx.rotate(rotOffset);
        
        // Animation de la queue
        const tailWag = state === 'play' ? Math.sin(t * Math.PI * 4) * 30 : 
                        state === 'sad' ? -20 : 
                        Math.sin(t * Math.PI) * 10;
        
        // Queue (courbe Bézier)
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.bodyMain;
        this.ctx.lineWidth = prop.tailWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(-prop.bodyWidth/2, 0);
        this.ctx.quadraticCurveTo(
            -prop.bodyWidth/2 - 20,
            -15 + tailWag/2,
            -prop.bodyWidth/2 - prop.tailLength,
            -25 + tailWag
        );
        this.ctx.stroke();
        
        // Contour de la queue
        this.ctx.strokeStyle = SPRITE_CONFIG.colors.outline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine les effets spéciaux selon l'état
     */
    drawEffects(x, y, state, t) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        if (state === 'play') {
            // Cœurs
            this.drawHeart(-30, -60 - Math.sin(t * Math.PI * 2) * 10, 12);
            this.drawHeart(30, -50 - Math.sin(t * Math.PI * 2 + 1) * 10, 8);
        } else if (state === 'sleep') {
            // Zzz
            this.drawZzz(20, -70 - Math.sin(t * Math.PI) * 5);
        } else if (state === 'eat') {
            // Étincelles
            this.drawSparkle(-25, -50);
            this.drawSparkle(25, -55);
        }
        
        this.ctx.restore();
    }
    
    /**
     * Dessine un cœur
     */
    drawHeart(x, y, size) {
        this.ctx.fillStyle = SPRITE_CONFIG.colors.heart;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size/4);
        this.ctx.quadraticCurveTo(x, y, x + size/2, y);
        this.ctx.quadraticCurveTo(x + size, y, x + size, y + size/4);
        this.ctx.quadraticCurveTo(x + size, y + size/2, x, y + size);
        this.ctx.quadraticCurveTo(x - size, y + size/2, x - size, y + size/4);
        this.ctx.quadraticCurveTo(x - size, y, x - size/2, y);
        this.ctx.quadraticCurveTo(x, y, x, y + size/4);
        this.ctx.fill();
    }
    
    /**
     * Dessine des Zzz
     */
    drawZzz(x, y) {
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = SPRITE_CONFIG.colors.zzz;
        this.ctx.fillText('Z', x, y);
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('Z', x + 10, y - 10);
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText('Z', x + 18, y - 18);
    }
    
    /**
     * Dessine une étincelle
     */
    drawSparkle(x, y) {
        this.ctx.fillStyle = SPRITE_CONFIG.colors.sparkle;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 6);
        this.ctx.lineTo(x + 2, y);
        this.ctx.lineTo(x + 6, y);
        this.ctx.lineTo(x + 2, y + 2);
        this.ctx.lineTo(x + 2, y + 6);
        this.ctx.lineTo(x, y + 2);
        this.ctx.lineTo(x - 2, y + 6);
        this.ctx.lineTo(x - 2, y + 2);
        this.ctx.lineTo(x - 6, y);
        this.ctx.lineTo(x - 2, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

/**
 * Génère le sprite sheet isométrique complet
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

console.log('✅ Eric Isometric Sprites Generator chargé');
