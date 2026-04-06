const pptxgen = require("./node_modules/pptxgenjs");
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Colors (Teal Trust theme)
const PRIMARY = "028090";
const SECONDARY = "00A896";
const ACCENT = "02C39A";
const TEXT_DARK = "1E293B";
const TEXT_LIGHT = "F8FAFC";
const BG_DARK = "1E293B";
const BG_LIGHT = "F1F5F9";

// Master Slides
pres.defineSlideMaster({
  title: 'TITLE_SLIDE',
  background: { color: BG_DARK },
  objects: [
    { rect: { x: 0, y: 5.4, w: 10, h: 0.225, fill: { color: ACCENT } } }
  ]
});

pres.defineSlideMaster({
  title: 'CONTENT_SLIDE',
  background: { color: BG_LIGHT },
  objects: [
    { rect: { x: 0, y: 0, w: 10, h: 0.8, fill: { color: PRIMARY } } },
    { line: { x: 0.5, y: 5.2, w: 9, h: 0, line: { color: PRIMARY, width: 1 } } },
    { text: { text: "gstack Technical Manual | AI Engineering Workflow", options: { x: 0.5, y: 5.3, w: 5, color: PRIMARY, fontSize: 10 } } }
  ]
});

// Helper for consistency
const addTitle = (slide, title) => {
  slide.addText(title, { x: 0.5, y: 0, w: 9, h: 0.8, fontSize: 24, color: "FFFFFF", bold: true, valign: "middle" });
};

// Slides Generation
// 1. Cover
let s = pres.addSlide({ masterName: "TITLE_SLIDE" });
s.addText("gstack 기술 매뉴얼", { x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 44, color: "FFFFFF", bold: true });
s.addText("AI 에이전틱 개발 워크플로우: 풀스택 자동화 가이드", { x: 0.5, y: 2.5, w: 9, h: 1, fontSize: 22, color: ACCENT });
s.addText("2026-04-05", { x: 0.5, y: 4.5, w: 5, color: "FFFFFF", fontSize: 12 });

// 2. Overview
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "gstack 개요");
s.addText("gstack은 AI 에이전트에게 소프트웨어 개발을 위한 구조화된 역할을 부여하는 SKILL.md 파일 모음입니다.", { x: 0.5, y: 1.0, w: 9, fontSize: 18, color: TEXT_DARK, bold: true });
s.addText("각 스킬은 고유한 전문성을 가진 에이전트 역할을 정의합니다.", { x: 0.5, y: 1.8, w: 9, fontSize: 16, color: TEXT_DARK });
s.addText([
  { text: "CEO Reviewer (기획 검토)", options: { bullet: true, breakLine: true } },
  { text: "Engineering Manager (아키텍처 설계)", options: { bullet: true, breakLine: true } },
  { text: "UI/UX Designer (디자인 시스템)", options: { bullet: true, breakLine: true } },
  { text: "QA Lead (품질 검증)", options: { bullet: true, breakLine: true } },
  { text: "Release Engineer (배포 관리)", options: { bullet: true } }
], { x: 1, y: 2.5, w: 8, h: 2.5, fontSize: 16, color: PRIMARY });

// 3. Philosophy
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "설계 철학: \"Boil the Lake\"");
s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9, h: 1.5, fill: { color: "FFFFFF" }, shadow: { type: "outer", color: "000000", opacity: 0.1, blur: 5, offset: 2, angle: 135 } });
s.addText("\"AI가 보조 비용을 0에 가깝게 만들 때, 가장 완벽한 결과를 추구하라.\"", { x: 0.8, y: 1.3, w: 8.4, h: 1.3, fontSize: 20, color: PRIMARY, italic: true, align: "center", valign: "middle" });
s.addText([
  { text: "Completeness: 단순히 제안하는 것을 넘어 실제 동작하는 코드로 완성", options: { bullet: true, breakLine: true } },
  { text: "Specialized Agents: 상충되는 이해관계를 조정하여 최적의 합일점 도출", options: { bullet: true, breakLine: true } }
], { x: 1, y: 3.2, w: 8, h: 2, fontSize: 16, color: TEXT_DARK });

// 4. Specialist Roles
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "에이전트 역할 (Specialist Roles)");
s.addTable([
  ["CEO Reviewer", "10-star 제품 기획 및 사용자 가치 검토"],
  ["Eng Manager", "아키텍처 설계, 에지 케이스, 테스트 전략"],
  ["Designer", "디자인 시스템 구축 및 고품질 UI/UX 구현"],
  ["QA Lead", "브라우저 기반 버그 탐지 및 수정 자동화"],
  ["Debugger", "근본 원인 분석(RCA) 기반의 정밀 오류 해결"],
  ["Release Eng", "PR 생성, 테스트 확인, 자동 배포 관리"]
], { x: 0.5, y: 1.2, w: 9, fontSize: 14, rowH: 0.5, border: { pt: 0.25, color: "CBD5E1" } });

