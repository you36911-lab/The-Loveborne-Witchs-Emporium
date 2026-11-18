/* Settings you may want to change. Everything else reads from here. */

/* Where the game is saved in the browser. Changing this starts everyone from a fresh save. */
const SAVE_KEY = 'loveborne-emporium-save-v1';
/* The player's settings (volume, subtitle size) are kept apart, so a new game does not reset them. */
const SETTINGS_KEY = 'loveborne-emporium-settings';
/* What this player has done in any game (the furthest day reached), kept apart from the save: a new game after one that
   got past the tutorial (TUTORIAL_LAST_DAY) has no tutorial. */
const PROFILE_KEY = 'loveborne-emporium-profile';
const TUTORIAL_LAST_DAY = 2;
/* Saves from the old single-file prototype; picked up once so progress isn't lost. */
const OLD_SAVE_KEYS = ['altar-shop-proto-v9'];

/* Customers and dialogue exist for week one so far. Raise this as more days are written. */
const LAST_PLAYABLE_DAY = 21;

/* Prototype controls under the title bar: jump to any week, day, hour or customer. Set to false to hide them. */
const PROTOTYPE_TOOLS = true;
/* A customer shown brighter than the hour's light alone would leave them (1 is as lit; 1.2 is a fifth brighter), for
   pictures that read too dark in play, as at Yule, whose light is about three quarters of Noon's. A key can also name
   one festival and hour ('Name|Festival|Hour'), for someone who reads too dark only there. */
const CUSTOMER_BRIGHTER = {
  'Hester|Yule|Nightfall': 1.4,  /* Yule's night light is about half of Noon's, and she stands beside the candles */
  'Rosalind Larkin|Yule|Nightfall': 1.4,
  'Hester|Samhain|Twilight': 1.2,  /* her picture is dark already (black dress) */
  'A night-shift nurse|Samhain|Nightfall': 1.25,  /* Samhain's night light is about three fifths of Noon's */
  'Edmund Thorne|Samhain|Nightfall': 1.25,
  'A learner driver|Samhain|Nightfall': 1.2,  /* a lighter picture, so a little less */
  'An exhausted bookshop owner|Samhain|Sunrise': 1.15,
  'A father with a pushchair|Samhain|Sunrise': 1.15,
  'An accountant before the office party': 1.2,
  'A woman who hasn’t spoken to her sister': 1.2,
  'Noor Haddad': 1.1,
};
/* Customers whose speech balloon sits further right than usual, in % of the window's width: pictures much wider than
   one person (a couple), whose right side reaches past where the balloon would start. */
const BALLOON_RIGHT = {
  'A couple holding hands': 5,
  'A couple waiting on a phone call': 5,
};
const ALTAR_MAX = 7;  /* the most things the altar holds (the largest recipe has seven ingredients) */

/* How long the dawn card ("Day 2, Sunday") stays before the morning light comes in, in ms. */
const DAWN_MS = 1800;
const AFTER_DAWN_MS = 1100;  /* after the day card fades, a short pause before the mood line comes up at the bottom */
const PARTING_MS = 2000;  /* a customer who got just what they needed stays this long after their parting words, then leaves */
const AFTER_LEAVE_MS = 1500;  /* after a customer has left (and nobody else is due this hour), the pause before the light moves on to the next hour */
const BELL_TO_DOOR_MS = 1400;  /* after the shop bell rings, the pause before the door opens and the customer comes in */
const TITLE_FADE_MS = 700;  /* the title screen fading away as the game starts (keep in step with .titlescreen in style.css) */
const MAIL_AFTER_DAWN_MS = 1800;  /* after the day card fades, the pause before the morning's new email pops up */

/* How each ingredient's picture is drawn, so a cupboard stands like things together: 0 bottles and flasks, 1 cork-stoppered
   jars, 2 jars with lids, 3 canisters, tins and pots, 4 small packets and boxes (sachets of sugar, vanilla), 5 bags and
   pouches, 6 hanging cards, 7 bundles, 8 blocks. Within a kind, A to Z.
   Things without a picture (and any not listed) come last, A to Z. */
