/** Les Aventures d'Éric — illustrated character and chapter controller. */
class EricAdventure {
    constructor(game, container) {
        this.game = game;
        this.container = container;
        this.step = Number(localStorage.getItem('ericAdventureStep') || 0);
        this.sprite = container.querySelector('#ericAnimatedSprite');
        this.stage = container.querySelector('#ericIllustratedStage');
        this.poseTimer = null;
        this.frameTimer = null;
        this.behaviourTimer = null;
        this.moveTimer = null;
        this.currentPose = 'idle';
        this.audio = window.ericAudio;
        this.frame = 0;
        this.position = { ...this.roomPositions[this.game.currentRoom] };
        this.enterRoom();
        this.setupWorld();
        this.setupAudio();
        this.renderStory();
    }

    animations = {
        idle:  { row: 0, frames: [0, 1, 2, 3, 2, 1], fps: 4, loop: true },
        walk:  { row: 1, frames: [0, 1, 2, 3], fps: 9, loop: true },
        happy: { row: 2, frames: [0, 1, 2, 3], fps: 8, loop: false },
        sit:   { row: 3, frames: [0], fps: 1, loop: false },
        sleep: { row: 3, frames: [0, 1, 2, 3, 2, 3], fps: 3, loop: true }
    };

    roomPositions = {
        living: { x: 43, y: 7, scale: .58 },
        kitchen: { x: 48, y: 8, scale: .52 },
        bedroom: { x: 45, y: 7, scale: .5 },
        garden: { x: 44, y: 7, scale: .54 }
    };

    worldData = {
        living: {
            bounds: { x1: 12, x2: 76, y1: 5, y2: 31 },
            obstacles: [{ x1: 12, x2: 38, y1: 5, y2: 17 }],
            objects: [
                { id:'vinyl', label:'Platine', x:13, y:13, icon:'fa-record-vinyl', message:'Le vinyle tourne sans musique. Éric suit la vibration du regard.' },
                { id:'guitar', label:'Guitare', x:37, y:31, icon:'fa-music', message:'Une corde résonne toute seule, exactement sur la fréquence de la balise.' },
                { id:'window', label:'Fenêtre', x:28, y:62, icon:'fa-moon', message:'Dehors, les lumières de Lyon clignotent comme un code.' }
            ]
        },
        kitchen: {
            bounds: { x1: 10, x2: 82, y1: 5, y2: 37 },
            obstacles: [{ x1: 43, x2: 69, y1: 13, y2: 34 }],
            objects: [
                { id:'prints', label:'Empreintes', x:77, y:13, icon:'fa-paw', message:'Les traces sont encore tièdes. Elles traversent la porte de service.' },
                { id:'pantry', label:'Réserve', x:78, y:54, icon:'fa-box-open', message:'Éric renifle les bocaux. Quelque chose a été déplacé récemment.' },
                { id:'lamp', label:'Lampe', x:34, y:71, icon:'fa-lightbulb', message:'La lampe vacille au rythme du signal.' }
            ]
        },
        bedroom: {
            bounds: { x1: 17, x2: 79, y1: 5, y2: 37 },
            obstacles: [{ x1: 17, x2: 43, y1: 15, y2: 35 }],
            objects: [
                { id:'radio', label:'Radio', x:71, y:55, icon:'fa-broadcast-tower', message:'La radio capte trois notes, puis le silence. Éric dresse les oreilles.' },
                { id:'map', label:'Carte', x:68, y:73, icon:'fa-map', message:'Un fil relie l’atelier, la cuisine et la serre des toits.' },
                { id:'bed', label:'Coussin', x:77, y:15, icon:'fa-circle', message:'Le refuge parfait pour une micro-sieste stratégique.' }
            ]
        },
        garden: {
            bounds: { x1: 12, x2: 84, y1: 7, y2: 42 },
            obstacles: [{ x1: 12, x2: 35, y1: 20, y2: 40 }, { x1: 60, x2: 78, y1: 12, y2: 30 }],
            objects: [
                { id:'beacon', label:'Balise', x:77, y:68, icon:'fa-satellite-dish', message:'La balise pulse faiblement. Le médaillon d’Éric lui répond.' },
                { id:'greenhouse', label:'Serre', x:22, y:60, icon:'fa-seedling', message:'La chaleur de la serre dessine de la buée sur les vitres.' },
                { id:'telescope', label:'Télescope', x:43, y:35, icon:'fa-search', message:'Une lueur bleue traverse les nuages, juste au nord.' }
            ]
        }
    };

