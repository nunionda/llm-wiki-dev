import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use absolute paths to be execution-context independent
const WIKI_DIR = path.resolve(__dirname, '../../wiki');
const OUTPUT_FILE = path.resolve(__dirname, '../src/docs-manifest.json');

function generateManifest() {
  const manifest = {
    pages: [],
    workspaces: [
      { name: 'llm-wiki-dev', source: 'wiki' }
    ],
    lastUpdated: new Date().toISOString(),
  };

  console.log(`\x1b[36m[Manifest Engine]\x1b[0m Crawling: ${WIKI_DIR}`);

  // Crawl wiki/pages
  const pagesDir = path.join(WIKI_DIR, 'pages');
  if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
    files.forEach(file => {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      
      // Parse frontmatter
      const fmMatch = content.match(/---([\s\S]*?)---/);
      let title = file.replace('.md', '');
      let category = 'general';
      
      if (fmMatch) {
         const fmLines = fmMatch[1].split('\n');
         const titleLine = fmLines.find(line => line.startsWith('title:'));
         const categoryLine = fmLines.find(line => line.startsWith('category:'));
         
         if (titleLine) title = titleLine.split(':')[1].trim().replace(/["']/g, '');
         if (categoryLine) category = categoryLine.split(':')[1].trim().replace(/["']/g, '');
      }
      
      manifest.pages.push({
        id: `llm-wiki-dev-${file.replace('.md', '')}`,
        originalId: file.replace('.md', ''),
        title: title,
        category: category,
        workspace: 'llm-wiki-dev',
        path: `/workspaces/llm-wiki-dev/wiki/pages/${file}`,
        fileName: file,
      });
    });
  }

  // Crawl wiki/raw
  const rawDir = path.join(WIKI_DIR, 'raw');
  if (fs.existsSync(rawDir)) {
    const files = fs.readdirSync(rawDir).filter(file => file.endsWith('.md'));
    files.forEach(file => {
      manifest.pages.push({
        id: `llm-wiki-dev-${file.replace('.md', '')}`,
        originalId: file.replace('.md', ''),
        title: `RAW: ${file.replace('.md', '').toUpperCase()}`,
        category: 'research',
        workspace: 'llm-wiki-dev',
        path: `/workspaces/llm-wiki-dev/wiki/raw/${file}`,
        fileName: file,
      });
    });
  }

  // Crawl wiki root
  ['WIKI_SCHEMA.md', 'index.md', 'log.md'].forEach(file => {
    if (fs.existsSync(path.join(WIKI_DIR, file))) {
      manifest.pages.push({
        id: `llm-wiki-dev-${file.replace('.md', '')}`,
        originalId: file.replace('.md', ''),
        title: file.replace('.md', '').toUpperCase(),
        category: 'meta',
        workspace: 'llm-wiki-dev',
        path: `/workspaces/llm-wiki-dev/wiki/${file}`,
        fileName: file,
        isRoot: true,
      });
    } else if (fs.existsSync(path.join(WIKI_DIR, '..', file))) {
        // Handle files in project root
        manifest.pages.push({
            id: `llm-wiki-dev-${file.replace('.md', '')}`,
            originalId: file.replace('.md', ''),
            title: file.replace('.md', '').toUpperCase(),
            category: 'meta',
            workspace: 'llm-wiki-dev',
            path: `/workspaces/llm-wiki-dev/${file}`,
            fileName: file,
            isRoot: true,
        });
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`\x1b[32m[Manifest Success]\x1b[0m Generated at ${OUTPUT_FILE}`);
}

generateManifest();
