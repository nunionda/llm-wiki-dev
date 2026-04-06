import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_RAW_DIR = path.resolve(__dirname, '../wiki/raw');

// Using OpenAI (GPT-4o-mini) for industry-standard reliability in Synthesis
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runSynthesis() {
  console.log(`\x1b[35m[Synthesis Engine]\x1b[0m Starting High-Density Ingestion...`);
  
  if (!fs.existsSync(WIKI_RAW_DIR)) return;

  const files = fs.readdirSync(WIKI_RAW_DIR)
                 .filter(f => fs.lstatSync(path.join(WIKI_RAW_DIR, f)).isFile() && !f.startsWith('.'));

  for (const file of files) {
    const filePath = path.join(WIKI_RAW_DIR, file);
    console.log(`\x1b[35m[Ingestor]\x1b[0m Processing: ${file}`);
    const sourceContent = fs.readFileSync(filePath, 'utf-8');

    try {
      // 1. High-Density Deconstruction (10-15 nodes)
      const deconstructResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a Knowledge Architect. Deconstruct the source into 10-15 atomic knowledge entities according to WIKI_SCHEMA.md. Return JSON: { \"entities\": [{ \"id\": \"slug\", \"title\": \"string\", \"category\": \"string\", \"content\": \"string\" }] }" },
          { role: "user", content: sourceContent }
        ],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(deconstructResponse.choices[0].message.content);
      const fragments = parsed.entities || [];
      console.log(`\x1b[32m[Success]\x1b[0m ${fragments.length} atomic nodes identified.`);

      for (const frag of fragments) {
        if (!frag.id) continue;
        const pagePath = path.join(WIKI_PAGES_DIR, `${frag.id}.md`);
        let existingContent = "";
        let synthesisMode = "NEW";

        if (fs.existsSync(pagePath)) {
          existingContent = fs.readFileSync(pagePath, 'utf-8');
          synthesisMode = "COMPOUND";
        }

        // 2. Surgical Merge / Synthesis
        const synthesisPrompt = `Merge NEW EVIDENCE into EXISTING WIKI NODE.
        EXISTING: ${existingContent || "None"}
        NEW: ${frag.content}
        RULES: Adhere to WIKI_SCHEMA.md. Use [!CAUTION] for contradictions. Return Markdown only.`;

        const synthResult = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: synthesisPrompt }]
        });
        
        const finalBody = synthResult.choices[0].message.content.trim();
        const header = `---\ntitle: "${frag.title}"\ncategory: "${frag.category}"\nlast_updated: "${new Date().toISOString()}"\nstatus: "${synthesisMode === 'COMPOUND' ? 'Synthesized' : 'Verified'}"\n---\n\n`;
        fs.writeFileSync(pagePath, header + finalBody);
      }
      
      // 3. Post-Ingestion: Update Index and Log
      updateIndexAndLog(file, fragments.length);

      const processedDir = path.join(WIKI_RAW_DIR, 'processed');
      if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);
      fs.renameSync(filePath, path.join(processedDir, file));

    } catch (e) {
      console.error(`\x1b[31m[Error during Synthesis]\x1b[0m ${e.message}`);
    }
  }
}

function updateIndexAndLog(sourceName, nodeCount) {
  const logFile = path.resolve(__dirname, '../wiki/log.md');
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];

  // Update Log (Unix-Friendly format)
  const logEntry = `\n## [${dateStr}] ingest | ${sourceName}: ${nodeCount} nodes synthesized | ${now}\n`;
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "# Wiki Activity Log\n\n> Unix-friendly audit trail for knowledge operations.\n");
  }
  fs.appendFileSync(logFile, logEntry);

  // Trigger Cataloger (Decoupled refresh)
  import('./cataloger.js').catch(() => {});
}

runSynthesis();
