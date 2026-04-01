import { createClient } from 'https://esm.sh/@sanity/client@6.10.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url@1.0.2'

export const client = createClient({
    projectId: 'hzboyqs4', // Tu ID de proyecto extraído de sanity.config.ts
    dataset: 'production',
    useCdn: false, // Desactivamos el CDN (false) para recibir cambios inmediatos al dar a "Publish"
    apiVersion: '2024-03-31', // Versión estable de la API
})

const builder = imageUrlBuilder(client)

// Función auxiliar para generar las URLs de las imágenes de Sanity
export function urlFor(source) {
    return builder.image(source)
}

// Función para obtener todos los eventos / proyectos
export async function getEvents() {
    // Definimos la consulta preguntando específicamente por el valor del slug
    const query = `*[_type == "eventType"]{ 
        name, 
        subtitle, 
        "slug": slug.current, 
        image 
    }`
    const events = await client.fetch(query)
    return events
}

// Función para obtener el carrusel del home
export async function getHomeCarousel() {
    const query = `*[_type == "homeCarousel"][0]{
        images[]{
            "url": asset->url,
            asset
        }
    }`
    const result = await client.fetch(query)
    return result?.images || []
}
