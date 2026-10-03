/**
 * 🎮 ADVANCED MINI-GAMES v2.0
 * 4 Nouveaux jeux addictifs style mobile gaming
 * 
 * Games:
 * 1. Coin Rush - Platformer runner avec physics
 * 2. Memory Pro - Memory game avec puzzles
 * 3. Rhythm Clicker - Music rhythm game
 * 4. Stack Builder - Physics stacking game
 */

/* ============================================
   🪙 GAME 1: COIN RUSH PLATFORMER
   ============================================ */

const CoinRush = {
    canvas: null,
    ctx: null,
    player: null,
    coins: [],
    obstacles: [],
    score: 0,
    gameRunning: false,
    speed: 5,
    jumpForce: 15,
    gravity: 0.8,
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="minigame-header">
                <h2>🪙 Coin Rush</h2>
                <div class="game-score">Score: <span id="coinrush-score">0</span></div>
            </div>
            <canvas id="coinrush-canvas" width="800" height="400"></canvas>
            <div class="game-controls">
                <button onclick="CoinRush.jump()" class="control-btn">⬆️ JUMP</button>
                <button onclick="CoinRush.restart()" class="control-btn">🔄 Restart</button>
            </div>
            <div class="game-instructions">
                <p>🎮 Clique ou appuie ESPACE pour sauter</p>
                <p>🪙 Collecte des coins, évite les obstacles</p>
                <p>⚡ Plus tu vas loin, plus c'est rapide!</p>
            </div>
        `;
        
        this.canvas = document.getElementById('coinrush-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Player setup
        this.player = {
            x: 100,
            y: this.canvas.height - 80,
            width: 40,
            height: 40,
            velocityY: 0,
            jumping: false
        };
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning) {
                this.jump();
            }
        });
        
        // Touch controls
        this.canvas.addEventListener('touchstart', () => {
            if (this.gameRunning) this.jump();
        });
        
        this.start();
    },
    
    start() {
        this.gameRunning = true;
        this.score = 0;
        this.speed = 5;
        this.coins = [];
        this.obstacles = [];
        this.player.y = this.canvas.height - 80;
        this.player.velocityY = 0;
        this.player.jumping = false;
        
        this.spawnInterval = setInterval(() => {
            if (Math.random() < 0.5) {
                this.spawnCoin();
            } else {
                this.spawnObstacle();
            }
        }, 1500);
        
        this.gameLoop();
    },
    
    jump() {
        if (!this.player.jumping) {
            this.player.velocityY = -this.jumpForce;
            this.player.jumping = true;
        }
    },
    
    spawnCoin() {
        this.coins.push({
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - 150) + 50,
            radius: 15,
            collected: false
        });
    },
    
    spawnObstacle() {
        this.obstacles.push({
            x: this.canvas.width,
            y: this.canvas.height - 60,
            width: 30,
            height: 60
        });
    },
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update player physics
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;
        
        // Ground collision
        if (this.player.y >= this.canvas.height - 80) {
            this.player.y = this.canvas.height - 80;
            this.player.velocityY = 0;
            this.player.jumping = false;
        }
        
        // Draw ground
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        
        // Draw player (Éric)
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.font = '30px Arial';
        this.ctx.fillText('🐱', this.player.x + 5, this.player.y + 32);
        
        // Update and draw coins
        this.coins = this.coins.filter(coin => {
            coin.x -= this.speed;
            
            if (!coin.collected) {
                // Draw coin
                this.ctx.beginPath();
                this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#fbbf24';
                this.ctx.fill();
                this.ctx.font = '20px Arial';
                this.ctx.fillText('🪙', coin.x - 10, coin.y + 8);
                
                // Collision detection
                const distance = Math.sqrt(
                    Math.pow(coin.x - (this.player.x + this.player.width / 2), 2) +
                    Math.pow(coin.y - (this.player.y + this.player.height / 2), 2)
                );
                
                if (distance < coin.radius + this.player.width / 2) {
                    coin.collected = true;
                    this.score += 10;
                    document.getElementById('coinrush-score').textContent = this.score;
                    
                    // Add coins to game state
                    if (window.gameplaySystem) {
                        window.gameplaySystem.addCoins(10, 'coinrush_game');
                    }
                }
            }
            
            return coin.x > -coin.radius;
        });
        
        // Update and draw obstacles
        this.obstacles = this.obstacles.filter(obs => {
            obs.x -= this.speed;
            
            // Draw obstacle
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            this.ctx.font = '40px Arial';
            this.ctx.fillText('🔥', obs.x - 5, obs.y + 45);
            
            // Collision detection
            if (
                this.player.x < obs.x + obs.width &&
                this.player.x + this.player.width > obs.x &&
                this.player.y < obs.y + obs.height &&
                this.player.y + this.player.height > obs.y
            ) {
                this.gameOver();
            }
            
            return obs.x > -obs.width;
        });
        
        // Increase difficulty
        if (this.score % 100 === 0 && this.score > 0) {
            this.speed += 0.5;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.spawnInterval);
        
        // Show game over
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score Final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.textAlign = 'left';
        
        // Track stats
        if (window.gamingDashboard) {
            const state = window.gamingDashboard.getState();
            state.metrics.minigamesPlayed++;
            state.metrics.coinsEarnedTotal += this.score;
            window.gamingDashboard.saveState();
        }
    },
    
    restart() {
        clearInterval(this.spawnInterval);
        this.start();
    }
};

/* ============================================
   🧠 GAME 2: MEMORY PRO
   ============================================ */

const MemoryPro = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    gameRunning: false,
    difficulty: 'medium', // easy: 8, medium: 12, hard: 16
    
    cardSymbols: {
        easy: ['🐱', '🪙', '🎮', '⚡'],
        medium: ['🐱', '🪙', '🎮', '⚡', '🎨', '🏆'],
        hard: ['🐱', '🪙', '🎮', '⚡', '🎨', '🏆', '🔥', '💎']
    },
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="minigame-header">
                <h2>🧠 Memory Pro</h2>
                <div class="game-stats">
                    <span>Moves: <span id="memory-moves">0</span></span>
                    <span>Pairs: <span id="memory-pairs">0</span>/6</span>
                </div>
            </div>
            <div class="difficulty-selector">
                <button onclick="MemoryPro.setDifficulty('easy')" class="diff-btn">Easy (8)</button>
                <button onclick="MemoryPro.setDifficulty('medium')" class="diff-btn active">Medium (12)</button>
                <button onclick="MemoryPro.setDifficulty('hard')" class="diff-btn">Hard (16)</button>
            </div>
            <div id="memory-grid" class="memory-grid"></div>
            <div class="game-controls">
                <button onclick="MemoryPro.restart()" class="control-btn">🔄 Restart</button>
            </div>
        `;
        
        this.start();
    },
    
    setDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.restart();
    },
    
    start() {
        this.gameRunning = true;
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        
        // Get symbols for difficulty
        const symbols = this.cardSymbols[this.difficulty];
        const pairs = this.difficulty === 'easy' ? 4 : this.difficulty === 'medium' ? 6 : 8;
        
        // Create card pairs
        this.cards = [];
        for (let i = 0; i < pairs; i++) {
            this.cards.push({ id: i, symbol: symbols[i], matched: false });
            this.cards.push({ id: i + pairs, symbol: symbols[i], matched: false });
        }
        
        // Shuffle
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        
        // Render grid
        this.renderGrid();
        
        // Update UI
        document.getElementById('memory-moves').textContent = this.moves;
        document.getElementById('memory-pairs').textContent = `0/${pairs}`;
    },
    
    renderGrid() {
        const grid = document.getElementById('memory-grid');
        const cols = this.difficulty === 'easy' ? 4 : this.difficulty === 'medium' ? 4 : 4;
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        grid.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.index = index;
            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.symbol}</div>
                </div>
            `;
            cardEl.addEventListener('click', () => this.flipCard(index));
            grid.appendChild(cardEl);
        });
    },
    
    flipCard(index) {
        if (!this.gameRunning) return;
        if (this.flippedCards.length === 2) return;
        
        const card = this.cards[index];
        if (card.matched) return;
        if (this.flippedCards.find(c => c.index === index)) return;
        
        // Flip card
        const cardEl = document.querySelector(`[data-index="${index}"]`);
        cardEl.classList.add('flipped');
        
        this.flippedCards.push({ index, symbol: card.symbol, el: cardEl });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('memory-moves').textContent = this.moves;
            
            setTimeout(() => this.checkMatch(), 800);
        }
    },
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // Match!
            this.cards[card1.index].matched = true;
            this.cards[card2.index].matched = true;
            card1.el.classList.add('matched');
            card2.el.classList.add('matched');
            
            this.matchedPairs++;
            const totalPairs = this.difficulty === 'easy' ? 4 : this.difficulty === 'medium' ? 6 : 8;
            document.getElementById('memory-pairs').textContent = `${this.matchedPairs}/${totalPairs}`;
            
            // Reward
            if (window.gameplaySystem) {
                window.gameplaySystem.addCoins(20, 'memory_match');
            }
            
            // Check win
            if (this.matchedPairs === totalPairs) {
                this.win();
            }
        } else {
            // No match
            card1.el.classList.remove('flipped');
            card2.el.classList.remove('flipped');
        }
        
        this.flippedCards = [];
    },
    
    win() {
        this.gameRunning = false;
        
        // Bonus for efficiency
        const maxMoves = this.cards.length;
        let bonus = 0;
        if (this.moves <= maxMoves) {
            bonus = 100; // Perfect score
        } else if (this.moves <= maxMoves * 1.5) {
            bonus = 50; // Good score
        }
        
        if (window.gameplaySystem && bonus > 0) {
            window.gameplaySystem.addCoins(bonus, 'memory_win_bonus');
        }
        
        setTimeout(() => {
            alert(`🎉 Victoire en ${this.moves} moves! Bonus: ${bonus} coins`);
        }, 500);
        
        // Track stats
        if (window.gamingDashboard) {
            const state = window.gamingDashboard.getState();
            state.metrics.minigamesPlayed++;
            state.metrics.minigameWins++;
            window.gamingDashboard.saveState();
        }
    },
    
    restart() {
        this.start();
    }
};

/* ============================================
   🎵 GAME 3: RHYTHM CLICKER
   ============================================ */

const RhythmClicker = {
    notes: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    gameRunning: false,
    speed: 3,
    spawnRate: 1000,
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="minigame-header">
                <h2>🎵 Rhythm Clicker</h2>
                <div class="game-stats">
                    <span>Score: <span id="rhythm-score">0</span></span>
                    <span>Combo: <span id="rhythm-combo">0</span></span>
                </div>
            </div>
            <div id="rhythm-track" class="rhythm-track">
                <div class="hit-zone">⬜</div>
            </div>
            <div class="game-controls">
                <button onclick="RhythmClicker.hit()" class="control-btn big-btn">🎯 HIT!</button>
                <button onclick="RhythmClicker.restart()" class="control-btn">🔄 Restart</button>
            </div>
            <div class="game-instructions">
                <p>🎵 Clique quand la note atteint la zone blanche!</p>
                <p>⭐ Perfect: dans la zone | 🎯 Good: proche | ❌ Miss: trop loin</p>
                <p>🔥 Combo x${this.combo} augmente les points!</p>
            </div>
        `;
        
        // Keyboard control
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && this.gameRunning) {
                this.hit();
            }
        });
        
        this.start();
    },
    
    start() {
        this.gameRunning = true;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.notes = [];
        
        document.getElementById('rhythm-score').textContent = this.score;
        document.getElementById('rhythm-combo').textContent = this.combo;
        
        // Spawn notes
        this.spawnInterval = setInterval(() => {
            this.spawnNote();
        }, this.spawnRate);
        
        // Game duration: 60 seconds
        setTimeout(() => {
            if (this.gameRunning) {
                this.gameOver();
            }
        }, 60000);
        
        this.gameLoop();
    },
    
    spawnNote() {
        const track = document.getElementById('rhythm-track');
        const note = document.createElement('div');
        note.className = 'rhythm-note';
        note.textContent = '🎵';
        note.style.right = '-50px';
        track.appendChild(note);
        
        this.notes.push({
            element: note,
            position: -50,
            hit: false
        });
    },
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Update notes
        this.notes = this.notes.filter(note => {
            note.position += this.speed;
            note.element.style.right = `-${note.position}px`;
            
            // Auto-miss if passed hit zone
            if (note.position > 450 && !note.hit) {
                note.hit = true;
                this.miss();
                note.element.remove();
                return false;
            }
            
            // Remove if off screen
            if (note.position > 600) {
                note.element.remove();
                return false;
            }
            
            return true;
        });
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    hit() {
        const hitZone = 350; // Center of hit zone
        const perfectRange = 30;
        const goodRange = 60;
        
        // Find closest note
        let closestNote = null;
        let closestDistance = Infinity;
        
        this.notes.forEach(note => {
            if (!note.hit) {
                const distance = Math.abs(note.position - hitZone);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNote = note;
                }
            }
        });
        
        if (!closestNote) return;
        
        if (closestDistance < goodRange) {
            closestNote.hit = true;
            
            let points = 0;
            let feedback = '';
            
            if (closestDistance < perfectRange) {
                // Perfect hit!
                points = 100;
                feedback = 'PERFECT! ⭐';
                this.combo++;
                closestNote.element.style.color = '#fbbf24';
            } else {
                // Good hit
                points = 50;
                feedback = 'GOOD! 🎯';
                this.combo++;
                closestNote.element.style.color = '#10b981';
            }
            
            // Apply combo multiplier
            points *= (1 + this.combo * 0.1);
            this.score += Math.floor(points);
            
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
            }
            
            // Update UI
            document.getElementById('rhythm-score').textContent = Math.floor(this.score);
            document.getElementById('rhythm-combo').textContent = this.combo;
            
            // Show feedback
            this.showFeedback(feedback);
            
            // Remove note
            setTimeout(() => closestNote.element.remove(), 200);
            
            // Add coins
            if (window.gameplaySystem) {
                window.gameplaySystem.addCoins(Math.floor(points / 10), 'rhythm_hit');
            }
        } else {
            this.miss();
        }
    },
    
    miss() {
        this.combo = 0;
        document.getElementById('rhythm-combo').textContent = this.combo;
        this.showFeedback('MISS! ❌');
    },
    
    showFeedback(text) {
        const feedback = document.createElement('div');
        feedback.className = 'rhythm-feedback';
        feedback.textContent = text;
        document.getElementById('rhythm-track').appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 500);
    },
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.spawnInterval);
        
        const track = document.getElementById('rhythm-track');
        track.innerHTML = `
            <div class="game-over-screen">
                <h2>🎉 Finished!</h2>
                <p>Score: ${Math.floor(this.score)}</p>
                <p>Max Combo: x${this.maxCombo}</p>
            </div>
        `;
        
        // Track stats
        if (window.gamingDashboard) {
            const state = window.gamingDashboard.getState();
            state.metrics.minigamesPlayed++;
            state.metrics.minigameWins++;
            state.metrics.coinsEarnedTotal += Math.floor(this.score / 10);
            window.gamingDashboard.saveState();
        }
    },
    
    restart() {
        clearInterval(this.spawnInterval);
        this.start();
    }
};

