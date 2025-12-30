const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configuration
const config = {
  recipes: {
    contentDir: 'content/recipes',
    outputDir: 'food_gallery',
    template: null  // Will be loaded dynamically
  },
  nightStall: {
    contentDir: 'content/night-stall',
    outputDir: 'night_stall_food',
    template: null
  },
  projects: {
    contentDir: 'content/projects',
    outputDir: 'projects',
    template: null
  }
};

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
} else {
  console.log('⚠️  Skipping recipes - template not found');
}

if (config.nightStall.template) {
  generateHTML('night-stall', config.nightStall);
} else {
  console.log('⚠️  Skipping night-stall - template not found');
}

if (config.projects.template) {
  generateHTML('projects', config.projects);
} else {
  console.log('⚠️  Skipping projects - template not found');
}

console.log('\n✅ Build complete!');
