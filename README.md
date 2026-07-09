# Cleanfellas CC — Website

Static marketing website for **[Cleanfellas CC](https://www.cleanfellas.co.za)** — specialist chemical deep cleaning and hygiene services, Benoni, Gauteng (est. 2004).

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AbdullahHassan176/Cleanfellas-Site)

Or manually:

1. Log in to [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project → GitHub**
3. Select **AbdullahHassan176/Cleanfellas-Site**
4. Netlify auto-detects `netlify.toml` — publish directory is already set to `website`
5. Click **Deploy site**

Every push to `main` triggers an automatic redeploy.

## Structure

```
netlify.toml        ← Netlify config (publish dir, cache headers, redirects)
website/            ← Everything that gets deployed
  index.html
  services.html
  gallery.html
  booking.html
  css/style.css
  js/main.js
  assets/           ← Logos, photos, brochure PDF
  README.md         ← Technical / developer docs
ai.md               ← AI assistant project guide
```

## Local Preview

```bash
python -m http.server 8321 --directory website
```

Open **http://localhost:8321**

## Developer Docs

See [`website/README.md`](website/README.md) for full detail on how the booking form works, how to update content, and how to publish to cPanel/FTP.
