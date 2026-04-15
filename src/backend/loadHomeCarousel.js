import { getHomeCarousel, urlFor } from './sanityClient.js';

// 1. Lanzamos la petición a Sanity INMEDIATAMENTE (sin esperar DOMContentLoaded)
const sanityPromise = getHomeCarousel();

// 2. Cuando el DOM esté listo, inyectamos las imágenes y el texto
document.addEventListener('DOMContentLoaded', async () => {
    const sequenceContainer = document.querySelector('.hero-image-sequence-bg');
    const heroTitleContainer = document.querySelector('.hero-content h1');

    if (!sequenceContainer) return;

    try {
        const homeData = await sanityPromise;

        if (!homeData) {
            console.log("No hay datos para el carrusel de home en Sanity.");
            return;
        }

        // --- 1. Inyectar / Actualizar Textos ---
        if (heroTitleContainer) {
            const h1Title = homeData.welcomeTitle || "Welcome to";
            const h1Highlight = homeData.welcomeHighlight || "My Vision";
            heroTitleContainer.innerHTML = `${h1Title} <br><span class="highlight">${h1Highlight}</span>`;
        }

        if (homeData.scrambleText && window.initScrambleText) {
            window.initScrambleText(homeData.scrambleText);
        }

        // --- 2. Inyectar Carrusel de Imágenes ---
        const images = homeData.images || [];
        if (images.length === 0) return;

        // Obtener los wrappers existentes (los placeholders negros del HTML)
        const wrappers = sequenceContainer.querySelectorAll('.seq-img-wrapper');

        images.forEach((imgData, index) => {
            const imageUrl = imgData.asset ? urlFor(imgData.asset).width(1200).auto('format').url() : '';

            if (!imageUrl) return;

            // Reutilizar wrapper existente o crear uno nuevo si hay más imágenes que placeholders
            const wrapper = wrappers[index] || (() => {
                const w = document.createElement('div');
                w.className = 'seq-img-wrapper';
                sequenceContainer.appendChild(w);
                return w;
            })();

            const img = document.createElement('img');
            img.alt = `Hero Image ${index + 1}`;
            img.className = 'seq-img';

            // 3. Cuando la imagen esté COMPLETAMENTE descargada, la revelamos con fade-in
            img.onload = () => {
                img.classList.add('seq-img-loaded');
            };

            img.src = imageUrl;
            wrapper.appendChild(img);
        });

        // Si Sanity devuelve menos imágenes que placeholders, eliminar los sobrantes
        for (let i = images.length; i < wrappers.length; i++) {
            wrappers[i].remove();
        }

        // Aseguramos que las animaciones por CSS queden totalmente desactivadas
        // ya que la nueva lógica interactiva lo maneja completamente vía JS.
        const allAnimated = [sequenceContainer, ...wrappers];
        allAnimated.forEach(el => el.style.animation = 'none');
        
        if (window.initHeroAnimations) {
            window.initHeroAnimations();
        }

    } catch (error) {
        console.error("Error cargando el carrusel de home: ", error);
    }
});
