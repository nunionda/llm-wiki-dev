const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

// Design Variables (Nordic Palette)
const NORDIC_WHITE = "F9F9F9";
const NORDIC_BLUE = "4A6572";
const NORDIC_SAGE = "829079";
const NORDIC_CHARCOAL = "344955";

const TITLE_FONT = "IBM Plex Sans KR";
const BODY_FONT = "나눔고딕";

// Helper: Common Header
function addTitleHeader(slide, title) {
    slide.background = { fill: NORDIC_WHITE };
    slide.addText(title, {
        x: 0.5, y: 0.3, w: 9, h: 1, fontSize: 28, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL, bold: true
    });
}

// 1. Title Slide
let slide1 = pptx.addSlide();
slide1.background = { fill: NORDIC_WHITE };
slide1.addText("Multi-Industry Strategic EDA Portfolio", {
    x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 44, color: NORDIC_CHARCOAL, fontFace: TITLE_FONT, bold: true, align: "center"
});
slide1.addText("Expert Analysis across Finance, Marketing, Healthcare, and E-commerce", {
    x: 0.5, y: 2.5, w: 9, h: 0.5, fontSize: 20, color: NORDIC_BLUE, fontFace: BODY_FONT, align: "center"
});
slide1.addText("Senior Data Strategist View | Nordic Framework Edition", {
    x: 0.5, y: 4.5, w: 9, h: 0.5, fontSize: 14, color: NORDIC_SAGE, fontFace: BODY_FONT, italic: true, align: "center"
});

// 2. Finance: Strategy
let slide2 = pptx.addSlide();
addTitleHeader(slide2, "1. Finance: Risk-Adjusted Return Optimization");
slide2.addText("자산 포트폴리오의 위험 조정 수익률(Risk-adjusted Return) 최적화. 고변동성 자산(TSLA)과 안정적 성장 자산(AAPL) 간의 수익성 전이(Volatility Spillover) 억제.\n\nModeling Framework:", {
    x: 0.8, y: 1.5, w: 8, h: 2, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide2.addImage({ path: "output/formulas/finance.png", x: 2, y: 3.5, w: 5, h: 0.8 });
slide2.addText("Recommendations: TSLA 비중 15% 이하 축소 및 인덱스 풋옵션 Delta Hedging 개시.", {
    x: 0.8, y: 4.8, w: 8, h: 0.8, fontSize: 16, fontFace: BODY_FONT, color: NORDIC_SAGE, italic: true
});

// 3. Finance: Visualization
let slide3 = pptx.addSlide();
addTitleHeader(slide3, "Finance Visual: Volatility Variance");
slide3.addImage({ path: "output/multi_industry/finance_volatility.png", x: 1, y: 1.2, w: 8, h: 4.5 });

// 4. Marketing: Strategy
let slide4 = pptx.addSlide();
addTitleHeader(slide4, "2. Marketing: Channel ROI & Attribution");
slide4.addText("마케팅 믹스 최적화(MMO). 유급 채널(Social, Search)과 유기적 채널(Email) 간의 효율성 비교. 멀티-터치 어트리뷰션(MTA) 기반 예산 재할당.\n\nModeling Framework:", {
    x: 0.8, y: 1.5, w: 8, h: 2, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide4.addImage({ path: "output/formulas/marketing.png", x: 2, y: 3.5, w: 5, h: 0.8 });
slide4.addText("Recommendations: Search 예산 40% 집중 및 Email 채널 Retention 강화.", {
    x: 0.8, y: 4.8, w: 8, h: 0.8, fontSize: 16, fontFace: BODY_FONT, color: NORDIC_SAGE, italic: true
});

// 5. Marketing: Visualization
let slide5 = pptx.addSlide();
addTitleHeader(slide5, "Marketing Visual: ROAS Efficiency");
slide5.addImage({ path: "output/multi_industry/marketing_roi.png", x: 1, y: 1.2, w: 8, h: 4.5 });

// 6. Healthcare: Strategy
let slide6 = pptx.addSlide();
addTitleHeader(slide6, "3. Healthcare: Vital Signal Correlation");
slide6.addText("심혈관 질환 조기 위험 감지 모델링. 수축기 혈압(Systolic BP)과 콜레스테롤 수치 간의 상관분석 및 고위험군 세그멘테이션.\n\nModeling Framework:", {
    x: 0.8, y: 1.5, w: 8, h: 2, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide6.addImage({ path: "output/formulas/healthcare.png", x: 2, y: 3.5, w: 5, h: 0.8 });
slide6.addText("Recommendations: 고혈압 환자군 대상 콜레스테롤 정밀 검사 필수 권고 시스템 구축.", {
    x: 0.8, y: 4.8, w: 8, h: 0.8, fontSize: 16, fontFace: BODY_FONT, color: NORDIC_SAGE, italic: true
});

// 7. Healthcare: Visualization
let slide7 = pptx.addSlide();
addTitleHeader(slide7, "Healthcare Visual: BP vs Cholesterol");
slide7.addImage({ path: "output/multi_industry/healthcare_correlation.png", x: 1, y: 1.2, w: 8, h: 4.5 });

// 8. E-commerce: Strategy
let slide8 = pptx.addSlide();
addTitleHeader(slide8, "4. E-commerce: LTV VIP Segmentation");
slide8.addText("고가치 고객(Whale) 식별 및 VIP 충성도 전략. 상위 5% 매출 기여도 분석 및 LTV 기반 세분화 전략.\n\nModeling Framework:", {
    x: 0.8, y: 1.5, w: 8, h: 2, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide8.addImage({ path: "output/formulas/ecommerce.png", x: 1.5, y: 3.5, w: 7, h: 1 });
slide8.addText("Recommendations: LTV 상위 2% 'Black Star' 등급 즉시 전환 및 전담 CS 배치.", {
    x: 0.8, y: 4.8, w: 8, h: 0.8, fontSize: 16, fontFace: BODY_FONT, color: NORDIC_SAGE, italic: true
});

// 9. E-commerce: Visualization
let slide9 = pptx.addSlide();
addTitleHeader(slide9, "E-commerce Visual: LTV Probability Distribution");
slide9.addImage({ path: "output/multi_industry/ecommerce_ltv.png", x: 1, y: 1.2, w: 8, h: 4.5 });

// 10. Conclusion
let slide10 = pptx.addSlide();
addTitleHeader(slide10, "Summary & Strategic Roadmap");
slide10.addText([
    { text: "1. Finance: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "TSLA 변동성 노출 축소 및 하방 방어 강화.\n", options: { break: true } },
    { text: "2. Marketing: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "Search 채널 예산 집중 및 Email 리텐션 병행.\n", options: { break: true } },
    { text: "3. Healthcare: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "조기 경보 시스템(Alert Engine) 구축 및 데이터 거버넌스 강화.\n", options: { break: true } },
    { text: "4. E-commerce: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "VVIP 블랙스타 세그먼트 전담 관리 및 AI 기반 자동 이탈 방지.", options: { break: true } }
], { x: 1, y: 1.5, w: 8, h: 4, fontFace: BODY_FONT, fontSize: 18 });

pptx.writeFile({ fileName: "output/multi-industry-strategic-report-fixed.pptx" }).then(fileName => {
    console.log(`Expert report generated at: ${fileName}`);
});
