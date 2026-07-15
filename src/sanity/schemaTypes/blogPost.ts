import { defineField, defineType } from 'sanity';

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      description: 'Click “Generate” after entering the title. Use lowercase letters, numbers, and hyphens only.',
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;

          if (!current) {
            return 'Slug is required. Click “Generate” before publishing.';
          }

          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return 'Slug must use lowercase letters, numbers, and hyphens only.';
          }

          return true;
        }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'targetKeyword',
      title: 'Target Keyword',
      type: 'string',
      description: 'Primary SEO/AEO query this post is designed to answer.',
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Secondary Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Supporting keywords/entities for the content engine.',
    }),
    defineField({
      name: 'searchIntent',
      title: 'Search Intent',
      type: 'string',
      options: {
        list: [
          { title: 'Informational', value: 'informational' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Transactional', value: 'transactional' },
          { title: 'Local', value: 'local' },
          { title: 'Navigational', value: 'navigational' },
        ],
      },
    }),
    defineField({
      name: 'targetLocation',
      title: 'Target Location',
      type: 'string',
      initialValue: 'Bangalore',
    }),
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer',
      type: 'text',
      rows: 4,
      description: 'A concise 2–4 sentence answer for readers and answer engines. Show this near the top of the article.',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      description: 'Short bullets that summarize the page for skimmers and answer engines.',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Optional. Defaults to the post title plus brand name.',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Optional. Defaults to the excerpt.',
      validation: (rule) => rule.max(170),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      description: 'Use only for drafts or thin pages that should not appear in search.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImageAlt',
      title: 'Cover Image Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility and image search.',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Annapurna Mewa',
    }),
    defineField({
      name: 'authorTitle',
      title: 'Author Title',
      type: 'string',
      initialValue: 'Premium Dry Fruits Specialist',
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'string',
      description: 'Optional reviewer for trust/quality control.',
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Last Reviewed At',
      type: 'datetime',
      description: 'Use when content is checked for freshness without changing the publish date.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Dry Fruits Guide',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                title: 'External Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) => rule.required(),
                  }),
                  defineField({
                    name: 'blank',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              },
              {
                name: 'internalProductLink',
                title: 'Product Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'product',
                    title: 'Product',
                    type: 'reference',
                    to: [{ type: 'product' }],
                    validation: (rule) => rule.required(),
                  }),
                ],
              },
            ],
          },
        },
        {
          type: 'object',
          name: 'comparisonTable',
          title: 'Comparison Table',
          fields: [
            defineField({
              name: 'title',
              title: 'Table Title',
              type: 'string',
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'value', title: 'Value', type: 'string' }),
                    defineField({ name: 'note', title: 'Note', type: 'string' }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Question-answer blocks for readers and answer engines.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      description: 'Products to link from the article for commercial intent and internal linking.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'relatedCategories',
      title: 'Related Categories',
      type: 'array',
      description: 'Optional category labels covered in this post.',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cta',
      title: 'Call To Action',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Need help choosing dry fruits?',
        }),
        defineField({
          name: 'text',
          title: 'CTA Text',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'label',
          title: 'Button Label',
          type: 'string',
          initialValue: 'Ask on WhatsApp',
        }),
        defineField({
          name: 'href',
          title: 'Button URL',
          type: 'url',
          description: 'Use a WhatsApp link, catalog link, or another destination.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
});
