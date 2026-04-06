import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_INDEX_PATH = path.resolve(__dirname, '../wiki/index.md');

function extractSummary(content) {
  // Strip frontmatter
  const body = content.replace(/---[\s\S]*?---/, '').trim();
  // Get first sentence or first 120 chars
  const firstParagraph = body.split('\n')[0].trim();
  const summary = firstParagraph.length > 120 ? firstParagraph.slice(0, 117) + '...' : firstParagraph;
  return summary || "No summary available.";
}

function extractMetadata(content) {
  const titleMatch = content.match(/title: "(.*?)"/);
  const categoryMatch = content.match(/category: "(.*?)"/);
  return {
    title: titleMatch ? titleMatch[1] : "Untitled",
    category: categoryMatch ? categoryMatch[1].replace(/\"/g, '') : "Uncategorized"
  };
}

function rebuildIndex() {
  console.log(`\x1b[35m[Cataloger]\x1b[0m Synchronizing Full Wiki Index...`);

  if (!fs.existsSync(WIKI_PAGES_DIR)) return;

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
  const nodes = [];

  for (const file of files) {
    const id = file.replace('.md', '');
    const content = fs.readFileSync(path.join(WIKI_PAGES_DIR, file), 'utf-8');
    const meta = extractMetadata(content);
    const summary = extractSummary(content);
    nodes.push({ id, ...meta, summary });
  }

  let indexContent = "# Wiki Index: Knowledge Dashboard\n\n";
  indexContent += "| Node | Category | Status | Updated | Summary |\n";
  indexContent += "| :--- | :--- | :--- | :--- | :--- |\n";

  nodes.sort((a, b) => a.id.localeCompare(b.id)).forEach(node => {
    const summary = node.summary.replace(/\|/g, '\\|'); // Escape pipes for Markdown table
    indexContent += `| [[${node.id}]] | ${node.category || 'N/A'} | ${node.status || 'N/A'} | ${node.last_updated || 'N/A'} | ${summary} |\n`;
  });

  fs.writeFileSync(WIKI_INDEX_PATH, indexContent);
  console.log(`\x1b[32m[Success]\x1b[0m Index synchronized: ${files.length} nodes cataloged with summaries.`);
}

rebuildIndex();
