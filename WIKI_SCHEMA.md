# LLM-Wiki Governance Schema (Layer 3)

This document defines the structure, conventions, and synthesis rules for the LLM-Wiki. It acts as the "Constitution" that guides the LLM in managing the knowledge base autonomously.

---

## 1. Architectural Layers

### Layer 1: Raw Sources (`wiki/raw/`)
- **Status**: Immutable / Source of Truth.
- **Ownership**: User-curated.
- **Convention**: Raw text, PDF, or Markdown files.
- **Lifecycle**: Once processed, files are moved to `wiki/raw/processed/`.

### Layer 2: The Wiki (`wiki/pages/`)
- **Status**: Mutable / LLM-managed.
- **Ownership**: LLM-owned.
- **Convention**: Atomic Markdown nodes.
- **Lifecycle**: Continually updated via Synthesis (Compounding).

### Layer 3: The Schema (`WIKI_SCHEMA.md`)
- **Status**: Governance / Configuration.
- **Ownership**: Shared (User-defined, Agent-adherent).
- **Function**: Defines the "Standard Operating Procedure" for wiki growth.

---

## 2. Node Conventions

### Naming (IDs)
- **Format**: `kebab-case-slug` (e.g., `agentic-strategy`, `neural-search`).
- **Uniqueness**: IDs must be unique. If a duplicate is found, the content MUST be merged into the existing ID.

### Frontmatter (YAML)
Every page must include:
```yaml
---
title: "Human Readable Title"
category: "One of [strategy, research, technical, health, general]"
last_updated: "ISO-8601 Timestamp"
status: "One of [Verified, Synthesized, Contradicted]"
---
```

---

## 3. Synthesis & Compounding Rules

### Synthesis Workflow
1. **Discovery**: Identify if the node already exists.
2. **Reconciliation**: Read existing content + new evidence.
3. **Merge**: Update existing sections without deleting previously verified facts.
4. **Contradiction Marking**: If new evidence conflicts with existing facts, use:
   `> [!CAUTION] Contradiction Detected: [Brief description of conflict]`

### Cross-Linking
- Use `[[slug]]` syntax for internal links.
- Every new page should have at least 2 outgoing links and 1 incoming link (link to its parent category or index).

---

## 4. Taxonomy (Categories)

- **Strategy**: Long-term vision, architectural patterns.
- **Research**: Papers, experimental data, external findings.
- **Technical**: Code, API specs, implementation details.
- **Health**: Personal or biological data/goals.
- **General**: Miscellaneous notes.
