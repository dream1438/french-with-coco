/* New-lesson email sign-up. Fills every [data-signup] box. Turned on by window.COCO_SIGNUP (signup-config.js):
   { type: "worker", url: "https://.../subscribe" }  -> POST JSON {email, lang, source}
   { type: "mailerlite", url: "<form action URL>" }  -> form post fields[email]
   With no url the boxes stay hidden. */
(function () {
  var cfg = window.COCO_SIGNUP || {};
  var boxes = document.querySelectorAll("[data-signup]");
  if (!cfg.url) { boxes.forEach(function (b) { b.hidden = true; }); return; }
  var ar = function () { return document.documentElement.lang === "ar"; };
  var T = {
    en: { title: "Get new lessons by email", text: "One short email when a new French lesson is out. No spam, unsubscribe any time.", ph: "Your email", btn: "Notify me", ok: "Merci ! You're on the list. 🎉", bad: "Please check the email address.", err: "Something went wrong. Please try again later.", priv: "Privacy Policy" },
    ar: { title: "تصلك الدروس الجديدة على بريدك", text: "رسالة قصيرة عند نشر درس فرنسي جديد. بلا إزعاج، ويمكنك إلغاء الاشتراك في أي وقت.", ph: "بريدك الإلكتروني", btn: "أخبرني", ok: "Merci ! تم تسجيلك. 🎉", bad: "تحقّق من البريد الإلكتروني.", err: "حدث خطأ. حاول لاحقًا.", priv: "سياسة الخصوصية" }
  };
  function render(b) {
    var t = T[ar() ? "ar" : "en"], priv = b.getAttribute("data-privacy") || "/privacy/";
    b.innerHTML = '<div class="su-text"><b>' + t.title + "</b><span>" + t.text + '</span></div><form class="su-form" novalidate>' +
      '<input type="email" name="email" required autocomplete="email" placeholder="' + t.ph + '" aria-label="' + t.ph + '">' +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" class="su-hp" aria-hidden="true">' +
      '<button type="submit">' + t.btn + '</button></form><p class="su-msg" role="status"></p><small class="su-note"><a href="' + priv + '">' + t.priv + "</a></small>";
    b.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, email = f.email.value.trim(), msg = b.querySelector(".su-msg"), t2 = T[ar() ? "ar" : "en"];
      if (f.website.value) return; // bots
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = t2.bad; msg.className = "su-msg bad"; return; }
      f.querySelector("button").disabled = true;
      var done = function () { b.classList.add("su-done"); msg.textContent = t2.ok; msg.className = "su-msg good"; f.remove(); };
      var fail = function () { msg.textContent = t2.err; msg.className = "su-msg bad"; f.querySelector("button").disabled = false; };
      if (cfg.type === "mailerlite") {
        var fd = new FormData(); fd.append("fields[email]", email); fd.append("ml-submit", "1");
        fetch(cfg.url, { method: "POST", body: fd, mode: "no-cors" }).then(done, fail);
      } else {
        fetch(cfg.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, lang: ar() ? "ar" : "en", source: location.pathname }) })
          .then(function (r) { if (r.ok) done(); else fail(); }, fail);
      }
    });
  }
  boxes.forEach(render);
  window.CocoSignup = { refresh: function () { document.querySelectorAll("[data-signup]").forEach(function (b) { if (!b.classList.contains("su-done")) render(b); }); } };
})();
