/**
 * 🐱 TAMAGOTCHI ENHANCED - Éric le Chat Pro
 * Version 2.0 - Super animé et interactif
 * 
 * Features:
 * - Système de faim/humeur automatique
 * - Animations CSS fluides
 * - Mini-jeux interactifs
 * - Réactions au hover
 * - Particules d'émotions
 * - Double-clic pour jouer
 * - Système de sommeil
 */

// ============================================
// CONFIGURATION
// ============================================

const TAMA_CONFIG = {
    // Vitesse de décrémentation (en ms)
    HUNGER_DECREASE_INTERVAL: 60000,  // 1 minute
    MOOD_DECREASE_INTERVAL: 90000,     // 1.5 minutes
    HUNGER_DECREASE_AMOUNT: 5,
    MOOD_DECREASE_AMOUNT: 3,
    
    // Gains
    FEED_HUNGER_GAIN: 30,
    FEED_MOOD_GAIN: 10,
    PLAY_MOOD_GAIN: 20,
    PET_MOOD_GAIN: 5,
    
    // Seuils
    HUNGER_CRITICAL: 20,
    MOOD_CRITICAL: 20,
    SLEEP_HOUR_START: 22,  // 22h
    SLEEP_HOUR_END: 7,     // 7h
    
    // Animations
    ANIMATION_DURATION: 600,
    PARTICLE_DURATION: 2000,
};

// ============================================
// ÉTAT DU TAMAGOTCHI
// ============================================

let tamaState = {
    hunger: 80,        // 0-100
    mood: 80,          // 0-100
    energy: 100,       // 0-100
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    isSleeping: false,
    lastInteraction: Date.now(),
    playCount: 0,
    petCount: 0,
    animations: {
        bounce: false,
        shake: false,
        spin: false,
        float: false,
    }
};

// ============================================
// SYSTÈME DE DÉCRÉMENTATION AUTOMATIQUE
// ============================================

function startTamagotchiLoop() {
    // Diminuer la faim toutes les minutes
    setInterval(() => {
        if (!gamingMode || tamaState.isSleeping) return;
        
        tamaState.hunger = Math.max(0, tamaState.hunger - TAMA_CONFIG.HUNGER_DECREASE_AMOUNT);
        
        if (tamaState.hunger <= TAMA_CONFIG.HUNGER_CRITICAL) {
            showEmotionParticle('😿', 'hungry');
            playTamaAnimation('shake');
        }
        
        updateTamaVisuals();
        saveTamaState();
    }, TAMA_CONFIG.HUNGER_DECREASE_INTERVAL);
    
    // Diminuer l'humeur toutes les 1.5 minutes
    setInterval(() => {
        if (!gamingMode || tamaState.isSleeping) return;
        
        tamaState.mood = Math.max(0, tamaState.mood - TAMA_CONFIG.MOOD_DECREASE_AMOUNT);
        
        if (tamaState.mood <= TAMA_CONFIG.MOOD_CRITICAL) {
            showEmotionParticle('😾', 'sad');
            playTamaAnimation('shake');
        }
        
        updateTamaVisuals();
        saveTamaState();
    }, TAMA_CONFIG.MOOD_DECREASE_INTERVAL);
    
    // Vérifier le sommeil toutes les 10 minutes
    setInterval(() => {
        checkSleepTime();
    }, 600000);
    
    // Animation idle (float) toutes les 5 secondes
    setInterval(() => {
        if (!gamingMode || tamaState.isSleeping) return;
        playTamaAnimation('float');
    }, 5000);
}

// ============================================
// INTERACTIONS
// ============================================

// Nourrir (clic simple)
function feedTamagotchiEnhanced() {
    if (!gamingMode) return;
    if (tamaState.isSleeping) {
        showGameNotification('💤 Éric dort... Chut !');
        return;
    }
    
    // Augmenter faim et humeur
    tamaState.hunger = Math.min(100, tamaState.hunger + TAMA_CONFIG.FEED_HUNGER_GAIN);
    tamaState.mood = Math.min(100, tamaState.mood + TAMA_CONFIG.FEED_MOOD_GAIN);
    tamaState.lastFed = Date.now();
    
    // Augmenter niveau tamagotchi
    gameStats.tamaLevel = Math.min(gameStats.tamaLevel + 1, 10);
    
    // Animation et particules
    playTamaAnimation('bounce');
    showEmotionParticle('😻', 'love');
    showGameNotification(`🍔 Miam ! Faim: ${Math.round(tamaState.hunger)}% | Humeur: ${Math.round(tamaState.mood)}%`);
    
    // Achievements
    unlockAchievement('tama_feeder');
    if (gameStats.tamaLevel >= 10) {
        unlockAchievement('tama_master');
    }
    
    updateTamaVisuals();
    updateGameDisplay();
    saveTamaState();
    saveGameStats();
}

