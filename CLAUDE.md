# LLM-Wiki Dev | Technical Manual Development Guide

This project generates the autonomous knowledge engine and technical manual for the `llm-wiki` ecosystem.

## Development Standards
- **Runtime**: `node` (for `pptxgenjs`).
- **Design**: Follow the "Teal Trust" theme and "Boil the Lake" philosophy.
- **Rules**: Adhere to the gstack-specific rules in `.agents/rules/`.

## Key Commands
- `node gen_pptx.js`: Generate the manual PPTX in `/output`.
- `npm install`: Install dependencies.

## 3-Layer Architecture
- **Layer 1: Raw Sources (`/wiki/raw`)**: Curation of curated source documents (Immutable).
- **Layer 2: The Wiki (`/wiki/pages`)**: LLM-generated atomic Markdown nodes (Mutable/LLM-owned).
- **Layer 3: The Schema (`WIKI_SCHEMA.md`)**: Configuration and governance rules for AI-driven management.

## Project Structure
- `WIKI_SCHEMA.md`: Wiki governance and conventions.
- `scripts/`: Autonomous agents (`ingestor.js`, `bookkeeper.js`, `agent-watcher.js`).
- `wiki-docs/`: Frontend UI for knowledge visualization.
- `gen_pptx.js`: Main generator script.
- `.agents/rules/`: Workspace rules (Ethos, Agent Roles, Architecture, CLI).
- `.agents/skills/`: Workspace-level skills (e.g., Anthropics skills stack).
- `.agents/workflows/`: Automation workflows.
- `output/`: Generated PPTX files.
