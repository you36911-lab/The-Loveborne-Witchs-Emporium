/* Crafting: comparing what is on the altar with a recipe, and the clue lines. */
/* ---------- crafting ---------- */
/* "The customer's birthstone" is not one stone: it is the crystal for the month the customer was born in, picked from
   the Crystals cupboard. A visit gives its customer's month as born:'March'; without one, any birthstone will do. */
const BIRTHSTONE="Birthstone (customer's)";
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
  wrong.forEach(w=>{const wp=ITEM[w]?.props||[];let best=null,bn=0;
    left.forEach(m=>{const n=(ITEM[m]?.props||[]).filter(p=>wp.includes(p)).length;if(n>bn){bn=n;best=m}});
    if(!best)return;left.splice(left.indexOf(best),1);
    const mp=ITEM[best].props,shared=mp.filter(p=>wp.includes(p));
    const kw=r.themes.find(t=>shared.includes(t))||shared[0];
    const a=ITEM[best],b=ITEM[w];let kind='same';
    if(a.t&&b.t&&a.t!==b.t)kind=a.t+'>'+b.t;else if(a.s&&b.s&&a.s!==b.s)kind=a.s==='Gentle'?'strong':'weak';
    const lacks=r.themes.filter(t=>mp.includes(t)&&!mix.has(t));
    /* Otherwise point at the one wrong spot: an off note the wrong ingredient brings, and what the right one would bring instead. */
    const sh=shownOf({props:mp,sk:'item:'+best}),pick=a=>a.find(p=>sh.includes(p))||a[0];
    const off=wp.filter(p=>!r.themes.includes(p)&&!mp.includes(p))[0],wantP=pick(mp.filter(p=>!wp.includes(p)&&!mix.has(p)));
    if(kind==='same'&&lacks.length)kind='lacks';else if(kind==='same'&&off&&wantP)kind='notes';
    out.push({want:best,got:w,kw,kind,lacks,off,wantP})});
  return out}
