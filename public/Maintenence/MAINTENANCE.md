# NightDev4l Infrastructure Documentation# Maintenance mode (temporary)



This document describes the Firebase Hosting setup for nightdev4l.web.app, including production, maintenance mode, and preview infrastructure.This site is in temporary maintenance. To avoid disrupting SEO and keep your URLs intact, you have two options:



## Overview- Best practice (recommended): return HTTP 503 Service Unavailable with a `Retry-After` header for all pages during the maintenance window. Search engines treat this as temporary and will keep your pages indexed.

- Fallback (already enabled here): a client-side full-screen overlay that displays a maintenance message on every page while keeping the original HTML and links intact. This is easy for static hosting, but not as ideal for SEO as a true 503.

**Project:** nightdev4l (Firebase)  

**Primary Site:** https://nightdev4l.web.app  ## Toggle the overlay on/off

**Preview Site:** https://nightdev4l-maint.web.app (maintenance testing only)

- Root pages: edit `public/script.js` and set `const MAINTENANCE_ENABLED = false;`

The site uses Firebase Hosting with multiple hosting targets and a Cloud Function to provide SEO-safe maintenance mode via HTTP 503.- External pages under `public/external links/`: edit `public/external links/script.js` and set `const MAINTENANCE_ENABLED = false;`



---Commit and deploy after flipping both flags.



## Infrastructure Components## Server-side 503 (preferred)



### 1. Firebase Hosting SitesOnly do one of these based on where you host the site. These rules serve a maintenance page for all requests while sending 503 + `Retry-After`. Adjust the retry time as needed.



- **nightdev4l** (production)### Apache (.htaccess)

  - Primary public-facing site```

  - Serves from `public/` directoryRewriteEngine On

  - Two deployment modes: live and maintenance# Allow assets, sitemap and robots

RewriteCond %{REQUEST_URI} !\.(css|js|png|jpg|jpeg|gif|svg|ico|webp)$ [NC]

- **nightdev4l-maint** (preview/testing)RewriteCond %{REQUEST_URI} !^/robots\.txt$

  - Separate site for testing maintenance modeRewriteCond %{REQUEST_URI} !^/sitemap\.xml$

  - Serves from `public-maintenance/` directory

  - Always in maintenance mode (503)# Serve maintenance page with 503

  - Use this to preview before enabling maintenance on productionRewriteRule ^.*$ /index.html [R=503,L]



### 2. Cloud Function# Add Retry-After header

Header always set Retry-After "3600"

- **maintenance503** (2nd gen, Node.js 20)ErrorDocument 503 /index.html

  - Region: us-central1```

  - Returns HTTP 503 with `Retry-After: 3600` header

  - Minimal HTML: "We'll be back soon" message### Nginx (server block)

  - Direct URL: https://us-central1-nightdev4l.cloudfunctions.net/maintenance503```

error_page 503 @maint;

### 3. Hosting Targetsadd_header Retry-After 3600 always;



Defined in `.firebaserc`:location / {

  return 503;

```json}

{

  "targets": {location @maint {

    "nightdev4l": {  try_files /index.html =503;

      "hosting": {}

        "live": ["nightdev4l"],

        "maintenance": ["nightdev4l"],# keep static assets accessible (optional)

        "maintenancePreview": ["nightdev4l-maint"]location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|webp)$ {

      }  expires 1h;

    }}

  }```

}

```### Netlify (`_redirects` and `_headers`)

Create these files at your publish directory root.

---

`_redirects`

## Directory Structure```

