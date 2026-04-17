import { createClient } from 'https://esm.sh/@sanity/client@6.10.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url@1.0.2'

export const client = createClient({
    projectId: 'hzboyqs4',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-03-31',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
    return builder.image(source)
}

export async function getEvents() {
    const query = `*[_type == "eventType"]{ 
        name, 
        subtitle, 
        "slug": slug.current, 
        image 
    }`
    const events = await client.fetch(query)
    return events
}

export async function getHomeCarousel() {
    const query = `*[_type == "homeCarousel"][0]{
        welcomeTitle,
        welcomeHighlight,
        scrambleText,
        images[]{
            "url": asset->url,
            asset
        }
    }`
    const result = await client.fetch(query)
    // Devolvemos todo el objeto para poder usar los textos y las imágenes
    return result || null
}

export async function getBrandsMarquee() {
    const query = `*[_type == "brandsMarquee"][0]{
        logos[]{
            "url": asset->url,
            asset
        }
    }`
    const result = await client.fetch(query)
    return result?.logos || []
}

export async function getAboutMe() {
    const query = `*[_type == "aboutMe"][0]{
        profileImage,
        aboutDescription,
        roleTitle
    }`
    const result = await client.fetch(query)
    return result || null
}
