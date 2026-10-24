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
- **No weather and no daily moon phase** (removed: too complicated for what they gave). A year is 72 days. What is left of the sky is calendar days, like the festivals: a **full moon every sixth day**, each with its own name, and a few **sky events** (Clear starry night, Shooting stars, Rainbow, Lunar Eclipse, Blue Moon).
- The game runs **Day 1 to Day 75**, Samhain to Samhain. Full moons fall on Days 6, 12, … 72 (Beaver Moon first); a recipe can ask for any full moon ("Full Moon") or one by name. Clear starry nights are Days 6, 30, 36, 42, 48, 54, 57, 58, 60, 66 and 72 (Nightfall only). Sabbats: Samhain 1–3 and 73–75, Yule 10–12, Imbolc 19–21, Ostara 27–29, Beltane 37–39, Litha 46–48, Lughnasadh 55–57, Mabon 64–66.
- Time never moves by itself. The four hours still exist underneath (recipes use them) but are not labelled; the light in the shop shows the hour.
- The **bell** brings the next customer, and nobody comes in without it: someone due this hour comes straight in; otherwise it moves time to the next hour with a customer (who then comes in) or a letter, and closes the night at Nightfall. While someone is at the counter it only shakes; a customer lingering over their hint leaves when it rings. (A prototype jump rings it for you.)
- Quiet hours show a mood line at the top of the scene.
- Over the year: 19 quiet hours with no customer or letter, left as breathing room. Week one has none.

## Customers and orders

- Regulars (Hester, Edmund, Dottie, Goldie, Rosalind, Morwenna, Felix, Ivy, Noor, Sam) have story arcs. Walk-ins order every other recipe exactly once over the year.
- Every order has exactly one right recipe; a different recipe fails.
- Week-one orders always say what kind of thing they want (a charm, something to spread on toast = butter, something to look into = hand mirror, and so on).
- **Every order is made while the customer waits.** Nobody says they'll come back for it: each visit is placed on a day and hour when its recipe can be made (week one: Edmund comes at Nightfall, Goldie on Wednesday at Noon, and Wayfarer's Ward is now Full Moon · Nightfall, Morwenna's night). There is no button to start an order.
- **Making and giving**: at the altar, **Make it** makes the order and slides the view back up to the counter, where it waits as a wrapped parcel (pink ribbon, a handwritten tag with the recipe name) between the till and the notebook. Clicking the parcel hands it over.
- **Cupboards**: an open cupboard shows its things large enough to tell apart (42% of the room wide, 72% for the tarot cards), and always starts below the ceiling. Its things stand against the cupboard's own wooden back (assets/scene/cabinet-back.jpg, the middle of the designer's cupboard picture, upscaled), with no shelf planks drawn, framed by the cupboard picture's own wooden edges, with no title and nothing between the frame and the back. Bottled waters show how many are left as a pink badge on the bottle's shoulder, like the unread count on the computer. Things with a picture show no name label (the picture says what it is; hovering shows the name); only things without a picture yet are labelled. The same on the table. Making again before giving replaces it; it goes if the customer leaves.
- "I don't know how to make this" needs a second tap.
- **Popups**: every popup (books, diary, email, receipts, the end of the day, the new-email card, an open cupboard, a result at the counter) sits in the middle of the screen and closes when you click outside it (or with Esc), so none of them has a Close or × button. Only the tutorial note keeps its ×, since it is not a popup. Clicking outside the end-of-day summary goes on to the next day, as its button does.
- No order brings 5 or more parts the player hasn't met yet (except the Day 6 Beaver Moon stretch goal).
- **Results**: a regular tells their own result on their next visit, on its own screen before the new request. A walk-in comes back themselves in the next quiet hour (or after two days, before the next customer) to say how it went, in their own voice and about the right person. A perfect order needs no report; the customer's passing hint is the thanks. They stay at the counter to say it in their own balloon, and leave at the next click elsewhere or when the bell is rung (the next customer waits until then).
- **Advice seekers** ask a quick question ("which herb…?"). They fill quiet hours in week one.
- **Names**: nobody at the counter is labelled, walk-in or regular. Who they are comes out in what they say and do; a regular says their own name in their first line. (The receipts and the diary still note who it was.)
- **Speech balloon**: everything a customer says and does sits in one balloon just right of their face, its tail pointing at them: the cue in brackets first, then their words. The buttons sit below it. When someone new speaks, the balloon floats up and fades in, after the customer's picture has faded in (1.2s, then a half-second pause; the balloon takes 0.8s); the mood line at the bottom floats in the same way. The altar's reminder reads "They asked: …".
- **Tutorials happen once**: the first order and the first advice question each get a numbered tutorial note during that visit only. Later visits carry no instructions, just what the customer says and the buttons. Each note has a × that puts it away for good, and a "Skip tutorials" link that turns them all off (the first-day email tip too). Jumping with the prototype bar counts every tutorial whose first visit comes earlier as seen.

