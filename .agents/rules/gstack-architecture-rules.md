---
trigger: always_on
description: Technical architecture and performance standards for gstack.
---

# gstack Architecture Rules

- **Browser Daemon ($B)**:
  - 100ms 명령 응답성 유지를 위해 장기 체류(Long-lived) 데몬 상주 방식 사용.
  - 세션 간 쿠키, 탭, 로그인 상태 영구 유지.
- **포트 할당**: 10,000~60,000 사이의 임의 포트를 사용하여 10개 이상의 병렬 워크스페이스 지원.
- **보안**: 
  - 로컬호스트 전용(127.0.0.1) 바인딩.
  - 베어러 토큰(UUID) 인증 필수.
  - 맥OS 키체인(Keychain) 접근 시 명시적 사용자 승인 필수.
- **배포 방식**: `bun build --compile`을 통한 단일 실행 바이너리 배포.
