# MediTec Egypt – One-Page Website

Responsive, bilingual (English / Arabic with RTL) site for MediTec Egypt.
Built with pure HTML5, CSS3 and vanilla JavaScript – no build step required.

## Structure

```
index.html
css/style.css
js/main.js
README.md
```

## Run it

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Deploy by uploading the folder to any static host (Netlify, GitHub Pages, cPanel, etc.).

## Customize

- **Colors, fonts, spacing:** edit the CSS variables at the top of `css/style.css`.
- **Text / translations:** every translatable element has `data-en` and `data-ar` attributes. Update both the attributes and the default English text inside the tag.
- **Social links:** replace the Facebook and Instagram `href` values in the Contact section of `index.html` (they currently point to the platform home pages).
- **Address:** replace the "Egypt" placeholder in the Location item (update `data-en` and `data-ar`).
- **Images:** swap the Unsplash URLs in `index.html` (About image) and `css/style.css` (`.hero` background).
- **Contact form:** a validated form is already in `index.html` with the `hidden` attribute. Remove `hidden` and connect the `submit` handler in `js/main.js` to a backend or form service (e.g. Formspree).

## Features

- English default, Arabic toggle with `dir="rtl"`, saved in `localStorage`
- Fixed navbar with scroll shadow, active-section highlighting and 80px scroll offset
- Mobile hamburger menu (closes on link click, outside click or Esc)
- Fade-in / slide-up animations via Intersection Observer (respects reduced-motion settings)
- Semantic HTML, ARIA labels, keyboard focus states, skip link

## Production notes

- Minify `css/style.css` and `js/main.js` before deploying (e.g. with `cssnano` and `terser`).
- Consider hosting the hero image yourself and compressing it.
- Test on Chrome, Firefox, Safari and real mobile devices before launch.
