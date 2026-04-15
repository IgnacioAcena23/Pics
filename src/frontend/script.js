gsap.registerPlugin(ScrollTrigger);

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

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const logoLink = document.querySelector('a.logo[href^="#"]');

function updateActiveState(targetId) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
}

[...navLinks, logoLink].forEach(anchor => {
    if (!anchor) return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        lenis.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        updateActiveState(targetId);
    });
});

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

const sectionTitles = [
    { selector: "#about .about-title", trigger: "#about" },
    { selector: "#works .works-title", trigger: "#works" }
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

window.initScrambleText = function (newText) {
    const scrambleEl = document.getElementById("scramble-text");
    if (scrambleEl) {
        if (newText) scrambleEl.innerText = newText;
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
};

window.initScrambleText();

window.initHeroAnimations = function () {
    const seqImgs = document.querySelectorAll('.seq-img');
    const bgContainer = document.querySelector('.hero-image-sequence-bg');
    const wrappers = document.querySelectorAll('.seq-img-wrapper');

    // Desactivamos animaciones CSS para evitar que choquen con nuestro JS
    if (bgContainer) bgContainer.style.animation = 'none';
    wrappers.forEach(w => w.style.animation = 'none');

    gsap.set(seqImgs, { transformPerspective: 900, transformStyle: "preserve-3d", rotationX: 0, rotationY: 0, rotationZ: 0 });

    const xTos = [];
    const yTos = [];

    if (window._heroMouseMoveRef) {
        window.removeEventListener("mousemove", window._heroMouseMoveRef);
    }
    
    if (window._heroTicker) gsap.ticker.remove(window._heroTicker);
    if (window._heroDragRefs) {
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.removeEventListener("mousedown", window._heroDragRefs.down);
            heroSection.removeEventListener("touchstart", window._heroDragRefs.down);
        }
        window.removeEventListener("mousemove", window._heroDragRefs.move);
        window.removeEventListener("mouseup", window._heroDragRefs.up);
        window.removeEventListener("touchmove", window._heroDragRefs.move);
        window.removeEventListener("touchend", window._heroDragRefs.up);
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

        xTos.forEach((xTo) => xTo(xPos * 8));
        yTos.forEach((yTo) => yTo(-yPos * 8));
    };

    window.addEventListener("mousemove", window._heroMouseMoveRef);

    // NUEVO: Lógica de arrastre y rotación
    let currentRotation = window._heroRotAngle || 0;
    let autoRotateSpeed = 0.17; // Equivalent to 35s per rotation
    let isDragging = false;
    let dragStartX = 0;
    let dragVelocity = 0;

    window._heroTicker = () => {
        if (!isDragging) {
            if (Math.abs(dragVelocity) > 0.05) {
                dragVelocity *= 0.94; // friction
                currentRotation += dragVelocity;
            } else {
                currentRotation += autoRotateSpeed;
            }
        }
        
        window._heroRotAngle = currentRotation;

        if (bgContainer) {
            bgContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        }
        wrappers.forEach(w => {
            w.style.transform = `rotate(${-currentRotation}deg)`;
        });
    };
    
    gsap.ticker.add(window._heroTicker);

    const onDown = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        isDragging = true;
        dragStartX = clientX;
        dragVelocity = 0;
        
        if (bgContainer) document.body.style.cursor = 'grabbing';
        seqImgs.forEach(img => img.style.pointerEvents = 'none');
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const delta = clientX - dragStartX;
        dragStartX = clientX;
        dragVelocity = delta * 0.15; 
        currentRotation += dragVelocity;
    };

    const onUp = () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = '';
            seqImgs.forEach(img => img.style.pointerEvents = 'auto');
        }
    };

    window._heroDragRefs = { down: onDown, move: onMove, up: onUp };
    
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        
        heroSection.addEventListener("touchstart", onDown, {passive: true});
        window.addEventListener("touchmove", onMove, {passive: true});
        window.addEventListener("touchend", onUp);
    }
};
window.initHeroAnimations();

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