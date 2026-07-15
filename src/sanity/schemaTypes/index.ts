import { type SchemaTypeDefinition } from 'sanity';
import { productType } from './product';
import { blogPostType } from './blogPost';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, blogPostType],
};
