// Coco TikTok helper: a tiny Cloudflare Worker.
// It keeps the TikTok client_secret off the static site and relays the few
// TikTok API calls the posting page needs (TikTok's API has no browser CORS).
// Settings (Cloudflare dashboard → Worker → Settings → Variables):
//   TIKTOK_CLIENT_KEY    (plain text)
//   TIKTOK_CLIENT_SECRET (type "Secret", entered by the account owner)
//   ALLOWED_ORIGIN       (optional, default https://languageswithcoco.com)

const API = "https://open.tiktokapis.com";
const API_PATHS = new Set([
  "/v2/user/info/",
  "/v2/post/publish/creator_info/query/",
  "/v2/post/publish/video/init/",
  "/v2/post/publish/inbox/video/init/",
  "/v2/post/publish/status/fetch/",
]);

function cors(env, req) {
  const allowed = (env.ALLOWED_ORIGIN || "https://languageswithcoco.com").split(",").map(s => s.trim());
  const origin = req.headers.get("Origin") || "";
  const ok = allowed.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type,Content-Range,X-Upload-Url",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
const json = (h, obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...h, "Content-Type": "application/json" } });

async function oauth(env, params) {
  const body = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    client_secret: env.TIKTOK_CLIENT_SECRET,
    ...params,
  });
  const r = await fetch(API + "/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body,
  });
  return [await r.text(), r.status];
}

export default {
  async fetch(req, env) {
    const h = cors(env, req);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === "/" || p === "/health")
        return json(h, { ok: true, key: !!env.TIKTOK_CLIENT_KEY, secret: !!env.TIKTOK_CLIENT_SECRET });

      if (p === "/token" && req.method === "POST") {
        const b = await req.json();
        const params = { code: b.code, grant_type: "authorization_code", redirect_uri: b.redirect_uri };
        if (b.code_verifier) params.code_verifier = b.code_verifier;
        const [t, s] = await oauth(env, params);
        return new Response(t, { status: s, headers: { ...h, "Content-Type": "application/json" } });
      }
      if (p === "/refresh" && req.method === "POST") {
        const b = await req.json();
        const [t, s] = await oauth(env, { grant_type: "refresh_token", refresh_token: b.refresh_token });
        return new Response(t, { status: s, headers: { ...h, "Content-Type": "application/json" } });
      }
      if (p === "/revoke" && req.method === "POST") {
        const b = await req.json();
        const r = await fetch(API + "/v2/oauth/revoke/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, token: b.token }),
        });
        return new Response(await r.text(), { status: r.status, headers: { ...h, "Content-Type": "application/json" } });
      }
      if (p.startsWith("/api/")) {
        const path = p.slice(4); // keeps leading "/v2/..."
        if (!API_PATHS.has(path)) return json(h, { error: "path not allowed" }, 403);
        const init = {
          method: req.method,
          headers: { Authorization: req.headers.get("Authorization") || "", "Content-Type": "application/json; charset=UTF-8" },
        };
        if (req.method === "POST") init.body = await req.text();
        const r = await fetch(API + path + url.search, init);
        return new Response(await r.text(), { status: r.status, headers: { ...h, "Content-Type": "application/json" } });
      }
      if (p === "/upload" && req.method === "PUT") {
        const target = req.headers.get("X-Upload-Url") || "";
        const t = new URL(target);
        if (t.protocol !== "https:" || !/(^|\.)tiktokapis\.com$/.test(t.hostname))
          return json(h, { error: "upload host not allowed" }, 403);
        const r = await fetch(target, {
          method: "PUT",
          headers: {
            "Content-Type": req.headers.get("Content-Type") || "video/mp4",
            "Content-Range": req.headers.get("Content-Range") || "",
            "Content-Length": req.headers.get("Content-Length") || "",
          },
          body: req.body,
        });
        return new Response(await r.text(), { status: r.status, headers: h });
      }
      return json(h, { error: "not found" }, 404);
    } catch (e) {
      return json(h, { error: String(e && e.message || e) }, 500);
    }
  },
};
