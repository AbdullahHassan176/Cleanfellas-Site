# Cleanfellas CC — Project AI Guide

## Overview
Static marketing website for **Cleanfellas CC**, a specialist chemical deep cleaning and hygiene services company in Benoni, Gauteng, South Africa (est. 2004). 100% black female owned, B-BBEE registered.

## Tech Stack
- Pure static HTML / CSS / JS — no build step, no framework, no server required
- Served from the `website/` folder; any static host or `python -m http.server 8321 --directory website` works
- Target URL: `www.cleanfellas.co.za`

## Directory Structure
```
website/
  index.html          Home page (hero, services overview, about, clients, CTA)
  services.html       Full detail of all 6 service lines
  gallery.html        Before/during/after photo grid
  booking.html        Appointment request form (WhatsApp + email dispatch)
  css/style.css       Shared stylesheet (brand: navy #1d4e79, sky #a9dcf5)
  js/main.js          Shared JS: footer year, mobile nav, booking form logic
  assets/             Logos, hero photo, 6 gallery photos, PDF brochure
```

## Key Business Info (search-replace if it changes)
| Field | Value |
|---|---|
| Office phone | 011 845 4444 |
| Faye Khan mobile | 082 491 1234 |
| Email | cleanfellas@absamail.co.za |
| WhatsApp | 27824911234 (E.164, set in `js/main.js`) |
| Address | 105 Bon Accord Street, Benoni, 1501, South Africa |

## Services (6 total — match across index, services, booking dropdown, all footers)
1. Commercial Kitchen Deep Cleans (`#kitchens`)
2. School & Facility Deep Cleans (`#schools`)
3. Halaal & Kosher Deep Cleans (`#halaal`)
4. Thermal Fogging & Sanitising (`#fogging`)
5. Washroom & Bathroom Hygiene (`#washrooms`)
6. Carpets & Ultrasonic Cleaning (`#carpets`)

## Booking Form
No server. Form builds a text message and opens either:
- `https://wa.me/WHATSAPP_NUMBER?text=...` (WhatsApp)
- `mailto:BOOKING_EMAIL?subject=...&body=...` (email draft)

Customer presses send themselves. Upgrade path: Formspree (see README.md).

## Conventions
- All 4 pages share identical header/nav and footer HTML — keep them in sync
- Footer Services list must show all 6 services (was missing Carpets — now fixed)
- `booking.html` accepts `?service=...` query param to pre-select a service option
- Date field enforces `min = today` to block past dates
- Mobile nav closes on link click (handled in `main.js`)
- `og:image` set on all pages; gallery page uses `work-grill-after.jpg`

## Known Limitations / Upgrade Paths
- No lightbox on gallery (clicking images does nothing)
- No server-side form submission (Formspree upgrade documented in README)
- `og:image` paths are relative — use absolute URLs when hosted for proper social sharing
