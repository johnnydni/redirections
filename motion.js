/* ─── RITMO Motion ─────────────────────────────────────────
   Shared client-side animations across every page.

   Uses Motion One (motion.dev) — the vanilla-JS sibling of
   Framer Motion, same author, same API for `animate` /
   `inView` / easing arrays. Loaded as an ES module from CDN
   so the site stays build-free.

   What this file does:
   1. Page-exit fade-out when the user clicks an internal link
   2. Scroll-triggered fade-in for sections below the fold
   3. Hamburger menu open/close with staggered item entrance
   4. Respects `prefers-reduced-motion`

   Drop-in: every page just adds
     <script type="module" src="motion.js"></script>
─────────────────────────────────────────────────────────── */

import { animate, inView } from 'https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = [0.2, 0.7, 0.2, 1];

/* ─── 1. Page-exit fade-out ───────────────────────────────
   Intercepts internal link clicks, fades the body to 0,
   then navigates. External / mailto / anchor / cmd-click
   all skip the animation and behave normally.            */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#')) return;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
  if (link.target === '_blank') return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  try {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
  } catch { return; }

  e.preventDefault();
  if (reduced) {
    window.location.href = link.href;
    return;
  }
  animate(document.body,
    { opacity: [1, 0] },
    { duration: 0.25, easing: 'ease-out' }
  ).finished.then(() => {
    window.location.href = link.href;
  });
});

/* ─── 2. Scroll-triggered fade-in ─────────────────────────
   Every section after the first one starts hidden and
   reveals when scrolled into view. We add the initial
   state via JS so the no-JS fallback shows content.    */
if (!reduced) {
  document.querySelectorAll('section.sect').forEach((section, i) => {
    if (i === 0) return; // first section already animates via CSS .fi
    section.style.opacity = '0';
    section.style.transform = 'translateY(28px)';
    inView(section, () => {
      animate(section,
        { opacity: 1, transform: 'translateY(0px)' },
        { duration: 0.7, easing: EASE }
      );
    }, { amount: 0.12 });
  });
}

/* ─── 3. Hamburger menu toggle ────────────────────────────
   Opens / closes the mobile nav with a staggered item
   entrance. Closes on link click, on ESC, and on outside
   click of the menu items.                              */
const burger = document.querySelector('.burger');
const navMobile = document.querySelector('.nav-mobile');

if (burger && navMobile) {
  const items = navMobile.querySelectorAll('a');

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    navMobile.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('nav-open', open);

    if (open && !reduced) {
      animate(navMobile,
        { opacity: [0, 1] },
        { duration: 0.2, easing: 'ease-out' }
      );
      animate(items,
        { opacity: [0, 1], transform: ['translateX(-16px)', 'translateX(0px)'] },
        { duration: 0.35, delay: (i) => 0.05 + i * 0.06, easing: EASE }
      );
    } else if (open && reduced) {
      // no animation, just show
      navMobile.style.opacity = '1';
      items.forEach(el => el.style.transform = 'translateX(0px)');
    }
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Close on item click (let exit-fade handle the navigation)
  items.forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setOpen(false);
      burger.focus();
    }
  });
}
