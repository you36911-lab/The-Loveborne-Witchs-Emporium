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
- A customer simply waits while you make it, unless the order truly cannot be made during their visit; only then do they say which day they'll be back. There is no button to start an order.
- **Making and giving**: at the altar, **Make it** makes the order and slides the view back up to the counter, where it waits as a wrapped parcel (pink ribbon, a handwritten tag with the recipe name) between the till and the notebook. Clicking the parcel hands it over. Making again before giving replaces it; it goes if the customer leaves.
- "I don't know how to make this" needs a second tap.
- **Popups**: every popup (books, diary, email, receipts, the crystal ball, the end of the day, the new-email card, an open cupboard, a result at the counter) closes when you click outside it (or with Esc), so none of them has a Close or × button. Only the tutorial note keeps its ×, since it is not a popup. Clicking outside the end-of-day summary goes on to the next day, as its button does.
- No order brings 5 or more parts the player hasn't met yet (except the Day 6 Beaver Moon stretch goal).
- **Results**: a regular tells their own result on their next visit, on its own screen before the new request. A walk-in comes back themselves in the next quiet hour (or after two days, before the next customer) to say how it went, in their own voice and about the right person. A perfect order needs no report; the customer's passing hint is the thanks.
- **Advice seekers** ask a quick question ("which herb…?"). They fill quiet hours in week one.
- **Names**: walk-ins are only ever shown by what you see ("A couple holding hands"). A regular is shown the same way on their first visit ("An old woman") and says their own name in that first line; from then on their name is used.
- **Speech balloon**: what a customer says sits in a balloon over the right-hand window, its tail pointing back at them; who they are and what they do (the cue) are written above it, the buttons below.
- **Tutorials happen once**: the first order, the first order that can't be made while they wait, and the first advice question each get a numbered tutorial note during that visit only. Later visits carry no instructions, just what the customer says and the buttons. Each note has a × that puts it away for good, and a "Skip tutorials" link that turns them all off (the first-day email tip too). Jumping with the prototype bar counts every tutorial whose first visit comes earlier as seen.

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
- A book opens as a book: its closed cover first, which swings open by itself (or at a click) onto the open spread; then two pages at a time, one entry per page, the index first (over as many pages as it needs). Pages turn with an animation (arrows beside the book, or the arrow keys); the turning sheet bends like paper, its free edge lagging behind. A ribbon at the top of each entry page bookmarks it. The word bank sits beside the book.

## Letters

- 3 starting letters from "H." (Hester), plus **17 post letters** from places around the map, one or two hints each.
- Letters only point at **dead ends**: ingredients whose needed keyword is hidden, so a keyword search can't find them. They name the ingredient and the keyword, and carry a light thread to the order they help, but never say which order.
- In the game the letters arrive as **email**, read on the computer in **Moonpost**, a made-up webmail (Inbox, Archive, Notes; sender, subject, preview, date). The design document still calls them letters.
- An email arrives in a quiet hour with an envelope animation (Read it now / Later); unread emails show a badge on the computer.
- Emails can be archived and moved back to the inbox. Customer hints are copied automatically into "What customers told me" (the notebook on the counter, also the Notes folder).

## The counter screen

The game has two full-screen views:
- **The counter** (main): the shop picture fills the window. Day info top left, what the customer says in a box over the right-hand window, the mood line as a subtitle, and a **down arrow** at the bottom: the counter and the altar are like two floors, and the arrow slides the view down to the altar (an up arrow slides back).
- **The workroom** (down arrow): one picture (assets/scene/altar-room.jpg, the full 1376×768 version, two cabinets of doors and a pink-clothed table). It stands on the bottom of the window, so the table and the bar on its cloth are always visible on any screen; a wide window crops a little ceiling, then shows dark wall at the sides, no Kitchen/Altar/Cabinet split. Behind each of the 16 painted cupboard doors is one kind of ingredient, its name written in ink on the painted brass label (left cabinet: Herbs, Spices, Fruits, Pantry, Waters, Oils, Resins, Inks; right: Candles, Tarot, Crystals, Critters (animal gifts), Buttons, Threads, Wood, Findings). The bottom row of doors is hidden by the table and stays shut. Hovering a door eases it open a crack with pink light behind; clicking swings it open and its contents come out between the cabinets. A pink count on the label shows how many of its things are on the table. Empty bottles that can be filled right now are at the top of the Waters cupboard. The table is the altar: the candle stands at its left end, the card at its right, what is laid out in between; recipe choice and the buttons sit along its front edge. A test result shows between the cabinets; the shop log is in the bottom-left corner.

On the counter, every object glows on hover and does something:
- each book in the stack opens that book
- crystal ball: the current customer's aura and the colour key
- till: today's receipts on their own over the shop (no panel, no dimming); a click anywhere puts them away
- notebook: what customers told me (hints), as a handwritten diary: it opens straight onto its ruled pages (assets/books/diary-open.png, no cover), the notes written on the lines in Caveat, newest page first, turned like the other books; no tabs, search, bookmarks or word bank
- bell: the next customer
- computer: email (Moonpost), with the unread badge

## Art direction (agreed so far)

