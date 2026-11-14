# South of Somewhere — website

Static site. No build step, no dependencies. `index.html` is the whole page; `img/`, `vid/`, `brand/` hold its media.

## Deploy with git (for Suki)

1. Create an empty GitHub repo, e.g. `southofsomewhere-site` (private is fine).
2. In this folder run:
   ```
   git init
   git add .
   git commit -m "South of Somewhere site v1"
   git branch -M main
   git remote add origin https://github.com/<account>/southofsomewhere-site.git
   git push -u origin main
   ```
3. Connect the repo to a static host. Recommended: **Cloudflare Pages** (free).
   - Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   - Framework preset: **None**. Build command: **leave empty**. Build output directory: **/** (root).
   - Deploy. You get a `*.pages.dev` preview URL.
4. Custom domain: Pages project → Custom domains → add `southofsomewhere.studio` (and `www`). Follow the DNS steps it shows.
   Alternatives that work the same way: Netlify (publish directory `/`, no build) or GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/root`).
5. Every later change: edit, `git commit`, `git push` — the host redeploys automatically.

## After the first deploy (one-time)
- **Contact form** sends through FormSubmit to `admin@southofsomewhere.studio`. Send one test message from the LIVE site. FormSubmit emails admin@ an activation link — click it once. After that, every message lands in that inbox.
- Check the three footer icons open Instagram, LinkedIn and X.

## If the domain changes (.studio → .com)
Search `index.html` for `southofsomewhere.studio` and replace (footer, contact email, form address). Do NOT change the Instagram link (that handle really is `southofsomewhere.studio`).

## What's where
| Part | File |
| --- | --- |
| Hero scroll film (6 stills) | `img/01,02,05,06,07,08_*_16x9.webp` + `_9x16` for phones |
| Statics | `img/still_offer_4x5.webp`, `img/still_kv_4x5.webp` |
| Films | `vid/film_myaicademy_16x9.mp4` |
| Motion | `vid/motion_oil_9x16.mp4` |
| Remix | `img/05_stay_window_*` |
| Logo / favicon | `brand/mark.png`, `brand/lockup.png` |
| Share image | `img/og_1200x630.jpg` |

Fonts (Louisville II, Benedict) are embedded inside `index.html`; Poppins and JetBrains Mono load from Google Fonts.
