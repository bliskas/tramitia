import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripcion (SEO)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Apostillas', value: 'apostillas'},
          {title: 'Documentos', value: 'documentos'},
          {title: 'Tramites', value: 'tramites'},
          {title: 'Guias', value: 'guias'},
          {title: 'Noticias', value: 'noticias'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Pais relacionado',
      type: 'string',
      options: {
        list: [
          {title: 'Venezuela', value: 'venezuela'},
          {title: 'Argentina', value: 'argentina'},
          {title: 'Colombia', value: 'colombia'},
          {title: 'Ecuador', value: 'ecuador'},
          {title: 'Peru', value: 'peru'},
          {title: 'Bolivia', value: 'bolivia'},
          {title: 'General', value: 'general'},
        ],
      },
    }),
    defineField({
      name: 'documentType',
      title: 'Tipo de documento',
      type: 'string',
      options: {
        list: [
          {title: 'Partida de nacimiento', value: 'partida-nacimiento'},
          {title: 'Antecedentes penales', value: 'antecedentes-penales'},
          {title: 'Titulo universitario', value: 'titulo-universitario'},
          {title: 'Acta de matrimonio', value: 'acta-matrimonio'},
          {title: 'Poder notarial', value: 'poder-notarial'},
          {title: 'Otro', value: 'otro'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Cita', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Negrita', value: 'strong'},
              {title: 'Cursiva', value: 'em'},
              {title: 'Subrayado', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Pie de imagen',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Palabras clave (SEO)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicacion',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'draft',
      title: 'Borrador',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      draft: 'draft',
    },
    prepare(selection) {
      const {title, category, draft} = selection
      return {
        title: draft ? `[BORRADOR] ${title}` : title,
        subtitle: category,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Fecha de publicacion',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
