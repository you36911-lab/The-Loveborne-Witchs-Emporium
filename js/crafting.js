/* Crafting: comparing what is on the altar with a recipe, and the clue lines. */
/* ---------- crafting ---------- */
/* "The customer's birthstone" is not one stone: it is the crystal for the month the customer was born in, picked from
   the Crystals cupboard. A visit gives its customer's month as born:'March'; without one, any birthstone will do. */
const BIRTHSTONE="Birthstone (customer's)";
const itemLabel=n=>n===BIRTHSTONE?'Birthstone':n;  /* how a name is shown in the books (the data, and saves, keep the full name) */
const BIRTHSTONES={January:'Garnet',February:'Amethyst',March:'Aquamarine',April:'Clear quartz',May:'Jade',June:'Pearl',
  July:'Carnelian',August:'Peridot',September:'Lapis lazuli',October:'Moonstone',November:'Citrine',December:'Amazonite'};
/* What a recipe needs, with the birthstone turned into this customer's stone. */
function recipeNeeds(r,used,born){if(!r.ing.includes(BIRTHSTONE))return r.ing;
  const stones=Object.values(BIRTHSTONES),stone=BIRTHSTONES[born]||used.find(x=>stones.includes(x))||BIRTHSTONE;
  return r.ing.map(x=>x===BIRTHSTONE?stone:x)}
function isBaseFor(n,type){const i=ITEM[n];return i&&(i.anybase||i.base.includes(type))}
/* A swap is a wrong ingredient that shares a property with a missing one. It counts as one problem. */
function findSwaps(r,missing,wrong,used){const left=[...missing],out=[];
  /* What the rest of the mix already brings, so a clue never calls a theme missing when another ingredient supplies it. */
  const mix=new Set([...(used||[]).flatMap(u=>ITEM[u]?.props||[]),...(S.candle===r.candle?D.colours[r.candle]||[]:[]),...(S.tarot===r.tarot?D.tarot[r.tarot]||[]:[])]);
  /* Pair each wrong one with the missing one it stands in for. A wrong one is matched on its own shelf first (a wrong herb
     for a missing herb); it only stands in for a missing one from another shelf when neither has anything left on its own
     shelf to pair with. Otherwise a wrong herb could take a missing thread's place, and the herb still missing and the
     thread that is wrong would each get a line of their own: three lines for two mistakes. */
  const shared=(w,m)=>(ITEM[m]?.props||[]).filter(p=>(ITEM[w]?.props||[]).includes(p)).length;
  const pairOf=new Map(),free=()=>wrong.filter(w=>!pairOf.has(w));
  const pick=(w,ok)=>{let best=null,bn=0;left.forEach(m=>{if(!ok(m))return;const n=shared(w,m);if(n>bn){bn=n;best=m}});
    if(best){left.splice(left.indexOf(best),1);pairOf.set(w,best)}};
  wrong.forEach(w=>pick(w,m=>shelfOf(m)===shelfOf(w)));
  free().forEach(w=>{if(left.some(m=>shelfOf(m)===shelfOf(w)))return;
    pick(w,m=>!free().some(x=>x!==w&&shelfOf(x)===shelfOf(m)))});
  wrong.forEach(w=>{const wp=ITEM[w]?.props||[],best=pairOf.get(w);
    if(!best)return;
    const mp=ITEM[best].props,shared=mp.filter(p=>wp.includes(p));
    const theme=r.themes.find(t=>shared.includes(t)),kw=theme||shared[0];
    const a=ITEM[best],b=ITEM[w];let kind='same';
    /* "the X is right, but…" only when X is one of the recipe's themes; a word the two merely happen to share (success,
       in a recipe for confidence, passion and courage) is not "right", so that clue falls to the plainer lines below */
    if(theme&&a.t&&b.t&&a.t!==b.t)kind=a.t+'>'+b.t;else if(theme&&a.s&&b.s&&a.s!==b.s)kind=a.s==='Gentle'?'strong':'weak';
    const lacks=r.themes.filter(t=>mp.includes(t)&&!mix.has(t));
    /* Otherwise point at the one wrong spot: an off note the wrong ingredient brings, and what the right one would bring instead. */
    const sh=shownOf({props:mp,sk:'item:'+best}),pick=a=>a.find(p=>sh.includes(p))||a[0];
    const off=wp.filter(p=>!r.themes.includes(p)&&!mp.includes(p))[0],wantP=pick(mp.filter(p=>!wp.includes(p)&&!mix.has(p)));
    /* the same goes for 'it brings …' clues: only about a theme the recipe wants; otherwise the plain clue, with the right one pictured */
    if(theme&&kind==='same'&&lacks.length)kind='lacks';else if(theme&&kind==='same'&&off&&wantP)kind='notes';
    out.push({want:best,got:w,kw,kind,lacks,off,wantP})});
  return out}
