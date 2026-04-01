import { createClient } from 'https://esm.sh/@sanity/client@6.10.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url@1.0.2'

export const client = createClient({
    projectId: 'hzboyqs4', // Tu ID de proyecto extraído de sanity.config.ts
    dataset: 'production',
    useCdn: true, // true para caché más rápida, false para que cargue los últimos cambios inmediatamente
    apiVersion: '2024-03-31', // Usa la fecha actual como versión de API
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