// 5. Technical Architecture
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "기술 아키텍처 (Architecture)");
s.addText("1. Daemon & Bun", { x: 0.5, y: 1.0, w: 4.25, fontSize: 16, bold: true, color: PRIMARY });
s.addText([
  { text: "Persistent Daemon: Chromium 데몬 상주 (Startup 3s → Commands 100ms)", options: { bullet: true, breakLine: true } },
  { text: "Bun Framework: 단일 바이너리 배포 및 네이티브 SQLite 연동", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: 4.25, fontSize: 13 });
s.addText("2. Interaction & Security", { x: 5.25, y: 1.0, w: 4.25, fontSize: 16, bold: true, color: PRIMARY });
s.addText([
  { text: "Ref 시스템 (@e/@c): DOM 변조 없는 접근성 트리 기반 제어", options: { bullet: true, breakLine: true } },
  { text: "Security: Localhost 바인딩, 토큰 인증, 키체인 사용자 승인", options: { bullet: true } }
], { x: 5.25, y: 1.5, w: 4.25, fontSize: 13 });
s.addShape(pres.shapes.LINE, { x: 5.0, y: 1.0, w: 0, h: 4.0, line: { color: "CBD5E1", width: 1 } });

// 6. Features
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "기술적 특징");
s.addTable([
  ["Headless Chromium ($B)", "고도로 최적화된 바이너리를 통한 고속 사이트 검증"],
  ["State Persistence", "세션 간 브라우저 상태(쿠키, 로그인 등) 영구 유지"],
  ["Binary-driven", "전용 컴파일 바이너리 활용으로 환경 의존성 제거"],
  ["Prompt Injection Guard", "외부 콘텐츠 정제 및 보안 검증 후 전달"]
], { x: 0.5, y: 1.5, w: 9, fontSize: 14, border: { pt: 0.5, color: "E2E8F0" } });

// 7-10. Skills
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "사용 가능한 스킬 (Planning)");
s.addTable([
  ["/office-hours", "아이디어 비판적 검토 및 재구성"],
  ["/plan-ceo-review", "핵심 제품 가치 탐색"],
  ["/plan-eng-review", "기술 설계의 무결성 검증"],
  ["/plan-design-review", "디자인 차원 평가 및 개선"]
], { x: 0.5, y: 1.2, w: 9, fontSize: 14, rowH: 0.7 });

s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "사용 가능한 스킬 (UI/UX & Quality)");
s.addTable([
  ["/design-consultation", "디자인 시스템 구축"],
  ["/design-review", "디자인 오딧 및 UI 수정"],
  ["/qa", "브라우저 기반 QA 자동화"],
  ["/qa-only", "코드 수정 없는 리포트 생성"]
], { x: 0.5, y: 1.2, w: 9, fontSize: 14, rowH: 0.7 });

s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "사용 가능한 스킬 (Debug & Ops)");
s.addTable([
  ["/debug", "근본 원인 분석(RCA) 해결"],
  ["/review", "병합 전 PR 리뷰"],
  ["/ship", "원클릭 PR 및 배포"],
  ["/document-release", "문서 실시간 최신화"]
], { x: 0.5, y: 1.2, w: 9, fontSize: 14, rowH: 0.7 });

s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "사용 가능한 스킬 (Safety & Maint)");
s.addTable([
  ["/retro", "주간 기여 성과 트래킹"],
  ["/careful /freeze", "파괴적 행위 경고 및 잠금"],
  ["/guard", "Careful + Freeze 동시 활성화"],
  ["/gstack-upgrade", "툴체인 최신 업데이트"]
], { x: 0.5, y: 1.2, w: 9, fontSize: 14, rowH: 0.6 });

// 11. Build Commands
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "주요 빌드 명령어");
s.addText([
  { text: "bun install / bun test", options: { bold: true, breakLine: true } },
  { text: "패키지 설치 및 유닛 테스트 (<5초)", options: { indentLevel: 1, breakLine: true } },
  { text: "bun run build", options: { bold: true, breakLine: true } },
  { text: "문서 생성 및 바이너리 컴포짓", options: { indentLevel: 1, breakLine: true } },
  { text: "bun run gen:skill-docs", options: { bold: true, breakLine: true } },
  { text: "SKILL.md 일괄 재생성", options: { indentLevel: 1 } }
], { x: 1, y: 1.5, w: 8, fontSize: 16 });