/* ============================================
   🏗️ GAME 4: STACK BUILDER
   ============================================ */

const StackBuilder = {
    canvas: null,
    ctx: null,
    blocks: [],
    currentBlock: null,
    score: 0,
    gameRunning: false,
    blockSpeed: 2,
    direction: 1,
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="minigame-header">
                <h2>🏗️ Stack Builder</h2>
                <div class="game-score">Height: <span id="stack-score">0</span></div>
            </div>
            <canvas id="stack-canvas" width="400" height="600"></canvas>
            <div class="game-controls">
                <button onclick="StackBuilder.drop()" class="control-btn big-btn">⬇️ DROP!</button>
                <button onclick="StackBuilder.restart()" class="control-btn">🔄 Restart</button>
            </div>
            <div class="game-instructions">
                <p>🏗️ Empile les blocs le plus haut possible!</p>
                <p>⬇️ Clique ou appuie ESPACE pour lâcher le bloc</p>
                <p>🎯 Aligne parfaitement pour maximum de points!</p>
            </div>
        `;
        
        this.canvas = document.getElementById('stack-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Keyboard control
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning) {
                this.drop();
            }
        });
        
        // Touch control
        this.canvas.addEventListener('touchstart', () => {
            if (this.gameRunning) this.drop();
        });
        
        this.start();
    },
    
    start() {
        this.gameRunning = true;
        this.score = 0;
        this.blocks = [];
        this.blockSpeed = 2;
        this.direction = 1;
        
        // Base block
        this.blocks.push({
            x: 100,
            y: this.canvas.height - 50,
            width: 200,
            height: 50,
            color: '#10b981'
        });
        
        this.spawnBlock();
        this.gameLoop();
    },
    
    spawnBlock() {
        const lastBlock = this.blocks[this.blocks.length - 1];
        this.currentBlock = {
            x: 0,
            y: lastBlock.y - 50,
            width: lastBlock.width,
            height: 50,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        this.direction = Math.random() < 0.5 ? 1 : -1;
    },
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all blocks
        this.blocks.forEach(block => {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(block.x, block.y, block.width, block.height);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(block.x, block.y, block.width, block.height);
        });
        
        // Move and draw current block
        if (this.currentBlock) {
            this.currentBlock.x += this.blockSpeed * this.direction;
            
            // Bounce off walls
            if (this.currentBlock.x <= 0 || this.currentBlock.x + this.currentBlock.width >= this.canvas.width) {
                this.direction *= -1;
            }
            
            this.ctx.fillStyle = this.currentBlock.color;
            this.ctx.fillRect(this.currentBlock.x, this.currentBlock.y, this.currentBlock.width, this.currentBlock.height);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.currentBlock.x, this.currentBlock.y, this.currentBlock.width, this.currentBlock.height);
        }
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    drop() {
        if (!this.currentBlock) return;
        
        const lastBlock = this.blocks[this.blocks.length - 1];
        
        // Calculate overlap
        const overlapLeft = Math.max(this.currentBlock.x, lastBlock.x);
        const overlapRight = Math.min(this.currentBlock.x + this.currentBlock.width, lastBlock.x + lastBlock.width);
        const overlap = overlapRight - overlapLeft;
        
        if (overlap <= 0) {
            // Miss! Game over
            this.gameOver();
            return;
        }
        
        // Adjust block to overlap area
        this.currentBlock.x = overlapLeft;
        this.currentBlock.width = overlap;
        
        // Add to stack
        this.blocks.push({ ...this.currentBlock });
        this.score++;
        document.getElementById('stack-score').textContent = this.score;
        
        // Reward coins based on accuracy
        const accuracy = overlap / lastBlock.width;
        let coins = Math.floor(accuracy * 20);
        
        if (accuracy > 0.95) {
            coins += 10; // Perfect bonus
            this.showFeedback('PERFECT! ⭐');
        }
        
        if (window.gameplaySystem) {
            window.gameplaySystem.addCoins(coins, 'stack_block');
        }
        
        // Check if too high
        if (this.currentBlock.y <= 100) {
            this.win();
            return;
        }
        
        // Increase difficulty
        this.blockSpeed += 0.1;
        
        // Spawn next block
        this.spawnBlock();
    },
    
    showFeedback(text) {
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.textAlign = 'left';
    },
    
    win() {
        this.gameOver(true);
    },
    
    gameOver(isWin = false) {
        this.gameRunning = false;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = 'bold 40px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isWin ? 'YOU WIN!' : 'GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Height: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.textAlign = 'left';
        
        // Track stats
        if (window.gamingDashboard) {
            const state = window.gamingDashboard.getState();
            state.metrics.minigamesPlayed++;
            if (isWin) state.metrics.minigameWins++;
            window.gamingDashboard.saveState();
        }
    },
    
    restart() {
        this.start();
    }
};

/* ============================================
   🌐 GLOBAL API EXPOSURE
   ============================================ */

window.advancedMinigames = {
    CoinRush,
    MemoryPro,
    RhythmClicker,
    StackBuilder
};

console.log('🎮 Advanced Mini-Games v2.0 - Module loaded!');
