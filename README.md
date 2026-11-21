# Languages with Coco (web app)

Root page = Languages with Coco. Each language is a folder: `french/` is the French course (A1 open).

Plain HTML, CSS and JavaScript. No build step, no accounts, no server needed to host it.

## Open it
- Quick look: double-click `index.html` (videos may not play from a file).
- Full preview with videos: right-click `start-app.ps1` > Run with PowerShell. It opens http://localhost:8787 (French: http://localhost:8787/french/). Speaking practice needs Chrome or Edge and this local address (the microphone doesn't work from a file).

## What's inside
- `index.html`: Languages with Coco landing page.
- `french/index.html`, `french/styles.css`, `french/app.js`: the French app. `french/games.js`: Coco reactions, sounds, XP/streak/badges and the practice games (match, flashcards, speaking, role-play).
- `french/data/lessons.js`: words, grammar notes, dialogue, recap and quiz for A1-01..A1-24, generated from the lesson scripts.
- `french/data/links.js`: YouTube video id and Google Drive worksheet id for each lesson. **Add a line here when a new lesson goes live.**
- `assets/coco.svg` and `french/assets/coco.svg`: Coco (brand\logo\coco-mascot-transparent.svg).
- `tools/build_data.py` + `tools/arabic_meanings.tsv`: rebuild `french/data/lessons.js` from the YAMLs (paths inside point at the cloud copy; adjust to pipeline\lessons on the PC).

## Features
Lessons in course order (units, bonus dialogues after lessons 5 and 10), YouTube player, worksheets, quizzes from each script (multiple choice, fill the gap, listening with the browser's French voice), progress saved on the device, Arabic mode (Arabic interface, Arabic meanings, YouTube plays with Arabic subtitles on).

## Not done yet (needs the owner's yes)
- Public hosting (e.g. GitHub Pages, Netlify, Cloudflare Pages) and a domain.
- Accounts / progress sync across devices, paid extras.
