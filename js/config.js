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
  }
};