- Shop background as a clean plate (shelves, windows, door, table). Interactive objects (till, computer, bell, crystal ball, open book, door) are separate transparent PNG layers with hover glow.
- Window view as its own layer so it can change with hour, season and weather.
- Remove brand logos (the computer's Apple logo). Aim for 1920×1080 or larger.
- Interface look: clean and cozy. Cream panels with soft shadows (no glows), thin solid lines, rounded corners, deep plum text and one berry accent (main buttons, selected tabs, keywords); twilight-sky page with small stars, hearts around window titles. Fonts: Cormorant Garamond (serif) for titles, names and book entries; Nunito for reading text and, bolder, for buttons and labels; Great Vibes (script) only for the day card at dawn; Caveat for handwriting (the diary, the parcel tag); Courier Prime on receipts, which the till prints; IM Fell English for the ink on the cabinet labels. Dark mode is the same look at night.

## Glamour forms

The design document says a Glamour becomes "a cosmetic, mist or perfume". Each one is now fixed by its ingredients (for the art and the wording):
- **Pressed powder in a compact** (clay, pearl or shell powder, pressed with a liquid): #6 Venus in Bloom (peach-pink pearly blush), Starlit Siren (seashell shimmer highlighter), The Camera Loves You (pearl and gold highlighter).
- **Face mist in a spray bottle** (water base): The Artist's Entrance (gold-flecked mist), The Thousandth Version (iridescent setting mist, moth wing dust), The Ritual of Ordinary Things (morning pearl mist), The Glittering Entrance (gold body shimmer mist).
- **Oil in a dropper bottle** (sunflower oil base): Solstice Honey (golden body glow oil).
- **Perfume**: The Midas Muse (gold-shimmer perfume oil; oak moss and saffron), The Unpinned Mask (white lily floral water), The Casual Enchantment (mint and bergamot cologne splash).

## Open items

- Write Day 8+ dialogue for walk-ins, regulars and advice (order line, cue, aura, hint, four report lines each). Deferred: polishing the prototype comes first.
- Plain ink vs coloured inks: proposed renaming "Ink" to "Plain ink", making it a base only for drawn spells (Sigil, Rune), with "a coloured ink replaces plain ink". Not yet decided.
- Angelica root (first needed Day 47) is the one confusing dead end no letter covers; optional second hint on the Pippin Green letter (Day 44).
- The first customer's hint (the High Priestess) has no dotted keyword to collect; decide whether to add "intuition" to the line.
- #202 The Unconditional Pillow and #105 Permission to Be are easy to confuse; consider clearer naming or a "this isn't what they asked for" message.
- Gathering bottles (Dawn dew, Moonwater and so on): the scene no longer points them out. Plan: the tutorial teaches when each can be gathered, and bottle pictures in the scene become clickable to collect them. Until then the Waters cupboard shows a "Fill a bottle" button for each one that can be filled now.
- Quiet hours show a mood line as a film-style subtitle at the bottom of the scene. The background follows the hour only, not the weather, so a "grey" line can sit over a sunny window.
- Ingredient pictures: the current cut-outs were made automatically and some keep a faint outline. The designer will supply background-removed PNGs to replace them (same names in assets/items). Festival backgrounds (Beltane, Imbolc, Ostara, Yule) are still being edited; not in the game yet.
- Book art (assets/books): covers exist for Recipe Book, Book of Making, Grimoire of Craft, Almanac of Sky & Seasons and Tarot Companion. Herbiary, Crystal Almanac and Gentle Bestiary use a plain coloured cover and a drawn open spread until their pictures come (the designer will send them).
- Only use art whose file is named for what it shows, or that is certain. Unnamed generated images that would have to be matched by guesswork stay out until confirmed.
- Pictures in: the exhausted bookshop owner stands behind the counter (the other 17 walk-in pictures are unnamed files, left out until confirmed); the 22 tarot cards (assets/tarot) show in the Tarot Companion, the Cabinet and the altar's card slot; ingredient pictures now also show on their book pages. Not yet: Hester (three versions in the art folder), Sam Okafor. The Moon card's label reads "THE FOON" and needs fixing in the art. Two versions exist of The Devil and The World; the 768×1376 ones are used.
- Keeping it smooth as more art comes in: no blur effects (backdrop-filter) anywhere, since they are redrawn every frame; export pictures near the size they are shown (characters 1100px tall, items ~250px, cards ~420px wide); big pictures are decoded ahead of time.
- Later: split the prototype into a real web project.

## Birthstones

- "The customer's birthstone" (The Starbound Self, #131) is not a stone of its own: it is the crystal for the month the customer was born in, picked from the Crystals cupboard. January Garnet, February Amethyst, March Aquamarine, April Clear quartz (for diamond), May Jade (for emerald), June Pearl, July Carnelian (for ruby), August Peridot, September Lapis lazuli (for sapphire), October Moonstone (for opal), November Citrine, December Amazonite (for turquoise). The Crystal Almanac's birthstone page lists them.
- A visit that orders #131 gives its customer's month as `born: 'March'` and the dialogue should let the month slip (a birthday, a star sign). Without a month, any birthstone counts.
- Clues: someone else's birthstone gets "a birthstone, but not theirs"; a missing one gets "it needs their birthstone".
