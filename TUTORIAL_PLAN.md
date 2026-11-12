# Tutorial plan

Built in `js/tutorial.js` (2026-11-08). Agreed: what is taught and in what order, how it is shown, no "Skip tutorials",
and a replay (a new game after one that got past Day 2) has no tutorial. Saving is not mentioned: a small save icon shows instead.

Changes after the designer's playtest (2026-11-11):
- Emails: H.'s three oldest first, then the apothecary's; the email that is open can always be read and its words tapped. The word bank is taught in her second email (her first no longer has the aura P.S.).
- The star is bigger, with a breathing golden halo.
- First order: a step on the recipe's themes ("Everything that goes in carries one of those"); each ingredient is given one theme of its own (Chamomile comfort, Blue thread calm, Small key opportunity).
- After the first sale (lesson sale1): the till and its receipt, then her review on My Shop and its P.S. (reviews now come in as customers leave). The Day 2 reviews lesson is gone.
- Hester's test: the result on the phone is shown part by part (the grade, the ingredients right, what is off under each heading).
- The nurse: once her recipe is open, its themes and how they lead to the ingredients, then Hester's note "What goes in".

Changes made while building it:
- The first order is shown whole (decided 2026-11-08): the star goes to the right recipe in the index, its name, then
  each ingredient blank and the right name in its list, with why it fits ("Herb or flower: Chamomile, for calm and
  comfort."). "Next time I'll work it out from the books myself."
- Hester's note on the crystal ball uses the design document's aura meanings, all ten colours (and bright pink, embarrassment).
- Hester's notes are taped onto the notebook's first page as paper slips, to read again; after the first, the tutorial
  points to the notebook and then to the slip (it moves on once the slip has been looked at), then to the right-hand page:
  something has to be written there before the notebook can be closed.
- The mark is a small pink star on the thing (chosen over a glow, a spotlight and hand-drawn marks). A step blocks every other
  click until it is done.
- The closing thought after a lesson is used for the first order only.

## How it is shown

Three tools, no numbered instruction boxes.

1. **The shopkeeper's own thoughts**, as the subtitle at the bottom (the mood line's style, in italics). Her narration
   never says "you". One short line at a time; it stays until the step is done, then the next one floats in.
2. **A circle drawn by hand round the next thing to click**, in the books' handwriting ink (dark plum, with a pale halo so it
   reads on the dark shop), drawn in with the pen as it appears, a little uneven, its end passing its start. Nothing else is
   dimmed or blocked: the player can still click around; the thought and the circle simply wait.
3. **Hester's handwritten notes** for rules worth keeping (what the aura colours mean, how test crafts work). A small
   paper note in her hand (Caveat), shown once in the middle of the screen; it closes on a click outside, like every
   popup. Each one is also kept in the notebook, so it can be read again.

A step is done when the player does the thing, never by a "Next" button. If the player does something out of order
(opens a book before ringing), the tutorial waits and picks up from where they are.

## Day 1 · Saturday · Samhain

### Before opening (Sunrise)

