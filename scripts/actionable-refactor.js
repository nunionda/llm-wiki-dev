import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_RAW_DIR = path.resolve(__dirname, '../wiki/raw');
const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const LOG_PATH = path.resolve(__dirname, '../wiki-docs/src/delivery-log.json');

function actionableRefactor() {
  console.log(`\x1b[35m[Refactor Engine]\x1b[0m Scanning for raw content needing consolidation...`);

  const files = fs.readdirSync(WIKI_RAW_DIR);
  const vibeFiles = files.filter(f => f.startsWith('mobile_vibe_') && f.endsWith('.md'));

  if (vibeFiles.length < 3) {
    console.log(`\x1b[36m[Refactor Engine]\x1b[0m ${vibeFiles.length} raw vibes found. (Threshold: 3). No action needed.`);
    return;
  }

  console.log(`\x1b[34m[Action: Consolidating]\x1b[0m Found ${vibeFiles.length} vibes. Building "Field Reports" node...`);

  let consolidatedContent = '';
  vibeFiles.forEach(file => {
    const filePath = path.join(WIKI_RAW_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    consolidatedContent += `### Vibe Ingest (File: ${file})\n${content}\n\n---\n\n`;
    
    // Delete the original raw vibe file (The "Cleanup" step)
    console.log(`\x1b[31m[Action: Cleanup]\x1b[0m Deleting raw vibe: ${file}`);
    fs.unlinkSync(filePath);
  });

  // Create the formal Field Reports page
  const pageContent = `---
title: Field Reports (Consolidated)
category: business
tags: [field-operations, synthesis]
gravity: hybrid
status: synced
---

# Field Reports & Strategic Observations

This document is an automatically consolidated node of raw field vibes captured via the mobile ingest interface. 
It has been synthesized to reduce noise and maintain strategic alignment.

${consolidatedContent}
`;

  const targetPath = path.join(WIKI_PAGES_DIR, 'field-reports.md');
  fs.writeFileSync(targetPath, pageContent);
  console.log(`\x1b[32m[Refactor Success]\x1b[0m Created: wiki/pages/field-reports.md`);

  // Log the activity to Action History
  logAction(vibeFiles.length);
}

function logAction(count) {
  if (!fs.existsSync(LOG_PATH)) return;

  const log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  const newAction = {
    id: `refactor-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'refactor',
    message: `Knowledge Compounded: ${count} raw vibes consolidated into "Field Reports" and cleaned up.`,
    target: "Central Wiki Hub",
    status: "success"
  };

  log.actions.unshift(newAction);
  if (log.actions.length > 20) log.actions.pop();

  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

actionableRefactor();
