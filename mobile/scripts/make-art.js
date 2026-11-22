// Builds the app icon layers and splash screens in mobile/assets from the brand files.
// Then "npm run icons" turns them into every Android / iPhone size.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const out = path.resolve(__dirname, "..", "assets");
const coco = fs.readFileSync(path.join(root, "french", "assets", "coco", "wave.svg"));
const bg = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B1055"/><stop offset="0.6" stop-color="#5B2A86"/><stop offset="1" stop-color="#B8436B"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
(async () => {
  // Adaptive icon (Android): Coco inside the 66% safe zone on a transparent layer, gradient behind.
  const fg = await sharp(coco, { density: 600 }).resize(600, 600, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fg, left: 212, top: 200 }]).png().toFile(path.join(out, "icon-foreground.png"));
  await sharp(bg(1024, 1024)).png().toFile(path.join(out, "icon-background.png"));
  // Splash: Coco waving on the brand purple.
  const sp = await sharp(coco, { density: 600 }).resize(900, 900, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  for (const name of ["splash.png", "splash-dark.png"])
    await sharp(bg(2732, 2732)).composite([{ input: sp, left: 916, top: 866 }]).png().toFile(path.join(out, name));
  console.log("icon + splash art written to mobile/assets");
})();
