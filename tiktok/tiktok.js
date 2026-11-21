(function(){
  "use strict";
  const C = window.TIKTOK_CFG;
  const $ = id => document.getElementById(id);
  const MB = 1024 * 1024;
  let creator = null, file = null, duration = 0;

  function show(el, on){ $(el).hidden = !on; }
  function say(t){ $("msg").textContent = t; show("msg", !!t); }
  function status(t){ $("status").textContent = t; show("status", !!t); }

  // ---------- auth ----------
  const rand = n => { const a = new Uint8Array(n); crypto.getRandomValues(a);
    return Array.from(a, b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[b % 66]).join(""); };
  async function sha256hex(s){ const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(d), b => b.toString(16).padStart(2, "0")).join(""); }

  async function login(){
    const state = rand(32), verifier = rand(64);
    sessionStorage.setItem("tt_state", state);
    sessionStorage.setItem("tt_verifier", verifier);
    const p = new URLSearchParams({
      client_key: C.clientKey, scope: C.scopes, response_type: "code",
      redirect_uri: C.redirectUri, state,
      code_challenge: await sha256hex(verifier), code_challenge_method: "S256",
    });
    location.href = "https://www.tiktok.com/v2/auth/authorize/?" + p.toString();
  }
  function token(){ try { return JSON.parse(sessionStorage.getItem("tt_token") || "null"); } catch(e){ return null; } }
  async function freshToken(){
    let t = token(); if (!t) return null;
    if (t.expires_at && Date.now() > t.expires_at - 60000 && t.refresh_token){
      const r = await fetch(C.workerUrl + "/refresh", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ refresh_token: t.refresh_token }) });
      const n = await r.json();
      if (n.access_token){ n.expires_at = Date.now() + n.expires_in * 1000; sessionStorage.setItem("tt_token", JSON.stringify(n)); t = n; }
      else { sessionStorage.removeItem("tt_token"); return null; }
    }
    return t.access_token;
  }
  async function api(path, body, method){
    const at = await freshToken(); if (!at) throw new Error("Please sign in again.");
    const r = await fetch(C.workerUrl + "/api" + path, {
      method: method || "POST",
      headers: { Authorization: "Bearer " + at, "Content-Type": "application/json; charset=UTF-8" },
      body: method === "GET" ? undefined : JSON.stringify(body || {}),
    });
    const j = await r.json().catch(() => ({}));
    if (j.error && j.error.code && j.error.code !== "ok") {
      const e = new Error(j.error.message || j.error.code); e.code = j.error.code; throw e;
    }
    return j.data || {};
  }
  async function logout(){
    const t = token();
    if (t) { try { await fetch(C.workerUrl + "/revoke", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ token: t.access_token }) }); } catch(e){} }
    sessionStorage.removeItem("tt_token"); location.reload();
  }

  // ---------- form ----------
  const PRIV = { PUBLIC_TO_EVERYONE: "Everyone", MUTUAL_FOLLOW_FRIENDS: "Friends", FOLLOWER_OF_CREATOR: "Followers", SELF_ONLY: "Only me" };

  function fillCreator(c){
    creator = c;
    $("avatar").src = c.creator_avatar_url || "";
    $("nick").textContent = c.creator_nickname || "";
    $("uname").textContent = c.creator_username ? "@" + c.creator_username : "";
    const sel = $("privacy");
    (c.privacy_level_options || []).forEach(v => { const o = document.createElement("option"); o.value = v; o.textContent = PRIV[v] || v; sel.appendChild(o); });
    [["comment_disabled","allowComment","rowComment"],["duet_disabled","allowDuet","rowDuet"],["stitch_disabled","allowStitch","rowStitch"]].forEach(([k,id,row]) => {
      if (c[k]) { $(id).disabled = true; $(id).checked = false; $(row).classList.add("off"); $(row).title = "Turned off in your TikTok settings"; }
    });
  }

  function consentText(){
    const bc = $("disclose").checked && $("brandContent").checked;
    $("consent").innerHTML = bc
      ? 'By posting, you agree to TikTok\'s <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener">Branded Content Policy</a> and <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener">Music Usage Confirmation</a>.'
      : 'By posting, you agree to TikTok\'s <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener">Music Usage Confirmation</a>.';
  }

  function validate(){
    const d = $("disclose").checked, bo = $("brandOrganic").checked, bc = $("brandContent").checked;
    show("discloseOpts", d); show("discloseWarn", d && !bo && !bc);
    // Branded content can't be private.
    const sel = $("privacy"), self = Array.from(sel.options).find(o => o.value === "SELF_ONLY");
    if (self) { self.disabled = d && bc; self.textContent = (d && bc) ? "Only me (not allowed for branded content)" : "Only me"; if (self.disabled && sel.value === "SELF_ONLY") sel.value = ""; }
    let ok = !!file && !!sel.value && !(d && !bo && !bc);
    const max = creator && creator.max_video_post_duration_sec;
    if (file && max && duration > max) { ok = false; $("fileInfo").textContent += " · Too long: max " + max + " s for this account."; }
    $("postBtn").disabled = !ok;
    $("draftBtn").disabled = !file;
    consentText();
  }

  function onFile(){
    file = $("file").files[0] || null; duration = 0;
    const v = $("preview");
    if (!file) { show("preview", false); $("fileInfo").textContent = ""; validate(); return; }
    v.src = URL.createObjectURL(file); show("preview", true);
    $("fileInfo").textContent = file.name + " · " + (file.size / MB).toFixed(1) + " MB";
    v.onloadedmetadata = () => { duration = v.duration || 0; $("fileInfo").textContent += " · " + Math.round(duration) + " s"; validate(); };
    validate();
  }

  // ---------- upload ----------
  function plan(size){
    if (size <= 5 * MB) return { chunk: size, count: 1 };
    const chunk = 10 * MB;                     // 5–64 MB allowed; last chunk takes the remainder
    return { chunk, count: Math.max(1, Math.floor(size / chunk)) };
  }
  async function upload(uploadUrl, p){
    const bar = $("bar").firstElementChild; show("bar", true);
    for (let i = 0; i < p.count; i++){
      const start = i * p.chunk, end = (i === p.count - 1) ? file.size : start + p.chunk;
      const r = await fetch(C.workerUrl + "/upload", {
        method: "PUT",
        headers: { "X-Upload-Url": uploadUrl, "Content-Type": file.type || "video/mp4",
          "Content-Range": "bytes " + start + "-" + (end - 1) + "/" + file.size },
        body: file.slice(start, end),
      });
      if (!r.ok && r.status !== 206 && r.status !== 201) throw new Error("Upload failed on part " + (i + 1) + " (" + r.status + ")");
      bar.style.width = Math.round(end / file.size * 100) + "%";
      status("Uploading… part " + (i + 1) + " of " + p.count);
    }
  }
  const NICE = {
    PROCESSING_UPLOAD: "TikTok is receiving the video…", PROCESSING_DOWNLOAD: "TikTok is receiving the video…",
    SEND_TO_USER_INBOX: "Sent to your TikTok inbox. Open the TikTok app to finish and post it.",
    PUBLISH_COMPLETE: "Posted! It may take a few minutes to appear on your profile.",
    FAILED: "TikTok could not post it.",
  };
  async function poll(id){
    for (let i = 0; i < 60; i++){
      const d = await api("/v2/post/publish/status/fetch/", { publish_id: id });
      const s = d.status || "";
      status((NICE[s] || s) + (d.fail_reason ? "\nReason: " + d.fail_reason : "") + "\nPublish id: " + id);
      if (s === "PUBLISH_COMPLETE" || s === "FAILED" || s === "SEND_TO_USER_INBOX") return s;
      await new Promise(r => setTimeout(r, 4000));
    }
    status("Still processing. Check your TikTok profile in a few minutes.\nPublish id: " + id);
  }

  async function send(draft){
    $("postBtn").disabled = $("draftBtn").disabled = true;
    try {
      const p = plan(file.size);
      const source_info = { source: "FILE_UPLOAD", video_size: file.size, chunk_size: p.chunk, total_chunk_count: p.count };
      let d;
      status(draft ? "Preparing draft…" : "Preparing post…");
      if (draft) d = await api("/v2/post/publish/inbox/video/init/", { source_info });
      else {
        const disclose = $("disclose").checked;
        d = await api("/v2/post/publish/video/init/", {
          post_info: {
            title: $("title").value,
            privacy_level: $("privacy").value,
            disable_comment: !$("allowComment").checked,
            disable_duet: !$("allowDuet").checked,
            disable_stitch: !$("allowStitch").checked,
            brand_organic_toggle: disclose && $("brandOrganic").checked,
            brand_content_toggle: disclose && $("brandContent").checked,
          },
          source_info,
        });
      }
      await upload(d.upload_url, p);
      status("Upload done. Waiting for TikTok…");
      await poll(d.publish_id);
    } catch (e) {
      status("Problem: " + e.message + (e.code ? " (" + e.code + ")" : ""));
    } finally { validate(); }
  }

  // ---------- start ----------
  async function start(){
    if (!C.clientKey || !C.workerUrl) { say("Setup not finished yet: the TikTok key or the helper server address is missing."); return; }
    $("loginBtn").onclick = login;
    $("logoutBtn").onclick = logout;
    if (!token()) { show("signedOut", true); return; }
    try {
      fillCreator(await api("/v2/post/publish/creator_info/query/", {}));
      show("signedIn", true);
    } catch (e) {
      if (e.code === "spam_risk_too_many_posts" || e.code === "reached_active_user_cap") say("TikTok says this account can't post more right now: " + e.message);
      else { sessionStorage.removeItem("tt_token"); show("signedOut", true); say("Please sign in again (" + e.message + ")."); }
      return;
    }
    ["privacy","allowComment","allowDuet","allowStitch","disclose","brandOrganic","brandContent"].forEach(id => $(id).addEventListener("change", validate));
    $("file").addEventListener("change", onFile);
    $("postBtn").onclick = () => send(false);
    $("draftBtn").onclick = () => send(true);
    validate();
  }
  start();
})();
