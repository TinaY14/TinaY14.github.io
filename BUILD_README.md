# Website Build System

This website uses a simple build system to generate HTML pages from Markdown content. This makes managing content much easier - you write in Markdown, run the build script, and HTML files are automatically generated.

## Quick Start

### Building the Site

```bash
npm run build
```

This generates all HTML files from your Markdown content.

## Adding New Content

### Adding a New Recipe

1. Create a new markdown file in `content/recipes/`:
   ```
   content/recipes/your-recipe-name.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: Your Recipe Name
   subtitle: Short description
   emoji: 🍕
   hasImage: true
   ---

   # 📖 About This Recipe

   Description here...

   # 🥄 Ingredients

   - Ingredient 1
   - Ingredient 2

   # 👩‍🍳 Instructions

   **Step 1: Prepare**

   1. First instruction
   2. Second instruction

   # 💡 Tips

   - Tip 1
   - Tip 2
   ```

3. Run `npm run build`

4. Your HTML file is generated at `food_gallery/your-recipe-name.html`

### Adding Night Stall Food

1. Create markdown file in `content/night-stall/`
2. Add frontmatter with `title`, `chineseName`, `englishName`
3. Run `npm run build`
4. HTML generated in `night_stall_food/`

### Adding a Project

1. Create markdown file in `content/projects/`
2. Add frontmatter with `title` (quote it if it contains colons!)
3. Run `npm run build`
4. HTML generated in `projects/`

## File Structure

```
├── content/              # Your markdown content (edit these!)
│   ├── recipes/         # Recipe markdown files
│   ├── night-stall/     # Night stall food markdown
│   └── projects/        # Project markdown files
├── templates/           # HTML templates (rarely need to edit)
│   ├── recipe.js
│   ├── night-stall.js
│   └── project.js
├── build.js            # Build script
├── package.json        # Dependencies
├── food_gallery/       # Generated recipe HTML
├── night_stall_food/   # Generated night stall HTML
└── projects/           # Generated project HTML
```

## Important Notes

1. **Always run `npm run build` after making changes to markdown files**
2. **Frontmatter titles with colons must be quoted:** `title: "My Title: Subtitle"`
3. **Generated HTML files should be committed to git** (GitHub Pages needs them)
4. **Markdown files are your "source of truth"** - they're small and easy to edit

## Benefits

- ✅ **Smaller files** - Markdown is much more compact than HTML
- ✅ **Easier to edit** - No HTML boilerplate to maintain
- ✅ **Consistency** - All pages use the same templates
- ✅ **Quick updates** - Change navigation once in templates, rebuild, done!
- ✅ **Dark mode preserved** - All generated pages have dark mode support

## Need Help?

- Templates are in `templates/` folder
- Build script is `build.js`
- Dependencies: just `marked` (markdown parser) and `gray-matter` (frontmatter parser)
