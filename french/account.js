/* Optional learner accounts (Supabase). Signing in saves progress to the account and syncs it across devices.
   Without an account everything keeps working from this browser (localStorage "coco-progress-v1").
   On first sign-in, the progress already in this browser is merged into the account (nothing is lost). */
(function () {
  var CFG = window.COCO_DB || {};
  var A = window.CocoApp;
  if (!CFG.url || !CFG.key || !A) return;

  var SDK = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
  var REF = CFG.url.replace(/^https:\/\//, "").split(".")[0];
  var LANG = CFG.language || "fr";
  var sb = null, user = null, pushTimer = null, pulling = false, sdkPromise = null;
  // Inside the phone apps, sign-in opens in the phone's browser and comes back to the app on this address.
  var NATIVE = window.CocoNative || null;
  var REDIRECT = NATIVE ? NATIVE.authRedirect : location.origin + location.pathname;
  // Apple asks apps that offer Google sign-in to also offer Sign in with Apple. Until that is set up,
  // the iPhone app offers the email link only.
  var SHOW_GOOGLE = CFG.google && !(NATIVE && NATIVE.platform === "ios" && !CFG.apple);

  var T = {
    en: { signIn: "Sign in", title: "Save your progress", sub: "Sign in to keep your lessons, XP and streak on every device. It's free.",
      google: "Continue with Google", or: "or", email: "Your email", send: "Email me a sign-in link", sent: "Check your inbox: we sent you a sign-in link. 📬",
      bad: "Please check the email address.", err: "Something went wrong. Please try again.", signedAs: "Signed in as", out: "Sign out",
      synced: "Progress saved to your account ✓", merged: "Welcome! Your progress from this device is now saved to your account. 🎉", close: "Close", acct: "Account",
      note: "Optional. You can keep learning without an account." },
    ar: { signIn: "تسجيل الدخول", title: "احفظ تقدّمك", sub: "سجّل الدخول لتحتفظ بدروسك ونقاطك وسلسلة أيامك على كل أجهزتك. مجانًا.",
      google: "المتابعة باستخدام Google", or: "أو", email: "بريدك الإلكتروني", send: "أرسل لي رابط الدخول", sent: "افتح بريدك: أرسلنا لك رابط الدخول. 📬",
      bad: "تحقّق من البريد الإلكتروني.", err: "حدث خطأ. حاول مرة أخرى.", signedAs: "مسجّل باسم", out: "تسجيل الخروج",
      synced: "تم حفظ تقدّمك في حسابك ✓", merged: "أهلًا! تم حفظ تقدّمك من هذا الجهاز في حسابك. 🎉", close: "إغلاق", acct: "الحساب",
      note: "اختياري. يمكنك متابعة التعلّم بدون حساب." }
  };
  function t(k) { return T[A.ar() ? "ar" : "en"][k]; }
  var esc = A.esc;

  /* ---------- SDK loading (only when needed, to keep the page fast) ---------- */
  function loadSdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise(function (ok, fail) {
      if (window.supabase && window.supabase.createClient) return ok();
      var s = document.createElement("script"); s.src = SDK; s.async = true; s.crossOrigin = "anonymous";
      s.onload = function () { ok(); }; s.onerror = fail; document.head.appendChild(s);
    }).then(function () {
      sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: !NATIVE, flowType: "implicit" } });
      sb.auth.onAuthStateChange(function (ev, session) {
        var was = user && user.id; user = session ? session.user : null;
        if (user && user.id !== was) { cleanUrl(); pull(); }
        if (!user) setStatus("");
        paint();
      });
      return sb;
    });
    return sdkPromise;
  }
  /* ---------- phone apps: finish sign-in when the browser hands back to the app ---------- */
  function fromAppLink(url) {
    if (!url || url.indexOf(REDIRECT) !== 0) return;
    var frag = url.split("#")[1] || url.split("?")[1] || "", q = {};
    frag.split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); });
    try { NATIVE.plugins.Browser && NATIVE.plugins.Browser.close(); } catch (e) {}
    if (q.error || q.error_description) { setStatus(t("err")); return; }
    if (!q.access_token || !q.refresh_token) return;
    loadSdk().then(function () { return sb.auth.setSession({ access_token: q.access_token, refresh_token: q.refresh_token }); })
      .then(function (r) { if (r && r.error) throw r.error; closeModal(); })
      .catch(function () { setStatus(t("err")); });
  }
  if (NATIVE && NATIVE.plugins.App) {
    NATIVE.plugins.App.addListener("appUrlOpen", function (ev) { fromAppLink(ev && ev.url); });
    if (NATIVE.plugins.App.getLaunchUrl) NATIVE.plugins.App.getLaunchUrl().then(function (r) { if (r && r.url) fromAppLink(r.url); }).catch(function () {});
  }

  function hasStoredSession() { try { return !!localStorage.getItem("sb-" + REF + "-auth-token"); } catch (e) { return false; } }
  function urlHasAuth() { return /access_token=|error_description=/.test(location.hash) || /[?&]code=/.test(location.search); }
  function cleanUrl() { if (urlHasAuth()) history.replaceState(null, "", location.pathname + "#/"); if (/^#\/?$/.test(location.hash) || !location.hash) A.render(); }

  /* ---------- merge local + account ---------- */
  function maxN(a, b) { return a == null ? b : b == null ? a : Math.max(a, b); }
  function mergeGames(a, b) {
    var out = {}, k, x, y;
    a = a || {}; b = b || {};
    for (k in a) out[k] = a[k];
    for (k in b) {
      x = out[k] || {}; y = b[k] || {};
      out[k] = { n: Math.max(x.n || 0, y.n || 0) };
      ["stars", "score"].forEach(function (f) { var v = maxN(x[f], y[f]); if (v != null) out[k][f] = v; });
      for (var f in y) if (!(f in out[k])) out[k][f] = y[f];
      for (f in x) if (!(f in out[k])) out[k][f] = x[f];
    }
    return out;
  }
  function union(a, b) { var s = (a || []).slice(); (b || []).forEach(function (v) { if (s.indexOf(v) < 0) s.push(v); }); return s; }

  function pull() {
    if (!sb || !user || pulling) return;
    pulling = true;
    var st = A.state(), hadLocal = Object.keys(st.lessons || {}).length > 0 || (st.xp || 0) > 0;
    Promise.all([
      sb.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      sb.from("lesson_progress").select("lesson_id,watched,words,sheet,quiz_best,quiz_last,games").eq("user_id", user.id)
    ]).then(function (res) {
      if (res[0].error || res[1].error) throw res[0].error || res[1].error;
      var p = res[0].data || {}, rows = res[1].data || [], wasNew = !rows.length && !(p.xp > 0);
      rows.forEach(function (r) {
        var code = r.lesson_id.replace(new RegExp("^" + LANG + "-"), ""), l = st.lessons[code] || (st.lessons[code] = {});
        if (r.watched) l.watched = true;
        if (r.words) l.words = true;
        if (r.sheet) l.sheet = true;
        var qb = maxN(l.quizBest, r.quiz_best); if (qb != null) l.quizBest = qb;
        if (l.quizLast == null && r.quiz_last != null) l.quizLast = r.quiz_last;
        var g = mergeGames(l.games, r.games); if (Object.keys(g).length) l.games = g;
      });
      st.xp = Math.max(st.xp || 0, p.xp || 0);
      st.days = union(st.days, p.days).sort();
      st.badges = union(st.badges, p.badges);
      var ex = p.extra || {};
      st.cards = Object.assign({}, ex.cards || {}, st.cards || {});
      st.speak = st.speak || {}; st.speak.perfect = Math.max(st.speak.perfect || 0, (ex.speak || {}).perfect || 0);
      if (st.sound === undefined && ex.sound !== undefined) st.sound = ex.sound;
      A.save(true);
      A.render();
      pulling = false;
      return push().then(function () { setStatus(wasNew && hadLocal ? t("merged") : t("synced")); });
    }).catch(function () { pulling = false; setStatus(t("err")); });
  }

  function push() {
    if (!sb || !user) return Promise.resolve();
    var st = A.state(), now = new Date().toISOString(), known = {};
    (A.LESSONS || []).forEach(function (l) { known[l.code] = 1; });
    var rows = Object.keys(st.lessons || {}).filter(function (c) { return known[c]; }).map(function (code) {
      var l = st.lessons[code];
      return { user_id: user.id, lesson_id: LANG + "-" + code, watched: !!l.watched, words: !!l.words, sheet: !!l.sheet,
        quiz_best: l.quizBest == null ? null : l.quizBest, quiz_last: l.quizLast == null ? null : l.quizLast, games: l.games || {}, updated_at: now };
    });
    var prof = { id: user.id, ui_lang: st.lang || "en", xp: st.xp || 0, days: st.days || [], badges: st.badges || [],
      extra: { cards: st.cards || {}, speak: st.speak || {}, sound: st.sound }, updated_at: now };
    return Promise.all([
      sb.from("profiles").upsert(prof),
      rows.length ? sb.from("lesson_progress").upsert(rows) : Promise.resolve({})
    ]).then(function (res) { if (res[0].error || res[1].error) setStatus(t("err")); });
  }
  function dirty() {
    if (!user || pulling) return;
    clearTimeout(pushTimer); pushTimer = setTimeout(push, 1500);
  }
  window.addEventListener("pagehide", function () { if (pushTimer) { clearTimeout(pushTimer); push(); } });

  /* ---------- UI ---------- */
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "acct-btn"; btn.id = "acctBtn";
  var nav = document.querySelector(".topnav"), langBtn = document.getElementById("langBtn");
  if (nav) nav.insertBefore(btn, langBtn || null);
  var modal = document.createElement("div"); modal.className = "acct-modal"; modal.hidden = true;
  modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
  document.body.appendChild(modal);
  var statusEl = document.createElement("div"); statusEl.className = "acct-status"; statusEl.setAttribute("role", "status"); statusEl.hidden = true;
  document.body.appendChild(statusEl);
  var statusTimer = null;
  function setStatus(msg) {
    statusEl.textContent = msg || ""; statusEl.hidden = !msg;
    clearTimeout(statusTimer); if (msg) statusTimer = setTimeout(function () { statusEl.hidden = true; }, 4500);
  }
  function initial() {
    var n = (user && (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name) || user.email)) || "?";
    return n.trim().charAt(0).toUpperCase();
  }
  function paint() {
    if (user) { btn.innerHTML = '<span class="acct-av" aria-hidden="true">' + esc(initial()) + "</span>"; btn.setAttribute("aria-label", t("acct")); btn.classList.add("in"); }
    else { btn.innerHTML = '<svg class="acct-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor"/></svg><span class="acct-tx">' + t("signIn") + "</span>"; btn.setAttribute("aria-label", t("signIn")); btn.classList.remove("in"); }
    if (!modal.hidden) openModal();
  }
  function openModal() {
    var h = '<div class="acct-card"><button class="acct-x" type="button" data-acct="close" aria-label="' + t("close") + '">×</button>';
    if (user) {
      h += '<img src="assets/coco/proud.svg" alt="" width="96" height="105"><h2>' + t("acct") + "</h2><p>" + t("signedAs") + "<br><b>" + esc(user.email || "") + "</b></p>" +
        '<button class="btn ghost" type="button" data-acct="out">' + t("out") + "</button>";
    } else {
      h += '<img src="assets/coco/wave.svg" alt="" width="96" height="105"><h2>' + t("title") + "</h2><p>" + t("sub") + "</p>";
      if (SHOW_GOOGLE) h += '<button class="btn acct-google" type="button" data-acct="google"><span aria-hidden="true">G</span> ' + t("google") + '</button><div class="acct-or"><span>' + t("or") + "</span></div>";
      h += '<form class="acct-form" novalidate><input type="email" name="email" required autocomplete="email" placeholder="' + t("email") + '" aria-label="' + t("email") + '">' +
        '<button class="btn navy" type="submit">' + t("send") + '</button></form><p class="acct-msg" role="status"></p><small class="acct-note">' + t("note") + "</small>";
    }
    modal.innerHTML = h + "</div>";
    modal.hidden = false; document.body.classList.add("acct-open");
    var f = modal.querySelector("input"); if (f) setTimeout(function () { f.focus(); }, 30);
  }
  function closeModal() { if (modal.hidden) return; modal.hidden = true; document.body.classList.remove("acct-open"); btn.focus(); }

  btn.addEventListener("click", function () { openModal(); if (!sb) loadSdk().catch(function () {}); });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) return closeModal();
    var a = e.target.closest("[data-acct]"); if (!a) return;
    var act = a.getAttribute("data-acct");
    if (act === "close") closeModal();
    if (act === "out") loadSdk().then(function () { return sb.auth.signOut(); }).then(closeModal);
    if (act === "google") loadSdk().then(function () {
      if (!NATIVE) return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: REDIRECT } });
      return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: REDIRECT, skipBrowserRedirect: true } }).then(function (r) {
        if (r.error || !r.data || !r.data.url) throw r.error || new Error("no url");
        return NATIVE.plugins.Browser.open({ url: r.data.url, presentationStyle: "popover" });
      }).catch(function () { setStatus(t("err")); });
    });
  });
  modal.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, email = form.email.value.trim(), msg = modal.querySelector(".acct-msg"), b = form.querySelector("button");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = t("bad"); msg.className = "acct-msg bad"; return; }
    b.disabled = true;
    loadSdk().then(function () {
      return sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: REDIRECT, data: { ui_lang: A.ar() ? "ar" : "en" } } });
    }).then(function (r) {
      if (r && r.error) throw r.error;
      msg.textContent = t("sent"); msg.className = "acct-msg good"; form.remove();
    }).catch(function () { msg.textContent = t("err"); msg.className = "acct-msg bad"; b.disabled = false; });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  window.CocoAccount = { dirty: dirty, paint: paint, user: function () { return user; } };
  paint();
  if (hasStoredSession() || urlHasAuth()) loadSdk().catch(function () {});
})();
