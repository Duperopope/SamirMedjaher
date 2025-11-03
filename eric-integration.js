/**
 * 🔗 ERIC INTEGRATION SYSTEM
 * Système d'intégration complète entre sprites, scène et gameplay
 * Version: 1.0
 * 
 * Ce fichier orchestre tous les systèmes d'Eric:
 * - Sprites SVG animés (eric-sprites.js)
 * - Scène 3D interactive (eric-scene.js)
 * - Gameplay tamagotchi (tamagotchi-gameplay.js)
 * - Interactions utilisateur
 */

// ============================================
// GESTIONNAIRE PRINCIPAL
// ============================================

class EricIntegrationManager {
    constructor() {
        this.ericSprites = null;
        this.ericScene = null;
        this.currentState = 'idle';
        this.evolution = 'chaton';
        this.isInitialized = false;
        
        // Référence au gameState global
        this.gameState = window.gameState || null;
    }
    
    /**
     * Initialise tout le système Eric
     */
    async init() {
        console.log('🎮 Initialisation du système Eric...');
        
        try {
            // 1. Initialiser le système de sprites
            this.initSprites();
            
            // 2. Initialiser la scène 3D
            await this.initScene();
            
            // 3. Connecter avec le gameplay existant
            this.connectToGameplay();
            
            // 4. Charger l'état sauvegardé
            this.loadSavedState();
            
            // 5. Démarrer les mises à jour automatiques
            this.startAutoUpdate();
            
            this.isInitialized = true;
            console.log('✅ Système Eric initialisé avec succès !');
            
            // Afficher Eric en mode idle
            this.updateEricSprite('idle');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation d\'Eric:', error);
        }
    }
    
    /**
     * Initialise le système de sprites
     */
    initSprites() {
        if (typeof EricSprites === 'undefined') {
            console.error('❌ EricSprites class non trouvée ! Vérifier que eric-sprites.js est chargé.');
            return;
        }
        
        // Charger l'évolution depuis le gameState
        if (this.gameState && this.gameState.evolution) {
            this.evolution = this.gameState.evolution;
        }
        
        this.ericSprites = new EricSprites(this.evolution);
        console.log('✅ Sprites Eric initialisés (évolution:', this.evolution + ')');
    }
    
    /**
     * Initialise la scène 3D
     */
    async initScene() {
        // Chercher le conteneur du tamagotchi
        const tamagotchiContainer = document.getElementById('tamagotchi');
        
        if (!tamagotchiContainer) {
            console.error('❌ Conteneur tamagotchi non trouvé !');
            return;
        }
        
        // Transformer le conteneur en scène complète
        tamagotchiContainer.innerHTML = '<div id="ericSceneRoot"></div>';
        tamagotchiContainer.style.width = '400px';
        tamagotchiContainer.style.height = '400px';
        tamagotchiContainer.style.background = 'transparent';
        tamagotchiContainer.style.borderRadius = '24px';
        
        // Initialiser la scène si EricScene est disponible
        if (typeof EricScene !== 'undefined') {
            this.ericScene = new EricScene('ericSceneRoot');
            console.log('✅ Scène 3D Eric initialisée');
        } else {
            console.warn('⚠️ EricScene class non trouvée ! Mode fallback avec sprite simple.');
            this.createSimpleDisplay();
        }
    }
    
    /**
     * Crée un affichage simple si la scène 3D n'est pas disponible
     */
    createSimpleDisplay() {
        const container = document.getElementById('ericSceneRoot');
        if (container) {
            container.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                ">
                    <div id="ericSpriteDisplay" style="
                        width: 150px;
                        height: 150px;
                    "></div>
                </div>
            `;
        }
    }
    
    /**
     * Connecte le système avec le gameplay existant
     */
    connectToGameplay() {
        // Écouter les événements du gameplay
        window.addEventListener('ericInteraction', (e) => {
            this.handleInteraction(e.detail.action);
        });
        
        // Écouter les changements d'état du tamagotchi
        if (window.tamaState) {
            this.syncWithTamaState();
        }
        
        // Écouter les changements d'évolution
        window.addEventListener('ericEvolution', (e) => {
            this.handleEvolution(e.detail.evolution);
        });
        
        console.log('✅ Systèmes de gameplay connectés');
    }
    
    /**
     * Synchronise avec l'état du tamagotchi
     */
    syncWithTamaState() {
        if (!window.tamaState) return;
        
        const tamaState = window.tamaState;
        
        // Déterminer l'état d'Eric selon les stats
        if (tamaState.hunger < 20) {
            this.updateEricSprite('hungry');
        } else if (tamaState.mood > 80) {
            this.updateEricSprite('happy');
        } else if (tamaState.mood < 30) {
            this.updateEricSprite('sad');
        } else if (tamaState.isPlaying) {
            this.updateEricSprite('playing');
        } else if (this.isNightTime()) {
            this.updateEricSprite('sleeping');
        } else {
            this.updateEricSprite('idle');
        }
    }
    
    /**
     * Met à jour le sprite d'Eric
     */
    updateEricSprite(state) {
        if (!this.ericSprites) {
            console.warn('⚠️ Sprites Eric non initialisés');
            return;
        }
        
        // Générer le nouveau sprite
        const spriteHTML = this.ericSprites.generateSprite(state);
        
        // Injecter dans l'affichage
        const displayContainer = document.getElementById('ericSpriteDisplay');
        if (displayContainer) {
            displayContainer.innerHTML = spriteHTML;
            this.currentState = state;
            
            console.log(`🎨 Sprite Eric mis à jour: ${state}`);
        }
    }
    
    /**
     * Gère une interaction avec Eric
     */
    handleInteraction(action) {
        console.log(`🎮 Interaction avec Eric: ${action}`);
        
        switch(action) {
            case 'feed':
                this.feedEric();
                break;
            case 'play':
                this.playWithEric();
                break;
            case 'pet':
                this.petEric();
                break;
            case 'sleep':
                this.putEricToSleep();
                break;
            case 'clean':
                this.cleanEric();
                break;
        }
    }
    
    /**
     * Nourrit Eric
     */
    async feedEric() {
        // Animation de nourriture
        this.updateEricSprite('eating');
        
        // Appeler la fonction de gameplay existante
        if (window.feedEric) {
            window.feedEric();
        } else if (window.gameplaySystem && window.gameplaySystem.feedEric) {
            window.gameplaySystem.feedEric();
        }
        
        // Créer des particules de nourriture
        if (this.ericScene) {
            this.ericScene.createParticleEffect('food', { x: 200, y: 150 });
        }
        
        // Retour à l'état normal après 2 secondes
        setTimeout(() => {
            this.updateEricSprite('happy');
            setTimeout(() => {
                this.syncWithTamaState();
            }, 1000);
        }, 2000);
    }
    
    /**
     * Joue avec Eric
     */
    async playWithEric() {
        this.updateEricSprite('playing');
        
        // Appeler la fonction de gameplay
        if (window.playWithEric) {
            window.playWithEric();
        } else if (window.gameplaySystem && window.gameplaySystem.playWithEric) {
            window.gameplaySystem.playWithEric();
        }
        
        // Créer des particules d'étoiles
        if (this.ericScene) {
            this.ericScene.createParticleEffect('stars', { x: 200, y: 150 });
        }
        
        setTimeout(() => {
            this.updateEricSprite('happy');
            setTimeout(() => {
                this.syncWithTamaState();
            }, 1000);
        }, 3000);
    }
    
    /**
     * Caresse Eric
     */
    petEric() {
        this.updateEricSprite('love');
        
        // Créer des particules de coeurs
        if (this.ericScene) {
            this.ericScene.createParticleEffect('hearts', { x: 200, y: 150 });
        }
        
        // Augmenter légèrement le mood
        if (window.tamaState) {
            window.tamaState.mood = Math.min(100, window.tamaState.mood + 5);
        }
        
        // Notification
        if (window.showNotification) {
            window.showNotification('💕 Eric ronronne de bonheur !', 'success');
        }
        
        setTimeout(() => {
            this.syncWithTamaState();
        }, 2000);
    }
    
    /**
     * Met Eric au lit
     */
    putEricToSleep() {
        this.updateEricSprite('sleeping');
        
        // Changer le thème de la scène en nuit
        if (this.ericScene) {
            this.ericScene.changeTheme('night');
        }
        
        // Notification
        if (window.showNotification) {
            window.showNotification('😴 Eric s\'endort paisiblement...', 'info');
        }
    }
    
    /**
     * Nettoie l'espace d'Eric
     */
    cleanEric() {
        // Particules de nettoyage
        if (this.ericScene) {
            this.ericScene.createParticleEffect('sparkles', { x: 200, y: 150 });
        }
        
        // Notification
        if (window.showNotification) {
            window.showNotification('🧹 Tout est propre et brillant !', 'success');
        }
        
        // Animation rapide
        const currentState = this.currentState;
        this.updateEricSprite('happy');
        setTimeout(() => {
            this.updateEricSprite(currentState);
        }, 1500);
    }
    
    /**
     * Gère l'évolution d'Eric
     */
    handleEvolution(newEvolution) {
        console.log(`🌟 Évolution d'Eric: ${this.evolution} → ${newEvolution}`);
        
        this.evolution = newEvolution;
        
        // Recréer le système de sprites avec la nouvelle évolution
        this.ericSprites = new EricSprites(newEvolution);
        
        // Animation d'évolution
        this.updateEricSprite('love');
        
        // Particules d'évolution
        if (this.ericScene) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.ericScene.createParticleEffect('stars', { x: 200, y: 150 });
                }, i * 300);
            }
        }
        
        // Notification
        if (window.showNotification) {
            window.showNotification(
                `🌟 Évolution ! Eric est maintenant ${this.getEvolutionName(newEvolution)} !`,
                'success'
            );
        }
        
        // Retour à l'état normal après l'animation
        setTimeout(() => {
            this.syncWithTamaState();
        }, 3000);
    }
    
    /**
     * Obtient le nom lisible de l'évolution
     */
    getEvolutionName(evolution) {
        const names = {
            chaton: 'un Chaton',
            adulte: 'un Chat Adulte',
            pro: 'un Pro Tech',
            legendaire: 'Légendaire'
        };
        return names[evolution] || evolution;
    }
    
    /**
     * Vérifie si c'est la nuit
     */
    isNightTime() {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 22;
    }
    
    /**
     * Charge l'état sauvegardé
     */
    loadSavedState() {
        try {
            const saved = localStorage.getItem('ericState');
            if (saved) {
                const state = JSON.parse(saved);
                this.evolution = state.evolution || 'chaton';
                this.currentState = state.currentState || 'idle';
                
                console.log('✅ État Eric chargé:', state);
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement de l\'état Eric:', error);
        }
    }
    
    /**
     * Sauvegarde l'état actuel
     */
    saveState() {
        try {
            const state = {
                evolution: this.evolution,
                currentState: this.currentState,
                lastUpdate: Date.now()
            };
            localStorage.setItem('ericState', JSON.stringify(state));
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde de l\'état Eric:', error);
        }
    }
    
    /**
     * Démarre les mises à jour automatiques
     */
    startAutoUpdate() {
        // Synchroniser avec tamaState toutes les 10 secondes
        setInterval(() => {
            if (this.currentState !== 'eating' && 
                this.currentState !== 'playing' && 
                this.currentState !== 'sleeping') {
                this.syncWithTamaState();
            }
        }, 10000);
        
        // Sauvegarder l'état toutes les 30 secondes
        setInterval(() => {
            this.saveState();
        }, 30000);
        
        // Vérifier l'heure pour le cycle jour/nuit
        setInterval(() => {
            if (this.isNightTime() && this.currentState !== 'sleeping') {
                // Suggestion de sommeil (pas forcé)
                if (Math.random() < 0.3) { // 30% de chance
                    if (window.showNotification) {
                        window.showNotification('😴 Eric a l\'air fatigué...', 'info');
                    }
                }
            }
        }, 300000); // Vérifier toutes les 5 minutes
    }
    
    /**
     * Nettoie les ressources
     */
    destroy() {
        this.saveState();
        this.isInitialized = false;
        console.log('🧹 Système Eric nettoyé');
    }
}

