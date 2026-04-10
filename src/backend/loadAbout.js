import { getAboutMe, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const aboutImageEl = document.getElementById('dynamic-about-image');

    if (!aboutImageEl) return;

    try {
        const aboutData = await getAboutMe();

        if (aboutData && aboutData.profileImage) {
            // Genera la URL con un buen tamaño y auto-optimización
            const imageUrl = urlFor(aboutData.profileImage).width(1000).auto('format').url();
            aboutImageEl.src = imageUrl;
        } else {
            console.log("No hay foto configurada en el About Me de Sanity.");
        }
    } catch (error) {
        console.error("Error cargando la foto de About me desde Sanity: ", error);
    }
});
