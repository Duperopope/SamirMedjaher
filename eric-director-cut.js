(() => {
    'use strict';

    const enabled = window.ERIC_DIRECTOR_CUT !== false && localStorage.getItem('ericDirectorCut') !== 'off';
    if (!enabled) return;
    window.ERIC_DIRECTOR_CUT = true;

    const STORAGE_KEY = 'ericDirectorCutStateV1';
    const RUNTIME_KEY = 'ericDirectorRuntimeV1';
    const STORY_KEY = 'ericDirectorAdventureStep';
    const STATE_VERSION = 1;

    const ACTS = [
        {
            id: 'signal',
            title: 'Le bruit',
            room: 'Atelier',
            threshold: 0,
            text: 'Quelque chose pulse derrière les murs. Éric est le premier à l’entendre.'
        },
        {
            id: 'need',
            title: 'Le besoin',
            room: 'Cuisine',
            threshold: 2,
            text: 'Un bol vide a une urgence qu’aucune étiquette de prix ne peut remplacer.'
        },
        {
            id: 'desire',
            title: 'Le désir',
            room: 'Repos',
            threshold: 4,
            text: 'Les objets s’accumulent. Éric continue pourtant à choisir ce qui n’était pas à vendre.'
        },
        {
            id: 'machine',
            title: 'La machine',
            room: 'Terrasse',
            threshold: 6,
            text: 'Les petites pulsations deviennent une ville entière. Personne ne donne l’ordre, tout le monde alimente le rythme.'
        }
    ];

    const SHOP_ITEMS = [
        {
            id: 'box',
            name: 'Carton de livraison',
            cost: 0,
            room: 'living',
            icon: 'fa-box',
            note: 'Il entourait autre chose. Éric, lui, le choisit tel quel.'
        },
        {
            id: 'cord',
            name: 'Ficelle rouge',
            cost: 12,
            room: 'living',
            icon: 'fa-link',
            note: 'Presque sans prix. Beaucoup plus intéressante quand elle bouge.'
        },
        {
            id: 'bowl',
            name: 'Bol ébréché',
            cost: 24,
            room: 'kitchen',
            icon: 'fa-bowl-food',
            note: 'Pas neuf, pas rare. Il remplit exactement sa fonction.'
        },
        {
            id: 'vinyl',
            name: 'Vieux vinyle',
            cost: 46,
            room: 'living',
            icon: 'fa-compact-disc',
            note: 'Une face est rayée. C’est pourtant elle qui porte le signal.'
        },
        {
            id: 'cushion',
            name: 'Coussin neuf',
            cost: 90,
            room: 'bedroom',
            icon: 'fa-square',
            note: 'Très doux. Éric dort encore dans le carton.'
        },
        {
            id: 'lamp',
            name: 'Lampe d’atelier',
            cost: 140,
            room: 'garden',
            icon: 'fa-lightbulb',
            note: 'Elle éclaire mieux. Elle ne dit pas quoi regarder.'
        }
    ];

    const MEMORIES = [
        { id: 'first-signal', title: 'Le premier signal', icon: 'fa-wave-square', unlock: s => s.storyStep >= 1, text: 'Le silence a commencé par une vibration.' },
        { id: 'empty-bowl', title: 'Le bol vide', icon: 'fa-bowl-food', unlock: s => s.storyStep >= 2, text: 'Un besoin réel ne devient pas plus réel parce qu’on lui donne un prix.' },
        { id: 'frequency', title: 'Trois notes', icon: 'fa-music', unlock: s => s.trials.frequency, text: 'Le même motif revenait dans des endroits qui ne semblaient pas liés.' },
        { id: 'cardboard', title: 'Le carton', icon: 'fa-box', unlock: s => s.purchases.includes('box'), text: 'Son objet préféré n’était pas celui qui avait été commandé.' },
        { id: 'small-things', title: 'Les petites choses', icon: 'fa-link', unlock: s => s.purchases.includes('cord'), text: 'Une ficelle, un rayon de lumière, quelqu’un qui reste là.' },
        { id: 'constellations', title: 'Lumières jumelles', icon: 'fa-star', unlock: s => s.trials.constellations, text: 'Certaines fenêtres clignotaient comme des chiffres qui auraient oublié leur sens.' },
        { id: 'counted-city', title: 'La ville comptée', icon: 'fa-city', unlock: s => s.storyStep >= 7, text: 'Des millions de gestes minuscules faisaient tenir la machine debout.' },
        { id: 'beside-eric', title: 'À côté d’Éric', icon: 'fa-cat', unlock: s => s.finished, text: 'Quand le signal s’est tu, rien n’avait besoin d’être acheté.' }
    ];

    const STORY = [
        {
            room: 'living',
            eyebrow: 'Prologue',
            title: 'Le signal sous les toits',
            text: 'Minuit trente-sept. Les écrans s’éteignent une seconde. Éric redresse les oreilles. Une pulsation régulière traverse l’atelier, trop précise pour être un simple bruit.',
            action: 'Écouter avec Éric'
        },
        {
            room: 'living',
            eyebrow: 'Le bruit',
            title: 'Le reçu muet',
            text: 'La platine tourne sans musique. À chaque tour, le même rythme apparaît sur l’écran voisin. Trois notes, puis une pause. Comme une transaction dont on aurait retiré les chiffres.',
            action: 'Caler la fréquence'
        },
        {
            room: 'kitchen',
            eyebrow: 'Le besoin',
            title: 'Le bol vide',
            text: 'Éric ne regarde ni les emballages ni leurs étiquettes. Il regarde le fond de sa gamelle. Ici, pour une fois, la différence entre manquer et vouloir est très simple.',
            action: 'Observer la cuisine'
        },
        {
            room: 'kitchen',
            eyebrow: 'L’échange',
            title: 'Ce qui coûte',
            text: 'Le terminal de la cuisine se rallume. Chaque objet possède désormais un prix. Le signal accélère au moment exact où une pièce change de main.',
            action: 'Suivre le rythme'
        },
        {
            room: 'bedroom',
            eyebrow: 'Le désir',
            title: 'Le carton',
            text: 'Un coussin neuf attend près du lit. Éric le renifle, traverse la pièce et se couche dans le carton qui l’accompagnait. Le carton, lui, n’avait jamais figuré sur la facture.',
            action: 'S’asseoir près de lui'
        },
        {
            room: 'bedroom',
            eyebrow: 'Interlude',
            title: 'Trois notes pour rien',
            text: 'La radio du refuge reprend les trois notes de l’atelier. Aucun message, aucune offre, aucune instruction. Juste un motif qui existe même quand personne ne le monétise.',
            action: 'Écouter sans compter'
        },
        {
            room: 'garden',
            eyebrow: 'La machine',
            title: 'La ville comptée',
            text: 'Depuis la terrasse, des fenêtres s’allument au même rythme. Commandes, écrans, terminaux, notifications. Personne ne semble diriger l’ensemble, pourtant chacun ajoute une pulsation.',
            action: 'Lire les lumières'
        },
        {
            room: 'garden',
            eyebrow: 'Finale',
            title: 'Ce qui reste',
            text: 'Le motif est enfin lisible. Éric, lui, ne le regarde déjà plus. Il s’assoit simplement à côté de toi. La ville continue de compter en contrebas.',
            action: 'Rester un moment'
        },
        {
            room: 'garden',
            eyebrow: 'Après',
            title: 'Le silence n’a pas de prix',
            text: 'Aucun compteur ne s’affiche. Aucun objet ne manque. Pendant quelques secondes, il n’y a plus rien à optimiser.',
            action: 'Rejouer la nuit'
        }
    ];

    function defaultState() {
        return {
            version: STATE_VERSION,
            storyStep: Number(localStorage.getItem(STORY_KEY) || 0),
            purchases: [],
            coins: 100,
            spent: 0,
            careMoments: 0,
            rewardedSteps: [],
            trials: { frequency: false, constellations: false },
            finished: false
        };
    }

    function loadState() {
        const fallback = defaultState();
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (!parsed || parsed.version !== STATE_VERSION) return fallback;
            return {
                ...fallback,
                ...parsed,
                purchases: Array.isArray(parsed.purchases) ? parsed.purchases : [],
                rewardedSteps: Array.isArray(parsed.rewardedSteps) ? parsed.rewardedSteps : [],
                trials: { ...fallback.trials, ...(parsed.trials || {}) }
            };
        } catch {
            return fallback;
        }
    }

    let state = loadState();

    function saveState() {
        state.storyStep = Number(localStorage.getItem(STORY_KEY) || state.storyStep || 0);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function currentCoins() {
        return Number.isFinite(state.coins) ? state.coins : 100;
    }

    function setCoins(value) {
        const safe = Math.max(0, Math.floor(value));
        state.coins = safe;
        saveState();
        if (window.ericGame) {
            window.ericGame.coins = safe;
            window.ericGame.saveGameState?.();
        }
        const display = document.getElementById('ericCoinsDisplay');
        if (display) display.textContent = safe;
        return safe;
    }

    function storyStep() {
        return Number(localStorage.getItem(STORY_KEY) || state.storyStep || 0);
    }

    function chapterNumber() {
        const step = storyStep();
        if (step >= 6) return 4;
        if (step >= 4) return 3;
        if (step >= 2) return 2;
        return 1;
    }

    function unlockedMemories() {
        state.storyStep = storyStep();
        return MEMORIES.filter(memory => memory.unlock(state));
    }

    function notify(message, type = 'info') {
        window.ericGame?.setStatus?.(message);
        const dashboard = document.getElementById('gamingDashboard');
        if (!dashboard) return;

        dashboard.querySelector('.director-toast')?.remove();
        const toast = document.createElement('div');
        toast.className = 'director-toast director-toast-' + type;
        const icon = type === 'error' ? 'fa-circle-exclamation' : type === 'success' ? 'fa-check' : 'fa-circle-info';
        toast.innerHTML = '<i class="fas ' + icon + '" aria-hidden="true"></i><span></span>';
        toast.querySelector('span').textContent = message;
        dashboard.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 240);
        }, 2300);
    }

    function purchase(itemId) {
        const item = SHOP_ITEMS.find(entry => entry.id === itemId);
        if (!item || state.purchases.includes(itemId)) return;
        const coins = currentCoins();
        if (coins < item.cost) {
            notify('Il manque quelques pièces. Rien ne presse.', 'info');
            return;
        }

        setCoins(coins - item.cost);
        state.purchases.push(itemId);
        state.spent += item.cost;
        saveState();
        notify(item.cost ? item.name + ' rejoint le refuge.' : item.name + ' a été récupéré.', 'success');

        // The purchase chime is the first fragment of the signal motif heard later.
        if (item.cost > 0) {
            [196, 294, 247].forEach((frequency, index) => {
                setTimeout(() => tone(frequency, 0.075), index * 95);
            });
        }

        if (window.ericGame) {
            renderDirectorInventory(window.ericGame);
            renderDirectorShop(window.ericGame);
            addOwnedObjects(window.ericGame);
        }

        const tab = document.getElementById('tab-shop');
        if (tab?.classList.contains('active')) renderShopTab(tab);
    }

    function marketStage() {
        const count = state.purchases.length;
        if (count >= 5) return 3;
        if (count >= 3) return 2;
        if (count >= 1) return 1;
        return 0;
    }

    function shopButtonLabel(item) {
        if (state.purchases.includes(item.id)) return 'Dans le refuge';
        if (item.cost === 0) return 'Prendre';
        return 'Acquérir';
    }

    function renderShopTab(container) {
        const coins = currentCoins();
        const stage = marketStage();
        const stageCopy = [
            'Quelques objets. Rien d’urgent. Tout ne pourra pas être pris cette nuit.',
            'Le comptoir commence à retenir tes choix.',
            'Les objets ressemblent de plus en plus à ce que tu regardes.',
            'Le comptoir sait désormais très bien comment attirer ton attention.'
        ][stage];

        container.innerHTML = `
            <section class="director-page director-shop-page market-stage-${stage}">
                <header class="director-heading">
                    <span class="director-kicker">Intendance</span>
                    <div>
                        <h2>Comptoir nocturne</h2>
                        <p>${stageCopy}</p>
                    </div>
                    <div class="director-balance" aria-label="${coins} pièces disponibles">
                        <i class="fas fa-coins" aria-hidden="true"></i>
                        <strong>${coins}</strong>
                        <span>pièces</span>
                    </div>
                </header>
                <div class="director-shop-grid">
                    ${SHOP_ITEMS.map((item, index) => {
                        const owned = state.purchases.includes(item.id);
                        const affordable = coins >= item.cost;
                        const recommended = stage >= 2 && index === Math.min(SHOP_ITEMS.length - 1, state.purchases.length + 1);
                        return `
                            <article class="director-shop-card ${owned ? 'is-owned' : ''} ${recommended ? 'is-recommended' : ''}">
                                <span class="director-item-glyph"><i class="fas ${item.icon}" aria-hidden="true"></i></span>
                                <div class="director-shop-copy">
                                    <h3>${item.name}</h3>
                                    <p>${item.note}</p>
                                </div>
                                <footer>
                                    <span class="director-price">${item.cost === 0 ? 'sans prix' : item.cost + ' pièces'}</span>
                                    <button type="button" data-director-buy="${item.id}" ${owned || !affordable ? 'disabled' : ''}>
                                        ${owned ? 'Installé' : !affordable ? 'Pas encore' : shopButtonLabel(item)}
                                    </button>
                                </footer>
                            </article>
                        `;
                    }).join('')}
                </div>
            </section>
        `;

        container.querySelectorAll('[data-director-buy]').forEach(button => {
            button.addEventListener('click', () => purchase(button.dataset.directorBuy));
        });
    }

    function renderGamesTab(container) {
        const trials = [
            {
                id: 'frequency',
                icon: 'fa-wave-square',
                title: 'Fréquence',
                eyebrow: 'Atelier',
                text: 'Écouter le motif de la balise puis le reproduire. Le son et la lumière donnent la même information.'
            },
            {
                id: 'constellations',
                icon: 'fa-star',
                title: 'Constellations',
                eyebrow: 'Terrasse',
                text: 'Associer les fenêtres qui pulsent ensemble. Ce qui semble aléatoire finit par former un réseau.'
            }
        ];

        container.innerHTML = `
            <section class="director-page director-games-page">
                <header class="director-heading">
                    <span class="director-kicker">Deux épreuves, pas une salle d’arcade</span>
                    <div>
                        <h2>Épreuves du signal</h2>
                        <p>Chaque épreuve appartient à l’histoire. Aucun score n’est nécessaire pour comprendre la suite.</p>
                    </div>
                </header>
                <div class="director-trial-grid">
                    ${trials.map(trial => `
                        <button class="director-trial-card ${state.trials[trial.id] ? 'is-complete' : ''}" data-director-trial="${trial.id}">
                            <span class="trial-icon"><i class="fas ${trial.icon}" aria-hidden="true"></i></span>
                            <span class="trial-copy">
                                <small>${trial.eyebrow}</small>
                                <strong>${trial.title}</strong>
                                <span>${trial.text}</span>
                            </span>
                            <span class="trial-state">${state.trials[trial.id] ? 'Souvenir acquis' : 'Commencer'}</span>
                        </button>
                    `).join('')}
                </div>
            </section>
        `;

        container.querySelectorAll('[data-director-trial]').forEach(button => {
            button.addEventListener('click', () => openTrial(button.dataset.directorTrial, () => renderGamesTab(container)));
        });
    }

    function renderJournalTab(container) {
        const step = storyStep();
        container.innerHTML = `
            <section class="director-page director-journal-page">
                <header class="director-heading">
                    <span class="director-kicker">Journal d’aventure</span>
                    <div>
                        <h2>Le signal sous les toits</h2>
                        <p>Quatre actes courts. La progression vient de ce qui est découvert, pas d’une liste de corvées.</p>
                    </div>
                </header>
                <div class="director-act-list">
                    ${ACTS.map((act, index) => {
                        const nextThreshold = ACTS[index + 1]?.threshold;
                        const completed = index === ACTS.length - 1 ? state.finished : step >= nextThreshold;
                        const current = !completed && step >= act.threshold && (nextThreshold === undefined || step < nextThreshold);
                        return `
                            <article class="director-act ${completed ? 'is-complete' : ''} ${current ? 'is-current' : ''}">
                                <span class="act-index">0${index + 1}</span>
                                <div>
                                    <small>${act.room}</small>
                                    <h3>${act.title}</h3>
                                    <p>${act.text}</p>
                                </div>
                                <span class="act-state">${completed ? 'Traversé' : current ? 'En cours' : 'À venir'}</span>
                            </article>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    function renderMemoriesTab(container) {
        const unlocked = new Set(unlockedMemories().map(memory => memory.id));
        container.innerHTML = `
            <section class="director-page director-memories-page">
                <header class="director-heading">
                    <span class="director-kicker">Cabinet des souvenirs</span>
                    <div>
                        <h2>Ce qui reste</h2>
                        <p>${unlocked.size} souvenir${unlocked.size > 1 ? 's' : ''} sur ${MEMORIES.length}. Pas de bronze, d’argent ou de platine : seulement des traces de ce qui s’est passé.</p>
                    </div>
                </header>
                <div class="director-memory-grid">
                    ${MEMORIES.map(memory => {
                        const isUnlocked = unlocked.has(memory.id);
                        return `
                            <article class="director-memory ${isUnlocked ? 'is-unlocked' : 'is-locked'}">
                                <span class="memory-icon"><i class="fas ${isUnlocked ? memory.icon : 'fa-lock'}" aria-hidden="true"></i></span>
                                <div>
                                    <h3>${isUnlocked ? memory.title : 'Souvenir non révélé'}</h3>
                                    <p>${isUnlocked ? memory.text : 'Il manque encore un morceau de l’histoire.'}</p>
                                </div>
                            </article>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    function renderStatsTab(container) {
        const unlocked = unlockedMemories().length;
        const minutes = Math.max(0, Math.round((window.gamingDashboard?.getState?.().metrics?.totalPlaytime || 0) / 60000));
        container.innerHTML = `
            <section class="director-page director-stats-page">
                <header class="director-heading">
                    <span class="director-kicker">Carnet de route</span>
                    <div>
                        <h2>Ce qui est compté</h2>
                        <p>Les nombres sont utiles. Ils ne disent simplement pas tout.</p>
                    </div>
                </header>
                <div class="director-stat-grid">
                    <article><strong>${minutes}</strong><span>minutes dans le refuge</span></article>
                    <article><strong>${state.careMoments}</strong><span>moments passés avec Éric</span></article>
                    <article><strong>${state.spent}</strong><span>pièces dépensées</span></article>
                    <article><strong>${unlocked}/${MEMORIES.length}</strong><span>souvenirs révélés</span></article>
                </div>
                <div class="director-value-panel">
                    <div>
                        <small>Prix</small>
                        <strong>${state.spent} pièces</strong>
                        <p>Une mesure précise de ce qui a changé de main.</p>
                    </div>
                    <div>
                        <small>Valeur</small>
                        <strong>non chiffrée</strong>
                        <p>Une mesure volontairement absente. Le jeu te laisse décider ce qui comptait réellement.</p>
                    </div>
                </div>
            </section>
        `;
    }

    function renderEventsTab(container) {
        container.innerHTML = `
            <section class="director-page director-events-page">
                <header class="director-heading">
                    <span class="director-kicker">Phénomènes</span>
                    <div>
                        <h2>La nuit reste calme</h2>
                        <p>Le Director Cut ne fabrique plus d’événements quotidiens pour te faire revenir. L’histoire attend simplement là où tu l’as laissée.</p>
                    </div>
                </header>
            </section>
        `;
    }

    function renderSettingsTab(container) {
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        container.innerHTML = `
            <section class="director-page director-settings-page">
                <header class="director-heading">
                    <span class="director-kicker">Réglages</span>
                    <div>
                        <h2>Une expérience discrète</h2>
                        <p>Le refuge conserve seulement sa progression dans ce navigateur. Rien ici n’est nécessaire au CV professionnel.</p>
                    </div>
                </header>
                <div class="director-settings-grid">
                    <article class="director-setting-card">
                        <span class="director-item-glyph"><i class="fas fa-volume-high" aria-hidden="true"></i></span>
                        <div>
                            <h3>Son</h3>
                            <p>L’ambiance reste coupée jusqu’à une action volontaire. Les deux épreuves ont aussi un retour visuel complet.</p>
                        </div>
                    </article>
                    <article class="director-setting-card">
                        <span class="director-item-glyph"><i class="fas fa-person-walking" aria-hidden="true"></i></span>
                        <div>
                            <h3>Mouvement</h3>
                            <p>${reducedMotion ? 'Les animations réduites demandées par ton système sont respectées.' : 'Les animations sont actives. Le réglage système « réduire les animations » est respecté automatiquement.'}</p>
                        </div>
                    </article>
                    <article class="director-setting-card">
                        <span class="director-item-glyph"><i class="fas fa-hard-drive" aria-hidden="true"></i></span>
                        <div>
                            <h3>Progression locale</h3>
                            <p>Histoire, souvenirs et objets restent dans le stockage local de ce navigateur. Aucune progression n’est envoyée à un serveur.</p>
                        </div>
                    </article>
                    <article class="director-setting-card director-setting-actions">
                        <span class="director-item-glyph"><i class="fas fa-rotate-left" aria-hidden="true"></i></span>
                        <div>
                            <h3>Recommencer</h3>
                            <p>Rejouer l’histoire garde les souvenirs et objets. Effacer la progression repart d’une nuit vierge sans refermer le passage secret.</p>
                            <div class="director-setting-buttons">
                                <button type="button" data-director-replay>Rejouer l’histoire</button>
                                <button type="button" class="is-danger" data-director-reset>Effacer la progression</button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        `;

        container.querySelector('[data-director-replay]')?.addEventListener('click', () => {
            localStorage.setItem(STORY_KEY, '0');
            state.storyStep = 0;
            state.finished = false;
            saveState();
            if (window.ericGame) {
                window.ericGame.changeRoom('living');
                window.ericAdventure?.renderStory?.();
                window.ericGame.refreshRoomLocks?.();
            }
            notify('L’histoire recommence. Les souvenirs restent.', 'info');
        });

        container.querySelector('[data-director-reset]')?.addEventListener('click', () => {
            const confirmed = window.confirm('Effacer l’histoire, les objets et les souvenirs d’Éric sur ce navigateur ?');
            if (!confirmed) return;
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(RUNTIME_KEY);
            localStorage.removeItem(STORY_KEY);
            state = defaultState();
            localStorage.setItem(STORY_KEY, '0');
            saveState();
            window.location.reload();
        });
    }

    function renderTab(tabId, container) {
        switch (tabId) {
            case 'shop': renderShopTab(container); return true;
            case 'games': renderGamesTab(container); return true;
            case 'stats': renderStatsTab(container); return true;
            case 'quests': renderJournalTab(container); return true;
            case 'events': renderEventsTab(container); return true;
            case 'achievements': renderMemoriesTab(container); return true;
            case 'settings': renderSettingsTab(container); return true;
            default: return false;
        }
    }

    function applyChrome() {
        document.body.classList.add('eric-director-cut');
        const labels = {
            shop: 'Objets',
            games: 'Épreuves',
            stats: 'Carnet',
            quests: 'Journal',
            achievements: 'Souvenirs'
        };
        Object.entries(labels).forEach(([tab, label]) => {
            const button = document.querySelector(`.dashboard-tab-btn[data-tab="${tab}"] .tab-label`);
            if (button) button.textContent = label;
        });
        const events = document.querySelector('.dashboard-tab-btn[data-tab="events"]');
        if (events) events.hidden = true;
    }

    function renderDirectorInventory(game) {
        const grid = document.getElementById('inventoryGrid');
        if (!grid) return;
        const owned = SHOP_ITEMS.filter(item => state.purchases.includes(item.id));
        grid.innerHTML = `
            <div class="director-inventory-note">
                <span class="mission-eyebrow">Objets du refuge</span>
                <strong>${owned.length ? 'Les choses que tu as choisies restent visibles dans les pièces.' : 'La sacoche est vide.'}</strong>
                <small>Aucun objet n’est nécessaire pour terminer l’histoire.</small>
            </div>
            ${owned.map(item => `
                <div class="director-inventory-item">
                    <span><i class="fas ${item.icon}" aria-hidden="true"></i></span>
                    <div><strong>${item.name}</strong><small>${item.note}</small></div>
                </div>
            `).join('')}
        `;
    }

    function renderDirectorShop(game) {
        const container = document.getElementById('shopItems');
        if (!container) return;
        const coins = currentCoins();
        container.innerHTML = SHOP_ITEMS.map(item => {
            const owned = state.purchases.includes(item.id);
            return `
                <div class="director-sidebar-shop-item ${owned ? 'is-owned' : ''}">
                    <span><i class="fas ${item.icon}" aria-hidden="true"></i></span>
                    <div><strong>${item.name}</strong><small>${item.cost ? item.cost + ' pièces' : 'sans prix'}</small></div>
                    <button type="button" data-director-buy="${item.id}" ${owned || coins < item.cost ? 'disabled' : ''}>${owned ? 'Installé' : item.cost ? 'Prendre' : 'Récupérer'}</button>
                </div>
            `;
        }).join('');
        container.querySelectorAll('[data-director-buy]').forEach(button => {
            button.addEventListener('click', () => purchase(button.dataset.directorBuy));
        });
    }

    function addOwnedObjects(game) {
        const room = game.currentRoom;
        const scene = document.querySelector('#gameEnvironment .world-camera') || document.querySelector('#gameEnvironment .room-container');
        if (!scene) return;
        scene.querySelectorAll('.director-room-object').forEach(node => node.remove());
        SHOP_ITEMS.filter(item => state.purchases.includes(item.id) && item.room === room).forEach(item => {
            const marker = document.createElement('button');
            marker.type = 'button';
            marker.className = 'director-room-object director-object-' + item.id;
            marker.dataset.item = item.id;
            marker.title = item.name + ' — ' + item.note;
            marker.innerHTML = `<i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.name}</span>`;
            marker.addEventListener('click', () => {
                game.setStatus?.(item.note);
                window.ericAdventure?.showEricLine?.(item.note, item.name);
            });
            scene.appendChild(marker);
        });
    }
    function decorateEricLayout(game) {
        const root = game.container;
        if (!root) return;
        root.classList.add('director-eric-root');

        const identity = root.querySelector('.game-identity');
        if (identity) {
            identity.innerHTML = '<span class="game-kicker">Compagnon de nuit</span><h2>Éric <em>// suit le signal</em></h2><p>Il ne connaît pas le prix des choses. Il connaît leurs usages, leurs odeurs et les gens qui restent.</p>';
        }

        const statIcons = {
            hunger: 'fa-bowl-food',
            mood: 'fa-sun',
            health: 'fa-heart',
            energy: 'fa-moon'
        };
        Object.entries(statIcons).forEach(([stat, icon]) => {
            const target = root.querySelector(`.stat-bar[data-stat="${stat}"] .stat-icon`);
            if (target) target.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
        });

        const coinIcon = root.querySelector('.coin-icon');
        if (coinIcon) coinIcon.innerHTML = '<i class="fas fa-coins" aria-hidden="true"></i>';

        const level = root.querySelector('.level-count > span');
        if (level) level.innerHTML = 'Chap. <strong id="ericLevelDisplay">' + chapterNumber() + '</strong>';
        root.querySelector('.xp-track')?.setAttribute('hidden', '');

        const sidebarLabels = {
            inventory: ['fa-archive', 'Objets'],
            shop: ['fa-store', 'Comptoir'],
            minigames: ['fa-wave-square', 'Épreuves']
        };
        Object.entries(sidebarLabels).forEach(([tab, data]) => {
            const button = root.querySelector(`.sidebar-tab[data-tab="${tab}"]`);
            if (button) {
                button.innerHTML = `<i class="fas ${data[0]}" aria-hidden="true"></i><span>${data[1]}</span>`;
                if (tab === 'minigames') button.hidden = true;
            }
        });

        const inventoryTitle = root.querySelector('#inventoryTab .panel-title');
        if (inventoryTitle) inventoryTitle.innerHTML = '<i class="fas fa-archive" aria-hidden="true"></i> Objets du refuge';
        const shopTitle = root.querySelector('#shopTab .panel-title');
        if (shopTitle) shopTitle.innerHTML = '<i class="fas fa-store" aria-hidden="true"></i> Comptoir nocturne';
        root.querySelector('#shopTab .shop-categories')?.setAttribute('hidden', '');

        if (!root.querySelector('.director-sidebar-toggle')) {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'director-sidebar-toggle';
            toggle.setAttribute('aria-label', 'Afficher ou masquer les objets et le comptoir');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '<i class="fas fa-layer-group" aria-hidden="true"></i><span>Objets</span>';
            toggle.addEventListener('click', () => {
                const open = root.classList.toggle('sidebar-open');
                toggle.setAttribute('aria-expanded', String(open));
                toggle.innerHTML = open
                    ? '<i class="fas fa-times" aria-hidden="true"></i><span>Fermer</span>'
                    : '<i class="fas fa-layer-group" aria-hidden="true"></i><span>Objets</span>';
            });
            root.querySelector('.eric-game-container')?.appendChild(toggle);
        }

        renderDirectorInventory(game);
        renderDirectorShop(game);
        addOwnedObjects(game);
    }
    function patchEricGame() {
        const Proto = window.EricCompleteGame?.prototype;
        if (!Proto || Proto.__directorPatched) return;
        Proto.__directorPatched = true;

        const originalCreate = Proto.createGameLayout;
        Proto.createGameLayout = function() {
            originalCreate.call(this);
            decorateEricLayout(this);
        };

        const originalEnvironment = Proto.renderEnvironment;
        Proto.renderEnvironment = function() {
            originalEnvironment.call(this);
            addOwnedObjects(this);
            queueMicrotask(() => decorateEricLayout(this));
        };

        Proto.renderInventory = function() {
            renderDirectorInventory(this);
        };

        Proto.renderShop = function() {
            renderDirectorShop(this);
        };

        Proto.buyItem = function(category, itemId) {
            purchase(itemId);
        };

        Proto.setStatus = function(message) {
            const status = document.getElementById('ericStatusText');
            if (status) status.textContent = message;
        };

        // Director Cut runtime is isolated from the old Tamagotchi save.
        // Returning to the legacy prototype later cannot overwrite this story state.
        Proto.loadInventory = function() {
            return {};
        };

        Proto.loadCoins = function() {
            return currentCoins();
        };

        Proto.loadGameState = function() {
            try {
                const saved = JSON.parse(localStorage.getItem(RUNTIME_KEY) || 'null');
                if (!saved) {
                    this.coins = currentCoins();
                    this.level = chapterNumber();
                    this.xp = 0;
                    this.inventory = {};
                    this.lastSavedAt = Date.now();
                    return;
                }
                this.stats = saved.stats || this.stats;
                this.currentRoom = saved.currentRoom || 'living';
                this.bond = Number.isFinite(saved.bond) ? saved.bond : 0;
                this.lastSavedAt = saved.lastSavedAt || Date.now();
                this.coins = currentCoins();
                this.level = chapterNumber();
                this.xp = 0;
                this.inventory = {};
                this.dailyActions = [];
                this.dailyRewardClaimed = false;
            } catch {
                this.coins = currentCoins();
                this.currentRoom = 'living';
                this.level = chapterNumber();
                this.xp = 0;
                this.inventory = {};
                this.lastSavedAt = Date.now();
            }
        };

        Proto.saveGameState = function() {
            localStorage.setItem(RUNTIME_KEY, JSON.stringify({
                version: STATE_VERSION,
                stats: this.stats,
                currentRoom: this.currentRoom,
                bond: this.bond,
                lastSavedAt: Date.now()
            }));
        };

        Proto.handleQuickAction = function(action) {
            if (Date.now() - this.lastActionAt < 600) return;
            this.lastActionAt = Date.now();
            if (action !== 'sleep') this.sleepingUntil = 0;

            const actions = {
                feed: { stat: 'hunger', amount: 18, mood: 2, state: 'eat', message: 'Éric mange tranquillement. Le besoin disparaît, au moins pour un moment.' },
                play: { stat: 'mood', amount: 14, energy: -7, state: 'play', message: 'Une ficelle suffit largement à rendre la pièce intéressante.' },
                care: { stat: 'health', amount: 10, mood: 4, state: 'happy', message: 'Éric se laisse faire, puis revient de lui-même.' },
                sleep: { stat: 'energy', amount: 22, hunger: -3, state: 'sleep', message: 'Le refuge devient silencieux. Rien ne demande ton attention.' }
            };
            const cfg = actions[action];
            if (!cfg) return;

            this.modifyStat(cfg.stat, cfg.amount, false);
            if (cfg.mood) this.modifyStat('mood', cfg.mood, false);
            if (cfg.energy) this.modifyStat('energy', cfg.energy, false);
            if (cfg.hunger) this.modifyStat('hunger', cfg.hunger, false);
            this.updateEricState(cfg.state);
            this.setStatus(cfg.message);
            state.careMoments += 1;
            this.bond = Math.min(100, this.bond + 1);
            saveState();
            this.updateStatsDisplay();
            this.saveGameState();
        };

        Proto.petEric = function() {
            if (Date.now() - (this._lastPetAt || 0) < 700) return;
            this._lastPetAt = Date.now();
            this.modifyStat('mood', 3, false);
            this.bond = Math.min(100, this.bond + 1);
            state.careMoments += 1;
            this.setStatus('Éric ferme les yeux une seconde, puis revient se frotter contre ta main.');
            const stage = document.getElementById('ericIllustratedStage');
            stage?.classList.add('is-petted');
            window.ericAdventure?.setPose?.('happy', 900);
            setTimeout(() => stage?.classList.remove('is-petted'), 900);
            saveState();
            this.updateStatsDisplay();
            this.saveGameState();
        };

        Proto.registerDailyAction = function() {};

        Proto.awardProgress = function() {
            this.bond = Math.min(100, this.bond + 1);
            this.updateStatsDisplay();
            this.saveGameState();
        };

        Proto.applyOfflineProgress = function() {
            this.offlineMinutes = this.lastSavedAt ? Math.round(Math.max(0, (Date.now() - this.lastSavedAt) / 60000)) : 0;
        };

        Proto.showFirstRunTip = function() {
            requestAnimationFrame(() => {
                if (this.offlineMinutes > 10) this.setStatus('Éric était là. L’histoire reprend exactement où tu l’avais laissée.');
                else this.setStatus('Écoute la pièce avant de chercher à remplir les jauges.');
            });
        };

        Proto.startGameLoop = function() {
            if (this.loopId) clearInterval(this.loopId);
            this.loopId = setInterval(() => {
                const dashboard = document.getElementById('gamingDashboard');
                if (document.hidden || !dashboard?.classList.contains('active')) return;
                this.modifyStat('hunger', -0.25, false);
                this.modifyStat('energy', -0.12, false);
                this.checkCriticalConditions();
                this.saveGameState();
            }, 45000);
        };

        const originalStats = Proto.updateStatsDisplay;
        Proto.updateStatsDisplay = function() {
            originalStats.call(this);
            const level = document.getElementById('ericLevelDisplay');
            const coins = document.getElementById('ericCoinsDisplay');
            if (level) level.textContent = chapterNumber();
            if (coins) coins.textContent = currentCoins();
        };
    }
    function patchAdventure() {
        const Proto = window.EricAdventure?.prototype;
        if (!Proto || Proto.__directorPatched) return;
        Proto.__directorPatched = true;

        Proto.storyData = function() {
            return STORY;
        };

        Proto.roomLabel = function(room) {
            return ({ living: 'le refuge', kitchen: 'la cuisine', bedroom: 'le coin repos', garden: 'la terrasse' })[room] || 'la zone';
        };

        Proto.renderStory = function() {
            const card = this.container.querySelector('#adventureCard');
            const marker = this.container.querySelector('#adventureHotspot');
            if (!card || !marker) return;
            const story = STORY[this.step] || STORY[0];
            const roomMatches = story.room === this.game.currentRoom;
            const isFinal = this.step === STORY.length - 1;

            card.classList.remove('is-speaking');
            card.innerHTML = `
                <div class="eric-speaker director-objective-speaker">
                    <span class="speaker-mark">É</span>
                    <span><small>Éric</small><b>${story.eyebrow}</b></span>
                </div>
                <div class="director-objective-copy">
                    <h3>${story.title}</h3>
                </div>
                <button type="button" id="storyAction">${roomMatches ? story.action : `Rejoindre ${this.roomLabel(story.room)}`}</button>
            `;

            marker.hidden = !roomMatches || this.step === 0 || isFinal;
            marker.textContent = story.action;

            const storyAction = card.querySelector('#storyAction');
            storyAction.disabled = true;
            clearTimeout(this.storyReadyTimer);
            this.storyReadyTimer = setTimeout(() => { storyAction.disabled = false; }, 450);
            storyAction.onclick = () => {
                if (storyAction.disabled) return;
                if (isFinal) return this.resetStory();
                if (this.step === 0) return this.advance();
                if (!roomMatches) this.game.changeRoom(story.room);
                else this.advance();
            };
            marker.onclick = () => this.advance();
        };

        Proto.showEricLine = function(text, subject = 'Découverte') {
            const card = this.container.querySelector('#adventureCard');
            if (!card) return;
            clearTimeout(this.dialogueTimer);
            clearTimeout(this.storyReadyTimer);
            card.classList.add('is-speaking');
            card.innerHTML = `
                <div class="eric-speaker">
                    <span class="speaker-mark">É</span>
                    <span><small>Éric</small><b>${subject}</b></span>
                </div>
                <p class="director-discovery-line">${text}</p>
            `;
            this.dialogueTimer = setTimeout(() => this.renderStory(), 3600);
        };

        Proto.advance = function() {
            const current = this.step;
            if (current === 1 && !state.trials.frequency) {
                openTrial('frequency', () => this.advance());
                return;
            }
            if (current === 6 && !state.trials.constellations) {
                openTrial('constellations', () => this.advance());
                return;
            }

            const finalStep = STORY.length - 1;
            if (this.step < finalStep) this.step += 1;
            localStorage.setItem(STORY_KEY, String(this.step));
            state.storyStep = this.step;
            if (this.step > 0 && !state.rewardedSteps.includes(this.step)) {
                state.rewardedSteps.push(this.step);
                state.coins += 12;
            }

            if (this.step === finalStep) {
                state.finished = true;
                this.game.bond = Math.min(100, this.game.bond + 8);
                this.game.setStatus('Le signal continue en bas. Éric reste à côté de toi.');
                this.setPose('sit', 3200);
            } else {
                this.game.setStatus('Un nouvel indice est apparu.');
            }

            saveState();
            this.game.refreshRoomLocks();
            this.game.updateStatsDisplay();
            this.game.saveGameState();
            this.renderStory();
        };

        const originalReset = Proto.resetStory;
        Proto.resetStory = function() {
            state.finished = false;
            state.storyStep = 0;
            saveState();
            originalReset.call(this);
        };
    }

    function trialModal(title, subtitle) {
        document.querySelector('.director-trial-modal')?.remove();
        const previousFocus = document.activeElement;
        const modal = document.createElement('div');
        modal.className = 'director-trial-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'director-trial-title');
        modal.innerHTML = `
            <div class="director-trial-backdrop" data-trial-close></div>
            <section class="director-trial-dialog">
                <header>
                    <span class="director-kicker">Épreuve du signal</span>
                    <h2 id="director-trial-title">${title}</h2>
                    <p>${subtitle}</p>
                    <button type="button" class="director-trial-close" data-trial-close aria-label="Fermer"><i class="fas fa-times"></i></button>
                </header>
                <div class="director-trial-body"></div>
            </section>
        `;
        document.body.appendChild(modal);
        let onEscape = null;
        const closeModal = () => {
            modal.remove();
            if (onEscape) document.removeEventListener('keydown', onEscape);
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
        modal.querySelectorAll('[data-trial-close]').forEach(button => button.addEventListener('click', closeModal));
        onEscape = event => {
            if (event.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', onEscape);
        modal._directorClose = closeModal;
        modal.querySelector('.director-trial-close')?.focus();
        return modal;
    }

    function tone(frequency, duration = 0.14) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            window.__ericDirectorAudio ||= new AudioCtx();
            const ctx = window.__ericDirectorAudio;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = frequency;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration + 0.02);
        } catch {}
    }

    function completeTrial(id, modal, onComplete) {
        state.trials[id] = true;
        saveState();
        const body = modal.querySelector('.director-trial-body');
        body.innerHTML = '<div class="trial-complete"><i class="fas fa-check"></i><strong>Motif reconnu</strong><span>Ce souvenir est maintenant conservé dans le cabinet.</span></div>';
        setTimeout(() => {
            if (typeof modal._directorClose === 'function') modal._directorClose();
            else modal.remove();
            onComplete?.();
        }, 900);
    }
    function openFrequency(onComplete) {
        const modal = trialModal('Fréquence', 'Observe quatre bandes. Écoute leur ordre, puis reproduis le motif.');
        const body = modal.querySelector('.director-trial-body');
        const freqs = [196, 247, 294, 392];
        const sequence = [0, 2, 1, 3, 2];
        let input = [];
        let playing = false;

        body.innerHTML = `
            <div class="frequency-display">
                ${freqs.map((_, index) => `<button type="button" class="frequency-pad" data-frequency="${index}" aria-label="Bande ${index + 1}"><span></span><small>${index + 1}</small></button>`).join('')}
            </div>
            <div class="trial-instruction" aria-live="polite">Le signal attend.</div>
            <button type="button" class="director-primary-action" data-play-sequence>Écouter le motif</button>
        `;

        const pads = [...body.querySelectorAll('.frequency-pad')];
        const message = body.querySelector('.trial-instruction');

        function pulse(index, duration = 300) {
            pads[index].classList.add('is-active');
            tone(freqs[index]);
            setTimeout(() => pads[index]?.classList.remove('is-active'), duration);
        }

        async function playSequence() {
            if (playing) return;
            playing = true;
            input = [];
            message.textContent = 'Écoute.';
            for (const index of sequence) {
                pulse(index);
                await new Promise(resolve => setTimeout(resolve, 460));
            }
            playing = false;
            message.textContent = 'À toi.';
        }

        body.querySelector('[data-play-sequence]').addEventListener('click', playSequence);
        pads.forEach((pad, index) => {
            pad.addEventListener('click', () => {
                if (playing) return;
                pulse(index, 180);
                input.push(index);
                const pos = input.length - 1;
                if (input[pos] !== sequence[pos]) {
                    input = [];
                    message.textContent = 'Le motif s’est brisé. Réécoute, sans pénalité.';
                    return;
                }
                if (input.length === sequence.length) completeTrial('frequency', modal, onComplete);
            });
        });
    }

    function openConstellations(onComplete) {
        const modal = trialModal('Constellations', 'Retourne les six fenêtres et retrouve les trois pulsations jumelles.');
        const body = modal.querySelector('.director-trial-body');
        const symbols = ['ring', 'line', 'cross', 'ring', 'line', 'cross'];
        const order = [2, 0, 4, 1, 5, 3];
        let first = null;
        let locked = false;
        let matches = 0;

        body.innerHTML = `
            <div class="constellation-grid">
                ${order.map((sourceIndex, index) => `
                    <button type="button" class="constellation-card" data-symbol="${symbols[sourceIndex]}" data-index="${index}" aria-label="Fenêtre ${index + 1}">
                        <span class="constellation-back"></span>
                        <span class="constellation-symbol signal-${symbols[sourceIndex]}"></span>
                    </button>
                `).join('')}
            </div>
            <div class="trial-instruction" aria-live="polite">Trois paires. Aucun chronomètre.</div>
        `;

        const cards = [...body.querySelectorAll('.constellation-card')];
        cards.forEach(card => card.addEventListener('click', () => {
            if (locked || card.classList.contains('is-matched') || card === first) return;
            card.classList.add('is-open');
            tone(card.dataset.symbol === 'ring' ? 220 : card.dataset.symbol === 'line' ? 330 : 440, 0.09);
            if (!first) {
                first = card;
                return;
            }
            if (first.dataset.symbol === card.dataset.symbol) {
                first.classList.add('is-matched');
                card.classList.add('is-matched');
                first = null;
                matches += 1;
                if (matches === 3) completeTrial('constellations', modal, onComplete);
                return;
            }
            locked = true;
            const previous = first;
            first = null;
            setTimeout(() => {
                previous.classList.remove('is-open');
                card.classList.remove('is-open');
                locked = false;
            }, 650);
        }));
    }
    function openTrial(id, onComplete) {
        if (id === 'frequency') openFrequency(onComplete);
        if (id === 'constellations') openConstellations(onComplete);
    }

    function install() {
        applyChrome();
        patchEricGame();
        patchAdventure();

        if (!window.__ericDirectorRenderHooked && typeof window.renderTabContent === 'function') {
            const legacyRenderTabContent = window.renderTabContent;
            window.renderTabContent = function(tabId) {
                const container = document.getElementById('tab-' + tabId);
                if (container && window.ericDirectorCut?.renderTab(tabId, container)) return;
                return legacyRenderTabContent(tabId);
            };
            window.__ericDirectorRenderHooked = true;
        }

        window.addEventListener('storage', event => {
            if (event.key === STORAGE_KEY || event.key === STORY_KEY) {
                state = loadState();
            }
        });
    }

    window.ericDirectorCut = {
        renderTab,
        openTrial,
        purchase,
        getState: () => ({ ...state }),
        install,
        applyChrome
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
    else install();
})();