// Coco drawing for the "Languages with Coco" identity.
// Based on brand/v2/source/build-v2.js (cocoV2): same 200x230 drawing space, same pivots.
// New options: hat (beret | none | headphones | cap), scarf (french | navy | cream | yellow), tuft (side | top).
const C = {
  yellow: "#ffd45c", yellowLight: "#ffe892", yellowDeep: "#f0b53c",
  gold: "#f4b73a", goldLight: "#ffd067", goldDeep: "#d9922a",
  cream: "#fff1c4", creamLight: "#fffaf0", creamDeep: "#f6dc98",
  beret: "#24305e", beretLight: "#3a4a85", beretDeep: "#161d3d",
  beak: "#ff9f43", beakLight: "#ffc27a", beakDark: "#e8743b", mouthIn: "#b8432a",
  eye: "#2b2140", cheek: "#ff8fa3",
  frBlue: "#0055A4", frRed: "#EF4135", frRedDeep: "#c22e25",
  line: "#5b3a1e",
  plum: "#2b1055", rose: "#d3546b", glowA: "#ff9a62", glowB: "#7b4dff", ink: "#1d1640",
  night: "#141B3D", indigo: "#3B2A8C",
};

// scarf palettes: left end, middle band, right end, hanging tail, knot
const SCARVES = {
  french: { l: C.frBlue, m: "#ffffff", r: C.frRed, tail: C.frRed, tailDeep: C.frRedDeep, knot: C.frRed },
  navy:   { l: C.beret, m: C.beret, r: C.beret, tail: C.beret, tailDeep: C.beretDeep, knot: C.yellow, stripe: C.yellow },
  cream:  { l: C.beret, m: "#fffaf0", r: C.beret, tail: "#fffaf0", tailDeep: C.creamDeep, knot: C.beret, stripe: C.beret },
  white:  { l: "#ffffff", m: "#ffffff", r: "#ffffff", tail: "#ffffff", tailDeep: "#d9d4e6", knot: C.yellow, stripe: C.beret },
};

