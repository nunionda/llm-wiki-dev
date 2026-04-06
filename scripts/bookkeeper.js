import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_LOG_PATH = path.resolve(__dirname, '../wiki/log.md');
const UI_LOG_PATH = path.resolve(__dirname, '../wiki-docs/src/delivery-log.json');

const WIKI_INDEX_PATH = path.resolve(__dirname, '../wiki/index.md');
const WIKI_RELATIONS_PATH = path.resolve(__dirname, '../wiki/relations.json');

function runBookkeeper() {
  console.log(`\x1b[35m[Bookkeeper Engine]\x1b[0m Starting Intelligent Stewardship...`);

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
  const entities = files.map(f => f.replace('.md', ''));
  let linkCount = 0;
  
  const relations = { nodes: [], links: [] };

  const nodeStats = files.map(file => {
    const filePath = path.join(WIKI_PAGES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const nodeId = file.replace('.md', '');
    const originalContent = content;
    
    // Extract Metadata for Index
    const titleMatch = content.match(/title:\s*(.*)/);
    const categoryMatch = content.match(/category:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].replace(/["']/g, '') : nodeId;
    const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';

    // 1. Auto-linking
    entities.forEach(entity => {
      if (entity === nodeId) return;
      // Match plain text version of entity and wrap in [[ ]]
      const entityLabel = entity.replace(/-/g, ' ');
      const regex = new RegExp(`(?<!\\[\\[)${entityLabel}(?!\\]\\])`, 'gi');
      content = content.replace(regex, (match) => {
        linkCount++;
        return `[[${match}]]`;
      });
    });

    if (content !== originalContent) fs.writeFileSync(filePath, content);
    
    // 2. Build Relations for Graph
    relations.nodes.push({ id: nodeId, title, category });
    const internalLinks = content.match(/\[\[(.*?)\]\]/g);
    if (internalLinks) {
      internalLinks.forEach(l => {
        const targetLabel = l.slice(2, -2);
        const targetId = targetLabel.toLowerCase().replace(/\s+/g, '-');
        // Only keep links to existing wiki pages
        if (entities.includes(targetId)) {
          relations.links.push({ source: nodeId, target: targetId, value: 1 });
        }
      });
    }
    
    return { id: nodeId, title, category, links: content.split('[[').length - 1 };
  });

  updateIndex(nodeStats);
  updateRelations(relations);
  appendMarkdownLog(files.length, linkCount);
  updateUILog(linkCount);
  console.log(`\x1b[32m[Bookkeeper Success]\x1b[0m ${linkCount} cross-references established.`);
  
  // Antigravity Summary Report
  console.log(`\x1b[35m[Summary Report]\x1b[0m Nodes: ${files.length} | Links: ${linkCount} | Log: wiki/log.md`);
}

function updateIndex(stats) {
  let indexContent = `# Wiki Index\n\n> This index is autonomously maintained by the GStack Bookkeeper.\n\n`;
  
  const categories = [...new Set(stats.map(s => s.category))];
  categories.forEach(cat => {
    indexContent += `## ${cat}\n`;
    stats.filter(s => s.category === cat).forEach(s => {
      indexContent += `- [[${s.id}]] | **${s.title}** (_${s.links} links_)\n`;
    });
    indexContent += `\n`;
  });

  fs.writeFileSync(WIKI_INDEX_PATH, indexContent);
  console.log(`\x1b[34m[Action: Index]\x1b[0m Regenerated index.md with ${stats.length} nodes.`);
}

function updateRelations(relations) {
  fs.writeFileSync(WIKI_RELATIONS_PATH, JSON.stringify(relations, null, 2));
  console.log(`\x1b[34m[Action: Relations]\x1b[0m Regenerated relations.json with ${relations.links.length} connections.`);
}


function appendMarkdownLog(nodes, links) {
  const timestamp = new Date().toISOString().split('T')[0];
  const logEntry = `\n## [${timestamp}] bookkeeper | Audit successful. ${nodes} nodes, ${links} new connections.`;
  fs.appendFileSync(WIKI_LOG_PATH, logEntry);
}

function updateUILog(links) {
  if (!fs.existsSync(UI_LOG_PATH)) return;

  const log = JSON.parse(fs.readFileSync(UI_LOG_PATH, 'utf-8'));
  const newAction = {
    id: `bookkeeper-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'bookkeeper',
    message: `Compounding Synthesis: ${links} cross-references established. Existing entities successfully reconciled and augmented.`,
    target: "Knowledge Persistence Layer",
    status: "success"
  };

  log.actions.unshift(newAction);
  if (log.actions.length > 20) log.actions.pop();

  fs.writeFileSync(UI_LOG_PATH, JSON.stringify(log, null, 2));
}

runBookkeeper();
