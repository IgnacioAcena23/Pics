// 1. Inicialización de GSAP y Plugins
gsap.registerPlugin(ScrollTrigger);

// 2. Inicialización de Lenis (Smooth Scroll Premium)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrar Lenis con ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Forzar inicio arriba
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- Navegación Activa Inteligente ---
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const logoLink = document.querySelector('a.logo[href^="#"]');

function updateActiveState(targetId) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
}

// Click handling para NavLinks y Logo
[...navLinks, logoLink].forEach(anchor => {
    if (!anchor) return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Usar Lenis para el scroll suave
        lenis.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        // Actualizar active inmediatamente
        updateActiveState(targetId);
    });
});

// Scroll Spy robusto con ScrollTrigger
navLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    const section = document.querySelector(targetId);
    if (section) {
        ScrollTrigger.create({
            trigger: section,
            start: "top 25%",
            end: "bottom 25%",
            onEnter: () => updateActiveState(targetId),
            onEnterBack: () => updateActiveState(targetId),
        });
    }
});

// ==========================================
// 3. ANIMACIONES CON GSAP Y SCROLLTRIGGER
// ==========================================

// --- A) Animación del Hero ---
gsap.to(".hero-content h1", {
    scale: 0.5,
    opacity: 0,
    y: -100,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
    }
});

// --- B) Animaciones de Títulos de Sección ---
const sectionTitles = [
    { selector: "#about .about-title", trigger: "#about" },
    { selector: "#works .works-title", trigger: "#works" },
    { selector: "#contact .footer-title", trigger: "#contact" }
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
                start: "top 85%", 
                end: "top 40%",   
                scrub: 1         
            }
        }
    );
});

// --- C) Animación Scramble Text ---
const scrambleEl = document.getElementById("scramble-text");
if (scrambleEl) {
    const finalStr = scrambleEl.innerText;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    gsap.to({ p: 0 }, {
        p: 1,
        duration: 5,
        delay: 0,
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

// --- D) Hero Image Sequence Parallax ---
window.initHeroAnimations = function() {
    const seqImgs = document.querySelectorAll('.seq-img');
    gsap.set(seqImgs, { transformPerspective: 900, transformStyle: "preserve-3d", rotationX: 0, rotationY: 0, rotationZ: 0 });

    const xTos = [];
    const yTos = [];

    if (window._heroMouseMoveRef) {
        window.removeEventListener("mousemove", window._heroMouseMoveRef);
    }

    seqImgs.forEach((img) => {
        xTos.push(gsap.quickTo(img, "rotationY", { ease: "power3", duration: 0.6 }));
        yTos.push(gsap.quickTo(img, "rotationX", { ease: "power3", duration: 0.6 }));

        img.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" }));
        img.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" }));
    });

    window._heroMouseMoveRef = (e) => {
        const { innerWidth, innerHeight } = window;
        const xPos = (e.clientX / innerWidth - 0.5) * 2; 
        const yPos = (e.clientY / innerHeight - 0.5) * 2; 

        xTos.forEach((xTo) => xTo(xPos * 30));
        yTos.forEach((yTo) => yTo(-yPos * 30));
    };

    window.addEventListener("mousemove", window._heroMouseMoveRef);
};
window.initHeroAnimations();

// --- E) Galería Horizontal (Works) ---
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
        const walk = (x - startX) * 2; 

        if (Math.abs(walk) > 5) {
            isDragging = true;
        }

        slider.scrollLeft = scrollLeft - walk;
    });

    // Botones de navegación (Flechas)
    const prevBtn = document.querySelector('.scroll-prev-btn');
    const nextBtn = document.querySelector('.scroll-next-btn');

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const card = slider.querySelector('.work-card');
            const gap = parseInt(getComputedStyle(slider).gap) || 40;
            const step = card ? card.offsetWidth + gap : 440;
            const target = Math.floor((slider.scrollLeft + step + 10) / step) * step;

            gsap.to(slider, {
                scrollLeft: target,
                duration: 0.8,
                ease: "expo.out",
                overwrite: true
            });
        });

        prevBtn.addEventListener('click', () => {
            const card = slider.querySelector('.work-card');
            const gap = parseInt(getComputedStyle(slider).gap) || 40;
            const step = card ? card.offsetWidth + gap : 440;
            const target = Math.ceil((slider.scrollLeft - step - 10) / step) * step;

            gsap.to(slider, {
                scrollLeft: target,
                duration: 0.8,
                ease: "expo.out",
                overwrite: true
            });
        });
    }

    slider.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}