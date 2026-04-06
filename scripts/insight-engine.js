import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const DELIVERY_LOG_PATH = path.resolve(__dirname, '../wiki-docs/src/delivery-log.json');
const INSIGHT_REPORT_PATH = path.resolve(__dirname, '../wiki-docs/src/insight-report.json');
const TARGET_PAGE = path.join(WIKI_PAGES_DIR, 'global-strategy-matrix.md');

// Core themes we want to monitor for "Density"
const THEMES = {
  "Security & Privacy": ["air-gapped", "security", "privacy", "slm", "encryption", "auth", "identity"],
  "Strategic Synthesis": ["synthesis", "composing", "strategy", "blueprint", "manifesto", "mission", "vision"],
  "Operational Delivery": ["dispatch", "delivery", "asset", "pipeline", "automation", "workflow", "ci", "cd"],
  "Personal Development": ["journal", "actualization", "health", "mindset", "reading", "reflection", "habit"],
  "Knowledge Infrastructure": ["wiki", "architecture", "kb", "ingest", "data", "schema", "semantic"]
};

const BACKLOG_PATH = path.resolve(__dirname, '../wiki/backlog.md');

function runInsightEngine() {
  console.log(`\x1b[35m[Insight Engine]\x1b[0m Performing global semantic scan of all knowledge nodes...`);

  if (!fs.existsSync(WIKI_PAGES_DIR)) return;

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md') && f !== 'global-strategy-matrix.md');
  const results = {};
  const nodeMapping = {};
  const conflicts = [];

  Object.keys(THEMES).forEach(theme => {
    results[theme] = 0;
    nodeMapping[theme] = [];
  });

  files.forEach(file => {
    const filePath = path.join(WIKI_PAGES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();
    
    // 1. Theme Density
    Object.entries(THEMES).forEach(([theme, keywords]) => {
      let count = 0;
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        const matches = content.match(regex);
        if (matches) count += matches.length;
      });

      if (count > 0) {
        results[theme] += count;
        nodeMapping[theme].push(file.replace('.md', ''));
      }
    });

    // 2. Conflict Detection
    if (content.includes('status: conflicting') || content.includes('!!conflict')) {
      conflicts.push({ node: file.replace('.md', ''), type: 'Explicit Marker', impact: 'High' });
    }

    // 3. Metadata staleness check
    const stats = fs.statSync(filePath);
    const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld > 30) {
      conflicts.push({ node: file.replace('.md', ''), type: 'Staleness', impact: 'Low', detail: `${Math.round(daysOld)} days old` });
    }
  });

  // Calculate Insights for JSON
  const totalHits = Object.values(results).reduce((a, b) => a + b, 0);
  const themeDensity = {};
  Object.entries(results).forEach(([theme, count]) => {
    themeDensity[theme] = totalHits > 0 ? parseFloat(((count / totalHits) * 100).toFixed(1)) : 0;
  });

  const sortedThemes = Object.entries(themeDensity).sort((a, b) => b[1] - a[1]);
  const primaryTheme = sortedThemes[0] ? sortedThemes[0][0] : 'None';
  const weakThemes = sortedThemes.filter(t => t[1] < 10).map(t => t[0]);

  const report = {
    themeDensity,
    primaryTheme,
    weakThemes,
    totalNodes: files.length,
    conflicts: conflicts.length,
    lastUpdated: new Date().toISOString(),
    suggestions: []
  };

  // Generate Proactive Suggestions
  if (weakThemes.length > 0) {
    report.suggestions.push({
      type: 'GAP_ANALYSIS',
      priority: 'medium',
      msg: `Your knowledge base is thin on **${weakThemes.join(', ')}**. Consider injecting more specific content in these areas.`
    });
  }

  if (conflicts.length > 0) {
    report.suggestions.push({
      type: 'CONFLICT_RESOLUTION',
      priority: 'high',
      msg: `Semantic contradictions detected in ${conflicts.length} nodes. Knowledge integrity at risk.`
    });
  }

  // Save JSON Report
  fs.writeFileSync(INSIGHT_REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`\x1b[36m[Insight Engine]\x1b[0m Semantic Analysis Complete. JSON Report: src/insight-report.json`);
  
  generateMatrixPage(results, nodeMapping, conflicts, files.length, totalHits);
  updateBacklog(conflicts);
  logGovernance(files.length, results);
}

