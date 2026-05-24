# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page landing site for `ritmopadel.de`, deployed via GitHub Pages. Its purpose is to point visitors to the actual app at `ritmopadel.app` (manual `<a href>` button — no auto-redirect) and to display an Impressum (§ 5 TMG).

There is no build, no package manager, no dependencies, no test suite. Browsers load `index.html` directly. To preview, open the file or serve the directory with any static server (e.g. `python -m http.server`).

## Architecture

Three files do all the work; everything else is GitHub Pages plumbing:

- `index.html` — the landing page. All CSS is inlined in a single `<style>` block and all graphics are inline SVG, so the file is self-contained (no external fonts, images, or scripts). The "RITMO Bauhaus Dark" design tokens (colors, type) live in `:root` CSS variables near the top of that `<style>` block — change them there, not in individual rules.
- `404.html` — served by GH Pages for unknown paths; standalone styling, does not share CSS with `index.html`.
- `CNAME` — binds the GH Pages deploy to `ritmopadel.de`. Do not delete or rename; the Pages custom-domain setting depends on it.

Pushing to `main` triggers a GH Pages deploy within ~30s. There is no staging branch.

## Editing the Impressum

`index.html` contains legally-required Impressum placeholders in `[…]` brackets (e.g. `[Name / Firma]`, `[Straße + Hausnummer]`, `[PLZ + Ort]`, `[Vor- und Nachname]`) inside the `<section class="impressum">` block. These **must** be replaced with real operator data before the page is legally valid — if you see them still present, flag it rather than silently shipping.
