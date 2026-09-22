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
    const hasHeroLogo = document.getElementById('hero-logo') !== null;

    const handleScroll = () => {
        if (!header) return;

        // Gestione Sfondo Header allo scroll
        if (window.scrollY > 50) {
            header.style.background = '#000000';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }

        // Dissolvenza del Logo in Navbar sulla Home Page (solo quando la Hero è fuori vista)
        if (hasHeroLogo && headerLogo) {
            const threshold = window.innerHeight - 80;
            if (window.scrollY >= threshold) {
                headerLogo.style.opacity = '1';
                headerLogo.style.pointerEvents = 'auto';
            } else {
                headerLogo.style.opacity = '0';
                headerLogo.style.pointerEvents = 'none';
            }
        } else if (headerLogo) {
            // Sulle altre pagine il logo è visibile da subito
            headerLogo.style.opacity = '1';
            headerLogo.style.pointerEvents = 'auto';
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


    // --- 4. LOGICA TORCIA & RIVELAZIONE SCARPE (Solo in Home) ---
    const torch = document.getElementById('torch');
    const hero = document.querySelector('.hero-spotlight');
    const revealContainer = document.getElementById('reveal-container');
    const revealImages = document.querySelectorAll('.reveal-image');

    // Eseguiamo questo blocco SOLO se gli elementi esistono
    if (torch && hero) {

        // Variabili di stato
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let torchX = window.innerWidth / 2;
        let torchY = window.innerHeight / 2;
        let currentRadius = 175;

        let isUserMoving = false;
        let idleTimer;

        // A. Tracciamento Mouse (Solo Desktop)
        hero.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isUserMoving = true;

            // Timeout inattività: torna automatico dopo 2 sec
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isUserMoving = false; }, 2000);
        });

        // B. Effetto Click per ingrandimento torcia
        hero.addEventListener('mousedown', () => torch.classList.add('active'));
        hero.addEventListener('mouseup', () => torch.classList.remove('active'));



        // D. Loop di Animazione
        const animate = () => {
            if (!isUserMoving) {
                // Movimento Automatico (Figura a 8)
                const time = Date.now() * 0.001;
                const amplitudeX = window.innerWidth * 0.25;
                const amplitudeY = window.innerHeight * 0.25;

                mouseX = (window.innerWidth / 2) + Math.cos(time * 0.8) * amplitudeX;
                mouseY = (window.innerHeight / 2) + Math.sin(time * 1.2) * amplitudeY;
            }

            // Misuriamo la dimensione effettiva impostata nel CSS (cambia su mobile o in stato .active)
            const currentTorchWidth = torch.offsetWidth || 350;
            const targetRadius = currentTorchWidth / 2;

            // Interpolazione (Movimento e raggio fluidi)
            torchX += (mouseX - torchX) * 0.1;
            torchY += (mouseY - torchY) * 0.1;
            currentRadius += (targetRadius - currentRadius) * 0.1;

            torch.style.left = torchX + 'px';
            torch.style.top = torchY + 'px';

            if (revealContainer) {
                revealContainer.style.clipPath = `circle(${currentRadius}px at ${torchX}px ${torchY}px)`;
            }

            requestAnimationFrame(animate);
        };

        // Avvio Loop
        animate();
    }

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

    // --- 8. GLOW AMBIENTALE DINAMICO (CONCEPT & CONTATTI) ---
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
});