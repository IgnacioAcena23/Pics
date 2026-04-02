import { getBrandsMarquee, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const trackContainer = document.getElementById('dynamic-brands-track');
    
    if (!trackContainer) return;

    try {
        const logos = await getBrandsMarquee();
        
        if (logos.length === 0) {
            console.log("No hay logos de marcas en Sanity.");
            // Si quieres puedes ocultar la sección entera aquí:
            // document.getElementById('brands').style.display = 'none';
            return;
        }

        // Limpiar el contenedor (por si acaso quedaba algo estático)
        trackContainer.innerHTML = '';

        // Para lograr el efecto de "loop infinito", necesitamos duplicar las imágenes
        // Crearemos un div de grupo que contenga todas las fotos, y lo repetiremos 2 veces.
        
        // Creamos el HTML del grupo base con todos los logos
        let groupHTML = '<div class="marquee-group">';
        logos.forEach((imgData, index) => {
            if (imgData.asset) {
                const imageUrl = urlFor(imgData.asset).width(400).url(); // 400px es suficiente para un logo
                groupHTML += `<img src="${imageUrl}" alt="Marca ${index + 1}">`;
            }
        });
        groupHTML += '</div>';

        // Inyectamos el grupo dos veces exactas en el track para que la animación CSS "marqueeScroll" fluya sin fin
        trackContainer.innerHTML = groupHTML + groupHTML;

    } catch (error) {
        console.error("Error cargando los logos de marcas: ", error);
    }
});
