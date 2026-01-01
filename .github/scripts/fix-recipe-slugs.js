const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const recipesDir = path.join(process.cwd(), '_recipes');

// Convert title to PascalCase
function toPascalCase(title) {
  // Remove common punctuation and special characters
  let cleaned = title
    .replace(/[""'']/g, '') // Remove quotes
    .replace(/[^\w\s()-]/g, '') // Keep only word chars, spaces, hyphens, parens
    .trim();
  
  // Handle parentheses - convert to underscores
  // e.g., "Biscuits (Easy)" -> "Biscuits_Easy"
  cleaned = cleaned.replace(/\s*\(\s*/g, '_').replace(/\s*\)\s*/g, '');
  
  // Split on spaces and hyphens
  const words = cleaned.split(/[\s-]+/);
  
  // Capitalize first letter of each word and join
  const pascalCase = words
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  return pascalCase || 'NewRecipe';
}

// Extract frontmatter and body from markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatter = yaml.load(match[1]) || {};
  const body = match[2];
  
  return { frontmatter, body };
}

// Process all recipe files
function processRecipes() {
  const files = fs.readdirSync(recipesDir);
  
  files.forEach(filename => {
    const filePath = path.join(recipesDir, filename);
    
    // Skip non-markdown files
    if (!filename.endsWith('.md')) {
      return;
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Check if this is a new recipe with default slug
    if (frontmatter.slug === 'new-recipe' && frontmatter.title) {
      const newSlug = toPascalCase(frontmatter.title);
      const newFilename = `${newSlug}.md`;
      const newFilePath = path.join(recipesDir, newFilename);
      
      // Update frontmatter with new slug
      frontmatter.slug = newSlug;
      
      // Reconstruct file content
      const newContent = `---\n${yaml.dump(frontmatter, { lineWidth: -1 }).trim()}\n---\n${body}`;
      
      // If filename needs to change
      if (filename !== newFilename) {
        console.log(`Renaming: ${filename} -> ${newFilename}`);
        
        // Delete old file if it's not already the correct name
        if (fs.existsSync(filePath) && filePath !== newFilePath) {
          fs.unlinkSync(filePath);
        }
        
        // Write new file
        fs.writeFileSync(newFilePath, newContent, 'utf8');
      } else {
        // Just update the slug in frontmatter
        console.log(`Updating slug in: ${filename}`);
        fs.writeFileSync(filePath, newContent, 'utf8');
      }
    }
  });
}

try {
  processRecipes();
  console.log('Recipe slug processing complete');
} catch (error) {
  console.error('Error processing recipes:', error);
  process.exit(1);
}