    enterRoom() {
        if (!this.sprite || !this.stage) return;
        const target = this.roomPositions[this.game.currentRoom];
        this.setPose('walk');
        const order = ['living', 'kitchen', 'bedroom', 'garden'];
        const previous = this.game.previousRoom || this.game.currentRoom;
        const movingRight = order.indexOf(this.game.currentRoom) >= order.indexOf(previous);
        const startX = movingRight ? Math.max(4, target.x - 18) : Math.min(92, target.x + 18);
        this.stage.style.setProperty('--eric-facing', movingRight ? -1 : 1);
        this.stage.style.setProperty('--eric-x', `${startX}%`);
        this.stage.style.setProperty('--eric-y', `${target.y}%`);
        this.stage.style.setProperty('--eric-scale', target.scale);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            this.stage.classList.add('is-entering');
            this.stage.style.setProperty('--eric-x', `${target.x}%`);
        }));
        this.poseTimer = setTimeout(() => {
            this.stage.classList.remove('is-entering');
            this.setPose(this.game.currentRoom === 'bedroom' ? 'sleep' : 'idle');
        }, 1350);
        this.stage.onclick = () => {
            this.setPose('happy', 1000);
            this.game.petEric();
        };
        this.scheduleBehaviour(1700);
    }

    setupWorld() {
        const room = this.container.querySelector('.room-container');
        if (!room) return;
        this.renderObjects(room);
        room.addEventListener('click', (event) => {
            if (event.target.closest('button, aside')) return;
            const rect = room.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = 100 - ((event.clientY - rect.top) / rect.height) * 100;
            this.walkTo(x, y);
        });
    }

    setupAudio() {
        const toggle = this.container.querySelector('#ericSoundToggle');
        if (!toggle || !this.audio) return;
        const render = () => {
            toggle.setAttribute('aria-pressed', String(this.audio.enabled));
            toggle.classList.toggle('is-on', this.audio.enabled);
            toggle.querySelector('i').className = `fas ${this.audio.enabled ? 'fa-volume-up' : 'fa-volume-mute'}`;
        };
        render();
        toggle.onclick = async event => {
            event.stopPropagation();
            await this.audio.toggle();
            render();
            this.audio.playTone(523.25, .5, .05);
        };
    }

    renderObjects(room) {
        const layer = document.createElement('div');
        layer.className = 'scene-object-layer';
        this.worldData[this.game.currentRoom].objects.forEach(object => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'scene-object';
            button.style.setProperty('--object-x', `${object.x}%`);
            button.style.setProperty('--object-y', `${object.y}%`);
            button.setAttribute('aria-label', `Examiner : ${object.label}`);
            button.innerHTML = `<i class="fas ${object.icon}"></i><span>${object.label}</span>`;
            button.onclick = (event) => {
                event.stopPropagation();
                const targetY = Math.max(6, Math.min(38, object.y * .48));
                const targetX = object.x > 60 && targetY < 32 ? 57 : Math.max(10, Math.min(84, object.x));
                this.walkTo(targetX, targetY, () => {
                    this.audio?.playTone(object.id === 'beacon' ? 659.25 : 392, .8, .05);
                    this.setPose(object.id === 'bed' ? 'sleep' : 'happy', object.id === 'bed' ? 0 : 1700);
                    this.game.setStatus(object.message, '◆');
                    button.classList.add('is-discovered');
                });
            };
            layer.appendChild(button);
        });
        room.appendChild(layer);
    }

    walkTo(rawX, rawY, onArrival) {
        clearTimeout(this.moveTimer);
        clearTimeout(this.behaviourTimer);
        const world = this.worldData[this.game.currentRoom];
        const destination = this.resolveDestination(rawX, rawY, world);
        const path = this.buildPath(this.position, destination, world);
        this.setPose('walk');
        this.audio?.startSteps();
        this.stage.classList.add('is-entering');
        this.walkPath(path, onArrival);
    }

    walkPath(path, onArrival) {
        const destination = path.shift();
        if (!destination) {
            this.audio?.stopSteps();
            this.stage.classList.remove('is-entering');
            this.setPose('idle');
            onArrival?.();
            this.scheduleBehaviour();
            return;
        }
        const dx = destination.x - this.position.x;
        const dy = destination.y - this.position.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 1) return this.walkPath(path, onArrival);
        const duration = Math.max(420, Math.min(1800, distance * 28));
        this.stage.style.setProperty('--eric-facing', dx >= 0 ? -1 : 1);
        this.stage.style.setProperty('--walk-duration', `${duration}ms`);
        this.stage.style.setProperty('--eric-x', `${destination.x}%`);
        this.stage.style.setProperty('--eric-y', `${destination.y}%`);
        this.stage.style.setProperty('--eric-scale', this.depthScale(destination.y));
        this.stage.style.zIndex = String(Math.round(80 - destination.y));
        this.position = destination;
        this.moveTimer = setTimeout(() => this.walkPath(path, onArrival), duration);
    }

    buildPath(start, destination, world) {
        const blocking = world.obstacles.find(obstacle => this.segmentCrosses(start, destination, obstacle));
        if (!blocking) return [destination];
        const candidates = [
            { x: blocking.x1 - 3, y: blocking.y1 - 3 },
            { x: blocking.x2 + 3, y: blocking.y1 - 3 },
            { x: blocking.x1 - 3, y: blocking.y2 + 3 },
            { x: blocking.x2 + 3, y: blocking.y2 + 3 }
        ].map(point => this.resolveDestination(point.x, point.y, { ...world, obstacles: [] }));
        candidates.sort((a, b) =>
            Math.hypot(a.x - start.x, a.y - start.y) + Math.hypot(destination.x - a.x, destination.y - a.y) -
            Math.hypot(b.x - start.x, b.y - start.y) - Math.hypot(destination.x - b.x, destination.y - b.y)
        );
        return [candidates[0], destination];
    }

    segmentCrosses(start, end, rect) {
        for (let index = 1; index < 12; index += 1) {
            const t = index / 12;
            const x = start.x + (end.x - start.x) * t;
            const y = start.y + (end.y - start.y) * t;
            if (x > rect.x1 && x < rect.x2 && y > rect.y1 && y < rect.y2) return true;
        }
        return false;
    }

    resolveDestination(x, y, world) {
        const point = {
            x: Math.max(world.bounds.x1, Math.min(world.bounds.x2, x)),
            y: Math.max(world.bounds.y1, Math.min(world.bounds.y2, y))
        };
        for (const obstacle of world.obstacles) {
            if (point.x > obstacle.x1 && point.x < obstacle.x2 && point.y > obstacle.y1 && point.y < obstacle.y2) {
                const edges = [
                    { x: obstacle.x1 - 2, y: point.y }, { x: obstacle.x2 + 2, y: point.y },
                    { x: point.x, y: obstacle.y1 - 2 }, { x: point.x, y: obstacle.y2 + 2 }
                ];
                edges.sort((a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y));
                return edges[0];
            }
        }
        return point;
    }

    depthScale(y) {
        const base = this.roomPositions[this.game.currentRoom].scale;
        return Math.max(.38, Math.min(.68, base + (18 - y) * .007));
    }

    scheduleBehaviour(delay = 2600 + Math.random() * 3200) {
        clearTimeout(this.behaviourTimer);
        if (this.currentPose === 'sleep') return;
        this.behaviourTimer = setTimeout(() => {
            if (this.stage.classList.contains('is-entering')) return this.scheduleBehaviour();
            const roll = Math.random();
            if (roll < .30) this.setPose('sit', 1500);
            else if (roll < .52) this.setPose('happy', 1150);
            else if (roll < .68) {
                const nearbyX = this.position.x + (Math.random() > .5 ? 1 : -1) * (4 + Math.random() * 7);
                this.walkTo(nearbyX, this.position.y + (Math.random() - .5) * 4);
                return;
            } else this.sprite.classList.add('ear-twitch');
            setTimeout(() => this.sprite?.classList.remove('ear-twitch'), 700);
            this.scheduleBehaviour();
        }, delay);
    }

    setPose(name, duration = 0) {
        if (!this.sprite) return;
        clearTimeout(this.poseTimer);
        this.currentPose = name;
        if (name === 'sleep') clearTimeout(this.behaviourTimer);
        const animation = this.animations[name] || this.animations.idle;
        clearInterval(this.frameTimer);
        this.frame = 0;
        const drawFrame = () => {
            const column = animation.frames[this.frame];
            this.sprite.style.setProperty('--sprite-x', `${column * 100 / 3}%`);
            this.sprite.style.setProperty('--sprite-y', `${animation.row * 100 / 3}%`);
            if (this.frame < animation.frames.length - 1) this.frame += 1;
            else if (animation.loop) this.frame = 0;
            else clearInterval(this.frameTimer);
        };
        drawFrame();
        if (animation.frames.length > 1) this.frameTimer = setInterval(drawFrame, 1000 / animation.fps);
        this.stage.dataset.pose = name;
        if (duration) {
            this.poseTimer = setTimeout(() => this.setPose('idle'), duration);
        }
    }

    storyData() {
        return [
            { room:'living', eyebrow:'Prologue', title:'Le signal sous les toits', text:'Minuit trente-sept. Tous les écrans s’éteignent. Dans le silence, Éric redresse les oreilles : quelque chose appelle derrière les murs.', action:'Écouter avec Éric' },
            { room:'living', eyebrow:'Indice 01', title:'Une vibration dans le vinyle', text:'Le vieux disque tourne encore, mais aucune musique ne sort. Une lueur cuivre pulse sous la platine.', action:'Inspecter la platine' },
            { room:'kitchen', eyebrow:'Indice 02', title:'Les pas qui n’appartiennent à personne', text:'Des empreintes lumineuses traversent la cuisine. Elles apparaissent seulement quand Éric cesse de les chercher.', action:'Suivre les empreintes' },
            { room:'bedroom', eyebrow:'Indice 03', title:'La fréquence des choses perdues', text:'Dans le refuge, une radio prononce trois notes. Peut-être que les objets oubliés continuent de parler à ceux qui savent attendre.', action:'Écouter la radio' },
            { room:'bedroom', eyebrow:'Interlude', title:'La carte et le territoire rêvé', text:'Les fils de la carte ne relient pas des lieux, mais des souvenirs. Éric comprend qu’un chemin existe dès qu’un vivant ose le parcourir.', action:'Lire la carte' },
            { room:'garden', eyebrow:'Indice 04', title:'Le jardin au-dessus des nuages', text:'La serre garde la chaleur des jours anciens. Chaque feuille porte une goutte de pluie comme un minuscule miroir du ciel.', action:'Traverser la serre' },
            { room:'garden', eyebrow:'Finale', title:'La balise endormie', text:'Sous les plantes, Éric découvre une balise tombée du réseau. Elle n’est pas brisée : elle attendait simplement que quelqu’un revienne.', action:'Rallumer la balise' },
            { room:'garden', eyebrow:'Chapitre terminé', title:'Le gardien des petites lumières', text:'La ville se rallume fenêtre après fenêtre. Éric ne l’a pas sauvée par la force, mais en prêtant attention à ce que tous les autres avaient cessé de voir.', action:'Rejouer le chapitre' }
        ];
    }

    renderStory() {
        const card = this.container.querySelector('#adventureCard');
        const marker = this.container.querySelector('#adventureHotspot');
        if (!card || !marker) return;
        const story = this.storyData()[this.step];
        const roomMatches = story.room === this.game.currentRoom;
        const isFinal = this.step === this.storyData().length - 1;
        card.innerHTML = `<span class="story-eyebrow">${story.eyebrow}</span><strong>${story.title}</strong><p>${story.text}</p><button type="button" id="storyAction">${roomMatches ? story.action : `Rejoindre ${this.roomLabel(story.room)}`}</button>`;
        marker.hidden = !roomMatches || this.step === 0 || isFinal;
        marker.textContent = story.action;
        card.querySelector('#storyAction').onclick = () => {
            if (isFinal) return this.resetStory();
            if (this.step === 0) return this.advance();
            if (!roomMatches) this.game.changeRoom(story.room);
            else this.advance();
        };
        marker.onclick = () => this.advance();
    }

    roomLabel(room) { return ({living:'le coin musique',kitchen:'la cuisine',bedroom:'le refuge',garden:'la terrasse'})[room]; }

    advance() {
        const finalStep = this.storyData().length - 1;
        if (this.step < finalStep) this.step += 1;
        localStorage.setItem('ericAdventureStep', this.step);
        this.game.refreshRoomLocks();
        if (this.step === finalStep) {
            this.game.coins += 100;
            this.game.xp += 60;
            this.game.bond = Math.min(100, this.game.bond + 15);
            this.game.setStatus('Chapitre terminé : +100 pièces, +60 XP, +15% de lien.', '◆');
            this.game.updateStatsDisplay();
            this.game.saveGameState();
            this.setPose('happy', 1800);
        }
        this.renderStory();
    }

    resetStory() {
        this.step = 0;
        localStorage.setItem('ericAdventureStep', '0');
        this.game.changeRoom('living');
    }

    destroy() {
        clearTimeout(this.poseTimer);
        clearTimeout(this.behaviourTimer);
        clearTimeout(this.moveTimer);
        clearInterval(this.frameTimer);
        if (this.stage) this.stage.onclick = null;
    }
}

window.EricAdventure = EricAdventure;