| Step | Glow on | Thought (subtitle) | Done when |
|---|---|---|---|
| 1 | the computer (new-email badge) | *The computer's chiming. Post, before I've even opened.* | Moonpost is open |
| 2 | H.'s oldest email (the bottom of the inbox) | *Three from H., from before I came. The oldest first.* | it is open |
| 2b | a dotted word in its body (joy, in her P.S.) | *A word with dots under it… worth keeping. Tapped, it goes into my word bank, by the books.* | a word is collected |
| 2c | her other two, bottom up, then the apothecary's | *She kept this shop before me. Best read all she left.* / *And the one that just came, from the apothecary.* | all read |
| 3 | (Hester's note pops up: the aura colours, see below) | | closed |
| 4 | the shop bell | *Right. Time to open the door. The bell calls the next one in.* | the bell is rung |

**Hester's note: the crystal ball** (new text, from what the first letter and the game already say):
> The crystal ball shows what they don't say. Blue: they need calm. Gold: luck and plenty. Pink: the heart.
> Grey: they are worn out. Watch it, dear; people rarely ask for what they need. — H.

(Exact colours and meanings to be checked against `X.auras` and the design document before writing it in.)

### The first order (Noon · a first-year student · The Path of Least Fuss, a charm)

The core loop, one step at a time.

| Step | Glow on | Thought | Done when |
|---|---|---|---|
| 1 | the balloon, then the crystal ball | *A charm for her pocket… and the ball's pale blue. She's worried, then.* | a click, once the words have finished |
| 2 | the books | *The Recipe Book will have it. Charms, things for an easier day.* | the Recipe Book is open |
| 3 | the index | *The index first: what kind of thing she asked for.* | a charm page is open |
| 4 | the recipe name | *That's the one. I'll mark it, so I know what I'm making.* | the recipe is chosen (tick) |
| 5 | the little bell on the page | *The little bell lays it all out downstairs.* | it is laid out |
| 6 | the arrow down | *Down to the workroom.* | the view is at the altar |
| 7 | the silver bell on the altar | *Everything's on the table. Ring, and it's made.* | it is made |
| 8 | the parcel on the counter | *Wrapped and waiting. Hand it over.* | it is given |

Afterwards, one closing thought: *One done. Her shoulders came down a little as she left.*

Dotted words: the first time a dotted word shows in the balloon or a book, one thought: *That word… worth keeping.*
Tapping it collects it (taught fully on Day 2, see below).

### Hester (Twilight · The Language of Ravens, a rune)

Hester teaches test crafts herself, in her own balloon, before her order:
> "Before you start, dear: you needn't guess. Lay it out from the book and test it first. The little bottle on the
> page. It costs nothing but a candle if it's wrong."

| Step | Glow on | Thought | Done when |
|---|---|---|---|
| 1 | the bottle (test craft) on her recipe's page | *Test it first, she said. The little bottle.* | a test craft is made |
| 2 | the phone on the altar | *The phone. That's where a test tells me how it went.* | the phone is open |
| 3 | (Hester's note: test crafts) | | closed |
| 4 | the silver bell, once the test is perfect | *Perfect. Now for real.* | it is made and given |

**Hester's note: test crafts**
> A test shows you what's missing, shelf by shelf. Try again and it tells you more. But each wrong test puts out a
> black candle; five out, and the street complains. — H.

If her first test is perfect, the candle part is taught later, the first time a test is not (see "When it first happens").

### The night-shift nurse (Nightfall)

Nothing new. One thought as she comes in: *On my own this time.*

### Closing (after Nightfall)

| Glow on | Thought | Done when |
|---|---|---|
| the till | *The till's printing. The day's receipts, and what they thought of it.* | the receipts are read |

## Day 2 · Sunday

| When | Glow on | Thought | Done when |
|---|---|---|---|
| Sunrise, opening | the computer | *Reviews came in overnight. And a little something extra at the bottom of each.* | My Shop is open |
| | a review's P.S. | *She let something slip. Things like that end up mattering.* | read |
| Noon, the young poet (first advice) | the balloon | *She only wants to know which herb. Nothing to make.* | words finished |
| | the Herbiary | *The Herbiary. Love, for the mind, and strong.* | the right page is open |
| | the name box | *Then I'll tell her its name.* | answered |
| A walk-in comes back with how it went | | *Back to tell me how it went. Good.* | they leave |

The word bank, taught where it first matters (most likely Day 2):

| Glow on | Thought | Done when |
|---|---|---|
| a dotted word | *That word again. I'll keep it.* | collected |
| the word bank, then a blank in a book | *A gap in the page… and I have just the word for it.* | a blank is filled |

## When it first happens (any day)

Taught once, the first time the situation comes up, not on a set day.

| Situation | Thought / note |
|---|---|
| The first imperfect test | A candle goes out; glow on the candelabra. *One candle out. Five and the neighbours will smell it.* |
| The first recipe that needs a day or an hour | *It wants a particular hour. The light in the shop shows which it is.* |
| The first full moon (Day 6) | Glow on the Almanac. *Full tonight. The Almanac knows which moon it is.* |
| The first email after Day 1 | Glow on the computer (no thought; the chime says it). |
| The notebook, first time it has something new | *Hester's notes are kept in my notebook.* |

Hester's lesson ends like the first order: once her rune is made, *Made. Up to the counter with it.* (star on the spell), then *Hand it over.* (star on the parcel); the "Fill in what's missing" thought goes as soon as it is made.

Bookmarks: the first time a book is open on an entry after Hester's lesson (usually while making the nurse's tea), *A page I'll want again. The ribbon at the top keeps my place.* (star on the ribbon), then straight away *There it is, beside the book: a tap there brings me straight back. And the same ribbon takes it out again.* (star on the same ribbon), done when it is taken out.

A thought that is only read (no thing to do) waits for a click anywhere, marked with a small blinking ›; none moves on by itself. After the first sale, the star goes to the shop bell for the next customer (Hester); the nurse is rung for unguided.

## Open questions

1. The aura colours: settled. They follow the design document (all ten, with its meanings); Hester's note lists them all.
2. The closing thought: settled, first order only.
3. Hester teaches test crafts in her own balloon. Her current line already says "So you're the new keeper…"; the test
   craft advice would follow it. Check that this fits her voice.
