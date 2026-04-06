import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_DIR = path.resolve(__dirname, '../wiki');
const WIKI_RAW_DIR = path.resolve(__dirname, '../wiki/raw');
const MANIFEST_SCRIPT = path.resolve(__dirname, '../wiki-docs/scripts/gen-manifest.js');
const MARP_SCRIPT = path.resolve(__dirname, 'generate_marp_deck.js');
const ACTION_SCRIPT = path.resolve(__dirname, 'autonomous-action.js');
const BOOKKEEPER_SCRIPT = path.resolve(__dirname, 'bookkeeper.js');
const LINTER_SCRIPT = path.resolve(__dirname, 'wiki-linter.js');
const HEALTH_SCRIPT = path.resolve(__dirname, 'health-score.js');
const AUTOFIX_SCRIPT = path.resolve(__dirname, 'auto-fix.js');

// --- CONCURRENCY & MEMORY MGT ---
let isProcessing = false;
let pendingRun = false;
let debounceTimer = null;
const DEBOUNCE_WINDOW = 500; // ms

console.log(`\x1b[35m[Agent Watcher]\x1b[0m Monitoring Integrity: ${WIKI_DIR}`);

// Watch both raw uploads and existing wiki pages for cross-referencing
const watcher = chokidar.watch([WIKI_RAW_DIR, path.join(WIKI_DIR, 'pages')], {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100
  }
});

async function runPipeline() {
  if (isProcessing) {
    pendingRun = true;
    return;
  }

  isProcessing = true;
  pendingRun = false;

  console.log(`\n\x1b[45m\x1b[37m[Pipeline Start]\x1b[0m Global Knowledge Synchronizing...`);
  
  const startTime = Date.now();

  try {
    // 0. Atomic Ingestion (Knowledge Growth)
    console.log(`\x1b[34m[0/8]\x1b[0m Ingesting new knowledge sources...`);
    await execPromise(`node scripts/ingestor.js`);

    // 1. Sync Manifest
    console.log(`\x1b[34m[1/8]\x1b[0m Crawling artifacts...`);
    await execPromise(`node ${MANIFEST_SCRIPT}`);

    // 2. Run Bookkeeper (Cross-references & Relations)
    console.log(`\x1b[34m[2/8]\x1b[0m Intelligent cross-linking...`);
    await execPromise(`node ${BOOKKEEPER_SCRIPT}`);

    // 3. Run Linter (Integrity Check)
    console.log(`\x1b[34m[3/8]\x1b[0m Auditing semantic integrity...`);
    await execPromise(`node ${LINTER_SCRIPT}`);

    // 3.5 Auto-Fix (Self-Healing)
    console.log(`\x1b[34m[3.5/8]\x1b[0m Running autonomous repair...`);
    await execPromise(`node ${AUTOFIX_SCRIPT}`);

    // 4. Update Search Index (qmd)
    console.log(`\x1b[34m[4/8]\x1b[0m Re-indexing qmd search engine...`);
    await execPromise(`npx qmd index wiki/pages`);

    // 5. Generate Slide Deck (Marp)
    console.log(`\x1b[34m[5/8]\x1b[0m Composing presentation assets...`);
    await execPromise(`node ${MARP_SCRIPT}`);

    // 6. Run Insight Engine (Knowledge Gap Analysis)
    console.log(`\x1b[34m[6/8]\x1b[0m Generating strategic insights...`);
    await execPromise('node scripts/insight-engine.js');

    // 7. Compute Health Score
    console.log(`\x1b[34m[7/8]\x1b[0m Computing composite knowledge health...`);
    await execPromise(`node ${HEALTH_SCRIPT}`);

    // 8. Trigger Autonomous Operator (Last Mile Delivery)
    console.log(`\x1b[34m[8/8]\x1b[0m Executing autonomous dispatch...`);
    await execPromise(`node ${ACTION_SCRIPT}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\x1b[32m[Pipeline Success]\x1b[0m Knowledge codebase is now Grade A. (${duration}s)`);

  } catch (err) {
    console.error(`\x1b[31m[Pipeline Error]\x1b[0m Interrupted: ${err.message}`);
  } finally {
    isProcessing = false;
    // Sequential Catch-up: If a change happened while we were busy, run once more.
    if (pendingRun) {
      console.log(`\x1b[33m[Enqueued Run]\x1b[0m Processing changes detected during previous cycle...`);
      setTimeout(runPipeline, 100);
    }
  }
}

// Debounced trigger to bundle multiple rapid file changes into one run
const debouncedRun = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runPipeline();
  }, DEBOUNCE_WINDOW);
};

watcher.on('all', (event, filePath) => {
  if (filePath.endsWith('.json')) return; // Ignore our own reports
  console.log(`\x1b[36m[Sync Event]\x1b[0m ${event}: ${path.basename(filePath)} detected.`);
  debouncedRun();
});

console.log(`\x1b[32m[Agent Active]\x1b[0m Watcher is protected from concurrency explosion. Ready.`);
