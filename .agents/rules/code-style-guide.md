---
trigger: always_on
glob: 
description: gstack Global Code Style & Development Rules
---

# gstack Global Code Style Guide

This guide defines the universal standards for software development within the gstack ecosystem. Every agentic interaction must adhere to these principles to ensure high-quality, professional-grade output.

## 1. Core Philosophy (Ethos)

### 1.1 Boil the Lake
- **Completeness is Cheap**: AI-assisted coding makes the marginal cost of completeness near-zero. Never skip the "last 10%".
- **Lakes vs. Oceans**: 100% test coverage for a module, full error paths, and edge cases are "lakes" — boil them. Multi-quarter migrations are "oceans" — flag them as out of scope.
- **Preference for Fullness**: When choosing between a 90% shortcut and a 100% complete implementation, always choose the complete one.

### 1.2 Search Before Building
- **Knowledge Layers**:
  - **Layer 1 (Standard)**: Use battle-tested, standard patterns.
  - **Layer 2 (New/Popular)**: Search for current best practices, but scrutinize them.
  - **Layer 3 (First Principles)**: Reasoning from the specific problem.
- **Eureka Moments**: When first-principles reveal the conventional way is wrong, name the "eureka moment" and build on it.

### 1.3 User Sovereignty
- **AI Recommends, Users Decide**: Agreement between models (e.g., Claude and Codex) is a signal, not a mandate.
- **Human at the Center**: The human user always has the final say and the necessary domain context.

## 2. The gstack Workflow

Every task must follow this 7-step sequence:
1. **Think**: Understand the pain, not just the feature request.
2. **Plan**: Create structured `implementation_plan.md` with user review.
3. **Build**: High-fidelity implementation using Bun/TypeScript.
4. **Review**: Staff Engineer level audit via `/review` or `/codex`.
5. **Test**: Automated QA via `/qa` with real browser verification.
6. **Ship**: Atomic commits, PR creation, and CI/CD audit.
7. **Reflect**: Record operational learnings via `/learn`.

## 3. Engineering Standards

### 3.1 Runtime & Tooling
- **Primary Runtime**: **Bun** (fast, single binary, native SQLite/TypeScript).
- **Testing Framework**: **Vitest** for unit tests, **Playwright** for E2E and `/browse`.

### 3.2 Code Quality
- **Descriptive Naming**: Use professional, technical, and precise names for all variables, functions, and files.
- **TypeScript**: Mandatory type safety. No `any` without a first-principles justification.
- **Atomic Commits**: Each commit should represent one complete thought/fix.

### 3.3 The Iron Law of Debugging
- **No Fix Without Investigation**: Never "yolo" a fix. Use the `/investigate` skill to find the root cause (RCA).
- **Hypothesis Testing**: Traces data flow and test hypotheses before implementation.

## 4. Documentation & Communication

### 4.1 Builder Voice
- **Technical Clarity**: Be precise, data-dense, and professional.
- **No AI Slop**: Avoid generic apologies, over-politeness, or "as an AI" disclaimers.
- **Decision Artifacts**: Use `implementation_plan`, `task`, and `walkthrough` consistently for transparency.

### 4.2 Documentation Sync
- **Auto-Sync**: Keep `CLAUDE.md`, `README.md`, and `ARCHITECTURE.md` current via `/document-release`.
- **SKILL.md**: Maintain `.tmpl` files for skill documentation to avoid drift from source code.

## 5. Security & Safety
- **CSO Auditor**: Run `/cso` for OWASP Top 10 + STRIDE audits.
- **Guardrails**: Use `/careful` for destructive commands and `/freeze` to scope edits during debugging.
- **Localhost Bound**: Services must bind strictly to 127.0.0.1 with mandatory Bearer Token auth.
