---
title: Operational Delivery Runbook
category: infrastructure
tags: [automation, pipeline, delivery, workflow]
gravity: delivery
status: active
---

# Operational Delivery Runbook

> The gap between strategy and value is **delivery**. This runbook defines the automation pipeline, workflow orchestration, and continuous delivery practices that keep the knowledge engine running autonomously.

## 1. Delivery Pipeline Architecture

The core delivery pipeline transforms raw knowledge vibes into structured, dispatched assets:

```
Raw Ingest → Bookkeeper → Linter → Insight Engine → Health Score → [[Autonomous Dispatch]]
```

Each stage runs as an automated workflow triggered by the `agent-watcher`:

| Stage | Script | Automation Level | Delivery Target |
|:---|:---|:---|:---|
| Manifest Sync | `gen-manifest.js` | Full CI/CD | Wiki Frontend |
| Cross-Reference | `bookkeeper.js` | Full Automation | Semantic Graph |
| Integrity Check | `wiki-linter.js` | Full Pipeline | Linter Report |
| Insight Analysis | `insight-engine.js` | Full Automation | Strategy Matrix |
| Health Score | `health-score.js` | Full Pipeline | Trust Center |
| Asset Dispatch | `autonomous-action.js` | Hybrid Delivery | Slack / Endpoints |

## 2. Workflow Orchestration

### Agent Watcher Pipeline

The `agent-watcher.js` monitors `/wiki/raw/` for changes and triggers the full delivery pipeline. This provides continuous delivery of knowledge assets without manual intervention.

**Key Automation Principles:**
- **Zero-touch dispatch**: Once raw content enters the pipeline, no human intervention is needed for routine delivery
- **Fail-safe escalation**: If any pipeline stage fails, the error is logged but subsequent stages still execute
- **Idempotent operations**: Running the pipeline multiple times produces the same result

### CI/CD Integration Points

The delivery system integrates with external CD endpoints:
- **Slack Dispatch**: Strategy assets auto-dispatched to `#strategy-updates`
- **Health Monitoring**: Composite health score tracked over time
- **Audit Trail**: Every pipeline execution logged to `delivery-log.json`

## 3. Asset Management

All generated assets follow the delivery lifecycle:

1. **Creation**: Automated by pipeline scripts
2. **Validation**: Linter + Health Score verification
3. **Dispatch**: Autonomous delivery to configured endpoints
4. **Archival**: Older dispatch events rotated in audit log (max 20 entries)

### Delivery Metrics

| Metric | Current | Target |
|:---|:---|:---|
| Pipeline Execution Time | < 5s | < 3s |
| Automation Coverage | 85% | 95% |
| Dispatch Reliability | 100% | 100% |

## 4. Troubleshooting Pipeline Issues

Common workflow failures and their resolution:

- **Manifest desync**: Re-run `node wiki-docs/scripts/gen-manifest.js`
- **Broken delivery log**: Check `delivery-log.json` for valid JSON
- **Stale health report**: Trigger `node scripts/health-score.js` manually

---
**Status**: Active CI/CD pipeline with full automation coverage.
