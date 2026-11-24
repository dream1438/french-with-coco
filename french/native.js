/* Phone app (Android / iPhone) helpers. Does nothing on the website.
   The apps are built from these same files with Capacitor (see mobile/README.md). */
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  // Plugin scripts are bundled into the app by mobile/scripts/copy-web.js (fallback: the bridge's plugin list).
  var P = {
    App: (window.capacitorApp && window.capacitorApp.App) || (C.Plugins && C.Plugins.App),
    Browser: (window.capacitorBrowser && window.capacitorBrowser.Browser) || (C.Plugins && C.Plugins.Browser)
  };
  var platform = C.getPlatform ? C.getPlatform() : "";
  document.documentElement.classList.add("in-app", "in-app-" + platform);
  if (document.body) document.body.classList.add("in-app");

  // Links that leave the app (YouTube, worksheets, email, website pages) open in the phone's browser or apps.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/^mailto:/i.test(href)) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    var external = /^https?:$/.test(u.protocol) && u.host !== location.host;
    if (!external) return;
    e.preventDefault();
    if (P.Browser) P.Browser.open({ url: u.href }); else window.open(u.href, "_system");
  }, true);

  // Android back button: go back inside the app, close it from the home screen.
  if (P.App) P.App.addListener("backButton", function (ev) {
    var modal = document.querySelector(".acct-modal:not([hidden])");
    if (modal) { modal.hidden = true; document.body.classList.remove("acct-open"); return; }
    var home = !location.hash || /^#\/?$/.test(location.hash);
    if (!home && ev && ev.canGoBack) history.back();
    else if (!home) location.hash = "#/";
    else P.App.exitApp();
  });

  // App links: com.languageswithcoco.french://open/lesson/A1-01 opens that screen (#/lesson/A1-01).
  function openLink(url) {
    var m = /^com\.languageswithcoco\.french:\/\/open\/?(.*)$/.exec(url || "");
    if (m) location.hash = "#/" + m[1];
  }
  if (P.App) {
    P.App.addListener("appUrlOpen", function (ev) { openLink(ev && ev.url); });
    if (P.App.getLaunchUrl) P.App.getLaunchUrl().then(function (r) { if (r) openLink(r.url); }).catch(function () {});
  }

  window.CocoNative = {
    platform: platform,
    authRedirect: "com.languageswithcoco.french://auth",
    plugins: P
  };
})();
