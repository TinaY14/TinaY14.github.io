const fs = require('fs');
const path = require('path');

module.exports = function buildNavigation() {
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
    html = html.replace(/(styles\.css|darkmode\.js)\?v=[^"']+/g, '$1?v=collections-1');
    fs.writeFileSync(file, html);
  }
};
