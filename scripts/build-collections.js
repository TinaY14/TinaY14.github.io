const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const templates = require('../templates/collection');

module.exports = function buildCollections() {
  const collections = [
    { source: 'content/journal', output: 'blogs', hub: 'blogs.html', title: 'Journal',
      intro: 'Kitchen gatherings, field visits, and thoughts along the way.', action: 'Read the story' },
    { source: 'content/kitchen', output: 'kitchen', hub: 'index.html', title: 'My Kitchen',
      intro: 'Recipes, small experiments, and notes for the next batch.', action: 'Open the recipe' }
  ];
  for (const collection of collections) {
    fs.mkdirSync(collection.output, { recursive: true });
    const entries = fs.readdirSync(collection.source).filter(file => file.endsWith('.md')).map(file => {
      const { data, content } = matter(fs.readFileSync(path.join(collection.source, file), 'utf8'));
      if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
      if (!data.title) throw new Error('Missing title in ' + file);
      return { slug: path.basename(file, '.md'), data, content };
    }).sort((a, b) => String(b.data.date || '').localeCompare(String(a.data.date || '')) || a.data.title.localeCompare(b.data.title));
    for (const entry of entries) {
      const html = templates.article(entry.data, marked.parse(entry.content), collection);
      fs.writeFileSync(path.join(collection.output, entry.slug + '.html'), html);
      if (collection.output === 'kitchen') {
        // Older recipe links remain valid after moving recipes out of Street Food Notes.
        fs.writeFileSync(path.join('night_stall_food', entry.slug + '.html'),
          `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=../kitchen/${entry.slug}.html"><title>${entry.data.title}</title></head><body><a href="../kitchen/${entry.slug}.html">Open recipe</a></body></html>`);
      }
    }
    let index = templates.hub(entries.filter(entry => entry.data.published !== false), collection);
    if (collection.output === 'kitchen') {
      index = fs.readFileSync('food_gallery/food_gallery.html', 'utf8')
        .replace('data-collection="diary"', 'data-collection="kitchen"')
        .replace('<title>Food Diary - Tina</title>', '<title>My Kitchen - Tina</title>')
        .replace('<h2 class="page-title">Food Diary</h2>', '<h2 class="page-title">My Kitchen</h2>')
        .replace('A little hungry, a little curious. What shall we open today?', 'Made by me. A notebook of meals, experiments, and little discoveries.')
        .replaceAll('href="food_gallery.html" aria-current="page">Food Diary', 'href="../food_gallery/food_gallery.html">Food Diary')
        .replaceAll('href="../kitchen/index.html">My Kitchen', 'href="../kitchen/index.html" aria-current="page">My Kitchen');
    }
    fs.writeFileSync(path.join(collection.output, collection.hub), index);
    console.log(`Built ${entries.length} ${collection.title} entries and automatic index.`);
  }
};
