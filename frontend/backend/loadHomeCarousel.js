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

        // Limpiar las imágenes estáticas actuales
        sequenceContainer.innerHTML = '';

        // Crear los nuevos elementos con las imágenes de Sanity
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

        // RE-INICIALIZAR ANIMACIONES DE MOUSE (Si es necesario, ya que las imágenes son dinámicas ahora)
        // NOTA: Como script.js se carga después, si el fetch es muy lento, las imágenes podrían no tener los listeners.
        // Se recomienda llamar a la lógica de animación después de cargar las fotos.
        if (window.initHeroAnimations) {
            window.initHeroAnimations();
        }

    } catch (error) {
        console.error("Error cargando el carrusel de home: ", error);
    }
});
