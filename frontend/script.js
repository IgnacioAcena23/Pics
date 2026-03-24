// Registramos el plugin de ScrollTrigger al inicio
gsap.registerPlugin(ScrollTrigger);

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

// --- E) Animación Sobre Mí (Enlarging Title) ---
// Al bajar de Home a Sobre Mí, el título "Sobre mí" se agranda fluidamente
gsap.fromTo("#about .about-title",
    { scale: 0.8, opacity: 0, y: 50 },
    {
        scale: 1.3,
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%", // Inicia la animación cuando la parte superior de la sección está al 80% de la ventana
            end: "top 30%",   // Termina cuando llega al 30%
            scrub: 1          // Animación atada al scroll
        }
    }
);