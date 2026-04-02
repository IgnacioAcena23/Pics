import { getEvents, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const carouselContainer = document.querySelector('.works-carousel');

    // Si no se encuentra el contenedor, detenemos el script
    if (!carouselContainer) return;

    try {
        const works = await getEvents();

        if (works.length === 0) {
            console.log("No hay proyectos en Sanity.");
            return;
        }

        // Limpieza ultra-agresiva
        carouselContainer.innerHTML = '';

        works.forEach((work, index) => {
            const imageUrl = work.image ? urlFor(work.image).width(800).url() : '';
            const nombre = work.name || 'Proyecto sin nombre';
            const subtitulo = work.subtitle || 'Fotografía';
            const slugFinal = (typeof work.slug === 'string') ? work.slug : (work.slug?.current || "");

            // Crear la tarjeta
            const workCard = document.createElement('a'); // Volvemos al tag <a> para SEO y UX
            // Dejamos el enlace con ?slug por si el usuario lo abre en nueva pestaña
            workCard.href = `proyecto.html?slug=${slugFinal}`;
            workCard.className = 'work-card dynamic-card';
            workCard.style.animationDelay = `${2.4 + (index * 0.2)}s`;

            workCard.innerHTML = `
                <img src="${imageUrl}" alt="${nombre}" />
                <div class="work-info">
                    <h3>${nombre}</h3>
                    <p>${subtitulo}</p>
                </div>
            `;

            // Diagnóstico de click y Salvaguarda
            workCard.addEventListener('click', (e) => {
                if (!slugFinal) {
                    e.preventDefault();
                    return;
                }
                
                // MODO SEGURO: Guardamos el slug en la memoria del navegador. 
                // Así sobrevive sin importar lo que el servidor de Render haga con la URL.
                sessionStorage.setItem('activeProjectSlug', slugFinal);
            });

            carouselContainer.appendChild(workCard);
        });

    } catch (error) {
        console.error("Error cargando los proyectos desde Sanity: ", error);
    }
});