// 12. Conventions
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "핵심 컨벤션");
s.addText([
  { text: "• 템플릿 기반 관리: SKILL.md는 .tmpl에서만 수정", options: { breakLine: true } },
  { text: "• $B 바이너리: 브라우저 제어 전용 최적화 도구 사용", options: { breakLine: true } },
  { text: "• 지식 자산화: 모든 과정을 MD 아티팩트로 전이" }
], { x: 1, y: 1.5, w: 8, fontSize: 18 });

// 13. Artifacts
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "아티팩트 시스템");
s.addTable([
  ["implementation_plan.md", "기술 설계안 및 합의"],
  ["task.md", "실행 단계 TODO 리스트"],
  ["walkthrough.md", "완성 내역 및 검증 리포트"]
], { x: 0.5, y: 1.5, w: 9, fontSize: 16, rowH: 0.8 });

// 14. Parallelism Reasons
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "병렬 세션 실행의 기술적 근거");
s.addText("다중 워크스페이스(Multi-workspace) 환경에서의 충돌 방지 최적화", { x: 0.5, y: 0.8, w: 9, fontSize: 14, color: SECONDARY });
s.addText([
  { text: "무작위 포트 할당 (Dynamic Port Selection)", options: { bold: true, color: PRIMARY, breakLine: true } },
  { text: "10,000~60,000 랜덤 포트 선택으로 포트 충돌 원천 방지 (중복 시 5회 재시도)", options: { indentLevel: 1, breakLine: true } },
  { text: "워크스페이스별 상태 관리 (Workspace-Local State)", options: { bold: true, color: PRIMARY, breakLine: true } },
  { text: "각 루트의 .gstack/browse.json에 PID/포트/토큰 저장 (폴더 단위 격리)", options: { indentLevel: 1, breakLine: true } },
  { text: "독립적인 인증 토큰 (Bearer Token Auth)", options: { bold: true, color: PRIMARY, breakLine: true } },
  { text: "세션별 UUID 토큰 생성으로 타 세션의 데몬 오동작 방지", options: { indentLevel: 1, breakLine: true } },
  { text: "자동 라이프사이클 (Automatic Lifecycle)", options: { bold: true, color: PRIMARY, breakLine: true } },
  { text: "30분 유휴 상태 시 데몬 자동 종료로 리소스 낭비 최소화", options: { indentLevel: 1 } }
], { x: 1, y: 1.4, w: 8.5, fontSize: 14 });

// 15. Parallelism How-to
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "10개 병렬 세션 운영 방법");
s.addText("단일 워크스테이션에서 10명의 전문 에이전트를 동시에 운용하는 워크플로우", { x: 0.5, y: 0.8, w: 9, fontSize: 14, color: SECONDARY });
s.addTable([
  ["1. 폴더 구성", "project-1 ~ project-10 등 독립된 디렉토리 생성"],
  ["2. 워크스페이스 실행", "각 폴더에서 독립적인 Conductor/Claude 세션 시작"],
  ["3. 스킬 호출", "각 세션에서 $B snapshot 또는 /browse 호출 (투명한 데몬 구동)"],
  ["4. 병렬 작업", "세션별 격리된 쿠키/탭 상태로 독립 작업 동시 수행"],
  ["5. 멀티 모니터링", "크롬 사이드바 Activity Feed를 통해 10개 활동 실시간 감시"]
], { x: 0.5, y: 1.4, w: 9, fontSize: 14, rowH: 0.6, border: { pt: 0.25, color: "CBD5E1" } });

// 16. Conclusion
s = pres.addSlide({ masterName: "CONTENT_SLIDE" });
addTitle(s, "Q&A 및 결론");
s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 2.5, fill: { color: SECONDARY, transparency: 85 } });
s.addText("gstack은 단순한 도구가 아니라\nAI와 함께 더 깊게 고민하고 더 넓게 해결하는\n새로운 개발 문화를 지향합니다.", { x: 1, y: 1.8, w: 8, h: 2.0, fontSize: 24, align: "center", valign: "middle", color: PRIMARY, bold: true });
s.addText("Docs: https://garryslist.org/posts/boil-the-ocean", { x: 0.5, y: 4.5, w: 9, fontSize: 14, align: "center", color: PRIMARY });

// Generate File
pres.writeFile({ fileName: "output/gstack-manual.pptx" }).then(fileName => {
  console.log(`PPTX updated successfully (Added Parallelism slides): ${fileName}`);
});
