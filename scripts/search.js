import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');

function calculateScore(content, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let score = 0;
  let matches = [];

  const lines = content.split('\n');
  const titleLine = lines.find(l => l.startsWith('title:')) || "";
  const categoryLine = lines.find(l => l.startsWith('category:')) || "";

  words.forEach(word => {
    // 1. Title Match (3.0x)
    if (titleLine.toLowerCase().includes(word)) score += 3.0;

    // 2. Category Match (2.0x)
    if (categoryLine.toLowerCase().includes(word)) score += 2.0;

    // 3. Body Match (1.0x per occurance)
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const bodyMatches = content.match(regex);
    if (bodyMatches) {
      score += bodyMatches.length;
      matches.push(word);
    }
  });

  return { score, matches: [...new Set(matches)] };
}

function getSnippet(content, matches) {
  if (matches.length === 0) return "";
  const firstMatch = content.toLowerCase().indexOf(matches[0]);
  if (firstMatch === -1) return content.slice(0, 150) + "...";

  const start = Math.max(0, firstMatch - 50);
  const end = Math.min(content.length, firstMatch + 150);
  return (start > 0 ? "..." : "") + content.slice(start, end).replace(/\n/g, ' ').trim() + "...";
}

function runSearch(query, isJson = false) {
  if (!fs.existsSync(WIKI_PAGES_DIR)) return;

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
  const results = [];

  files.forEach(file => {
    const id = file.replace('.md', '');
    const content = fs.readFileSync(path.join(WIKI_PAGES_DIR, file), 'utf-8');
    const { score, matches } = calculateScore(content, query);

    if (score > 0) {
      results.push({
        id,
        score,
        snippet: getSnippet(content, matches)
      });
    }
  });

  // Rank by score
  results.sort((a, b) => b.score - a.score);
  const top10 = results.slice(0, 10);

  if (isJson) {
    process.stdout.write(JSON.stringify(top10, null, 2));
  } else {
    console.log(`\x1b[35m[Search]\x1b[0m Showing top ${top10.length} results for: "${query}"\n`);
    top10.forEach((r, i) => {
      console.log(`${i + 1}. \x1b[1m[[${r.id}]]\x1b[0m (Score: ${r.score.toFixed(1)})`);
      console.log(`   \x1b[2m${r.snippet}\x1b[0m\n`);
    });
  }
}

const args = process.argv.slice(2);
const isJson = args.includes('--json');
const query = args.filter(a => a !== '--json').join(' ');

if (query) {
  runSearch(query, isJson);
} else {
  console.log("Usage: node scripts/search.js \"query string\" [--json]");
}
