const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configuration
const config = {
  recipes: {
    contentDir: 'content/recipes',
    outputDir: 'food_gallery',
    template: null,
    hubPage: 'food_gallery/food_gallery.html',
    placeholder: '<!-- TEMPLATE_RECIPES_PLACEHOLDER -->',
    cardType: 'recipe'
  },
  nightStall: {
    contentDir: 'content/night-stall',
    outputDir: 'night_stall_food',
    template: null,
    hubPage: 'night_stall_food/night_stall_food.html',
    placeholder: '<!-- TEMPLATE_NIGHT_STALL_PLACEHOLDER -->',
    cardType: 'nightStall'
  },
  projects: {
    contentDir: 'content/projects',
    outputDir: 'projects',
    template: null
  }
};


// Generate JSON data file for hub page
function generateDataFile(section) {
  const { contentDir, outputDir, cardType } = section;

  if (!fs.existsSync(contentDir)) return;

  // Read all markdown files
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  // Generate data array
  const items = files.map(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const htmlFileName = file.replace('.md', '.html');

    return {
      href: htmlFileName,
      title: data.title,
      emoji: data.emoji || (cardType === 'recipe' ? '🍽️' : '🍜'),
      description: data.cardDescription || data.subtitle || data.englishName || '',
      searchTerms: data.searchTerms || data.title.toLowerCase()
    };
  });

  // Write JSON file
  const jsonPath = path.join(outputDir, 'data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

  console.log(`✓ Generated data file: ${jsonPath} (${items.length} items)`);
}

// Generate HTML from markdown
function generateHTML(sectionName, section) {
  const { contentDir, outputDir, template } = section;

  // Skip if content directory doesn't exist yet
  if (!fs.existsSync(contentDir)) {
    console.log(`⚠️  Skipping ${sectionName} - content directory doesn't exist yet`);
    return;
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read all markdown files
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log(`⚠️  No markdown files found in ${contentDir}`);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter and content
    const { data, content } = matter(fileContent);

    // Convert markdown to HTML
    const htmlContent = marked.parse(content);

    // Generate final HTML using template
    const finalHTML = template(data, htmlContent);

    // Write to output file
    const outputFileName = file.replace('.md', '.html');
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, finalHTML);

    console.log(`✓ Generated ${outputPath}`);
  });
}

// Load templates dynamically (only if they exist)
function loadTemplate(templatePath) {
  if (fs.existsSync(templatePath)) {
    return require(templatePath);
  }
  return null;
}

// Build all sections
console.log('Building site...\n');

// Load templates
config.recipes.template = loadTemplate('./templates/recipe.js');
config.nightStall.template = loadTemplate('./templates/night-stall.js');
config.projects.template = loadTemplate('./templates/project.js');

// Generate HTML for each section
if (config.recipes.template) {
  generateHTML('recipes', config.recipes);
  generateDataFile(config.recipes);
} else {
  console.log('⚠️  Skipping recipes - template not found');
}

if (config.nightStall.template) {
  generateHTML('night-stall', config.nightStall);
  generateDataFile(config.nightStall);
} else {
  console.log('⚠️  Skipping night-stall - template not found');
}

if (config.projects.template) {
  generateHTML('projects', config.projects);
} else {
  console.log('⚠️  Skipping projects - template not found');
}

console.log('\n✅ Build complete!');
