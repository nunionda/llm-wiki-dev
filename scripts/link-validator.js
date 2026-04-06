import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const RELATIONS_FILE = path.resolve(__dirname, '../wiki/relations.json');

/**
 * Scans all markdown files in wiki/pages for cross-references [[page-name]]
 * and validates their existence. Syncs relations.json.
 */
function validateLinks() {
    if (!fs.existsSync(PAGES_DIR)) return;

    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.md'));
    const allPageNames = files.map(f => f.replace('.md', ''));
    
    // Read existing relations to preserve metadata if possible
    let existingRelations = { nodes: [], links: [] };
    if (fs.existsSync(RELATIONS_FILE)) {
        try {
            existingRelations = JSON.parse(fs.readFileSync(RELATIONS_FILE, 'utf-8'));
        } catch (e) {
            console.error("[LINK_VALIDATOR] Error reading existing relations:", e);
        }
    }

    const relations = {
        nodes: existingRelations.nodes.length > 0 ? existingRelations.nodes : allPageNames.map(name => ({ id: name, title: name, category: 'general' })),
        links: []
    };

    let totalLinks = 0;
    let brokenLinks = 0;

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        const source = file.replace('.md', '');
        const content = fs.readFileSync(filePath, 'utf8');

        // Regex for [[page-name]]
        const linkRegex = /\[\[(.*?)\]\]/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            const targetLabel = match[1];
            const target = targetLabel.toLowerCase().replace(/\s+/g, '-');
            totalLinks++;

            if (allPageNames.includes(target)) {
                relations.links.push({
                    source: source,
                    target: target,
                    value: 1
                });
            } else {
                brokenLinks++;
                console.warn(`\x1b[33m[LINK_VALIDATOR] Broken link in ${file}: [[${targetLabel}]]\x1b[0m`);
            }
        }
    });

    // Write relations.json for the Graph Visualization
    fs.writeFileSync(RELATIONS_FILE, JSON.stringify(relations, null, 2));

    console.log(`\x1b[36m[LINK_VALIDATOR]\x1b[0m Scan Complete.`);
    console.log(`- Total Pages: ${allPageNames.length}`);
    console.log(`- Total Links: ${totalLinks}`);
    console.log(`- Valid Links: ${relations.links.length}`);
    console.log(`- Broken Links: ${brokenLinks}`);
}

// Self-Execute
validateLinks();
