const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'food_gallery', 'image');
const dataFile = path.join(__dirname, '..', 'food_gallery', 'data.json');

function photoDate(image) {
  const name = path.basename(image);
  const iso = name.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const legacy = name.match(/^(\d{2})(\d{2})(\d{2})(?:\d{2})?\.jpe?g$/i);
  if (!legacy) return null;
  return '20' + legacy[3] + '-' + legacy[1] + '-' + legacy[2];
}

function findPhotos(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findPhotos(fullPath);
    return /\.jpe?g$/i.test(entry.name) ? [fullPath] : [];
  });
}

// Retain authored date ranges, captions, locations and reflections.
const timeline = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : [];
const knownImages = new Set(timeline.flatMap(entry => entry.photos.map(photo => photo.image)));
const newEntries = new Map();
for (const file of findPhotos(imageDir).sort()) {
  const image = 'image/' + path.relative(imageDir, file).split(path.sep).join('/');
  if (knownImages.has(image)) continue;
  const date = photoDate(image);
  if (!date) {
    console.log('Pending date and collection assignment: ' + image);
    continue;
  }
  let entry = timeline.find(item => !item.dateLabel && item.photos.length && photoDate(item.photos[0].image) === date);
  if (!entry) {
    if (!newEntries.has(date)) newEntries.set(date, { photos: [] });
    entry = newEntries.get(date);
  }
  entry.photos.push({ image, caption: '', collection: 'kitchen' });
}
timeline.push(...newEntries.values());
timeline.sort((a, b) => (photoDate(b.photos[0].image) || '').localeCompare(photoDate(a.photos[0].image) || ''));
fs.writeFileSync(dataFile, JSON.stringify(timeline, null, 2) + '\n');
console.log('Updated timeline while preserving existing notes and captions.');