const ITEM_KIND = {
  "Moonwater":0,"Sunwater":0,"Rainwater":0,"Dawn dew":0,"Sea Water":0,"Spring water":0,"Rosewater":0,"New Moon Water":0,
  "Web Dew":0,"Snow Water":0,"Storm Water":0,"Almond oil":0,"Jojoba oil":0,"Olive oil":0,"Sunflower oil":0,"Milk":0,
  "Patchouli":0,"Myrrh":0,"Frankincense":0,"Basil":0,"Fern":0,"Four-leaf clover":0,"Hibiscus":0,"Hops":0,
  "Orange blossom":0,"Thyme":0,"Seaweed":0,"Violet":0,"Apple":0,"Cherry":0,"Beetroot powder":0,"Ginger":0,
  "Star anise":0,"Black salt":0,"Nest twig":0,"Shed cat whisker":0,"Shed snake skin":0,"Glass beads":0,"Silver beads":0,"Glass vial":0,"Bay leaf":1,"Calendula":1,
  "Chamomile":1,"Clover":1,"Comfrey leaf":1,"Daisy":1,"Elderflower":1,"Eucalyptus":1,"Jasmine":1,"Lemongrass":1,
  "Mint":1,"Nettle":1,"Oak moss":1,"Rosemary":1,"Cedar":1,"Pine":1,"Licorice root":1,"Rosebud":1,
  "Wormwood":1,"Orris root":1,"Strawberry":1,"Clove":1,"Fennel seeds":1,"Chili":1,"Saffron":1,"Cinnamon":1,
  "Raven feather":1,"Moth wing dust":1,"Swan down":1,"Hedgehog quill":1,"Magpie feather":1,"Eggshell":1,"Dandelion":2,"Dandelion root":2,
  "Cornflower":2,"Mugwort":2,"Rose":2,"Rose petals":2,"Rose thorns":2,"Rue":2,"Sunflower petals":2,"Valerian":2,
  "White lily":2,"Pressed moon petals":2,"Cedar chips":2,"Wheat":2,"Cypress":2,"Apple peel":2,"Grapes":2,"Lemon":2,
  "Lemon peel":2,"Lime peel":2,"Orange":2,"Orange peel":2,"Peach":2,"Pomegranate seeds":2,"Rose hips":2,"Allspice":2,
  "Bergamot":2,"Black pepper":2,"Cardamom":2,"Nutmeg":2,"Poppy seeds":2,"Cinnamon stick":2,"Chocolate chips":2,"Gold sprinkles":2,
  "Honey":2,"Pink salt":2,"Pink sprinkles":2,"Rainbow sprinkles":2,"Rose clay":2,"Sea salt":2,"Gold mica":2,"Silver mica":2,
  "Silver glitter":2,"Pink glitter":2,"Biodegradable glitter":2,"Bee pollen":2,"Honeycomb":2,"Snail shell":2,"Acorn":2,"Mismatched buttons":2,"Vintage buttons":1,"Small keys":2,
  "Beeswax":2,"Angelica root":3,"Garden sage":3,"Lavender":3,"Lemon balm":3,"Lilac":3,"Lotus":3,"Peppermint":3,
  "Snowdrop":3,"Juniper":3,"Willow bark":3,"Sweet pea":3,"Black tea":3,"Shea butter":3,"Amber resin":3,"Copal":3,
  "Sandalwood":3,"Cocoa":3,"Coconut milk powder":3,"Oats":3,"Milk powder":3,"Peacock feather":3,"Dove feather":3,"Raisins":4,
  "Vanilla":4,"Baking soda":4,"Brown sugar":4,"Epsom salt":5,"Flour":5,"Rice flour":5,"Sugar":4,"Garden soil":5,
  "Hearth ash":5,"Coin":5,"Owl feather":5,"Seashell":5,"White feather":5,"Brass buttons":6,"Bright buttons":6,"Gold buttons":6,
  "Heart-shaped buttons":6,"Iron filings":6,"Iron nail":6,"Iron pin":6,"Ash branch":7,"Ash wood":7,"Birch branch":7,"Birch wood":7,
  "Blackthorn branch":7,"Hazel branch":7,"Rowan branch":7,"Autumn leaf":7,"Butter":8,"Soap base":8,"Soap base (charcoal)":8,
  "Black ink":0,"Gold ink":0,"Plain ink":0,"Red ink":0,"Silver ink":0,"Violet ink":0,"Gold paint":0,"Red paint":0,
  /* the thread cones */
  "Black thread":3,"Blue thread":3,"Gold thread":3,"Green thread":3,"Grey thread":3,"Orange thread":3,"Pink thread":3,"Purple thread":3,"Rainbow thread":3,"Red thread":3,"Silver thread":3,"White thread":3,"Yellow thread":3,
  "Spool of thread":3,"Star-shaped buttons":6,"Square buttons":6,"Muslin":5,"Patchwork scraps":5,"Locket":6,"Clamshell compact":4,"Wooden dice":4,"Clay":3,"Sealing wax":1,"Tiny bells":1,"Paper":4,"Quills":0,"Teacup charms":2,"Paintbrush bristles":2,"Pearl buttons":6,"Satin ribbon":6,"Velvet ribbon (red)":6,"Fabric pouch":5
};
/* Image files. Paths are relative to index.html. */
/* How tall each ingredient stands, as a share of a big potion bottle (1 = about 20cm), so a sugar packet is not as big
   as a water bottle. Nothing goes below 0.3, so the smallest things stay easy to see. An item not listed in ITEM_SIZE
   takes its shelf's size. Used in the cupboards and on the table. */
const ITEM_SIZE_BY_SHELF = {
  "Base waters":0.95,"Oils, butters & waxes":0.85,"Herbs & flowers":0.6,"Fruits":0.7,"Spices":0.6,
  "Pantry: salts, sugars & baking":0.65,"Resins & incense":0.6,"Crystals":0.53,"Animal gifts":0.7,
  "Wood & branches":0.6,"Buttons":0.3,"Findings & tools":0.4
};
/* How tall each thing really is, for the altar, where things stand side by side and must look true to life (1 = a 20 cm
   potion bottle): a sachet of sugar is small beside a bottle, a jar of herbs is about a hand tall, a bag of flour is big.
   Gems are drawn larger than life (0.42) so they can be seen and told apart. A thing not listed takes its shelf's size. The cupboards do not use
   this: there everything is drawn large enough to tell apart (ITEM_SIZE below). */
