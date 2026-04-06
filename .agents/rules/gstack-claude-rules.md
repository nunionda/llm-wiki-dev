---
trigger: always_on
description: Core commands and testing tiers for gstack development.
---

# gstack CLAUDE.MD Rules

- **Project Core**: `bun` 기반의 런타임 환경.
- **주요 명령어**:
  - `bun install`: 모든 의존성 설치
  - `bun test`: 무료 유닛 테스트 (5초 이내 완료)
  - `bun run build`: 문서 생성 및 바이너리 컴파일
  - `bun run gen:skill-docs`: 템플릿(`.tmpl`) 기반 SKILL.md 재생성
- **테스트 규칙**:
  - `gate`: 커밋 전 필수 (무료/고속)
  - `periodic`: 배포 전 필수 (유료/E2E/LLM-as-judge)
- **문서화**: `SKILL.md`를 직접 수정하지 말고 반드시 `.tmpl` 소스를 수정하십시오.
