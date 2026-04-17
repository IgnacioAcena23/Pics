import { getAboutMe, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const aboutImageEl = document.getElementById('dynamic-about-image');
    const aboutDescEl = document.querySelector('.about-desc');
    const aboutRoleEl = document.querySelector('.about-role');

    try {
        const aboutData = await getAboutMe();

        if (aboutData) {
            // Actualizar la foto si existe
            if (aboutData.profileImage && aboutImageEl) {
                const imageUrl = urlFor(aboutData.profileImage).width(1000).auto('format').url();
                aboutImageEl.src = imageUrl;
            } else if (!aboutData.profileImage) {
                console.log("No hay foto configurada en el About Me de Sanity.");
            }

            // Actualizar la descripción si existe
            if (aboutData.aboutDescription && aboutDescEl) {
                aboutDescEl.textContent = aboutData.aboutDescription;
            }

            // Actualizar el título del cargo si existe
            if (aboutData.roleTitle && aboutRoleEl) {
                aboutRoleEl.textContent = aboutData.roleTitle;
            }
        }
    } catch (error) {
        console.error("Error cargando About me desde Sanity: ", error);
    }
});
