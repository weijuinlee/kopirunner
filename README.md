# Kopi Runner

Kopi Runner is a mobile-first static web app for collecting and collating kopi, teh, and special drink orders for a team.

Paste a roster, tap a name, pick a drink, and generate a clean shareable summary for the coffee run without chasing messages across multiple chats.

## What It Does

- Organises kopi and teh options by common local drink families
- Accepts pasted name lists from chat messages, numbered lists, or comma-separated rosters
- Supports custom drink requests such as Milo Peng, Cham, or canned drinks
- Collates duplicate orders into a single tally with per-person quantities
- Generates a plain-text summary that can be copied straight into WhatsApp or Telegram
- Saves both roster and orders in `localStorage` so the session survives refreshes

## Run

Open [index.html](./index.html) directly in a browser, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features

- Kopi and teh menu grouped into condensed milk, evaporated milk, and no-milk families
- Saved name list with newline or comma paste support and tappable name chips
- Add orders with name, drink or special drink, quantity, and optional notes
- Live collated summary grouped by drink
- Copyable plain-text summary for sending to a group chat
- Local persistence with `localStorage`

## Typical Flow

1. Paste the attendee list into `Name list` and save it.
2. Tap a person’s name or search it from the input.
3. Choose a standard drink or type a special drink.
4. Repeat until the list is complete.
5. Copy the collated summary and send it to the drink stall or group chat.
