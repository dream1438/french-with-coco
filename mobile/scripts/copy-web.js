// Copies the website files the app needs into mobile/www (the folder Capacitor bundles into the app).
// The website stays the single source: change french/ or assets/, then run "npm run sync".
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const www = path.resolve(__dirname, "..", "www");
const parts = ["french", "assets", "privacy", "terms"];
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });
for (const p of parts) fs.cpSync(path.join(root, p), path.join(www, p), { recursive: true });
// The app opens straight into the French course.
fs.writeFileSync(path.join(www, "index.html"),
  '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<style>html,body{margin:0;background:#2B1055}</style><script>location.replace("french/index.html" + location.hash)</script>\n');
// Capacitor's own scripts (bridge + App and Browser plugins), loaded before french/native.js.
const nm = path.resolve(__dirname, "..", "node_modules", "@capacitor");
const nat = path.join(www, "french", "native");
fs.mkdirSync(nat, { recursive: true });
fs.copyFileSync(path.join(nm, "core", "dist", "capacitor.js"), path.join(nat, "capacitor.js"));
fs.copyFileSync(path.join(nm, "app", "dist", "plugin.js"), path.join(nat, "app.js"));
fs.copyFileSync(path.join(nm, "browser", "dist", "plugin.js"), path.join(nat, "browser.js"));
// Mark the bundled pages as running inside the app (body class "in-app", set before first paint).
const idx = path.join(www, "french", "index.html");
let html = fs.readFileSync(idx, "utf8");
html = html.replace("<body>", '<body>\n<script>document.body.classList.add("in-app")</script>');
html = html.replace(/<script src="native\.js[^"]*"><\/script>/, function (m) {
  return '<script src="native/capacitor.js"></script>\n<script src="native/app.js"></script>\n<script src="native/browser.js"></script>\n' + m;
});
if (!/native\/capacitor\.js/.test(html)) throw new Error("french/index.html has no native.js script tag");
fs.writeFileSync(idx, html);
let n = 0; (function count(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) f.isDirectory() ? count(path.join(d, f.name)) : n++; })(www);
console.log("Copied " + n + " files into mobile/www");
