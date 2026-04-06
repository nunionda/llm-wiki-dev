import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const LINTER_REPORT = path.resolve(__dirname, '../wiki-docs/src/linter-report.json');
const INSIGHT_REPORT = path.resolve(__dirname, '../wiki-docs/src/insight-report.json');
const RELATIONS_PATH = path.resolve(__dirname, '../wiki-docs/public/wiki/relations.json');
const HEALTH_REPORT = path.resolve(__dirname, '../wiki-docs/src/health-report.json');

function calcIntegrity() {
  try {
    const report = JSON.parse(fs.readFileSync(LINTER_REPORT, 'utf-8'));
    const issueCount = report.issues?.length || 0;
    // Each issue deducts 5 points, floor at 0
    return Math.max(0, 100 - issueCount * 5);
  } catch {
    return 100; // No report = no known issues
  }
}

function calcBalance() {
  try {
    const report = JSON.parse(fs.readFileSync(INSIGHT_REPORT, 'utf-8'));
    const densities = Object.values(report.themeDensity || {});
    if (densities.length === 0) return 50;

    const mean = densities.reduce((a, b) => a + b, 0) / densities.length;
    const variance = densities.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / densities.length;
    const stddev = Math.sqrt(variance);

    // Perfect balance (stddev=0) = 100, high imbalance (stddev>=25) = 0
    return Math.max(0, Math.round(100 - stddev * 4));
  } catch {
    return 50;
  }
}

function calcFreshness() {
  try {
    if (!fs.existsSync(WIKI_PAGES_DIR)) return 50;
    const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
    if (files.length === 0) return 50;

    const now = Date.now();
    let staleCount = 0;

    files.forEach(file => {
      const stats = fs.statSync(path.join(WIKI_PAGES_DIR, file));
      const daysOld = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld > 30) staleCount++;
    });

    const freshRatio = 1 - (staleCount / files.length);
    return Math.round(freshRatio * 100);
  } catch {
    return 50;
  }
}

function calcConnectivity() {
  try {
    if (!fs.existsSync(RELATIONS_PATH)) return 50;
    const relations = JSON.parse(fs.readFileSync(RELATIONS_PATH, 'utf-8'));
    const { nodes = [], links = [] } = relations;
    if (nodes.length === 0) return 50;

    // Nodes with at least one connection
    const connectedIds = new Set();
    links.forEach(link => {
      connectedIds.add(link.source);
      connectedIds.add(link.target);
    });

    const connectedRatio = connectedIds.size / nodes.length;
    return Math.round(connectedRatio * 100);
  } catch {
    return 50;
  }
}

function runHealthScore() {
  console.log(`\x1b[35m[Health Score]\x1b[0m Computing composite knowledge health...`);

  const integrity = calcIntegrity();
  const balance = calcBalance();
  const freshness = calcFreshness();
  const connectivity = calcConnectivity();

  const weights = { integrity: 0.30, balance: 0.25, freshness: 0.25, connectivity: 0.20 };
  const composite = Math.round(
    integrity * weights.integrity +
    balance * weights.balance +
    freshness * weights.freshness +
    connectivity * weights.connectivity
  );

  const report = {
    composite,
    dimensions: {
      integrity: { score: integrity, weight: 30, label: 'Integrity', desc: 'Broken links & structural issues' },
      balance: { score: balance, weight: 25, label: 'Balance', desc: 'Theme distribution evenness' },
      freshness: { score: freshness, weight: 25, label: 'Freshness', desc: 'Content recency' },
      connectivity: { score: connectivity, weight: 20, label: 'Connectivity', desc: 'Inter-node link density' }
    },
    grade: composite >= 90 ? 'A' : composite >= 75 ? 'B' : composite >= 60 ? 'C' : composite >= 40 ? 'D' : 'F',
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(HEALTH_REPORT, JSON.stringify(report, null, 2));

  console.log(`\x1b[36m[Health Score]\x1b[0m Composite: ${composite}/100 (Grade: ${report.grade})`);
  console.log(`  Integrity: ${integrity} | Balance: ${balance} | Freshness: ${freshness} | Connectivity: ${connectivity}`);

  return report;
}

runHealthScore();
