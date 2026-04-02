import { client, urlFor } from './sanityClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Detector universal de Slugs con diagnóstico
    const getSlug = () => {
        // Opción A: ?slug=nombre
        const urlParams = new URLSearchParams(window.location.search);
        const qSlug = urlParams.get('slug');
        if (qSlug) return qSlug;

        // Opción B: #slug=nombre
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hSlug = hashParams.get('slug');
        if (hSlug) return hSlug;

        // Opción C: #nombre (limpio)
        const hashRaw = window.location.hash.substring(1);
        if (hashRaw && !hashRaw.includes('=') && !hashRaw.includes('&')) return hashRaw;

        // Opción D: Salvaguarda "A prueba de fallos" desde la memoria del navegador (por si Render borró la URL)
        const memSlug = sessionStorage.getItem('activeProjectSlug');
        if (memSlug) return memSlug;

        return null;
    };

    const slug = getSlug();
    
    // Debug en consola para Render
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
        // Pedimos a Sanity todos los datos del proyecto cuyo 'slug' coincida con la URL
        const query = `*[_type == "eventType" && slug.current == "${slug}"][0]{
            name,
            description,
            gallery
        }`;

        const project = await client.fetch(query);

        if (!project) {
            document.getElementById('project-title').textContent = "El proyecto no existe";
            document.getElementById('project-description').textContent = "Parece que este proyecto fue eliminado o modificado en Sanity.";
            return;
        }

        // 1. Inyectamos el Título y la Descripción dinámicos
        const projectName = project.name || "Proyecto";
        const projectDesc = (project.description || "Portfolio de Armando Villegas.").substring(0, 160);
        
        document.title = `${projectName} - Villegas`;
        
        // Actualizar Meta Description dinámicamente para SEO
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', projectDesc);

        // Actualizar Open Graph para redes sociales
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${projectName} - Villegas`);

        document.getElementById('project-title').innerHTML = projectName;
        document.getElementById('project-description').innerHTML = project.description || "Sin descripción.";

        // 2. Inyectamos la Galería de Fotos/Videos
        const galleryContainer = document.getElementById('project-gallery');
        galleryContainer.innerHTML = ''; // Limpiamos la galería

        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach((media, index) => {
                const imageUrl = urlFor(media).width(1200).url(); // Pedimos imagenes de alta calidad

                // Si quieres que las fotos destaquen con estilos distintos, podemos intercalar la clase 'large' 
                // para la primera imagen o hacerlas todas iguales. Aquí hacemos la primera más grande:
                const isLarge = index === 0 ? "large" : "";

                const mediaHTML = `
                    <div class="media-item ${isLarge}">
                        <img src="${imageUrl}" alt="Foto de la galería de ${project.name}" />
                    </div>
                `;
                galleryContainer.insertAdjacentHTML('beforeend', mediaHTML);
            });
        } else {
            galleryContainer.innerHTML = '<p style="text-align:center; width:100%; color: var(--text-secondary);">No hay fotos disponibles en la galería de Sanity.</p>';
        }

    } catch (error) {
        console.error("Error cargando el proyecto:", error);
        document.getElementById('project-title').textContent = "Error de conexión";
        document.getElementById('project-description').textContent = "Hubo un problema comunicándose con Sanity.";
    }
});
