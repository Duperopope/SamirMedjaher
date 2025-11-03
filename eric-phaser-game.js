/**
 * 🎮 ERIC PHASER GAME - Jeu 2.5D Professionnel Style Waven
 * Version: 1.0
 * Framework: Phaser 3
 * 
 * Features:
 * - Graphismes 2.5D avec parallax
 * - Animations fluides 60 FPS
 * - Effets visuels modernes (particules, glow, shadows)
 * - Système de stats et progression
 * - Mini-jeux intégrés
 * - UI moderne style mobile 2025
 */

// ============================================
// CONFIGURATION DU JEU
// ============================================

const GAME_CONFIG = {
    type: Phaser.AUTO,
    parent: 'ericGameContainer',
    width: 800,
    height: 600,
    backgroundColor: '#2d3561',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
let game;
let ericSprite;
let stats = {
    hunger: 100,
    mood: 100,
    health: 100,
    energy: 100
};
let particles;
let backgroundLayers = [];

// ============================================
// PRELOAD - Charger les assets
// ============================================

function preload() {
    console.log('🎮 Chargement des assets...');
    
    // Créer les sprites du chat noir programmatiquement
    createCatSprites(this);
    
    // Créer les backgrounds
    createBackgrounds(this);
    
    // Créer les particules
    createParticleTextures(this);
    
    console.log('✅ Assets chargés');
}

// ============================================
// CREATE - Initialiser la scène
// ============================================

function create() {
    console.log('🎨 Création de la scène...');
    
    // Créer les couches de parallax (fond → premier plan)
    createParallaxLayers(this);
    
    // Créer Eric le chat
    createEric(this);
    
    // Créer le système de particules
    createParticleSystem(this);
    
    // Créer l'UI
    createUI(this);
    
    // Setup interactions
    setupInteractions(this);
    
    // Animation de respiration pour Eric
    this.tweens.add({
        targets: ericSprite,
        scaleY: 1.05,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    console.log('✅ Scène créée');
}

// ============================================
// UPDATE - Boucle de jeu
// ============================================

function update(time, delta) {
    // Effet de parallax sur les backgrounds
    backgroundLayers.forEach((layer, index) => {
        layer.tilePositionX += 0.1 * (index + 1);
    });
    
    // Diminuer les stats progressivement
    if (Phaser.Math.Between(0, 600) === 0) {
        updateStats(-1);
    }
}

// ============================================
// CRÉATION DES SPRITES DU CHAT
// ============================================

function createCatSprites(scene) {
    // Chat noir idle
    const catGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Corps
    catGraphics.fillStyle(0x1a1a1a, 1);
    catGraphics.fillEllipse(64, 80, 60, 50);
    
    // Tête
    catGraphics.fillEllipse(64, 50, 50, 50);
    
    // Oreilles
    catGraphics.fillTriangle(40, 30, 35, 50, 50, 40);
    catGraphics.fillTriangle(88, 30, 93, 50, 78, 40);
    
    // Intérieur oreilles (rose)
    catGraphics.fillStyle(0xFF69B4, 1);
    catGraphics.fillTriangle(42, 35, 38, 48, 48, 42);
    catGraphics.fillTriangle(86, 35, 90, 48, 80, 42);
    
    // Yeux
    catGraphics.fillStyle(0x00FF00, 1);
    catGraphics.fillEllipse(52, 48, 12, 14);
    catGraphics.fillEllipse(76, 48, 12, 14);
    
    // Pupilles
    catGraphics.fillStyle(0x000000, 1);
    catGraphics.fillEllipse(52, 50, 4, 8);
    catGraphics.fillEllipse(76, 50, 4, 8);
    
    // Reflets yeux
    catGraphics.fillStyle(0xFFFFFF, 0.8);
    catGraphics.fillCircle(50, 46, 3);
    catGraphics.fillCircle(74, 46, 3);
    
    // Nez
    catGraphics.fillStyle(0xFF69B4, 1);
    catGraphics.fillTriangle(64, 58, 60, 62, 68, 62);
    
    // Bouche
    catGraphics.lineStyle(2, 0x000000, 1);
    catGraphics.beginPath();
    catGraphics.arc(58, 64, 6, 0, Math.PI, false);
    catGraphics.strokePath();
    catGraphics.beginPath();
    catGraphics.arc(70, 64, 6, 0, Math.PI, false);
    catGraphics.strokePath();
    
    // Moustaches
    catGraphics.lineStyle(1, 0x666666, 0.8);
    // Gauche
    catGraphics.lineBetween(40, 58, 20, 55);
    catGraphics.lineBetween(40, 62, 20, 62);
    catGraphics.lineBetween(40, 66, 20, 69);
    // Droite
    catGraphics.lineBetween(88, 58, 108, 55);
    catGraphics.lineBetween(88, 62, 108, 62);
    catGraphics.lineBetween(88, 66, 108, 69);
    
    // Queue
    catGraphics.fillStyle(0x1a1a1a, 1);
    catGraphics.fillEllipse(30, 100, 15, 35);
    
    // Pattes
    catGraphics.fillEllipse(50, 110, 10, 15);
    catGraphics.fillEllipse(78, 110, 10, 15);
    
    // Générer la texture
    catGraphics.generateTexture('cat-idle', 128, 128);
    catGraphics.destroy();
}

// ============================================
// CRÉATION DES BACKGROUNDS PARALLAX
// ============================================

function createBackgrounds(scene) {
    // Créer 3 couches de fond avec gradients
    const colors = [
        { top: 0x4a5568, bottom: 0x2d3748 },  // Fond
        { top: 0x667eea, bottom: 0x764ba2 },  // Milieu
        { top: 0x f093fb, bottom: 0xf5576c }   // Premier plan
    ];
    
    colors.forEach((color, index) => {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillGradientStyle(color.top, color.top, color.bottom, color.bottom, 1);
        graphics.fillRect(0, 0, 800, 600);
        graphics.generateTexture(`bg-layer-${index}`, 800, 600);
        graphics.destroy();
    });
}

// ============================================
// CRÉATION DES TEXTURES DE PARTICULES
// ============================================

function createParticleTextures(scene) {
    // Particule étoile
    const starGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    starGraphics.fillStyle(0xFFD700, 1);
    starGraphics.fillStar(8, 8, 5, 8, 4);
    starGraphics.generateTexture('star-particle', 16, 16);
    starGraphics.destroy();
    
    // Particule coeur
    const heartGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    heartGraphics.fillStyle(0xFF69B4, 1);
    heartGraphics.beginPath();
    heartGraphics.moveTo(8, 10);
    heartGraphics.bezierCurveTo(8, 8, 6, 6, 4, 6);
    heartGraphics.bezierCurveTo(2, 6, 0, 8, 0, 10);
    heartGraphics.bezierCurveTo(0, 12, 8, 16, 8, 16);
    heartGraphics.bezierCurveTo(8, 16, 16, 12, 16, 10);
    heartGraphics.bezierCurveTo(16, 8, 14, 6, 12, 6);
    heartGraphics.bezierCurveTo(10, 6, 8, 8, 8, 10);
    heartGraphics.closePath();
    heartGraphics.fillPath();
    heartGraphics.generateTexture('heart-particle', 16, 16);
    heartGraphics.destroy();
    
    // Particule sparkle
    const sparkleGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    sparkleGraphics.fillStyle(0xFFFFFF, 1);
    sparkleGraphics.fillCircle(8, 8, 4);
    sparkleGraphics.generateTexture('sparkle-particle', 16, 16);
    sparkleGraphics.destroy();
}

// ============================================
// CRÉATION DES COUCHES PARALLAX
// ============================================

function createParallaxLayers(scene) {
    // 3 couches de fond avec différentes vitesses
    for (let i = 0; i < 3; i++) {
        const layer = scene.add.tileSprite(
            0, 0,
            800, 600,
            `bg-layer-${i}`
        );
        layer.setOrigin(0, 0);
        layer.setAlpha(0.3 + (i * 0.2));
        layer.setDepth(i);
        backgroundLayers.push(layer);
    }
}

// ============================================
// CRÉATION D'ERIC
// ============================================

function createEric(scene) {
    // Créer le sprite Eric
    ericSprite = scene.add.sprite(400, 350, 'cat-idle');
    ericSprite.setScale(1.5);
    ericSprite.setDepth(10);
    ericSprite.setInteractive({ useHandCursor: true });
    
    // Ombre portée
    const shadow = scene.add.ellipse(400, 420, 120, 30, 0x000000, 0.3);
    shadow.setDepth(9);
    
    // Glow effect
    ericSprite.setTint(0xffffff);
    scene.tweens.add({
        targets: ericSprite,
        alpha: 0.9,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

// ============================================
// SYSTÈME DE PARTICULES
// ============================================

function createParticleSystem(scene) {
    particles = {
        stars: scene.add.particles('star-particle'),
        hearts: scene.add.particles('heart-particle'),
        sparkles: scene.add.particles('sparkle-particle')
    };
    
    // Configuration des émetteurs (désactivés par défaut)
    Object.values(particles).forEach(p => p.setDepth(20));
}

function emitParticles(scene, type, x, y) {
    const emitter = particles[type].createEmitter({
        x: x,
        y: y,
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 1000,
        quantity: 10,
        blendMode: 'ADD'
    });
    
    scene.time.delayedCall(1000, () => {
        emitter.stop();
        scene.time.delayedCall(2000, () => emitter.remove());
    });
}

// ============================================
// CRÉATION DE L'UI
// ============================================

function createUI(scene) {
    // Conteneur UI
    const uiContainer = scene.add.container(10, 10);
    uiContainer.setDepth(100);
    
    // Titre
    const title = scene.add.text(10, 10, '🐈‍⬛ ERIC', {
        fontSize: '32px',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 4,
            fill: true
        }
    });
    
    // Barres de stats
    const statsY = 60;
    const statsConfig = [
        { key: 'hunger', label: '🍖 Faim', color: 0xF59E0B },
        { key: 'mood', label: '😊 Humeur', color: 0x10B981 },
        { key: 'health', label: '❤️ Santé', color: 0xEF4444 },
        { key: 'energy', label: '⚡ Énergie', color: 0x06B6D4 }
    ];
    
    statsConfig.forEach((stat, index) => {
        const y = statsY + (index * 50);
        
        // Label
        scene.add.text(20, y, stat.label, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        
        // Barre de fond
        const barBg = scene.add.rectangle(20, y + 25, 200, 20, 0x1a1a1a, 0.8);
        barBg.setOrigin(0, 0.5);
        
        // Barre de progression
        const bar = scene.add.rectangle(20, y + 25, 200 * (stats[stat.key] / 100), 20, stat.color);
        bar.setOrigin(0, 0.5);
        bar.name = `stat-${stat.key}`;
        
        // Bordure
        const border = scene.add.rectangle(20, y + 25, 200, 20);
        border.setOrigin(0, 0.5);
        border.setStrokeStyle(2, 0xffffff, 0.5);
    });
    
    // Boutons d'action
    const actions = [
        { label: '🍖 Nourrir', x: 600, y: 500, action: () => feedEric(scene) },
        { label: '🎾 Jouer', x: 700, y: 500, action: () => playWithEric(scene) }
    ];
    
    actions.forEach(action => {
        const button = scene.add.rectangle(action.x, action.y, 90, 40, 0x667eea, 0.9);
        button.setInteractive({ useHandCursor: true });
        button.setStrokeStyle(2, 0xffffff);
        
        const text = scene.add.text(action.x, action.y, action.label, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        
        button.on('pointerdown', action.action);
        button.on('pointerover', () => button.setFillStyle(0x764ba2));
        button.on('pointerout', () => button.setFillStyle(0x667eea));
    });
}

// ============================================
// INTERACTIONS
// ============================================

function setupInteractions(scene) {
    // Cliquer sur Eric
    ericSprite.on('pointerdown', () => {
        petEric(scene);
    });
}

function petEric(scene) {
    // Animation de joie
    scene.tweens.add({
        targets: ericSprite,
        y: ericSprite.y - 30,
        duration: 300,
        yoyo: true,
        ease: 'Back.easeOut'
    });
    
    // Particules coeurs
    emitParticles(scene, 'hearts', ericSprite.x, ericSprite.y);
    
    // Augmenter humeur
    updateStats(5, 'mood');
    
    console.log('💕 Eric ronronne !');
}

function feedEric(scene) {
    // Animation de manger
    scene.tweens.add({
        targets: ericSprite,
        scaleX: 1.6,
        duration: 200,
        yoyo: true,
        repeat: 2
    });
    
    // Particules nourriture
    emitParticles(scene, 'sparkles', ericSprite.x, ericSprite.y);
    
    // Augmenter faim
    updateStats(20, 'hunger');
    updateStats(5, 'mood');
    
    console.log('🍖 Eric mange !');
}

function playWithEric(scene) {
    // Animation de jeu
    scene.tweens.add({
        targets: ericSprite,
        angle: 360,
        duration: 1000,
        ease: 'Back.easeOut'
    });
    
    // Particules étoiles
    emitParticles(scene, 'stars', ericSprite.x, ericSprite.y);
    
    // Augmenter humeur, diminuer énergie
    updateStats(15, 'mood');
    updateStats(-10, 'energy');
    
    console.log('🎾 Eric joue !');
}

// ============================================
// SYSTÈME DE STATS
// ============================================

function updateStats(amount, statKey = null) {
    const scene = game.scene.scenes[0];
    
    if (statKey) {
        // Mise à jour d'une stat spécifique
        stats[statKey] = Math.max(0, Math.min(100, stats[statKey] + amount));
        
        // Mettre à jour la barre visuelle
        const bar = scene.children.list.find(child => child.name === `stat-${statKey}`);
        if (bar) {
            scene.tweens.add({
                targets: bar,
                width: 200 * (stats[statKey] / 100),
                duration: 300,
                ease: 'Power2'
            });
        }
    } else {
        // Diminuer toutes les stats
        Object.keys(stats).forEach(key => {
            stats[key] = Math.max(0, stats[key] + amount);
            
            const bar = scene.children.list.find(child => child.name === `stat-${key}`);
            if (bar) {
                bar.width = 200 * (stats[key] / 100);
            }
        });
    }
}

// ============================================
// INITIALISATION
// ============================================

function initEricPhaserGame() {
    console.log('🎮 Initialisation du jeu Phaser...');
    
    // Vérifier si le conteneur existe
    if (!document.getElementById('ericGameContainer')) {
        console.error('❌ Conteneur ericGameContainer introuvable');
        return;
    }
    
    // Créer le jeu Phaser
    game = new Phaser.Game(GAME_CONFIG);
    
    console.log('✅ Jeu Phaser initialisé');
}

// ============================================
// EXPORT
// ============================================

window.initEricPhaserGame = initEricPhaserGame;
window.ericPhaserGame = game;

console.log('✅ Eric Phaser Game chargé');
