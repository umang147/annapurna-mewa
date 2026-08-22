import fs from 'node:fs';
import path from 'node:path';

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
      .map((line) => line.trim()).filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const i = line.indexOf('=');
        return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^['\"]|['\"]$/g, '')];
      }),
  );
}

const env = readEnv(path.join(process.cwd(), '.env.local'));
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const apiVersion = '2026-08-22';
const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}`;

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
  return response.json();
}

function span(key, text) { return { _type: 'span', _key: key, text, marks: [] }; }
function block(key, text, style = 'normal') {
  return { _type: 'block', _key: key, style, markDefs: [], children: [span(`${key}-span`, text)] };
}
function bullet(key, text) {
  return { ...block(key, text), listItem: 'bullet', level: 1 };
}
function table(key, title, rows) {
  return { _type: 'comparisonTable', _key: key, title, rows: rows.map((row, i) => ({ _key: `${key}-${i}`, ...row })) };
}

const publishedAt = '2026-08-22T08:00:00.000Z';
const authorBio = 'Annapurna Mewa helps families choose fresh, premium dry fruits for everyday enjoyment and thoughtful festive gifting.';
const whatsapp = 'https://wa.me/917259496740';

const drafts = [
  {
    _id: 'blogPost-raksha-bandhan-dry-fruit-gift-boxes',
    title: 'Raksha Bandhan Gift Boxes: A Thoughtful Way to Celebrate',
    slug: 'raksha-bandhan-dry-fruit-gift-boxes',
    imageFile: '/Users/umang/Downloads/PHOTO-2026-08-21-21-19-12 3.jpg',
    coverImageAlt: 'Ornate Raksha Bandhan dry fruit gift boxes with cashews and festive gold detailing',
    excerpt: 'Celebrate Raksha Bandhan with an elegant dry fruit gift box that feels festive, useful and made for sharing.',
    targetKeyword: 'raksha bandhan gift boxes',
    secondaryKeywords: ['rakhi dry fruit gift box', 'raksha bandhan gifts', 'festive dry fruit hamper'],
    quickAnswer: 'A Raksha Bandhan dry fruit gift box is a warm, practical choice for siblings and families. A mix of almonds, cashews, pistachios and raisins in an ornate reusable box makes the ritual feel personal long after the day is over.',
    body: [
      block('intro', 'Raksha Bandhan is one of those celebrations where the gift does not need to be extravagant to feel memorable. It simply needs to carry care. An elegant dry fruit box brings together the warmth of a festive gesture, the pleasure of sharing, and something genuinely useful for the family.'),
      block('why-heading', 'Why dry fruits feel right for Rakhi gifting', 'h2'),
      bullet('why-1', 'They are easy to share during family visits and festive tea-time.'),
      bullet('why-2', 'A varied mix gives everyone a favourite: almonds, cashews, pistachios or raisins.'),
      bullet('why-3', 'An ornate box adds ceremony to the moment and can be reused afterwards.'),
      block('moment-heading', 'A gift that becomes part of the celebration', 'h2'),
      block('moment', 'The best Rakhi gifts feel considered rather than complicated. A beautifully presented box can sit beside the thali, be opened when family gathers, and become a small part of the day’s photographs and conversations. Choose a mix that looks generous, with contrasting colours and textures, and keep the focus on freshness and presentation.'),
      table('mix-table', 'Simple Rakhi dry fruit box ideas', [
        { label: 'Classic four-part box', value: 'Almonds, cashews, pistachios and golden raisins', note: 'A balanced choice with crunch, richness and sweetness.' },
        { label: 'Two-jar keepsake box', value: 'Cashews and pistachios', note: 'A compact, elegant gesture for a sibling or host.' },
        { label: 'Family-sharing box', value: 'A larger four-dry-fruit assortment', note: 'Ideal when gifting to a household.' },
      ]),
      block('close-heading', 'Make the gift feel personal', 'h2'),
      block('close', 'Add a handwritten Rakhi note, choose the box design that suits the recipient, and order early enough to make gifting feel unhurried. The care is in the details: a clean, fresh assortment and a box worth keeping.'),
    ],
    faqs: [
      { _key: 'faq-1', question: 'What dry fruits are good for a Raksha Bandhan gift box?', answer: 'Almonds, cashews, pistachios and golden raisins make a balanced Rakhi gift box because they offer variety in flavour, colour and texture.' },
      { _key: 'faq-2', question: 'Is a dry fruit box a good Rakhi gift?', answer: 'Yes. It is festive, easy to share with family, and feels more considered when presented in a beautiful reusable box.' },
    ],
  },
  {
    _id: 'blogPost-how-to-choose-rakhi-gift-box',
    title: 'How to Choose a Rakhi Gift Box That Feels Truly Special',
    slug: 'how-to-choose-rakhi-gift-box',
    imageFile: '/Users/umang/Downloads/PHOTO-2026-08-21-21-19-09 3.jpg',
    coverImageAlt: 'Open decorative Rakhi gift box with compartments ready for a dry fruit assortment',
    excerpt: 'A simple guide to choosing a Rakhi gift box with the right mix of presentation, freshness and sharing size.',
    targetKeyword: 'how to choose a rakhi gift box',
    secondaryKeywords: ['rakhi gift box ideas', 'dry fruit box for rakhi', 'raksha bandhan gift ideas'],
    quickAnswer: 'Choose a Rakhi gift box by matching the size to the recipient, choosing a fresh assortment with real variety, and selecting a box design they will enjoy keeping. The best option is thoughtful, not overfilled.',
    body: [
      block('intro', 'A Rakhi gift box should feel like it was selected for someone, not simply picked off a shelf. Whether you are sending a gift to one sibling, a couple, or an entire family, a few small choices can make it feel beautifully personal.'),
      block('size-heading', '1. Start with who will enjoy it', 'h2'),
      block('size', 'A compact two-jar box suits a personal sibling gift. A compartment box works naturally for a family home, where everyone can sample a different dry fruit. The aim is to choose a size that feels generous without becoming impersonal.'),
      block('mix-heading', '2. Look for a balanced assortment', 'h2'),
      table('choice-table', 'What a balanced box includes', [
        { label: 'Crunch', value: 'Almonds and cashews', note: 'Familiar, shareable and festive.' },
        { label: 'Colour', value: 'Pistachios', note: 'Adds a premium look to the assortment.' },
        { label: 'Sweetness', value: 'Golden raisins', note: 'Brings contrast without needing confectionery.' },
      ]),
      block('finish-heading', '3. Let the box do some of the gifting', 'h2'),
      block('finish', 'The box is not only packaging. Detailed metal-finish patterns, floral motifs and keepsake jars make the unboxing feel festive. A reusable box also leaves behind something useful once the dry fruits have been enjoyed.'),
      block('fresh-heading', '4. Keep freshness at the centre', 'h2'),
      block('fresh', 'Beautiful presentation matters most when it holds a fresh, clean-looking assortment. Choose dry fruits that are well kept, pack close to gifting time, and share storage guidance if the box will travel.'),
    ],
    faqs: [
      { _key: 'faq-1', question: 'What size Rakhi gift box should I choose?', answer: 'Choose a smaller two-jar or two-compartment box for one person, and a four-compartment box when you are gifting to a family or household.' },
      { _key: 'faq-2', question: 'What makes a Rakhi gift box feel premium?', answer: 'Fresh dry fruits, a balanced assortment, careful presentation and a reusable box design all make the gift feel premium.' },
    ],
  },
  {
    _id: 'blogPost-reusable-raksha-bandhan-gift-boxes',
    title: 'Reusable Raksha Bandhan Gift Boxes: The Keepsake After the Celebration',
    slug: 'reusable-raksha-bandhan-gift-boxes',
    imageFile: '/Users/umang/Downloads/PHOTO-2026-08-21-21-19-08.jpg',
    coverImageAlt: 'Silver and rose-gold ornate reusable gift boxes for Raksha Bandhan dry fruits',
    excerpt: 'Why a reusable keepsake box makes a Raksha Bandhan dry fruit gift feel more memorable and lasting.',
    targetKeyword: 'reusable raksha bandhan gift boxes',
    secondaryKeywords: ['keepsake gift box for rakhi', 'reusable dry fruit box', 'raksha bandhan return gift box'],
    quickAnswer: 'A reusable Raksha Bandhan gift box gives the celebration a longer life. Once the dry fruits are enjoyed, the decorative box can be used for jewellery, letters, small keepsakes, or future festive storage.',
    body: [
      block('intro', 'Some festive gifts are enjoyed in a moment. Others stay around as a quiet reminder of the occasion. A reusable Raksha Bandhan dry fruit box does both: it brings something delicious to the celebration and leaves behind a beautiful object to use again.'),
      block('keepsake-heading', 'More than festive packaging', 'h2'),
      block('keepsake', 'Ornate boxes with floral, heritage-inspired or metallic detailing add a sense of occasion before they are even opened. After Rakhi, they can hold jewellery, small accessories, cards, notes, or keepsakes. That second life makes the gift feel considered and less disposable.'),
      block('uses-heading', 'Ways to reuse a festive gift box', 'h2'),
      bullet('use-1', 'Store jewellery, watches or festive accessories.'),
      bullet('use-2', 'Keep handwritten notes, photos or small mementos together.'),
      bullet('use-3', 'Use it again for dry fruits, sweets or festive serving.'),
      bullet('use-4', 'Pass it on as part of another thoughtful gift.'),
      block('choose-heading', 'Choosing a box worth keeping', 'h2'),
      block('choose', 'Look for a design with a secure lid, practical compartments or jars, and a finish that feels appropriate for the recipient’s style. Floral patterns can feel warm and classic, while heritage-inspired motifs create a more ceremonial look. The right box turns a dry fruit gift into a keepsake.'),
      block('close-heading', 'A small tradition with a longer life', 'h2'),
      block('close', 'Rakhi is about connection. A reusable gift box quietly extends that feeling past the festival—long after the last almond or cashew has been shared.'),
    ],
    faqs: [
      { _key: 'faq-1', question: 'What can a Rakhi gift box be reused for?', answer: 'A decorative gift box can be reused for jewellery, cards, small keepsakes, dry fruits, sweets or future festive gifting.' },
      { _key: 'faq-2', question: 'Why choose a reusable dry fruit box for Rakhi?', answer: 'It adds a lasting, useful element to the gift while keeping the festive presentation elegant and memorable.' },
    ],
  },
];

for (const draft of drafts) {
  console.log(`Uploading cover image for ${draft.slug}…`);
  const asset = await uploadImage(draft.imageFile);
  const { imageFile, slug, body, faqs, ...fields } = draft;
  const document = {
    ...fields,
    _type: 'blogPost',
    slug: { _type: 'slug', current: slug },
    searchIntent: 'commercial', targetLocation: 'Bangalore', category: 'Festive Gifting',
    metaTitle: `${fields.title} | Annapurna Mewa`,
    metaDescription: fields.excerpt,
    publishedAt, lastReviewedAt: publishedAt, author: 'Annapurna Mewa', authorTitle: 'Premium Dry Fruits Specialist', authorBio,
    noIndex: false,
    coverImage: { _type: 'image', asset: { _type: 'reference', _ref: asset.document._id } },
    body, faqs, relatedCategories: ['Dry Fruits', 'Festive Gifting', 'Raksha Bandhan'],
    cta: { title: 'Planning a Rakhi gift?', text: 'Message Annapurna Mewa to check current availability and choose a fresh dry fruit gift box for Raksha Bandhan.', label: 'Ask on WhatsApp', href: whatsapp },
  };
  await request(`/data/mutate/${dataset}?returnDocuments=false`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mutations: [{ createOrReplace: document }] }),
  });
  console.log(`Published ${slug}`);
}

const slugs = drafts.map(({ slug }) => slug);
const query = encodeURIComponent(`*[_type == "blogPost" && slug.current in ${JSON.stringify(slugs)}]{title,"slug":slug.current,publishedAt,coverImageAlt}`);
console.log(JSON.stringify(await request(`/data/query/${dataset}?query=${query}`), null, 2));
