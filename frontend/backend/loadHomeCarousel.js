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

        /* 
        ¡AQUÍ ESTABA EL ERROR DE INCLINACIÓN!
        El contenedor principal (.hero-image-sequence-bg) empezaba a rotar en el momento que cargaba el HTML.
        Al inyectar las fotos 1 segundo después (por la espera de Sanity), su animación (counterRotate) arrancaba desfasada, 
        quedando permanentemente inclinadas X grados para compensar un ángulo distinto.
        Solución: Reiniciamos la animación del padre en el instante exacto que nacen las fotos hijas.
        */
        sequenceContainer.style.animation = 'none';
        void sequenceContainer.offsetWidth; // Forzamos un reflow (repintado) del navegador
        sequenceContainer.style.animation = ''; // Restauramos la animación. ¡Ambos parten de 0 sincronizados!

        // RE-INICIALIZAR ANIMACIONES DE MOUSE
        // NOTA: Como script.js se carga después, si el fetch es muy lento...
        // Se recomienda llamar a la lógica de animación después de cargar las fotos.
        if (window.initHeroAnimations) {
            window.initHeroAnimations();
        }

    } catch (error) {
        console.error("Error cargando el carrusel de home: ", error);
    }
});
