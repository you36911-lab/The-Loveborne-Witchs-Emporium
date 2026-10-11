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
- `Altar Shop · Week One Prototype.html`: playable prototype (single HTML file). It carries the full
  game data (all 240 recipes, 258 ingredients, the 99-day calendar) but play stops after Day 7;
  only week-one customers visit. Keep its data in sync with the spellbook and tracker.

## Engine decision
The real game will be built with web technology (HTML/CSS/JavaScript) and packaged for
Steam/PC with Electron or Tauri. The designer knows HTML/CSS; keep code approachable.
