import { getCliClient } from 'sanity/cli';
import { readFileSync } from 'fs';
import { basename } from 'path';

const client = getCliClient();

const updates = [
  {
    slug: 'california-salted-pista',
    files: [
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista1.png',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista2.jpg',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista3.jpg',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista4.jpg',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista5.jpg',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista6.jpg',
      '/Users/umang/Downloads/annapurna-mewa-images/salted-pista7.jpg'
    ]
  },
  {
    slug: 'kishmish',
    files: [
      '/Users/umang/Downloads/annapurna-mewa-images/kismis1.png',
      '/Users/umang/Downloads/annapurna-mewa-images/kismis2.jpg'
    ]
  },
  {
    slug: 'makhana',
    files: [
      '/Users/umang/Downloads/annapurna-mewa-images/makhana1.png',
      '/Users/umang/Downloads/annapurna-mewa-images/makhana2.jpg'
    ]
  }
];

async function run() {
  console.log('Starting multiple image migration...');
  
  for (const update of updates) {
    console.log(`Processing updates for slug: ${update.slug}`);
    
    // Find the product by slug
    const query = `*[_type == "product" && slug.current == $slug][0]`;
    const product = await client.fetch(query, { slug: update.slug });
    
    if (!product) {
      console.log(`Product ${update.slug} not found. Skipping.`);
      continue;
    }

    const imageRefs = [];
    
    for (const filePath of update.files) {
      console.log(`- Uploading ${basename(filePath)}...`);
      try {
        const fileBuffer = readFileSync(filePath);
        const asset = await client.assets.upload('image', fileBuffer, {
          filename: basename(filePath)
        });
        
        imageRefs.push({
          _type: 'image',
          _key: asset._id, // unique key required for arrays
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        });
        console.log(`  Uploaded!`);
      } catch (err) {
        console.error(`  Failed to upload ${basename(filePath)}:`, err);
      }
    }

    if (imageRefs.length > 0) {
      console.log(`Patching ${product.name} with ${imageRefs.length} images...`);
      await client.patch(product._id).set({ images: imageRefs }).commit();
      console.log(`Successfully updated ${product.name}!`);
    }
  }
  
  console.log('Done mapping multiple images!');
}

run();
