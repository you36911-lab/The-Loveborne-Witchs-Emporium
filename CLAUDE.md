# Project notes

- Always commit and push after making changes. No need to ask first.
- Push directly to `main`; don't make feature branches.

## The game
The Loveborne Witch's Emporium: a cozy witch-shop deduction game. Customers describe a need,
the player finds the right recipe in the books and makes it at the altar.

- `witch_spellbook_complete_catalogue.docx`: the design document (rules, books, customers,
  calendar, all 240 recipes). Source of truth for design.
- `ingredient_asset_tracker.xlsx`: data and planning sheets (ingredients, Ingredient Feel,
  Advice, Walk-in Plan, Learning Check, art asset status).
- `Altar Shop · Week One Prototype.html`: playable week-one prototype (single HTML file).

## Engine decision
The real game will be built with web technology (HTML/CSS/JavaScript) and packaged for
Steam/PC with Electron or Tauri. The designer knows HTML/CSS; keep code approachable.
