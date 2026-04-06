---
title: LLM Wiki Pattern
tags: [knowledge-management, wiki, agents]
sources: [LLM_Wiki.md]
last_updated: 2026-04-06
---

# LLM Wiki Pattern

The **LLM Wiki Pattern** is a high-level architecture for building personal, structured knowledge bases that accumulate and synthesize information over time.

## 1. Layers
- **Raw Sources**: Immutable original documents.
- **The Wiki**: LLM-managed markdown files (summaries, concepts, etc.).
- **The Schema**: Configuration defining maintenance protocols.

## 2. Key Operations
- **Ingest**: Extracting and integrating knowledge from new sources.
- **Query & Synthesis**: Answering questions and saving strategic insights back into the wiki.
- **Lint**: Periodically checking for contradictions or stale info.

## 3. Special Files
- **index.md**: Content-oriented catalog.
- **log.md**: Chronological record of activity.

## 4. Rationale
Most RAG systems rediscover knowledge on every query. The Wiki Pattern focuses on **persistent, compounding synthesis**. The human's job is curation and strategic questioning; the LLM handles the "bookkeeping" and maintenance.
