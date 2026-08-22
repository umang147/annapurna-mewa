import fs from 'node:fs';
import path from 'node:path';

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    .map((line) => line.trim()).filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['\"]|['\"]$/g, '')];
    }));
}

const env = readEnv(path.join(process.cwd(), '.env.local'));
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const apiBase = `https://${projectId}.api.sanity.io/v2026-08-22`;

if (!projectId || !token) throw new Error('Missing Sanity project ID or write token.');

async function request(pathname, init = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Sanity API ${response.status}: ${await response.text()}`);
  return response.json();
}

async function uploadImage(filePath) {
  const response = await fetch(`${apiBase}/assets/images/${dataset}?filename=${encodeURIComponent(path.basename(filePath))}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/jpeg' },
    body: fs.readFileSync(filePath),
  });
  if (!response.ok) throw new Error(`Image upload failed: ${response.status} ${await response.text()}`);
  const result = await response.json();
  return result.document._id;
}

const photo = (filename, alt, caption) => ({
  filename: `/Users/umang/Downloads/${filename}`,
  alt,
  caption,
});

const galleries = [
  {
    slug: 'raksha-bandhan-dry-fruit-gift-boxes',
    afterKey: 'moment',
    key: 'rakhi-gifting-gallery',
    title: 'Rakhi gifting, beautifully presented',
    images: [
      photo('PHOTO-2026-08-21-21-19-12 2.jpg', 'Four-compartment Rakhi dry fruit gift box with cashews, raisins, almonds and pistachios', 'A colourful four-part dry fruit assortment for family sharing.'),
      photo('PHOTO-2026-08-21-21-19-11 2.jpg', 'Gold four-compartment Raksha Bandhan dry fruit box', 'A traditional gold-finish box with a generous mixed selection.'),
      photo('PHOTO-2026-08-21-21-19-11.jpg', 'Silver decorative dry fruit box with almonds, pistachios, raisins and cashews', 'A classic mixed-dry-fruit box ready for a Rakhi gathering.'),
      photo('PHOTO-2026-08-21-21-19-10 2.jpg', 'Rose-gold Rakhi dry fruit box with four compartments', 'A refined presentation that makes the festive mix feel extra special.'),
    ],
  },
  {
    slug: 'how-to-choose-rakhi-gift-box',
    afterKey: 'finish',
    key: 'rakhi-box-details-gallery',
    title: 'Details that make a gift box feel special',
    images: [
      photo('PHOTO-2026-08-21-21-19-13.jpg', 'Rose-gold and gold floral Rakhi gift boxes', 'Choose a finish and motif that suits the person you are gifting to.'),
      photo('PHOTO-2026-08-21-21-19-10.jpg', 'Open empty rose-gold Rakhi gift box with four compartments', 'Compartments keep an assortment tidy and ready to fill.'),
      photo('PHOTO-2026-08-21-21-19-09 2.jpg', 'Open decorative Rakhi gift box with four empty compartments', 'A practical layout for building a balanced festive assortment.'),
      photo('PHOTO-2026-08-21-21-19-09.jpg', 'Gold floral Rakhi gift box beside an open dry fruit box', 'Decorative details turn useful gifting into a keepsake gesture.'),
    ],
  },
  {
    slug: 'reusable-raksha-bandhan-gift-boxes',
    afterKey: 'keepsake',
    key: 'reusable-rakhi-box-gallery',
    title: 'Boxes made to be kept',
    images: [
      photo('PHOTO-2026-08-21-21-19-13 2.jpg', 'Silver and rose-gold ornate keepsake boxes for Raksha Bandhan', 'Distinctive designs make the box part of the gift, not just its packaging.'),
      photo('PHOTO-2026-08-21-21-19-12.jpg', 'Elephant motif dry fruit keepsake box with cashews and pistachios', 'A two-jar box that can be reused for small festive treats or keepsakes.'),
      photo('PHOTO-2026-08-21-21-19-10 3.jpg', 'Elephant motif Raksha Bandhan gift box with decorative jars', 'Ornate jars and a detailed box create a memorable unboxing moment.'),
    ],
  },
];

for (const gallery of galleries) {
  const query = encodeURIComponent(`*[_type == "blogPost" && slug.current == "${gallery.slug}"][0]{_id,body}`);
  const document = (await request(`/data/query/${dataset}?query=${query}`)).result;
  if (!document?._id || !Array.isArray(document.body)) throw new Error(`Could not find ${gallery.slug}`);

  console.log(`Uploading ${gallery.images.length} gallery images for ${gallery.slug}…`);
  const images = await Promise.all(gallery.images.map(async (image, index) => ({
    _key: `${gallery.key}-${index + 1}`,
    image: { _type: 'image', asset: { _type: 'reference', _ref: await uploadImage(image.filename) } },
    alt: image.alt,
    caption: image.caption,
  })));
  const galleryBlock = { _type: 'imageGallery', _key: gallery.key, title: gallery.title, images };
  const bodyWithoutOldGallery = document.body.filter((item) => item._key !== gallery.key);
  const insertionIndex = bodyWithoutOldGallery.findIndex((item) => item._key === gallery.afterKey);
  if (insertionIndex < 0) throw new Error(`Could not place gallery in ${gallery.slug}: missing ${gallery.afterKey}`);
  bodyWithoutOldGallery.splice(insertionIndex + 1, 0, galleryBlock);

  await request(`/data/mutate/${dataset}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ patch: { id: document._id, set: { body: bodyWithoutOldGallery } } }] }),
  });
  console.log(`Updated ${gallery.slug}`);
}

console.log('All Rakhi image galleries published.');
