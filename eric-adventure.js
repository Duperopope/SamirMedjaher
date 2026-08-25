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
        idle:  { row: 0, frames: [0], fps: 1, loop: false },
        walk:  { row: 1, frames: [0, 1, 2, 3], fps: 7, loop: true },
        happy: { row: 2, frames: [0, 1, 2, 3], fps: 8, loop: false },
        sit:   { row: 3, frames: [0], fps: 1, loop: false },
        sleep: { row: 3, intro: [0, 1], frames: [2, 3, 2, 3], fps: 2, loop: true }
    };

    roomPositions = {
        living: { x: 40, y: 28, scale: .41 },
        kitchen: { x: 35, y: 20, scale: .42 },
        bedroom: { x: 52, y: 18, scale: .41 },
        garden: { x: 48, y: 22, scale: .42 }
    };

    worldData = {
        living: {
            bounds: { x1: 7, x2: 91, y1: 9, y2: 56 },
            walkable: [
                { x:8, y:12 }, { x:31, y:10 }, { x:43, y:18 }, { x:55, y:17 },
                { x:68, y:24 }, { x:78, y:34 }, { x:76, y:46 }, { x:68, y:53 },
                { x:56, y:52 }, { x:44, y:47 }, { x:34, y:42 }, { x:24, y:36 },
                { x:14, y:31 }, { x:8, y:23 }
            ],
            obstacles: [
                { x1: 5, x2: 26, y1: 27, y2: 45 },
                { x1: 14, x2: 32, y1: 18, y2: 31 },
                { x1: 19, x2: 43, y1: 40, y2: 58 },
                { x1: 46, x2: 72, y1: 48, y2: 68 },
                { x1: 76, x2: 94, y1: 40, y2: 62 },
                { x1: 43, x2: 65, y1: 8, y2: 29 }
            ],
            objects: [
                { id:'vinyl', label:'Platine', x:13, y:13, icon:'fa-record-vinyl', message:'Le vinyle tourne sans musique. Éric suit la vibration du regard.' },
                { id:'guitar', label:'Guitare', x:37, y:31, icon:'fa-music', message:'Une corde résonne toute seule, exactement sur la fréquence de la balise.' },
                { id:'window', label:'Fenêtre', x:28, y:62, icon:'fa-moon', message:'Dehors, les lumières de Lyon clignotent comme un code.' }
            ]
        },
        kitchen: {
            bounds: { x1: 6, x2: 92, y1: 8, y2: 52 },
            walkable: [
                { x:7,y:10 }, { x:90,y:10 }, { x:91,y:39 }, { x:82,y:47 },
                { x:67,y:51 }, { x:49,y:50 }, { x:35,y:46 }, { x:20,y:43 },
                { x:8,y:34 }
            ],
            obstacles: [
                { x1: 3, x2: 25, y1: 15, y2: 39 },
                { x1: 43, x2: 72, y1: 27, y2: 61 }
            ],
            objects: [
                { id:'prints', label:'Empreintes', x:77, y:13, icon:'fa-paw', message:'Les traces sont encore tièdes. Elles traversent la porte de service.' },
                { id:'pantry', label:'Réserve', x:78, y:54, icon:'fa-box-open', message:'Éric renifle les bocaux. Quelque chose a été déplacé récemment.' },
                { id:'lamp', label:'Lampe', x:34, y:71, icon:'fa-lightbulb', message:'La lampe vacille au rythme du signal.' }
            ]
        },
        bedroom: {
            bounds: { x1: 13, x2: 88, y1: 8, y2: 52 },
            walkable: [
                { x:14,y:9 }, { x:86,y:9 }, { x:88,y:34 }, { x:81,y:47 },
                { x:66,y:51 }, { x:49,y:50 }, { x:35,y:46 }, { x:22,y:38 },
                { x:14,y:27 }
            ],
            obstacles: [
                { x1: 7, x2: 43, y1: 34, y2: 67 },
                { x1: 66, x2: 94, y1: 43, y2: 67 },
                { x1: 4, x2: 22, y1: 9, y2: 28 }
            ],
            objects: [
                { id:'radio', label:'Radio', x:80, y:53, icon:'fa-broadcast-tower', message:'La radio capte trois notes, puis le silence. Éric dresse les oreilles.' },
                { id:'map', label:'Carte', x:75, y:72, icon:'fa-map', message:'Un fil relie l’atelier, la cuisine et la serre des toits.' },
                { id:'bed', label:'Coussin', x:82, y:13, icon:'fa-circle', message:'Le refuge parfait pour une micro-sieste stratégique.' }
            ]
        },
        garden: {
            bounds: { x1: 7, x2: 92, y1: 9, y2: 61 },
            walkable: [
                { x:8,y:12 }, { x:31,y:10 }, { x:43,y:15 }, { x:58,y:12 },
                { x:76,y:16 }, { x:89,y:25 }, { x:90,y:43 }, { x:83,y:55 },
                { x:70,y:59 }, { x:58,y:56 }, { x:46,y:60 }, { x:34,y:56 },
                { x:23,y:51 }, { x:13,y:43 }, { x:8,y:29 }
            ],
            obstacles: [
                { x1: 5, x2: 37, y1: 44, y2: 78 },
                { x1: 38, x2: 55, y1: 27, y2: 42 },
                { x1: 57, x2: 77, y1: 11, y2: 25 },
                { x1: 72, x2: 93, y1: 39, y2: 64 }
            ],
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
        if (new URLSearchParams(window.location.search).has('navdebug')) this.renderNavigationDebug(room);
        room.addEventListener('click', (event) => {
            if (event.target.closest('button, aside')) return;
            const rect = room.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = 100 - ((event.clientY - rect.top) / rect.height) * 100;
            this.walkTo(x, y);
        });
    }

    renderNavigationDebug(room) {
        const world = this.worldData[this.game.currentRoom];
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'navigation-debug');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        const polygon = document.createElementNS(svg.namespaceURI, 'polygon');
        polygon.setAttribute('points', world.walkable.map(point => `${point.x},${100 - point.y}`).join(' '));
        polygon.setAttribute('class', 'navigation-debug__floor');
        svg.appendChild(polygon);
        world.obstacles.forEach(obstacle => {
            const rect = document.createElementNS(svg.namespaceURI, 'rect');
            rect.setAttribute('x', obstacle.x1);
            rect.setAttribute('y', 100 - obstacle.y2);
            rect.setAttribute('width', obstacle.x2 - obstacle.x1);
            rect.setAttribute('height', obstacle.y2 - obstacle.y1);
            rect.setAttribute('class', 'navigation-debug__obstacle');
            svg.appendChild(rect);
        });
        room.appendChild(svg);
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
            button.innerHTML = `<span class="object-focus" aria-hidden="true"></span><span>${object.label}</span>`;
            button.onclick = (event) => {
                event.stopPropagation();
                this.walkTo(object.x, object.y, () => {
                    this.audio?.playTone(object.id === 'beacon' ? 659.25 : 392, .65, .025);
                    this.setPose(object.id === 'bed' ? 'sleep' : 'happy', object.id === 'bed' ? 0 : 1700);
                    this.game.setStatus(object.message, '◆');
                    button.classList.add('is-discovered');
                    button.classList.add('is-reacting');
                    setTimeout(() => button.classList.remove('is-reacting'), 1200);
                    this.showEricLine(object.message, object.label);
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
        if (Math.hypot(destination.x - this.position.x, destination.y - this.position.y) > 5) this.audio?.startSteps();
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
        if (this.hasLineOfSight(start, destination, world)) return [destination];
        const step = 3;
        const key = point => `${Math.round(point.x / step)},${Math.round(point.y / step)}`;
        const pointFor = nodeKey => {
            const [gx, gy] = nodeKey.split(',').map(Number);
            return { x: gx * step, y: gy * step };
        };
        const startPoint = this.nearestWalkable(start.x, start.y, world, step);
        const endPoint = this.nearestWalkable(destination.x, destination.y, world, step);
        const startKey = key(startPoint);
        const endKey = key(endPoint);
        const open = new Set([startKey]);
        const cameFrom = new Map();
        const gScore = new Map([[startKey, 0]]);
        const fScore = new Map([[startKey, Math.hypot(startPoint.x - endPoint.x, startPoint.y - endPoint.y)]]);
        const directions = [-1, 0, 1].flatMap(dx => [-1, 0, 1].map(dy => ({ dx, dy }))).filter(({dx,dy}) => dx || dy);

        while (open.size) {
            const currentKey = [...open].sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity))[0];
            if (currentKey === endKey) {
                const path = [];
                let cursor = currentKey;
                while (cursor && cursor !== startKey) {
                    path.unshift(pointFor(cursor));
                    cursor = cameFrom.get(cursor);
                }
                path[path.length - 1] = destination;
                return this.simplifyPath(start, path, world);
            }
            open.delete(currentKey);
            const current = pointFor(currentKey);
            directions.forEach(({ dx, dy }) => {
                const next = { x: current.x + dx * step, y: current.y + dy * step };
                if (!this.isWalkable(next, world)) return;
                if (dx && dy && (!this.isWalkable({x:current.x + dx * step,y:current.y}, world) || !this.isWalkable({x:current.x,y:current.y + dy * step}, world))) return;
                const nextKey = key(next);
                const tentative = (gScore.get(currentKey) ?? Infinity) + Math.hypot(dx, dy);
                if (tentative >= (gScore.get(nextKey) ?? Infinity)) return;
                cameFrom.set(nextKey, currentKey);
                gScore.set(nextKey, tentative);
                fScore.set(nextKey, tentative + Math.hypot(next.x - endPoint.x, next.y - endPoint.y) / step);
                open.add(nextKey);
            });
        }
        return [destination];
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
        return this.nearestWalkable(x, y, world, 1.5);
    }

    isWalkable(point, world) {
        const margin = 1.7;
        if (point.x < world.bounds.x1 || point.x > world.bounds.x2 || point.y < world.bounds.y1 || point.y > world.bounds.y2) return false;
        if (world.walkable && !this.pointInPolygon(point, world.walkable)) return false;
        return !world.obstacles.some(obstacle =>
            point.x > obstacle.x1 - margin && point.x < obstacle.x2 + margin &&
            point.y > obstacle.y1 - margin && point.y < obstacle.y2 + margin
        );
    }

    pointInPolygon(point, polygon) {
        let inside = false;
        for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
            const a = polygon[index];
            const b = polygon[previous];
            const crosses = ((a.y > point.y) !== (b.y > point.y)) &&
                point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || Number.EPSILON) + a.x;
            if (crosses) inside = !inside;
        }
        return inside;
    }

    nearestWalkable(x, y, world, step = 2) {
        const origin = {
            x: Math.max(world.bounds.x1, Math.min(world.bounds.x2, x)),
            y: Math.max(world.bounds.y1, Math.min(world.bounds.y2, y))
        };
        if (this.isWalkable(origin, world)) return origin;
        for (let radius = step; radius < 55; radius += step) {
            const candidates = [];
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
                const point = { x: origin.x + Math.cos(angle) * radius, y: origin.y + Math.sin(angle) * radius };
                if (this.isWalkable(point, world)) candidates.push(point);
            }
            if (candidates.length) {
                candidates.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
                return candidates[0];
            }
        }
        return { ...this.roomPositions[this.game.currentRoom] };
    }

    hasLineOfSight(start, end, world) {
        const distance = Math.hypot(end.x - start.x, end.y - start.y);
        const samples = Math.max(2, Math.ceil(distance / 1.5));
        for (let index = 1; index <= samples; index += 1) {
            const t = index / samples;
            if (!this.isWalkable({ x:start.x + (end.x - start.x) * t, y:start.y + (end.y - start.y) * t }, world)) return false;
        }
        return true;
    }

    simplifyPath(start, path, world) {
        const simplified = [];
        let anchor = start;
        let index = 0;
        while (index < path.length) {
            let furthest = index;
            for (let candidate = path.length - 1; candidate >= index; candidate -= 1) {
                if (this.hasLineOfSight(anchor, path[candidate], world)) { furthest = candidate; break; }
            }
            simplified.push(path[furthest]);
            anchor = path[furthest];
            index = furthest + 1;
        }
        return simplified;
    }

    depthScale(y) {
        const base = this.roomPositions[this.game.currentRoom].scale;
        return Math.max(.31, Math.min(.56, base + (18 - y) * .006));
    }

    scheduleBehaviour(delay = 7500 + Math.random() * 6500) {
        clearTimeout(this.behaviourTimer);
        if (this.currentPose === 'sleep') return;
        this.behaviourTimer = setTimeout(() => {
            if (this.stage.classList.contains('is-entering')) return this.scheduleBehaviour();
            const roll = Math.random();
            if (roll < .22) this.setPose('sit', 2600);
            else if (roll < .34) this.setPose('happy', 1450);
            else if (roll < .42) {
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
        const intro = animation.intro || [];
        const sequence = [...intro, ...animation.frames];
        const drawFrame = () => {
            const column = sequence[this.frame];
            this.sprite.style.setProperty('--sprite-x', `${column * 100 / 3}%`);
            this.sprite.style.setProperty('--sprite-y', `${animation.row * 100 / 3}%`);
            if (this.frame < sequence.length - 1) this.frame += 1;
            else if (animation.loop) this.frame = intro.length;
            else clearInterval(this.frameTimer);
        };
        drawFrame();
        if (sequence.length > 1) this.frameTimer = setInterval(drawFrame, 1000 / animation.fps);
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
        card.innerHTML = `<div class="eric-speaker"><span class="speaker-mark">É</span><span><small>Éric</small><b>${story.eyebrow}</b></span></div><p><strong>${story.title}.</strong> ${story.text}</p><button type="button" id="storyAction">${roomMatches ? story.action : `Rejoindre ${this.roomLabel(story.room)}`}</button>`;
        marker.hidden = !roomMatches || this.step === 0 || isFinal;
        marker.textContent = story.action;
        const storyAction = card.querySelector('#storyAction');
        storyAction.disabled = true;
        this.storyReadyTimer = setTimeout(() => { storyAction.disabled = false; }, 1400);
        storyAction.onclick = () => {
            if (storyAction.disabled) return;
            if (isFinal) return this.resetStory();
            if (this.step === 0) return this.advance();
            if (!roomMatches) this.game.changeRoom(story.room);
            else this.advance();
        };
        marker.onclick = () => this.advance();
    }

    roomLabel(room) { return ({living:'le coin musique',kitchen:'la cuisine',bedroom:'le refuge',garden:'la terrasse'})[room]; }

    showEricLine(text, subject = 'Découverte') {
        const card = this.container.querySelector('#adventureCard');
        if (!card) return;
        card.classList.add('is-speaking');
        card.querySelector('p').innerHTML = `<strong>${subject}.</strong> ${text}`;
        clearTimeout(this.dialogueTimer);
        clearTimeout(this.storyReadyTimer);
        this.dialogueTimer = setTimeout(() => {
            card.classList.remove('is-speaking');
            this.renderStory();
        }, 5200);
    }

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
        clearTimeout(this.dialogueTimer);
        if (this.stage) this.stage.onclick = null;
    }
}

window.EricAdventure = EricAdventure;
