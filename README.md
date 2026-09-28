# Kopi Runner

Kopi Runner is a mobile-first static web app for collecting and collating kopi, teh, and special drink orders for a team.

Paste a roster, tap a name, pick a drink, and generate a clean shareable summary for the coffee run without chasing messages across multiple chats.

## What It Does

- Organises kopi and teh options by common local drink families
- Accepts pasted name lists from chat messages, numbered lists, or comma-separated rosters
- Lets you add extra names one by one without replacing the saved roster
- Supports custom drink requests such as Milo Peng, Cham, or canned drinks
- Collates duplicate orders into a single tally with per-person quantities
- Generates a plain-text summary that can be copied straight into WhatsApp or Telegram
- Saves both roster and orders in `localStorage` so the session survives refreshes until you clear them

## Run

Open [index.html](./index.html) directly in a browser, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features

- Kopi and teh menu grouped into condensed milk, evaporated milk, and no-milk families
- Saved name list with newline or comma paste support, one-by-one additions, and tappable name chips
- Add orders with name, drink or special drink, quantity, and optional notes
- Live collated summary grouped by drink
- Copyable plain-text summary for sending to a group chat
- Local persistence with `localStorage` and a full clear-data reset

## Typical Flow

1. Paste the attendee list into `Name list` and save it.
2. Tap a person’s name or search it from the input.
3. Choose a standard drink or type a special drink.
4. Repeat until the list is complete.
5. Copy the collated summary and send it to the drink stall or group chat.

## Install on a phone

Share https://weijuinlee.github.io/kopirunner/.

- Supported Chromium browsers show **Install KopiRunner** once the browser makes its native installation prompt available.
- The installation card can be dismissed and stays hidden when running as an installed standalone app.
- After an initial online visit, the service worker saves the app shell for offline use. Orders and names continue to live in this browser’s local storage; installation does not sync data between browsers or devices.

PWA features require HTTPS or localhost. Relative manifest and asset URLs support the `/kopirunner/` GitHub Pages path and local serving. When changing shell assets, bump the cache version in `sw.js`; the app offers an Update and reload button, or the new version activates after existing app tabs close.

## Mobile experience

- Bottom navigation jumps to the crew, order form, orders, and summary.
- Large touch targets, safe-area spacing, compact header, and collapsible drink reference.
- Native sharing on supported phones, with Copy always available.
- Offline status and an explicit update action; saved orders survive updates.
- Confirmation before clearing a run, and feedback after adding an order.

Run the mobile behavior checks with `node --test tests/mobile.test.cjs`. Native installation and sharing should also be checked on Android and iPhone after deployment.

## Accessibility checks

Run `node --test tests/*.test.cjs` for behavior and declared-color contrast checks. The interface includes focusable section destinations, visible focus rings, labelled fields, persistent screen-reader status announcements, and focus recovery after removing an order.

Before release, check the rendered app at 320, 375, and 390 CSS pixels, with enlarged text and browser zoom. Verify there is no horizontal page scrolling, the bottom navigation does not obscure focused controls, and Share/Copy remain usable. Test keyboard navigation plus VoiceOver or TalkBack on a phone. Automated source-level checks do not replace these device checks.

## Publishing asset updates

After editing CSS, JavaScript, or HTML, run `python3 scripts/build-pwa.py` and then `node --test tests/*.test.cjs`. Commit the generated `assets/` files, `index.html`, and `sw.js` with the source changes. Content-versioned filenames prevent older iPhone browser or service-worker caches from supplying a different release’s CSS/JavaScript. The worker fetches its new shell with HTTP-cache reload enabled. Existing open apps keep the explicit Update and reload flow; saved names and orders are not cleared.