## Grading and feedback

- Grades (Perfect, Good, Clumsy, Failed) are internal; the player sees stars on receipts. Rating = average of the last 20, counted at closing.
- Test crafts are unlimited; every 5th imperfect one adds a 1-star review. A perfect test says so plainly ("Done") and writes the recipe into the Recipe Book.
- Test-craft feedback: an **Overall** count of things off, then an **Ingredients** count ("2 ingredients are off: 1 wrong, 1 missing"), then one plain line per problem.
  - Lines name the **shelf**, never the wrong ingredient ("The one from Herbs & flowers: the cleansing is right, but it works on the heart. This needs one that works on the home.").
  - A missing ingredient is described by its shelf and **look** ("Picture it: green, jagged and a little hairy").
  - A theme is only called missing if nothing in the mix brings it.
  - A wrong or missing card gets the right card's blended feel, without naming keywords ("feels like a still mind that knows what is real without being told").
- Waters (Moonwater, Rainwater, Snow Water and the rest) are ordinary ingredients, always on the shelf; nothing is gathered. Only Sea Water is counted: Morwenna leaves a bottle on every visit, giving an order uses one, test crafts use none.

## Books and words

- Nine books, each opening on an index; one entry per page; up to 5 coloured bookmarks; search on the index only.
- Each entry shows a fixed "slightly hard" choice of keywords; the rest are blanks. Recipe numbers are hidden.
- Nothing goes into the word bank automatically: dotted words in any text are tapped to collect. A word leaves the bank once every blank that needs it is filled.
- Every ingredient and tarot card has a short **look** shown where its picture will go (also the art brief).
- A book opens as a book: its closed cover first, which swings open by itself (or at a click) onto the open spread; then two pages at a time, one entry per page, the index first (over as many pages as it needs). Pages turn with an animation (arrows beside the book, or the arrow keys); the turning sheet bends like paper, its free edge lagging behind. The cover is a board with some thickness (its edge shows as it swings). Fur covers (Recipe Book, Gentle Bestiary) have a solid core in the fur's colour behind the fur, so the pages never show through the gaps between the fur tips. A ribbon at the top of each entry page bookmarks it. The word bank sits beside the book.

## Letters

- 3 starting letters from "H." (Hester), plus **17 post letters** from places around the map, one or two hints each.
- Letters only point at **dead ends**: ingredients whose needed keyword is hidden, so a keyword search can't find them. They name the ingredient and the keyword, and carry a light thread to the order they help, but never say which order.
- In the game the letters arrive as **email**, read on the computer in **Moonpost**, a made-up webmail (Inbox, Archive, Notes; sender, subject, preview, date). The design document still calls them letters.
- An email arrives in a quiet hour with an envelope animation (Read it now / Later); unread emails show a badge on the computer.
- Emails can be archived and moved back to the inbox. Customer hints are copied automatically into "What customers told me" (the notebook on the counter, also the Notes folder).

## The counter screen

The game has two full-screen views:
- **The counter** (main): the shop picture fills the window. Day info top left, what the customer says in a box over the right-hand window, the mood line as a subtitle, and a **down arrow** at the bottom: the counter and the altar are like two floors, and the arrow slides the view down to the altar (an up arrow slides back).
- **The workroom** (down arrow): one picture (assets/scene/altar-room.jpg, 2752×1536, two cabinets of doors and a pink-clothed table). It stands on the bottom of the window, so the table and the bar on its cloth are always visible on any screen; a wide window crops a little ceiling, then shows dark wall at the sides, no Kitchen/Altar/Cabinet split. Behind each of the 16 painted cupboard doors is one kind of ingredient, its name written in ink on the painted brass label (left cabinet: Herbs, Spices, Fruits, Pantry, Waters, Oils, Resins, Inks; right: Candles, Tarot, Crystals, Critters (animal gifts), Buttons, Threads, Wood, Findings). The bottom row of doors is hidden by the table and stays shut. Hovering a door eases it open a crack with pink light behind; clicking swings it open and its contents come out between the cabinets. Its label has a soft, wide pink glow while any of its things are on the table. Empty bottles that can be filled right now are at the top of the Waters cupboard. The table is the altar: the same stack of books as on the counter stands at its left end (click a book to open it), then the candle stand, always there (the designer's cut-out, assets/candles/candle-stand.png; click it empty to open the Candles cupboard), with the chosen candle standing in its cup behind the front lip (the designer's candle pictures, assets/candles, one per colour; the Candles cupboard shows them too), what is laid out in the middle (the ingredients float a little above the cloth, bobbing gently and a little out of step, their shadows on the cloth; still when the player has reduced motion), and the tarot card lies flat and wholly on the cloth, in the smooth patch between the two folds on the right, its far edge leaning towards the middle of the room as a flat card would; recipe choice and the buttons sit along its front edge. A test result shows between the cabinets.

