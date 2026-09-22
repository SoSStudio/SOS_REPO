# South of Somewhere — website (final pass)

Plain HTML / CSS / JS. No build step. Push to git and deploy as static files (Hostinger via git works as is).

```
index.html  work.html  offers.html  contact.html
assets/
  css/styles.css     colours, type and spacing tokens are at the top
  js/main.js         nav, showreel, hover previews, lightbox, offers sub-nav, contact form
  fonts/             self-hosted fonts + licences
  img/               logo (SVG), stills, favicon, share image
  video/             web-optimised films + short hover loops
```
Preview: `python3 -m http.server` in this folder.

## Look
- One canvas: `#e9e6de` (the logo's own canvas, so nothing ever sits in a box). Ink `#090909`, text `#282727`. Dark appears only where the footage itself is dark.
- Logos are vectors with transparent backgrounds (`logo-lockup.svg` in the footer, `logo-mark.svg` in the header), traced from the supplied artwork.
- Fonts (chosen in the playground): Amatic SC for headlines (caps, ×0.78 size), Zeyada for the script, Lora for reading text at 16.5px. All open licence, self-hosted, licences in `assets/fonts/`.
  Licensed brand fonts later: drop the files in `assets/fonts/` and uncomment the two `@font-face` blocks at the top of `styles.css` (the stacks already list them first).

## Media is never cropped
Every film thumbnail takes its shape from its own ratio (`--ar`), and the lightbox reads `data-ratio`, so vertical films play as vertical.
To add or swap a film, edit its `.thumb` button:

| Attribute | Meaning |
|---|---|
| `data-video` | file in `assets/video/`, or a YouTube / Vimeo link |
| `data-ratio` | the film's shape, e.g. `16 / 9` or `9 / 16` |
| `data-preview` | optional muted 4–5 s loop for hover (keep under 1 MB) |
| `style="--ar:…"` + the `img` | the still — same shape as `data-ratio` |

Films in the folder: `penguin.mp4` (home showreel, 2.39:1), `myai.mp4`, `brand-mv.mp4` (9:16), `velocity.mp4`, plus `myai-loop.mp4` / `brand-mv-loop.mp4` hover previews.
The Velocity still is the brand design board (3:2) while its film is 1.75:1 — that's why the still's shape (`--ar` on the button) and the film's shape (`data-ratio`) are set separately.
The original 166 MB `.mov` masters are not in this folder — keep them elsewhere.

## Contact form
Wired for Formspree. Create a form and paste its URL into `data-endpoint` in `contact.html`. Until then "Send inquiry" opens the visitor's email app with everything filled in.

## Layout notes
Hero: one-line banner headline that always spans the full width, with the film directly below it. Home and Work share one balanced composition: a tall film beside a stack of wide ones.

## Motion
One calm entrance on the home hero. The showreel plays only while visible and is a still frame for visitors who prefer reduced motion. The native cursor and native scrolling are never modified.

## Font playground (working tool, not part of the site)
`fonts.html` previews any Google Font (or an uploaded .ttf/.otf/.woff2) on the real site styles, live. It is `noindex` and not linked from the nav, but delete it before launch if you'd rather not publish it.
