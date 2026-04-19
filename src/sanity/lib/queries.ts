import { groq } from 'next-sanity';

export const productsQuery = groq`*[_type == "product" && (inStock == null || inStock == true)]{
  _id,
  name,
  "slug": slug.current,
  "imagePath": image.asset->url,
  "imagePaths": images[].asset->url,
  description,
  category,
  prices
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug && (inStock == null || inStock == true)][0]{
  _id,
  name,
  "slug": slug.current,
  "imagePath": image.asset->url,
  "imagePaths": images[].asset->url,
  description,
  category,
  prices
}`;
