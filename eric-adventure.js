/**
 * Les Aventures d'Éric — Chapter engine + procedural 3D character
 * No model download: the cat is assembled from lightweight Three.js primitives.
 */
class EricAdventure {
    constructor(game, container) {
        this.game = game;
        this.container = container;
        this.clock = new THREE.Clock();
        this.pointer = new THREE.Vector2();
        this.motion = 'idle';
        this.motionTime = 0;
        this.step = Number(localStorage.getItem('ericAdventureStep') || 0);
        this.frame = null;
        this.init3D();
        this.renderStory();
    }

    init3D() {
        const host = this.container.querySelector('#eric3dStage');
        if (!host || typeof THREE === 'undefined') return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-2.8, 2.8, 2.8, -2.8, 0.1, 100);
        this.camera.position.set(5, 3.4, 7);
        this.camera.lookAt(0, 0.8, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(Math.max(host.clientWidth, 320), Math.max(host.clientHeight, 360), false);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = .72;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        host.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.HemisphereLight(0x8eb9c3, 0x120b08, .34));
        const key = new THREE.DirectionalLight(0xf0a95e, .58);
        key.position.set(-4, 7, 5);
        key.castShadow = true;
        this.scene.add(key);
        const rim = new THREE.PointLight(0x62cbb2, .82, 10);
        rim.position.set(4, 2, -2);
        this.scene.add(rim);

