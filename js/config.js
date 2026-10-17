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
  /* Customers who stand behind the counter, by the name used in story.js.
     Anyone not listed here (walk-ins, Sam Okafor for now) is not drawn. */
  characters: {
    'Dottie Plum':               'assets/characters/dottie-plum.png',
    'Edmund Thorne':             'assets/characters/edmund-thorne.png',
    'Felix Marlow':              'assets/characters/felix-marlow.png',
    'Ivy Delacroix':             'assets/characters/ivy-delacroix.png',
    'Marigold "Goldie" Ashby':   'assets/characters/marigold-ashby.png',
    'Morwenna Hale':             'assets/characters/morwenna-hale.png',
    'Noor Haddad':               'assets/characters/noor-haddad.png',
    'Rosalind Larkin':           'assets/characters/rosalind-larkin.png'
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
    "Wormwood":             "assets/items/wormwood.png"
  }

};
