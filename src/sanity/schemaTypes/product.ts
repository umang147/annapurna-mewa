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
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      description: 'Click “Generate” after entering the product name. Use lowercase letters, numbers, and hyphens only.',
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;

          if (!current) {
            return 'Slug is required. Click “Generate” before publishing.';
          }

          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return 'Slug must use lowercase letters, numbers, and hyphens only. Example: 3pcs-split-cashew';
          }

          return true;
        }),
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