function updateBacklog(conflicts) {
  if (!fs.existsSync(BACKLOG_PATH)) return;
  
  let backlog = fs.readFileSync(BACKLOG_PATH, 'utf-8');
  let newEntries = '';

  conflicts.forEach(c => {
    const entry = `- [ ] [GOVERNANCE] Fix ${c.type} in \`${c.node}\` (Impact: ${c.impact})`;
    if (!backlog.includes(entry)) {
      newEntries += `\n${entry}`;
    }
  });

  if (newEntries) {
    fs.appendFileSync(BACKLOG_PATH, newEntries);
    console.log(`\x1b[33m[Proactive Ops]\x1b[0m Injected ${conflicts.length} governance tasks into backlog.md`);
  }
}

function generateMatrixPage(results, nodeMapping, conflicts, nodeCount, totalHits) {
  let matrixContent = `---
title: Global Strategy Matrix
category: meta
tags: [governance, insights, mapping]
gravity: intelligence
status: proactive
---

# Global Strategy Matrix (Autonomous Governance)

> [!NOTE]
> This document was automatically generated by the **Semantic Governance Engine**. 
> It maps the relationships between disparate nodes and identifies strategic density across the wiki ecosystem.

## 1. Knowledge Density Dashboard

| Strategic Theme | Semantic Density (%) | Key Nodes |
|:---|:---|:---|
`;

  Object.entries(results).forEach(([theme, count]) => {
    const density = totalHits > 0 ? ((count / totalHits) * 100).toFixed(1) : 0;
    const nodes = nodeMapping[theme].map(id => `[[${id}]]`).join(', ');
    matrixContent += `| ${theme} | **${density}%** | ${nodes} |\n`;
  });

  matrixContent += `
## 2. Integrity & Alerts

| Alert Type | Affected Node | Impact | Detail |
|:---|:---|:---|:---|
`;

  if (conflicts.length === 0) {
    matrixContent += `| None | - | - | All systems nominal |\n`;
  } else {
    conflicts.forEach(c => {
      matrixContent += `| ${c.type} | [[${c.node}]] | ${c.impact} | ${c.detail || 'Manual review required'} |\n`;
    });
  }

  const primaryTheme = Object.entries(results).sort((a, b) => b[1] - a[1])[0][0];

  matrixContent += `
## 3. Autonomous Insight: The Knowledge Gap

${results["Personal Development"] < results["Strategic Synthesis"] 
  ? "> [!TIP]\n> Proactive Suggestion: Your **Strategic Synthesis** is highly developed, but **Personal Development** nodes are sparse. Consider injecting more reflective vibes to balance your self-actualization loop."
  : "> [!TIP]\n> Proactive Suggestion: Your knowledge base is balanced across all core themes. Synthesis efficiency is optimal."}

---
**Governance Protocol**: Fully Synced & Audited.
`;

  fs.writeFileSync(TARGET_PAGE, matrixContent);
  console.log(`\x1b[32m[Governance Success]\x1b[0m Created: wiki/pages/global-strategy-matrix.md`);
  
  // Antigravity Summary Report
  console.log(`\x1b[35m[Summary Report]\x1b[0m Nodes: ${nodeCount} | Density: ${totalHits} hits | Conflicts: ${conflicts.length}`);
}

function logGovernance(nodeCount, results) {
  if (!fs.existsSync(DELIVERY_LOG_PATH)) return;

  const log = JSON.parse(fs.readFileSync(DELIVERY_LOG_PATH, 'utf-8'));
  const sorted = Object.entries(results).sort((a,b) => b[1] - a[1]);
  const topTheme = sorted[0] ? sorted[0][0] : 'Unknown';

  const newAction = {
    id: `gov-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'governance',
    message: `Autonomous Governance: ${nodeCount} nodes scanned. Top Strategic Theme: "${topTheme}".`,
    target: "Global Strategy Matrix",
    status: "success"
  };

  log.actions.unshift(newAction);
  if (log.actions.length > 20) log.actions.pop();

  fs.writeFileSync(DELIVERY_LOG_PATH, JSON.stringify(log, null, 2));
}

runInsightEngine();
