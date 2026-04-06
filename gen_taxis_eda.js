const pptxgen = require("pptxgenjs");
const fs = require("fs");

// Load stats
const stats = JSON.parse(fs.readFileSync("output/plots/stats.json", "utf8"));

const pptx = new pptxgen();

// Color Palette (Nordic)
const NORDIC_WHITE = "F9F9F9";
const NORDIC_BLUE = "4A6572";
const NORDIC_SAGE = "829079";
const NORDIC_CHARCOAL = "344955";

const TITLE_FONT = "IBM Plex Sans KR";
const BODY_FONT = "나눔고딕";

// 1. Title Slide
let slide1 = pptx.addSlide();
slide1.background = { fill: NORDIC_WHITE };
slide1.addText("Seaborn Taxis Dataset", {
    x: 1, y: 1.5, w: "80%", h: 1,
    fontSize: 44, color: NORDIC_CHARCOAL, fontFace: TITLE_FONT, bold: true, align: "center"
});
slide1.addText("Exploratory Data Analysis Report", {
    x: 1, y: 2.5, w: "80%", h: 0.5,
    fontSize: 24, color: NORDIC_BLUE, fontFace: BODY_FONT, align: "center"
});
slide1.addText("Senior Data Strategist | Nordic Style", {
    x: 1, y: 4.5, w: "80%", h: 0.5,
    fontSize: 14, color: NORDIC_SAGE, fontFace: BODY_FONT, italic: true, align: "center"
});

// 2. Executive Summary
let slide2 = pptx.addSlide();
slide2.background = { fill: NORDIC_WHITE };
slide2.addText("Executive Summary", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL, bold: true });
slide2.addText([
    { text: "Overview of NYC Taxi Operations (March 2019 Snapshot)", options: { fontSize: 18, color: NORDIC_BLUE, bold: true, break: true } },
    { text: `\n• Total Trips Analyzed: ${stats.count}`, options: { fontSize: 16 } },
    { text: `\n• Mean Total Fare: $${stats.mean_total}`, options: { fontSize: 16 } },
    { text: `\n• Max Fare Recorded: $${stats.max_total}`, options: { fontSize: 16 } },
    { text: `\n• Total Revenue (Sample): $${stats.total_revenue.toLocaleString()}`, options: { fontSize: 16 } }
], { x: 0.8, y: 1.5, w: 8, h: 3, fontFace: BODY_FONT });

// 3. Spatial Distribution
let slide3 = pptx.addSlide();
slide3.addText("Spatial Distribution: Top Pickup Boroughs", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL });
slide3.addImage({ path: "output/plots/borough_dist.png", x: 0.5, y: 1.5, w: 6, h: 3.5 });
slide3.addText("Key Insight:", { x: 6.8, y: 1.5, w: 2.5, h: 0.5, fontSize: 18, color: NORDIC_BLUE, bold: true });
slide3.addText("Manhattan dominates the taxi ecosystem, followed by Queens and Brooklyn. Enterprise logic suggests optimizing driver placement in Manhattan zones for maximum turnover.", {
    x: 6.8, y: 2, w: 2.5, h: 2.5, fontSize: 14, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});

// 4. Financial Analysis: Distance vs Fare
let slide4 = pptx.addSlide();
slide4.addText("Correlation: Distance vs Total Fare", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL });
slide4.addImage({ path: "output/plots/dist_fare.png", x: 0.5, y: 1.5, w: 6, h: 3.5 });
slide4.addText("Technical Rigor:", { x: 6.8, y: 1.5, w: 2.5, h: 0.5, fontSize: 18, color: NORDIC_SAGE, bold: true });
slide4.addText("High linear correlation observed. Pricing follows a strict distance-based incrementality model. Outliers suggest long-distance tolls or tip-heavy sessions.", {
    x: 6.8, y: 2, w: 2.5, h: 2.5, fontSize: 14, fontFace: BODY_FONT, color: NORDIC_CHARCOAL
});

// 5. Payment Insights
let slide5 = pptx.addSlide();
slide5.addText("Payment Dynamics", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL });
slide5.addImage({ path: "output/plots/payment_pie.png", x: 1, y: 1.5, w: 4, h: 3.5 });
slide5.addTable(
    [
        [{ text: "Method", options: { bold: true, fill: NORDIC_BLUE, color: "FFFFFF" } }, { text: "Frequency", options: { bold: true, fill: NORDIC_BLUE, color: "FFFFFF" } }],
        ["Credit Card", stats.payment_dist.credit_card || 0],
        ["Cash", stats.payment_dist.cash || 0]
    ],
    { x: 5.5, y: 1.5, w: 3.5, fontFace: BODY_FONT, border: { pt: 1, color: "CCCCCC" } }
);

// 6. Strategic Conclusion
let slide6 = pptx.addSlide();
slide6.background = { fill: NORDIC_WHITE };
slide6.addText("Business Recommendations", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: TITLE_FONT, color: NORDIC_CHARCOAL, bold: true });
slide6.addText([
    { text: "1. Demand Maximization: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "Stabilize fleet presence in Manhattan during peak hours.", options: { break: true } },
    { text: "2. Payment Optimization: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "Encourage Credit Card usage for transparent tipping patterns.", options: { break: true } },
    { text: "3. Future Analysis: ", options: { bold: true, color: NORDIC_BLUE } },
    { text: "Implement Causal Inference modeling for UI changes in ride-hailing apps.", options: { break: true } }
], { x: 1, y: 1.5, w: 8, h: 3, fontFace: BODY_FONT, fontSize: 18 });

pptx.writeFile({ fileName: "output/taxis-eda-nordic.pptx" }).then(fileName => {
    console.log(`Report saved to: ${fileName}`);
});
