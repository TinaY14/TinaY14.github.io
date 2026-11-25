const escape = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

function page(title, content) {
  const links = [
    ['Home', '../index.html'],
    ['Food Diary', '../food_gallery/food_gallery.html'],
    ['My Kitchen', '../kitchen/index.html'],
    ['Journal', '../blogs/blogs.html'],
    ['Projects & Research', '../projects/projects.html']
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} - Tina</title>
<link rel="stylesheet" href="../styles.css?v=collections-1">
<script src="../darkmode.js?v=collections-1" defer></script>
</head>
<body class="inner-page">
<header><a href="../index.html" class="logo">Tina's Little World</a><nav>
${links.map(([label, url]) => `<a href="${url}">${label}</a>`).join('\n')}
<button id="dark-mode-toggle" aria-label="Change color theme">Mint</button>
</nav></header>
<main class="hero inner-page"><div class="page-content wide collection-page">${content}</div></main>
</body></html>`;
}

function article(data, content, collection) {
  const images = data.images || (data.image ? [data.image] : []);
  return page(data.title, `
<a class="collection-back" href="${collection.hub}">Close this chapter · ${collection.title}</a>
<h1>${escape(data.title)}</h1>
${data.date ? `<p><time datetime="${escape(data.date)}">${escape(data.date)}</time></p>` : ''}
${data.subtitle ? `<p>${escape(data.subtitle)}</p>` : ''}
<div class="article-photos">${images.map(image => `<a href="${escape(image)}" target="_blank" rel="noopener"><img src="${escape(image)}" alt="${escape(data.title)}" loading="lazy"></a>`).join('')}</div>
<article class="collection-article">${content}</article>`);
}

function hub(entries, collection) {
  return page(collection.title, `<h1>${collection.title}</h1>
<p class="collection-intro">${collection.intro}</p>
${!entries.length ? '<p>No entries have been published yet.</p>' : ''}
<div class="collection-grid">
${entries.map(entry => `<a class="collection-card" href="${escape(entry.slug)}.html">
${entry.data.image || entry.data.images?.[0] ? `<img src="${escape(entry.data.image || entry.data.images[0])}" alt="" loading="lazy">` : ''}
<div>${entry.data.date ? `<time datetime="${escape(entry.data.date)}">${escape(entry.data.date)}</time>` : ''}
<h2>${escape(entry.data.title)}</h2><p>${escape(entry.data.excerpt || entry.data.cardDescription || entry.data.subtitle)}</p>
<span>${collection.action} ↗</span></div></a>`).join('\n')}
</div>`);
}

module.exports = { article, hub };
