# Cleanfellas CC Website

**Repository:** [AbdullahHassan176/Cleanfellas-Site](https://github.com/AbdullahHassan176/Cleanfellas-Site)

A fast, self-contained static website — no frameworks, no build step, no hosting fees beyond basic static hosting.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, services overview, about, why-choose-us, client list, calls to action |
| `services.html` | Detailed breakdown of all six service lines with booking links |
| `gallery.html` | Real before/during/after job photos |
| `booking.html` | Appointment request form (sends via WhatsApp or email) + full contact details |

Shared styling lives in `css/style.css`, shared behaviour in `js/main.js`, and all images/PDFs in `assets/`.

## Getting the Code

```bash
git clone https://github.com/AbdullahHassan176/Cleanfellas-Site.git
cd Cleanfellas-Site
```

## Previewing Locally

Any static server works. The simplest with Python (no install needed):

```bash
python -m http.server 8321 --directory website
```

Then open **http://localhost:8321** in your browser.

Or with Node.js:

```bash
npx serve website -p 8321
```

## How the Booking Wizard Works

Booking is a four-step wizard (service → site details → contact → review). The site has no
server, so the form doesn't "submit" anywhere by itself. Instead it pre-fills a message with all
the customer's details and opens either:

- **WhatsApp** — chat to `082 491 1234` (number set as `WHATSAPP_NUMBER` in `js/main.js`)
- **Email** — a draft to `cleanfellas@absamail.co.za` (set as `BOOKING_EMAIL` in `js/main.js`)

The customer presses send themselves, so bookings arrive as normal WhatsApp messages / emails.

### Built-in CRM features

Every booking message arrives in a structured format that includes:

- **Booking reference** (e.g. `CF-20260709-4821`) — quote it in follow-ups and use it to track
  leads in a spreadsheet or CRM.
- **Lead source** — if the customer arrived from an ad or social link tagged with
  `?utm_source=facebook&utm_campaign=winter-special`, the message says so; otherwise it shows
  the referring website or "Direct visit". Tag your ad/social links with UTM parameters to see
  which channels bring bookings.
- **Submission timestamp**, property type and urgency — so you can prioritise urgent leads.

Returning customers get their contact details pre-filled automatically (stored in their own
browser only), and after sending, customers can download a **calendar reminder (.ics)** for
their preferred date.

**Upgrade path:** for a form that submits silently without opening WhatsApp/email, sign up at
[formspree.io](https://formspree.io) (free tier available), then change the `<form>` tag in
`booking.html` to `action="https://formspree.io/f/YOUR_FORM_ID" method="POST"` and remove the
custom submit handler in `js/main.js`.

## Updating Content

- **Phone / email** — appear in the footer of every page, the booking sidebar, and `js/main.js`. There is no street address on the site. Search-and-replace the old value across the `website` folder. Booking mail goes to `cleanfellas@absamail.co.za`, then `abdullah.hassan@globalnext.rocks` only if that send fails.
- **Services** — cards on `index.html`, detail blocks on `services.html`, and the dropdown options in `booking.html`.
- **Photos** — drop new images into `assets/` and reference them from `gallery.html`.
- **Brochure** — replace `assets/cleanfellas-brochure.pdf` with the latest version (keep the same filename).

## Publishing / Deploying

Upload the contents of the `website` folder to any static host:

- **www.cleanfellas.co.za** — upload via cPanel File Manager or FTP
- **GitHub Pages** — go to repo Settings → Pages → set source to the `website` folder (or root if you move files there)
- **Netlify / Cloudflare Pages / Vercel** — connect this repo, set publish directory to `website`, and deploy automatically on every push

No server-side code is required.

## Making Changes

```bash
# Clone the repo (first time only)
git clone https://github.com/AbdullahHassan176/Cleanfellas-Site.git

# Edit files, then commit and push
git add .
git commit -m "describe what you changed"
git push
```
