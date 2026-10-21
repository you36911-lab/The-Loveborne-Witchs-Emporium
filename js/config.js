/* Settings you may want to change. Everything else reads from here. */

/* Where the game is saved in the browser. Changing this starts everyone from a fresh save. */
const SAVE_KEY = 'loveborne-emporium-save-v1';
/* Saves from the old single-file prototype; picked up once so progress isn't lost. */
const OLD_SAVE_KEYS = ['altar-shop-proto-v9'];

/* Customers and dialogue exist for week one so far. Raise this as more days are written. */
const LAST_PLAYABLE_DAY = 7;

/* Prototype controls under the title bar: jump to any week, day, hour or customer. Set to false to hide them. */
const PROTOTYPE_TOOLS = true;

/* How long the dawn card ("Day 2, Sunday") stays before the morning light comes in, in ms. */
const DAWN_MS = 1800;

/* Image files. Paths are relative to index.html. */
/* Bottles and jars (waters, oils, butters and waxes) stand on cabinet shelves, all drawn this wide in pixels,
   so a tall bottle stands taller than a squat jar. */
const SHELF_BOTTLE_WIDTH = 84;
const SHELF_CATEGORIES = ['Base waters', 'Oils, butters & waxes'];
const ASSETS = {
  backgrounds: {
    Dawn:      'assets/scene/bg-dawn.jpg',       /* before the shop opens */
    Sunrise:   'assets/scene/bg-sunrise.jpg',    /* morning */
    Noon:      'assets/scene/bg-noon.jpg',       /* day */
    Twilight:  'assets/scene/bg-twilight.jpg',   /* evening */
    Nightfall: 'assets/scene/bg-nightfall.jpg'   /* night, no moon */
  },
  /* The workroom below the counter: shelves either side (Kitchen left, Cabinet right) and the altar table in front. */
  altarRoom: 'assets/scene/altar-room.jpg',
  logo: 'assets/scene/logo.png',  /* the shop's winged heart: the tab icon, the top bar, the day card at dawn */
  receipt: 'assets/scene/receipt.jpg',  /* the printed slip; receipts are written on it */
  objects: {
    'crystal-ball': 'assets/scene/crystal-ball.png',
    'till':         'assets/scene/till.png',
    'notebook':     'assets/scene/notebook.png',
    'bell':         'assets/scene/bell.png',
    'computer':     'assets/scene/computer.png',
    'book-recipe-book':            'assets/scene/book-recipe-book.png',
    'book-book-of-making':         'assets/scene/book-book-of-making.png',
    'book-grimoire-of-craft':      'assets/scene/book-grimoire-of-craft.png',
    'book-almanac-of-sky-seasons': 'assets/scene/book-almanac-of-sky-seasons.png',
    'book-tarot-companion':        'assets/scene/book-tarot-companion.png',
    'book-gentle-bestiary':        'assets/scene/book-gentle-bestiary.png',
    'book-crystal-almanac':        'assets/scene/book-crystal-almanac.png',
    'book-herbiary':               'assets/scene/book-herbiary.png'
  },
  /* Each book: its closed cover, the open spread, and the colour of its paper (for the page that turns).
     `page` is where the paper sits inside the spread, in % of its size: top, outer edge, bottom.
     A book with no cover picture yet gets a plain cover in `color` with its title in `ink`;
     with no open picture (`open:''`), the spread is drawn: boards in `color`, pages in `paper`. */
  books: {
    'Recipe Book':              {cover:'assets/books/recipe-book-cover.png',            open:'assets/books/recipe-book-open.png',            paper:'#F3F6E5', page:[4.4,6,5.3]},
    'Book of Making':           {cover:'assets/books/book-of-making-cover.png',         open:'assets/books/book-of-making-open.png',         paper:'#F9F7E6', page:[1.5,3.8,3]},
    'Grimoire of Craft':        {cover:'assets/books/grimoire-of-craft-cover.png',      open:'assets/books/grimoire-of-craft-open.png',      paper:'#F3E5CA', page:[1.5,3.9,3]},
    'Almanac of Sky & Seasons': {cover:'assets/books/almanac-of-sky-seasons-cover.png', open:'assets/books/almanac-of-sky-seasons-open.png', paper:'#F3F5E7', page:[1.5,3.8,3]},
    'Tarot Companion':          {cover:'assets/books/tarot-companion-cover.png',        open:'assets/books/tarot-companion-open.png',        paper:'#F4F5E5', page:[1.5,3.8,3]},
    'Herbiary':                 {cover:'', color:'#5B3A26', ink:'#E9C77B',               open:'', paper:'#EFE8CD', page:[1.5,4,3]},
    'Crystal Almanac':          {cover:'', color:'linear-gradient(135deg,#F4F1FA,#DCE9F5 40%,#F6DDEB 75%,#E6F3EC)', ink:'#6B5A86', open:'', paper:'#F0F4E1', page:[1.5,3.8,3]},
    'Gentle Bestiary':          {cover:'', color:'#D8C29A', ink:'#5A3E22',               open:'', paper:'#F5F7E9', page:[1.5,3.8,3]}
  },
  /* Customers who stand behind the counter, by the name used in story.js.
     Anyone not listed here (most walk-ins, Hester, Sam Okafor for now) is not drawn. */
  characters: {
    'Dottie Plum':               'assets/characters/dottie-plum.png',
    'Edmund Thorne':             'assets/characters/edmund-thorne.png',
    'Felix Marlow':              'assets/characters/felix-marlow.png',
    'Ivy Delacroix':             'assets/characters/ivy-delacroix.png',
    'Marigold "Goldie" Ashby':   'assets/characters/marigold-ashby.png',
    'Morwenna Hale':             'assets/characters/morwenna-hale.png',
    'Noor Haddad':               'assets/characters/noor-haddad.png',
    'Rosalind Larkin':           'assets/characters/rosalind-larkin.png',
    /* walk-ins, by how story.js names them (only pictures whose file was named for the person) */
    'An exhausted bookshop owner':            'assets/characters/exhausted-bookshop-owner.png',
    'A couple holding hands':                 'assets/characters/couple-holding-hands.png',
    'A night-shift nurse':                    'assets/characters/night-shift-nurse.png',
    'A woman with smudged mascara':           'assets/characters/woman-with-smudged-mascara.png',
    'A drowsy night-bus driver':              'assets/characters/drowsy-night-bus-driver.png',
    'A novelist with a blank page':           'assets/characters/novelist-with-a-blank-page.png',
    'A nervous witness':                      'assets/characters/nervous-witness.png',
    'A first-time homeowner':                 'assets/characters/first-time-homeowner.png',
    'A worried allotment keeper':             'assets/characters/worried-allotment-keeper.png',
    'A bored teenager':                       'assets/characters/bored-teenager.png',
    'A shy young man':                        'assets/characters/shy-young-man.png',
    'A mother with a school bag':             'assets/characters/mother-with-a-school-bag.png',
    'A father with a pushchair':              'assets/characters/father-with-a-pushchair.png',
    'An aspiring influencer':                 'assets/characters/aspiring-influencer.png',
    'A learner driver':                       'assets/characters/learner-driver.png',
    'A woman who keeps dating the same man':  'assets/characters/woman-who-keeps-dating-the-same-man.png',
    'A young poet':                           'assets/characters/young-poet.png',
    'A first-year student':                   'assets/characters/first-year-student.png'
  },
  /* Tarot cards (Major Arcana), by name: shown in the Tarot Companion, the Cabinet and the altar's card slot. */
  tarot: {
    "The Fool":           "assets/tarot/the-fool.png",
    "The Magician":       "assets/tarot/the-magician.png",
    "The High Priestess": "assets/tarot/the-high-priestess.png",
    "The Empress":        "assets/tarot/the-empress.png",
    "The Emperor":        "assets/tarot/the-emperor.png",
    "The Hierophant":     "assets/tarot/the-hierophant.png",
    "The Lovers":         "assets/tarot/the-lovers.png",
    "The Chariot":        "assets/tarot/the-chariot.png",
    "Strength":           "assets/tarot/strength.png",
    "The Hermit":         "assets/tarot/the-hermit.png",
    "Wheel of Fortune":   "assets/tarot/wheel-of-fortune.png",
    "Justice":            "assets/tarot/justice.png",
    "The Hanged Man":     "assets/tarot/the-hanged-man.png",
    "Death":              "assets/tarot/death.png",
    "Temperance":         "assets/tarot/temperance.png",
    "The Devil":          "assets/tarot/the-devil.png",
    "The Tower":          "assets/tarot/the-tower.png",
    "The Star":           "assets/tarot/the-star.png",
    "The Moon":           "assets/tarot/the-moon.png",
    "The Sun":            "assets/tarot/the-sun.png",
    "Judgement":          "assets/tarot/judgement.png",
    "The World":          "assets/tarot/the-world.png"
  },
  /* Ingredient pictures, by item name, shown on the cabinet shelves and on the altar.
     Items without a picture show as a plain name tag. */
  items: {
    "Almond oil":           "assets/items/almond-oil.png",
    "Angelica root":        "assets/items/angelica-root.png",
    "Apple":                "assets/items/apple.png",
    "Apple peel":           "assets/items/apple-peel.png",
    "Autumn leaf":          "assets/items/autumn-leaf.png",
    "Basil":                "assets/items/basil.png",
    "Bay leaf":             "assets/items/bay-leaf.png",
    "Beeswax":              "assets/items/beeswax.png",
    "Black tea":            "assets/items/black-tea.png",
    "Butter":               "assets/items/butter.png",
    "Calendula":            "assets/items/calendula.png",
    "Cedar":                "assets/items/cedar.png",
    "Cedar chips":          "assets/items/cedar-chips.png",
    "Chamomile":            "assets/items/chamomile.png",
    "Cherry":               "assets/items/cherry.png",
    "Clover":               "assets/items/clover.png",
    "Comfrey leaf":         "assets/items/comfrey-leaf.png",
    "Cornflower":           "assets/items/cornflower.png",
    "Cypress":              "assets/items/cypress.png",
    "Daisy":                "assets/items/daisy.png",
    "Dandelion":            "assets/items/dandelion.png",
    "Dandelion root":       "assets/items/dandelion-root.png",
    "Dawn dew":             "assets/items/dawn-dew.png",
    "Elderflower":          "assets/items/elderflower.png",
    "Eucalyptus":           "assets/items/eucalyptus.png",
    "Fern":                 "assets/items/fern.png",
    "Four-leaf clover":     "assets/items/four-leaf-clover.png",
    "Garden sage":          "assets/items/garden-sage.png",
    "Grapes":               "assets/items/grapes.png",
    "Hibiscus":             "assets/items/hibiscus.png",
    "Hops":                 "assets/items/hops.png",
    "Jasmine":              "assets/items/jasmine.png",
    "Jojoba oil":           "assets/items/jojoba-oil.png",
    "Juniper":              "assets/items/juniper.png",
    "Lavender":             "assets/items/lavender.png",
    "Lemon balm":           "assets/items/lemon-balm.png",
    "Lemongrass":           "assets/items/lemongrass.png",
    "Licorice root":        "assets/items/licorice-root.png",
    "Lilac":                "assets/items/lilac.png",
    "Lotus":                "assets/items/lotus.png",
    "Mint":                 "assets/items/mint.png",
    "Moonwater":            "assets/items/moonwater.png",
    "Mugwort":              "assets/items/mugwort.png",
    "Nettle":               "assets/items/nettle.png",
    "New Moon Water":       "assets/items/new-moon-water.png",
    "Oak moss":             "assets/items/oak-moss.png",
    "Olive oil":            "assets/items/olive-oil.png",
    "Orange blossom":       "assets/items/orange-blossom.png",
    "Orris root":           "assets/items/orris-root.png",
    "Peppermint":           "assets/items/peppermint.png",
    "Pine":                 "assets/items/pine.png",
    "Pressed moon petals":  "assets/items/pressed-moon-petals.png",
    "Rainwater":            "assets/items/rainwater.png",
    "Rose":                 "assets/items/rose.png",
    "Rose petals":          "assets/items/rose-petals.png",
    "Rose thorns":          "assets/items/rose-thorns.png",
    "Rosebud":              "assets/items/rosebud.png",
    "Rosemary":             "assets/items/rosemary.png",
    "Rosewater":            "assets/items/rosewater.png",
    "Rue":                  "assets/items/rue.png",
    "Sea Water":            "assets/items/sea-water.png",
    "Seaweed":              "assets/items/seaweed.png",
    "Shea butter":          "assets/items/shea-butter.png",
    "Snow Water":           "assets/items/snow-water.png",
    "Snowdrop":             "assets/items/snowdrop.png",
    "Spring water":         "assets/items/spring-water.png",
    "Storm Water":          "assets/items/storm-water.png",
    "Sunflower oil":        "assets/items/sunflower-oil.png",
    "Sunflower petals":     "assets/items/sunflower-petals.png",
    "Sunwater":             "assets/items/sunwater.png",
    "Sweet pea":            "assets/items/sweet-pea.png",
    "Thyme":                "assets/items/thyme.png",
    "Valerian":             "assets/items/valerian.png",
    "Violet":               "assets/items/violet.png",
    "Web Dew":              "assets/items/web-dew.png",
    "Wheat":                "assets/items/wheat.png",
    "White lily":           "assets/items/white-lily.png",
    "Willow bark":          "assets/items/willow-bark.png",
    "Wormwood":             "assets/items/wormwood.png",
    /* animal gifts */
    "Bee pollen":           "assets/items/bee-pollen.png",
    "Dove feather":         "assets/items/dove-feather.png",
    "Hedgehog quill":       "assets/items/hedgehog-quill.png",
    "Honeycomb":            "assets/items/honeycomb.png",
    "Magpie feather":       "assets/items/magpie-feather.png",
    "Moth wing dust":       "assets/items/moth-wing-dust.png",
    "Nest twig":            "assets/items/nest-twig.png",
    "Owl feather":          "assets/items/owl-feather.png",
    "Peacock feather":      "assets/items/peacock-feather.png",
    "Raven feather":        "assets/items/raven-feather.png",
    "Seashell":             "assets/items/seashell.png",
    "Shed cat whisker":     "assets/items/shed-cat-whisker.png",
    "Shed snake skin":      "assets/items/shed-snake-skin.png",
    "Snail shell":          "assets/items/snail-shell.png",
    "Swan down":            "assets/items/swan-down.png",
    "White feather":        "assets/items/white-feather.png"
  }

};
