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

export const blogPostsQuery = groq`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  targetKeyword,
  secondaryKeywords,
  searchIntent,
  targetLocation,
  metaTitle,
  metaDescription,
  quickAnswer,
  keyTakeaways,
  publishedAt,
  "updatedAt": _updatedAt,
  lastReviewedAt,
  author,
  authorTitle,
  authorBio,
  reviewedBy,
  category,
  coverImageAlt,
  noIndex,
  "imagePath": coverImage.asset->url
}`;

export const blogPostSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  targetKeyword,
  secondaryKeywords,
  searchIntent,
  targetLocation,
  metaTitle,
  metaDescription,
  quickAnswer,
  keyTakeaways,
  publishedAt,
  "updatedAt": _updatedAt,
  lastReviewedAt,
  author,
  authorTitle,
  authorBio,
  reviewedBy,
  category,
  coverImageAlt,
  noIndex,
  "imagePath": coverImage.asset->url,
  body[]{
    ...,
    _type == "productPriceTable" => {
      ...,
      products[]{
        ...,
        product->{
          _id,
          name,
          "slug": slug.current,
          category,
          prices,
          "imagePath": coalesce(image.asset->url, images[0].asset->url)
        }
      }
    },
    _type == "imageGallery" => {
      ...,
      images[]{
        ...,
        "imagePath": image.asset->url,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height
      }
    }
  },
  faqs,
  relatedCategories,
  relatedProducts[]->{
    _id,
    name,
    "slug": slug.current,
    category,
    prices,
    "imagePath": coalesce(image.asset->url, images[0].asset->url)
  },
  cta
}`;
