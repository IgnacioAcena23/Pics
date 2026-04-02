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
            readOnly: true, // Para mantenerlo como una configuración única
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
