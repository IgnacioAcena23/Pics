import { getBrandsMarquee, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const trackContainer = document.getElementById('dynamic-brands-track');

    if (!trackContainer) return;

    try {
        const logos = await getBrandsMarquee();

        if (logos.length === 0) {
            console.log("No hay logos de marcas en Sanity.");
            return;
        }

        // 1. Limpiar el contenedor
        trackContainer.innerHTML = '';

        // 2. Crear el grupo de logos
        let groupHTML = '<div class="marquee-group">';
        logos.forEach((imgData, index) => {
            if (imgData.asset) {
                // Usamos 400px para calidad, pero el CSS controlará el tamaño visual
                const imageUrl = urlFor(imgData.asset).width(400).url();
                groupHTML += `<img src="${imageUrl}" alt="Marca ${index + 1}">`;
            }
        });
        groupHTML += '</div>';

        // 3. Inyectamos el contenido duplicado para el loop infinito
        trackContainer.innerHTML = groupHTML + groupHTML;

        // --- EL CAMBIO CLAVE PARA EL BUG DE SAFARI ---
        // Esperamos un momento a que el navegador "digiera" el nuevo HTML
        // y luego añadimos la clase que dispara la animación.
        setTimeout(() => {
            trackContainer.classList.add('is-animating');
        }, 100);

    } catch (error) {
        console.error("Error cargando los logos de marcas: ", error);
    }
});