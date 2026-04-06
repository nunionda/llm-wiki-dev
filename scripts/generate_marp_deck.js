import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '../wiki/pages');
const THEME_PATH = path.join(__dirname, '../wiki-docs/src/styles/prestige-nordic.marp.css');
const OUTPUT_DIR = path.join(__dirname, '../wiki/exports');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

function generateDecks() {
    console.log('\x1b[35m[Marp Engine]\x1b[0m Synthesizing slide decks...');
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.md'));

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Only process if it has "presentation: true" in frontmatter
        if (!content.includes('presentation: true')) return;

        console.log(`\x1b[36m[Marp]\x1b[0m Processing: ${file}`);
        const slideContent = convertToMarp(content);
        const marpFilePath = path.join(OUTPUT_DIR, file.replace('.md', '.marp.md'));
        
        fs.writeFileSync(marpFilePath, slideContent);

        // Run Marp CLI for PDF and PPTX
        try {
            execSync(`npx marp "${marpFilePath}" --theme "${THEME_PATH}" --pdf --allow-local-files`, { stdio: 'inherit' });
            execSync(`npx marp "${marpFilePath}" --theme "${THEME_PATH}" --pptx --allow-local-files`, { stdio: 'inherit' });
            console.log(`\x1b[32m[Success]\x1b[0m Generated PDF/PPTX for ${file}`);
        } catch (e) {
            console.error(`\x1b[31m[Error]\x1b[0m Marp conversion failed for ${file}:`, e.message);
        }
    });
}

function convertToMarp(content) {
    const lines = content.split('\n');
    let title = 'Agentic Wiki';
    let category = 'Knowledge';
    
    // Extract Metadata
    const fmMatch = content.match(/title:\s*(.*)/);
    if (fmMatch) title = fmMatch[1].replace(/["']/g, '');

    const catMatch = content.match(/category:\s*(.*)/);
    if (catMatch) category = catMatch[1];

    let marpBody = `---
marp: true
theme: prestige-nordic
paginate: true
header: "**${title}** | ${category}"
footer: "© 2026 Antigravity Agentic Wiki"
---

<!-- _class: title -->

# ${title}
${category.toUpperCase()}

---

`;

    let currentSlideLines = 0;
    const MAX_LINES = 15;

    lines.forEach(line => {
        // Ignore frontmatter lines
        if (line.match(/^(title|category|tags|gravity|status|presentation|last_updated):/)) return;
        if (line.trim() === '---') return;

        // Header triggers new slide
        if (line.startsWith('#')) {
            if (marpBody.trim().endsWith('---')) {
                marpBody += `\n${line}\n`;
            } else {
                marpBody += `\n---\n\n${line}\n`;
            }
            currentSlideLines = 0;
        } else {
            marpBody += `${line}\n`;
            currentSlideLines++;
            
            // Auto-split long content
            if (currentSlideLines > MAX_LINES && line.trim() === '') {
                 marpBody += `\n---\n\n`;
                 currentSlideLines = 0;
            }
        }
    });

    return marpBody;
}

generateDecks();
