import { getHomeCarousel, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const sequenceContainer = document.querySelector('.hero-image-sequence-bg');

    if (!sequenceContainer) return;

    try {
        const images = await getHomeCarousel();

        if (images.length === 0) {
            console.log("No hay fotos para el carrusel de home en Sanity.");
            return;
        }

        sequenceContainer.innerHTML = '';

        images.forEach((imgData, index) => {
            const imageUrl = imgData.asset ? urlFor(imgData.asset).width(1200).url() : '';

            const wrapper = document.createElement('div');
            wrapper.className = 'seq-img-wrapper';

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Hero Image ${index + 1}`;
            img.className = 'seq-img';

            wrapper.appendChild(img);
            sequenceContainer.appendChild(wrapper);
        });

        sequenceContainer.style.animation = 'none';
        void sequenceContainer.offsetWidth;
        sequenceContainer.style.animation = '';
        if (window.initHeroAnimations) {
            window.initHeroAnimations();
        }

    } catch (error) {
        console.error("Error cargando el carrusel de home: ", error);
    }
});
