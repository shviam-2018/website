const { onRequest } = require('firebase-functions/v2/https');

// Minimal 503 maintenance function
exports.maintenance503 = onRequest((req, res) => {
  res.setHeader('Retry-After', '3600');
  res.setHeader('Cache-Control', 'no-store');
  res.status(503)
    .set('Content-Type', 'text/html; charset=utf-8')
    .send(`<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>We’ll be back soon</title>
<style>
  html,body{height:100%}
  body{margin:0;background:#0b0b0b;color:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,Helvetica,sans-serif}
  main{max-width:720px;padding:24px;text-align:center}
  h1{font-size:clamp(22px,4vw,36px);margin:0 0 8px;font-weight:700}
  p{font-size:clamp(14px,2.2vw,18px);opacity:.9;margin:0;line-height:1.6}
</style>
<main>
  <h1>We’ll be back soon</h1>
  <p>We’re performing maintenance and upgrading the site. Please check back shortly.</p>
</main>`);
});
