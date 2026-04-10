import { defineField, defineType } from 'sanity'

export const aboutMeType = defineType({
  name: 'aboutMe',
  title: 'Sección About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'profileImage',
      title: 'Foto de Perfil',
      type: 'image',
      description: 'Esta es la foto que aparecerá en la sección About de la página principal. Sube solo una foto.',
      options: {
        hotspot: true, // Permite encuadrar la imagen
      },
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