/*   /index.html   503!

``````

c:\Users\shvia\OneDrive\Desktop\deployed website\

├── public/                     # Live site content`_headers`

│   ├── index.html```

│   ├── style.css/*

│   ├── script.js  Retry-After: 3600

│   ├── robots.txt```

│   ├── sitemap.xml

│   ├── external links/### Vercel (Edge Function or middleware)

│   └── ...Use middleware to return 503 for all routes temporarily:

├── public-maintenance/         # Maintenance site (minimal)

│   ├── robots.txt`middleware.ts`

│   └── sitemap.xml```ts

├── functions/import { NextResponse } from 'next/server';

│   ├── index.js               # Cloud Function (maintenance503)export function middleware() {

│   ├── package.json  return new NextResponse('<!doctype html><title>Maintenance</title><h1>We\'ll be back soon</h1>', {

│   └── .gitignore    status: 503,

├── firebase.json    headers: { 'Retry-After': '3600', 'Content-Type': 'text/html; charset=utf-8' },

├── .firebaserc  });

└── MAINTENANCE.md (this file)}

``````



---### Cloudflare Pages (Worker)

Create a simple Worker route that returns 503 for `*` and deploy it during the window.

## Firebase.json Configuration

### GitHub Pages

Three hosting configurations:GitHub Pages cannot return 503. If you must use it, keep maintenance short and prefer the overlay (already enabled). Avoid adding `<meta name="robots" content="noindex">` as it can hurt SEO.



### 1. Live Target (production normal mode)## Notes

- **Target:** `live`- Keep the maintenance window as short as possible.

- **Site:** nightdev4l- Avoid serving a 200 status with a maintenance page for extended periods; search engines might cache it.

- **Public directory:** `public/`- When done, remove/disable maintenance and redeploy. No sitemap or robots changes are needed.

- **Behavior:** Serves static files normally (200 status)

## Firebase Hosting

### 2. Maintenance Target (production maintenance mode)

- **Target:** `maintenance`Firebase Hosting doesn’t support returning 503 directly from static hosting. Use one of these:

- **Site:** nightdev4l

- **Public directory:** `public/`1) Preferred: rewrite to a Cloud Function that returns 503 + `Retry-After`.

- **Behavior:** 

  - `/robots.txt` → static file (200)firebase.json

  - `/sitemap.xml` → static file (200)```json

  - All other routes → `maintenance503` function (503){

  "hosting": {

### 3. Preview Site (nightdev4l-maint)    "public": "public",

- **Site:** nightdev4l-maint    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],

- **Public directory:** `public-maintenance/`    "headers": [

- **Behavior:** Same as maintenance target      { "source": "/**", "headers": [{ "key": "Cache-Control", "value": "no-store" }] }

- **Purpose:** Test maintenance mode without touching production    ],

    "rewrites": [

---      { "source": "/robots.txt", "destination": "/robots.txt" },

      { "source": "/sitemap.xml", "destination": "/sitemap.xml" },

## Deployment Commands      { "source": "**", "function": "maintenance503" }

    ]

All commands should be run from `c:\Users\shvia\OneDrive\Desktop\deployed website\`  },

  "functions": {

### First-Time Setup (one-time)    "runtime": "nodejs18"

  }

Deploy the Cloud Function:}

```

```powershell

firebase deploy --only functions:maintenance503 --project nightdev4lfunctions/index.js

``````js

const functions = require('firebase-functions');

### Normal Operations

exports.maintenance503 = functions.https.onRequest((req, res) => {

#### Deploy to Production (Live Mode)  res.set('Retry-After', '3600');

  res.set('Cache-Control', 'no-store');

```powershell  res.status(503).send(`<!doctype html>

firebase deploy --only hosting:live --project nightdev4l  <meta charset="utf-8">

```  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>We’ll be back soon</title>

- Deploys the `public/` folder  <style>body{margin:0;background:#0b0b0b;color:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,Helvetica,sans-serif}main{max-width:720px;padding:24px;text-align:center}</style>

- Site returns status 200 for all pages  <main><h1>We’ll be back soon</h1><p>We’re performing maintenance and upgrading the site. Please check back shortly.</p></main>`);

- Normal user experience});

```

#### Enable Maintenance Mode on Production

Toggle: comment/remove the `**` rewrite to the function to disable maintenance, then `firebase deploy --only hosting`. Keep the function code deployed for future use.

```powershell

firebase deploy --only hosting:maintenance --project nightdev4l2) Fallback: keep the client-side overlay (already enabled in this repo). No server status change; simplest, but not as strong as a true 503.

```

Tip: If you need to preview safely, use a preview channel and enable the function rewrite only there before going live.

- Keeps the same `public/` folder deployed

- Hosting rewrites kick in: all routes except `/robots.txt` and `/sitemap.xml` go to the Cloud Function### Toggle with hosting targets (already configured)

- Site returns status 503 with `Retry-After: 3600`

- Search engines treat this as temporary downtimeThis repo is set up with two Hosting targets that both point to your single site `nightdev4l.web.app`:



#### Disable Maintenance Mode (Return to Live)- `hosting:live` – normal site (no 503)

- `hosting:maintenance` – routes all pages to `maintenance503` (returns 503 + Retry-After); still serves `/robots.txt` and `/sitemap.xml` directly

```powershell

firebase deploy --only hosting:live --project nightdev4lCommands:

```

Enable maintenance (first time also deploy the function):

- Removes the rewrites

- Site returns to normal 200 status```powershell

# From repo root

#### Preview Maintenance Mode (Safe Testing)firebase deploy --only functions:maintenance503

firebase deploy --only hosting:maintenance

```powershell```

firebase deploy --only hosting:nightdev4l-maint --project nightdev4l

```Disable maintenance (restore normal site):



- Deploys to https://nightdev4l-maint.web.app```powershell

- Does NOT affect productionfirebase deploy --only hosting:live

- Test the 503 page and verify behavior before enabling on production```



---Optional: preview on a channel first



## Differences: Live vs Maintenance```powershell

firebase hosting:channel:deploy maint-$(Get-Date -Format yyyyMMdd-HHmm) --only hosting:maintenance

| Aspect | Live Mode | Maintenance Mode |```

|--------|-----------|------------------|
| **Status Code** | 200 OK | 503 Service Unavailable |
| **Content Source** | Static files from `public/` | Cloud Function (HTML) |
| **robots.txt** | Served normally | Served normally |
| **sitemap.xml** | Served normally | Served normally |
| **User Experience** | Full site functionality | "We'll be back soon" message |
| **SEO Impact** | Normal indexing | Temporary—no de-indexing |
| **Headers** | Standard security headers | + `Retry-After: 3600` + `Cache-Control: no-store` |

---

## How Maintenance Mode Works (Backend)

1. User requests any page (e.g., `/index.html`, `/external links/about-me.html`)
2. Firebase Hosting checks rewrites in `firebase.json`
3. If the route is **NOT** `/robots.txt` or `/sitemap.xml`:
   - Hosting forwards the request to the Cloud Function `maintenance503`
4. Cloud Function returns:
   - HTTP status: 503
   - Header: `Retry-After: 3600` (1 hour)
   - Body: Minimal HTML maintenance page
5. Search engines see 503 and **do not remove pages from index**; they retry later

---

## SEO Best Practices

- **Keep maintenance windows short.** Prolonged 503 (days) may eventually hurt rankings.
- **Set realistic `Retry-After` values.** Default is 3600 seconds (1 hour). Adjust in `functions/index.js` if needed.
- **Do not modify `robots.txt` or `sitemap.xml` during maintenance.** Both files remain accessible to crawlers.
- **Avoid returning 200 with a maintenance page.** This can confuse search engines and lead to caching the maintenance page.

---

## Updating the Maintenance Function

Edit `functions/index.js`:

```js
const { onRequest } = require('firebase-functions/v2/https');

exports.maintenance503 = onRequest((req, res) => {
  res.setHeader('Retry-After', '3600'); // Adjust retry time here
  res.setHeader('Cache-Control', 'no-store');
  res.status(503)
    .set('Content-Type', 'text/html; charset=utf-8')
    .send(`<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>We'll be back soon</title>
<style>
  html,body{height:100%}
  body{margin:0;background:#0b0b0b;color:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,Helvetica,sans-serif}
  main{max-width:720px;padding:24px;text-align:center}
  h1{font-size:clamp(22px,4vw,36px);margin:0 0 8px;font-weight:700}
  p{font-size:clamp(14px,2.2vw,18px);opacity:.9;margin:0;line-height:1.6}
</style>
<main>
  <h1>We'll be back soon</h1>
  <p>We're performing maintenance and upgrading the site. Please check back shortly.</p>
</main>`);
});
```

After editing, redeploy:

```powershell
firebase deploy --only functions:maintenance503 --project nightdev4l
```

---

## Troubleshooting

### Issue: Preview site returns 200 instead of 503

**Cause:** Static files exist in the public directory and are served before rewrites apply.

**Solution:** Use `public-maintenance/` which contains only `robots.txt` and `sitemap.xml`. All other routes will fall through to the function.

### Issue: Changes not visible after deploy

**Cause:** Browser cache or CDN cache.

**Solution:** 
- Hard refresh (Ctrl+F5)
- Open in incognito/private window
- Check Network tab in DevTools for actual status code

### Issue: Function deploy fails with "missing required API"

**Cause:** First-time setup; Firebase needs to enable APIs.

**Solution:** Follow prompts to enable required APIs (Cloud Functions, Cloud Build, Artifact Registry). This is automatic during first deploy.

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy live site | `firebase deploy --only hosting:live --project nightdev4l` |
| Enable maintenance | `firebase deploy --only hosting:maintenance --project nightdev4l` |
| Disable maintenance | `firebase deploy --only hosting:live --project nightdev4l` |
| Preview maintenance | `firebase deploy --only hosting:nightdev4l-maint --project nightdev4l` |
| Update function | `firebase deploy --only functions:maintenance503 --project nightdev4l` |
| Deploy everything | `firebase deploy --project nightdev4l` |

---

## Notes

- Always test on the preview site (nightdev4l-maint) before enabling maintenance on production.
- The maintenance function is always deployed and ready; toggling maintenance is just a matter of switching hosting targets.
- No changes to `robots.txt`, `sitemap.xml`, or your actual site files are needed to enable/disable maintenance mode.
