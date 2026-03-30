// Registramos los plugins de ScrollTrigger y ScrollToPlugin al inicio
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1. Configuración e Inicialización de Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de suavidad
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// 2. Sincronizar Lenis interno del scroll con GSAP ScrollTrigger
// Esto hace que las animaciones no tengan nada de "lag" o retraso
lenis.on('scroll', ScrollTrigger.update);

// Usar el requestAnimationFrame estándar del explorador es más seguro para la rueda del mouse
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- Navegación Activa Inteligente ---
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const logoLink = document.querySelector('a.logo[href^="#"]');

function updateActiveLink(targetId) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
}

[...navLinks, logoLink].forEach(anchor => {
    if (!anchor) return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        // Actualizar active inmediatamente al hacer clic
        updateActiveLink(targetId);

        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: targetId,
                autoKill: false
            },
            ease: "power3.inOut"
        });
    });
});

// Resaltado automático al hacer Scroll
navLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    const section = document.querySelector(targetId);
    if (section) {
        ScrollTrigger.create({
            trigger: section,
            start: "top 20%",
            end: "bottom 20%",
            onEnter: () => updateActiveLink(targetId),
            onEnterBack: () => updateActiveLink(targetId)
        });
    }
});

// ==========================================
// 3. ANIMACIONES CON GSAP Y SCROLLTRIGGER
// ==========================================

// --- A) Animación del Hero ---
// Al hacer scroll hacia abajo, el título del Hero se encoge y desaparece, con efecto parallax
gsap.to(".hero-title", {
    scale: 0.5,
    opacity: 0,
    y: -100, // Se mueve hacia arriba suavemente
    scrollTrigger: {
        trigger: ".hero",
        start: "top top", // Inicia cuando el .hero toca el tope
        end: "bottom top", // Termina cuando el final de .hero llega al tope
        scrub: 1, // 'scrub' asocia la animación a la posición exacta del scroll
    }
});

// --- B) Fade Up Stagger para los Cards de Features ---
// Esta animación no va con 'scrub', se dispara una vez y hace un bonito efecto escalonado
gsap.from(".feature-card", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // Cada tarjeta se anima con 0.2s de diferencia
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".features",
        start: "top 75%", // Se activa cuando la sección está al 75% del viewport de altura
        toggleActions: "play none none reverse" // Play al entrar, reversa al salir de nuevo
    }
});

// --- C) Pinning Horizontal Scroll ---
// Este es un efecto premium: La pantalla se pinea y en lugar de bajar, se mueve a los lados.
const horizontalContainer = document.querySelector(".horizontal-container");
if (horizontalContainer) {
    const panels = gsap.utils.toArray(".panel");

    gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-scroll",
            pin: true, // ¡Clave! 'Pinea' la sección a la pantalla hasta que acabe
            start: "top top",
            end: () => "+=" + horizontalContainer.offsetWidth, // Le da una distancia equivalente al ancho para escrollear
            scrub: 1, // Hace que actúe fluidamente atado al ratón
            invalidateOnRefresh: true // Recalcula si el usuario redimensiona la ventana
        }
    });
}

// --- D) Texto Extra Grande Parallax (Deep Dive) ---
// El texto enorme detrás hace zoom hacia nosotros al mover la rueda.
gsap.fromTo(".huge-text",
    { scale: 0.5, letterSpacing: "-10px" },
    {
        scale: 2,
        letterSpacing: "40px",
        scrollTrigger: {
            trigger: ".deep-dive",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    }
);

// --- E) Animaciones de Títulos de Sección (About, Works, Contact) ---
// Al bajar a cada sección, su título se agranda fluidamente desde un 80% al 100% de tamaño
const sectionTitles = [
    { selector: "#about .about-title", trigger: "#about" },
    { selector: "#works .works-title", trigger: "#works" },
    { selector: "#contact .contact-title", trigger: "#contact" }
];

sectionTitles.forEach(st => {
    gsap.fromTo(st.selector,
        { scale: 0.8, opacity: 0, y: 50 },
        {
            scale: 1.0,
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: st.trigger,
                start: "top 80%", // Inicia la animación al 80% de la ventana
                end: "top 30%",   // Termina al 30%
                scrub: 1          // Atado al scroll
            }
        }
    );
});
const scrambleEl = document.getElementById("scramble-text");
if (scrambleEl) {
    const finalStr = scrambleEl.innerText;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    // The blur fade-in takes 5.5s, starts fully revealing around 2.5s.
    gsap.to({ p: 0 }, {
        p: 1,
        duration: 4,
        delay: 0.8,
        ease: "none",
        onUpdate: function () {
            const progress = this.targets()[0].p;
            let result = "";
            for (let i = 0; i < finalStr.length; i++) {
                if (i < progress * finalStr.length) {
                    result += finalStr[i];
                } else {
                    result += finalStr[i] === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
                }
            }
            scrambleEl.innerText = result;
        }
    });
}
const seqImgs = document.querySelectorAll('.seq-img');
gsap.set(seqImgs, { transformPerspective: 900, transformStyle: "preserve-3d" });

const xTos = [];
const yTos = [];

seqImgs.forEach((img) => {
    xTos.push(gsap.quickTo(img, "rotationY", { ease: "power3", duration: 0.6 }));
    yTos.push(gsap.quickTo(img, "rotationX", { ease: "power3", duration: 0.6 }));

    // Hover scale effect
    img.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" }));
    img.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" }));
});

window.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    const xPos = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const yPos = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

    xTos.forEach((xTo) => xTo(xPos * 30));
    yTos.forEach((yTo) => yTo(-yPos * 30));
});

const slider = document.querySelector('.works-carousel');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador de velocidad de deslice

        if (Math.abs(walk) > 5) {
            isDragging = true;
        }

        slider.scrollLeft = scrollLeft - walk;
    });

    // Evitar que el clic abra la página si el usuario simplemente estaba arrastrando la galería
    const cards = document.querySelectorAll('.work-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });
}

// --- Navegación Inteligente (Scroll Spy) ---
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    // Detectamos qué seccion está en la pantalla principal
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute("id");
        }
    });

    // Asignamos la clase "active" al enlace correspondiente
    navItems.forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

// Aplicamos el cambio directo también al hacer click
navItems.forEach(link => {
    link.addEventListener('click', function () {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});