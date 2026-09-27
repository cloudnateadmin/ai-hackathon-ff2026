# Future Food Forum 2026 × AI Hackathon (powered by Cloudnate) — website

```
site/
├── index.html           Main site: forum info, pillars, agenda, guide, hackathon, short one-screen registration form
├── qr.html              Full-screen venue QR poster (Cloudnate logo in the centre) + PNG download
├── config.js            ← the only file you normally edit
├── css/style.css
├── js/data.js           All event content (agenda, pillars, partners…) from the brochure & posters
├── js/app.js            Page behaviour + the 3-step registration form
├── js/qr-render.js      Branded QR renderer (error-correction level H)
├── assets/              Images cropped from the FF2026 brochure + cloudnate-mark.svg
│   └── logos/           Conference, organiser and partner logos (white, transparent PNG),
│                        exported from the vector artwork in the FF2026 brochure
└── apps-script/Code.gs  Google Sheets receiver
```

## 1. Connect the form to a Google Sheet (about 5 minutes)

1. Create a Google Sheet, for example "Cloudnate Hackathon Registrations".
2. Open **Extensions → Apps Script**, delete the sample code, and paste in `apps-script/Code.gs`.
   - Optional: set `NOTIFY_EMAIL` to get an email for every registration.
3. Click **Deploy → New deployment → Select type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorise it, then copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `config.js` as `SHEET_ENDPOINT`.

The script creates a `Registrations` tab with a header row the first time someone registers, then adds one row per registration.
Columns: timestamp, reference, role, full name, email, mobile, company, business type, the free-text answer (`details`, up to 5,000 characters),
and the optional extras (job title, country, team name/size, "where AI could help"), consent, newsletter, **source** (`venue-qr` or `website`), and page.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**. The URL stays the same.

Until `SHEET_ENDPOINT` is set, the form runs in **demo mode**: an orange notice appears under the form and nothing is saved.

## 2. Host the site

`site/` is a plain static folder with no build step. Any of these work:
- **Netlify Drop**: drag the `site` folder onto https://app.netlify.com/drop
- **GitHub Pages**: push `site/` to a repo and turn on Pages
- **Vercel**, **Cloudflare Pages**, **S3/CloudFront**, or your own web server

To preview locally, run `python -m http.server 8765` inside `site/`, then open http://localhost:8765

## 3. The venue QR code

Open `https://<your-domain>/qr.html` on the venue screen.
- Press **F** for fullscreen. Press **H** to hide or show the controls.
- **Download PNG** exports a 2000×2300 print-ready tile for standees, badges and table cards.
- The QR points to `index.html?src=venue-qr#register`, so every sign-up made through it is marked `venue-qr` in the Sheet.
- To encode a different address, such as a short link, set `PUBLIC_REGISTER_URL` in `config.js` or open `qr.html?url=https://…`.

The QR uses the highest error-correction level (H), so the Cloudnate logo in the centre doesn't stop it scanning.
Scanning was tested with OpenCV at sizes from 300 px to 1200 px.
**Always test-scan the final printed QR with a couple of phones before the event.**

## Editing content

- Agenda, pillars, experiences, guide and partners are all in `js/data.js`.
- The hackathon copy (challenge arenas, the "how it works" steps, and who should join) is in `index.html`
  (the `#hackathon` section) and `js/app.js` (`arenas`).
  The source material didn't include details such as prizes or exact hackathon hours. Add them there once they're confirmed.
- The countdown target is `EVENT_START` in `config.js`.
