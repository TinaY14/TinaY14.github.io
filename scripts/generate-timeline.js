const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '..', 'food_gallery', 'image');
const DATA_FILE = path.join(__dirname, '..', 'food_gallery', 'data.json');

function parseDate(filename) {
  // Extract date from filename like "112725.jpg" or "112725(1).jpg"
  // Format is MMDDYY
  const match = filename.match(/^(\d{6})/);
  if (!match) return null;

  const dateStr = match[1];
  const month = parseInt(dateStr.substring(0, 2), 10);
  const day = parseInt(dateStr.substring(2, 4), 10);
  const year = parseInt(dateStr.substring(4, 6), 10);

  // Convert 2-digit year to 4-digit (assuming 20xx for years < 50, 19xx otherwise)
  const fullYear = year < 50 ? 2000 + year : 1900 + year;

  // Validate date
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function generateTimeline() {
  // Read all jpg files from image directory
  const files = fs.readdirSync(IMAGE_DIR)
    .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

  // Group photos by date
  const photosByDate = {};

  for (const file of files) {
    const date = parseDate(file);
    if (!date) {
      console.warn(`Skipping file with unrecognized format: ${file}`);
      continue;
    }

    if (!photosByDate[date]) {
      photosByDate[date] = [];
    }
    photosByDate[date].push({
      image: `image/${file}`,
      caption: ''
    });
  }

  // Sort photos within each date (main photo first, then variants)
  for (const date of Object.keys(photosByDate)) {
    photosByDate[date].sort((a, b) => {
      const aName = path.basename(a.image);
      const bName = path.basename(b.image);
      // Files without parentheses come first
      const aHasVariant = aName.includes('(');
      const bHasVariant = bName.includes('(');
      if (aHasVariant !== bHasVariant) return aHasVariant ? 1 : -1;
      return aName.localeCompare(bName);
    });
  }

  // Convert to array (no need to include date - HTML extracts it from filename)
  const timeline = Object.keys(photosByDate)
    .sort((a, b) => b.localeCompare(a))
    .map(date => ({
      photos: photosByDate[date]
    }));

  // Write to data.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(timeline, null, 2) + '\n');

  console.log(`Generated timeline with ${timeline.length} entries and ${files.length} photos`);
}

generateTimeline();
