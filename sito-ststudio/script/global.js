document.addEventListener("DOMContentLoaded", async function () {

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);
    
    const isEnglish = window.location.pathname.includes('/en/');
    const basePath = isEnglish ? '../' : '';
    const navbarFile = isEnglish ? 'components/navbar-en.html' : 'components/navbar-it.html';
    const footerFile = 'components/footer.html';

    const navbarContainer = document.getElementById("navbar-placeholder");
    if (navbarContainer) {
        try {
            const response = await fetch(basePath + navbarFile);
            if (!response.ok) throw new Error("Navbar non trovata");
            const html = await response.text();
            navbarContainer.innerHTML = html;            
            initMobileMenu();
            setActiveLink();
        } catch (error) {
            console.error("Errore caricamento navbar:", error);
        }
    }

    const footerContainer = document.getElementById("footer-placeholder");
    if (footerContainer) {
        try {
            const response = await fetch(basePath + footerFile);
            if (!response.ok) throw new Error("Footer non trovato");
            const html = await response.text();
            footerContainer.innerHTML = html;
        } catch (error) {
            console.error("Errore caricamento footer:", error);
        }
    }

    initPageTransitions();
});

function initPageTransitions() {
    // Seleziona tutti i link nella pagina
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            // Ignora se:
            // 1. È un link vuoto o nullo
            // 2. Apre in una nuova scheda (_blank)
            // 3. È un'ancora nella stessa pagina (#sezione)
            // 4. È un link esterno (inizia con http ma non è il nostro dominio - opzionale)
            if (!href || target === '_blank' || href.startsWith('#') || href.includes('mailto:') || href.includes('tel:')) {
                return; 
            }

            // SE È UN LINK INTERNO STANDARD:
            e.preventDefault(); // Blocca il cambio pagina immediato

            // Avvia il Fade Out
            document.body.classList.remove('loaded');

            // Aspetta che finisca la transizione (600ms come nel CSS) poi cambia pagina
            setTimeout(() => {
                window.location.href = href;
            }, 600); 
        });
    });
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.classList.add('loaded');
    }
});

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (menuBtn && menuOverlay) {
        const toggleMenu = () => {
            const isActive = menuOverlay.classList.contains('active');
            if (isActive) {
                menuOverlay.classList.remove('active');
                menuBtn.classList.remove('active');
                body.style.overflow = 'auto';
            } else {
                menuOverlay.classList.add('active');
                menuBtn.classList.add('active');
                body.style.overflow = 'hidden';
            }
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }
}

function setActiveLink() {
    // Ottieni il nome del file corrente (es. "services.html")
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const links = document.querySelectorAll('.navbar-item');
    
    links.forEach(link => {
        // Pulisce il link per il confronto
        const cleanLink = link.getAttribute('href').replace('../', '').replace('en/', '');
        
        // Rimuove la classe attiva da tutti preventivamente
        link.classList.remove('active');
        
        // Se corrisponde, aggiunge la classe .active
        if (cleanLink === currentPath) {
            link.classList.add('active');
        }
    });
}