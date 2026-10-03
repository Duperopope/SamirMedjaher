/**
 * 🎮 TAMAGOTCHI MINI-GAMES
 * Version 3.0 - Gaming complet pour Éric le Chat
 * 
 * Mini-jeux inclus:
 * 1. 🎲 Pierre-Papier-Ciseaux (vs Éric)
 * 2. 🃏 Jeu de Mémoire (emojis de chat)
 * 3. 🎯 Attrape-Souris (clicker game)
 * 4. 🎵 Simon Says (séquence de couleurs)
 * 
 * Compatible mobile + desktop
 */

// ============================================
// CONFIGURATION MINI-JEUX
// ============================================

const MINIGAME_CONFIG = {
    MEMORY_GRID_SIZE: 4, // 4x4 = 16 cartes
    MEMORY_PAIRS: 8,
    MOUSE_HUNT_DURATION: 30000, // 30 secondes
    MOUSE_SPAWN_INTERVAL: 1000, // 1 souris/seconde
    SIMON_MAX_SEQUENCE: 10,
    SIMON_SHOW_DELAY: 600,
    REWARDS: {
        RPS_WIN: 50,
        RPS_LOSE: 10,
        MEMORY_COMPLETE: 100,
        MOUSE_CATCH: 5,
        SIMON_LEVEL: 20,
    }
};

// État des mini-jeux
let minigameState = {
    currentGame: null,
    isPlaying: false,
    memoryCards: [],
    memoryFlipped: [],
    memoryMatched: [],
    mouseScore: 0,
    mouseTimeLeft: 0,
    simonSequence: [],
    simonPlayerInput: [],
    simonLevel: 1,
};

// ============================================
// GESTIONNAIRE DE MINI-JEUX
// ============================================

/**
 * Ouvre le menu de sélection des mini-jeux
 */
