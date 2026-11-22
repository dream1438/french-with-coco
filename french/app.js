/* Learn French with Coco: web app (first version, A1).
   Plain HTML/CSS/JS, no build step. Content: data/lessons.js (from the lesson scripts) and data/links.js. */
(function () {
  "use strict";
  var LESSONS = window.COURSE_LESSONS || [];
  var LINKS = window.COURSE_LINKS || { lessons: {}, bonuses: [] };
  var app = document.getElementById("app");
  var PASS = 70; // % needed to pass a quiz

  /* ---------------- text (English / Arabic) ---------------- */
  var T = {
    en: {
      navLessons: "Lessons", navProgress: "My progress", footer: "Free lessons on YouTube.",
      heroTitle: "Learn French <em>with Coco</em>",
      heroText: "Short animated lessons, from your first Bonjour to real conversations. Watch, learn the words, take the quiz, and download the worksheet.",
      start: "Start lesson 1", cont: "Continue: lesson ", allDone: "Review the course",
      doneOf: function (a, b) { return a + " of " + b + " lessons done"; },
      lesson: "Lesson", bonus: "Bonus", soon: "Coming soon", done: "Done", quiz: "Quiz",
      watch: "Watch the lesson", words: "Words", grammar: "Grammar", dialogue: "Dialogue", recap: "Recap",
      yourSteps: "Your steps", stepWatch: "Watch the video", stepWords: "Learn the words", stepQuiz: "Pass the quiz (" + PASS + "%)", stepSheet: "Do the worksheet",
      watched: "I watched it", watchedYes: "Watched", takeQuiz: "Take the quiz", retake: "Take the quiz again",
      worksheet: "Worksheet (PDF)", worksheetFolder: "All worksheets", openYT: "Open on YouTube",
      soonVideo: "This lesson's video is coming soon. You can already learn the words and take the quiz.",
      tapHear: "Tap a word to hear it in French.",
      prev: "Previous", next: "Next",
      qOf: function (a, b) { return "Question " + a + " of " + b; },
      kQuiz: "Choose the answer", kFill: "Complete the sentence", kListen: "Listen and choose",
      play: "Play", check: "Check", nextQ: "Next", seeScore: "See my score",
      right: "Bravo! ", wrong: "Not quite. The answer is: ",
      score: "Your score", passed: "Bravo! You passed this lesson's quiz.", failed: "Good try! Watch the video again and have another go.",
      backLesson: "Back to the lesson", nextLesson: "Next lesson",
      progTitle: "My progress", stLessons: "lessons done", stQuiz: "average quiz score", stDays: "days of practice", stWords: "words seen",
      colLesson: "Lesson", colVideo: "Video", colQuiz: "Best quiz", reset: "Reset my progress", resetAsk: "Delete all your progress on this device?",
      savedHere: "Your progress is saved on this device only.",
      arNote: "", levelSoon: "Coming later",
      extrasTitle: "Coco Plus is coming later", extrasText: "Extra practice packs and live classes may come here later. All lessons stay free on YouTube.",
      unit: "Unit", min: "min", noVoice: "Your browser has no French voice. Try Chrome or Edge.",
      bonusAbout: "Real conversation", listenFirst: "Press Play to hear the sentence.",
      eyebrow: "Beginner A1 · free", tapCoco: "Tap Coco", todayStart: "Ready for your first lesson?", todayNext: "Up next", todayDone: "You finished A1. Bravo !",
      lessonsLeft: function (n) { return n + (n === 1 ? " lesson" : " lessons") + " to finish A1"; }, nextBadge: "Next", path: "Your A1 path", lessonProg: "lesson progress"
    },
    ar: {
      navLessons: "الدروس", navProgress: "تقدّمي", footer: "دروس مجانية على يوتيوب.",
      heroTitle: "تعلّم الفرنسية <em>مع كوكو</em>",
      heroText: "دروس متحركة قصيرة، من أول Bonjour إلى محادثات حقيقية. شاهد الدرس، تعلّم الكلمات، حلّ الاختبار، وحمّل ورقة التمارين.",
      start: "ابدأ الدرس 1", cont: "تابع: الدرس ", allDone: "راجع الدورة",
      doneOf: function (a, b) { return "أنهيت " + a + " من " + b + " درسًا"; },
      lesson: "الدرس", bonus: "إضافي", soon: "قريبًا", done: "تم", quiz: "اختبار",
      watch: "شاهد الدرس", words: "الكلمات", grammar: "القواعد", dialogue: "الحوار", recap: "الملخّص",
      yourSteps: "خطواتك", stepWatch: "شاهد الفيديو", stepWords: "تعلّم الكلمات", stepQuiz: "انجح في الاختبار (" + PASS + "٪)", stepSheet: "حلّ ورقة التمارين",
      watched: "شاهدته", watchedYes: "تمت المشاهدة", takeQuiz: "ابدأ الاختبار", retake: "أعد الاختبار",
      worksheet: "ورقة التمارين (PDF)", worksheetFolder: "كل أوراق التمارين", openYT: "افتح على يوتيوب",
      soonVideo: "فيديو هذا الدرس قريبًا. يمكنك الآن تعلّم الكلمات وحلّ الاختبار.",
      tapHear: "اضغط على الكلمة لتسمعها بالفرنسية.",
      prev: "السابق", next: "التالي",
      qOf: function (a, b) { return "السؤال " + a + " من " + b; },
      kQuiz: "اختر الإجابة", kFill: "أكمل الجملة", kListen: "استمع واختر",
      play: "استمع", check: "تحقّق", nextQ: "التالي", seeScore: "اعرض نتيجتي",
      right: "أحسنت! ", wrong: "ليس تمامًا. الإجابة هي: ",
      score: "نتيجتك", passed: "أحسنت! نجحت في اختبار هذا الدرس.", failed: "محاولة جيدة! شاهد الفيديو مرة أخرى وحاول من جديد.",
      backLesson: "العودة إلى الدرس", nextLesson: "الدرس التالي",
      progTitle: "تقدّمي", stLessons: "دروس منتهية", stQuiz: "متوسط نتيجة الاختبارات", stDays: "أيام تدريب", stWords: "كلمات تعلّمتها",
      colLesson: "الدرس", colVideo: "الفيديو", colQuiz: "أفضل نتيجة", reset: "امسح تقدّمي", resetAsk: "هل تريد حذف كل تقدّمك على هذا الجهاز؟",
      savedHere: "يُحفظ تقدّمك على هذا الجهاز فقط.",
      arNote: "الشرح في الفيديو بالإنجليزية، مع ترجمة عربية: الترجمة العربية تعمل تلقائيًا هنا. على يوتيوب اضغط CC واختر العربية.",
      levelSoon: "لاحقًا",
      extrasTitle: "كوكو بلس قريبًا", extrasText: "قد تأتي هنا لاحقًا حزم تمارين إضافية ودروس مباشرة. تبقى كل الدروس مجانية على يوتيوب.",
      unit: "الوحدة", min: "دقيقة", noVoice: "متصفحك لا يحتوي على صوت فرنسي. جرّب Chrome أو Edge.",
      bonusAbout: "محادثة حقيقية", listenFirst: "اضغط «استمع» لتسمع الجملة.",
      eyebrow: "مبتدئ A1 · مجاني", tapCoco: "اضغط على كوكو", todayStart: "جاهز لدرسك الأول؟", todayNext: "التالي", todayDone: "أنهيت المستوى A1. Bravo !",
      lessonsLeft: function (n) { return "باقي " + n + " درسًا لإنهاء A1"; }, nextBadge: "التالي", path: "مسارك في A1", lessonProg: "تقدّم الدرس"
    }
  };

  /* ---------------- saved progress (this device) ---------------- */
  var KEY = "coco-progress-v1";
  var state = load();
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    s = s || {};
    s.lessons = s.lessons || {}; s.days = s.days || []; s.lang = s.lang || "en";
    return s;
  }
  function save(quiet) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} if (!quiet && window.CocoAccount) window.CocoAccount.dirty(); }
  function rec(code) { return state.lessons[code] || (state.lessons[code] = {}); }
  function touchDay() {
    var d = new Date().toISOString().slice(0, 10);
    if (state.days.indexOf(d) < 0) { state.days.push(d); }
  }
  function mark(code, field, value) { rec(code)[field] = value === undefined ? true : value; touchDay(); save(); }
  function isDone(code) { var r = state.lessons[code]; return !!(r && r.watched && (r.quizBest || 0) >= PASS); }

  /* ---------------- helpers ---------------- */
  function t(k) { var v = T[state.lang][k]; return v === undefined ? T.en[k] : v; }
  function ar() { return state.lang === "ar"; }
  function pick(en, arText) { return ar() && arText ? arText : en; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fr(s) { return '<span class="fr" lang="fr">' + esc(s) + "</span>"; }
  function link(code) { return LINKS.lessons[code] || {}; }
  function byCode(code) { for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].code === code) return LESSONS[i]; return null; }
  function bonusAfter(code) { return (LINKS.bonuses || []).filter(function (b) { return b.after === code; }); }
  function bonusByCode(code) { return (LINKS.bonuses || []).filter(function (b) { return b.code === code; })[0]; }
  function sheetUrl(id) { return id ? "https://drive.google.com/file/d/" + id + "/view" : LINKS.worksheetsFolder; }
  function nextLesson() { for (var i = 0; i < LESSONS.length; i++) if (!isDone(LESSONS[i].code)) return LESSONS[i]; return null; }
  function doneCount() { return LESSONS.filter(function (l) { return isDone(l.code); }).length; }
  function lessonNo(l) { return t("lesson") + " " + l.n; }
  function coco(cls, look) { return '<img class="' + (cls || "") + '" src="assets/coco/' + (look || "default") + '.svg" width="224" height="245" alt="Coco">'; }
  function lessonSteps(code) {
    var r = state.lessons[code] || {}, g = GM();
    return [!!r.watched, g ? g.gamesPlayed(code) >= 2 : !!r.words, (r.quizBest || 0) >= PASS, !!r.sheet];
  }
  function ring(pct, cls) { return '<div class="ring ' + (cls || "") + '" style="--p:' + pct + '"><b>' + pct + "%</b></div>"; }

  /* French voice for words and listening questions */
  var frVoice = null;
  function findVoice() {
    if (!("speechSynthesis" in window)) return;
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^fr/i.test(v.lang); });
    frVoice = vs.filter(function (v) { return /fr-FR/i.test(v.lang) && /natural|online|google|denise|henri|amélie|thomas/i.test(v.name); })[0] ||
      vs.filter(function (v) { return /fr-FR/i.test(v.lang); })[0] || vs[0] || null;
  }
  if ("speechSynthesis" in window) { findVoice(); speechSynthesis.onvoiceschanged = findVoice; }
  // Course voices first (french/audio/*.mp3, same voices as the videos), browser voice as fallback.
  var AUDIO = window.COURSE_AUDIO || {}, player = null;
  function say(text) {
    var f = AUDIO[text] || AUDIO[String(text).trim()];
    if (f) {
      try {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        if (!player) player = new Audio();
        player.onended = null; player.pause(); player.src = "audio/" + f + ".mp3"; player.currentTime = 0;
        var pr = player.play(); if (pr && pr.catch) pr.catch(function () { sayTTS(text); });
        return;
      } catch (e) {}
    }
    sayTTS(text);
  }
  function sayList(list) {
    if (!list.length) return;
    if (!list.every(function (x) { return AUDIO[x]; })) { sayTTS(list.join(" ")); return; }
    var i = 0;
    if (!player) player = new Audio();
    var next = function () {
      if (i >= list.length) { player.onended = null; return; }
      player.src = "audio/" + AUDIO[list[i++]] + ".mp3"; var pr = player.play(); if (pr && pr.catch) pr.catch(function () {});
    };
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    player.pause(); player.onended = next; next();
  }
  function sayTTS(text) {
    if (!("speechSynthesis" in window)) { alertNoVoice(); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/·/g, ","));
    u.lang = "fr-FR"; u.rate = 0.85; if (frVoice) u.voice = frVoice;
    speechSynthesis.speak(u);
  }
  function alertNoVoice() { var n = document.getElementById("voiceNote"); if (n) n.textContent = t("noVoice"); }

  /* API for games.js */
  window.CocoApp = {
    state: function () { return state; }, save: save, rec: rec, touchDay: touchDay, say: function (x) { if (player) player.onended = null; say(x); }, sayList: sayList, esc: esc, pick: pick, ar: ar,
    byCode: byCode, LESSONS: LESSONS, render: function () { render(); }, coco: coco, lessonNo: lessonNo
  };
  function GM() { return (window.CocoApp && window.CocoApp.games) || null; }

  /* ---------------- views ---------------- */
  function viewHome() {
    var nl = nextLesson(), dc = doneCount();
    var cta = nl ? '<a class="btn" href="#/lesson/' + nl.code + '">▶ ' + (dc || (state.lessons[nl.code]) ? t("cont") + nl.n : t("start")) + "</a>"
      : '<a class="btn" href="#/lesson/A1-01">' + t("allDone") + "</a>";
    var h = '<section class="hero"><div><span class="eyebrow"><span class="tri" aria-hidden="true"><i></i><i></i><i></i></span>' + t("eyebrow") + "</span><h1>" + t("heroTitle") + "</h1><p>" + t("heroText") + "</p></div>" +
      '<div class="hstage"><button class="cstack" type="button" data-act="cocoSay" aria-label="' + t("tapCoco") + '">' + coco("", "wave") + coco("blink", "blink") + '</button><div class="hsay" id="hsay" aria-live="polite"><span class="fr">Bonjour !</span><small>' + pick("Hello!", "مرحبًا!") + '</small></div><span class="htap">' + t("tapCoco") + " 👆</span></div></section>";
    var pct = Math.round(dc / LESSONS.length * 100), gm = GM();
    var chips = '<span>✅ ' + t("doneOf")(dc, LESSONS.length) + "</span>" + (gm ? "<span>🔥 " + gm.stats().streak + " " + gm.t("streak") + "</span><span>⭐ " + gm.stats().xp + " XP</span>" : "") +
      (gm && gm.dueCount() ? '<a href="#/review">🃏 ' + gm.t("reviewDue")(gm.dueCount()) + "</a>" : "");
    h += '<section class="today">' + ring(pct) + "<div><h2>" + (nl ? (dc || state.lessons[nl.code] ? t("todayNext") + ": " : "") + lessonNo(nl) + " · " + fr(nl.titleFr) : t("todayDone")) + "</h2><p>" +
      (nl ? (dc || state.lessons[nl.code] ? t("lessonsLeft")(LESSONS.length - dc) : t("todayStart")) : "") + '</p><div class="chips">' + chips + "</div></div>" + cta + "</section>";
    h += '<div class="levels" role="tablist">' +
      '<button class="on" role="tab" aria-selected="true">A1 <small>' + pick("Beginner", "مبتدئ") + "</small></button>" +
      ["A2", "B1", "B2", "C1"].map(function (lv) { return '<button role="tab" aria-selected="false" disabled>' + lv + " <small>" + t("levelSoon") + "</small></button>"; }).join("") + "</div>";
    if (ar()) h += '<p class="note" style="margin:0 0 6px">' + t("arNote") + "</p>";
    var unit = null;
    LESSONS.forEach(function (l) {
      if (l.unit !== unit) {
        if (unit !== null) h += "</div>";
        unit = l.unit;
        h += '<h2 class="unit">' + t("unit") + " " + esc(unit.replace(/^(\d+\.\d+)\s*/, "$1 · ")) + '</h2><div class="grid">';
      }
      h += lessonCard(l, nl && nl.code === l.code);
      bonusAfter(l.code).forEach(function (b) { h += bonusCard(b); });
    });
    h += "</div>";
    h += '<div class="extras">' + coco("", "wink") + "<div><b>" + t("extrasTitle") + "</b><br><span style='opacity:.9'>" + t("extrasText") + "</span></div></div>";
    return h;
  }
  function lessonCard(l, isNext) {
    var r = state.lessons[l.code] || {}, lk = link(l.code), done = isDone(l.code);
    var meta = "";
    if (!lk.video) meta += '<span class="pill soon">' + t("soon") + "</span>";
    if (r.quizBest != null) meta += '<span class="pill score">' + t("quiz") + " " + r.quizBest + "%</span>";
    meta += '<span class="pill">⏱ ' + esc(l.length.replace("min", t("min"))) + "</span>";
    var st = lessonSteps(l.code), sp = Math.round(st.filter(Boolean).length / 4 * 100);
    var thumb = '<div class="thumb"' + (isNext ? ' data-next="' + esc(t("nextBadge")) + '"' : "") + ">" + (lk.video ? '<img class="yt" loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(lk.video) + '/mqdefault.jpg"><span class="play">▶</span>' : coco("cc", l.n % 3 === 0 ? "wink" : l.n % 3 === 1 ? "think" : "default") + '<span class="soonb">' + t("soon") + "</span>") +
      '<span class="lnum">' + l.n + "</span></div>";
    return '<a class="card lcard' + (isNext ? " next" : "") + '" href="#/lesson/' + l.code + '">' +
      (done ? '<span class="check" aria-label="' + t("done") + '">✓</span>' : "") + thumb +
      '<div class="body"><h3>' + fr(l.titleFr) + "</h3>" +
      '<div class="en">' + esc(pick(l.titleEn, l.titleAr)) + "</div>" +
      '<div class="meta">' + meta.replace('<span class="pill soon">' + t("soon") + "</span>", "") + "</div>" +
      (sp && !done ? '<div class="bar mini" aria-label="' + t("lessonProg") + '"><i style="width:' + sp + '%"></i></div>' : "") + "</div></a>";
  }
  function bonusCard(b) {
    var r = state.lessons[b.code] || {};
    var thumb = '<div class="thumb">' + (b.video ? '<img class="yt" loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(b.video) + '/mqdefault.jpg"><span class="play">▶</span>' : coco("cc", "laugh") + '<span class="soonb">' + t("soon") + "</span>") + '<span class="lnum">🎁 ' + t("bonus") + "</span></div>";
    return '<a class="card lcard bonus" href="#/bonus/' + b.code + '">' + (r.watched ? '<span class="check">✓</span>' : "") + thumb +
      '<div class="body"><h3>' + fr(b.titleFr) + "</h3>" +
      '<div class="en">' + esc(pick(b.titleEn, b.titleAr)) + "</div>" +
      '<div class="meta"><span class="pill">' + t("bonusAbout") + "</span></div></div></a>";
  }

  function videoBox(id) {
    if (!id) return '<div class="video soon"><div>' + coco("", "think") + "<p>" + t("soonVideo") + "</p></div></div>";
    return '<button class="video poster" data-play="' + esc(id) + '" style="background-image:url(https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg),linear-gradient(160deg,#3a1766,#7a2f6b)" aria-label="' + t("watch") + '">' +
      coco("pcoco") + '<span class="pbtn">▶</span><span class="plabel">' + t("watch") + "</span></button>";
  }
  function playVideo(box, id) {
    var q = "autoplay=1&rel=0&modestbranding=1&playsinline=1" + (ar() ? "&cc_load_policy=1&cc_lang_pref=ar&hl=ar" : "&hl=en");
    var d = document.createElement("div"); d.className = "video";
    d.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + "?" + q +
      '" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    box.replaceWith(d);
  }

  function viewLesson(code, tab) {
    var l = byCode(code); if (!l) return viewHome();
    var lk = link(code), r = rec(code), idx = LESSONS.indexOf(l);
    var prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    var nWords = l.vocab.reduce(function (a, g) { return a + g.items.length; }, 0);
    var tabs = [];
    if (nWords) tabs.push(["words", t("words")]);
    if (l.explain.length) tabs.push(["grammar", t("grammar")]);
    if (l.dialogue) tabs.push(["dialogue", t("dialogue")]);
    if (l.recap.length) tabs.push(["recap", t("recap")]);
    tab = tab || (tabs[0] && tabs[0][0]);
    if (tab === "words") { r.words = true; touchDay(); save(); }

    var h = '<div class="crumbs"><a href="#/">A1</a> · ' + t("unit") + " " + esc(l.unit) + "</div>";
    h += '<div class="lhead"><span class="tag">' + lessonNo(l) + " · ⏱ " + esc(l.length.replace("min", t("min"))) + "</span><h1>" + fr(l.titleFr) + '</h1><div class="sub">' + esc(pick(l.titleEn, l.titleAr)) + "</div></div>";
    h += '<div class="layout"><div>' + videoBox(lk.video) + "</div>";
    // side panel
    var steps = [[r.watched, t("stepWatch")], [GM() ? GM().gamesPlayed(code) >= 2 : r.words, GM() ? GM().stepLabel() : t("stepWords")], [(r.quizBest || 0) >= PASS, t("stepQuiz")], [r.sheet, t("stepSheet")]];
    h += '<aside class="side"><div class="card"><h3>' + t("yourSteps") + '</h3><ul class="steps">' +
      steps.map(function (s, i) { return '<li class="' + (s[0] ? "ok" : "") + '"><span class="dot">' + (s[0] ? "✓" : i + 1) + "</span>" + s[1] + "</li>"; }).join("") +
      '</ul><div class="lprog"><div class="bar"><i style="width:' + Math.round(steps.filter(function (s) { return s[0]; }).length / 4 * 100) + '%"></i></div><b>' + Math.round(steps.filter(function (s) { return s[0]; }).length / 4 * 100) + '%</b></div><div class="actions" style="margin-top:14px">' +
      (lk.video ? '<button class="btn small ' + (r.watched ? "ghost" : "navy") + '" data-act="watched">' + (r.watched ? "✓ " + t("watchedYes") : t("watched")) + "</button>" : "") +
      '<a class="btn small" href="#/quiz/' + code + '">' + (r.quizBest != null ? t("retake") + " (" + r.quizBest + "%)" : t("takeQuiz")) + "</a>" +
      "</div></div>";
    h += '<div class="card">' + (ar() && !l.hookAr ? "" : "<p>" + esc(pick(l.hook, l.hookAr)) + "</p>") + '<div class="actions" style="margin-top:12px">' +
      '<a class="btn small ghost" data-act="sheet" target="_blank" rel="noopener" href="' + sheetUrl(lk.worksheet) + '">📝 ' + (lk.worksheet ? t("worksheet") : t("worksheetFolder")) + "</a>" +
      (lk.video ? '<a class="btn small ghost" target="_blank" rel="noopener" href="https://youtu.be/' + esc(lk.video) + '">▶ ' + t("openYT") + "</a>" : "") +
      "</div>" + (ar() ? '<p class="note" style="margin-top:12px">' + t("arNote") + "</p>" : "") + "</div></aside></div>";
    if (GM()) h += GM().practiceHtml(l);
    // tabs
    h += '<div class="tabs" role="tablist">' + tabs.map(function (x) {
      return '<button role="tab" aria-selected="' + (x[0] === tab) + '" class="' + (x[0] === tab ? "on" : "") + '" data-tab="' + x[0] + '">' + x[1] + "</button>";
    }).join("") + "</div>";
    h += '<div class="card">' + tabBody(l, tab) + "</div>";
    h += '<div class="actions" style="justify-content:space-between;margin-top:16px">' +
      (prev ? '<a class="btn ghost small" href="#/lesson/' + prev.code + '">' + (ar() ? "→ " : "← ") + t("prev") + "</a>" : "<span></span>") +
      (next ? '<a class="btn ghost small" href="#/lesson/' + next.code + '">' + t("next") + (ar() ? " ←" : " →") + "</a>" : "") + "</div>";
    return h;
  }
  function tabBody(l, tab) {
    if (tab === "words") {
      return '<p class="note" style="margin-top:0">🔊 ' + t("tapHear") + ' <span id="voiceNote"></span></p>' + l.vocab.map(function (g) {
        return '<div class="vgroup" style="margin-top:14px"><h3>' + esc(pick(g.heading, g.headingAr)) + '</h3><div class="words">' + g.items.map(function (i) {
          return '<button class="word" data-say="' + esc(i.fr) + '"><span class="ic">' + esc(i.icon || "💬") + '</span><span><span class="fr">' + esc(i.fr) +
            '</span><span class="tr">' + esc(pick(i.en, i.ar)) + "</span>" + (i.pron ? '<span class="pr">' + esc(i.pron) + "</span>" : "") + '</span><span class="spk" aria-hidden="true">🔊</span></button>';
        }).join("") + "</div></div>";
      }).join("");
    }
    if (tab === "grammar") {
      return l.explain.map(function (g) {
        return '<div class="vgroup" style="margin-bottom:16px"><h3>' + esc(pick(g.heading, g.headingAr)) + '</h3><ul class="points">' + g.points.map(function (p) {
          return "<li><span>" + esc(p.icon || "💡") + "</span><span>" + esc(pick(p.en, p.ar)) + "</span></li>";
        }).join("") + "</ul></div>";
      }).join("");
    }
    if (tab === "dialogue") {
      var d = l.dialogue;
      return '<h3 style="margin-bottom:10px">' + esc(d.heading) + '</h3><div class="dlg">' + d.lines.map(function (x) {
        return '<button class="bubble ' + (x.side === "right" ? "right" : "") + '" data-say="' + esc(x.fr) + '" style="border:0;text-align:start"><b>' + esc(x.who) + ' 🔊</b><span class="fr">' + esc(x.fr) + '</span><br><span class="tr">' + esc(pick(x.en, x.ar)) + "</span></button>";
      }).join("") + "</div>";
    }
    if (tab === "recap") {
      return '<div class="recap">' + l.recap.map(function (x) { return fr(x); }).join("") + "</div>";
    }
    return "";
  }

  function viewBonus(code) {
    var b = bonusByCode(code); if (!b) return viewHome();
    var r = rec(code);
    var h = '<div class="crumbs"><a href="#/">A1</a> · ' + t("bonus") + "</div>";
    h += '<div class="lhead"><h1>🎁 ' + fr(b.titleFr) + '</h1><div class="sub">' + esc(pick(b.titleEn, b.titleAr)) + "</div></div>";
    h += '<div class="layout"><div>' + videoBox(b.video) + '</div><aside class="side"><div class="card"><p>' + esc(pick(b.about, b.aboutAr)) + '</p><div class="actions" style="margin-top:12px">' +
      (b.video ? '<button class="btn small ' + (r.watched ? "ghost" : "navy") + '" data-act="watched">' + (r.watched ? "✓ " + t("watchedYes") : t("watched")) + "</button>" : "") +
      '<a class="btn small ghost" target="_blank" rel="noopener" href="' + sheetUrl(b.worksheet) + '">📝 ' + (b.worksheet ? t("worksheet") : t("worksheetFolder")) + "</a>" +
      "</div></div></aside></div>";
    return h;
  }

  /* quiz */
  var quiz = null;
  function shuffleOrder(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function startQuiz(code) {
    var l = byCode(code);
    quiz = { code: code, items: l.quiz, i: 0, score: 0, answered: false };
  }
  function viewQuiz(code) {
    var l = byCode(code); if (!l) return viewHome();
    if (!quiz || quiz.code !== code) startQuiz(code);
    var q = quiz.items[quiz.i], n = quiz.items.length;
    if (!q) return viewResult(l);
    var pct = Math.round(quiz.i / n * 100);
    var h = '<div class="quiz"><div class="crumbs"><a href="#/lesson/' + code + '">' + lessonNo(l) + ": " + esc(l.titleFr) + "</a></div>";
    h += '<div class="qtop"><b>' + t("qOf")(quiz.i + 1, n) + '</b><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
    var look = quiz.answered ? (quiz.picked === q.answer ? "laugh" : "oops") : (q.kind === "listen" ? "surprised" : "think");
    h += '<div class="card qcard">' + coco("qcoco" + (quiz.answered ? (quiz.picked === q.answer ? " bounce" : " shake") : ""), look);
    if (q.kind === "listen") {
      h += '<div class="qkind">🎧 ' + t("kListen") + '</div><p class="hint">' + t("listenFirst") + ' <span id="voiceNote"></span></p><button class="play" data-say="' + esc(q.say) + '">🔊 ' + t("play") + "</button>";
    } else if (q.kind === "fill") {
      h += '<div class="qkind">✏️ ' + t("kFill") + "</div><h2>" + fr(q.q) + "</h2>" + (q.hint ? '<div class="hint">' + esc(pick(q.hint, q.hintAr)) + "</div>" : "");
    } else {
      h += '<div class="qkind">❓ ' + t("kQuiz") + "</div><h2>" + esc(pick(q.q, q.qAr)) + "</h2>";
    }
    h += '<div class="opts">' + q.options.map(function (o, i) {
      var label = q.kind === "listen" ? pick(o, q.optionsAr && q.optionsAr[i]) : o;
      var cls = "opt";
      if (quiz.answered) { if (i === q.answer) cls += " right"; else if (i === quiz.picked) cls += " wrong"; }
      return '<button class="' + cls + '" data-opt="' + i + '"' + (quiz.answered ? " disabled" : "") + (q.kind === "listen" ? "" : ' lang="fr"') + '><span class="key" aria-hidden="true">' + "ABCDEF".charAt(i) + "</span>" + esc(label) + "</button>";
    }).join("") + "</div>";
    if (quiz.answered) {
      var ok = quiz.picked === q.answer;
      var why = pick(q.why, q.whyAr);
      h += '<div class="feedback ' + (ok ? "good" : "bad") + '" role="status">' + (ok ? t("right") : t("wrong") + "<b>" + esc(q.kind === "listen" ? pick(q.options[q.answer], q.optionsAr && q.optionsAr[q.answer]) : q.options[q.answer]).replace(/[.!?]$/, "") + "</b>. ") + (why ? esc(why) : "") + "</div>";
      h += '<div class="qfoot"><button class="btn" data-act="nextq">' + (quiz.i + 1 < n ? t("nextQ") : t("seeScore")) + "</button></div>";
    }
    h += "</div></div>";
    return h;
  }
  function viewResult(l) {
    var n = quiz.items.length, pct = Math.round(quiz.score / n * 100), r = rec(l.code);
    if (!quiz.saved) { r.quizBest = Math.max(r.quizBest || 0, pct); r.quizLast = pct; touchDay(); save(); quiz.saved = true; if (GM()) GM().onQuizDone(pct); }
    var next = LESSONS[LESSONS.indexOf(l) + 1];
    if (pct >= PASS && !quiz.party) { quiz.party = true; setTimeout(confetti, 150); }
    return '<div class="quiz"><div class="card result">' + coco(pct >= PASS ? "jump" : "", pct >= PASS ? "proud" : "oops") + "<p>" + t("score") + "</p>" + ring(pct, "scorering") + '<div class="big">' + quiz.score + " / " + n + "</div><p>" +
      (pct >= PASS ? t("passed") : t("failed")) + '</p><div class="actions" style="justify-content:center">' +
      '<a class="btn ghost" href="#/lesson/' + l.code + '">' + t("backLesson") + "</a>" +
      '<button class="btn ghost" data-act="again">' + t("retake") + "</button>" +
      (next && pct >= PASS ? '<a class="btn" href="#/lesson/' + next.code + '">' + t("nextLesson") + "</a>" : "") + "</div></div></div>";
  }

  function viewProgress() {
    var dc = doneCount(), scores = [], words = 0;
    LESSONS.forEach(function (l) { var r = state.lessons[l.code]; if (r && r.quizBest != null) scores.push(r.quizBest); if (r && r.words) l.vocab.forEach(function (g) { words += g.items.length; }); });
    var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) + "%" : "–";
    var h = '<div class="lhead"><h1>' + t("progTitle") + "</h1></div>";
    h += '<div class="stats">' + [[dc + "/" + LESSONS.length, t("stLessons")], [avg, t("stQuiz")], [state.days.length, t("stDays")], [words, t("stWords")]].concat(GM() ? [["⭐ " + GM().stats().xp, "XP"], ["🔥 " + GM().stats().streak, GM().t("streak")]] : []).map(function (s) {
      return '<div class="card stat"><div class="n">' + s[0] + '</div><div class="l">' + s[1] + "</div></div>";
    }).join("") + "</div>";
    h += '<div class="card" style="margin-bottom:16px"><h3 style="margin-bottom:10px">' + t("path") + '</h3><div class="lpath">' + LESSONS.map(function (l) {
      var c = isDone(l.code) ? "done" : lessonSteps(l.code).some(Boolean) ? "part" : "";
      return '<a class="' + c + '" href="#/lesson/' + l.code + '" title="' + esc(l.titleFr) + '">' + l.n + "</a>";
    }).join("") + "</div></div>";
    if (GM()) h += GM().progressHtml();
    h += '<div class="card"><table class="ptable"><thead><tr><th>' + t("colLesson") + "</th><th>" + t("colVideo") + "</th><th>" + t("colQuiz") + "</th><th></th></tr></thead><tbody>" +
      LESSONS.map(function (l) {
        var r = state.lessons[l.code] || {};
        return '<tr><td><a href="#/lesson/' + l.code + '">' + l.n + ". " + fr(l.titleFr) + "</a></td><td>" + (r.watched ? "✓" : "") + "</td><td>" + (r.quizBest != null ? r.quizBest + "%" : "") + "</td><td>" + (isDone(l.code) ? '<span class="pill done">' + t("done") + "</span>" : "") + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<p class="note" style="margin-top:14px">' + t("savedHere") + '</p><button class="btn ghost small" data-act="reset">' + t("reset") + "</button></div>";
    return h;
  }

  /* ---------------- router ---------------- */
  function render() {
    var parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    var page = parts[0] || "home", html;
    if (page === "lesson") html = viewLesson(parts[1], parts[2]);
    else if (page === "quiz") html = viewQuiz(parts[1]);
    else if (page === "bonus") html = viewBonus(parts[1]);
    else if (page === "progress") html = viewProgress();
    else if (page === "play" && GM()) html = GM().view(parts[1], parts[2]);
    else if (page === "review" && GM()) html = GM().viewReview();
    else { page = "home"; html = viewHome(); }
    if (page !== "quiz") quiz = null;
    if (page !== "play" && page !== "review" && GM()) GM().reset();
    if (GM()) GM().hud();
    document.body.setAttribute("data-page", page);
    app.innerHTML = html;
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-nav") === (page === "progress" ? "progress" : "home")); });
  }
  function applyLang() {
    var isAr = ar();
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.getElementById("langBtn").textContent = isAr ? "English" : "العربية";
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.getAttribute("data-t")); });
    if (window.CocoSignup) window.CocoSignup.refresh();
    if (window.CocoAccount) window.CocoAccount.paint();
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-play],[data-say],[data-opt],[data-act],[data-tab]");
    if (!el) return;
    if (el.hasAttribute("data-play")) { playVideo(el, el.getAttribute("data-play")); return; }
    if (el.hasAttribute("data-say")) {
      say(el.getAttribute("data-say"));
      if (el.classList.contains("word")) { el.classList.remove("speaking"); void el.offsetWidth; el.classList.add("speaking"); setTimeout(function () { el.classList.remove("speaking"); }, 1600); }
      return;
    }
    if (el.getAttribute("data-act") === "cocoSay") { cocoSay(); return; }
    var parts = location.hash.replace(/^#\/?/, "").split("/"), code = parts[1];
    if (el.hasAttribute("data-tab")) { location.hash = "#/lesson/" + code + "/" + el.getAttribute("data-tab"); return; }
    if (el.hasAttribute("data-opt")) {
      if (quiz.answered) return;
      quiz.picked = +el.getAttribute("data-opt"); quiz.answered = true;
      var okA = quiz.picked === quiz.items[quiz.i].answer;
      if (okA) quiz.score++;
      if (GM()) GM().onAnswer(okA);
      render(); return;
    }
    var act = el.getAttribute("data-act");
    if (act === "watched") { mark(code, "watched", !rec(code).watched); render(); }
    else if (act === "sheet") { mark(code, "sheet"); setTimeout(render, 300); }
    else if (act === "nextq") { quiz.i++; quiz.answered = false; render(); window.scrollTo(0, 0); }
    else if (act === "again") { startQuiz(code); render(); }
    else if (act === "reset") { if (confirm(t("resetAsk"))) { var lang = state.lang; state = { lessons: {}, days: [], lang: lang }; save(); render(); } }
  });
  function cocoSay() {
    var pool = [];
    LESSONS.slice(0, Math.max(3, doneCount() + 2)).forEach(function (l) { l.vocab.forEach(function (g) { g.items.forEach(function (i) { pool.push(i); }); }); });
    var w = pool[Math.floor(Math.random() * pool.length)], b = document.getElementById("hsay");
    if (!w || !b) return;
    b.innerHTML = '<span class="fr" lang="fr">' + esc(w.fr) + "</span><small>" + esc(pick(w.en, w.ar)) + "</small>";
    b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
    say(w.fr);
  }
  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = document.createElement("div"), cols = ["#FFD45C", "#F4B73A", "#0055A4", "#EF4135", "#7B4DFF", "#FF9A62", "#ffffff"];
    box.className = "confetti";
    for (var i = 0; i < 70; i++) {
      var c = document.createElement("i");
      c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * .6 + "s"; c.style.animationDuration = 1.4 + Math.random() * 1.2 + "s";
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 3400);
  }
  document.getElementById("langBtn").addEventListener("click", function () { state.lang = ar() ? "en" : "ar"; save(); applyLang(); render(); });
  window.addEventListener("hashchange", function () { render(); if (!/\/(words|grammar|dialogue|recap)$/.test(location.hash)) window.scrollTo(0, 0); });

  // phone tab bar
  var bar = document.createElement("nav");
  bar.className = "tabbar";
  bar.innerHTML = '<a href="#/" data-nav="home"><b>📚</b><span data-t="navLessons"></span></a><a href="#/progress" data-nav="progress"><b>⭐</b><span data-t="navProgress"></span></a>';
  document.body.appendChild(bar);
  var fc = document.getElementById("footChannel"); fc.href = LINKS.channel;

  document.addEventListener("DOMContentLoaded", function () { applyLang(); render(); });
})();
