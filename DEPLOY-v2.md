# Springview Pharmacy v2, Deploy Guide

This build ships as a folder (not flat) because the concierge runs on a Netlify Function, which needs a Git deploy.

## Files in this zip
- `index.html` : customer site (home, shop, product, rx, health, story, savings, book, contact, privacy)
- `shop.js` : catalog engine (91 SKUs), cart, PDP, story flipbook, deals, forms, guided tour (20 stops), animation controller
- `admin.html` : staff console (dashboard, inventory, reorder, orders, vouchers, marketing)
- `mobile-qa.html` : open this in a browser to auto-check mobile layout at four phone sizes (see "Mobile QA" below)
- `netlify/functions/concierge.js` : secure Claude proxy for Galaxy (the AI assistant)
- `netlify.toml` : publish dir + `/api/concierge` redirect
- `exterior.jpg`, `storefront.jpg`, `interior-2.jpg`, `uncle.jpg` : real photos
- Product images `p-<dept>-NN.jpg` are NOT bundled yet. Cards fall back to a clean pictogram until Ben drops the generated images in at the folder root. Filenames map 1:1 to SKU IDs (see below).

## What's animated (this build)
- Home: layered hero entrance, brass "& Surgical" shimmer, ambient sign-glow behind the storefront, staggered quick-action pills, scroll-reveal on every major block, brass section underlines.
- Galaxy assistant: cosmic FAB with orbiting-glow ring and a one-time attention nudge; twinkling starfield avatar in the panel header; messages animate in. Named "Galaxy" everywhere, including the AI system prompt.
- WhatsApp: pulsing ring bubble with a one-time tooltip; hides itself while the Galaxy panel is open so they never collide.
- All motion respects `prefers-reduced-motion` (fully disabled for users who ask for less motion).

## Mobile QA
Open `mobile-qa.html` from the deployed site (`your-site.netlify.app/mobile-qa.html`). It loads the real site in four phone-sized frames (320, 375, 390, 412px) and auto-checks: no horizontal overflow, Galaxy and WhatsApp FABs don't overlap and stay on-screen, tap targets are big enough, and the header fits. A manual eyeball checklist is printed alongside. Re-run after any change.

## Deploy (GitHub + Netlify)
1. Create a GitHub repo and push this folder, preserving structure.
2. Netlify: New site from Git, connect the repo. Build command: none. Publish dir: `.`
3. Netlify > Site settings > Environment variables: add `ANTHROPIC_API_KEY` = Ben's key. This powers the concierge.
4. Deploy.

## Domain
- Point `springviewpharmacy.com` at the Netlify site (owner action; DNS access needed).
- `support@springviewpharmacy.com` mailbox does not exist yet. The Contact page links it and labels it "mailbox pending." Create the mailbox before go-live (owner action).

## Admin login
- The console is password-gated (SHA-256, hash only in source). Password is provided to Ben separately, never written in this doc. Rotate it before any real data exists.

## Product image filename map
Each SKU expects `p-<dept>-NN.jpg` at the folder root, e.g. `p-otc-01.jpg`, `p-dme-11.jpg`. Departments: otc, cold, dme, vit, baby, skin, diab, oral, home. Numbering restarts per department. Any missing image shows a pictogram instead of breaking.

## Agent-verified deploy checklist (run in fresh incognito, hard refresh)
1. Delete any stale Springview zips/folders locally first; confirm the Netlify deploy timestamp is minutes-fresh before testing.
2. Language gate appears over the exterior photo; pick a language.
3. Sign intro plays once, is skippable, and does NOT re-lock on return (returning-visitor path).
4. Header shows cart icon; nav routes work; theme toggle persists across reload.
5. Shop: filters (availability, department) and sort change the grid; item count updates.
6. Click a product: PDP loads with breadcrumb, zoom (click image, lightbox opens), quantity stepper, Add to Cart, related items. Scroll down: sticky mini-header appears.
7. Cart: add items, badge counts, drawer opens, +/- and remove work, subtotal correct, checkout shows the Phase-2 honesty banner. Reload the page; cart is still there.
8. Rx: refill and transfer forms show the demo confirmation, nothing is submitted.
9. Health, Savings, Story (flipbook flips + Back), Contact (map + hours "pending"), Privacy (4 languages) all render.
10. Book: Cal.com calendar loads (live).
11. Galaxy assistant: opens, replies via `/api/concierge`, introduces itself as "Galaxy," medical question routes to the pharmacist line. Cosmic avatar shows in FAB and header.
12. Guided tour: launcher bottom-left, 20 stops, spotlight tracks each element, Back button works, progress bar advances, final stop teaches restart.
13. WhatsApp bubble: bottom-right above Galaxy, opens wa.me chat; disappears while Galaxy panel is open.
14. Mobile: open `mobile-qa.html`; every frame reports PASS. Then hand-test on a real phone in each of EN / ES / HT / FR.
15. Repeat 2-4 in each of EN / ES / HT / FR.
16. Admin: sign in, all six tabs render, restock updates inventory + alerts + reorder, approve-all works, CSV and Word export download, voucher slider 5-50% updates the preview and code.

Stop and report PASS/FAIL per line rather than self-fixing during verification.