const CARDFEEL={"The Fool": "a first step taken lightly, with a grin and no fear of falling", "The Magician": "a mind fixed on one thing, hands that make, and making it work", "The High Priestess": "knowing without being told, seeing what is real, and the pictures that come at night", "The Empress": "lovely things, plenty of them, and being kind to yourself", "The Emperor": "a line drawn, a wall that keeps you safe, and feet set firmly on the ground", "The Hierophant": "old lessons remembered, people bound together, and what is real", "The Lovers": "two hearts drawn close and in tune", "The Chariot": "nerve, a win, and the open road", "Strength": "quiet nerve, self-belief, and a steady breath", "The Hermit": "a still mind that knows what is real without being told", "Wheel of Fortune": "chance, a turn of change, and a door swinging open", "Justice": "an honest answer and a line that holds", "The Hanged Man": "letting go, waiting it out, and coming back changed", "Death": "something finished, a deep change, and letting it go", "Temperance": "things in equal measure, mending, and a steady breath", "The Devil": "heat in the blood and a pull you can’t resist", "The Tower": "a sudden change, everything falling away, and seeing what is real", "The Star": "awe, mending, and being gentle with yourself", "The Moon": "night pictures, knowing without being told, and slow change", "The Sun": "gladness, a win, and self-belief", "Judgement": "mending, letting go, and starting over", "The World": "a win, a story finished, and everyone joined together"};
const CARDLOOK={'The Fool':'a traveller at the edge of a cliff','The Magician':'a figure with one hand raised to the sky','The High Priestess':'a veiled woman seated between two pillars','The Empress':'a woman resting in a field of wheat','The Emperor':'a stern figure on a stone throne','The Hierophant':'a teacher raising a blessing over two listeners','The Lovers':'two figures beneath an angel','The Chariot':'a rider drawn by two beasts','Strength':'a woman gently closing a lion\u2019s jaws','The Hermit':'a lone figure holding a lantern','Wheel of Fortune':'a great turning wheel','Justice':'a figure holding scales and a sword','The Hanged Man':'a man hanging calmly upside down','Death':'a rider on a pale horse','Temperance':'an angel pouring water between two cups','The Devil':'two figures chained beneath a horned shape','The Tower':'a tower struck by lightning','The Star':'a woman pouring water under a bright star','The Moon':'a moon above a path between two towers','The Sun':'a child on a horse under a blazing sun','Judgement':'an angel sounding a trumpet over rising figures','The World':'a dancer inside a wreath'};
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
function evaluate(r,test){
  const used=[...new Set(S.altar)],need=recipeNeeds(r,used,currentVisit()?.born);
  const missing=need.filter(x=>!used.includes(x)),wrong=used.filter(x=>!need.includes(x));
  /* someone else's birthstone in place of theirs: one problem, said plainly */
  const stones=Object.values(BIRTHSTONES),theirs=missing.find(x=>x!==BIRTHSTONE&&stones.includes(x)&&r.ing.includes(BIRTHSTONE)),
    other=theirs&&wrong.find(x=>stones.includes(x));
  if(other){missing.splice(missing.indexOf(theirs),1);wrong.splice(wrong.indexOf(other),1)}
  const swaps=findSwaps(r,missing,wrong,used);
  const loneMissing=missing.filter(m=>!swaps.some(s=>s.want===m)),loneWrong=wrong.filter(w=>!swaps.some(s=>s.got===w));
  let probs=swaps.length+loneMissing.length+loneWrong.length+(other?1:0);const lines=[];const gained=[];
  /* Each clue line is tagged with what it is about, so a wrong card isn't read as an ingredient problem. */
  const L=(k,t)=>lines.push({k,t});let il='';
  /* Ingredients: say how many are off, then one plain clue per problem, naming the ingredient that is wrong. */
  const ingProbs=swaps.length+loneMissing.length+loneWrong.length;
  if(other)L('ing',`The ${other.toLowerCase()} is a birthstone, but not theirs. Theirs is the stone of the month they were born in.`);
  if(ingProbs){const nw=swaps.length+loneWrong.length,nm=loneMissing.length,parts=[];
    if(nw)parts.push(`${nw} wrong`);if(nm)parts.push(`${nm} missing`);
    L('ing',nw&&nm?`${ingProbs} ingredients are off: ${parts.join(', ')}.`:`${ingProbs} ingredient${ingProbs>1?'s are':' is'} ${nw?'wrong':'missing'}.`);
    swaps.forEach(sw=>{L('ing',ingLine(sw));if(sw.kind==='notes')gained.push(sw.off,sw.wantP)});
    loneWrong.forEach(w=>{const props=(ITEM[w]?.props||[]).filter(p=>!r.themes.includes(p));
      if(props.length){L('ing',`Something from ${shelfOf(w)} doesn\u2019t belong: it adds ${props[0]}, which this doesn\u2019t want.`);gained.push(props[0])}
      else L('ing',`Something from ${shelfOf(w)} doesn\u2019t belong here.`)});
    loneMissing.forEach(m=>(m===BIRTHSTONE||r.ing.includes(BIRTHSTONE)&&stones.includes(m))?L('ing','It needs their birthstone: the stone of the month they were born in.'):L('ing',ITEM[m]?.look?`One more is needed from ${shelfOf(m)}. Picture it: ${ITEM[m].look}.`:`One more is needed from ${shelfOf(m)}.`))}
  if(r.candle&&!S.candle){probs++;L('candle','It feels as if it was made in the dark.')}
  else if(r.candle&&S.candle!==r.candle){probs++;L('candle',`The ${S.candle.toLowerCase()} flame flickers uneasily.`)}
  else if(!r.candle&&S.candle){probs++;L('candle','The candle burned on, ignored.')}
  if(r.tarot&&!S.tarot){probs++;L('card',`It feels unguided, as if waiting for a card. The card it wants feels like ${CARDFEEL[r.tarot]||'something'}.`)}
  else if(r.tarot&&S.tarot!==r.tarot){probs++;L('card',`${S.tarot} turned its face away. Not this card. The card it wants feels like ${CARDFEEL[r.tarot]||'something else'}.`)}
  else if(!r.tarot&&S.tarot){probs++;L('card','The card stayed silent.')}
  const unmet=r.conds.filter(c=>!met(c));probs+=unmet.length;
  if(unmet.length){const[t,g]=condClue(unmet[0],r.themes);L('when',t);if(test)gained.push(...g)}
  if(probs)lines.unshift({k:'sum',t:probs===1?'One thing is off.':`${probs} things are off in all.`});
  const grade=probs===0?'Perfect':probs===1?'Good':probs<=3?'Clumsy':'Failed';
  if(test){const came=new Set();
    need.filter(x=>used.includes(x)&&!isBaseFor(x,r.type)).forEach(x=>(ITEM[x]?.props||[]).forEach(p=>r.themes.includes(p)&&came.add(p)));
    if(r.candle&&S.candle===r.candle)(D.colours[r.candle]||[]).forEach(p=>r.themes.includes(p)&&came.add(p));
    if(r.tarot&&S.tarot===r.tarot)(D.tarot[r.tarot]||[]).forEach(p=>r.themes.includes(p)&&came.add(p));
    swaps.forEach(s=>r.themes.includes(s.kw)&&came.add(s.kw));
    const c=[...came].slice(0,3);if(c.length){L('came',`You can feel ${c.join(', ').replace(/, ([^,]*)$/,' and $1')} in it.`);gained.push(...c)}}
  return{grade,lines,gained,probs,swaps}}
/* Which reaction a customer reports: by grade, and for Good by the kind of miss. */
function missKind(ev){if(ev.grade!=='Good')return null;const s=ev.swaps&&ev.swaps[0];
  if(s&&s.kind!=='same'&&s.kind!=='lacks')return s.kind;return 'weak'}
function reactionFor(v,r,kind){const tKind=kind.includes('>');
  if(v.react){if(!tKind&&v.react[kind])return v.react[kind];
    if(tKind&&(!v.usual||v.usual==='any'||v.usual===kind.split('>')[0]))return v.react.target}
  return WALKIN[kind]}
function pickLine(g){const a=D.grades[g];return a[Math.floor(Math.random()*a.length)]}