// Jouer (double-clic)
function playWithTamagotchi() {
    if (!gamingMode) return;
    if (tamaState.isSleeping) {
        showGameNotification('💤 Éric dort profondément...');
        return;
    }
    
    tamaState.mood = Math.min(100, tamaState.mood + TAMA_CONFIG.PLAY_MOOD_GAIN);
    tamaState.lastPlayed = Date.now();
    tamaState.playCount++;
    
    // Animation spéciale
    playTamaAnimation('spin');
    showEmotionParticle('😸', 'happy');
    showGameNotification(`🎮 Youpi ! On s'amuse bien ! Humeur: ${Math.round(tamaState.mood)}%`);
    
    // Mini achievement si joué 10 fois
    if (tamaState.playCount >= 10) {
        showGameNotification('🎉 Éric adore jouer avec vous !');
    }
    
    updateTamaVisuals();
    saveTamaState();
}

// Caresser (hover)
function petTamagotchi() {
    if (!gamingMode || tamaState.isSleeping) return;
    
    tamaState.mood = Math.min(100, tamaState.mood + TAMA_CONFIG.PET_MOOD_GAIN);
    tamaState.petCount++;
    
    // Petite animation subtile
    showEmotionParticle('💖', 'love-small');
    
    updateTamaVisuals();
    saveTamaState();
}

// ============================================
// SYSTÈME DE SOMMEIL
// ============================================

function checkSleepTime() {
    const hour = new Date().getHours();
    const shouldSleep = hour >= TAMA_CONFIG.SLEEP_HOUR_START || hour < TAMA_CONFIG.SLEEP_HOUR_END;
    
    if (shouldSleep && !tamaState.isSleeping) {
        tamaState.isSleeping = true;
        showGameNotification('😴 Éric s\'endort... Bonne nuit !');
        updateTamaVisuals();
    } else if (!shouldSleep && tamaState.isSleeping) {
        tamaState.isSleeping = false;
        showGameNotification('😺 Éric se réveille ! Bonjour !');
        updateTamaVisuals();
    }
}

// Réveiller manuellement
function wakeTamagotchi() {
    if (!tamaState.isSleeping) return;
    
    tamaState.isSleeping = false;
    tamaState.mood = Math.max(0, tamaState.mood - 10); // Grognon si réveillé
    
    playTamaAnimation('shake');
    showEmotionParticle('😾', 'angry');
    showGameNotification('😾 Éric est grognon d\'avoir été réveillé !');
    
    updateTamaVisuals();
    saveTamaState();
}

// ============================================
// ANIMATIONS
// ============================================

function playTamaAnimation(type) {
    const tama = document.getElementById('tamagotchi');
    if (!tama) return;
    
    // Retirer toutes les animations
    tama.classList.remove('tama-bounce', 'tama-shake', 'tama-spin', 'tama-float');
    
    // Ajouter la nouvelle
    void tama.offsetWidth; // Force reflow
    tama.classList.add(`tama-${type}`);
    
    // Retirer après l'animation
    setTimeout(() => {
        tama.classList.remove(`tama-${type}`);
    }, TAMA_CONFIG.ANIMATION_DURATION);
}

function showEmotionParticle(emoji, type) {
    const tama = document.getElementById('tamagotchi');
    if (!tama) return;
    
    const particle = document.createElement('div');
    particle.className = `tama-particle tama-particle-${type}`;
    particle.textContent = emoji;
    particle.style.cssText = `
        position: absolute;
        font-size: 2rem;
        pointer-events: none;
        animation: tama-float-up 2s ease-out forwards;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
    `;
    
    tama.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, TAMA_CONFIG.PARTICLE_DURATION);
}

// ============================================
// MISE À JOUR VISUELLE
// ============================================

