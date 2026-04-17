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

        trackContainer.innerHTML = '';

        let groupHTML = '<div class="marquee-group">';
        logos.forEach((imgData, index) => {
            if (imgData.asset) {
                const imageUrl = urlFor(imgData.asset).width(400).url();
                groupHTML += `<img src="${imageUrl}" alt="Marca ${index + 1}">`;
            }
        });
        groupHTML += '</div>';

        trackContainer.innerHTML = groupHTML + groupHTML;

        setTimeout(() => {
            trackContainer.classList.add('is-animating');
        }, 100);

    } catch (error) {
        console.error("Error cargando los logos de marcas: ", error);
    }
});