# Tips & Tooling Guide: Scaling the LLM-Wiki

This guide provides the necessary tooling configuration to turn your wiki into a high-performance research and presentation engine using **human-LLM synergy**.

## 1. Sourcing with Obsidian Web Clipper
> **Goal**: Rapid ingestion from the web.
- **Tool**: [Obsidian Web Clipper](https://obsidian.md/clipper) extension.
- **Workflow**: Click the clipper on any research paper or article → Save directly to `wiki/raw/`. The **Synthesis Engine** will detect the new file and begin deconstruction.

## 2. Organization: Graph View & Dataview
> **Goal**: Meta-analysis and dynamic queries.
- **Graph View**: Use the built-in Obsidian Graph View to identify:
    - **Hub Pages**: Highly connected "Pillar" nodes.
    - **Orphan Nodes**: Isolated knowledge that needs more cross-referencing.
- **Dataview Plugin**: Use this to generate dynamic tables from LLM-generated frontmatter.
```dataview
TABLE category, last_updated, status
FROM "wiki/pages"
SORT last_updated DESC
LIMIT 10
```

## 3. Rich Media: Local Images & LLM Vision
> **Goal**: Managing non-text artifacts.
- **Storage**: Standardize all attachments in the `wiki/assets/` directory.
- **Obsidian Setup**: Settings → Files and links → Default location for new attachments → "In subfolder under current folder" (Name: `assets`).
- **LLM Vision**: If an image is critical for synthesis, describe it in the text or use an LLM with vision capabilities to describe it first.
- **Shortcut**: Use `Cmd + Shift + 4` (Mac) to quickly capture and paste images into nodes.

## 4. Presentations: Marp for Slides
> **Goal**: Knowledge Outcome.
- **Tool**: Obsidian [Marp](https://marp.app/) Plugin.
- **Usage**: Any node created by `scripts/query.js --marp` is ready for presentation. Simply open the file in Obsidian and click "Marp: Toggle Preview".

## 5. Governance: Git as Infrastructure
> **Goal**: Resilience & Collaboration.
- **Version Control**: The `wiki/` directory is a Git repository.
- **Safety**: No matter how many surgical merges the LLM performs, you can always revert to a previous state using `git checkout`.
- **Branching**: Create a separate branch for experimental research (e.g., `git checkout -b aggressive-pruning`) to test major logic changes.

---
**Human Role**: You provide the curiosity and the high-level sourcing. 
**LLM Role**: It provides the bookmarking, synthesis, and administrative labor.
*That is the partnership.*
