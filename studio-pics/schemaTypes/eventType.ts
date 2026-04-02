import { defineField, defineType } from "sanity";

export const eventType = defineType({
    name: "eventType",
    title: "Works",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Nombre del Proyecto",
            type: "string",
        }),
        defineField({
            name: "subtitle",
            title: "Subtítulo (Ej: Photoshoot)",
            type: "string",
        }),
        defineField({
            name: "slug",
            title: "Slug (URL amigable)",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
        }),
        defineField({
            name: "image",
            title: "Imagen Principal (Portada)",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "description",
            title: "Descripción del Proyecto",
            type: "text",
        }),
        defineField({
            name: "gallery",
            title: "Galería de Fotos/Videos del Proyecto",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                }
            ],
            options: {
                layout: "grid",
            },
        }),
    ],
});