On the counter, every object glows on hover and does something:
- each book in the stack opens that book
- crystal ball: glows with the current customer's aura. It is not a button; Hester's first letter (P.S.) says what each colour means.
- till: today's receipts on their own over the shop (no panel, no dimming); a click anywhere puts them away
- notebook: what customers told me (hints), as a handwritten diary: it opens straight onto its ruled pages (assets/books/diary-open.png, no cover), the notes written on the lines in Caveat, newest page first, turned like the other books; no tabs, search, bookmarks or word bank
- bell: the next customer
- computer: email (Moonpost), with the unread badge

## Art direction (agreed so far)

- Shop background as a clean plate (shelves, windows, door, table). Interactive objects (till, computer, bell, crystal ball, open book, door) are separate transparent PNG layers with hover glow.
- Window view as its own layer so it can change with hour and season.
- Remove brand logos (the computer's Apple logo). Aim for 1920×1080 or larger.
- Interface look: clean and cozy. Cream panels with soft shadows (no glows), thin solid lines, rounded corners, deep plum text and one berry accent (main buttons, selected tabs, keywords); twilight-sky page with small stars, hearts around window titles. Fonts: Cormorant Garamond (serif) for titles, names and book entries; Nunito for reading text and, bolder, for buttons and labels; Great Vibes (script) only for the day card at dawn; Caveat for handwriting (the diary, the parcel tag); Courier Prime on receipts, which the till prints; IM Fell English for the ink on the cabinet labels. Dark mode is the same look at night.

## Glamour forms

The design document says a Glamour becomes "a cosmetic, mist or perfume". Each one is now fixed by its ingredients (for the art and the wording):
- **Pressed powder in a compact** (clay, pearl or shell powder, pressed with a liquid): #6 Venus in Bloom (peach-pink pearly blush), Starlit Siren (seashell shimmer highlighter), The Camera Loves You (pearl and gold highlighter).
- **Face mist in a spray bottle** (water base): The Artist's Entrance (gold-flecked mist), The Thousandth Version (iridescent setting mist, moth wing dust), The Ritual of Ordinary Things (morning pearl mist), The Glittering Entrance (gold body shimmer mist).
- **Oil in a dropper bottle** (sunflower oil base): Solstice Honey (golden body glow oil).
- **Perfume**: The Midas Muse (gold-shimmer perfume oil; oak moss and saffron), The Unpinned Mask (white lily floral water), The Casual Enchantment (mint and bergamot cologne splash).

## Open items

- Day 8+ regular visits still follow the old plan, where 42 orders are collected later ("Later today" or "By Day X" in the design document's schedule). Each needs moving to a day and hour when its recipe can be made, so the customer can wait for it.
- Write Day 8+ dialogue for walk-ins, regulars and advice (order line, cue, aura, hint, four report lines each). Deferred: polishing the prototype comes first.
- Redo the tutorial properly (the designer finds the current numbered notes weak). Hints were taken off the screen so the tutorial alone teaches them: ring the bell to call each customer (nobody comes in otherwise), open a cupboard in the workroom and pick what to lay on the table, and click the computer when a new email comes in (the "A new email came in" line was taken off the screen for this).
- Plain ink vs coloured inks: proposed renaming "Ink" to "Plain ink", making it a base only for drawn spells (Sigil, Rune), with "a coloured ink replaces plain ink". Not yet decided.
- Angelica root (first needed Day 47) is the one confusing dead end no letter covers; optional second hint on the Pippin Green letter (Day 44).
- The first customer's hint (the High Priestess) has no dotted keyword to collect; decide whether to add "intuition" to the line.
- #202 The Unconditional Pillow and #105 Permission to Be are easy to confuse; consider clearer naming or a "this isn't what they asked for" message.
- Quiet hours show a mood line as a film-style subtitle at the bottom of the scene. The background follows the hour.
- Weather is gone, but some Day 8+ text still points at it (not in the game yet): passing hints about storms for brainstorming, a busker who plays when it is windy, laundry spells on windy days; the walk-in line "A thunderstorm is forecast and she has an essay due"; "Moonwater, New Moon (letter)" in the Learning Check. Rewrite when that dialogue is written. The Walk-in Plan was also built around weather days, so its order of teaching may want a second look.
- Ingredient pictures: the current cut-outs were made automatically and some keep a faint outline. The designer will supply background-removed PNGs to replace them (same names in assets/items). Festival backgrounds (Beltane, Imbolc, Ostara, Yule) are still being edited; not in the game yet.
- Book art (assets/books): every book uses the designer's own cut-out cover and open spread (Downloads/Game/books, "-Photoroom" covers and "_open" spreads), upscaled and sized to what the book view needs: covers 1400px tall, spreads 2000px wide. A book's pictures are decoded before its cover swings, so the swing is never skipped while a big picture loads; switching books snaps the cover shut instead of swinging it back. The closed cover has no hover glow, since it opens by itself.
- Only use art whose file is named for what it shows, or that is certain. Unnamed generated images that would have to be matched by guesswork stay out until confirmed.
- Rosalind Larkin has two pictures (the designer's cut-outs): on her own, and with her children (a toddler on her hip, a girl at her sleeve). A visit can name its own picture with "pic" in story.js; her Day 5 visit, where she brings the children, uses the second.
- Pictures in: the exhausted bookshop owner stands behind the counter (the other 17 walk-in pictures are unnamed files, left out until confirmed); the 22 tarot cards (assets/tarot) show in the Tarot Companion, the Cabinet and the altar's card slot; ingredient pictures now also show on their book pages. Not yet: Hester (three versions in the art folder), Sam Okafor. The Moon card's label reads "THE FOON" and needs fixing in the art. Two versions exist of The Devil and The World; the 768×1376 ones are used.
- Workroom on a window wider than its picture: the walls carry on past the edges, using side strips built from the same room drawn empty (the designer's picture, upscaled 2×): it is enlarged step by step around its vanishing point, so each panel is the next one in, seamless at the edge (assets/scene/altar-wall-left.jpg and -right.jpg). (Mirroring made the wall fold into a corner; repeating one panel did not line up.)
- Receipt: the designer's five-line slip with paper texture (assets/scene/receipt.jpg, upscaled 2× to 972×1288, paper in the email's ivory #FFF9F4; shown 330px wide): the recipe name with its type in brackets ("The Moonlit Appointment (Witch's Ladder)"), then the customer's name, then the stars, and the day and hour on the last line. A sale too long for one ruled line (about 27 letters) goes onto two, its (Type) on the second, and the rest move down a line.
- Walk-ins (extras) get names, so their receipts can name them. Waiting for the designer's walk-in pictures before naming them all.
- Every other picture (ingredients, tarot cards, characters, book covers and spreads, counter objects) was upscaled the same way: characters 1.5× (about 1650px tall), everything else 2×, so they stay sharp on 1440p, 4K and high-density screens. The pictures now take about 214MB.
- Shop and workroom backgrounds were generated at 1376×768 and upscaled 2× to 2752×1536 with Real-ESRGAN (the general x4plus model, which keeps the wood grain; the anime model smooths it away), then saved as JPEG at quality 88.
- Keeping it smooth as more art comes in: no blur effects (backdrop-filter) anywhere, since they are redrawn every frame; export new pictures at about the sizes now used (characters ~1650px tall, items ~600px, cards ~840px wide); big pictures are decoded ahead of time.
- Later: split the prototype into a real web project.

## Birthstones

- "The customer's birthstone" (The Starbound Self, #131) is not a stone of its own: it is the crystal for the month the customer was born in, picked from the Crystals cupboard. January Garnet, February Amethyst, March Aquamarine, April Clear quartz (for diamond), May Jade (for emerald), June Pearl, July Carnelian (for ruby), August Peridot, September Lapis lazuli (for sapphire), October Moonstone (for opal), November Citrine, December Amazonite (for turquoise). The Crystal Almanac's birthstone page lists them.
- A visit that orders #131 gives its customer's month as `born: 'March'` and the dialogue should let the month slip (a birthday, a star sign). Without a month, any birthstone counts.
- Clues: someone else's birthstone gets "a birthstone, but not theirs"; a missing one gets "it needs their birthstone".
