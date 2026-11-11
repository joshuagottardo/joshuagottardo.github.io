/**
 * MAIN.JS - Studio Eclettica
 * Refactored & Optimized
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTIONE PRELOADER (Priorità Alta) ---
    // Definiamo la funzione di chiusura per poterla chiamare in più casi
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Aggiunge la classe che lo fa svanire (gestito via CSS)
            preloader.classList.add('preloader-hidden');

            // Rimuoviamo l'elemento dal DOM dopo l'animazione per pulizia
            setTimeout(() => {
                // preloader.style.display = 'none'; // Opzionale, se vuoi rimuoverlo fisicamente
            }, 600);
        }
    };

    // Evento Principale: Quando tutto (immagini incluse) è caricato
    window.addEventListener('load', () => {
        // Ritardo estetico di 0.5s per mostrare il logo
        setTimeout(hidePreloader, 500);
    });
    setTimeout(hidePreloader, 3000);


    // --- 2. GESTIONE NAVBAR & SCROLL ---
    const header = document.querySelector('#main-header');
    const headerLogo = document.getElementById('header-logo');

    // Logo sempre visibile come in tutte le altre pagine
    if (headerLogo) {
        headerLogo.style.opacity = '1';
        headerLogo.style.pointerEvents = 'auto';
    }

    const handleScroll = () => {
        if (!header) return;

        // Gestione Sfondo Header allo scroll
        if (window.scrollY > 50) {
            header.style.background = '#000000';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    };

    if (header) {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }


    // --- 3. MOBILE MENU TOGGLE ---
    const burger = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burger && nav) {
        // Toggle Apertura/Chiusura
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');

            // Blocca lo scroll della pagina sotto il menu
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Chiudi il menu quando si clicca su un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }


    // --- 4. GRAFO / COSTELLAZIONE INTERATTIVA (HERO SECTION) ---
    const initConstellationHero = () => {
        const hero = document.getElementById('hero');
        const svg = document.getElementById('constellation-svg');
        const hub = document.getElementById('constellation-hub');
        const nodesContainer = document.getElementById('nodes-container');
        if (!hero || !svg || !hub || !nodesContainer) return;

        // Configurazione Nodi Desktop (disposizione asimmetrica, organica e sparsa orizzontale)
        const desktopConfigs = [
            { id: '1', pctX: 27, pctY: 24, depth: 0.035 }, // In alto a sinistra (ribassato per equilibrio armonico)
            { id: '2', pctX: 79, pctY: 33, depth: 0.038 }, // Centro-alto a destra (sfalsato in basso rispetto al nodo 1)
            { id: '3', pctX: 86, pctY: 66, depth: 0.024 }, // Satellite esterno basso a destra (solo interconnesso ai nodi)
            { id: '4', pctX: 62, pctY: 82, depth: 0.035 }, // In basso a destra del centro
            { id: '5', pctX: 37, pctY: 74, depth: 0.026 }, // In basso a sinistra (ponte satellite, non collegato all'hub)
            { id: '6', pctX: 13, pctY: 46, depth: 0.038 }  // Laterale esterno a sinistra (ampiezza orizzontale)
        ];

        // Configurazione Nodi Mobile (Costellazione Portrait verticale organica)
        const mobileConfigs = [
            { id: '1', pctX: 22, pctY: 22, depth: 0 },     // In alto a sinistra
            { id: '2', pctX: 78, pctY: 26, depth: 0 },     // In alto a destra
            { id: '3', pctX: 85, pctY: 52, depth: 0 },     // Satellite esterno a destra
            { id: '6', pctX: 15, pctY: 61, depth: 0 },     // Spostato in basso a sinistra per non coprire la frase centrale
            { id: '5', pctX: 28, pctY: 78, depth: 0 },     // In basso a sinistra
            { id: '4', pctX: 74, pctY: 83, depth: 0 }      // In basso a destra
        ];

        const getNodeConfigs = () => {
            return window.innerWidth <= 768 ? mobileConfigs : desktopConfigs;
        };

        // Definizione Connessioni: tutti i nodi collegati all'Hub con linee continue primarie
        const connections = [
            // Raggi continui primari dall'Hub verso ciascuno dei 6 nodi
            { id: 'hub-1', from: 'hub', to: '1', type: 'primary' },
            { id: 'hub-2', from: 'hub', to: '2', type: 'primary' },
            { id: 'hub-3', from: 'hub', to: '3', type: 'primary' },
            { id: 'hub-4', from: 'hub', to: '4', type: 'primary' },
            { id: 'hub-5', from: 'hub', to: '5', type: 'primary' },
            { id: 'hub-6', from: 'hub', to: '6', type: 'primary' },

            // Ramificazioni organiche tratteggiate secondarie tra nodi
            { id: 'net-1-6', from: '1', to: '6', type: 'secondary' },
            { id: 'net-6-5', from: '6', to: '5', type: 'secondary' },
            { id: 'net-2-3', from: '2', to: '3', type: 'secondary' },
            { id: 'net-3-4', from: '3', to: '4', type: 'secondary' }
        ];

        // Riferimenti DOM ai nodi
        const nodeElements = {};
        const nodeStates = {};

        ['1', '2', '3', '4', '5', '6'].forEach(id => {
            const el = document.getElementById(`node-${id}`);
            if (el) {
                nodeElements[id] = el;
                nodeStates[id] = {
                    currX: 0,
                    currY: 0,
                    targetX: 0,
                    targetY: 0,
                    x: 0,
                    y: 0
                };
            }
        });

        // Stato dell'Hub Centrale
        const hubState = {
            currX: 0,
            currY: 0,
            targetX: 0,
            targetY: 0,
            x: 0,
            y: 0,
            depth: 0.012
        };

        // Stato Spotlight Interattivo sulla Griglia Architettonica
        const spotlightState = {
            currX: 50,
            currY: 48,
            targetX: 50,
            targetY: 48
        };

        // Generazione elementi SVG <line>
        svg.innerHTML = '';
        const lineElements = {};

        connections.forEach(conn => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('id', `line-${conn.id}`);
            line.setAttribute('class', conn.type === 'primary' ? 'graph-line' : 'graph-line-secondary');
            svg.appendChild(line);
            lineElements[conn.id] = line;
        });

        // Inizializzazione posizioni base (responsive desktop e mobile)
        const setBasePositions = () => {
            const currentConfigs = getNodeConfigs();
            currentConfigs.forEach(cfg => {
                const el = nodeElements[cfg.id];
                if (el) {
                    el.style.left = `${cfg.pctX}%`;
                    el.style.top = `${cfg.pctY}%`;
                }
            });
        };
        setBasePositions();
        window.addEventListener('resize', setBasePositions);

        // Tracciamento Parallasse al Cursore Mouse su Desktop (Reattivo, NO fluttuazione in idle)
        let isHeroHovered = false;

        hero.addEventListener('mouseenter', () => {
            isHeroHovered = true;
        });

        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = hero.getBoundingClientRect();
            // Normalizzazione cursore da -1 a 1 rispetto al centro
            const mouseX = (e.clientX - rect.left) - (rect.width / 2);
            const mouseY = (e.clientY - rect.top) - (rect.height / 2);

            // Target Spotlight sulla griglia in percentuale
            spotlightState.targetX = ((e.clientX - rect.left) / rect.width) * 100;
            spotlightState.targetY = ((e.clientY - rect.top) / rect.height) * 100;

            // Calcolo target per hub centrale (minimo)
            hubState.targetX = mouseX * hubState.depth;
            hubState.targetY = mouseY * hubState.depth;

            // Calcolo target per ogni nodo in base alla profondità differenziata desktop
            desktopConfigs.forEach(cfg => {
                const state = nodeStates[cfg.id];
                if (state) {
                    state.targetX = mouseX * cfg.depth;
                    state.targetY = mouseY * cfg.depth;
                }
            });
        });

        hero.addEventListener('mouseleave', () => {
            isHeroHovered = false;
            // Ritorno morbido alla posizione neutrale quando si esce dalla Hero
            spotlightState.targetX = 50;
            spotlightState.targetY = 48;
            hubState.targetX = 0;
            hubState.targetY = 0;
            desktopConfigs.forEach(cfg => {
                const state = nodeStates[cfg.id];
                if (state) {
                    state.targetX = 0;
                    state.targetY = 0;
                }
            });

            // Reset focus mode e ripristino brand se il mouse esce dalla Hero
            if (typeof clearHeroFocus === 'function') {
                clearHeroFocus();
            }
        });

        // Loop di Animazione con LERP e Aggiornamento Linee SVG (Attivo sia su Desktop che Mobile)
        const lerpFactor = 0.08;

        const updatePositions = () => {
            const isMobile = window.innerWidth <= 768;
            const heroRect = hero.getBoundingClientRect();
            const hubRect = hub.getBoundingClientRect();

            if (!isMobile) {
                // Interpolazione Parallasse Hub
                hubState.currX += (hubState.targetX - hubState.currX) * lerpFactor;
                hubState.currY += (hubState.targetY - hubState.currY) * lerpFactor;
                hub.style.transform = `translate3d(calc(-50% + ${hubState.currX.toFixed(2)}px), calc(-50% + ${hubState.currY.toFixed(2)}px), 0)`;

                // Interpolazione Spotlight Griglia Blueprint
                spotlightState.currX += (spotlightState.targetX - spotlightState.currX) * 0.08;
                spotlightState.currY += (spotlightState.targetY - spotlightState.currY) * 0.08;
                hero.style.setProperty('--spotlight-x', `${spotlightState.currX.toFixed(2)}%`);
                hero.style.setProperty('--spotlight-y', `${spotlightState.currY.toFixed(2)}%`);
            } else {
                hub.style.transform = 'translate3d(-50%, -50%, 0)';
            }

            // Calcolo centro assoluto dell'Hub per ancoraggio linee SVG
            hubState.x = (hubRect.left + hubRect.width / 2) - heroRect.left;
            hubState.y = (hubRect.top + hubRect.height / 2) - heroRect.top;

            // Interpolazione / Posizionamento Nodi
            const currentConfigs = getNodeConfigs();
            currentConfigs.forEach(cfg => {
                const el = nodeElements[cfg.id];
                const state = nodeStates[cfg.id];
                if (el && state) {
                    if (!isMobile) {
                        state.currX += (state.targetX - state.currX) * lerpFactor;
                        state.currY += (state.targetY - state.currY) * lerpFactor;
                        el.style.transform = `translate3d(calc(-50% + ${state.currX.toFixed(2)}px), calc(-50% + ${state.currY.toFixed(2)}px), 0)`;
                    } else {
                        el.style.transform = 'translate3d(-50%, -50%, 0)';
                    }

                    // Coordinate assolute per il centro della bolla
                    const nodeRect = el.getBoundingClientRect();
                    state.x = (nodeRect.left + nodeRect.width / 2) - heroRect.left;
                    state.y = (nodeRect.top + nodeRect.height / 2) - heroRect.top;
                }
            });

            // Calcolo perimetro dell'edificio per non far passare le linee sotto l'edificio
            const hubBuilding = hub.querySelector('.hub-building-svg');
            const buildingRect = hubBuilding ? hubBuilding.getBoundingClientRect() : hubRect;
            const bCenterX = (buildingRect.left + buildingRect.width / 2) - heroRect.left;
            const bCenterY = (buildingRect.top + buildingRect.height / 2) - heroRect.top;
            const bHalfW = buildingRect.width / 2;
            const bHalfH = buildingRect.height / 2;

            // Aggiornamento coordinate linee SVG in tempo reale
            connections.forEach(conn => {
                const line = lineElements[conn.id];
                if (!line) return;

                let p1, p2;

                if (conn.from === 'hub') {
                    const targetNode = nodeStates[conn.to];
                    if (!targetNode) return;

                    // Calcolo punto di uscita dal perimetro dell'edificio
                    const dx = targetNode.x - bCenterX;
                    const dy = targetNode.y - bCenterY;
                    const dist = Math.hypot(dx, dy);

                    if (dist > 0.001) {
                        const ux = dx / dist;
                        const uy = dy / dist;
                        const scaleX = Math.abs(bHalfW / (ux || 0.0001));
                        const scaleY = Math.abs(bHalfH / (uy || 0.0001));
                        const scale = Math.min(scaleX, scaleY);
                        p1 = {
                            x: bCenterX + ux * (scale + 3),
                            y: bCenterY + uy * (scale + 3)
                        };
                    } else {
                        p1 = { x: bCenterX, y: bCenterY };
                    }
                    p2 = targetNode;
                } else if (conn.to === 'hub') {
                    const sourceNode = nodeStates[conn.from];
                    if (!sourceNode) return;

                    const dx = sourceNode.x - bCenterX;
                    const dy = sourceNode.y - bCenterY;
                    const dist = Math.hypot(dx, dy);

                    if (dist > 0.001) {
                        const ux = dx / dist;
                        const uy = dy / dist;
                        const scaleX = Math.abs(bHalfW / (ux || 0.0001));
                        const scaleY = Math.abs(bHalfH / (uy || 0.0001));
                        const scale = Math.min(scaleX, scaleY);
                        p2 = {
                            x: bCenterX + ux * (scale + 3),
                            y: bCenterY + uy * (scale + 3)
                        };
                    } else {
                        p2 = { x: bCenterX, y: bCenterY };
                    }
                    p1 = sourceNode;
                } else {
                    p1 = nodeStates[conn.from];
                    p2 = nodeStates[conn.to];
                }

                if (p1 && p2) {
                    line.setAttribute('x1', p1.x.toFixed(1));
                    line.setAttribute('y1', p1.y.toFixed(1));
                    line.setAttribute('x2', p2.x.toFixed(1));
                    line.setAttribute('y2', p2.y.toFixed(1));
                }
            });

            requestAnimationFrame(updatePositions);
        };
        requestAnimationFrame(updatePositions);

        // Gestione Macchina da Scrivere con Cancellazione da Tastiera (Backspace)
        const brandTextEl = document.getElementById('hero-logo-text') || document.getElementById('hero-logo');
        const brandLogoContainer = document.getElementById('hero-logo');
        const defaultBrandName = "STUDIO ECLETTICA";
        let activeFocusedId = null;
        let touchDismissTimer = null;

        const nodePhrases = {
            '1': 'Creativity is a feeling',
            '2': 'Design heritage',
            '3': 'From sketch to reality',
            '4': 'Market-aware products',
            '5': 'Material-driven innovation',
            '6': 'Open space, open design'
        };

        // Macchina a stati per cancellazione e digitazione a battuta
        let currentText = defaultBrandName;
        let targetText = defaultBrandName;
        let isProcessing = false;
        const deleteSpeed = 15; // Velocità di cancellazione backspace per carattere (ms)
        const typeSpeed = 25;   // Velocità di battitura per carattere (ms)
        const pauseBetween = 55; // Pausa a testo cancellato prima della nuova battitura (ms)

        const runBackspace = () => {
            if (brandLogoContainer) brandLogoContainer.classList.add('is-typing');

            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                if (brandTextEl) brandTextEl.textContent = currentText;
                setTimeout(runBackspace, deleteSpeed);
            } else {
                // Testo completamente cancellato: attendi e digita il nuovo testo
                setTimeout(runForwardTyping, pauseBetween);
            }
        };

        const runForwardTyping = () => {
            if (currentText.length < targetText.length) {
                currentText = targetText.slice(0, currentText.length + 1);
                if (brandTextEl) brandTextEl.textContent = currentText;
                setTimeout(runForwardTyping, typeSpeed);
            } else {
                // Raggiunta la lunghezza del target
                if (currentText !== targetText) {
                    // Se nel frattempo il target è cambiato, cancella di nuovo
                    runBackspace();
                } else {
                    isProcessing = false;
                    // Se siamo tornati a STUDIO ECLETTICA, rimuovi il cursore dopo una breve pausa
                    if (targetText === defaultBrandName) {
                        setTimeout(() => {
                            if (!isProcessing && targetText === defaultBrandName && brandLogoContainer) {
                                brandLogoContainer.classList.remove('is-typing');
                            }
                        }, 350);
                    }
                }
            }
        };

        const setTargetPhrase = (newTarget) => {
            if (targetText === newTarget) return;
            targetText = newTarget;

            if (!isProcessing) {
                isProcessing = true;
                runBackspace();
            }
        };

        // Gestione Focus Nodi (Desktop Hover + Mobile Touch)
        const clearHeroFocus = () => {
            if (touchDismissTimer) {
                clearTimeout(touchDismissTimer);
                touchDismissTimer = null;
            }

            if (activeFocusedId) {
                const prevEl = nodeElements[activeFocusedId];
                if (prevEl) {
                    prevEl.classList.remove('is-focused');
                    if (typeof prevEl.blur === 'function') prevEl.blur();
                }
                if (document.activeElement && typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
                activeFocusedId = null;
                hero.classList.remove('has-focus');

                connections.forEach(conn => {
                    const line = lineElements[conn.id];
                    if (line) line.classList.remove('is-active');
                });

                setTargetPhrase(defaultBrandName);
            }
        };

        const focusNode = (id, el, isTouch = false) => {
            if (touchDismissTimer) {
                clearTimeout(touchDismissTimer);
                touchDismissTimer = null;
            }

            if (activeFocusedId && activeFocusedId !== id) {
                const prevEl = nodeElements[activeFocusedId];
                if (prevEl) {
                    prevEl.classList.remove('is-focused');
                    if (typeof prevEl.blur === 'function') prevEl.blur();
                }
            }

            activeFocusedId = id;
            hero.classList.add('has-focus');
            el.classList.add('is-focused');

            connections.forEach(conn => {
                const line = lineElements[conn.id];
                if (!line) return;
                // Evidenzia SOLO le linee continue primarie verso l'hub centrale, MAI le linee tra nodi
                if (conn.type === 'primary' && (conn.from === id || conn.to === id)) {
                    line.classList.add('is-active');
                } else {
                    line.classList.remove('is-active');
                }
            });

            const phrase = el.dataset.phrase || nodePhrases[id];
            if (phrase) {
                setTargetPhrase(phrase.toUpperCase());
            }

            // Su dispositivi touch, auto-dismiss dopo 3.8s per garantire il tempo di lettura
            if (isTouch) {
                touchDismissTimer = setTimeout(() => {
                    clearHeroFocus();
                }, 3800);
            }
        };

        // Interazioni Eventi: Hover su Desktop, Tap Toggle su Touch
        ['1', '2', '3', '4', '5', '6'].forEach(id => {
            const el = nodeElements[id];
            if (!el) return;

            // Desktop Hover (solo mouse/trackpad di precisione)
            el.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    focusNode(id, el, false);
                }
            });

            el.addEventListener('mouseleave', () => {
                if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    clearHeroFocus();
                }
            });

            // Touch Tap: attiva la frase o la chiude al secondo tap
            el.addEventListener('touchend', (e) => {
                e.stopPropagation();
                if (activeFocusedId === id) {
                    clearHeroFocus();
                } else {
                    focusNode(id, el, true);
                }
            });
        });

        // Tap all'esterno (sfondo Hero o Hub) per chiudere il focus touch
        hero.addEventListener('touchend', (e) => {
            if (!e.target.closest('.constellation-node')) {
                clearHeroFocus();
            }
        }, { passive: true });

        // Dismiss automatico allo scorrimento per arrivare puliti alla sezione successiva
        window.addEventListener('scroll', () => {
            if (activeFocusedId && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                clearHeroFocus();
            }
        }, { passive: true });
    };

    // Avvio del grafo costellazione
    initConstellationHero();

    // --- 5. GESTIONE HASH ROUTING (JOURNAL) ---
    const checkHashRoute = () => {
        const gridSection = document.getElementById('journal-grid-section');
        const detailSection = document.getElementById('journal-detail-section');
        if (!gridSection || !detailSection) return;

        const hash = window.location.hash;

        if (hash && hash.startsWith('#articolo-')) {
            const articleId = hash.replace('#', '');
            const articleTemplate = document.getElementById(`template-${articleId}`);

            if (articleTemplate) {
                // Popola il dettaglio dell'articolo col template
                const contentArea = detailSection.querySelector('.article-content-target');
                if (contentArea) {
                    contentArea.innerHTML = articleTemplate.innerHTML;
                }

                // Nascondi la griglia e mostra l'articolo
                gridSection.classList.add('hidden-view');
                detailSection.classList.remove('hidden-view');

                // Scorri all'inizio della pagina
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        } else {
            // Mostra la griglia e nascondi l'articolo
            gridSection.classList.remove('hidden-view');
            detailSection.classList.add('hidden-view');
        }
    };

    // Ascolta i cambiamenti dell'hash nell'URL
    window.addEventListener('hashchange', checkHashRoute);

    // Esegui al caricamento della pagina per gestire link diretti
    checkHashRoute();

    // --- 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('is-revealed'));
        }
    }

    // --- 7. BARRA DI AVANZAMENTO LETTURA (JOURNAL) ---
    const progressBar = document.getElementById('reading-progress-bar');
    const updateProgressBar = () => {
        if (!progressBar) return;
        
        const detailSection = document.getElementById('journal-detail-section');
        const isDetailView = detailSection && !detailSection.classList.contains('hidden-view');
        
        if (isDetailView) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            progressBar.style.display = 'block';
        } else {
            progressBar.style.display = 'none';
        }
    };

    if (progressBar) {
        window.addEventListener('scroll', updateProgressBar);
        window.addEventListener('hashchange', updateProgressBar);
        updateProgressBar();
    }

    // --- 8. GLOW AMBIENTALE DINAMICO (CONCEPT & CONTATTI - Solo Desktop con Mouse) ---
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const glowCards = document.querySelectorAll('.service-card, .location-item');
        glowCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // --- 9. PARALLAX SCROLL ON HERO ELEMENTS (CONCEPT, CONTACTS & JOURNAL) ---
    const parallaxHeroes = document.querySelectorAll('.concept-page-hero, .contacts-page-hero');
    if (parallaxHeroes.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // Limit calculation to top view range (first 600px of scrolling)
            if (scrollTop < 600) {
                parallaxHeroes.forEach(hero => {
                    const title = hero.querySelector('.big-title');
                    const lead = hero.querySelector('.editorial-lead');
                    
                    if (title) {
                        // Title moves slightly down (creating visual depth) and fades out
                        title.style.transform = `translate3d(0, ${scrollTop * 0.25}px, 0)`;
                        title.style.opacity = `${Math.max(0, 1 - (scrollTop / 450))}`;
                    }
                    if (lead) {
                        // Lead moves slower than title and fades out faster
                        lead.style.transform = `translate3d(0, ${scrollTop * 0.12}px, 0)`;
                        lead.style.opacity = `${Math.max(0, 1 - (scrollTop / 350))}`;
                    }
                });
            }
        });
    }

    // --- 10. CURSORE PERSONALIZZATO LUXURY ATELIER ---
    const initCustomCursor = () => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        let dot = document.getElementById('cursor-dot');
        let ring = document.getElementById('cursor-ring');

        // Se gli elementi non sono presenti nell'HTML della pagina, vengono creati dinamicamente
        if (!dot) {
            dot = document.createElement('div');
            dot.className = 'custom-cursor-dot';
            dot.id = 'cursor-dot';
            dot.setAttribute('aria-hidden', 'true');
            document.body.appendChild(dot);
        }

        if (!ring) {
            ring = document.createElement('div');
            ring.className = 'custom-cursor-ring';
            ring.id = 'cursor-ring';
            ring.setAttribute('aria-hidden', 'true');
            document.body.appendChild(ring);
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let isVisible = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Il punto centrale di precisione segue istantaneamente a latenza zero
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            if (!isVisible) {
                isVisible = true;
                dot.style.opacity = '1';
                ring.style.opacity = '1';
            }
        });

        window.addEventListener('mouseleave', () => {
            isVisible = false;
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });

        window.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-active');
        });

        window.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-active');
        });

        // Hover detection intelligente su tutti gli elementi interattivi
        const interactiveSelectors = 'a, button, .constellation-node, .hero-scroll-indicator, input, textarea, select, [role="button"], .nav-toggle';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.remove('cursor-hover');
            }
        });

        // Loop di fisica fluida per l'anello esterno (Inerzia LERP a 60fps)
        const renderRing = () => {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderRing);
        };
        requestAnimationFrame(renderRing);
    };

    initCustomCursor();
});