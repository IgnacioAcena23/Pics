import { getHomeCarousel, urlFor } from './sanityClient.js';

const sanityPromise = getHomeCarousel();
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

        if (heroTitleContainer) {
            const h1Title = homeData.welcomeTitle || "Welcome to";
            const h1Highlight = homeData.welcomeHighlight || "My Vision";
            heroTitleContainer.innerHTML = `${h1Title} <br><span class="highlight">${h1Highlight}</span>`;
        }

        if (homeData.scrambleText && window.initScrambleText) {
            window.initScrambleText(homeData.scrambleText);
        }

        const images = homeData.images || [];
        if (images.length === 0) return;

        const wrappers = sequenceContainer.querySelectorAll('.seq-img-wrapper');

        images.forEach((imgData, index) => {
            const imageUrl = imgData.asset ? urlFor(imgData.asset).width(1200).auto('format').url() : '';

            if (!imageUrl) return;

            const wrapper = wrappers[index] || (() => {
                const w = document.createElement('div');
                w.className = 'seq-img-wrapper';
                sequenceContainer.appendChild(w);
                return w;
            })();

            const img = document.createElement('img');
            img.alt = `Hero Image ${index + 1}`;
            img.className = 'seq-img';

            img.onload = () => {
                img.classList.add('seq-img-loaded');
            };

            img.src = imageUrl;
            wrapper.appendChild(img);
        });

        for (let i = images.length; i < wrappers.length; i++) {
            wrappers[i].remove();
        }
        const allAnimated = [sequenceContainer, ...wrappers];
        allAnimated.forEach(el => el.style.animation = 'none');

        if (window.initHeroAnimations) {
            window.initHeroAnimations();
        }

    } catch (error) {
        console.error("Error cargando el carrusel de home: ", error);
    }
});