const REAL_SIZE_BY_SHELF = {
  "Base waters":0.9,"Oils, butters & waxes":0.7,"Herbs & flowers":0.62,"Fruits":0.6,"Spices":0.5,
  "Pantry: salts, sugars & baking":0.5,"Resins & incense":0.5,"Crystals":0.42,"Animal gifts":0.6,
  "Wood & branches":0.9,"Buttons":0.45,"Findings & tools":0.5
};
const REAL_SIZE = {
  "Butter":0.28,"Shea butter":0.4,"Beeswax":0.45,"Almond oil":0.7,"Jojoba oil":0.7,"Olive oil":0.9,"Sunflower oil":0.9,
  "Brown sugar":0.42,"Vanilla":0.4,"Raisins":0.45,"Sugar":0.48,"Baking soda":0.5,"Rice flour":0.7,"Flour":0.85,"Garden soil":0.9,
  "Epsom salt":0.6,"Milk":0.95,"Coconut milk powder":0.5,"Cocoa":0.5,"Milk powder":0.5,"Oats":0.55,"Chocolate chips":0.55,
  "Honey":0.45,"Gold sprinkles":0.4,"Pink sprinkles":0.45,"Rainbow sprinkles":0.45,"Gold mica":0.4,"Silver mica":0.4,
  "Silver glitter":0.4,"Pink glitter":0.4,"Biodegradable glitter":0.4,"Rose clay":0.45,"Eggshell":0.45,"Hearth ash":0.45,
  "Soap base":0.28,"Soap base (charcoal)":0.28,"Saffron":0.38,"Sandalwood":0.45,"Peacock feather":0.75,"Seashell":0.55,
  "Selenite":0.5,"Pearl":0.36,"River stone":0.46,"Beetroot powder":0.55,"Apple":0.55,
  "Acorn":0.55,"Ash wood":0.8,"Birch wood":0.8,"Small keys":0.6,"Coin":0.45,"Glass beads":0.45,"Silver beads":0.45,"Clamshell compact":0.35,"Glass vial":0.4,"Wooden dice":0.4,"Clay":0.45,"Sealing wax":0.45,"Tiny bells":0.45,"Paper":0.5,"Quills":0.55,"Teacup charms":0.5,"Paintbrush bristles":0.45,
  /* the ink bottles: small round flasks, about 8 cm */
  "Black ink":0.4,"Gold ink":0.4,"Plain ink":0.4,"Red ink":0.4,"Silver ink":0.4,"Violet ink":0.4,"Gold paint":0.4,"Red paint":0.4,
  /* the thread cones: about 10 cm */
  "Black thread":0.5,"Blue thread":0.5,"Gold thread":0.5,"Green thread":0.5,"Grey thread":0.5,"Orange thread":0.5,"Pink thread":0.5,"Purple thread":0.5,"Rainbow thread":0.5,"Red thread":0.5,"Silver thread":0.5,"White thread":0.5,"Yellow thread":0.5,
  "Spool of thread":0.35,"Muslin":0.6,"Patchwork scraps":0.6,"Locket":0.55,"Satin ribbon":0.45,"Velvet ribbon (red)":0.5,"Fabric pouch":0.5
};
/* How tall a finished spell stands on the altar, by its kind (1 = a 20 cm potion bottle): a wand is long, a rune stone small. */
const SPELL_SIZE = {
  "Wand":0.95,"Witch's Ladder":0.9,"Water":0.85,"Potion":0.8,"Powder":0.7,"Oil":0.7,"Tonic":0.7,"Spell Bottle":0.65,"Incense":0.65,"Glamour":0.65,
  "Bath Salt":0.6,"Tea":0.55,"Hand Mirror":0.55,"Witch Salt":0.55,"Cookies":0.5,"Butter":0.45,"Balm":0.45,"Sachet":0.45,"Sigil":0.45,
  "Amulet":0.45,"Charm":0.45,"Talisman":0.45,"Soap":0.4,"Rune":0.35
};
/* On the altar every finished spell stands this much bigger than SPELL_SIZE (at most 1.05: the height of the table's space). */
const SPELL_ALTAR_SCALE = 1.25;
/* On the altar only, a kind can stand a little bigger than SPELL_SIZE says (the counter keeps SPELL_SIZE). */
const SPELL_SIZE_ALTAR = {"Sachet":0.5};
const ITEM_SIZE = {
  "Almond oil":0.8,"Jojoba oil":0.85,"Olive oil":0.95,"Sunflower oil":0.95,"Butter":0.27,"Shea butter":0.45,
  "Beeswax":0.55,"Baking soda":0.6,"Black salt":0.7,"Brown sugar":0.6,"Chocolate chips":0.75,"Cocoa":0.7,"Coconut milk powder":0.6,
  "Epsom salt":0.85,"Flour":0.95,"Gold sprinkles":0.55,"Honey":0.6,"Milk":0.95,"Milk powder":0.7,"Oats":0.75,
  "Pink salt":0.65,"Pink sprinkles":0.65,"Rainbow sprinkles":0.65,"Rice flour":0.9,"Rose clay":0.55,
  "Sea salt":0.65,"Sugar":0.6,"Garden soil":1,"Hearth ash":0.6,"Eggshell":0.55,"Soap base":0.42,
  "Soap base (charcoal)":0.42,"Gold mica":0.5,"Silver mica":0.5,"Silver glitter":0.55,"Pink glitter":0.55,
  "Biodegradable glitter":0.55,"Black pepper":0.65,"Cinnamon":0.65,"Cinnamon stick":0.7,"Fennel seeds":0.65,
  "Saffron":0.5,"Vanilla":0.55,"Apple":0.65,"Raisins":0.6,"Beetroot powder":0.75,"Copal":0.65,"Frankincense":0.65,
  "Patchouli":0.55,"Sandalwood":0.55,"Peacock feather":0.8,"Seashell":0.75,"Owl feather":0.75,
  "White feather":0.75,"Nest twig":0.6,"Shed cat whisker":0.6,"Shed snake skin":0.65,"Moth wing dust":0.65,
  "Bee pollen":0.65,"Swan down":0.65,"Pearl":0.38,"River stone":0.55,"Selenite":0.63,"Clear quartz":0.61,
  "Black tourmaline":0.61,"Smoky quartz":0.61,"Rose quartz":0.61,"Hematite":0.59,"Rhodonite":0.59,"Pyrite":0.59,
  "Sunstone":0.61,"Malachite":0.59,"Obsidian":0.59,
  /* the "symbols" pictures, sized to read easily in their cupboards */
  "Acorn":0.7,"Ash branch":0.95,"Birch branch":0.95,"Blackthorn branch":0.9,"Hazel branch":0.95,"Rowan branch":0.95,"Ash wood":0.8,"Birch wood":0.8,
  "Brass buttons":0.7,"Bright buttons":0.7,"Gold buttons":0.7,"Heart-shaped buttons":0.7,"Mismatched buttons":0.7,"Vintage buttons":0.7,
  "Coin":0.7,"Glass beads":0.7,"Silver beads":0.7,"Clamshell compact":0.7,"Glass vial":0.6,"Wooden dice":0.7,"Clay":0.7,"Sealing wax":0.7,"Tiny bells":0.7,"Paper":0.75,"Quills":0.75,"Teacup charms":0.75,"Paintbrush bristles":0.7,"Iron filings":0.7,"Iron nail":0.7,"Iron pin":0.7,"Small keys":0.75,
  "Black ink":0.6,"Gold ink":0.6,"Plain ink":0.6,"Red ink":0.6,"Silver ink":0.6,"Violet ink":0.6,"Gold paint":0.6,"Red paint":0.6,
  /* the thread cones, as big as the inks */
  "Black thread":0.6,"Blue thread":0.6,"Gold thread":0.6,"Green thread":0.6,"Grey thread":0.6,"Orange thread":0.6,"Pink thread":0.6,"Purple thread":0.6,"Rainbow thread":0.6,"Red thread":0.6,"Silver thread":0.6,"White thread":0.6,"Yellow thread":0.6,
  /* the packets: button cards as big as Bright buttons, the cloth bags a little bigger; the spool shorter than the cones */
  "Spool of thread":0.5,"Star-shaped buttons":0.7,"Square buttons":0.7,"Muslin":0.75,"Patchwork scraps":0.75,"Locket":0.7,"Pearl buttons":0.7,"Satin ribbon":0.7,"Velvet ribbon (red)":0.7,"Fabric pouch":0.75
};
const SHELF_CATEGORIES = ['Base waters', 'Oils, butters & waxes'];
const ASSETS = {
  backgrounds: {
    Dawn:      'assets/scene/bg-dawn.jpg',       /* before the shop opens */
    Sunrise:   'assets/scene/bg-sunrise.jpg',    /* morning */
    Noon:      'assets/scene/bg-noon.jpg',       /* day */
    Twilight:  'assets/scene/bg-twilight.jpg',   /* evening */
    Nightfall: 'assets/scene/bg-nightfall.jpg'   /* night, no moon */
  },
  /* On a festival's days the shop is dressed for it: the same five pictures for each festival,
     assets/scene/festivals/<festival>-<hour>.jpg, e.g. samhain-dawn.jpg, yule-nightfall.jpg. */
  festivalBackground: (festival, hour) => `assets/scene/festivals/${festival.toLowerCase()}-${hour.toLowerCase()}.jpg`,
  festivals: ['Samhain','Yule','Imbolc','Ostara','Beltane','Litha','Lughnasadh','Mabon'],
  /* The workroom below the counter: shelves either side (Kitchen left, Cabinet right) and the altar table in front. */
  altarRoom: 'assets/scene/altar-room.jpg',
  /* the walls past the picture on a wide window: the same room drawn empty, enlarged around its vanishing point (1376, 732 on the
     2752×1536 picture, where its lower wall lines meet) by 1.262 per panel, five steps, each strip 1238px (45%) wide */
  altarWallL: 'assets/scene/altar-wall-left.jpg', altarWallR: 'assets/scene/altar-wall-right.jpg',
  cabinetInside: 'assets/scene/cabinet-inside.jpg',  /* seen behind a cupboard door when it opens */
  cabinetBack: 'assets/scene/cabinet-back.jpg',  /* the back panel of that cupboard (wood grain): behind the things in an open cupboard */
  logo: 'assets/scene/logo.png',  /* the shop's logo as drawn: the winged heart in its silver frame */
  logoFlat: 'assets/scene/logo-flat.png',  /* the same drawing in flat pinks of one hue, for My Shop (the tab icon, assets/scene/favicon.png, is this, squared and 128px) */
  splash: 'assets/scene/splash-840.png',  /* the title screen: the logo with the game's name on the heart */
  /* the same logo made smaller ahead of time, with care (from splash.png, the designer's full-size picture), so the
     browser hardly has to shrink it on screen: shrunk a lot, its thin script outlines flicker as it floats. It picks
     the copy nearest to the size it is shown at. */
  splashSet: 'assets/scene/splash-560.png 560w, assets/scene/splash-840.png 840w, assets/scene/splash-1120.png 1120w',
  sounds: {  /* recorded sounds (see js/sound.js) */
    shopBell:'assets/sounds/shop-bell.mp3', altarBell:'assets/sounds/altar-bell.mp3', notify:'assets/sounds/notify.mp3',
    receipt:'assets/sounds/receipt.mp3', receiptPrinter:'assets/sounds/receipt-printer.mp3', candleOut:'assets/sounds/candle-out.mp3', phoneNotify:'assets/sounds/phone-notify.mp3', craft:'assets/sounds/craft-spell.mp3', cabinetOpen:'assets/sounds/cabinet-open.wav', cabinetClose:'assets/sounds/cabinet-close.wav', doorCreak:'assets/sounds/door-creak.mp3', doorClose:'assets/sounds/door-close.mp3', ding:'assets/sounds/ding.mp3', mouseClick:'assets/sounds/mouse-click.mp3'},
  iconBottle: 'assets/scene/icon-bottle.svg',  /* a plain round-bottomed spell bottle, flat in the shop's pinks: no longer used (the Recipe Book's old Test craft button) */
  iconPhoneApp: 'assets/scene/icon-bottle-app.svg',  /* the phone's Crafting app: the same bottle with a sparkle inside */
  iconBell: 'assets/scene/icon-bell.png',  /* the altar's desk bell, the same drawing flattened to three pinks: the Recipe Book's Lay out on the altar */  /* the same picture, its shading flattened to three flat pinks (deep, mid, light), for the My Shop app */
  pcWallpaper: 'assets/scene/desktop-background.jpg',  /* the computer's desktop */
  receipt: 'assets/scene/receipt.jpg',  /* the printed slip; receipts are written on it */
  candleStand: 'assets/candles/candle-stand.png',  /* always on the altar; the chosen candle stands in its cup */
  /* a picture of each finished spell, by recipe number (the designer is drawing them): it stands on the altar once
     crafted. Until a spell has one, the shop's bottle stands in, with the spell's name under it. */
  spells: Object.fromEntries([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39].map(n=>[n,'assets/spells/'+n+'.png'])),  /* the designer's pictures so far (recipes 1 to 39) */
  spellOutlines: Object.fromEntries([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39].map(n=>[n,'assets/spells/outline/'+n+'.png'])),  /* the locked look of each: its shape in paper, edged with a sepia ink line (made from the picture, 4px line) */
  altarPhone: 'assets/scene/altar-phone.png',  /* the phone lying on the altar right of the candle stand: every craft's result comes to it (phone2, the designer's picture, cut out) */
  altarBell: 'assets/scene/altar-bell.png',  /* the silver bell on the altar: ringing it makes what is laid out (the designer's picture, cut out) */
  testCandles: [0,1,2,3,4,5].map(n=>'assets/candles/test-candles-'+n+'.png'),  /* the black candelabra right of the card; picture n has n candles lit */
  objects: {
    'crystal-ball': 'assets/scene/crystal-ball.png',
    'crystal-ball-swirl': 'assets/scene/crystal-ball-swirl.png',  /* the ball as drawn, swirl and all: shown while an aura colours it */
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
     `flags` places the sticky page flags, measured in from each outer edge of the picture in % of its width (left side, then
     right): where the cover starts, where the cover meets the stack of pages, and where the open page's paper starts.
     A book with no cover picture yet gets a plain cover in `color` with its title in `ink`;
     with no open picture (`open:''`), the spread is drawn: boards in `color`, pages in `paper`. A fur cover has gaps between the
     fur tips, so `core` (the fur's colour) fills in behind it, and colours the cover's edge as it swings open. */
  books: {
    'Recipe Book':              {cover:'assets/books/recipe-book-cover.png',            open:'assets/books/recipe-book-open.png',            paper:'#F9F8E8', core:'#EA8C6F', page:[4.6,6,5.2], flags:[[0.15,4.3,5.85],[0.25,4.45,6.1]]},
    'Book of Making':           {cover:'assets/books/book-of-making-cover.png',         open:'assets/books/book-of-making-open.png',         paper:'#FBF6E6', page:[1.5,3.8,3], flags:[[0,2.1,3.7],[0,2.15,3.85]]},
    'Grimoire of Craft':        {cover:'assets/books/grimoire-of-craft-cover.png',      open:'assets/books/grimoire-of-craft-open.png',      paper:'#F6E6CC', page:[1.5,3.9,3], flags:[[0.05,2.1,3.75],[0,2.15,3.9]]},
    'Almanac of Sky & Seasons': {cover:'assets/books/almanac-of-sky-seasons-cover.png', open:'assets/books/almanac-of-sky-seasons-open.png', paper:'#F9F7EA', page:[1.5,3.8,3], flags:[[0,2,3.6],[0.1,2.1,3.85]]},
    'Tarot Companion':          {cover:'assets/books/tarot-companion-cover.png',        open:'assets/books/tarot-companion-open.png',        paper:'#F8F8E8', page:[1.5,3.8,3], flags:[[0,2.05,3.7],[0,2.15,3.85]]},
    'Herbiary':                 {cover:'assets/books/herbiary-cover.png',               open:'assets/books/herbiary-open.png',               paper:'#F2E6D0', page:[1.5,4,2.8], flags:[[0.2,2.2,3.8],[0.2,2.25,3.95]]},
    'Crystal Almanac':          {cover:'assets/books/crystal-almanac-cover.png',        open:'assets/books/crystal-almanac-open.png',        paper:'#F4F4E4', page:[1.5,3.7,3], flags:[[0.05,2.1,3.7],[0.05,2.15,3.85]]},
    'Gentle Bestiary':          {cover:'assets/books/gentle-bestiary-cover.png',        open:'assets/books/gentle-bestiary-open.png',        paper:'#F8F8E6', core:'#CDAB8C', page:[7.2,6.6,8], flags:[[0.8,6,7.5],[1.25,6.05,7.65]]},
    /* the notebook on the counter: no cover, it opens straight onto its ruled pages (see DIARY in books.js) */
    'My notes':                 {cover:'', open:'assets/books/diary-open.png', paper:'#F4F7E6', page:[2,3.7,3.2], flags:[[0,1.95,3.55],[0,1.95,3.65]]}
  },
  /* Customers who stand behind the counter, by the name used in story.js.
     Anyone not listed here (most walk-ins for now) is not drawn. */
  characters: {
    'Dottie Plum':               'assets/characters/dottie-plum.png',
    'Hester':                    'assets/characters/hester.png',
    'Edmund Thorne':             'assets/characters/edmund-thorne.png',
    'Felix Marlow':              'assets/characters/felix-marlow.png',
    'Ivy Delacroix':             'assets/characters/ivy-delacroix.png',
    'Marigold "Goldie" Ashby':   'assets/characters/marigold-ashby.png',
    'Morwenna Hale':             'assets/characters/morwenna-hale.png',
    'Noor Haddad':               'assets/characters/noor-haddad.png',
    'Rosalind Larkin':           'assets/characters/rosalind-larkin.png',
    'Sam Okafor':                'assets/characters/sam-okafor.png',
    'Rosalind Larkin with children': 'assets/characters/rosalind-larkin-children.png',  /* a visit with "pic" in story.js uses its own picture */
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
    'A first-year student':                   'assets/characters/first-year-student.png',
    /* week two */
    'A woman who can’t say no':                 'assets/characters/harriet-osei.png',
    'A man with a market-stall banner':         'assets/characters/rafael-duarte.png',
    'A woman with new car keys':                'assets/characters/margaret-achterberg.png',
    'A teacher at the end of term':             'assets/characters/owen-pritchard.png',
    'A woman in a cleaner’s tabard':            'assets/characters/teresa-okonjo.png',
    'An archivist who works underground':       'assets/characters/bartholomew-finch.png',
    'A sheep farmer in a muddy jacket':         'assets/characters/gwen-llewellyn.png',
    'A young man in a too-new suit':            'assets/characters/ishaan-mehta.png',
    'An accountant before the office party':    'assets/characters/fiona-galbraith.png',
    'A best man with index cards':              'assets/characters/callum-reid.png',
    'A woman who hasn’t spoken to her sister':  'assets/characters/anneliese-vogt.png',
    'A woman whose house is full of relatives': 'assets/characters/bridget-halloran.png',
    'A commuter in a grey coat':                'assets/characters/dev-kapoor.png',
    'A teenage bassist':                        'assets/characters/leo-marchetti.png',
    'A couple waiting on a phone call':         'assets/characters/tomasz-ewa-nowak.png',
    'A woman turning thirty tomorrow':          'assets/characters/chloe-moreau.png',
    'An expectant father':                      'assets/characters/samuel-dela-cruz.png',
    'A barmaid with a cold coming on':          'assets/characters/niamh-byrne.png'
  },
  /* Tarot cards (Major Arcana), by name: shown in the Tarot Companion, the Cabinet and the altar's card slot. */
  /* a candle of each colour (D.colours), the designer's pictures: in the Candles cupboard and on the altar */
  candles: {
    'White':       'assets/candles/candle-white.png',
    'Black':       'assets/candles/candle-black.png',
    'Red':         'assets/candles/candle-red.png',
    'Pink':        'assets/candles/candle-pink.png',
    'Orange':      'assets/candles/candle-orange.png',
    'Yellow':      'assets/candles/candle-yellow.png',
    'Gold':        'assets/candles/candle-gold.png',
    'Green':       'assets/candles/candle-green.png',
    'Light blue':  'assets/candles/candle-light-blue.png',
    'Blue':        'assets/candles/candle-blue.png',
    'Purple':      'assets/candles/candle-purple.png',
    'Lavender':    'assets/candles/candle-lavender.png',
    'Silver':      'assets/candles/candle-silver.png',
    'Brown':       'assets/candles/candle-brown.png',
    'Grey':        'assets/candles/candle-grey.png'
  },
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
    "White feather":        "assets/items/white-feather.png",
    /* crystals */
    "Amazonite":            "assets/items/amazonite.png",
    "Amethyst":             "assets/items/amethyst.png",
    "Aquamarine":           "assets/items/aquamarine.png",
    "Black tourmaline":     "assets/items/black-tourmaline.png",
    "Blue lace agate":      "assets/items/blue-lace-agate.png",
    "Carnelian":            "assets/items/carnelian.png",
    "Citrine":              "assets/items/citrine.png",
    "Clear quartz":         "assets/items/clear-quartz.png",
    "Fluorite":             "assets/items/fluorite.png",
    "Garnet":               "assets/items/garnet.png",
    "Green aventurine":     "assets/items/green-aventurine.png",
    "Hematite":             "assets/items/hematite.png",
    "Howlite":              "assets/items/howlite.png",
    "Jade":                 "assets/items/jade.png",
    "Labradorite":          "assets/items/labradorite.png",
    "Lapis lazuli":         "assets/items/lapis-lazuli.png",
    "Malachite":            "assets/items/malachite.png",
    "Moonstone":            "assets/items/moonstone.png",
    "Moss agate":           "assets/items/moss-agate.png",
    "Obsidian":             "assets/items/obsidian.png",
    "Pearl":                "assets/items/pearl.png",
    "Peridot":              "assets/items/peridot.png",
    "Pyrite":               "assets/items/pyrite.png",
    "Rhodonite":            "assets/items/rhodonite.png",
    "Rose quartz":          "assets/items/rose-quartz.png",
    "Selenite":             "assets/items/selenite.png",
    "Smoky quartz":         "assets/items/smoky-quartz.png",
    "Sunstone":             "assets/items/sunstone.png",
    "Tiger's eye":          "assets/items/tigers-eye.png",
    "River stone":          "assets/items/river-stone.png",
    /* pantry */
    "Baking soda":          "assets/items/baking-soda.png",
    "Black salt":           "assets/items/black-salt.png",
    "Brown sugar":          "assets/items/brown-sugar.png",
    "Chocolate chips":      "assets/items/chocolate-chips.png",
    "Cocoa":                "assets/items/cocoa.png",
    "Coconut milk powder":  "assets/items/coconut-milk-powder.png",
    "Epsom salt":           "assets/items/epsom-salt.png",
    "Flour":                "assets/items/flour.png",
    "Gold sprinkles":       "assets/items/gold-sprinkles.png",
    "Honey":                "assets/items/honey.png",
    "Milk":                 "assets/items/milk.png",
    "Milk powder":          "assets/items/milk-powder.png",
    "Oats":                 "assets/items/oats.png",
    "Pink salt":            "assets/items/pink-salt.png",
    "Pink sprinkles":       "assets/items/pink-sprinkles.png",
    "Rainbow sprinkles":    "assets/items/rainbow-sprinkles.png",
    "Rice flour":           "assets/items/rice-flour.png",
    "Rose clay":            "assets/items/rose-clay.png",
    "Sea salt":             "assets/items/sea-salt.png",
    "Sugar":                "assets/items/sugar.png",
    "Garden soil":          "assets/items/garden-soil.png",
    "Hearth ash":           "assets/items/hearth-ash.png",
    "Eggshell":             "assets/items/eggshell.png",
    "Soap base":            "assets/items/soap-base.png",
    "Soap base (charcoal)": "assets/items/soap-base-charcoal.png",
    "Gold mica":            "assets/items/gold-mica.png",
    "Silver mica":          "assets/items/silver-mica.png",
    "Silver glitter":       "assets/items/silver-glitter.png",
    "Pink glitter":         "assets/items/pink-glitter.png",
    "Biodegradable glitter":"assets/items/biodegradable-glitter.png",
    /* resins & incense */
    "Amber resin":          "assets/items/amber-resin.png",
    "Copal":                "assets/items/copal.png",
    "Frankincense":         "assets/items/frankincense.png",
    "Myrrh":                "assets/items/myrrh.png",
    "Patchouli":            "assets/items/patchouli.png",
    "Sandalwood":           "assets/items/sandalwood.png",
    /* spices */
    "Cinnamon":             "assets/items/cinnamon.png",
    /* wood & branches, buttons, findings & tools (the designer's "symbols" pictures) */
    "Acorn":               "assets/items/acorn.png",
    "Ash branch":          "assets/items/ash-branch.png",
    "Ash wood":            "assets/items/ash-wood.png",
    "Birch branch":        "assets/items/birch-branch.png",
    "Birch wood":          "assets/items/birch-wood.png",
    "Blackthorn branch":   "assets/items/blackthorn-branch.png",
    /* inks (the designer's pictures, 2026-11-16) */
    "Black ink":           "assets/items/black-ink.png",
    "Gold ink":            "assets/items/gold-ink.png",
    "Plain ink":           "assets/items/plain-ink.png",
    "Red ink":             "assets/items/red-ink.png",
    "Silver ink":          "assets/items/silver-ink.png",
    "Violet ink":          "assets/items/violet-ink.png",
    "Gold paint":          "assets/items/gold-paint.png",
    "Red paint":           "assets/items/red-paint.png",
    /* threads (the designer's pictures, 2026-11-17) */
    "Black thread":       "assets/items/black-thread.png",
    "Blue thread":        "assets/items/blue-thread.png",
    "Gold thread":        "assets/items/gold-thread.png",
    "Green thread":       "assets/items/green-thread.png",
    "Grey thread":        "assets/items/grey-thread.png",
    "Orange thread":      "assets/items/orange-thread.png",
    "Pink thread":        "assets/items/pink-thread.png",
    "Purple thread":      "assets/items/purple-thread.png",
    "Rainbow thread":    "assets/items/rainbow-thread.png",
    "Red thread":         "assets/items/red-thread.png",
    "Silver thread":      "assets/items/silver-thread.png",
    "White thread":       "assets/items/white-thread.png",
    "Yellow thread":      "assets/items/yellow-thread.png",
    /* (the designer's pictures, 2026-11-17) */
    "Spool of thread":    "assets/items/spool-of-thread.png",
    "Star-shaped buttons": "assets/items/star-shaped-buttons.png",
    "Square buttons":     "assets/items/square-buttons.png",
    "Muslin":             "assets/items/muslin.png",
    "Patchwork scraps":   "assets/items/patchwork-scraps.png",
    "Locket":             "assets/items/locket.png",
    /* (the designer's pictures, 2026-11-18) */
    "Pearl buttons":      "assets/items/pearl-buttons.png",
    "Satin ribbon":       "assets/items/satin-ribbon.png",
    "Velvet ribbon (red)": "assets/items/velvet-ribbon.png",
    "Fabric pouch":       "assets/items/fabric-pouch.png",
    "Silver beads":       "assets/items/silver-beads.png",
    "Clamshell compact":  "assets/items/clamshell-compact.png",
    "Glass vial":         "assets/items/glass-vial.png",
    "Wooden dice":        "assets/items/wooden-dice.png",
    "Clay":               "assets/items/clay.png",
    "Sealing wax":        "assets/items/sealing-wax.png",
    "Tiny bells":         "assets/items/tiny-bells.png",
    "Paper":              "assets/items/paper.png",
    "Quills":             "assets/items/quills.png",
    "Teacup charms":      "assets/items/teacup-charms.png",
    "Paintbrush bristles": "assets/items/paintbrush-bristles.png",
    "Hazel branch":        "assets/items/hazel-branch.png",
    "Rowan branch":        "assets/items/rowan-branch.png",
    "Brass buttons":        "assets/items/brass-buttons.png",
    "Bright buttons":      "assets/items/bright-buttons.png",
    "Gold buttons":         "assets/items/gold-buttons.png",
    "Heart-shaped buttons": "assets/items/heart-shaped-buttons.png",
    "Mismatched buttons":   "assets/items/mismatched-buttons.png",
    "Vintage buttons":      "assets/items/vintage-buttons.png",
    "Coin":                "assets/items/coin.png",
    "Glass beads":          "assets/items/glass-beads.png",
    "Iron filings":        "assets/items/iron-filings.png",
    "Iron nail":           "assets/items/iron-nail.png",
    "Iron pin":            "assets/items/iron-pin.png",
    "Small keys":           "assets/items/small-keys.png",
    /* fruits */
    "Beetroot powder":      "assets/items/beetroot-powder.png",
    /* spices */
    "Allspice":             "assets/items/allspice.png",
    "Bergamot":             "assets/items/bergamot.png",
    "Black pepper":         "assets/items/black-pepper.png",
    "Cardamom":             "assets/items/cardamom.png",
    "Chili":                "assets/items/chili.png",
    "Cinnamon stick":       "assets/items/cinnamon-stick.png",
    "Clove":                "assets/items/clove.png",
    "Fennel seeds":          "assets/items/fennel-seeds.png",
    "Ginger":               "assets/items/ginger.png",
    "Nutmeg":               "assets/items/nutmeg.png",
    "Poppy seeds":          "assets/items/poppy-seeds.png",
    "Saffron":              "assets/items/saffron.png",
    "Star anise":           "assets/items/star-anise.png",
    "Vanilla":              "assets/items/vanilla.png",
    /* fruits */
    "Lemon":                "assets/items/lemon.png",
    "Lemon peel":           "assets/items/lemon-peel.png",
    "Lime peel":            "assets/items/lime-peel.png",
    "Orange":               "assets/items/orange.png",
    "Orange peel":          "assets/items/orange-peel.png",
    "Peach":                "assets/items/peach.png",
    "Pomegranate seeds":    "assets/items/pomegranate-seeds.png",
    "Rose hips":            "assets/items/rose-hips.png",
    "Strawberry":           "assets/items/strawberry.png",
    "Raisins":              "assets/items/raisins.png"
  }

};
