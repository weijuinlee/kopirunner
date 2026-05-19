# Kopi Runner

Simple static web app to capture and collate kopi and teh drink orders.

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
