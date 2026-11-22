// Builds French Coco expression SVGs for the web app from the brand kit drawing (coco.js).
// Run: node tools/brand/build_coco.js
const fs = require("fs"), path = require("path");
const { coco } = require("./coco.js");
const out = path.join(__dirname, "../../french/assets/coco");
fs.mkdirSync(out, { recursive: true });
const looks = {
  default: {}, blink: { expr: "blink" }, wave: { mood: "wave" }, happy: { mood: "happy", talk: 0.7 },
  laugh: { expr: "laugh" }, proud: { expr: "proud" }, wink: { expr: "wink", mood: "happy" }, think: { expr: "think", look: [3, -3] },
  oops: { expr: "oops" }, surprised: { expr: "surprised" },
};
for (const [name, o] of Object.entries(looks)) {
  const body = coco(Object.assign({ id: "fc-" + name, hat: "beret", scarf: "french", tuft: "side", detail: true }, o));
  fs.writeFileSync(path.join(out, name + ".svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="224" height="245" viewBox="-12 -6 224 245">${body}</svg>\n`);
}
console.log("wrote", Object.keys(looks).length, "files to", out);
