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
        this.frame = 0;
        this.enterRoom();
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
    }

    setPose(name, duration = 0) {
        if (!this.sprite) return;
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
            clearTimeout(this.poseTimer);
            this.poseTimer = setTimeout(() => this.setPose('idle'), duration);
        }
    }

    storyData() {
        return [
            { room:'living', eyebrow:'Prologue', title:'Le signal sous les toits', text:'Minuit trente-sept. Tous les écrans s’éteignent. Dans le silence, Éric redresse les oreilles : quelque chose appelle derrière les murs.', action:'Écouter avec Éric' },
            { room:'living', eyebrow:'Indice 01', title:'Une vibration dans le vinyle', text:'Le vieux disque tourne encore, mais aucune musique ne sort. Une lueur cuivre pulse sous la platine.', action:'Inspecter la platine' },
            { room:'kitchen', eyebrow:'Indice 02', title:'La piste chaude', text:'Des empreintes lumineuses traversent la cuisine. Elles sentent l’orage et conduisent vers la terrasse.', action:'Suivre les empreintes' },
            { room:'garden', eyebrow:'Finale', title:'La balise endormie', text:'Sous les plantes, Éric découvre une petite balise tombée du réseau. Son médaillon réagit : il peut la réveiller.', action:'Rallumer la balise' },
            { room:'garden', eyebrow:'Chapitre terminé', title:'Le gardien du signal', text:'La ville se rallume fenêtre après fenêtre. Éric s’assoit, fier et silencieux. Quelqu’un — ou quelque chose — a pourtant coupé la balise.', action:'Rejouer le chapitre' }
        ];
    }

    renderStory() {
        const card = this.container.querySelector('#adventureCard');
        const marker = this.container.querySelector('#adventureHotspot');
        if (!card || !marker) return;
        const story = this.storyData()[this.step];
        const roomMatches = story.room === this.game.currentRoom;
        card.innerHTML = `<span class="story-eyebrow">${story.eyebrow}</span><strong>${story.title}</strong><p>${story.text}</p><button type="button" id="storyAction">${this.step === 0 || this.step === 4 ? story.action : `Aller vers ${this.roomLabel(story.room)}`}</button>`;
        marker.hidden = !roomMatches || this.step === 0 || this.step === 4;
        marker.textContent = story.action;
        card.querySelector('#storyAction').onclick = () => {
            if (this.step === 4) return this.resetStory();
            if (this.step === 0) return this.advance();
            if (!roomMatches) this.game.changeRoom(story.room);
            else this.advance();
        };
        marker.onclick = () => this.advance();
    }

    roomLabel(room) { return ({living:'le coin musique',kitchen:'la cuisine',bedroom:'le refuge',garden:'la terrasse'})[room]; }

    advance() {
        if (this.step < 4) this.step += 1;
        localStorage.setItem('ericAdventureStep', this.step);
        this.game.refreshRoomLocks();
        if (this.step === 4) {
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
        clearInterval(this.frameTimer);
        if (this.stage) this.stage.onclick = null;
    }
}

window.EricAdventure = EricAdventure;
