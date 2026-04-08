import { getHomeCarousel, urlFor } from './sanityClient.js';

// 1. Lanzamos la petición a Sanity INMEDIATAMENTE (sin esperar DOMContentLoaded)
const sanityPromise = getHomeCarousel();

// 2. Cuando el DOM esté listo, inyectamos las imágenes
document.addEventListener('DOMContentLoaded', async () => {
    const sequenceContainer = document.querySelector('.hero-image-sequence-bg');

    if (!sequenceContainer) return;

    try {
        const images = await sanityPromise;

        if (images.length === 0) {
            console.log("No hay fotos para el carrusel de home en Sanity.");
            return;
        }

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

        // Reiniciar animaciones del hero si existen
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
