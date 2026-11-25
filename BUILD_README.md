# Updating the site

Run `npm ci` once, then `npm run build` after changing content.
Preview the repository with `python3 -m http.server 3000`.

## Content collections

- Food Diary uses `food_gallery/data.json` and dated photos under `food_gallery/image/YYYY/MM/`. See `food_gallery/README.md`.
- Street Food Notes is a topic inside Food Diary. Its Markdown sources live in `content/food/`.
- My Kitchen displays photos from `food_gallery/data.json` with `collection: kitchen`. Food Diary displays `collection: diary`. Both use the year/month archive and photo notebook.
- Recipe text is retained in `content/kitchen/`. The three earlier recipes have `published: false` and are excluded from the collection list.
- Journal articles live in `content/journal/`. The older `blogs/posts.md` is retained as an archive and is no longer read by the website.
- Projects & Research uses `content/projects/` for new project pages and the existing manually authored project pages. Existing project HTML is preserved during builds. Its index is `projects/projects.html`.

## Add a Journal article or kitchen recipe

Create a new Markdown file with a unique filename in the appropriate content folder.
The filename becomes its page URL. Use this frontmatter, then write the article below it.

```markdown
---
title: "A day in the teaching kitchen"
date: "2026-11-25"
excerpt: "A short introduction for the article card."
images:
  - "../blogs/images/my-event/photo.jpg"
---

## What we made

Write your story here.
```

For kitchen recipes use `image: "../images/food/my-dish.jpg"` and `subtitle` or
`cardDescription` for the card text. Include ingredients, quantities, steps,
and reflections in the Markdown body.

Run `npm run build`. Journal and My Kitchen indexes and article pages update
automatically. Adding entries requires no navigation or JavaScript edits.
Keep original photo and article filenames stable after publication.

The build normalizes navigation across every page. Edit the shared destinations
in `scripts/build-navigation.js` when changing the main sections. Generated
collection pages use `templates/collection.js` and shared palette variables in
`styles.css`.

Push to main to run the GitHub Pages workflow. GitHub repository Settings →
Pages → Build and deployment → Source must be GitHub Actions.

The archive uses scroll-driven perspective chapters and side-dot navigation. Reduced-motion preferences disable the perspective animation. Clicking a content photo opens the shared notebook viewer in `photo-journal.js`. Theme choice persists when moving between sections.