        this.cat = this.createCat();
        this.cat.position.set(0, -.62, 0);
        this.cat.scale.setScalar(.72);
        this.cat.rotation.y = -0.22;
        this.scene.add(this.cat);

        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(1.05, 48),
            new THREE.MeshBasicMaterial({ color: 0x020506, transparent: true, opacity: 0.38, depthWrite: false })
        );
        shadow.scale.y = 0.32;
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -1.02;
        this.scene.add(shadow);

        this.onResize = () => {
            if (!host.isConnected) return;
            if (host.clientWidth > 0 && host.clientHeight > 0) {
                this.renderer.setSize(host.clientWidth, host.clientHeight, false);
            }
        };
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(host);
        this.onPointer = () => {
            this.setMotion('happy', 1.3);
            this.game.petEric();
        };
        window.addEventListener('resize', this.onResize);
        this.renderer.domElement.addEventListener('pointerdown', this.onPointer);
        this.animate();
    }

    material(color, roughness = 0.78) {
        return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.04 });
    }

    mesh(geometry, material, parent, position, scale = [1,1,1]) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }

    createCat() {
        const root = new THREE.Group();
        const fur = this.material(0x17191c, .92);
        const furWarm = this.material(0x292421, .9);
        const copper = new THREE.MeshStandardMaterial({ color: 0xb96d3d, roughness: .48, metalness: .42 });
        const mint = new THREE.MeshStandardMaterial({ color: 0x7ce0b8, emissive: 0x174638, emissiveIntensity: .9, roughness: .3 });
        const pupil = this.material(0x07100d, .4);
        const nose = this.material(0x7c463f, .72);

        this.body = this.mesh(new THREE.SphereGeometry(1, 32, 24), fur, root, [0, .02, 0], [.92, 1.02, .68]);
        this.chest = this.mesh(new THREE.SphereGeometry(1, 24, 18), furWarm, root, [.02, .28, .38], [.5, .58, .28]);
        this.head = new THREE.Group();
        this.head.position.set(.08, 1.08, .05);
        root.add(this.head);
        this.mesh(new THREE.SphereGeometry(1, 32, 24), fur, this.head, [0,0,0], [.68,.62,.61]);

        const earGeo = new THREE.ConeGeometry(.33, .82, 3);
        this.leftEar = this.mesh(earGeo, fur, this.head, [-.42,.58,-.02], [1,.9,.65]);
        this.rightEar = this.mesh(earGeo, fur, this.head, [.42,.58,-.02], [1,.9,.65]);
        this.leftEar.rotation.z = -.12; this.rightEar.rotation.z = .12;
        const innerEar = this.material(0x875349, .85);
        const innerGeo = new THREE.ConeGeometry(.2,.53,3);
        const il=this.mesh(innerGeo,innerEar,this.head,[-.42,.57,.18],[1,.85,.45]); il.rotation.z=-.12;
        const ir=this.mesh(innerGeo,innerEar,this.head,[.42,.57,.18],[1,.85,.45]); ir.rotation.z=.12;

        [-1,1].forEach(side => {
            this.mesh(new THREE.SphereGeometry(.16,24,16), mint, this.head, [side*.25,.06,.56],[1,.78,.5]);
            this.mesh(new THREE.SphereGeometry(.06,16,12), pupil, this.head, [side*.25,.055,.635],[.55,1.25,.45]);
        });
        this.mesh(new THREE.SphereGeometry(.095,18,12), nose, this.head, [0,-.17,.62],[1.05,.65,.7]);
        this.mesh(new THREE.SphereGeometry(.3,20,14), furWarm, this.head, [0,-.24,.46],[1.14,.54,.54]);

        this.legs = [];
        [[-.52,-.63,.34],[.52,-.63,.34],[-.48,-.58,-.25],[.48,-.58,-.25]].forEach((pos,index) => {
            const leg = new THREE.Group();
            leg.position.set(...pos);
            root.add(leg);
            this.mesh(new THREE.CylinderGeometry(.17,.2,.65,16), fur, leg, [0,-.1,0],[1,1,1]);
            this.mesh(new THREE.SphereGeometry(.25,20,14), furWarm, leg, [0,-.52,.1],[1.1,.62,1.35]);
            leg.userData.phase=index*Math.PI/2;
            this.legs.push(leg);
        });

        const tailCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-.75,.05,-.15), new THREE.Vector3(-1.35,.45,-.18),
            new THREE.Vector3(-1.28,1.18,-.15), new THREE.Vector3(-.85,1.42,-.05)
        ]);
        this.tail = this.mesh(new THREE.TubeGeometry(tailCurve,32,.17,12,false),fur,root,[0,0,0]);

        const collar = this.mesh(new THREE.TorusGeometry(.48,.055,10,32),copper,this.head,[0,-.52,.03],[1,1,.9]);
        collar.rotation.x=Math.PI/2;
        this.tag=this.mesh(new THREE.CylinderGeometry(.12,.12,.035,20),copper,this.head,[0,-.67,.52]);
        this.tag.rotation.x=Math.PI/2;
        return root;
    }

    setMotion(name, duration = 0) {
        this.motion = name;
        this.motionTime = duration;
    }

    animate() {
        this.frame = requestAnimationFrame(() => this.animate());
        if (!this.renderer) return;
        const dt = Math.min(this.clock.getDelta(), .05);
        const t = this.clock.elapsedTime;
        if (this.motionTime > 0) {
            this.motionTime -= dt;
            if (this.motionTime <= 0) this.motion = 'idle';
        }
        const breathe = Math.sin(t*2.1);
        this.body.scale.y = 1.2 + breathe*.018;
        this.head.rotation.z = Math.sin(t*.7)*.025;
        this.head.rotation.y = Math.sin(t*.45)*.08;
        this.leftEar.rotation.x = Math.sin(t*1.7)*.045;
        this.rightEar.rotation.x = Math.sin(t*1.7+1.4)*.04;
        this.tail.rotation.z = Math.sin(t*.95)*.08;
        this.tag.rotation.z = Math.sin(t*1.1)*.08;
        this.cat.position.y = -.62 + Math.sin(t*2.1)*.012;

        if (this.motion === 'happy') {
            this.cat.position.y += Math.abs(Math.sin(t*8))*.18;
            this.cat.rotation.z = Math.sin(t*8)*.045;
        } else if (this.motion === 'walk') {
            this.legs.forEach(leg => leg.rotation.x = Math.sin(t*7+leg.userData.phase)*.35);
            this.cat.position.y += Math.abs(Math.sin(t*7))*.045;
        } else if (this.motion === 'sleep') {
            this.cat.rotation.z += (-.18-this.cat.rotation.z)*.08;
            this.head.rotation.z = -.22 + Math.sin(t*1.4)*.025;
        } else {
            this.cat.rotation.z *= .9;
            this.legs.forEach(leg => leg.rotation.x *= .85);
        }
        this.renderer.render(this.scene, this.camera);
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
        if (!roomMatches && this.step > 0 && this.step < 4) this.setMotion('walk', 1.2);
    }

    roomLabel(room) { return ({living:'le coin musique',kitchen:'la cuisine',bedroom:'le refuge',garden:'la terrasse'})[room]; }

    advance() {
        if (this.step < 4) this.step += 1;
        localStorage.setItem('ericAdventureStep', this.step);
        if (this.step === 4) {
            this.game.coins += 100;
            this.game.xp += 60;
            this.game.bond = Math.min(100, this.game.bond + 15);
            this.game.setStatus('Chapitre terminé : +100 pièces, +60 XP, +15% de lien.', '◆');
            this.game.updateStatsDisplay();
            this.game.saveGameState();
            this.setMotion('happy', 2.5);
        }
        this.renderStory();
    }

    resetStory() {
        this.step = 0;
        localStorage.setItem('ericAdventureStep', '0');
        this.game.changeRoom('living');
    }

    destroy() {
        if (this.frame) cancelAnimationFrame(this.frame);
        window.removeEventListener('resize', this.onResize);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.renderer) {
            this.renderer.domElement.removeEventListener('pointerdown', this.onPointer);
            this.renderer.dispose();
        }
    }
}

window.EricAdventure = EricAdventure;