function coco({ id = "c", mood = "idle", talk = 0.35, lid = 0, shadow = true, outline = true,
                hat = "beret", scarf = "french", tuft = "side", bubble = "", detail = false, expr = "", look = [0, 0] } = {}) {
  // detail: v3 richer drawing; expr: "" | surprised | wink | think | proud | oops | laugh; look: pupil offset [x, y]
  if (expr === "proud" || expr === "laugh") mood = mood === "wave" ? "wave" : "happy";
  if (expr === "surprised") talk = 0.9;
  if (expr === "oops") talk = 0.25;
  if (expr === "laugh") talk = 1;
  const happy = mood === "happy";
  const waveAngle = mood === "wave" ? -70 : happy ? -40 : 10;
  const leftWing = happy ? 40 : -10;
  const mouth = Math.min(1, talk) * 15;
  const S = outline ? `stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round"` : "";
  const g = (n) => `url(#${id}-${n})`;
  const sc = SCARVES[scarf] || SCARVES.french;

  const wingPath = "M0 -34 C13 -34 19 -16 18 4 C17.5 18 14 28 9 33 Q6 28 3 34 Q-1 28 -5 33 Q-9 27 -13 29 C-17 18 -18.5 6 -18 -6 C-17 -22 -11 -34 0 -34 Z";
  const wing = (cx, cy, mirror) => `
    <g transform="translate(${cx} ${cy}) ${mirror ? "scale(-1 1)" : ""}">
      <path d="${wingPath}" fill="${g("wing")}" ${S}/>
      <path d="M-9 8 Q-4 20 -5 31 M1 6 Q4 18 3 32 M9 2 Q12 16 9 31" stroke="${C.goldDeep}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.55"/>
      <path d="M-4 -22 Q3 -27 9 -18" stroke="#fff6d6" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.5"/>
    </g>`;
  const foot = (x, dir) => {
    const p = `M${x} 203 q${dir * -1} 6 ${dir * -8} 9 q${dir * -5} 2 ${dir * -4} 5 q${dir * 4} 1 ${dir * 8} -1 q${dir * 0} 3 ${dir * 4} 3 q${dir * 4} 0 ${dir * 6} -3 q${dir * 3} 2 ${dir * 7} 0 q${dir * 2} -6 ${dir * -3} -13 z`;
    return `<path d="${p}" fill="${g("beak")}" ${S}/>`;
  };
  const eyesOpen = (cx, cy) => {
    const lidH = 16 * lid;
    const big = expr === "surprised" ? 1.12 : 1;
    const ix = cx + 2 + look[0], iy = cy + 3 + look[1];
    const ir = expr === "surprised" ? 7.4 : detail ? 9.2 : 8.6, pr = expr === "surprised" ? 3.4 : detail ? 5 : 4.6;
    const o = cx < 100 ? -1 : 1;
    const lashes = detail ? `<path d="M${cx + o * 11} ${cy - 10} l${o * 5} -4 M${cx + o * 13.5} ${cy - 5} l${o * 5.5} -1.5" stroke="${C.eye}" stroke-width="2.4" stroke-linecap="round"/>` : "";
    const glint = detail ? `<path d="M${ix - ir * 0.7} ${iy + ir * 0.3} Q${ix} ${iy + ir * 0.95} ${ix + ir * 0.7} ${iy + ir * 0.3}" stroke="#9b7fd0" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>` : "";
    return `<g transform="translate(${cx} ${cy}) scale(${big}) translate(${-cx} ${-cy})">
        <ellipse cx="${cx}" cy="${cy}" rx="14" ry="16" fill="${g("sclera")}" ${outline ? `stroke="${C.eye}" stroke-width="1.6"` : ""}/>
        <circle cx="${ix}" cy="${iy}" r="${ir}" fill="${g("iris")}"/>${glint}
        <circle cx="${ix}" cy="${iy}" r="${ir}" fill="none" stroke="${C.eye}" stroke-width="1.6"/>
        <circle cx="${ix}" cy="${iy + 0.5}" r="${pr}" fill="#140c24"/>
        <circle cx="${ix + 3}" cy="${iy - 4}" r="${detail ? 3.6 : 3.2}" fill="#ffffff"/>
        <circle cx="${ix - 3}" cy="${iy + 4}" r="1.4" fill="#ffffff" opacity="0.85"/>
        ${detail ? `<circle cx="${ix + 5.5}" cy="${iy + 1}" r="0.9" fill="#ffffff" opacity="0.9"/>` : ""}${lashes}
        ${lid > 0 ? `<g clip-path="url(#${id}-eyeclip${cx})"><rect x="${cx - 16}" y="${cy - 17}" width="32" height="${1 + lidH * 2}" fill="${C.yellow}"/></g>` : ""}
        <path d="M${cx - 12} ${cy - 9} Q${cx} ${cy - 19.5} ${cx + 12} ${cy - 9}" stroke="${C.eye}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      </g>`;
  };
  const closedArc = (cx) => `<path d="M${cx - 10} 88 q10 -13 20 0" stroke="${C.eye}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const eyes = expr === "blink" ? `<path d="M64 88 q12 5 24 0 M112 88 q12 5 24 0" stroke="${C.eye}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : expr === "wink" ?`${eyesOpen(76, 86)}${closedArc(124)}`
    : happy
    ?`<path d="M66 88 q10 -13 20 0" stroke="${C.eye}" stroke-width="6" fill="none" stroke-linecap="round"/>
       <path d="M114 88 q10 -13 20 0" stroke="${C.eye}" stroke-width="6" fill="none" stroke-linecap="round"/>`
    : `${eyesOpen(76, 86)}${eyesOpen(124, 86)}`;
  const chevrons = (pts, op) => pts.map(([x, y, s]) =>
    `<path d="M${x - 4 * s} ${y} q${4 * s} ${4 * s} ${8 * s} 0" stroke="${C.yellowDeep}" stroke-width="${1.5 * s}" fill="none" stroke-linecap="round" opacity="${op}"/>`).join("");

  const BROWS = {
    "": ["M64 66 q12 -7 24 -1", "M112 65 q12 -6 24 1"],
    surprised: ["M63 57 q13 -9 26 -2", "M111 55 q13 -7 26 2"],
    wink: ["M64 66 q12 -7 24 -1", "M112 72 q12 -3 24 2"],
    think: ["M64 68 q12 -3 24 0", "M111 58 q13 -9 26 0"],
    proud: ["M64 64 q12 -8 24 0", "M112 64 q12 -8 24 0"],
    oops: ["M64 64 q12 2 24 8", "M112 72 q12 -6 24 -8"],
    laugh: ["M64 62 q12 -9 24 -1", "M112 61 q12 -8 24 1"],
  };
  const brows = (detail || expr) && expr !== "blink" && hat !== "aviator" && hat !== "grad" && hat !== "bucket"
    ? BROWS[expr || ""].map((d) => `<path d="${d}" stroke="${C.eye}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`).join("") : "";
  const sweat = expr === "oops" ? `<path d="M152 66 q7 10 0 15 q-7 -5 0 -15 Z" fill="#bfe6ff" stroke="${C.eye}" stroke-width="1.4"/>` : "";
  const thinkDots = expr === "think" ? `<circle cx="162" cy="60" r="3" fill="#fff" stroke="${C.eye}" stroke-width="1.2"/><circle cx="171" cy="49" r="4.4" fill="#fff" stroke="${C.eye}" stroke-width="1.2"/>` : "";
  const detailBody = detail ? `
      <path d="M36 118 Q44 78 86 66" stroke="#fffbe6" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.55"/>
      <path d="M150 180 Q168 162 171 132" stroke="${C.goldDeep}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.35"/>
      ${chevrons([[52, 182, 0.8], [148, 182, 0.8], [44, 104, 0.7], [156, 104, 0.7], [62, 196, 0.7], [138, 196, 0.7], [40, 120, 0.7], [160, 120, 0.7]], 0.45)}` : "";
  const detailBelly = detail ? `
      <ellipse cx="88" cy="150" rx="20" ry="8" fill="#ffffff" opacity="0.35"/>
      <g opacity="0.45" stroke="${C.creamDeep}" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M70 160 q4 4 8 0 M118 162 q4 4 8 0 M86 194 q4 3 8 0 M104 196 q4 3 8 0"/></g>` : "";
  const detailNeck = detail ? `<path d="M42 133 Q100 163 158 133" stroke="${C.goldDeep}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.3" filter="url(#${id}-soft)"/>` : "";
  const detailFace = detail ? `<g fill="#e7647e" opacity="0.55"><circle cx="53" cy="107" r="1.2"/><circle cx="58" cy="111" r="1.2"/><circle cx="62" cy="106" r="1.2"/><circle cx="138" cy="106" r="1.2"/><circle cx="142" cy="111" r="1.2"/><circle cx="147" cy="107" r="1.2"/></g>` : "";

  // ---- head pieces ----
  const tuftSide = `<path d="M131 72 Q138 58 152 54 Q145 61 145 66 Q151 61 159 62 Q150 66 147 78 Z" fill="${C.yellow}"/>
      ${outline ? `<path d="M131.5 71 Q138 58 152 54 Q145 61 145 66 Q151 61 159 62 Q150 66 147.5 77" stroke="${C.line}" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` : ""}`;
  // three-feather tuft on top of the head (used when there is no hat)
  const tuftTopPath = "M86 66 Q80 46 90 32 Q92 46 97 54 Q96 36 108 24 Q106 42 108 52 Q114 40 126 38 Q116 50 116 66 Z";
  const tuftTop = `<path d="${tuftTopPath}" fill="${g("body")}"/>
      ${outline ? `<path d="M86 66 Q80 46 90 32 Q92 46 97 54 Q96 36 108 24 Q106 42 108 52 Q114 40 126 38 Q116 50 116 66" stroke="${C.line}" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` : ""}`;

  const beret = `
      <path d="M92 36 q-1 -8 4 -12" stroke="${C.beretDeep}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="94" cy="36" r="6" fill="${C.beret}" ${S}/>
      <ellipse cx="92" cy="52" rx="46" ry="15" fill="${g("beret")}" transform="rotate(-10 92 52)" ${S}/>
      <path d="M50 64 Q92 72 136 50" stroke="${C.beretDeep}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.9"/>
      <path d="M62 44 Q88 33 116 38" stroke="#ffffff" stroke-opacity="0.22" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  const headphones = `
      <path d="M34 98 Q30 40 100 36 Q170 40 166 98" stroke="${C.line}" stroke-width="${outline ? 13 : 0}" fill="none" stroke-linecap="round"/>
      <path d="M34 98 Q30 40 100 36 Q170 40 166 98" stroke="${g("beret")}" stroke-width="8.5" fill="none" stroke-linecap="round"/>
      <path d="M46 70 Q62 46 96 42" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <rect x="22" y="80" width="24" height="38" rx="11" fill="${g("beret")}" ${S}/>
      <rect x="154" y="80" width="24" height="38" rx="11" fill="${g("beret")}" ${S}/>
      <rect x="38" y="86" width="9" height="26" rx="4.5" fill="${C.yellow}" ${S}/>
      <rect x="153" y="86" width="9" height="26" rx="4.5" fill="${C.yellow}" ${S}/>
      <path d="M27 88 v18 M173 88 v18" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2.4" stroke-linecap="round"/>`;

  const cap = `
      <path d="M118 64 Q150 52 178 64 Q176 74 150 74 Q132 74 120 74 Z" fill="${C.beretDeep}" ${S}/>
      <path d="M56 76 Q54 30 100 28 Q146 30 146 72 Q100 58 56 76 Z" fill="${g("beret")}" ${S}/>
      <path d="M100 28 Q98 48 100 62" stroke="${C.beretDeep}" stroke-width="2" fill="none" opacity="0.8"/>
      <circle cx="100" cy="29" r="4" fill="${C.yellow}" ${S}/>
      <path d="M68 52 Q74 38 92 34" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="78" cy="56" r="7.5" fill="${C.yellow}" ${S}/>
      <path d="M75 56 h6 M78 53 v6" stroke="${C.beret}" stroke-width="0"/>`;

  const grad = `
      <path d="M64 44 L64 62 Q100 76 136 62 L136 44 Z" fill="${g("beret")}" ${S}/>
      <path d="M100 22 L160 38 L100 54 L40 38 Z" fill="${g("beret")}" ${S}/>
      <path d="M58 36 L100 25 L132 33" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M100 38 Q130 40 150 42 L152 62" stroke="${C.yellow}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="38" r="4" fill="${C.yellow}" ${S}/>
      <path d="M147 60 h10 l2 16 h-14 z" fill="${C.yellow}" ${S}/>`;
  const bucket = `
      <path d="M60 60 Q62 24 100 22 Q138 24 140 60 Z" fill="${g("beret")}" ${S}/>
      <path d="M61 52 Q100 43 139 52" stroke="${C.yellow}" stroke-width="7" fill="none"/>
      <path d="M40 64 Q100 44 160 64 Q158 75 100 72 Q42 75 40 64 Z" fill="${g("beret")}" ${S}/>
      <path d="M72 36 Q84 28 100 27" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const aviator = `
      <path d="M38 102 Q28 40 100 32 Q172 40 162 102 Q152 78 100 72 Q48 78 38 102 Z" fill="${g("leather")}" ${S}/>
      <path d="M58 52 Q76 38 100 36" stroke="#ffffff" stroke-opacity="0.22" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M46 56 Q100 40 154 56" stroke="${C.line}" stroke-width="5" fill="none"/>
      <circle cx="80" cy="50" r="13" fill="#bfe6ff" stroke="${C.gold}" stroke-width="5"/>
      <circle cx="120" cy="50" r="13" fill="#bfe6ff" stroke="${C.gold}" stroke-width="5"/>
      ${outline ? `<circle cx="80" cy="50" r="15.5" fill="none" stroke="${C.line}" stroke-width="1.6"/><circle cx="120" cy="50" r="15.5" fill="none" stroke="${C.line}" stroke-width="1.6"/>` : ""}
      <path d="M74 45 l6 -4 M114 45 l6 -4" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <path d="M93 50 h14" stroke="${C.gold}" stroke-width="4"/>`;

  let headTop = "";
  if (hat === "grad") headTop = tuftSide + grad;
  else if (hat === "bucket") headTop = tuftSide + bucket;
  else if (hat === "aviator") headTop = aviator;
  else if (hat === "beret") headTop = (tuft === "side" ? tuftSide : "") + beret;
  else if (hat === "headphones") headTop = tuftTop + headphones;
  else if (hat === "cap") headTop = tuftSide + cap;
  else headTop = tuftTop;

  // ---- scarf ----
  const scarfShape = "M42 112 Q100 140 158 112 L160 128 Q100 158 40 128 Z";
  const stripes = sc.stripe
    ? `<path d="M44 117 Q100 146 156 117" stroke="${sc.stripe}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
       <path d="M42 124 Q100 153 158 124" stroke="${sc.stripe}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
       <path d="M130 147 l8 16" stroke="${sc.stripe}" stroke-width="3" stroke-linecap="round"/>`
    : "";
  const scarfSvg = `<g>
      <path d="M126 134 l16 30 l-14 4 l-10 -30 z" fill="${sc.tail}" ${S}/>
      <path d="M128 140 l10 20" stroke="${sc.tailDeep}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <path d="M142 164 l3 6 M137.5 165.3 l2.5 6.2 M133 166.6 l2 6.3 M128.5 167.8 l1.5 6.2" stroke="${sc.tail}" stroke-width="2.2" stroke-linecap="round"/>
      ${outline ? `<path d="M142 164 l3 6 M137.5 165.3 l2.5 6.2 M133 166.6 l2 6.3 M128.5 167.8 l1.5 6.2" stroke="${C.line}" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>` : ""}
      <path d="${scarfShape}" fill="${sc.m}" ${S}/>
      <path d="M42 112 Q60 121 72 125 L70 141 Q54 136 40 128 Z" fill="${sc.l}"/>
      <path d="M158 112 Q140 121 128 125 L130 141 Q146 136 160 128 Z" fill="${sc.r}"/>
      ${stripes}
      <path d="${scarfShape}" fill="${g("fold")}"/>
      <path d="M46 115 Q100 141 154 115" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="${scarfShape}" fill="none" ${S}/>
      <ellipse cx="127" cy="133" rx="7" ry="6" fill="${sc.knot}" ${S}/>
      <path d="M124 131 q3 -2 6 0" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>`;

  const bowtie = `<g>
      <path d="M100 124 L74 110 Q68 124 74 138 Z" fill="${g("beret")}" ${S}/>
      <path d="M100 124 L126 110 Q132 124 126 138 Z" fill="${g("beret")}" ${S}/>
      <g fill="${C.yellow}"><circle cx="80" cy="118" r="2.6"/><circle cx="82" cy="130" r="2.6"/><circle cx="120" cy="118" r="2.6"/><circle cx="118" cy="130" r="2.6"/></g>
      <rect x="93" y="117" width="14" height="14" rx="4" fill="${C.yellow}" ${S}/>
    </g>`;
  const bubbleSvg = bubble ? `<g>
      <path d="M150 4 H204 Q212 4 212 12 V40 Q212 48 204 48 H170 L156 60 L160 48 H150 Q142 48 142 40 V12 Q142 4 150 4 Z" fill="#ffffff" ${S}/>
      <text x="177" y="35" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="${bubble.length > 4 ? 17 : 24}" fill="${C.ink}">${bubble}</text>
    </g>` : "";  return `
  <defs>
    <radialGradient id="${id}-body" cx="0.36" cy="0.30" r="0.78">
      <stop offset="0" stop-color="${C.yellowLight}"/><stop offset="0.55" stop-color="${C.yellow}"/><stop offset="1" stop-color="${C.yellowDeep}"/>
    </radialGradient>
    <radialGradient id="${id}-belly" cx="0.42" cy="0.32" r="0.75">
      <stop offset="0" stop-color="${C.creamLight}"/><stop offset="0.7" stop-color="${C.cream}"/><stop offset="1" stop-color="${C.creamDeep}"/>
    </radialGradient>
    <linearGradient id="${id}-wing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.goldLight}"/><stop offset="0.6" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/>
    </linearGradient>
    <linearGradient id="${id}-beret" x1="0.2" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="${C.beretLight}"/><stop offset="0.6" stop-color="${C.beret}"/><stop offset="1" stop-color="${C.beretDeep}"/>
    </linearGradient>
    <linearGradient id="${id}-leather" x1="0.2" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="#a8704a"/><stop offset="0.6" stop-color="#8a5634"/><stop offset="1" stop-color="#5e3820"/>
    </linearGradient>
    <linearGradient id="${id}-beak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.beakLight}"/><stop offset="1" stop-color="${C.beak}"/>
    </linearGradient>
    <radialGradient id="${id}-sclera" cx="0.45" cy="0.35" r="0.7">
      <stop offset="0.6" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e3f3"/>
    </radialGradient>
    <radialGradient id="${id}-iris" cx="0.5" cy="0.65" r="0.6">
      <stop offset="0" stop-color="#6a4c98"/><stop offset="1" stop-color="#33224f"/>
    </radialGradient>
    <radialGradient id="${id}-cheek" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.cheek}" stop-opacity="0.85"/><stop offset="1" stop-color="${C.cheek}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-fold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="${id}-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
    <clipPath id="${id}-bodyclip"><circle cx="100" cy="135" r="72"/></clipPath>
    <clipPath id="${id}-eyeclip76"><ellipse cx="76" cy="86" rx="14" ry="16"/></clipPath>
    <clipPath id="${id}-eyeclip124"><ellipse cx="124" cy="86" rx="14" ry="16"/></clipPath>
  </defs>
  <g class="coco">
    ${shadow ? `<ellipse cx="100" cy="222" rx="58" ry="8" fill="rgba(0,0,0,0.22)"/>` : ""}
    ${foot(80, -1)}${foot(120, 1)}
    <g transform="rotate(${leftWing} 44 130)">${wing(34, 140, false)}</g>
    <g transform="rotate(${waveAngle} 156 130)">${wing(166, 140, true)}</g>
    ${hat === "headphones" || hat === "none" ? tuftTop : ""}
    <circle cx="100" cy="135" r="72" fill="${g("body")}" ${S}/>
    <g clip-path="url(#${id}-bodyclip)">
      <ellipse cx="128" cy="196" rx="70" ry="30" fill="${C.yellowDeep}" opacity="0.35"/>
      ${chevrons([[40, 150, 1], [46, 166, 0.9], [160, 150, 1], [154, 166, 0.9], [36, 134, 0.8], [164, 134, 0.8]], 0.55)}
      ${detailBody}
    </g>
    <ellipse cx="100" cy="160" rx="46" ry="40" fill="${g("belly")}"/>
    <g opacity="0.5" stroke="${C.creamDeep}" stroke-width="1.6" fill="none" stroke-linecap="round">
      <path d="M84 168 q5 5 10 0 M100 172 q5 5 10 0 M92 182 q5 5 10 0 M108 186 q5 4 10 0 M78 184 q4 4 8 0"/>
    </g>
    ${detailBelly}${detailNeck}
    ${scarf === "bowtie" ? bowtie : scarfSvg}
    <g class="head">
      ${hat === "headphones" ? headphones : hat === "none" ? "" : headTop}
      ${eyes}${brows}${sweat}${thinkDots}
      <ellipse cx="58" cy="108" rx="13" ry="8" fill="${g("cheek")}"/>
      <ellipse cx="142" cy="108" rx="13" ry="8" fill="${g("cheek")}"/>
      <path d="M86 104 Q100 ${120 + mouth} 114 104 Z" fill="${C.beakDark}" ${S}/>
      ${mouth > 4 ? `<ellipse cx="100" cy="${108 + mouth * 0.45}" rx="6" ry="${Math.max(1, mouth * 0.25)}" fill="${C.mouthIn}"/>` : ""}
      <path d="M84 104 Q100 92 116 104 Q100 112 84 104 Z" fill="${g("beak")}" ${S}/>
      <path d="M91 100 Q100 95 108 99" stroke="#fff3df" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.8"/>
      <circle cx="96" cy="102" r="0.9" fill="${C.beakDark}"/><circle cx="104" cy="102" r="0.9" fill="${C.beakDark}"/>${detailFace}
    </g>
    ${bubbleSvg}
  </g>`;
}

module.exports = { coco, C };
