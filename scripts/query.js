import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_SYNTHESIS_DIR = path.resolve(__dirname, '../wiki/pages/synthesis');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runQuery(prompt, options = {}) {
  const logFile = path.resolve(__dirname, '../wiki/log.md');
  const indexFile = path.resolve(__dirname, '../wiki/index.md');
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];

  console.log(`\x1b[35m[Query Engine]\x1b[0m Exploring Wiki: "${prompt}"...`);
  
  // 1. Log Query Execution
  fs.appendFileSync(logFile, `\n## [${dateStr}] query | ${prompt} | ${now}\n`);

  if (!fs.existsSync(WIKI_SYNTHESIS_DIR)) fs.mkdirSync(WIKI_SYNTHESIS_DIR, { recursive: true });

  // 2. Index-First Navigation (Scaling optimization)
  let indexContext = "";
  if (fs.existsSync(indexFile)) {
    indexContext = fs.readFileSync(indexFile, 'utf-8');
    console.log(`\x1b[34m[Navigator]\x1b[0m Scanning global index for knowledge mapping...`);
  }

  // 3. High-Performance Retrieval (Selective CLI)
  const queryCmd = `node ${path.join(__dirname, 'search.js')} "${prompt}" --json`;
  let searchResults = [];
  try {
    const { execSync } = await import('child_process');
    const output = execSync(queryCmd, { encoding: 'utf-8' });
    searchResults = JSON.parse(output);
  } catch (e) {
    console.error(`\x1b[31m[Search Error]\x1b[0m ${e.message}`);
  }

  let context = "";
  for (const res of searchResults) {
    const content = fs.readFileSync(path.join(WIKI_PAGES_DIR, `${res.id}.md`), 'utf-8');
    context += `\n--- SOURCE: ${res.id} (Score: ${res.score.toFixed(1)}) ---\n${content}\n`;
  }

  // Synthesis combining Index mapping and Page context
  const systemContext = `GLOBAL INDEX:\n${indexContext}\n\nPAGE CONTEXT:\n${context || "No specific matches found."}`;

  // 2. Synthesize Answer
  const systemPrompt = options.marp 
    ? "You are a Presentation Architect. Summarize the wiki knowledge into a Marp Slide Deck. Use --- to separate slides. Clean design, bullet points only."
    : `You are a Wiki Librarian. Synthesize a coherent answer from the provided wiki context. Use citations like [[slug]].
    - Every synthesized node must have a YAML block:
      ---
      title: Synthesis: ${prompt}
      category: Synthesis
      tags: [synthesis, auto-generated]
      status: Seed
      last_updated: ${new Date().toISOString().split('T')[0]}
      ---
    - Use Obsidian Callouts (> [!NOTE], > [!TIP], > [!SUCCESS]) for summarizing findings.
    - Use [[internal-links]] freely.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `CONTEXT:\n${context || "No context found."}\n\nQUESTION: ${prompt}` }
      ]
    });

    const answer = response.choices[0].message.content.trim();
    console.log(`\n\n\x1b[32m[Synthesis Result]\x1b[0m\n${answer}\n\n`);

    // 3. Optional: Save to Wiki (Synthesis Node)
    if (options.save) {
      const slug = prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      const filename = `synth-${slug}-${Date.now()}.md`;
      const header = `---\ntitle: "Synthesis: ${prompt}"\ncategory: "synthesis"\nlast_updated: "${new Date().toISOString()}"\nstatus: "Generated"\n---\n\n`;
      fs.writeFileSync(path.join(WIKI_SYNTHESIS_DIR, filename), header + answer);
      console.log(`\x1b[34m[Saved]\x1b[0m Insight archived as ${filename}`);
    }

    if (options.marp) {
      const marpFilename = `deck-${Date.now()}.md`;
      fs.writeFileSync(path.join(__dirname, '../output', marpFilename), answer);
      console.log(`\x1b[36m[Marp]\x1b[0m Slide deck generated: output/${marpFilename}`);
    }

  } catch (e) {
    console.error(`\x1b[31m[Query Error]\x1b[0m ${e.message}`);
  }
}

// CLI usage: node scripts/query.js "How does Agentic Strategy scale?" --save --marp
const args = process.argv.slice(2);
const queryText = args.filter(a => !a.startsWith('--')).join(' ');
const options = {
  save: args.includes('--save'),
  marp: args.includes('--marp')
};

if (queryText) {
  runQuery(queryText, options);
} else {
  console.log("Usage: node scripts/query.js \"prompt\" [--save] [--marp]");
}
