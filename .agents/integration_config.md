# Antigravity x LLM x Wiki: Triadic Integration Config

This document defines the automated orchestration rules for the **Agentic Wiki**. Antigravity uses this as a "Source of Truth" for lifecycle management.

## 1. Orchestration Rules

| Event | Action | Tool / Script |
| :--- | :--- | :--- |
| `on_save` (*.md) | Sync & Re-index | `node scripts/bookkeeper.js` |
| `on_ingest` | Synthesis & File | `Antigravity Context -> LLM` |
| `on_sync` | Global Integrity Check | `node scripts/wiki-linter.js` |
| `daily_audit` | Strategy Density Update | `node scripts/insight-engine.js` |

## 2. Context Ingestion Protocol
When the LLM is invoked via Antigravity to update the wiki, it MUST follow this hierarchy:
1.  **Direct Neighbors**: Nodes in `relations.json` linked to the target.
2.  **Strategic Matrix**: The current `global-strategy-matrix.md` to identify theme gaps.
3.  **Governance Manual**: `.agents/rules/` (Ethos, Eng, CEO).

## 3. Automation Triggers (`status: active`)

```json
{
  "auto_linking": true,
  "conflict_alert": "high",
  "verbosity": "executive",
  "output_dir": "wiki/pages/",
  "mcp_search": "qmd"
}
```

---
> [!IMPORTANT]
> **Vibe Approval Loop**: All files generated with `status: pending_review` must be manually flipped to `status: synced` or `status: verified` by a human architect before they are considered "Ground Truth".
