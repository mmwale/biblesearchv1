# Bible Search 🔎📖

![build-badge](https://img.shields.io/badge/build-passing-brightgreen) ![license-badge](https://img.shields.io/badge/license-MIT-blue)

A fast, browser-based scripture search across multiple translations. All Bible data and study documents are bundled locally so the app runs offline and is easy to deploy.

---

## Key features ✅

- Local-only, client-side search across bundled translations (KJV, NKJV, NIV, ESV, ISV, ASV)
- Lightweight in-memory data store (no external API keys or network requests)
- Reader with verse highlighting, chapter navigation, and smooth scrolling
- Sticky header with auto-hide on scroll and a responsive search dropdown
- Downloadable study documents bundled in the repo
- Simple themeing via CSS variables for easy color customization

---

## Quick start (dev)

Open a terminal (Windows cmd):

```cmd
git clone <repo-url>
cd biblesearch
npm install
npm start
```

Then open http://localhost:3000 in your browser.

To create a production build:

```cmd
npm run build
```

---

## Where the data lives

All translations (JSON) and sample documents are in `src/Entities/`.
The app uses a tiny in-memory client (`src/api/base44Client.js`) which is populated on startup by `src/api/dataLoader.js`.

> Note: Because all data is local, there are no network calls or external dependencies for the content.

---

## Theming / Colors 🎨

The main theme variables are in `src/App.css` under the `:root` block. Update these variables and the dev server will pick up changes immediately:

```css
:root {
  --bg: #E8F8F5;        /* page background */
  --link: #0B8F82;      /* primary link / button color */
  --link-contrast: #fff;
  --link-hover: #086B61; /* hover color */
  --bg-shade: #DFF6F3;   /* card/section background */
  --muted: #4C6B63;      /* muted text */
}
```

If you prefer a different palette, swap these values for instant theme updates.

---

## Notes & Implementation Details ⚙️

- Search is performed by a simple substring match across the loaded verse text. To keep UI responsive we show only the first 100 results and display the exact total match count.
- The header auto-hides when scrolling down and reveals on scroll up (works with both page scroll and the search results' internal scroll).
- UI primitives are intentionally simple and easy to replace with a design system or component library later.

---

## Contributing

Contributions are welcome! Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description and tests (if relevant)

Please keep changes focused and small; large refactors are easier to review when split into multiple PRs.

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Your Name

---

If you'd like, I can also add badges, screenshots, or a short `CONTRIBUTING.md` template next. Which would you like me to add next? ✨
