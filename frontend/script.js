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