const CARDFEEL={"The Fool": "a first step taken lightly, with a grin and no fear of falling", "The Magician": "a mind fixed on one thing, hands that make, and making it work", "The High Priestess": "knowing without being told, seeing what is real, and the pictures that come at night", "The Empress": "lovely things, plenty of them, and being kind to yourself", "The Emperor": "a line drawn, a wall that keeps you safe, and feet set firmly on the ground", "The Hierophant": "old lessons remembered, people bound together, and what is real", "The Lovers": "two hearts drawn close and in tune", "The Chariot": "nerve, a win, and the open road", "Strength": "quiet nerve, self-belief, and a steady breath", "The Hermit": "a still mind that knows what is real without being told", "Wheel of Fortune": "chance, a turn of change, and a door swinging open", "Justice": "an honest answer and a line that holds", "The Hanged Man": "letting go, waiting it out, and coming back changed", "Death": "something finished, a deep change, and letting it go", "Temperance": "things in equal measure, mending, and a steady breath", "The Devil": "heat in the blood and a pull you can’t resist", "The Tower": "a sudden change, everything falling away, and seeing what is real", "The Star": "awe, mending, and being gentle with yourself", "The Moon": "night pictures, knowing without being told, and slow change", "The Sun": "gladness, a win, and self-belief", "Judgement": "mending, letting go, and starting over", "The World": "a win, a story finished, and everyone joined together"};
const CARDLOOK={'The Fool':'a traveller at the edge of a cliff','The Magician':'a figure with one hand raised to the sky','The High Priestess':'a veiled woman seated between two pillars','The Empress':'a woman resting in a field of wheat','The Emperor':'a stern figure on a stone throne','The Hierophant':'a teacher raising a blessing over two listeners','The Lovers':'two figures beneath an angel','The Chariot':'a rider drawn by two beasts','Strength':'a woman gently closing a lion\u2019s jaws','The Hermit':'a lone figure holding a lantern','Wheel of Fortune':'a great turning wheel','Justice':'a figure holding scales and a sword','The Hanged Man':'a man hanging calmly upside down','Death':'a rider on a pale horse','Temperance':'an angel pouring water between two cups','The Devil':'two figures chained beneath a horned shape','The Tower':'a tower struck by lightning','The Star':'a woman pouring water under a bright star','The Moon':'a moon above a path between two towers','The Sun':'a child on a horse under a blazing sun','Judgement':'an angel sounding a trumpet over rising figures','The World':'a dancer inside a wreath'};
/* what each candle colour looks like, for a candle clue when no theme of it is known yet (never the colour's name) */
const FLAMELOOK={White:'fresh snow, or clean linen',Black:'a moonless night',Red:'the heart of a fire',Pink:'a rose’s blush',Orange:'marigolds by a hearth',
  Yellow:'morning sun on a kitchen table',Gold:'a coin in candlelight',Green:'new leaves after rain','Light blue':'a clear morning sky',Blue:'deep water at dusk',
  Purple:'the last light of twilight',Lavender:'a sleepy evening haze',Silver:'moonlight on water',Brown:'turned earth, or old oak',Grey:'woodsmoke on a misty morning'};
const AIM={Body:'the body',Mind:'the heart',Space:'the home'};
/* Clues point at the shelf a wrong ingredient came from, not the ingredient itself. */
const shelfOf=n=>(ITEM[n]?.c||'the shelves').split(':')[0];
function ingLine(sw){const g=`The one from ${shelfOf(sw.got)}`,k=sw.kw;
  if(sw.kind.includes('>')){const[want,got]=sw.kind.split('>');return `${g}: the ${k} is right, but it works on ${AIM[got]}. This needs one that works on ${AIM[want]}.`}
  if(sw.kind==='strong')return `${g}: the ${k} is right, but it is too strong. This needs a gentler one.`;
  if(sw.kind==='weak')return `${g}: the ${k} is right, but it is too gentle. This needs a stronger one.`;
  if(sw.kind==='lacks')return `${g}: it brings ${k}, but nothing in the mix brings ${sw.lacks[0]}. The right one would.`;
  if(sw.kind==='notes')return `${g}: it brings ${k}, but also ${sw.off}. The right one brings ${sw.wantP} instead.`;
  return `${g} isn\u2019t right. Picture the right one: ${ITEM[sw.want]?.look||'something else'}.`}
