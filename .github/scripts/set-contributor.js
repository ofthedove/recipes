const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const recipesDir = path.join(process.cwd(), '_recipes');

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n');
}

async function getContributorName() {
  const prAuthorLogin = process.env.PR_AUTHOR_LOGIN;

  if (!prAuthorLogin) {
    throw new Error('PR_AUTHOR_LOGIN is required but was not provided.');
  }

  // Skip contributor update for bot authors
  if (prAuthorLogin.endsWith('[bot]')) {
    console.log(`Skipping contributor update for bot author: ${prAuthorLogin}`);
    return null;
  }

  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'recipes-contributor-updater'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(prAuthorLogin)}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user profile for ${prAuthorLogin}: ${response.status} ${response.statusText}`);
  }

  const user = await response.json();
  return (user.name && user.name.trim()) || prAuthorLogin;
}

// Extract frontmatter and body from markdown file
function parseFrontmatter(content) {
  const normalized = normalizeLineEndings(content);
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = normalized.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: normalized };
  }

  const frontmatter = yaml.load(match[1]) || {};
  const body = match[2];

  return { frontmatter, body };
}

// Process all recipe files
async function processRecipes() {
  const contributorName = await getContributorName();

  if (contributorName === null) {
    return;
  }

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

    // Check if this is a new file with default contributor
    if (frontmatter.contributor === 'default-contributor') {
      const newContributor = contributorName;

      // Update frontmatter with new contributor
      frontmatter.contributor = newContributor;

      // Reconstruct file content
      const newContent = `---\n${yaml.dump(frontmatter, { lineWidth: -1 }).trim()}\n---\n${body}`;

      // Just update the contributor in frontmatter
      console.log(`Updating contributor in: ${filename}`);
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  });
}

processRecipes()
  .then(() => {
    console.log('Recipe contributor processing complete');
  })
  .catch(error => {
    console.error('Error processing recipes:', error);
    process.exit(1);
  });
