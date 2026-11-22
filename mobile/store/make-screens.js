// Makes the store screenshots from the app files (mobile/www) with Playwright.
// Usage: node store/make-screens.js <port-serving-mobile/www> <out-dir>
// Output: play-*.png (1080x2160, Google Play) and appstore-*.png (1290x2796, iPhone 6.7"/6.9").
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const port = process.argv[2] || "8799";
const out = path.resolve(process.argv[3] || "store-shots");
fs.mkdirSync(out, { recursive: true });
const base = "http://localhost:" + port + "/french/index.html";
const today = new Date();
const day = (n) => new Date(today - n * 864e5).toISOString().slice(0, 10);
// A learner a few lessons in, so the screens look lived-in.
const progress = {
  lang: "en", xp: 340, sound: true, days: [day(3), day(2), day(1), day(0)], badges: ["first", "match", "quiz100", "streak3"],
  lessons: {
    "A1-01": { watched: true, words: true, sheet: true, quizBest: 100, quizLast: 100, games: { match: { n: 2, stars: 3 } } },
    "A1-02": { watched: true, words: true, quizBest: 90, quizLast: 90 },
    "A1-03": { watched: true, quizBest: 80, quizLast: 80 }
  }
};
const shots = [
  { id: "1-home", route: "#/", en: ["Learn French", "with Coco"], sub: "Free animated lessons, step by step" },
  { id: "2-lesson", route: "#/lesson/A1-04", en: ["Short video", "lessons"], sub: "Watch, learn the words, practise" },
  { id: "3-quiz", route: "#/quiz/A1-04", en: ["Quizzes after", "every lesson"], sub: "Listen, choose and check yourself" },
  { id: "4-game", route: "#/play/A1-04/match", en: ["Games that make", "words stick"], sub: "Match, flashcards, speaking, role-play" },
  { id: "5-progress", route: "#/progress", en: ["Watch yourself", "grow"], sub: "XP, streaks and badges" },
  { id: "6-arabic", route: "#/", lang: "ar", en: ["English or", "Arabic"], sub: "Choose the language you learn in" }
];
const sizes = [
  { name: "play", w: 1080, h: 2160 },
  { name: "appstore", w: 1290, h: 2796 }
];
(async () => {
  const browser = await chromium.launch();
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await ctx.addInitScript((p) => { try { localStorage.setItem("coco-progress-v1", JSON.stringify(p)); } catch (e) {} }, Object.assign({}, progress, { lang: s.lang || "en" }));
    const page = await ctx.newPage();
    await page.goto(base + s.route, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(2500);
    const raw = (await page.screenshot()).toString("base64");
    await ctx.close();
    for (const z of sizes) {
      const p = await browser.newPage({ viewport: { width: z.w, height: z.h } });
      const phoneW = Math.round(z.w * 0.78), phoneH = Math.round(phoneW * 2);
      await p.setContent(`<!doctype html><html><head>
<link href="http://localhost:${port}/assets/brand/brand.css" rel="stylesheet">
<style>
html,body{margin:0;width:${z.w}px;height:${z.h}px;overflow:hidden}
body{background:linear-gradient(160deg,#2B1055 0%,#5B2A86 55%,#D3546B 100%);font-family:"Baloo 2","Nunito",system-ui,sans-serif;color:#fff;text-align:center}
h1{margin:${Math.round(z.h * 0.045)}px 40px 0;font-size:${Math.round(z.w * 0.085)}px;line-height:1.05;font-weight:800}
h1 b{color:#FFD45C}
p{margin:${Math.round(z.h * 0.012)}px 40px 0;font-size:${Math.round(z.w * 0.038)}px;opacity:.92;font-weight:700}
.phone{position:absolute;left:50%;transform:translateX(-50%);bottom:-${Math.round(phoneH * 0.06)}px;width:${phoneW}px;height:${phoneH}px;
 border-radius:${Math.round(phoneW * 0.1)}px;background:#120a26;padding:${Math.round(phoneW * 0.025)}px;box-sizing:border-box;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:${Math.round(phoneW * 0.08)}px;display:block}
</style></head><body>
<h1>${s.en[0]}<br><b>${s.en[1]}</b></h1><p>${s.sub}</p>
<div class="phone"><img src="data:image/png;base64,${raw}"></div>
</body></html>`, { waitUntil: "networkidle" }).catch(() => {});
      await p.waitForTimeout(400);
      await p.screenshot({ path: path.join(out, `${z.name}-${s.id}.png`) });
      await p.close();
    }
    console.log("made", s.id);
  }
  // Google Play feature graphic (1024x500) and 512x512 icon.
  const fg = await browser.newPage({ viewport: { width: 1024, height: 500 } });
  await fg.setContent(`<!doctype html><html><head><link href="http://localhost:${port}/assets/brand/brand.css" rel="stylesheet"><style>
html,body{margin:0;width:1024px;height:500px;overflow:hidden}
body{background:linear-gradient(120deg,#2B1055,#5B2A86 60%,#D3546B);font-family:"Baloo 2",system-ui,sans-serif;color:#fff;display:flex;align-items:center}
.t{padding-left:70px;flex:1} h1{font-size:74px;line-height:1;margin:0;font-weight:800} h1 b{color:#FFD45C} p{font-size:26px;margin:18px 0 0;font-weight:700;opacity:.92;white-space:nowrap}
img{height:400px;margin-right:60px}</style></head><body>
<div class="t"><h1>Learn French<br><b>with Coco</b></h1><p>Free animated lessons · quizzes · games</p></div>
<img src="http://localhost:${port}/french/assets/coco/wave.svg"></body></html>`, { waitUntil: "networkidle" }).catch(() => {});
  await fg.waitForTimeout(400);
  await fg.screenshot({ path: path.join(out, "play-feature-graphic.png") });
  await browser.close();
})();
