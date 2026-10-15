# Design notes: The Loveborne Witch's Emporium

A short summary of the decisions made so far, so any Claude chat or session can pick up the context quickly.
The full detail lives in the files below; when they disagree with this page, the design document wins.

## Files

| File | What it holds |
|---|---|
| `witch_spellbook_complete_catalogue.docx` | The design document: rules, books, customers, calendar, letters, all 240 recipes. Source of truth. |
| `ingredient_asset_tracker.xlsx` | Data and planning sheets: Ingredients (with the Look art brief), Ingredient Feel, Advice, Walk-in Plan, Learning Check, Letters, art asset status. |
| `Altar Shop · Week One Prototype.html` | Playable prototype in one HTML file. Carries the full game data, but play stops after Day 7. |
| `CLAUDE.md` | Working rules: always commit and push to `main`; keep the prototype in sync with the doc and tracker. |

Engine: plain HTML/CSS/JavaScript, packaged for Steam with Electron or Tauri. The designer knows HTML/CSS, so code stays approachable.

## The game in one paragraph

A cozy witch-shop deduction game. Customers describe a need (never the recipe name) with a non-verbal cue in brackets and a coloured aura. The player works out the one right recipe from the books, lays it out at the altar (ingredients, candle, tarot card, the right day and hour) and gives it to them. Results come back later as stories and as stars on nightly receipts.

## Time and calendar

- One day is one session, split into four Magic Hours: Sunrise, Noon, Twilight, Nightfall.
- A moon cycle is **6 days** (New, Waxing Crescent, Waxing Gibbous, Full, Waning Gibbous, Waning Crescent; no quarter moons). A year is 72 days.
- The game runs **Day 1 to Day 75**, Samhain to Samhain. Named full moons fall on Days 6, 12, … 72 (Beaver Moon first). Sabbats: Samhain 1–3 and 73–75, Yule 10–12, Imbolc 19–21, Ostara 27–29, Beltane 37–39, Litha 46–48, Lughnasadh 55–57, Mabon 64–66.
- Time never moves by itself. The four hours still exist underneath (recipes and bottles use them) but are not labelled; the light in the shop shows the hour.
- The **bell** brings the next customer: it moves time to the next hour with a customer, a letter or a bottle to fill, and closes the night at Nightfall. While someone is at the counter it only shakes.
- Quiet hours show a mood line at the top of the scene, and a Fill button when a bottle can be filled.
- Over the year: 19 quiet hours with no customer or letter, left as breathing room. Week one has none.

## Customers and orders

- Regulars (Hester, Edmund, Dottie, Goldie, Rosalind, Morwenna, Felix, Ivy, Noor, Sam) have story arcs. Walk-ins order every other recipe exactly once over the year.
- Every order has exactly one right recipe; a different recipe fails.
- Week-one orders always say what kind of thing they want (a charm, something to spread on toast = butter, something to look into = hand mirror, and so on).
- A customer waits ("Start making it") unless the order truly cannot be made during their visit; only then do they say which day they'll be back.
- "I don't know how to make this" appears only after Start making it, and needs a second tap.
- No order brings 5 or more parts the player hasn't met yet (except the Day 6 Beaver Moon stretch goal).
- **Results**: a regular tells their own result on their next visit, on its own screen before the new request. A walk-in comes back themselves in the next quiet hour (or after two days, before the next customer) to say how it went, in their own voice and about the right person. A perfect order needs no report; the customer's passing hint is the thanks.
- **Advice seekers** ask a quick question ("which herb…?"); a dashed note says it's just a question. They fill quiet hours in week one.

## Grading and feedback

- Grades (Perfect, Good, Clumsy, Failed) are internal; the player sees stars on receipts. Rating = average of the last 20, counted at closing.
- Test crafts are unlimited; every 5th imperfect one adds a 1-star review. A perfect test says so plainly ("Done") and writes the recipe into the Recipe Book.
- Test-craft feedback: an **Overall** count of things off, then an **Ingredients** count ("2 ingredients are off: 1 wrong, 1 missing"), then one plain line per problem.
  - Lines name the **shelf**, never the wrong ingredient ("The one from Herbs & flowers: the cleansing is right, but it works on the heart. This needs one that works on the home.").
  - A missing ingredient is described by its shelf and **look** ("Picture it: green, jagged and a little hairy").
  - A theme is only called missing if nothing in the mix brings it.
  - A wrong or missing card gets the right card's blended feel, without naming keywords ("feels like a still mind that knows what is real without being told").
- Bottled waters: test crafts use no stock; giving an order uses one bottle of each water. One bottle per kind per day while its condition holds. Morwenna leaves a bottle of Sea Water on every visit. Supply is checked for the whole year.

## Books and words

- Nine books, each opening on an index; one entry per page; up to 5 coloured bookmarks; search on the index only.
- Each entry shows a fixed "slightly hard" choice of keywords; the rest are blanks. Recipe numbers are hidden.
- Nothing goes into the word bank automatically: dotted words in any text are tapped to collect. A word leaves the bank once every blank that needs it is filled.
- Every ingredient and tarot card has a short **look** shown where its picture will go (also the art brief).

## Letters

- 3 starting letters from "H." (Hester), plus **17 post letters** from places around the map, one or two hints each.
- Letters only point at **dead ends**: ingredients whose needed keyword is hidden, so a keyword search can't find them. They name the ingredient and the keyword, and carry a light thread to the order they help, but never say which order.
- A letter arrives in a quiet hour with an envelope animation (Read it now / Later); unread letters show a badge on the computer.
- Letters can be archived and taken out again. Customer hints are copied automatically into "What customers told me" (the notebook on the counter, also in the letter archive).

## The counter screen

The shop scene is the main screen. Every object glows on hover and does something:
- each book in the stack opens that book
- crystal ball: the current customer's aura and the colour key
- till: today's receipts
- notebook: what customers told me (hints)
- bell: the next customer
- computer: letters, with the unread badge

## Art direction (agreed so far)

- Shop background as a clean plate (shelves, windows, door, table). Interactive objects (till, computer, bell, crystal ball, open book, door) are separate transparent PNG layers with hover glow.
- Window view as its own layer so it can change with hour, season and weather.
- Remove brand logos (the computer's Apple logo). Aim for 1920×1080 or larger.

## Open items

- Write Day 8+ dialogue for walk-ins, regulars and advice (order line, cue, aura, hint, four report lines each). Deferred: polishing the prototype comes first.
- Plain ink vs coloured inks: proposed renaming "Ink" to "Plain ink", making it a base only for drawn spells (Sigil, Rune), with "a coloured ink replaces plain ink". Not yet decided.
- Angelica root (first needed Day 47) is the one confusing dead end no letter covers; optional second hint on the Pippin Green letter (Day 44).
- The first customer's hint (the High Priestess) has no dotted keyword to collect; decide whether to add "intuition" to the line.
- #202 The Unconditional Pillow and #105 Permission to Be are easy to confuse; consider clearer naming or a "this isn't what they asked for" message.
- Later: split the prototype into a real web project.
