// --- 0. CURSOR ANIMATION LOGIC ---
function initCustomCursor() {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (!cursorDot || !cursorOutline) return;

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    gsap.to(cursorOutline, {
      x: posX,
      y: posY,
      duration: 0.25,
      ease: "power2.out",
    });
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .btn, .social-link, .lang-btn"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering");
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering");
    });
  });
}

/* =========================================
   1. TRANSLATIONS (i18n)
   ========================================= */
const translations = {
  it: {
    hero_greeting: "Ciao, sono",
    hero_desc: "Studente di Ingegneria Informatica e appassionato sviluppatore",
    btn_projects: "Vedi Progetti",
    download_cv: "Scarica CV",
    scroll_text: "Scorri",

    // About
    about_title_1: "Chi Sono",
    about_text_1:
      "Sono una persona curiosa e versatile, capace di fare da ponte tra il mondo tecnico e quello decisionale, portando ordine e struttura ovunque serva.",
    about_title_2: "Approccio analitico, visione d'insieme",
    about_text_2:
      "La mia formazione tecnica mi ha insegnato il rigore: come scomporre problemi complessi, analizzare dati e ottimizzare processi. Il mio obiettivo è capire le regole del gioco e trovare la soluzione più efficiente.",
    about_title_3: "Visione 360°",
    about_text_3:
      "La mia vera forza è la versatilità mentale. Non mi limito a un singolo dominio: analizzo il contesto, apprendo rapidamente le logiche del settore e le traduco in soluzioni efficienti. <br /> Un giorno voglio poter affermare di parlare la lingua degli sviluppatori e quella dei manager.",

    // Skills
    skills_title: "Il mio Arsenale.",
    skills_text: "Competenze tecniche e trasversali",
    skills_scroll: "Scorri &rarr;",

    // Skill Cards
    skill_card_1_title: "Metodo & Analisi",
    skill_card_1_desc:
      "Il mio valore aggiunto risiede nel come affronto i problemi",
    skill_card_1_1: "Analisi dati e Interpretazione",
    skill_card_1_2: "Problem Solving",
    skill_card_1_3: "Modellazione Matematica",
    skill_card_1_4: "Ottimizzazione dei Processi",
    skill_card_1_5: "Pensiero Critico",

    skill_digital_title: "Competenze Digitali",
    skill_digital_desc: "Tecnologie e strumenti che padroneggio.",

    skill_list_title: "Interessi",
    skill_list_desc:
      "Ambiti in cui applico le mie competenze o per cui ho particolare interesse",
    skill_list_1: "Matematica Applicata",
    skill_list_2: "Fintech",
    skill_list_3: "Intelligenza Artificiale",
    skill_list_4: "Geopolitica",
    skill_list_5: "Filosofia ed Etica Digitale",

    // Projects
    projects_title: "I Miei Progetti",
    proj_1_title: "Studio Eclettica System",
    proj_1_desc:
      "Ecosistema digitale per la gestione di un uffico calzaturiero. Oltre al tracking dell'inventario, integra una dashboard di <strong>Business Intelligence</strong> e moduli <strong>AI</strong> per ridurre i tempi impiegati nelle classiche operazioni di gestione dell'inventario.",

    proj_2_title: "Resell Vault & Analytics",
    proj_2_desc:
      "Applicazione cross-platform per ottimizzare il flusso di vendita nel mercato dell'usato. Traccia l'intero ciclo di vita dell'asset: dall'acquisizione alla vendita, calcolando automaticamente <strong>margini netti</strong>, consigli su prezzi di vendita e ROI per ogni piattaforma utilizzata.",

    proj_3_title: "ST Studio Milano",
    proj_3_desc:
      "Non solo una vetrina, ma un asset digitale per il posizionamento del brand sui mercati internazionali. Focalizzato su architettura SEO-friendly per massimizzare la conversione dei visitatori in lead qualificati.",
    visit_site: "Visita il Sito",

    // Footer
    footer_title: "Costruiamo qualcosa<br/>di notevole.",
    footer_desc:
      "Sono sempre alla ricerca di sfide che mi facciano scoprire qualcosa di nuovo.",
  },
  en: {
    hero_greeting: "Hi, I'm",
    hero_desc: "Computer Engineering student and a passionate developer",
    btn_projects: "View Projects",
    download_cv: "Download Resume",
    scroll_text: "Scroll",

    // About
    about_title_1: "About Me",
    about_text_1:
      "I'm a curious and versatile person, able to bridge the gap between the technical world and the decision-making one, bringing order and structure wherever they’re needed.",
    about_title_2: "Analytical Mindset, Holistic View",
    about_text_2:
      "My technical background instilled discipline in me: how to decompose complex problems, analyze data, and optimize processes. My goal is to understand the 'rules of the game' and engineer the most efficient solution.",
    about_title_3: "360° Vision",
    about_text_3:
      "My true strength is mental versatility. I don't limit myself to a single domain: I analyze the context, quickly grasp industry dynamics, and translate them into efficient solutions. <br /> My goal is to bridge the gap, speaking both the language of developers and that of managers.",

    // Skills
    skills_title: "My Arsenal.",
    skills_text: "Technical and Soft Skills",
    skills_scroll: "Scroll &rarr;",

    // Skill Cards
    skill_card_1_title: "Method & Analysis",
    skill_card_1_desc: "My added value lies in how I approach problems.",
    skill_card_1_1: "Data Analysis & Interpretation",
    skill_card_1_2: "Problem Solving",
    skill_card_1_3: "Mathematical Modeling",
    skill_card_1_4: "Process Optimization",
    skill_card_1_5: "Critical Thinking",

    skill_digital_title: "Digital Skills",
    skill_digital_desc: "Technologies and tools I master.",

    skill_list_title: "Interests",
    skill_list_desc:
      "Fields where I apply my skills and areas of personal interest.",
    skill_list_1: "Applied Mathematics",
    skill_list_2: "Fintech",
    skill_list_3: "Artificial Intelligence",
    skill_list_4: "Geopolitics",
    skill_list_5: "Philosophy & Digital Ethics",

    // Projects
    projects_title: "My Projects",
    proj_1_title: "Studio Eclettica System",
    proj_1_desc:
      "Digital ecosystem for footwear office management. Beyond inventory tracking, it integrates a <strong>Business Intelligence</strong> dashboard and <strong>AI</strong> modules to drastically reduce time spent on routine inventory operations.",

    proj_2_title: "Resell Vault & Analytics",
    proj_2_desc:
      "Cross-platform app to optimize workflows in the resale market. It tracks the entire asset lifecycle: from sourcing to sale, automatically calculating <strong>net margins</strong>, recommended selling prices, and ROI for each platform.",

    proj_3_title: "ST Studio Milano",
    proj_3_desc:
      "Not just a showcase, but a digital asset for international brand positioning. Focused on an SEO-friendly architecture to maximize converting visitors into qualified leads.",
    visit_site: "Visit Website",

    // Footer
    footer_title: "Let's build something<br/>remarkable.",
    footer_desc:
      "I am always looking for challenges that drive me to discover something new.",
  },
};

