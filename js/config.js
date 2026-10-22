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
/* How tall each ingredient stands, as a share of a big potion bottle (1 = about 20cm), so a sugar packet is not as big
   as a water bottle. Nothing goes below 0.3, so the smallest things stay easy to see. An item not listed in ITEM_SIZE
   takes its shelf's size. Used in the cupboards and on the table. */
const ITEM_SIZE_BY_SHELF = {
  "Base waters":0.95,"Oils, butters & waxes":0.85,"Herbs & flowers":0.6,"Fruits":0.7,"Spices":0.6,
  "Pantry: salts, sugars & baking":0.65,"Resins & incense":0.6,"Crystals":0.42,"Animal gifts":0.7
};
const ITEM_SIZE = {
  "Almond oil":0.8,"Jojoba oil":0.85,"Olive oil":0.95,"Sunflower oil":0.95,"Butter":0.3,"Shea butter":0.45,
  "Beeswax":0.55,"Baking soda":0.6,"Black salt":0.7,"Brown sugar":0.6,"Chocolate chips":0.75,"Cocoa":0.7,"Coconut milk powder":0.6,
  "Epsom salt":0.85,"Flour":0.95,"Gold sprinkles":0.55,"Honey":0.6,"Milk":0.95,"Milk powder":0.7,"Oats":0.75,
  "Pink salt":0.65,"Pink sprinkles":0.65,"Rainbow sprinkles":0.65,"Rice flour":0.9,"Rose clay":0.55,
  "Sea salt":0.65,"Sugar":0.55,"Garden soil":1,"Hearth ash":0.6,"Eggshell":0.55,"Soap base":0.35,
  "Soap base (charcoal)":0.35,"Gold mica":0.5,"Silver mica":0.5,"Silver glitter":0.55,"Pink glitter":0.55,
  "Biodegradable glitter":0.55,"Black pepper":0.65,"Cinnamon":0.65,"Cinnamon stick":0.7,"Fennel seed":0.65,
  "Saffron":0.5,"Vanilla":0.55,"Apple":0.65,"Raisins":0.6,"Beetroot powder":0.75,"Copal":0.65,"Frankincense":0.65,
  "Patchouli":0.55,"Sandalwood":0.55,"Peacock feather":0.8,"Seashell":0.75,"Owl feather":0.75,
  "White feather":0.75,"Nest twig":0.6,"Shed cat whisker":0.6,"Shed snake skin":0.65,"Moth wing dust":0.65,
  "Bee pollen":0.65,"Swan down":0.65,"Pearl":0.3,"River stone":0.35,"Selenite":0.5,"Clear quartz":0.48,
  "Black tourmaline":0.48,"Smoky quartz":0.48,"Rose quartz":0.48,"Hematite":0.46,"Rhodonite":0.46,"Pyrite":0.46,
  "Sunstone":0.48,"Malachite":0.46,"Obsidian":0.46
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
  /* The workroom below the counter: shelves either side (Kitchen left, Cabinet right) and the altar table in front. */
  altarRoom: 'assets/scene/altar-room.jpg',
  /* the walls past the picture on a wide window: the same room drawn empty, enlarged around its vanishing point (1410, 815 on the
     2752×1536 picture) by 1.254 per panel on the left and 1.214 on the right, four steps, each strip 1238px (45%) wide */
  altarWallL: 'assets/scene/altar-wall-left.jpg', altarWallR: 'assets/scene/altar-wall-right.jpg',
  cabinetInside: 'assets/scene/cabinet-inside.jpg',  /* seen behind a cupboard door when it opens */
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
    'Gentle Bestiary':          {cover:'', color:'#D8C29A', ink:'#5A3E22',               open:'', paper:'#F5F7E9', page:[1.5,3.8,3]},
    /* the notebook on the counter: no cover, it opens straight onto its ruled pages (see DIARY in books.js) */
    'What customers told me':   {cover:'', open:'assets/books/diary-open.png', paper:'#F4F7E6', page:[2,3.7,3.2]}
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
    "Fennel seed":          "assets/items/fennel-seed.png",
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
