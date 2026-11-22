/* Learn French with Coco: interactive layer.
   Coco reactions, sound effects, XP / streak / badges, and four practice games per lesson:
   match the pairs, flashcards (spaced repetition), speaking with the microphone, dialogue role-play.
   Uses the helpers that app.js puts on window.CocoApp. */
(function () {
  "use strict";
  var A = window.CocoApp;
  var G = A.games = {};
  var state = function () { return A.state(); };

  /* ---------------- text ---------------- */
  var T = {
    en: {
      practice: "Practice with Coco", practiceSub: "Play, speak and remember. Every game gives you XP.",
      gMatch: "Match the pairs", gMatchSub: "Tap a French word, then its meaning",
      gCards: "Flashcards", gCardsSub: "Words come back when you forget them",
      gSpeak: "Speak with Coco", gSpeakSub: "Say it into the microphone, get a score",
      gRole: "Role-play", gRoleSub: "You play one person in the dialogue",
      gQuiz: "Quiz", gQuizSub: "Check what you learned",
      stepGames: "Play 2 practice games",
      best: "Best", stars: "stars", played: "Played",
      matchHelp: "Tap a French word, then tap its meaning.", mistakes: "Mistakes", time: "Time", sec: "s",
      matchDone: "All pairs found!", again: "Play again", backLesson: "Back to the lesson", otherGame: "Try another game",
      cardsHelp: "Tap the card to see the meaning. Did you know it?", flip: "Tap to flip", knew: "I knew it", forgot: "Again",
      cardsLeft: function (n) { return n + " cards left"; }, cardsDone: "Deck finished! These words will come back for review in a few days.",
      review: "Review", reviewDue: function (n) { return "Review " + n + " cards"; }, reviewNone: "No cards to review right now. Play flashcards in a lesson first, or come back tomorrow.",
      reviewTitle: "Your review",
      speakHelp: "Press the microphone and say the word in French.", speakTap: "Tap and speak", listening: "Listening… speak now",
      youSaid: "Coco heard:", heardNothing: "Coco didn't hear anything. Try again, a bit closer to the microphone.",
      perfect: "Parfait ! Perfect!", close: "Presque ! Almost. Listen and try again.", tryAgain: "Let's try again. Listen first, then repeat slowly.",
      noMic: "Speaking practice needs Chrome or Edge, and the app opened with start-app.ps1 (http://localhost). For now: listen, say it out loud, and rate yourself.",
      saidIt: "I said it", skip: "Next word", speakDone: "Speaking practice finished!", avgScore: "Average pronunciation score",
      micBlocked: "The microphone is blocked. Allow it in the browser's address bar, then try again.",
      roleChoose: "Who do you want to be?", roleYou: "You", roleSay: "Say in French:", roleDone: "Bravo, you played the whole scene!",
      roleHint: "Not that one. Read the meaning again and choose.", listenAll: "Hear the whole scene",
      xp: "XP", streak: "day streak", badgesTitle: "Badges", newBadge: "New badge!", sound: "Sound",
      cocoHi: ["Bonjour ! Let's practise!", "Allez, on y va !"],
      cocoGood: ["Bravo !", "Super !", "Excellent !", "Très bien !", "Parfait !"],
      cocoBad: ["Oops! Try again.", "Almost! You can do it.", "No problem, again!"],
      cocoWin: "Bravo ! You did it!"
    },
    ar: {
      practice: "تدرّب مع كوكو", practiceSub: "العب، تكلّم، وتذكّر. كل لعبة تمنحك نقاط XP.",
      gMatch: "صِل الأزواج", gMatchSub: "اضغط كلمة فرنسية ثم معناها",
      gCards: "البطاقات", gCardsSub: "الكلمات تعود عندما تنساها",
      gSpeak: "تكلّم مع كوكو", gSpeakSub: "قلها في الميكروفون واحصل على تقييم",
      gRole: "تمثيل الأدوار", gRoleSub: "أنت تؤدي دور شخص في الحوار",
      gQuiz: "الاختبار", gQuizSub: "تحقّق مما تعلّمته",
      stepGames: "العب لعبتين للتدريب",
      best: "الأفضل", stars: "نجوم", played: "لُعبت",
      matchHelp: "اضغط كلمة فرنسية، ثم اضغط معناها.", mistakes: "الأخطاء", time: "الوقت", sec: "ث",
      matchDone: "وجدت كل الأزواج!", again: "العب مرة أخرى", backLesson: "العودة إلى الدرس", otherGame: "جرّب لعبة أخرى",
      cardsHelp: "اضغط البطاقة لترى المعنى. هل كنت تعرفها؟", flip: "اضغط للقلب", knew: "كنت أعرفها", forgot: "مرة أخرى",
      cardsLeft: function (n) { return "باقي " + n + " بطاقات"; }, cardsDone: "انتهت البطاقات! ستعود هذه الكلمات للمراجعة بعد أيام.",
      review: "المراجعة", reviewDue: function (n) { return "راجع " + n + " بطاقات"; }, reviewNone: "لا توجد بطاقات للمراجعة الآن. العب البطاقات في درس أولًا، أو عد غدًا.",
      reviewTitle: "مراجعتك",
      speakHelp: "اضغط الميكروفون وقل الكلمة بالفرنسية.", speakTap: "اضغط وتكلّم", listening: "أستمع… تكلّم الآن",
      youSaid: "سمع كوكو:", heardNothing: "لم يسمع كوكو شيئًا. حاول مرة أخرى بالقرب من الميكروفون.",
      perfect: "Parfait ! ممتاز!", close: "Presque ! تقريبًا. استمع وحاول مرة أخرى.", tryAgain: "لنحاول مرة أخرى. استمع أولًا ثم كرر ببطء.",
      noMic: "تمرين النطق يحتاج Chrome أو Edge، وفتح التطبيق عبر start-app.ps1. الآن: استمع، قلها بصوت عالٍ، وقيّم نفسك.",
      saidIt: "قلتها", skip: "الكلمة التالية", speakDone: "انتهى تمرين النطق!", avgScore: "متوسط تقييم النطق",
      micBlocked: "الميكروفون محظور. اسمح به من شريط العنوان ثم حاول مرة أخرى.",
      roleChoose: "من تريد أن تكون؟", roleYou: "أنت", roleSay: "قل بالفرنسية:", roleDone: "أحسنت، أدّيت المشهد كاملًا!",
      roleHint: "ليست هذه. اقرأ المعنى مرة أخرى واختر.", listenAll: "استمع للمشهد كاملًا",
      xp: "XP", streak: "أيام متتالية", badgesTitle: "الشارات", newBadge: "شارة جديدة!", sound: "الصوت",
      cocoHi: ["Bonjour ! هيا نتدرّب!", "Allez ! هيا بنا!"],
      cocoGood: ["Bravo !", "Super !", "Excellent !", "Très bien !", "أحسنت!"],
      cocoBad: ["أوه! حاول مرة أخرى.", "تقريبًا! تستطيع.", "لا مشكلة، مرة أخرى!"],
      cocoWin: "Bravo ! نجحت!"
    }
  };
  function t(k) { var L = A.ar() ? T.ar : T.en; return L[k] === undefined ? T.en[k] : L[k]; }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  var esc = A.esc;
  function today() { return new Date().toISOString().slice(0, 10); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  function S() { var s = state(); s.xp = s.xp || 0; s.badges = s.badges || []; s.cards = s.cards || {}; s.speak = s.speak || { perfect: 0 }; if (s.sound === undefined) s.sound = true; return s; }

  /* ---------------- sound effects (made in the browser, no files) ---------------- */
  var ctx = null;
  function tone(freq, start, dur, type, vol) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime + start;
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  var sfx = {
    good: function () { tone(660, 0, 0.12, "triangle"); tone(990, 0.1, 0.2, "triangle"); },
    bad: function () { tone(220, 0, 0.18, "sawtooth", 0.08); tone(180, 0.15, 0.25, "sawtooth", 0.08); },
    flip: function () { tone(520, 0, 0.06, "square", 0.05); },
    pop: function () { tone(880, 0, 0.07, "sine", 0.1); },
    win: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, i * 0.11, 0.25, "triangle"); }); },
    badge: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * 0.09, 0.3, "sine", 0.15); }); }
  };
  G.sfx = function (name) { if (S().sound && sfx[name]) sfx[name](); };

  /* ---------------- Coco buddy (reacts in the corner) ---------------- */
  var buddy = document.createElement("div");
  buddy.className = "buddy";
  buddy.innerHTML = '<div class="bub" role="status" aria-live="polite"></div><img src="assets/coco/default.svg" alt="Coco">';
  document.body.appendChild(buddy);
  ["happy", "proud", "oops", "think", "laugh"].forEach(function (n) { var im = new Image(); im.src = "assets/coco/" + n + ".svg"; });
  var buddyTimer = null;
  G.react = function (mood, text) {
    var img = buddy.querySelector("img"), bub = buddy.querySelector(".bub");
    buddy.classList.add("show");
    img.src = "assets/coco/" + ({ happy: "happy", win: "proud", sad: "oops", think: "think" }[mood] || "default") + ".svg";
    img.className = ""; void img.offsetWidth; img.className = "m-" + mood;
    bub.textContent = text || ""; bub.style.display = text ? "block" : "none";
    clearTimeout(buddyTimer);
    buddyTimer = setTimeout(function () { buddy.classList.remove("show"); }, mood === "win" ? 3200 : 2200);
  };

  /* ---------------- XP, streak, badges ---------------- */
  var BADGES = [
    { id: "first", icon: "🐣", en: "First steps", ar: "الخطوات الأولى", howEn: "Earn your first XP", howAr: "اربح أول نقاط XP" },
    { id: "match", icon: "🧩", en: "Sharp memory", ar: "ذاكرة قوية", howEn: "Finish Match the pairs with no mistakes", howAr: "أنهِ «صِل الأزواج» دون أخطاء" },
    { id: "speak", icon: "🎤", en: "Parfait !", ar: "Parfait !", howEn: "Get 5 perfect pronunciations", howAr: "احصل على 5 نطق ممتاز" },
    { id: "role", icon: "🎭", en: "Actor", ar: "ممثّل", howEn: "Finish a role-play", howAr: "أنهِ تمثيل دور" },
    { id: "quiz100", icon: "🌟", en: "Quiz star", ar: "نجم الاختبار", howEn: "Get 100% in a quiz", howAr: "احصل على 100٪ في اختبار" },
    { id: "cards20", icon: "🃏", en: "Card collector", ar: "جامع البطاقات", howEn: "Learn 20 flashcards", howAr: "تعلّم 20 بطاقة" },
    { id: "streak3", icon: "🔥", en: "3-day streak", ar: "3 أيام متتالية", howEn: "Practise 3 days in a row", howAr: "تدرّب 3 أيام متتالية" },
    { id: "xp500", icon: "🏆", en: "500 XP", ar: "500 نقطة", howEn: "Reach 500 XP", howAr: "اجمع 500 نقطة XP" }
  ];
  function streak() {
    var days = S().days || [], n = 0, d = new Date();
    if (days.indexOf(today()) < 0) d.setDate(d.getDate() - 1);
    while (days.indexOf(d.toISOString().slice(0, 10)) >= 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  G.streak = streak;
  function award(id) {
    var s = S(); if (s.badges.indexOf(id) >= 0) return;
    s.badges.push(id); A.save();
    var b = BADGES.filter(function (x) { return x.id === id; })[0];
    setTimeout(function () {
      G.sfx("badge");
      toast(b.icon + " " + t("newBadge") + " " + (A.ar() ? b.ar : b.en), "badge");
      G.react("win", t("newBadge"));
    }, 700);
  }
  function checkBadges() {
    var s = S();
    if (s.xp > 0) award("first");
    if (streak() >= 3) award("streak3");
    if (s.xp >= 500) award("xp500");
    var learned = Object.keys(s.cards).filter(function (k) { return s.cards[k].box >= 1; }).length;
    if (learned >= 20) award("cards20");
    if (s.speak.perfect >= 5) award("speak");
  }
  G.addXP = function (n) {
    var s = S(); s.xp += n; A.touchDay(); A.save(); checkBadges(); hud();
    toast("+" + n + " XP", "xp");
  };
  G.award = award;
  function toast(text, kind) {
    var el = document.createElement("div"); el.className = "toast " + (kind || ""); el.textContent = text;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add("out"); }, 1300);
    setTimeout(function () { el.remove(); }, 1800);
  }
  // header chips: streak, XP, sound on/off
  var chips = document.createElement("span"); chips.className = "hud";
  var nav = document.querySelector(".topnav"); nav.insertBefore(chips, document.getElementById("langBtn"));
  function hud() {
    var s = S();
    chips.innerHTML = '<a href="#/progress" class="chip" title="' + t("streak") + '">🔥 ' + streak() + '</a><a href="#/progress" class="chip">⭐ ' + s.xp + "</a>" +
      '<button class="chip" data-g="sound" aria-label="' + t("sound") + '">' + (s.sound ? "🔊" : "🔇") + "</button>";
  }
  G.hud = hud;

  /* ---------------- lesson words ---------------- */
  function words(l) {
    var out = [];
    l.vocab.forEach(function (g) { g.items.forEach(function (i) { if (i.fr && (i.en || i.ar)) out.push(i); }); });
    return out;
  }
  function meaning(i) { return A.pick(i.en, i.ar); }
  var wordIndex = null;
  function findWord(fr) {
    if (!wordIndex) { wordIndex = {}; A.LESSONS.forEach(function (l) { words(l).forEach(function (w) { wordIndex[w.fr] = { w: w, code: l.code }; }); }); }
    return wordIndex[fr];
  }
  function lessonStats(code) { var r = A.rec(code); r.games = r.games || {}; return r.games; }
  function played(code, game, extra) {
    var g = lessonStats(code); var x = g[game] || (g[game] = { n: 0 });
    x.n++; for (var k in extra) if (k === "stars" || k === "score") x[k] = Math.max(x[k] || 0, extra[k]); else x[k] = extra[k];
    A.touchDay(); A.save();
  }
  G.gamesPlayed = function (code) { var g = (A.state().lessons[code] || {}).games || {}; return Object.keys(g).length; };

  /* ---------------- practice tiles on the lesson page ---------------- */
  G.practiceHtml = function (l) {
    var g = (A.state().lessons[l.code] || {}).games || {}, r = A.state().lessons[l.code] || {};
    var tiles = [
      ["match", "🧩", t("gMatch"), t("gMatchSub"), g.match && "⭐".repeat(g.match.stars || 0)],
      ["cards", "🃏", t("gCards"), t("gCardsSub"), g.cards && t("played") + " ✓"],
      ["speak", "🎤", t("gSpeak"), t("gSpeakSub"), g.speak && t("best") + " " + g.speak.score + "%"],
      ["role", "🎭", t("gRole"), t("gRoleSub"), g.role && t("played") + " ✓"]
    ].filter(function (x) { return x[0] !== "role" || l.dialogue; }).filter(function (x) { return x[0] === "role" || words(l).length >= 3; });
    var h = '<section class="practice"><div class="phead"><div><h2>' + t("practice") + "</h2><p>" + t("practiceSub") + '</p></div></div><div class="ptiles">';
    tiles.forEach(function (x) {
      h += '<a class="ptile" href="#/play/' + l.code + "/" + x[0] + '"><span class="pic">' + x[1] + "</span><b>" + x[2] + "</b><small>" + x[3] + "</small>" + (x[4] ? '<span class="pdone">' + x[4] + "</span>" : "") + "</a>";
    });
    h += '<a class="ptile quiz" href="#/quiz/' + l.code + '"><span class="pic">❓</span><b>' + t("gQuiz") + "</b><small>" + t("gQuizSub") + "</small>" + (r.quizBest != null ? '<span class="pdone">' + r.quizBest + "%</span>" : "") + "</a>";
    return h + "</div></section>";
  };
  G.stepLabel = function () { return t("stepGames"); };

  /* ---------------- game router ---------------- */
  var cur = null; // current game state
  G.view = function (code, game) {
    var l = A.byCode(code); if (!l) return "";
    var key = code + "/" + game;
    if (!cur || cur.key !== key) { cur = start(l, game); cur.key = key; }
    var top = '<div class="crumbs"><a href="#/lesson/' + code + '">' + A.lessonNo(l) + ": " + esc(l.titleFr) + "</a></div>";
    return '<div class="game">' + top + body(l, game) + "</div>";
  };
  G.reset = function () { cur = null; };
  G.viewReview = function () {
    if (!cur || cur.key !== "review") { cur = startCards(null); cur.key = "review"; }
    return '<div class="game"><div class="lhead"><h1>🃏 ' + t("reviewTitle") + "</h1></div>" + cardsBody(null) + "</div>";
  };
  G.dueCount = function () { var s = S(), n = 0, d = today(); for (var k in s.cards) if (s.cards[k].due <= d && findWord(k)) n++; return n; };

  function start(l, game) {
    if (game === "match") return startMatch(l);
    if (game === "cards") return startCards(l);
    if (game === "speak") return startSpeak(l);
    if (game === "role") return { role: null, p: 0, shown: [], wrong: [], opts: null };
    return {};
  }
  function body(l, game) {
    if (game === "match") return matchBody(l);
    if (game === "cards") return cardsBody(l);
    if (game === "speak") return speakBody(l);
    if (game === "role") return roleBody(l);
    return "";
  }
  function endBox(l, title, extra) {
    return '<div class="card result">' + A.coco("jump", "laugh") + "<h2>" + title + "</h2>" + (extra || "") +
      '<div class="actions" style="justify-content:center;margin-top:14px"><button class="btn" data-g="again">' + t("again") + "</button>" +
      (l ? '<a class="btn ghost" href="#/lesson/' + l.code + '">' + t("backLesson") + "</a>" : '<a class="btn ghost" href="#/">' + t("backLesson") + "</a>") + "</div></div>";
  }
  function gameHead(icon, title, help, right) {
    return '<div class="ghead"><div><h1>' + icon + " " + title + "</h1><p>" + help + "</p></div>" + (right ? '<div class="gright">' + right + "</div>" : "") + "</div>";
  }

  /* ---- 1. Match the pairs ---- */
  function startMatch(l) {
    var pool = shuffle(words(l)).slice(0, 6);
    return { pool: pool, left: shuffle(pool.map(function (w, i) { return i; })), right: shuffle(pool.map(function (w, i) { return i; })), selL: null, selR: null, done: [], bad: null, mistakes: 0, t0: Date.now(), end: 0 };
  }
  function matchBody(l) {
    var c = cur;
    if (c.end) {
      var stars = c.mistakes === 0 ? 3 : c.mistakes <= 2 ? 2 : 1;
      return endBox(l, t("matchDone"), '<div class="stars">' + "⭐".repeat(stars) + '</div><p>' + t("mistakes") + ": " + c.mistakes + " · " + t("time") + ": " + Math.round((c.end - c.t0) / 1000) + t("sec") + "</p>");
    }
    var h = gameHead("🧩", t("gMatch"), t("matchHelp"), t("mistakes") + ": " + c.mistakes);
    h += '<div class="match"><div class="mcol">' + c.left.map(function (i) {
      var w = c.pool[i], st = c.done.indexOf(i) >= 0 ? " ok" : c.selL === i ? " sel" : c.bad && c.bad[0] === i ? " no" : "";
      return '<button class="mt fr' + st + '" data-g="ml" data-i="' + i + '"' + (st === " ok" ? " disabled" : "") + ">" + esc(w.icon || "") + " " + esc(w.fr) + "</button>";
    }).join("") + '</div><div class="mcol">' + c.right.map(function (i) {
      var w = c.pool[i], st = c.done.indexOf(i) >= 0 ? " ok" : c.selR === i ? " sel" : c.bad && c.bad[1] === i ? " no" : "";
      return '<button class="mt' + st + '" data-g="mr" data-i="' + i + '"' + (st === " ok" ? " disabled" : "") + ">" + esc(meaning(w)) + "</button>";
    }).join("") + "</div></div>";
    return h;
  }
  function matchPick(side, i, l) {
    var c = cur; c.bad = null;
    if (side === "l") { c.selL = i; A.say(c.pool[i].fr); } else c.selR = i;
    G.sfx("pop");
    if (c.selL != null && c.selR != null) {
      if (c.selL === c.selR) {
        c.done.push(c.selL); G.sfx("good"); if (c.done.length % 2 === 1) G.react("happy", rnd(t("cocoGood")));
      } else {
        c.mistakes++; c.bad = [c.selL, c.selR]; G.sfx("bad"); G.react("sad", rnd(t("cocoBad")));
      }
      c.selL = c.selR = null;
      if (c.done.length === c.pool.length) {
        c.end = Date.now();
        var stars = c.mistakes === 0 ? 3 : c.mistakes <= 2 ? 2 : 1;
        played(l.code, "match", { stars: stars });
        if (c.mistakes === 0) award("match");
        setTimeout(function () { G.sfx("win"); G.react("win", t("cocoWin")); G.addXP(10 + stars * 5); }, 250);
      }
    }
  }

  /* ---- 2. Flashcards with spaced repetition ---- */
  var GAPS = [0, 1, 3, 7, 14, 30]; // days until the card comes back, by box
  function startCards(l) {
    var s = S(), list;
    if (l) list = words(l);
    else list = Object.keys(s.cards).filter(function (k) { return s.cards[k].due <= today() && findWord(k); }).map(function (k) { return findWord(k).w; });
    return { queue: shuffle(list), flipped: false, total: list.length, known: 0, done: false };
  }
  function cardsBody(l) {
    var c = cur;
    if (!c.total) return '<div class="card"><p>' + t("reviewNone") + '</p><a class="btn" href="#/">' + t("backLesson") + "</a></div>";
    if (c.done) return endBox(l, t("cardsDone"), "<p>⭐ " + c.known + " / " + c.total + "</p>");
    var w = c.queue[0];
    var h = gameHead("🃏", l ? t("gCards") : t("review"), t("cardsHelp"), t("cardsLeft")(c.queue.length));
    h += '<div class="flash' + (c.flipped ? " flipped" : "") + '"><button class="fcard" data-g="flip"><span class="face front"><span class="ficon">' + esc(w.icon || "💬") + '</span><span class="fr big">' + esc(w.fr) + '</span><small>' + t("flip") + '</small></span>' +
      '<span class="face back"><span class="fr">' + esc(w.fr) + '</span><span class="big2">' + esc(meaning(w)) + "</span>" + (w.pron ? '<small class="pr">' + esc(w.pron) + "</small>" : "") + "</span></button></div>";
    h += '<div class="actions fbtns"><button class="btn ghost" data-g="hear">🔊</button>' + (c.flipped ? '<button class="btn ghost" data-g="forgot">↺ ' + t("forgot") + '</button><button class="btn" data-g="knew">✓ ' + t("knew") + "</button>" : "") + "</div>";
    return h;
  }
  function cardAnswer(ok, l) {
    var s = S(), c = cur, w = c.queue.shift(), rec = s.cards[w.fr] || { box: 0 };
    if (ok) {
      rec.box = Math.min(rec.box + 1, GAPS.length - 1); rec.due = addDays(GAPS[rec.box]); c.known++;
      G.sfx("good"); if (c.known % 3 === 0) G.react("happy", rnd(t("cocoGood")));
    } else {
      rec.box = 0; rec.due = today(); c.queue.push(w); G.sfx("flip");
    }
    s.cards[w.fr] = rec; c.flipped = false; A.save();
    if (!c.queue.length) {
      c.done = true; if (l) played(l.code, "cards", {});
      setTimeout(function () { G.sfx("win"); G.react("win", t("cocoWin")); G.addXP(c.known * 2); }, 200);
    } else { setTimeout(function () { A.say(c.queue[0].fr); }, 250); }
  }

  /* ---- 3. Speaking with the microphone ---- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function target(fr) { return fr.split(/\s·\s|\s\/\s/)[0]; }
  function startSpeak(l) {
    var ws = words(l).filter(function (w) { return !/^\d+$/.test(w.fr); });
    return { list: shuffle(ws).slice(0, 6), i: 0, result: null, scores: [], listening: false, done: false, err: null };
  }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j; for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function similarity(said, want) {
    var a = norm(said), b = norm(want); if (!a) return 0;
    if (a === b || (" " + a + " ").indexOf(" " + b + " ") >= 0) return 100;
    return Math.max(0, Math.round((1 - lev(a, b) / Math.max(a.length, b.length)) * 100));
  }
  function speakBody(l) {
    var c = cur;
    if (c.done) {
      var avg = c.scores.length ? Math.round(c.scores.reduce(function (a, b) { return a + b; }, 0) / c.scores.length) : 0;
      return endBox(l, t("speakDone"), '<p>' + t("avgScore") + ': <b class="bigscore">' + avg + "%</b></p>");
    }
    var w = c.list[c.i];
    var h = gameHead("🎤", t("gSpeak"), SR ? t("speakHelp") : t("noMic"), (c.i + 1) + " / " + c.list.length);
    h += '<div class="card speak"><div class="ficon">' + esc(w.icon || "💬") + '</div><div class="fr big">' + esc(target(w.fr)) + '</div><div class="tr">' + esc(meaning(w)) + "</div>" + (w.pron ? '<div class="pr">' + esc(w.pron) + "</div>" : "");
    h += '<div class="actions" style="justify-content:center;margin:16px 0 4px"><button class="btn ghost" data-g="hear">🔊</button>';
    if (SR) h += '<button class="mic' + (c.listening ? " on" : "") + '" data-g="mic" aria-label="' + t("speakTap") + '"><span>🎤</span></button>';
    else h += '<button class="btn" data-g="selfok">✓ ' + t("saidIt") + "</button>";
    h += "</div><p class=\"hint\">" + (c.listening ? t("listening") : SR ? t("speakTap") : "") + "</p>";
    if (c.err) h += '<div class="feedback bad">' + c.err + "</div>";
    if (c.result) {
      var sc = c.result.score, cls = sc >= 85 ? "good" : sc >= 60 ? "mid" : "bad";
      h += '<div class="meter"><i class="' + cls + '" style="width:' + sc + '%"></i></div><div class="feedback ' + (cls === "mid" ? "good" : cls) + '"><b>' + sc + "%</b> · " +
        (sc >= 85 ? t("perfect") : sc >= 60 ? t("close") : t("tryAgain")) + "<br><small>" + t("youSaid") + ' <span class="fr">« ' + esc(c.result.said) + " »</span></small></div>";
    }
    h += '<div class="qfoot"><button class="btn ' + (c.result ? "" : "ghost") + '" data-g="snext">' + t("skip") + " →</button></div></div>";
    return h;
  }
  var rec = null;
  function listen(l) {
    var c = cur, w = c.list[c.i];
    if (c.listening) { try { rec.stop(); } catch (e) {} return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    rec = new SR(); rec.lang = "fr-FR"; rec.maxAlternatives = 5; rec.interimResults = false;
    c.listening = true; c.err = null; A.render(); G.sfx("pop");
    rec.onresult = function (e) {
      var best = { score: -1, said: "" };
      for (var i = 0; i < e.results[0].length; i++) { var s = e.results[0][i].transcript, sc = similarity(s, target(w.fr)); if (sc > best.score) best = { score: sc, said: s }; }
      c.result = best;
      var prev = c.best || 0; c.best = Math.max(prev, best.score);
      if (best.score >= 85) { G.sfx("good"); G.react("win", rnd(t("cocoGood"))); S().speak.perfect++; A.save(); checkBadges(); }
      else if (best.score >= 60) { G.sfx("pop"); G.react("think", t("close")); }
      else { G.sfx("bad"); G.react("sad", rnd(t("cocoBad"))); }
    };
    rec.onerror = function (e) { c.err = e.error === "not-allowed" || e.error === "service-not-allowed" ? t("micBlocked") : e.error === "no-speech" ? t("heardNothing") : e.error; };
    rec.onend = function () { c.listening = false; if (!c.result && !c.err) c.err = t("heardNothing"); A.render(); };
    rec.start();
  }
  function speakNext(l, selfScore) {
    var c = cur;
    c.scores.push(selfScore != null ? selfScore : (c.best || 0));
    c.i++; c.result = null; c.best = 0; c.err = null;
    if (c.i >= c.list.length) {
      c.done = true;
      var avg = Math.round(c.scores.reduce(function (a, b) { return a + b; }, 0) / c.scores.length);
      played(l.code, "speak", { score: avg });
      setTimeout(function () { G.sfx("win"); G.react("win", t("cocoWin")); G.addXP(10 + Math.round(avg / 10)); }, 200);
    } else setTimeout(function () { A.say(target(c.list[c.i].fr)); }, 300);
  }

  /* ---- 4. Dialogue role-play ---- */
  var allLines = null;
  function distractors(correct, l) {
    if (!allLines) { allLines = []; A.LESSONS.forEach(function (x) { if (x.dialogue) x.dialogue.lines.forEach(function (ln) { allLines.push({ fr: ln.fr, code: x.code }); }); }); }
    var near = allLines.filter(function (x) { return x.fr !== correct && Math.abs(A.byCode(x.code).n - l.n) <= 3; });
    return shuffle(near).slice(0, 2).map(function (x) { return x.fr; });
  }
  function roleAdvance(l, speakLast) {
    var c = cur, lines = l.dialogue.lines, spoken = [];
    while (c.p < lines.length && lines[c.p].who !== c.role) { c.shown.push(c.p); spoken.push(lines[c.p].fr); c.p++; }
    c.opts = c.p < lines.length ? shuffle([lines[c.p].fr].concat(distractors(lines[c.p].fr, l))) : null;
    c.wrong = [];
    if (spoken.length && speakLast !== false) setTimeout(function () { A.say(spoken.join(" ")); }, 350);
    if (c.p >= lines.length && !c.finished) {
      c.finished = true; played(l.code, "role", {}); award("role");
      setTimeout(function () { G.sfx("win"); G.react("win", t("cocoWin")); G.addXP(20); }, 900);
    }
  }
  function roleBody(l) {
    var c = cur, d = l.dialogue;
    var people = []; d.lines.forEach(function (x) { if (people.indexOf(x.who) < 0) people.push(x.who); });
    if (!c.role) {
      return gameHead("🎭", t("gRole"), esc(d.heading)) + '<div class="card"><h3 style="margin-bottom:12px">' + t("roleChoose") + '</h3><div class="actions">' +
        people.map(function (p) { return '<button class="btn" data-g="role" data-who="' + esc(p) + '">' + esc(p) + "</button>"; }).join("") +
        '</div><p class="note" style="margin-top:14px"><button class="linkbtn" data-g="hearall">🔊 ' + t("listenAll") + "</button></p></div>";
    }
    var h = gameHead("🎭", t("gRole"), esc(d.heading), t("roleYou") + ": <b>" + esc(c.role) + "</b>");
    h += '<div class="card"><div class="dlg">' + c.shown.map(function (i) {
      var x = d.lines[i], me = x.who === c.role;
      return '<button class="bubble ' + (me ? "right me" : "") + '" data-say="' + esc(x.fr) + '" style="border:0;text-align:start"><b>' + esc(me ? t("roleYou") + " (" + x.who + ")" : x.who) + ' 🔊</b><span class="fr">' + esc(x.fr) + '</span><br><span class="tr">' + esc(A.pick(x.en, x.ar)) + "</span></button>";
    }).join("") + "</div>";
    if (c.opts) {
      var want = d.lines[c.p];
      h += '<div class="yourturn"><div class="qkind">🎭 ' + t("roleSay") + '</div><h2>« ' + esc(A.pick(want.en, want.ar)) + ' »</h2><div class="opts">' + c.opts.map(function (o, i) {
        return '<button class="opt' + (c.wrong.indexOf(i) >= 0 ? " wrong" : "") + '" data-g="rpick" data-i="' + i + '" lang="fr"' + (c.wrong.indexOf(i) >= 0 ? " disabled" : "") + ">" + esc(o) + "</button>";
      }).join("") + "</div></div>";
    } else {
      h += '<div class="feedback good" style="margin-top:14px">🎉 ' + t("roleDone") + '</div><div class="actions" style="margin-top:12px"><button class="btn" data-g="again">' + t("again") + '</button><a class="btn ghost" href="#/lesson/' + l.code + '">' + t("backLesson") + "</a></div>";
    }
    return h + "</div>";
  }
  function rolePick(i, l) {
    var c = cur, want = l.dialogue.lines[c.p];
    if (c.opts[i] === want.fr) {
      c.shown.push(c.p); c.p++; G.sfx("good"); G.react("happy", rnd(t("cocoGood"))); A.say(want.fr);
      setTimeout(function () { roleAdvance(l); A.render(); }, 1600);
    } else { c.wrong.push(i); G.sfx("bad"); G.react("sad", t("roleHint")); }
  }

  /* ---------------- clicks ---------------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-g]"); if (!el) return;
    var act = el.getAttribute("data-g");
    if (act === "sound") { var s = S(); s.sound = !s.sound; A.save(); hud(); return; }
    var parts = location.hash.replace(/^#\/?/, "").split("/"), l = A.byCode(parts[1]), game = parts[2];
    if (act === "again") { cur = null; A.render(); return; }
    if (act === "ml" || act === "mr") matchPick(act === "ml" ? "l" : "r", +el.getAttribute("data-i"), l);
    else if (act === "flip") { cur.flipped = !cur.flipped; G.sfx("flip"); if (!cur.flipped) A.say(cur.queue[0].fr); }
    else if (act === "hear") { A.say(game === "speak" ? target(cur.list[cur.i].fr) : cur.queue[0].fr); return; }
    else if (act === "knew" || act === "forgot") cardAnswer(act === "knew", game === "cards" ? l : null);
    else if (act === "mic") { listen(l); return; }
    else if (act === "selfok") { G.sfx("good"); G.react("happy", rnd(t("cocoGood"))); speakNext(l, 80); }
    else if (act === "snext") speakNext(l);
    else if (act === "role") { cur.role = el.getAttribute("data-who"); roleAdvance(l); }
    else if (act === "hearall") { A.say(l.dialogue.lines.map(function (x) { return x.fr; }).join(" ")); return; }
    else if (act === "rpick") rolePick(+el.getAttribute("data-i"), l);
    A.render();
  });

  /* quiz hooks */
  G.onAnswer = function (ok) {
    if (ok) { G.sfx("good"); G.react("happy", rnd(t("cocoGood"))); G.addXP(5); }
    else { G.sfx("bad"); G.react("sad", rnd(t("cocoBad"))); }
  };
  G.onQuizDone = function (pct) {
    if (pct >= 70) { G.sfx("win"); G.react("win", t("cocoWin")); }
    if (pct === 100) award("quiz100");
  };

  /* progress page extras */
  G.progressHtml = function () {
    var s = S();
    var h = '<div class="card" style="margin-bottom:16px"><h3 style="margin-bottom:12px">' + t("badgesTitle") + '</h3><div class="badges">';
    BADGES.forEach(function (b) {
      var got = s.badges.indexOf(b.id) >= 0;
      h += '<div class="badge' + (got ? " got" : "") + '"><span>' + b.icon + "</span><b>" + (A.ar() ? b.ar : b.en) + "</b><small>" + (A.ar() ? b.howAr : b.howEn) + "</small></div>";
    });
    return h + "</div></div>";
  };
  G.stats = function () { return { xp: S().xp, streak: streak() }; };
  G.t = t;
})();