/* =========================================
   2. LANGUAGE SWITCHER LOGIC
   ========================================= */
function setLanguage(lang) {
  // 1. Aggiorna testi
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // 2. Aggiorna stato bottoni
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (
      btn.getAttribute("onclick") &&
      btn.getAttribute("onclick").includes(lang)
    ) {
      btn.classList.add("active");
    }
  });

  ScrollTrigger.refresh();
}

/* =========================================
   3. ANIMATIONS (GSAP)
   ========================================= */

// Registrazione Plugin
gsap.registerPlugin(ScrollTrigger);

// --- HERO SECTION ---
function initHero() {
  const heroWrapper = document.querySelector("#hero");
  const tiltCard = document.querySelector("#tilt-card");

  if (!heroWrapper || !tiltCard) return;

  gsap.set("#tilt-card", {
    transformPerspective: 1000,
    transformStyle: "preserve-3d",
  });

  const safeMotion = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;

  if (safeMotion) {
    heroWrapper.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      gsap.to(tiltCard, {
        rotationX: ((mouseY - centerY) / 50).toFixed(2),
        rotationY: ((centerX - mouseX) / 50).toFixed(2),
        scale: 1.01,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    heroWrapper.addEventListener("mouseleave", () => {
      gsap.to(tiltCard, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    });
  }

  // Entrance Animation
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(".hero-card", { visibility: "visible" });

  tl.from(".hero-card", { y: 60, opacity: 0, duration: 1.4 })
    .from(".eyebrow", { opacity: 0, y: 10, duration: 0.8 }, "-=1")
    .from(".hero-title", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
    .from(".hero-description", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
    .from(".cta-group", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
    .from(".top-nav", { opacity: 0, y: -20, duration: 1 }, "-=1.2")
    .to(".hero-scroll", { opacity: 1, duration: 1 }, "-=0.5");
}

// --- ABOUT SECTION ---
function initAbout() {
  const textBlocks = gsap.utils.toArray(".reveal-text");

  if (textBlocks.length > 0) {
    textBlocks.forEach((text) => {
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.1,
        scrollTrigger: {
          trigger: text,
          start: "top 65%",
          end: "top 35%",
          toggleActions: "play reverse play reverse",
        },
      });
    });
  }

  const imageWrapper = document.querySelector(".image-wrapper");
  if (imageWrapper) {
    gsap.from(".image-wrapper", {
      scrollTrigger: { trigger: "#about", start: "top 80%" },
      scale: 0.9,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
    });
  }
}

// --- SKILLS SECTION (Horizontal Scroll) ---
function initHorizontalSkills() {
  const skillsSection = document.querySelector("#skills");
  const skillsWrapper = document.querySelector(".skills-wrapper");

  if (!skillsSection || !skillsWrapper) return;

  ScrollTrigger.getAll().forEach((t) => {
    if (t.trigger === skillsSection || t.trigger === skillsWrapper) t.kill();
  });

  const existingSpacer = document.querySelector("#_skills_spacer");
  if (existingSpacer) existingSpacer.remove();

  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      const full = skillsWrapper.scrollWidth;
      const viewport = window.innerWidth;
      const moveDist = Math.max(0, full - viewport);

      if (moveDist <= 0) {
        gsap.set(skillsWrapper, { x: 0 });
        return;
      }

      const spacer = document.createElement("div");
      spacer.id = "_skills_spacer";
      spacer.style.width = "1px";
      spacer.style.height = window.innerHeight + moveDist + "px";
      spacer.style.opacity = "0";
      skillsSection.insertAdjacentElement("afterend", spacer);

      ScrollTrigger.create({
        trigger: "#skills",
        start: "top top",
        end: () => "+=" + (window.innerHeight + moveDist),
        scrub: 1,
        pin: true,
        onUpdate(self) {
          const prog = self.progress;
          const x = -prog * moveDist;
          gsap.set(skillsWrapper, { x });
        },
      });
    },

    // Mobile logic
    "(max-width: 900px)": function () {
      gsap.set(skillsWrapper, { clearProps: "all" });
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const existingSpacer = document.querySelector("#_skills_spacer");
      if (existingSpacer) existingSpacer.remove();

      skillsSection.style.overflowX = "auto";
      skillsSection.style.height = "auto";
    },
  });
}

/* =========================================
   4. INITIALIZATION
   ========================================= */
window.addEventListener("load", () => {
  initHero();
  initAbout();
  initHorizontalSkills();
  initCustomCursor();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initHorizontalSkills();
      ScrollTrigger.refresh();
    }, 150);
  });
});