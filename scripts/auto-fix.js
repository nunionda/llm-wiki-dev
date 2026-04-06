import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_PAGES_DIR = path.resolve(__dirname, '../wiki/pages');
const LINTER_REPORT = path.resolve(__dirname, '../wiki-docs/src/linter-report.json');

function runAutoFix() {
  console.log(`\x1b[35m[AutoFix]\x1b[0m Scanning linter report for auto-fixable issues...`);

  if (!fs.existsSync(LINTER_REPORT)) {
    console.log(`\x1b[33m[AutoFix]\x1b[0m No linter report found. Run wiki-linter.js first.`);
    return { fixed: 0, skipped: 0 };
  }

  const report = JSON.parse(fs.readFileSync(LINTER_REPORT, 'utf-8'));
  const issues = report.issues || [];
  let fixed = 0;
  let skipped = 0;

  // Fix BROKEN_LINK: create stub pages for missing targets
  const brokenLinks = issues.filter(i => i.type === 'BROKEN_LINK');
  const uniqueTargets = [...new Set(brokenLinks.map(i => i.target))];

  uniqueTargets.forEach(target => {
    const targetFile = path.join(WIKI_PAGES_DIR, `${target}.md`);
    if (fs.existsSync(targetFile)) {
      skipped++;
      return;
    }

    // Extract display name from target slug
    const displayName = target.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Find all pages that reference this target
    const referrers = brokenLinks
      .filter(i => i.target === target)
      .map(i => i.node);

    const stubContent = `---
title: ${displayName}
category: auto-generated
tags: [stub, auto-fix]
gravity: neutral
status: stub
---

# ${displayName}

> [!NOTE]
> This page was automatically created by the AutoFix system to resolve a broken link.
> It needs to be expanded with real content.

## References

This concept is referenced by:
${referrers.map(r => `- [[${r}]]`).join('\n')}

---
*Auto-generated stub. Created: ${new Date().toISOString()}*
`;

    fs.writeFileSync(targetFile, stubContent);
    console.log(`\x1b[32m[AutoFix]\x1b[0m Created stub: ${target}.md (referenced by ${referrers.join(', ')})`);
    fixed++;
  });

  if (fixed === 0 && skipped === 0 && brokenLinks.length === 0) {
    console.log(`\x1b[36m[AutoFix]\x1b[0m No broken links to fix. Knowledge base is clean.`);
  } else {
    console.log(`\x1b[36m[AutoFix]\x1b[0m Fixed: ${fixed} | Skipped: ${skipped} | Remaining: ${issues.length - brokenLinks.length} (non-auto-fixable)`);
  }

  return { fixed, skipped };
}

runAutoFix();
