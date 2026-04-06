import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_RELATIONS_PATH = path.resolve(__dirname, '../wiki/relations.json');
const LINTER_REPORT_PATH = path.resolve(__dirname, '../wiki-docs/src/linter-report.json');

function runLinter() {
  console.log(`\x1b[35m[Wiki Linter]\x1b[0m Auditing integrity of the knowledge codebase...`);

  if (!fs.existsSync(WIKI_PAGES_DIR)) return;

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
  const pageIds = files.map(f => f.replace('.md', ''));
  let relations = { links: [] };
  
  if (fs.existsSync(WIKI_RELATIONS_PATH)) {
    try {
      relations = JSON.parse(fs.readFileSync(WIKI_RELATIONS_PATH, 'utf-8'));
    } catch (e) {
      console.warn(`[Linter] Error parsing relations.json: ${e.message}`);
    }
  }
  
  const issues = [];

  // 1. Orphan Detection (Improved)
  const inboundLinks = new Set(relations.links ? relations.links.map(l => l.target) : []);
  pageIds.forEach(id => {
    if (!inboundLinks.has(id) && !['index', 'global-strategy-matrix', 'log'].includes(id)) {
      issues.push({ 
        type: 'ORPHAN', 
        node: id, 
        severity: 'low', 
        msg: 'No inbound links detected. Page is isolated from the graph.' 
      });
    }
  });

  // 2. Staleness, Semantic Conflict & Broken Link Detection
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  files.forEach(file => {
    const filePath = path.join(WIKI_PAGES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    const nodeId = file.replace('.md', '');

    // Staleness (90 days for wiki nodes)
    if (stats.mtime < ninetyDaysAgo) {
      issues.push({ 
        type: 'STALE', 
        node: nodeId, 
        severity: 'low', 
        msg: `Node hasn't been augmented or reviewed in over 90 days.` 
      });
    }

    // Semantic Contradictions (Adhering to WIKI_SCHEMA.md [!CAUTION])
    if (content.includes('[!CAUTION]') || content.includes('!!conflict')) {
      issues.push({ 
        type: 'CONTRADICTION', 
        node: nodeId, 
        severity: 'high', 
        msg: 'Active semantic contradiction detected. Human reconciliation required.' 
      });
    }

    // Data Gap Detection (Uncreated Links)
    const internalLinks = content.match(/\[\[(.*?)\]\]/g);
    if (internalLinks) {
        internalLinks.forEach(l => {
            const targetLabel = l.slice(2, -2);
            const targetId = targetLabel.toLowerCase().replace(/\s+/g, '-');
            if (!pageIds.includes(targetId)) {
                issues.push({
                    type: 'DATA_GAP',
                    node: nodeId,
                    target: targetId,
                    severity: 'medium',
                    msg: `Knowledge Gap: [[${targetLabel}]] is mentioned but has no dedicated page.`
                });
            }
        });
    }
  });

  // Save Report for UI
  fs.writeFileSync(LINTER_REPORT_PATH, JSON.stringify({ issues, lastUpdated: new Date().toISOString() }, null, 2));
  
  // Log Audit (Unix-Friendly)
  const logFile = path.resolve(__dirname, '../wiki/log.md');
  const dateStr = new Date().toISOString().split('T')[0];
  fs.appendFileSync(logFile, `\n## [${dateStr}] lint | Audit Complete: ${issues.length} issues found | ${new Date().toISOString()}\n`);

  reportIssues(issues);
}

function reportIssues(issues) {
  if (issues.length === 0) {
    console.log(`\x1b[32m[Linter Success]\x1b[0m No integrity issues detected. The wiki is healthy.`);
    return;
  }

  console.log(`\x1b[33m[Linter Warning]\x1b[0m Found ${issues.length} potential integrity issues:`);
  
  const grouped = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || []);
    acc[issue.type].push(issue);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([type, items]) => {
    console.log(`\n\x1b[1m${type}\x1b[0m (${items.length}):`);
    items.forEach(it => {
      const color = it.severity === 'high' ? '\x1b[31m' : it.severity === 'medium' ? '\x1b[33m' : '\x1b[34m';
      console.log(`  ${color}●\x1b[0m [${it.node}] ${it.msg}`);
    });
  });

  if (issues.some(it => it.severity === 'high')) {
    console.log(`\x1b[31m[Critical Failure]\x1b[0m Semantic integrity compromised. Immediate resolution required.`);
  }
}

runLinter();
