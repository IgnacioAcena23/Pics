import { client, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const getSlug = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const qSlug = urlParams.get('slug');
        if (qSlug) return qSlug;
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hSlug = hashParams.get('slug');
        if (hSlug) return hSlug;

        const hashRaw = window.location.hash.substring(1);
        if (hashRaw && !hashRaw.includes('=') && !hashRaw.includes('&')) return hashRaw;

        const memSlug = sessionStorage.getItem('activeProjectSlug');
        if (memSlug) return memSlug;

        return null;
    };

    const slug = getSlug();

    console.log("URL de búsqueda:", window.location.search);
    console.log("Hash de búsqueda:", window.location.hash);
    console.log("Slug procesado:", slug);

    if (!slug) {
        document.getElementById('project-title').textContent = "Proyecto no seleccionado";
        document.getElementById('project-description').textContent = "No detectamos un slug en la URL. Verifica que el enlace incluya '?slug=nombre'.";
        console.warn("No se detectó slug. URL actual:", window.location.href);
        return;
    }

    try {
        const query = `*[_type == "eventType" && slug.current == "${slug}"][0]{
            name,
            description,
            gallery[]{
                asset->{
                    _id,
                    url,
                    metadata {
                        dimensions {
                            width,
                            height,
                            aspectRatio
                        }
                    }
                }
            }
        }`;

        const project = await client.fetch(query);

        if (!project) {
            document.getElementById('project-title').textContent = "El proyecto no existe";
            document.getElementById('project-description').textContent = "Parece que este proyecto fue eliminado o modificado en Sanity.";
            return;
        }

        const projectName = project.name || "Proyecto";
        const projectDesc = (project.description || "Portfolio de Armando Villegas.").substring(0, 160);

        document.title = `${projectName} - Villegas`;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', projectDesc);

        document.getElementById('project-title').innerHTML = projectName;
        document.getElementById('project-description').innerHTML = project.description || "Sin descripción.";

        const galleryContainer = document.getElementById('project-gallery');
        galleryContainer.innerHTML = '';

        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach((imageObj, index) => {
                const asset = imageObj.asset;
                const imageUrl = asset ? urlFor(asset).width(1600).url() : '';
                const dimensions = asset?.metadata?.dimensions;

                let orientationClass = "horizontal";
                if (dimensions && dimensions.height > dimensions.width) {
                    orientationClass = "vertical";
                }

                const isLarge = (index === 0 && orientationClass !== "vertical") ? "large" : "";

                const mediaHTML = `
                    <div class="media-item ${isLarge} ${orientationClass}" data-full="${imageUrl}">
                        <img src="${imageUrl}" alt="Foto ${index + 1} - ${project.name}" loading="lazy" />
                        <div class="zoom-overlay">
                            <span>EXPLORE</span>
                        </div>
                    </div>
                `;
                galleryContainer.insertAdjacentHTML('beforeend', mediaHTML);
            });

            initLightbox();
        } else {
            galleryContainer.innerHTML = '<p style="text-align:center; width:100%; color: var(--text-secondary);">No hay fotos disponibles.</p>';
        }

    } catch (error) {
        console.error("Error cargando el proyecto:", error);
    }
});

function initLightbox() {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <img src="" alt="Zoomed view" id="lightbox-img">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        const overlay = lightbox.querySelector('.lightbox-overlay');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        const closeLightbox = () => lightbox.classList.remove('active');
        overlay.onclick = closeLightbox;
        closeBtn.onclick = closeLightbox;
    }

    const items = document.querySelectorAll('.media-item');
    const lightboxImg = document.getElementById('lightbox-img');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const fullUrl = item.getAttribute('data-full');
            lightboxImg.src = fullUrl;
            lightbox.classList.add('active');
        });
    });
}

