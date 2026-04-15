import { defineField, defineType } from "sanity";

export const homeCarousel = defineType({
    name: "homeCarousel",
    title: "Carrusel de Home",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Título del Carrusel",
            type: "string",
            initialValue: "Carrusel Principal",
            readOnly: true,
        }),
        defineField({
            name: "welcomeTitle",
            title: "Título de Bienvenida (Welcome to)",
            type: "string",
            initialValue: "Welcome to",
        }),
        defineField({
            name: "welcomeHighlight",
            title: "Texto Destacado (My Vision)",
            type: "string",
            initialValue: "My Vision",
        }),
        defineField({
            name: "scrambleText",
            title: "Texto Desordenado (Scramble)",
            type: "string",
            initialValue: "WE WERE CREATED TO CREATE.",
            description: "Este es el texto que aparece con la animación de descifrado al principio.",
        }),
        defineField({
            name: "images",
            title: "Fotos del Carrusel (Total: 8)",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            title: "Texto Alternativo (SEO)",
                            type: "string",
                        }
                    ]
                }
            ],
            validation: (Rule) => Rule.length(8).error("Debes subir exactamente 8 imágenes para el carrusel de home."),
            options: {
                layout: "grid",
            },
        }),
    ],
});