// ============================================
// INITIALISATION GLOBALE
// ============================================

// Créer l'instance globale
window.ericIntegration = null;

/**
 * Initialise Eric quand le DOM est prêt
 */
function initEricSystem() {
    // Attendre que tous les scripts soient chargés
    if (typeof EricSprites === 'undefined' || typeof EricScene === 'undefined') {
        console.warn('⚠️ Scripts Eric non encore chargés, nouvelle tentative dans 1s...');
        setTimeout(initEricSystem, 1000);
        return;
    }
    
    // Créer et initialiser
    window.ericIntegration = new EricIntegrationManager();
    window.ericIntegration.init();
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initEricSystem, 500); // Petit délai pour s'assurer que tout est chargé
    });
} else {
    setTimeout(initEricSystem, 500);
}

// ============================================
// FONCTIONS UTILITAIRES GLOBALES
// ============================================

/**
 * Mise à jour manuelle du sprite Eric (accessible globalement)
 */
window.updateEricSprite = function(state) {
    if (window.ericIntegration && window.ericIntegration.isInitialized) {
        window.ericIntegration.updateEricSprite(state);
    }
};

/**
 * Déclenche une évolution d'Eric (accessible globalement)
 */
window.triggerEricEvolution = function(newEvolution) {
    if (window.ericIntegration && window.ericIntegration.isInitialized) {
        window.ericIntegration.handleEvolution(newEvolution);
    }
};

/**
 * Obtient l'état actuel d'Eric
 */
window.getEricState = function() {
    if (window.ericIntegration && window.ericIntegration.isInitialized) {
        return {
            currentState: window.ericIntegration.currentState,
            evolution: window.ericIntegration.evolution
        };
    }
    return null;
};

// ============================================
// EXPORT
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EricIntegrationManager };
}

console.log('📦 eric-integration.js chargé');
