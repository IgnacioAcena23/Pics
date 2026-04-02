import { defineField, defineType } from 'sanity'

export const brandsMarqueeType = defineType({
  name: 'brandsMarquee',
  title: 'Logos de marcas',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (Opcional)',
      type: 'string',
      description: 'Solo para identificar este grupo en el panel de Sanity',
    }),
    defineField({
      name: 'logos',
      title: 'Logos de Marcas',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Sube todos los logos que quieras que aparezcan en la cinta infinita.',
      options: {
        layout: 'grid',
      },
    }),
  ],
})
