import { defineField, defineType } from 'sanity'

export const aboutMeType = defineType({
  name: 'aboutMe',
  title: 'Sección About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'roleTitle',
      title: 'Título del Cargo',
      type: 'string',
      description: 'El título que aparece bajo el nombre (ej. Director Cinematográfico).',
    }),
    defineField({
      name: 'profileImage',
      title: 'Foto de Perfil',
      type: 'image',
      description: 'Esta es la foto que aparecerá en la sección About de la página principal. Sube solo una foto.',
      options: {
        hotspot: true, // Permite encuadrar la imagen
      },
    }),
    defineField({
      name: 'aboutDescription',
      title: 'Descripción de About Me',
      type: 'text',
      description: 'El texto que aparece en la sección lateral junto a la foto.',
    }),
  ],
  preview: {
    select: {
      media: 'profileImage',
    },
    prepare() {
      return {
        title: 'Foto de Perfil (About Me)',
      }
    }
  }
})