function updateTamaVisuals() {
    const iconEl = document.getElementById('tamagotchiIcon');
    if (!iconEl) return;
    
    // Déterminer l'état actuel
    let currentState = 'normal';
    
    if (tamaState.isSleeping) {
        currentState = 'sleeping';
    } else if (tamaState.hunger < TAMA_CONFIG.HUNGER_CRITICAL) {
        currentState = 'hungry';
    } else if (tamaState.mood < TAMA_CONFIG.MOOD_CRITICAL) {
        currentState = 'unhappy';
    } else if (gameStats.tamaLevel >= 10) {
        currentState = 'happy';
    } else if (gameStats.tamaLevel === 1) {
        currentState = 'boxed';
    } else if (Date.now() - tamaState.lastFed < 5000) {
        currentState = 'fed'; // Juste après avoir mangé
    }
    
    // Mettre à jour l'icône
    iconEl.src = tamaIcons[currentState] || tamaIcons.normal;
    
    // Mettre à jour la bordure selon l'état
    const tama = document.getElementById('tamagotchi');
    if (tama) {
        // Retirer toutes les classes d'état
        tama.classList.remove('tama-hungry', 'tama-unhappy', 'tama-happy', 'tama-sleeping', 'tama-needs-attention');
        
        if (tamaState.isSleeping) {
            tama.classList.add('tama-sleeping');
            tama.style.borderColor = '#6366f1';
        } else if (tamaState.hunger < TAMA_CONFIG.HUNGER_CRITICAL) {
            tama.classList.add('tama-hungry', 'tama-needs-attention');
            tama.style.borderColor = '#ef4444';
        } else if (tamaState.mood < TAMA_CONFIG.MOOD_CRITICAL) {
            tama.classList.add('tama-unhappy', 'tama-needs-attention');
            tama.style.borderColor = '#f59e0b';
        } else if (tamaState.hunger > 80 && tamaState.mood > 80) {
            tama.classList.add('tama-happy');
            tama.style.borderColor = '#10b981';
        } else {
            tama.style.borderColor = 'var(--primary)';
        }
    }
    
    // Mettre à jour le tooltip
    updateTooltip();
}

function updateTooltip() {
    const hungerDisplay = document.getElementById('tamaHungerDisplay');
    const moodDisplay = document.getElementById('tamaMoodDisplay');
    const levelDisplay = document.getElementById('tamaLevelDisplay');
    
    if (hungerDisplay) hungerDisplay.textContent = Math.round(tamaState.hunger);
    if (moodDisplay) moodDisplay.textContent = Math.round(tamaState.mood);
    if (levelDisplay && typeof gameStats !== 'undefined') {
        levelDisplay.textContent = gameStats.tamaLevel || 1;
    }
}

// ============================================
// SAUVEGARDE / CHARGEMENT
// ============================================

function saveTamaState() {
    localStorage.setItem('tamaState', JSON.stringify(tamaState));
}

function loadTamaState() {
    const saved = localStorage.getItem('tamaState');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            tamaState = { ...tamaState, ...loaded };
        } catch (e) {
            console.warn('Erreur chargement tamaState:', e);
        }
    }
}

// ============================================
// INITIALISATION
// ============================================

function initTamagotchiEnhanced() {
    console.log('🐱 Tamagotchi Enhanced initialisé !');
    
    // Charger l'état sauvegardé
    loadTamaState();
    
    // Remplacer la fonction feedTamagotchi
    window.feedTamagotchi = feedTamagotchiEnhanced;
    
    // Ajouter les event listeners
    const tama = document.getElementById('tamagotchi');
    if (tama) {
        // Double-clic pour jouer
        tama.addEventListener('dblclick', (e) => {
            e.preventDefault();
            playWithTamagotchi();
        });
        
        // Hover pour caresser
        let hoverTimeout;
        tama.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                petTamagotchi();
            }, 1000); // Caresser après 1 seconde de hover
        });
        
        tama.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        });
        
        // Clic sur Éric endormi pour le réveiller
        tama.addEventListener('click', (e) => {
            if (tamaState.isSleeping) {
                e.stopPropagation();
                wakeTamagotchi();
            }
        });
    }
    
    // Démarrer la boucle de mise à jour
    startTamagotchiLoop();
    
    // Vérifier le sommeil au démarrage
    checkSleepTime();
    
    // Mise à jour visuelle initiale
    updateTamaVisuals();
}

// Démarrer au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTamagotchiEnhanced);
} else {
    initTamagotchiEnhanced();
}
