const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = function buildNavigation() {
  const assets = ['styles.css', 'darkmode.js', 'photo-journal.js', 'film-gallery.js', 'film-gallery.css'];
  const versions = Object.fromEntries(assets.map(asset => [
    asset, crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0, 12)
  ]));
  const destinations = [
    ['Home', 'index.html'], ['Food Diary', 'food_gallery/food_gallery.html'],
    ['My Kitchen', 'kitchen/index.html'], ['Journal', 'blogs/blogs.html'],
    ['Projects & Research', 'projects/projects.html']
  ];
  const files = ['index.html', 'projects.html'];
  for (const directory of ['food_gallery', 'kitchen', 'blogs', 'projects', 'night_stall_food']) {
    files.push(...fs.readdirSync(directory).filter(file => file.endsWith('.html')).map(file => directory + '/' + file));
  }
  for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('http-equiv="refresh"')) {
      html = html.replace(/<script src="[^"]*photo-journal\.js[^"]*" defer><\/script>\n?/g, '');
      fs.writeFileSync(file, html);
      continue;
    }
    const active = file.startsWith('night_stall_food/') ? 'food_gallery/food_gallery.html'
      : file.startsWith('kitchen/') ? 'kitchen/index.html'
      : file.startsWith('blogs/') ? 'blogs/blogs.html'
      : file.startsWith('projects/') || file === 'projects.html' ? 'projects/projects.html'
      : file.startsWith('food_gallery/') ? 'food_gallery/food_gallery.html' : 'index.html';
    const links = destinations.map(([label, target]) => {
      const href = path.posix.relative(path.posix.dirname(file), target);
      return `<a href="${href}"${target === active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('\n            ');
    html = html.replace(/(<header[\s>][\s\S]*?<nav>)[\s\S]*?<\/nav>/, `$1
            ${links}
            <button id="dark-mode-toggle" aria-label="Change color theme">Mint</button>
        </nav>`);
    if (!html.includes('photo-journal.js') && html.includes('</body>')) {
      const scriptPath = path.posix.relative(path.posix.dirname(file), 'photo-journal.js');
      html = html.replace('</body>', `<script src="${scriptPath}?v=notebook-1" defer></script>\n</body>`);
    }
    html = html.replace(
      /((?:src|href)=["'](?:\.\.\/)*)(styles\.css|darkmode\.js|photo-journal\.js|film-gallery\.(?:js|css))(?:\?[^"']*)?(["'])/g,
      (_, prefix, asset, quote) => prefix + asset + '?v=' + versions[asset] + quote
    );
    fs.writeFileSync(file, html);
  }
};
