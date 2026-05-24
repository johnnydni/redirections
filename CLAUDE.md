# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static multi-page site for `ritmopadel.de`, deployed via GitHub Pages. Hub for the RITMO brand: a Padel Club / Facility Consulting offering, the team behind it, the brand DNA, and a link to the actual Padel app at `ritmopadel.app` (manual `<a href>` — no auto-redirect).

There is no build, no package manager, no dependencies, no test suite. Browsers load HTML files directly. To preview, open the file or serve the directory with any static server (e.g. `python -m http.server`).

## Architecture

- **`styles.css`** — single shared stylesheet for every page. All design tokens ("RITMO Bauhaus Dark": colors, type) live in `:root` CSS variables at the top. Change them there, not in individual rules. Every page links to this file via `<link rel="stylesheet" href="styles.css">`.
- **`index.html`** — landing page: hero + Launch Site summary + 3-up pillar cards (Team / DNA / App).
- **`launch.html`** — Launch Site detail: RITMO Padel Club (Community & Events) + RITMO Facility Consulting (Konzept / Bau / Betrieb). Includes gallery image placeholders.
- **`team.html`** — Team page. Built around a CSS-grid layout that auto-fills with however many member cards you give it. See "Editing the Team page" below.
- **`dna.html`** — Brand DNA: four principles (Takt / Form / Farbe / Haltung), color palette, geometry, application examples.
- **`impressum.html`** — Standalone Impressum (TMG-required, linked from every page's footer).
- **`404.html`** — served by GH Pages for unknown paths. Standalone styling (does **not** link `styles.css`) so it works even if CSS is missing.
- **`CNAME`** — binds the GH Pages deploy to `ritmopadel.de`. Do not delete or rename; the Pages custom-domain setting depends on it.

Each HTML page is self-contained for header/nav/footer markup (no templating engine) — duplicate the `<header>` and `<footer>` blocks across pages. Mark the current page in the nav with `aria-current="page"` so the orange underline highlights it.

Pushing to `main` triggers a GH Pages deploy within ~30s. There is no staging branch.

## Image placeholders

All pages use a `.imgph` placeholder pattern so visuals can be added without changing the layout:

```html
<div class="imgph imgph-4x5" data-label="Foto"></div>
```

Replace with a real image at the same spot — keep the same aspect-ratio class:

```html
<img class="imgph imgph-4x5" src="img/team/name.jpg" alt="Name">
```

Aspect-ratio modifiers: `imgph-1x1`, `imgph-4x3`, `imgph-3x4`, `imgph-4x5`, `imgph-16x9`, `imgph-21x9`. Color modifiers for the corner accent: `c-yellow`, `c-blue`, `c-red`, `c-circle`.

## Editing the Team page

`team.html` is structured around `<section class="team-section">` groups (Founders / Builders / Beirat). Inside each group, `<article class="member">` cards live in a `.member-grid` that auto-fills with `repeat(auto-fill, minmax(240px, 1fr))`.

- **Add a member**: copy the block marked `<!-- TEMPLATE START -->` … `<!-- TEMPLATE END -->` and adjust name, role, bio, photo.
- **Add a new group** (e.g. "Coaches"): duplicate a whole `<section class="team-section">` including its `<header class="section-head">`.
- **Empty state**: use `<div class="team-empty">Noch nicht öffentlich.</div>` instead of a grid when a section has no public members yet.

The grid handles wrap/responsiveness automatically — no need to touch CSS to add members.

## Editing the Impressum

`impressum.html` still contains the address inside `[…]` brackets (e.g. `[Ilie Felix J. Doni]`, `[Münchner Str.1]`, `[85045 Ingolstadt]`). These came in from the upstream main-branch update — if the brackets are unintentional, strip them. The `404.html` and all sub-pages link to `impressum.html` from their footer to satisfy the TMG reachability requirement.
