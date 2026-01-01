# Copilot Instructions for Recipes Site

## Project Overview
This is a Jekyll-based static recipe website deployed to GitHub Pages. It uses the Minima theme and Decap CMS (formerly Netlify CMS) for content management. The site is available at `https://ofthedove.github.io/recipes`.

## Architecture & Structure

### Collections
- **`_recipes/`**: Main recipe collection defined in `_config.yml` with `output: true`
  - Each recipe is a markdown file with frontmatter (`layout: recipe`, `title`)
  - Recipe files use **PascalCase naming** (e.g., `MeatloafMom.md`, `RedBeansAndRice.md`) - NOT hyphens
  - First paragraph becomes the excerpt shown on listing pages
- **`_posts/`**: Blog posts for announcements/updates
- **`_layouts/`**: Custom layouts like `recipe.html` which adds print functionality and tag display
- **Pages**: Top-level markdown files like `Links.md`, `Thanksgiving.md`, `MealPlanning.md`

### Recipe File Format
Standard structure (see `Biscuits_Easy.md` or `Arayes.md`):
```markdown
---
layout: recipe
title: Recipe Name
---

Description paragraph(s). First paragraph is the excerpt.

## Ingredients
- Bullet list of ingredients

## Instructions
- Steps as bullets, numbered list, or paragraphs

## Notes (optional)
- Variations, tips, or history
```

Some recipes include `<div class="noprint">` sections for cooking notes/history that won't appear on printed versions.

## Decap CMS Configuration

**Critical**: The CMS config at `admin/config.yml` controls how new recipes are created:
- Uses GitHub backend with open authoring and editorial workflow
- Default recipe template is defined in `admin/config.yml` under the recipes collection
- Auth handled by Sveltia CMS Auth worker at `https://sveltia-cms-auth.andrewcombs13.workers.dev`
  - The CMS auth worker is configured at dash.cloudflare.com

## Development Workflow

### Local Development
```bash
bundle exec jekyll serve
```
Serves site at `http://localhost:4000/recipes`. Note the `/recipes` baseurl from `_config.yml`.

**Important**: Changes to `_config.yml` require restarting the Jekyll server.

### Deployment
- Automatic via GitHub Actions on push to `main` branch
- Workflow: `.github/workflows/github-pages.yml` builds and deploys to `gh-pages` branch
- Uses `helaili/jekyll-action@2.4.0` with bundle caching

### Dependencies
- Ruby-based (Jekyll ~> 4.3.1, Minima theme ~> 2.5)
- Install with: `bundle install`
- Gemfile includes platform-specific gems for Windows/JRuby

## Naming Conventions

1. **Recipe files**: Use PascalCase with underscores for variants (e.g., `Biscuits_Easy.md`, `Pancakes_Babish.md`)
2. **Page files**: Can use PascalCase or regular capitalization (e.g., `Links.md`, `Thanksgiving.md`)
3. **Frontmatter titles**: Use human-readable format with spaces (e.g., `title: Biscuits (Easy)`)

## Common Operations

### Adding a Recipe
1. Create new `.md` file in `_recipes/` using PascalCase filename
2. Add frontmatter with `layout: recipe` and `title`
3. Follow standard sections: description, Ingredients, Instructions, Notes

### Modifying Recipes
- Recipes are plain markdown - edit directly
- Use `{% link _recipes/FileName.md %}` for internal links in index pages
- Images go in `assets/uploads/` (configured in Decap CMS)

### Bulk Operations
- See `fix.js` for an example migration script that added frontmatter to existing recipes
- Script extracts H1 titles and injects Jekyll frontmatter

## Key Files
- `_config.yml`: Jekyll configuration, collections, baseurl
- `admin/config.yml`: Decap CMS configuration for recipe creation
- `Recipes.md`: Auto-generated full recipe list using `site.recipes`
- `index.markdown`: Manually curated categorized recipe links
- `_layouts/recipe.html`: Recipe template with print button and tag support
