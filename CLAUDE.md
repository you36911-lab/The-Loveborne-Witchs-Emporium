# Project notes

- Always commit and push after making changes. No need to ask first.
- Push directly to `main`; don't make feature branches.

## The game

See `DESIGN_NOTES.md` for a short summary of every decision so far and the open items.

The Loveborne Witch's Emporium: a cozy witch-shop deduction game. Customers describe a need,
the player finds the right recipe in the books and makes it at the altar.

- `witch_spellbook_complete_catalogue.docx`: the design document (rules, books, customers,
  calendar, all 240 recipes). Source of truth for design.
- `ingredient_asset_tracker.xlsx`: data and planning sheets (ingredients, Ingredient Feel,
  Advice, Walk-in Plan, Learning Check, art asset status).
- The game itself (open `index.html` in a browser). It carries the full game data, but
  customers and dialogue exist for week one only, so play stops after `LAST_PLAYABLE_DAY`.
  Keep its data in sync with the spellbook and tracker.

## Code layout

- `index.html`: the page structure only.
- `css/style.css`: all styling.
- `js/config.js`: settings (save key, last playable day, dawn card timing) and every image path.
- `js/data/game-data.js`: items, recipes, calendar, books (generated from the design document).
- `js/data/story.js`: customer visits, post letters, auras, starting stock.
- `js/core.js`: save state, helpers, letters and post, calendar conditions.
- `js/crafting.js`: comparing the altar with a recipe; clue lines.
- `js/visitors.js`: who is at the counter.
- `js/scene.js`: rendering, the shop scene, hour backgrounds and the dawn card.
- `js/actions.js`: clicks, the bell, giving orders, the end of the day.
- `js/books.js`: the bookshelf, entries, blanks, word bank.
- `js/email.js`: Moonpost, the webmail on the computer (the story's letters, shown as email).
- `js/prototype.js`: prototype-only jump bar (week, day, hour, customer); off with `PROTOTYPE_TOOLS`.
- `js/main.js`: starts the game.

Scripts are plain (no modules) and load in the order listed in `index.html`, so the game
also runs by opening `index.html` directly, without a server. Images live in `assets/scene/`.

## Engine decision

The real game is built with web technology (HTML/CSS/JavaScript) and will be packaged for
Steam/PC with Electron or Tauri. The designer knows HTML/CSS; keep code approachable.
