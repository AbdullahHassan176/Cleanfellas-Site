# Cleanfellas CC — Project AI Guide

## Overview
Static marketing website for **Cleanfellas CC**, a specialist chemical deep cleaning and hygiene services company in Benoni, Gauteng, South Africa (est. 2004). 100% black female owned, B-BBEE Level 1 registered.

## Tech Stack
- Pure static HTML / CSS / JS — no build step, no framework
- Served from `website/`; local preview: `python -m http.server 8321 --directory website`
- Netlify serverless function at `netlify/functions/send-booking.js` handles booking emails via Resend API
- Target URL: `www.cleanfellas.co.za`

## Directory Structure
```
website/
  index.html          Home page (hero, 7-card services overview, about, clients, ESG, CTA)
  services.html       Full service detail blocks (7 services)
  gallery.html        Before/during/after photo grid with lightbox
  booking.html        4-step booking wizard (WhatsApp + silent email via Netlify function)
  css/style.css       Shared stylesheet (brand: navy #1d4e79, sky #a9dcf5, sky-soft #eaf5fc)
  js/main.js          Shared JS: nav, booking wizard, ICS download, CRM localStorage
  assets/             Logos, service photos, gallery photos, ESG photos, brochure PDF
netlify/
  functions/send-booking.js   Resend email handler (notification + auto-reply)
netlify.toml          Netlify config: publish dir, functions dir, cache headers, redirects
```

## Key Business Info
| Field | Value |
|---|---|
| Phone | 082 491 1234 (Faye Khan) — no landline |
| Email | cleanfellas@absamail.co.za |
| Booking fallback | abdullah.hassan@globalnext.rocks — only if the primary booking email fails. Not shown on the site |
| WhatsApp | 27824911234 (E.164, set in `js/main.js` as `WHATSAPP_NUMBER`) |
| Address | Do not publish a street address |
| Booking email | `BOOKING_EMAIL` in `main.js`; fallback is `FALLBACK_EMAIL` |

## Services (7 — must match across index, services, booking wizard, all footers)
1. Commercial Kitchen Deep Cleans (`#kitchens`) — ultrasonic of cutlery/bain-maries included
2. School, Facility & Abattoir Deep Cleans (`#schools`) — includes abattoirs & butcheries
3. Halaal & Kosher Deep Cleans (`#halaal`) — ultrasonic included, SANHA & NIHT certified
4. Washroom & Bathroom Hygiene (`#washrooms`)
5. Carpets & Ultrasonic Cleaning (`#carpets`)
6. Hygiene Equipment Installation & Servicing (`#hygiene-equipment`) — dispensers, refill contracts
7. Residential Cleaning (`#residential`) — post-construction, new premises, mold add-on

**No pricing on site** — all services require a free site survey and quote. No figures, no "from R…", no "per m²" language anywhere.

## Booking Form
4-step wizard: Service → Site details → Contact → Review & Send.
On submit (step 4):
- **WhatsApp path** — builds pre-filled `wa.me` URL, opens in new tab
- **Email path** — POSTs to `/.netlify/functions/send-booking`. Resend notifies `cleanfellas@absamail.co.za`, then `abdullah.hassan@globalnext.rocks` if that send fails, plus an auto-reply to the customer. If the function cannot deliver, the browser opens a mailto to the fallback address. If the function cannot be reached, the mailto goes to the primary address |

`booking.html` accepts `?service=VALUE` query param to pre-select a service card.
Env var required on Netlify: `RESEND_API_KEY`.

## Conventions
- All 4 pages share identical header/nav and footer HTML — keep them in sync
- Footer Services list must match all 7 services (with correct anchor IDs)
- No pricing, cost or rate language anywhere on the site
- `og:image` set on all pages (relative paths — use absolute URLs when live for proper social sharing)
- `booking.html` property chips include: Home, Restaurant/Kitchen, School, Office, Factory/Warehouse, Retail, Abattoir/Butcher, Healthcare, Other
- Mobile nav auto-closes on link click (handled in `main.js`)

## Netlify Deployment
See `README.md` for one-click deploy button. Set `RESEND_API_KEY` in Netlify → Site Settings → Environment Variables.

## Further Reference
- `website/README.md` — developer docs, local preview, publishing guide
