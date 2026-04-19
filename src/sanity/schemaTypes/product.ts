import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock / Active',
      type: 'boolean',
      initialValue: true,
      description: 'Turn this off to hide the product from the website',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'prices',
      title: 'Pricing Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'weight',
              title: 'Weight',
              type: 'string',
              description: 'e.g., 250gr, 500gr, 1kg',
            },
            {
              name: 'price',
              title: 'Price in INR',
              type: 'number',
            },
          ],
        },
      ],
    }),
  ],
});
