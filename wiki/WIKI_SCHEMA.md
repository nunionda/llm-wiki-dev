# Wiki Schema

This document defines the conventions and operational guidelines for the **LLM Wiki** system in this workspace.

## 1. Directory Structure
- `wiki/raw/`: Immutable source documents.
- `wiki/pages/`: LLM-managed markdown files (summaries, entities, concepts).
- `wiki/assets/`: Local images and data files.

## 2. Page Conventions
- **Naming**: Use `CamelCase` for entities and `kebab-case` for concepts/topics.
- **Maintenance Level (Hybrid Gravity)**:
  - `auto`: Routine snippets/summaries (Full Agentic Auto-sync).
  - `hybrid`: Strategic insights (Agent proposes, Human approves).
  - `manual`: Critical charters/schemas (Human-only edits).
- **Frontmatter**: Every wiki page MUST start with YAML frontmatter:
  ```yaml
  ---
  title: [Display Title]
  tags: [list, of, tags]
  sources: [list, of, source, links]
  gravity: [auto | hybrid | manual]
  status: [synced | pending_review | manual_lock]
  last_updated: [YYYY-MM-DD]
  ---
  ```
- **Structure**: Use hierarchical headers (#, ##, ###) and standard markdown.
- **Cross-references**: Link to other wiki pages using standard markdown links: `[Target Page](./target-page.md)`.

## 3. Operational Workflows

### 3.1 Ingest
1. Move the source document into `wiki/raw/`.
2. Analyze the source for key entities, concepts, and takeaways.
3. Create/Update pages in `wiki/pages/` to reflect new knowledge.
4. Update `wiki/index.md` with links and summaries.
5. Append an entry to `wiki/log.md`.

### 3.2 Query & Synthesis
1. Search `wiki/index.md` for relevant pages.
2. Read and synthesize the found content.
3. If the answer is strategically valuable, file it as a new page in `wiki/pages/`.

### 3.3 Lint & Maintenance
1. Ensure all links are functional.
2. Identify and resolve contradictions between pages.
3. Flag stale content for revision.
