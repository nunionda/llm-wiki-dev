# LLM Wiki: Project Specification

This repository contains the reference implementation of the **LLM-Wiki Pattern**. It is a system for building self-governing, compounding knowledge bases where the LLM serves as the Librarian and the human as the Architect.

## 1. Architecture: The 3-Layer Pattern
The system is built on three distinct layers to ensure high-integrity and scalability:

- **Raw Sources (`/wiki/raw`)**: Immutable research documents (PDFs, papers, images, logs). This is the absolute **Source of Truth**.
- **The Wiki (`/wiki/pages`)**: A collection of LLM-generated Markdown nodes. This is the **Knowledge Layer**.
- **The Schema (`CLAUDE.md`, `PRINCIPLES.md`)**: The "Governance Layer" that defines the rules, conventions, and workflows for the agents.

## 2. Operations Layer: Reference Implementation
The following scripts provide the technical foundation for the autonomous wiki:

| Operation | Script | Capability | Command |
| :--- | :--- | :--- | :--- |
| **Ingest** | `ingestor.js` | High-Density Deconstruction (10-15 nodes) | `node scripts/ingestor.js` |
| **Search** | `search.js` | Weighted Ranking (Title 3x, Meta 2x, Body 1x) | `node scripts/search.js "query"` |
| **Query** | `query.js` | Knowledge Synthesis, Slide Generation (Marp) | `node scripts/query.js "prompt"` |
| **Lint** | `wiki-linter.js` | Semantic Integrity & Data Gap Detection | `node scripts/wiki-linter.js` |
| **Index** | `cataloger.js` | Autonomous Summary & Map Generation | `node scripts/cataloger.js` |

## 3. High-Integrity Standards
- **High-Density Deconstruction**: The ingestor must extract at least 10-15 atomic nodes per source to maximize the graph density.
- **Unix-style Logging**: Every operation is recorded in [wiki/log.md](file:///Users/daniel/dev/antigravity-dev/llm-wiki-dev/wiki/log.md) as `## [Date] op | detail` for terminal-first auditability.
- **Synthesis Nodes**: Query results that offer new insights are saved back to the wiki as permanent `synthesis/` pages.
- **Data Gaps**: The Linter identifies "Most Wanted" concepts that are linked but not yet defined, driving future research.

## 4. Key Principles
- **Bookkeeping is the Bottleneck**: Personal wikis fail not from a lack of thought, but from the tax of maintenance. By driving maintenance costs to near-zero, the LLM allows knowledge to compound.
- **The Memex Vision (1945)**: Realizing Vannevar Bush's dream of an associative knowledge engine where the *trails* between documents are as valuable as the documents themselves.

## 5. Core Methodology & Guidance
For a deeper dive into the system's operational pillars and manual usage:
- **Foundational Pillars**: [[pillar-atomicity]], [[pillar-persistence]], [[pillar-scalability]], [[pillar-self-healing]].
- **Operational Logic**: [[zero-cost-bookkeeping]], [[atomic-ingestion-engine]], [[wiki-vs-rag-accumulation]].
- **User Interface**: [[tips-and-tooling]], [[knowledge-architect-role]], [[persistent-knowledge-matrix]].

---
*For a detailed guide on tooling (Obsidian, Marp, Git), see our [Tips & Tooling Guide](wiki/pages/tips-and-tooling.md).*