import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANIFEST_PATH = path.resolve(__dirname, '../wiki-docs/src/docs-manifest.json');
const LOG_PATH = path.resolve(__dirname, '../wiki-docs/src/delivery-log.json');
const PPTX_SCRIPT = path.resolve(__dirname, 'generate_pitch.py');

function autonomousAction() {
  console.log(`\x1b[35m[Autonomous Operator]\x1b[0m Checking for high-gravity dispatch triggers...`);

  if (!fs.existsSync(MANIFEST_PATH)) return;

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));

  // Check strategic pages (e.g., Commercial Blueprint)
  const strategicPages = manifest.pages.filter(p => 
    p.category === 'knowledge-base' || p.category === 'assets'
  );

  let performedAction = false;

  for (const page of strategicPages) {
     // Simulation: If a page was recently updated and synced, we "dispatch"
     // In a real system, we'd compare version hashes. 
     // Here, we trigger if it's the Commercial Blueprint as a demo.
     if (page.id === 'commercial-blueprint') {
        processDispatch(page, log);
        performedAction = true;
        break; // Only one per cycle for the demo
     }
  }

  if (performedAction) {
    fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
    console.log(`\x1b[32m[Dispatch Success]\x1b[0m Autonomous cycles complete.`);
  }
}

function processDispatch(page, log) {
  const timestamp = new Date().toISOString();
  
  // 1. Re-compose PPTX
  console.log(`\x1b[34m[Action: Re-compose]\x1b[0m Re-generating Pitch Deck from ${page.title}...`);
  try {
    execSync(`python3 ${PPTX_SCRIPT}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`\x1b[31m[Error]\x1b[0m PPTX generation failed: ${e.message}`);
  }

  // 2. Log Dispatch
  const action = {
    id: `dispatch-${Date.now()}`,
    timestamp: timestamp,
    type: 'dispatch',
    message: `Strategy Assets Re-composed & Dispatched for "${page.title}"`,
    target: "Executive Slack / #strategy-updates",
    status: "success"
  };

  log.actions.unshift(action);
  // Keep only last 10
  if (log.actions.length > 10) log.actions.pop();
}

autonomousAction();