/* level: how many crafts of this recipe have already gone wrong. The first time the clues only say which shelves are
   short or over (2 more from Herbs & flowers); from the second, each missing one is pictured and each wrong one explained. */
function evaluate(r,test,level=1){
  const used=[...new Set(S.altar)],need=recipeNeeds(r,used,currentVisit()?.born);
  const missing=need.filter(x=>!used.includes(x)),wrong=used.filter(x=>!need.includes(x));
  /* someone else's birthstone in place of theirs: one problem, said plainly */
  /* the customer's own stone (when the recipe asks for their birthstone): only that one counts as "the birthstone", not a
     birthstone the recipe asks for by name (Moonstone in a recipe that also wants theirs) */
  const bi=r.ing.indexOf(BIRTHSTONE),theirStone=bi<0?'':need[bi];
  const stones=Object.values(BIRTHSTONES),theirs=theirStone&&theirStone!==BIRTHSTONE&&missing.includes(theirStone)?theirStone:'',
    other=theirs&&wrong.find(x=>stones.includes(x));
  if(other){missing.splice(missing.indexOf(theirs),1);wrong.splice(wrong.indexOf(other),1)}
  const swaps=findSwaps(r,missing,wrong,used);
  const loneMissing=missing.filter(m=>!swaps.some(s=>s.want===m)),loneWrong=wrong.filter(w=>!swaps.some(s=>s.got===w));
  const isStone=m=>m===BIRTHSTONE||!!theirStone&&m===theirStone;
  /* a wrong one put in the place of a missing one from the same shelf (the wrong compact for the right one): one problem,
     and one clue line, not "doesn't belong" plus "one more is needed" (wrong one -> the one it stands in for) */
  const inPlace=new Map();
  loneWrong.forEach(w=>{const m=loneMissing.find(m=>![...inPlace.values()].includes(m)&&!isStone(m)&&shelfOf(m)===shelfOf(w));if(m)inPlace.set(w,m)});
  let probs=swaps.length+loneMissing.length+loneWrong.length-inPlace.size+(other?1:0);const lines=[];const gained=[];
  /* Each clue line is tagged with what it is about, so a wrong card isn't read as an ingredient problem. */
  const L=(k,t)=>lines.push({k,t});let il='';
  /* Ingredients: say how many are off, then one plain clue per problem, naming the ingredient that is wrong. */
  const ingProbs=swaps.length+loneMissing.length+loneWrong.length;
  if(other)L('ing',`The ${other.toLowerCase()} is a birthstone, but not theirs. Theirs is the stone of the month they were born in.`);
  if(ingProbs&&!level){const by=(list,f)=>{const n={};list.forEach(x=>{const k=f(x);n[k]=(n[k]||0)+1});return Object.entries(n)};
    const miss=[...loneMissing,...swaps.map(s=>s.want)],over=[...loneWrong,...swaps.map(s=>s.got)];
    if(miss.some(isStone))L('ing','It needs their birthstone: the stone of the month they were born in.');
    /* "more from" only for what a shelf is still short of: a wrong one put in from the same shelf already stands in its
       place, so that shelf only hears that one doesn't belong */
    const overBy=Object.fromEntries(by(over,shelfOf));
    by(miss.filter(m=>!isStone(m)),shelfOf).forEach(([sh,n])=>{const k=n-(overBy[sh]||0);if(k>0)L('ing',`${k} more from ${sh}.`)});
    by(over,shelfOf).forEach(([sh,n])=>L('ing',`${n===1?'One':n} from ${sh} ${n===1?'doesn’t':'don’t'} belong.`))}
  else if(ingProbs){
    /* from the third test of a recipe, a wrong one that is close (shares a theme) is also pictured, so the clues keep moving on */
    swaps.forEach(sw=>{const pic=level>=2&&sw.kind!=='same'&&ITEM[sw.want]?.look?` Picture the right one: ${ITEM[sw.want].look}.`:'';L('ing',ingLine(sw)+pic);if(sw.kind==='notes')gained.push(sw.off,sw.wantP)});
    loneWrong.forEach(w=>{const props=(ITEM[w]?.props||[]).filter(p=>!r.themes.includes(p));
      const m=inPlace.get(w);
      if(m){const pic=ITEM[m]?.look?` Picture the right one: ${ITEM[m].look}.`:'';
        if(props.length){L('ing',`The one from ${shelfOf(w)} isn\u2019t right: it adds ${props[0]}, which this doesn\u2019t want.${pic}`);gained.push(props[0])}
        else L('ing',`The one from ${shelfOf(w)} isn\u2019t right.${pic}`);return}
      if(props.length){L('ing',`Something from ${shelfOf(w)} doesn\u2019t belong: it adds ${props[0]}, which this doesn\u2019t want.`);gained.push(props[0])}
      else L('ing',`Something from ${shelfOf(w)} doesn\u2019t belong here.`)});
    loneMissing.filter(m=>![...inPlace.values()].includes(m)).forEach(m=>isStone(m)?L('ing','It needs their birthstone: the stone of the month they were born in.'):L('ing',ITEM[m]?.look?`One more is needed from ${shelfOf(m)}. Picture it: ${ITEM[m].look}.`:`One more is needed from ${shelfOf(m)}.`))}
  /* from the second test on, a candle clue names a theme the right flame brings: one the recipe wants, and one the candle
     laid out lacks if there is one (the Grimoire's Colours tell which colours carry it) */
  /* Only a theme the Grimoire already shows for that colour (printed there, or written in by the player) helps; otherwise
     the clue pictures the colour instead (FLAMELOOK). */
  const flameWants=()=>{if(!level)return '';const own=D.colours[S.candle]||[],ok=(D.colours[r.candle]||[]).filter(p=>r.themes.includes(p)),sk='colour:'+r.candle;
    const seen=p=>shownOf({props:D.colours[r.candle]||[],sk}).includes(p)||((S.fills||{})[sk]||[]).includes(p);
    const p=ok.find(p=>seen(p)&&!own.includes(p))||ok.find(seen);
    return p?` This flame wants ${p}.`:FLAMELOOK[r.candle]?` This flame wants something like ${FLAMELOOK[r.candle]}.`:''};
  if(r.candle&&!S.candle){probs++;L('candle','It feels as if it was made in the dark.'+flameWants())}
  else if(r.candle&&S.candle!==r.candle){probs++;L('candle',`The ${S.candle.toLowerCase()} flame flickers uneasily.${flameWants()}`)}
  else if(!r.candle&&S.candle){probs++;L('candle','The candle burned on, ignored.')}
  if(r.tarot&&!S.tarot){probs++;L('card',`It feels unguided, as if waiting for a card.${level?` The card it wants feels like ${CARDFEEL[r.tarot]||'something'}.`:''}`)}
  else if(r.tarot&&S.tarot!==r.tarot){probs++;L('card',`${S.tarot} turned its face away. Not this card.${level?` The card it wants feels like ${CARDFEEL[r.tarot]||'something else'}.`:''}`)}
  else if(!r.tarot&&S.tarot){probs++;L('card','The card stayed silent.')}
  const unmet=r.conds.filter(c=>!met(c));probs+=unmet.length;
  if(unmet.length){const[t,g]=condClue(unmet[0],r.themes);L('when',t);if(test)gained.push(...g)}
  const grade=probs===0?'Perfect':probs===1?'Good':probs<=3?'Clumsy':'Failed';
  if(test){const came=new Set();
    need.filter(x=>used.includes(x)&&!isBaseFor(x,r.type)).forEach(x=>(ITEM[x]?.props||[]).forEach(p=>r.themes.includes(p)&&came.add(p)));
    if(r.candle&&S.candle===r.candle)(D.colours[r.candle]||[]).forEach(p=>r.themes.includes(p)&&came.add(p));
    if(r.tarot&&S.tarot===r.tarot)(D.tarot[r.tarot]||[]).forEach(p=>r.themes.includes(p)&&came.add(p));
    swaps.forEach(s=>r.themes.includes(s.kw)&&came.add(s.kw));
    const c=[...came].slice(0,3);if(c.length){L('came',`You can feel ${c.join(', ').replace(/, ([^,]*)$/,' and $1')} in it.`);gained.push(...c)}}
  return{grade,lines,gained,probs,swaps,ok:need.filter(x=>used.includes(x)).length,total:need.length}}
/* Which reaction a customer reports: by grade, and for Good by the kind of miss. */
function missKind(ev){if(ev.grade!=='Good')return null;const s=ev.swaps&&ev.swaps[0];
  if(s&&s.kind!=='same'&&s.kind!=='lacks')return s.kind;return 'weak'}
function reactionFor(v,r,kind){const tKind=kind.includes('>');
  if(v.react){if(!tKind&&v.react[kind])return v.react[kind];
    if(tKind&&(!v.usual||v.usual==='any'||v.usual===kind.split('>')[0]))return v.react.target}
  return WALKIN[kind]}
function pickLine(g){const a=D.grades[g];return a[Math.floor(Math.random()*a.length)]}
