import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const WIKI_BACKLOG_PATH = path.resolve(__dirname, '../wiki/backlog.md');
const UI_LOG_PATH = path.resolve(__dirname, '../wiki-docs/src/delivery-log.json');
const WIKI_LOG_PATH = path.resolve(__dirname, '../wiki/log.md');

function extractTasks() {
  console.log(`\x1b[35m[APM Engine]\x1b[0m Starting Autonomous Task Extraction...`);

  const files = fs.readdirSync(WIKI_PAGES_DIR).filter(f => f.endsWith('.md'));
  let allTasks = [];

  files.forEach(file => {
    const filePath = path.join(WIKI_PAGES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Pattern: - [ ] Task description
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.trim().startsWith('- [ ]')) {
        const taskText = line.replace('- [ ]', '').trim();
        allTasks.push({
          text: taskText,
          source: file,
          sourcePath: filePath
        });
      }
    });
  });

  console.log(`\x1b[32m[APM Success]\x1b[0m ${allTasks.length} tasks identified across the knowledge base.`);
  
  updateBacklog(allTasks);
  appendMarkdownLog(allTasks.length);
  updateUILog(allTasks.length);
}

function updateBacklog(tasks) {
  let backlogContent = `# 🚀 Autonomous Project Backlog\n\n`;
  backlogContent += `> [!IMPORTANT]\n`;
  backlogContent += `> This backlog is automatically managed by the APM Engine. It extracts to-do items from your wiki nodes to ensure no strategic action is forgotten.\n\n`;
  
  if (tasks.length === 0) {
    backlogContent += `_No active tasks identified. All strategic goals are currently synchronized._\n`;
  } else {
    backlogContent += `| Status | Task Description | Source Node |\n`;
    backlogContent += `| :--- | :--- | :--- |\n`;
    tasks.forEach(t => {
      backlogContent += `| ⏳ Pending | ${t.text} | [[${t.source.replace('.md', '')}]] |\n`;
    });
  }

  backlogContent += `\n\n--- \n*Last updated: ${new Date().toLocaleString()} by gstack-APM*`;
  fs.writeFileSync(WIKI_BACKLOG_PATH, backlogContent);
}

function appendMarkdownLog(taskCount) {
  const timestamp = new Date().toISOString().split('T')[0];
  const logEntry = `\n## [${timestamp}] apm | Task extraction complete. ${taskCount} actionable items synced to backlog.md.`;
  fs.appendFileSync(WIKI_LOG_PATH, logEntry);
}

function updateUILog(taskCount) {
  if (!fs.existsSync(UI_LOG_PATH)) return;

  const log = JSON.parse(fs.readFileSync(UI_LOG_PATH, 'utf-8'));
  const newAction = {
    id: `apm-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'apm',
    message: `Autonomous Project Manager: ${taskCount} tasks extracted and synced to strategic backlog.`,
    target: "Project Backlog",
    status: "success"
  };

  log.actions.unshift(newAction);
  if (log.actions.length > 20) log.actions.pop();

  fs.writeFileSync(UI_LOG_PATH, JSON.stringify(log, null, 2));
}

extractTasks();
