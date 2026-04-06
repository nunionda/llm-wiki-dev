const pptxgen = require("pptxgenjs");
const fs = require("fs");

// Load expert stats
const report = JSON.parse(fs.readFileSync("output/plots/expert_report.json", "utf8"));

const pptx = new pptxgen();

// Design Variables
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
        x: 0.5, y: 0.2, w: 9, h: 1, fontSize: 32, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL, bold: true
    });
}

// Slide 1: Title
let slide1 = pptx.addSlide();
slide1.background = { fill: NORDIC_WHITE };
slide1.addText("NYC Taxi Operations Strategic Analysis", {
    x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 48, color: NORDIC_CHARCOAL, fontFace: TITLE_FONT, bold: true, align: "center"
});
slide1.addText("Senior Data Strategist View | Nordic Framework Edition", {
    x: 0.5, y: 2.5, w: 9, h: 0.5, fontSize: 22, color: NORDIC_BLUE, fontFace: BODY_FONT, align: "center"
});
slide1.addText("Prepared for Executive Leadership", {
    x: 0.5, y: 4.5, w: 9, h: 0.5, fontSize: 14, color: NORDIC_SAGE, fontFace: BODY_FONT, align: "center", italic: true
});

// Slide 2: Business Objective (Step 1)
let slide2 = pptx.addSlide();
addTitleHeader(slide2, "1. Business Objective Refinement");
slide2.addText(report.step_1_objective, {
    x: 0.8, y: 1.5, w: 8, h: 3, fontSize: 20, fontFace: BODY_FONT, color: NORDIC_CHARCOAL, lineSpacing: 35
});
slide2.addText("Framework: MECE (Mutually Exclusive, Collectively Exhaustive)", {
    x: 0.8, y: 4.8, w: 8, h: 0.5, fontSize: 14, color: NORDIC_BLUE, bold: true, fontFace: BODY_FONT
});

// Slide 3: Methodology (Step 2)
let slide3 = pptx.addSlide();
addTitleHeader(slide3, "2. Data Refinement & Methodology");
slide3.addText(report.step_2_methodology, {
    x: 0.8, y: 1.5, w: 8, h: 2, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide3.addImage({ path: "output/plots/expert_borough.png", x: 2, y: 3.5, w: 6, h: 2 });
slide3.addText("Sample Bias Alert: High concentration in Manhattan zones detected.", {
    x: 2, y: 5.2, w: 6, h: 0.5, fontSize: 12, color: NORDIC_SAGE, fontFace: BODY_FONT, align: "center"
});

// Slide 4: Model Selection (Step 3) - Causal Modeling
let slide4 = pptx.addSlide();
addTitleHeader(slide4, "3. Model Selection: Causal Impact");
slide4.addText(report.step_3_modeling.analysis, {
    x: 0.5, y: 1.2, w: 4, h: 2, fontSize: 16, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});
slide4.addText("Quantitative Framework:", {
    x: 0.5, y: 3.2, w: 4, h: 0.5, fontSize: 18, color: NORDIC_BLUE, bold: true, fontFace: BODY_FONT
});
slide4.addText(report.step_3_modeling.latex_formula, {
    x: 0.5, y: 3.8, w: 4, h: 1, fontSize: 22, color: NORDIC_CHARCOAL, fontFace: "Courier New", bold: true
});
slide4.addImage({ path: "output/plots/expert_dist_fare.png", x: 4.8, y: 1.5, w: 4.8, h: 3.5 });

// Slide 5: Risks (Step 4)
let slide5 = pptx.addSlide();
addTitleHeader(slide5, "4. Multi-Dimensional Risks & Limitations");
slide5.addText(report.step_4_risks, {
    x: 0.8, y: 1.5, w: 8, h: 3, fontSize: 20, fontFace: BODY_FONT, color: NORDIC_CHARCOAL, lineSpacing: 35
});
slide5.addText("Confidence Level Assessment: Moderate-to-High for NYC zones.", {
    x: 0.8, y: 4.8, w: 8, h: 0.5, fontSize: 14, color: NORDIC_BLUE, bold: true, fontFace: BODY_FONT
});

// Slide 6: Recommendations (Step 5)
let slide6 = pptx.addSlide();
addTitleHeader(slide6, "5. Strategic Execution Roadmap");
slide6.addText("Actionable Business 제언", {
    x: 0.8, y: 1.5, w: 8, h: 0.5, fontSize: 22, color: NORDIC_BLUE, bold: true, fontFace: TITLE_FONT
});
slide6.addText(report.step_5_actionable_recommendations, {
    x: 0.8, y: 2.2, w: 8, h: 3, fontSize: 18, fontFace: BODY_FONT, color: NORDIC_CHARCOAL, lineSpacing: 35
});

pptx.writeFile({ fileName: "output/taxis-strategic-report.pptx" }).then(fileName => {
    console.log(`Expert report generated at: ${fileName}`);
});