function openMinigamesMenu() {
    if (!gamingMode) {
        showGameNotification('❌ Active le mode gaming d\'abord (3 clics sur la photo)');
        return;
    }

    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const content = document.getElementById('minigameContent');

    title.textContent = '🎮 Choisis un mini-jeu !';
    content.innerHTML = `
        <div class="minigame-menu">
            <button class="minigame-menu-btn" onclick="openMinigame('rps')">
                <div class="minigame-menu-icon">🎲</div>
                <div class="minigame-menu-name">Pierre-Papier-Ciseaux</div>
                <div class="minigame-menu-desc">Affronte Éric</div>
            </button>
            <button class="minigame-menu-btn" onclick="openMinigame('memory')">
                <div class="minigame-menu-icon">🃏</div>
                <div class="minigame-menu-name">Jeu de Mémoire</div>
                <div class="minigame-menu-desc">Trouve les paires</div>
            </button>
            <button class="minigame-menu-btn" onclick="openMinigame('mouse')">
                <div class="minigame-menu-icon">🎯</div>
                <div class="minigame-menu-name">Attrape-Souris</div>
                <div class="minigame-menu-desc">Clique vite !</div>
            </button>
            <button class="minigame-menu-btn" onclick="openMinigame('simon')">
                <div class="minigame-menu-icon">🎵</div>
                <div class="minigame-menu-name">Simon Says</div>
                <div class="minigame-menu-desc">Mémorise la séquence</div>
            </button>
        </div>
        <div style="text-align:center;margin-top:1.5rem;opacity:0.7;font-size:0.9rem;">
            💡 Astuce : Joue pour augmenter l'humeur d'Éric et gagner de l'XP !
        </div>
    `;

    modal.classList.add('active');
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

/**
 * Ouvre un mini-jeu spécifique
 */
function openMinigame(gameName) {
    if (!gamingMode) {
        showGameNotification('❌ Active le mode gaming d\'abord (3 clics sur la photo)');
        return;
    }

    minigameState.currentGame = gameName;
    minigameState.isPlaying = true;

    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const content = document.getElementById('minigameContent');

    // Configuration selon le jeu
    switch(gameName) {
        case 'rps':
            title.textContent = '🎲 Pierre-Papier-Ciseaux vs Éric';
            content.innerHTML = createRPSGame();
            break;
        case 'memory':
            title.textContent = '🃏 Jeu de Mémoire - Chats';
            content.innerHTML = createMemoryGame();
            initMemoryGame();
            break;
        case 'mouse':
            title.textContent = '🎯 Attrape-Souris !';
            content.innerHTML = createMouseGame();
            startMouseGame();
            break;
        case 'simon':
            title.textContent = '🎵 Simon Says - Séquence';
            content.innerHTML = createSimonGame();
            startSimonGame();
            break;
    }

    modal.classList.add('active');
    
    // Feedback haptique mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

/**
 * Ferme le mini-jeu actuel
 */
function closeMinigame() {
    const modal = document.getElementById('minigameModal');
    modal.classList.remove('active');
    
    minigameState.isPlaying = false;
    minigameState.currentGame = null;
    
    // Nettoyer les timers
    if (window.mouseGameTimer) clearInterval(window.mouseGameTimer);
    if (window.mouseSpawnTimer) clearInterval(window.mouseSpawnTimer);
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// ============================================
// 1. PIERRE-PAPIER-CISEAUX
// ============================================

function createRPSGame() {
    return `
        <div class="rps-game">
            <div class="rps-score">
                <div class="rps-score-item">
                    <span class="rps-label">Toi</span>
                    <span class="rps-value" id="rpsPlayerScore">0</span>
                </div>
                <div class="rps-vs">VS</div>
                <div class="rps-score-item">
                    <span class="rps-label">Éric 🐱</span>
                    <span class="rps-value" id="rpsEricScore">0</span>
                </div>
            </div>

            <div class="rps-display">
                <div class="rps-choice-display" id="playerChoice">❓</div>
                <div class="rps-vs-display">VS</div>
                <div class="rps-choice-display" id="ericChoice">❓</div>
            </div>

            <div class="rps-result" id="rpsResult"></div>

            <div class="rps-buttons">
                <button class="rps-btn" onclick="playRPS('pierre')" data-choice="pierre">
                    <span class="rps-emoji">✊</span>
                    <span class="rps-name">Pierre</span>
                </button>
                <button class="rps-btn" onclick="playRPS('papier')" data-choice="papier">
                    <span class="rps-emoji">✋</span>
                    <span class="rps-name">Papier</span>
                </button>
                <button class="rps-btn" onclick="playRPS('ciseaux')" data-choice="ciseaux">
                    <span class="rps-emoji">✌️</span>
                    <span class="rps-name">Ciseaux</span>
                </button>
            </div>

            <div class="rps-info">
                🏆 Victoire: +${MINIGAME_CONFIG.REWARDS.RPS_WIN} XP | 
                😼 Défaite: +${MINIGAME_CONFIG.REWARDS.RPS_LOSE} XP
            </div>
        </div>
    `;
}

let rpsScores = { player: 0, eric: 0 };

function playRPS(playerChoice) {
    const choices = ['pierre', 'papier', 'ciseaux'];
    const emojis = { pierre: '✊', papier: '✋', ciseaux: '✌️' };
    const ericChoice = choices[Math.floor(Math.random() * 3)];

    // Afficher les choix avec animation
    document.getElementById('playerChoice').textContent = emojis[playerChoice];
    document.getElementById('ericChoice').textContent = '🤔';

    setTimeout(() => {
        document.getElementById('ericChoice').textContent = emojis[ericChoice];

        // Déterminer le gagnant
        let result = '';
        let xpGain = 0;

        if (playerChoice === ericChoice) {
            result = '🤝 Égalité !';
            xpGain = 20;
        } else if (
            (playerChoice === 'pierre' && ericChoice === 'ciseaux') ||
            (playerChoice === 'papier' && ericChoice === 'pierre') ||
            (playerChoice === 'ciseaux' && ericChoice === 'papier')
        ) {
            result = '🎉 Tu gagnes !';
            rpsScores.player++;
            xpGain = MINIGAME_CONFIG.REWARDS.RPS_WIN;
            tamaState.mood = Math.min(100, tamaState.mood + 15);
        } else {
            result = '😿 Éric gagne !';
            rpsScores.eric++;
            xpGain = MINIGAME_CONFIG.REWARDS.RPS_LOSE;
            tamaState.mood = Math.max(0, tamaState.mood - 5);
        }

        // Afficher résultat
        document.getElementById('rpsResult').textContent = result;
        document.getElementById('rpsPlayerScore').textContent = rpsScores.player;
        document.getElementById('rpsEricScore').textContent = rpsScores.eric;

        // Récompenses
        gameStats.xp += xpGain;
        gameStats.score += xpGain;
        updateGameStats();
        updateTamaVisuals();
        saveTamaState();

        showGameNotification(`${result} +${xpGain} XP`);

        // Vibration mobile
        if (navigator.vibrate) {
            if (xpGain >= MINIGAME_CONFIG.REWARDS.RPS_WIN) {
                navigator.vibrate([50, 100, 50]); // Pattern victoire
            } else {
                navigator.vibrate(30);
            }
        }
    }, 800);
}

// ============================================
// 2. JEU DE MÉMOIRE
// ============================================

function createMemoryGame() {
    return `
        <div class="memory-game">
            <div class="memory-info">
                <div class="memory-stat">
                    <span class="memory-label">Paires trouvées:</span>
                    <span class="memory-value" id="memoryPairs">0/${MINIGAME_CONFIG.MEMORY_PAIRS}</span>
                </div>
                <div class="memory-stat">
                    <span class="memory-label">Coups:</span>
                    <span class="memory-value" id="memoryMoves">0</span>
                </div>
            </div>

            <div class="memory-grid" id="memoryGrid">
                <!-- Cartes générées par JS -->
            </div>

            <button class="memory-restart" onclick="restartMemoryGame()">
                <i class="fas fa-redo"></i> Nouvelle partie
            </button>
        </div>
    `;
}

function initMemoryGame() {
    const catEmojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿'];
    const cards = [...catEmojis, ...catEmojis]; // Dupliquer pour paires
    
    // Mélanger (Fisher-Yates)
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    minigameState.memoryCards = cards;
    minigameState.memoryFlipped = [];
    minigameState.memoryMatched = [];
    minigameState.memoryMoves = 0;

    // Générer HTML
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = cards.map((emoji, index) => `
        <div class="memory-card" data-index="${index}" onclick="flipMemoryCard(${index})">
            <div class="memory-card-inner">
                <div class="memory-card-front">❓</div>
                <div class="memory-card-back">${emoji}</div>
            </div>
        </div>
    `).join('');
}

function flipMemoryCard(index) {
    // Vérifications
    if (minigameState.memoryFlipped.length >= 2) return;
    if (minigameState.memoryFlipped.includes(index)) return;
    if (minigameState.memoryMatched.includes(index)) return;

    // Retourner la carte
    const card = document.querySelector(`.memory-card[data-index="${index}"]`);
    card.classList.add('flipped');
    minigameState.memoryFlipped.push(index);

    // Vibration
    if (navigator.vibrate) navigator.vibrate(20);

    // Vérifier si 2 cartes retournées
    if (minigameState.memoryFlipped.length === 2) {
        minigameState.memoryMoves++;
        document.getElementById('memoryMoves').textContent = minigameState.memoryMoves;

        const [index1, index2] = minigameState.memoryFlipped;
        const emoji1 = minigameState.memoryCards[index1];
        const emoji2 = minigameState.memoryCards[index2];

        if (emoji1 === emoji2) {
            // Match !
            setTimeout(() => {
                minigameState.memoryMatched.push(index1, index2);
                const cards = document.querySelectorAll(`.memory-card[data-index="${index1}"], .memory-card[data-index="${index2}"]`);
                cards.forEach(c => c.classList.add('matched'));
                minigameState.memoryFlipped = [];

                // Mettre à jour le compteur
                document.getElementById('memoryPairs').textContent = 
                    `${minigameState.memoryMatched.length / 2}/${MINIGAME_CONFIG.MEMORY_PAIRS}`;

                // Vibration succès
                if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

                // Vérifier si terminé
                if (minigameState.memoryMatched.length === minigameState.memoryCards.length) {
                    setTimeout(() => {
                        const bonus = Math.max(0, 200 - minigameState.memoryMoves * 10);
                        gameStats.xp += MINIGAME_CONFIG.REWARDS.MEMORY_COMPLETE + bonus;
                        gameStats.score += MINIGAME_CONFIG.REWARDS.MEMORY_COMPLETE + bonus;
                        updateGameStats();
                        
                        tamaState.mood = Math.min(100, tamaState.mood + 30);
                        updateTamaVisuals();
                        
                        showGameNotification(`🎉 Terminé en ${minigameState.memoryMoves} coups ! +${MINIGAME_CONFIG.REWARDS.MEMORY_COMPLETE + bonus} XP`);
                        
                        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
                    }, 500);
                }
            }, 600);
        } else {
            // Pas de match
            setTimeout(() => {
                const cards = document.querySelectorAll(`.memory-card[data-index="${index1}"], .memory-card[data-index="${index2}"]`);
                cards.forEach(c => c.classList.remove('flipped'));
                minigameState.memoryFlipped = [];
            }, 1000);
        }
    }
}

function restartMemoryGame() {
    initMemoryGame();
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryPairs').textContent = `0/${MINIGAME_CONFIG.MEMORY_PAIRS}`;
}

// ============================================
// 3. ATTRAPE-SOURIS
// ============================================

function createMouseGame() {
    return `
        <div class="mouse-game">
            <div class="mouse-stats">
                <div class="mouse-stat">
                    <span class="mouse-label">Score:</span>
                    <span class="mouse-value" id="mouseScore">0</span>
                </div>
                <div class="mouse-stat">
                    <span class="mouse-label">Temps:</span>
                    <span class="mouse-value" id="mouseTime">30</span>s
                </div>
            </div>

            <div class="mouse-playground" id="mousePlayground">
                <div class="mouse-instructions">
                    Clique sur les souris ! 🐭<br>
                    <small>+${MINIGAME_CONFIG.REWARDS.MOUSE_CATCH} XP par souris</small>
                </div>
            </div>

            <button class="mouse-restart" onclick="startMouseGame()" id="mouseRestartBtn" style="display:none;">
                <i class="fas fa-redo"></i> Rejouer
            </button>
        </div>
    `;
}

function startMouseGame() {
    minigameState.mouseScore = 0;
    minigameState.mouseTimeLeft = MINIGAME_CONFIG.MOUSE_HUNT_DURATION / 1000;

    document.getElementById('mouseScore').textContent = '0';
    document.getElementById('mouseTime').textContent = minigameState.mouseTimeLeft;
    document.getElementById('mouseRestartBtn').style.display = 'none';
    document.querySelector('.mouse-instructions').style.display = 'block';

    // Timer principal
    window.mouseGameTimer = setInterval(() => {
        minigameState.mouseTimeLeft--;
        document.getElementById('mouseTime').textContent = minigameState.mouseTimeLeft;

        if (minigameState.mouseTimeLeft <= 0) {
            endMouseGame();
        }
    }, 1000);

    // Spawn souris
    window.mouseSpawnTimer = setInterval(() => {
        spawnMouse();
    }, MINIGAME_CONFIG.MOUSE_SPAWN_INTERVAL);

    // Cacher instructions après 2s
    setTimeout(() => {
        document.querySelector('.mouse-instructions').style.display = 'none';
    }, 2000);
}

function spawnMouse() {
    const playground = document.getElementById('mousePlayground');
    const mouse = document.createElement('div');
    mouse.className = 'mouse-target';
    mouse.innerHTML = '🐭';
    
    // Position aléatoire
    const maxX = playground.offsetWidth - 50;
    const maxY = playground.offsetHeight - 50;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    mouse.style.left = x + 'px';
    mouse.style.top = y + 'px';

    // Click handler
    mouse.onclick = () => catchMouse(mouse);

    playground.appendChild(mouse);

    // Auto-remove après 2s
    setTimeout(() => {
        if (mouse.parentNode) {
            mouse.remove();
        }
    }, 2000);
}

function catchMouse(mouseElement) {
    mouseElement.classList.add('caught');
    minigameState.mouseScore++;
    
    document.getElementById('mouseScore').textContent = minigameState.mouseScore;
    
    // Récompenses
    gameStats.xp += MINIGAME_CONFIG.REWARDS.MOUSE_CATCH;
    gameStats.score += MINIGAME_CONFIG.REWARDS.MOUSE_CATCH;
    updateGameStats();
    
    // Vibration
    if (navigator.vibrate) navigator.vibrate(15);
    
    setTimeout(() => mouseElement.remove(), 300);
}

function endMouseGame() {
    clearInterval(window.mouseGameTimer);
    clearInterval(window.mouseSpawnTimer);
    
    // Nettoyer les souris restantes
    document.querySelectorAll('.mouse-target').forEach(m => m.remove());
    
    const totalXP = minigameState.mouseScore * MINIGAME_CONFIG.REWARDS.MOUSE_CATCH;
    const bonus = minigameState.mouseScore >= 20 ? 100 : 0;
    
    tamaState.mood = Math.min(100, tamaState.mood + Math.min(30, minigameState.mouseScore));
    updateTamaVisuals();
    
    showGameNotification(`🎯 Partie terminée ! ${minigameState.mouseScore} souris attrapées. +${totalXP + bonus} XP`);
    
    // Afficher bouton rejouer
    document.getElementById('mouseRestartBtn').style.display = 'block';
    document.querySelector('.mouse-instructions').style.display = 'block';
    document.querySelector('.mouse-instructions').innerHTML = 
        `Partie terminée !<br><strong>${minigameState.mouseScore} souris</strong> attrapées 🎉`;
    
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
}

// ============================================
// 4. SIMON SAYS
// ============================================

function createSimonGame() {
    return `
        <div class="simon-game">
            <div class="simon-info">
                <div class="simon-stat">
                    <span class="simon-label">Niveau:</span>
                    <span class="simon-value" id="simonLevel">1</span>
                </div>
                <div class="simon-stat">
                    <span class="simon-label">Séquence:</span>
                    <span class="simon-value" id="simonSequenceLength">0</span>
                </div>
            </div>

            <div class="simon-status" id="simonStatus">
                Mémorise la séquence...
            </div>

            <div class="simon-board">
                <div class="simon-btn simon-red" data-color="red" onclick="simonPlayerInput('red')"></div>
                <div class="simon-btn simon-green" data-color="green" onclick="simonPlayerInput('green')"></div>
                <div class="simon-btn simon-blue" data-color="blue" onclick="simonPlayerInput('blue')"></div>
                <div class="simon-btn simon-yellow" data-color="yellow" onclick="simonPlayerInput('yellow')"></div>
            </div>

            <button class="simon-restart" onclick="startSimonGame()">
                <i class="fas fa-redo"></i> Recommencer
            </button>
        </div>
    `;
}

function startSimonGame() {
    minigameState.simonSequence = [];
    minigameState.simonPlayerInput = [];
    minigameState.simonLevel = 1;
    
    document.getElementById('simonLevel').textContent = '1';
    document.getElementById('simonSequenceLength').textContent = '0';
    
    nextSimonRound();
}

function nextSimonRound() {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const newColor = colors[Math.floor(Math.random() * 4)];
    minigameState.simonSequence.push(newColor);
    minigameState.simonPlayerInput = [];
    
    document.getElementById('simonSequenceLength').textContent = minigameState.simonSequence.length;
    document.getElementById('simonStatus').textContent = 'Mémorise la séquence...';
    
    // Désactiver les boutons pendant la démonstration
    document.querySelectorAll('.simon-btn').forEach(btn => btn.style.pointerEvents = 'none');
    
    // Jouer la séquence
    playSimonSequence();
}

function playSimonSequence() {
    let index = 0;
    
    const interval = setInterval(() => {
        if (index >= minigameState.simonSequence.length) {
            clearInterval(interval);
            // Réactiver les boutons
            document.querySelectorAll('.simon-btn').forEach(btn => btn.style.pointerEvents = 'auto');
            document.getElementById('simonStatus').textContent = 'À ton tour !';
            return;
        }
        
        const color = minigameState.simonSequence[index];
        flashSimonButton(color);
        index++;
    }, MINIGAME_CONFIG.SIMON_SHOW_DELAY);
}

function flashSimonButton(color) {
    const btn = document.querySelector(`.simon-btn[data-color="${color}"]`);
    btn.classList.add('active');
    
    // Vibration
    if (navigator.vibrate) navigator.vibrate(50);
    
    setTimeout(() => {
        btn.classList.remove('active');
    }, 400);
}

function simonPlayerInput(color) {
    minigameState.simonPlayerInput.push(color);
    flashSimonButton(color);
    
    const currentIndex = minigameState.simonPlayerInput.length - 1;
    
    // Vérifier si correct
    if (minigameState.simonPlayerInput[currentIndex] !== minigameState.simonSequence[currentIndex]) {
        // Erreur !
        document.getElementById('simonStatus').textContent = '❌ Raté ! Recommence...';
        document.querySelectorAll('.simon-btn').forEach(btn => btn.style.pointerEvents = 'none');
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        
        setTimeout(() => {
            startSimonGame();
        }, 2000);
        return;
    }
    
    // Vérifier si séquence complète
    if (minigameState.simonPlayerInput.length === minigameState.simonSequence.length) {
        // Niveau réussi !
        minigameState.simonLevel++;
        document.getElementById('simonLevel').textContent = minigameState.simonLevel;
        document.getElementById('simonStatus').textContent = '✅ Bravo ! Niveau suivant...';
        
        const xpGain = MINIGAME_CONFIG.REWARDS.SIMON_LEVEL * minigameState.simonLevel;
        gameStats.xp += xpGain;
        gameStats.score += xpGain;
        updateGameStats();
        
        tamaState.mood = Math.min(100, tamaState.mood + 10);
        updateTamaVisuals();
        
        showGameNotification(`🎵 Niveau ${minigameState.simonLevel} ! +${xpGain} XP`);
        
        if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);
        
        // Vérifier victoire totale
        if (minigameState.simonLevel > MINIGAME_CONFIG.SIMON_MAX_SEQUENCE) {
            document.getElementById('simonStatus').textContent = '🏆 VICTOIRE TOTALE !';
            gameStats.xp += 500;
            updateGameStats();
            return;
        }
        
        setTimeout(() => {
            nextSimonRound();
        }, 2000);
    }
}

// ============================================
// INITIALISATION
// ============================================

// Auto-init quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinigames);
} else {
    initMinigames();
}

function initMinigames() {
    console.log('🎮 Mini-games v3.0 loaded');
}
