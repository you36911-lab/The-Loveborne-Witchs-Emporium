/* Rendering: the shop scene, the counter, shelves and altar. */
/* ---------- rendering ---------- */
/* Unread emails and new reviews show a badge on the computer. */
const unreadLetters=()=>S.letters.filter(x=>!x).length+Object.values(S.mail||{}).filter(x=>!x).length;
const newReviews=()=>Math.max(0,S.reviews.length-S.reviewsSeen);
/* the computer's red badge counts what is new; when it goes up (not when the game opens), a notification chime is heard */
let badgeWas=null;
function renderBadge(){const n=unreadLetters()+newReviews(),bd=$('#booksBadge');bd.hidden=!n;bd.textContent=n;$('#pcBtn').setAttribute('aria-label',n?`Computer: ${n} new`:'Computer');
  if(badgeWas!==null&&n>badgeWas)playNotify();badgeWas=n}
/* ---------- the shop scene: every counter object is a button ---------- */

/* The book stack: each book cut from the stack picture along its drawn outline (a watershed from points inside each book,
   so every cut follows the darkest line between two books) (659x672): left, top, width in that frame. */
const STACK=[['Recipe Book','book-recipe-book',79,0,528],['Book of Making','book-book-of-making',71,77,559],['Grimoire of Craft','book-grimoire-of-craft',29,154,603],
  ['Almanac of Sky & Seasons','book-almanac-of-sky-seasons',0,224,659],['Tarot Companion','book-tarot-companion',37,327,584],['Gentle Bestiary','book-gentle-bestiary',20,360,630],
  ['Crystal Almanac','book-crystal-almanac',19,431,637],['Herbiary','book-herbiary',32,509,614]];
function buildScene(){
  document.querySelectorAll('#scene img[data-img]').forEach(i=>i.src=ASSETS.objects[i.dataset.img]);
  $('#craftBell img').src=ASSETS.altarBell;
  const stack=STACK.map(([b,img,x,y,w])=>`<button data-openbook="${esc(b)}" aria-label="Open the ${esc(b)}" style="left:${x/659*100}%;top:${y/672*100}%;width:${w/659*100}%"><img src="${ASSETS.objects[img]}" alt=""></button>`).join('');
  $('#bookStack').innerHTML=$('#altarBooks').innerHTML=stack;
  /* preload and decode ahead, so the fades and the slide down to the workroom don't stall on a big picture */
  [...Object.values(ASSETS.backgrounds),...Object.values(ASSETS.characters),ASSETS.altarRoom,ASSETS.cabinetInside,...ASSETS.testCandles].forEach(src=>{const im=new Image();im.src=src;im.decode?.().catch(()=>{})});
}
/* Two full-screen views, one above the other: the shop counter, and the altar below it.
   The down arrow slides the world up to show the altar; the up arrow slides it back. */
let view='shop';
function goTo(v){view=v;$('#world').classList.toggle('down',v==='altar');$('#shopView').inert=v!=='shop';$('#altarView').inert=v!=='altar'}
function setView(v){goTo(v);render()}
/* Backgrounds: one picture per hour, plus dawn before the shop opens; on a festival's days, that festival's own
   pictures. Two layers cross-fade. The workroom below has its own picture (ASSETS.altarRoom). */
let bgNow='',bgTop='bgA',dawnUntil=0;
function bgSrc(key){const f=today()?.sabbat;return ASSETS.festivals.includes(f)?ASSETS.festivalBackground(f,key):ASSETS.backgrounds[key]}
function setBackground(key){const src=bgSrc(key);if(src===bgNow)return;
  /* a festival's first picture: load the other hours of it ahead too */
  if(!bgNow.includes(src.slice(0,src.lastIndexOf('-'))))HOURS.concat('Dawn').forEach(h=>{const im=new Image();im.src=bgSrc(h)});
  bgNow=src;fadeLight(lightFor(key));
  /* the talk at the counter is more see-through the darker the room is (see .dialogue in style.css) */
  {const L=lightFor(key),lum=.3*L[0]+.59*L[1]+.11*L[2];$('#counter').style.setProperty('--dlg-a',Math.max(.76,Math.min(.92,.92-(1-lum)*.6)).toFixed(2))}
  const next=bgTop==='bgA'?'bgB':'bgA';$('#'+next).style.backgroundImage=`url("${src}")`;
  {const br=BG_BRIGHTER[today()?.sabbat+'|'+key];$('#'+next).style.filter=br?`brightness(${br})`:''}
  const room=$('#room');room.style.backgroundImage=`url("${ASSETS.altarRoom}")`;
  /* full address: a url() in a variable is read from the stylesheet's folder */
  room.style.setProperty('--room-img',`url("${new URL(ASSETS.altarRoom,location.href).href}")`);
  room.style.setProperty('--wall-l',`url("${new URL(ASSETS.altarWallL,location.href).href}")`);
  room.style.setProperty('--wall-r',`url("${new URL(ASSETS.altarWallR,location.href).href}")`);
  room.style.setProperty('--inside-img',`url("${new URL(ASSETS.cabinetInside,location.href).href}")`);
  document.documentElement.style.setProperty('--cabinet-frame',`url("${new URL(ASSETS.cabinetInside,location.href).href}")`);
  document.documentElement.style.setProperty('--cabinet-back',`url("${new URL(ASSETS.cabinetBack,location.href).href}")`);
  $('#'+next).classList.add('on');$('#'+bgTop).classList.remove('on');bgTop=next}
/* The light on the objects: red, green and blue for each hour (other hours are Noon's 1, 1, 1). It moves from the
   old hour's light to the new one over the same time the background takes to fade (1.2s in style.css). */
const LIGHT={Dawn:[.88,.88,1.02],Sunrise:[1,.93,.91],Twilight:[.95,.85,.88],Nightfall:[.9,.8,.86]},LIGHT_FADE_MS=1200;
/* The festival pictures are lit differently (most are darker and warmer, candlelit), so each has its own light, measured
   the same way: the tablecloth and shelves at each hour against that festival's Noon for the colour, and that festival's
   Noon against the everyday Noon for how bright the room is. Red, green, blue. */
const FESTIVAL_LIGHT={
  Samhain:   {Dawn:[.65,.59,.6], Sunrise:[.7,.64,.64], Noon:[.75,.75,.75],Twilight:[.66,.6,.63], Nightfall:[.57,.5,.55]},
  Yule:      {Dawn:[.78,.77,.78],Sunrise:[.76,.73,.75],Noon:[.76,.76,.76],Twilight:[.75,.72,.77],Nightfall:[.53,.54,.62]},
  Imbolc:    {Dawn:[.85,.85,.83],Sunrise:[.99,.92,.69],Noon:[.73,.73,.73],Twilight:[.64,.67,.72],Nightfall:[.65,.64,.66]},
  Ostara:    {Dawn:[1.06,1,.99], Sunrise:[1.07,1.05,1.06],Noon:[1.09,1.09,1.09],Twilight:[.81,.77,.84],Nightfall:[.95,.87,.8]},
  Beltane:   {Dawn:[.69,.76,.87],Sunrise:[.8,.79,.82], Noon:[.84,.84,.84],Twilight:[.68,.66,.78],Nightfall:[.63,.65,.79]},
  Litha:     {Dawn:[.6,.7,.79],  Sunrise:[.97,.85,.7], Noon:[.83,.83,.83],Twilight:[.73,.69,.67],Nightfall:[.78,.7,.71]},
  Lughnasadh:{Dawn:[.9,.86,.89], Sunrise:[.9,.89,.99], Noon:[.93,.93,.93],Twilight:[.63,.64,.78],Nightfall:[.65,.65,.66]},
  Mabon:     {Dawn:[.74,.71,.72],Sunrise:[.75,.77,.81],Noon:[.71,.71,.71],Twilight:[.67,.63,.66],Nightfall:[.56,.53,.51]}};
/* A picture shown a touch brighter than drawn, where it read too dark in play. */
const BG_BRIGHTER={'Samhain|Nightfall':1.08};
function lightFor(key){const f=today()?.sabbat;return (FESTIVAL_LIGHT[f]||LIGHT)[key]||[1,1,1]}
let lightNow=[1,1,1];
function fadeLight(to){const from=lightNow,t0=performance.now();
  cancelAnimationFrame(fadeLight.raf);
  const step=t=>{const k=Math.min(1,(t-t0)/LIGHT_FADE_MS),e=k*k*(3-2*k);  /* eased like the background */
    lightNow=from.map((v,i)=>+(v+(to[i]-v)*e).toFixed(3));
    $('#lightMatrix').setAttribute('values',`${lightNow[0]} 0 0 0 0  0 ${lightNow[1]} 0 0 0  0 0 ${lightNow[2]} 0 0  0 0 0 1 0`);
    if(k<1)fadeLight.raf=requestAnimationFrame(step)};
  fadeLight.raf=requestAnimationFrame(step)}
/* A new day opens at dawn: the day's name shows for a moment, then the morning light comes in.
   It reads like a chapter heading: "Day Twenty-One" in the title serif between two thin pink rules, and the weekday
   (and festival) in small capitals below. */
const NUM_WORDS=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],
  TENS_WORDS=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
const numWord=n=>n<20?NUM_WORDS[n]:n<100?TENS_WORDS[Math.floor(n/10)]+(n%10?'-'+NUM_WORDS[n%10]:''):String(n);
function showDawn(){const T=today();dawnUntil=Date.now()+DAWN_MS;
  $('#dayCard').innerHTML=`<span class="dc-title"><i class="dc-rule"></i>Day ${numWord(S.day)}<i class="dc-rule"></i></span><small>${esc(T.weekday)}${T.sabbat?' \u2726 '+esc(T.sabbat):''}</small>`;$('#dayCard').classList.add('on');document.body.classList.add('dawning');
  render();setTimeout(()=>{$('#dayCard').classList.remove('on');document.body.classList.remove('dawning');render()},DAWN_MS);setTimeout(render,DAWN_MS+AFTER_DAWN_MS)}
/* The hour is not shown as a label; the background shows it. A quiet hour's mood line runs along the bottom
   of the scene like a film subtitle. */
function renderScene(){renderAura();renderCustomer();setBackground(Date.now()<dawnUntil?'Dawn':HOURS[S.h]);
  const v=currentVisitor(),note=$('#sceneNote'),av=v&&v.key&&(!(v.tales||[]).length||v.newsDone)?visitByKey(v.key):null;
  const thinking=!!av&&av.kind==='advice';  /* while a customer waits for advice, the witch's own thought runs as the subtitle */
  if(!thinking&&(v||S.parting)||Date.now()<dawnUntil+AFTER_DAWN_MS||$('#dayEnd').classList.contains('open')){note.hidden=true;return}
  note.dataset.thought=thinking?'1':'';if(!thinking)note.style.animation='';  /* a thought waits for the customer's words (see typeBalloon) */
  const line=thinking?adviceThought(av):moodLine();if(note.hidden||note.textContent!==line){note.textContent=line;note.hidden=false;note.classList.remove('in');void note.offsetWidth;note.classList.add('in')}}
/* The bell brings the next customer, and only the bell does: someone due this hour comes straight in; otherwise time moves
   on to the next hour with someone (or something) in it, and if that is a customer, they come in. */
function ringBell(){const bell=$('#bellBtn');
  S.parting=null;  /* the bell sends a lingering customer on their way */
  if(currentVisitor()){bell.classList.remove('nope');void bell.offsetWidth;bell.classList.add('nope');playBell();toast('Someone is already at the counter.');return}
  bell.classList.remove('ring');void bell.offsetWidth;bell.classList.add('ring');playBell();
  if(someoneDue()){S.rung=true;S.result=null;render();return}
  if(S.h>=3){nextHour();return}
  const mail0=Object.keys(S.mail||{}).length;
  do{nextHour(true)}while(S.h<3&&!someoneDue()&&Object.keys(S.mail||{}).length===mail0);
  if(someoneDue())S.rung=true;
  S.result=null;render()}
function openInfo(title,html){$('#infoTitle').textContent=title;$('#infoBody').innerHTML=html;$('#info').classList.add('open')}
/* The aura is read from the colour glowing around the crystal ball, never as words.
   Hester's first letter says what the colours mean. */
function currentVisit(){const v=currentVisitor();if(!v)return null;
  return v.type==='report'?S.reports.find(r=>r.at===v.at&&r.who===v.who):visitByKey(v.key)}
function renderAura(){const cur=currentVisit(),a=cur&&X.auras[cur.aura],ball=$('#crystalBtn');
  ball.classList.toggle('glowing',!!a);ball.dataset.aura=a?cur.aura:'';if(a)ball.style.setProperty('--aura-glow',a[0])}
/* The customer stands behind the counter. Only people with a picture in ASSETS.characters are drawn; a visit can name
   its own picture (pic in story.js), as when Rosalind brings her children. */
/* When someone comes in, the door is heard closing behind them: when a picture appears where nobody stood, and when a
   new customer takes the place of one still lingering at the counter (or of someone else). Not when the game is opened
   with a customer already there, and not when the customer at the counter only finishes and lingers. */
let customerWas=null;  /* who stood at the counter at the last redraw: {id, parting}, or false for nobody */
function renderCustomer(){const live=currentVisit(),cur=live||S.parting,src=cur&&ASSETS.characters[cur.pic||cur.who],box=$('#customer'),img=box.querySelector('img');
  if(src&&img.getAttribute('src')!==src)img.src=src;box.classList.toggle('on',!!src);
  const now=src?{id:(cur.pic||'')+'|'+cur.who,parting:!live}:false;
  if(now&&customerWas!==null&&(!customerWas||(live&&(customerWas.parting||customerWas.id!==now.id))))playDoorClose();
  customerWas=now}
/* The till shows today's receipts on their own, laid over the shop; a click anywhere puts them away. */
function openReceipts(){if(!S.pend.length){toast('No receipts yet today.');return}
  const m=$('#receiptsView');m.innerHTML=`<div class="receipts">${S.pend.map(receiptHTML).join('')}</div>`;m.classList.add('open')}
/* Failed tests are five black candles on a candelabra on the altar, right of the card: each test craft that isn't
   perfect puts one out; when all five are out it costs a star and they are lit again. The fifth going out shows the
   candelabra dark for a moment (ASSETS.testCandles[0]) before all five light again. Each one going out is heard. */
let candlesFails=null,candlesDark=0;
function renderCandles(){const f=S.failTests||0,lit=5-f%5,box=$('#testCandles'),img=box.querySelector('img');
  const put=n=>{const src=ASSETS.testCandles[n];if(img.getAttribute('src')!==src)img.src=src};
  if(candlesFails!==null&&f>candlesFails)playCandleOut();  /* a candle has just gone out: a whoosh and a snuff (sound.js) */
  if(candlesFails!==null&&f>candlesFails&&f%5===0){clearTimeout(candlesDark);put(0);candlesDark=setTimeout(()=>{candlesDark=0;put(5-(S.failTests||0)%5)},1600)}
  else if(!candlesDark)put(lit);
  candlesFails=f;
  box.title=`${lit} of 5 candles lit. Every test craft that isn't perfect puts one out; when all five are out, it costs a one-star review.`;
  box.setAttribute('aria-label',`Test crafts: ${lit} of 5 candles lit`)}
/* the recipe the customer at the counter has asked for, while their order is open; otherwise null */
function orderRecipe(){const q=currentVisitor();return q&&q.type==='new'&&S.activeNow===q.key?D.recipes[visitByKey(q.key).rid]:null}
/* There is no top bar: the date is on the computer's taskbar and the rating in its Shop app. */
function renderTop(){renderBadge();renderCandles();if($('#pc').classList.contains('open'))renderPCBar()}
/* The workroom cabinets. Behind every painted door is one kind of thing, named on the door's label. Clicking a door
   swings it open and what is inside comes out beside it (#shelfOpen); tapping a thing lays it on the table or takes it
   off again. Door places are in pixels of the room picture (assets/scene/altar-room.jpg) as first drawn at 1376×768; it is now 2752×1536, the same shape. The bottom row
   of doors is hidden behind the table, so it stays shut. */
const ROOM_W=1376,ROOM_H=768;
const DOOR_COLS=[[214,125,'l',275.5],[359,126,'r',422],[889,126,'l',952.5],[1035,125,'r',1099.5]];  /* left, width, hinge side, label centre */
const DOOR_ROWS=[[110,109,163],[226,102,276],[334,96,380],[433,94,478]];                          /* top, height, label centre */
/* row by row, door by door: the left cabinet holds the kitchen things, the right one the rest */
const SHELVES=[['Herbs & flowers','Spices','Candles','Tarot'],
  ['Fruits','Pantry: salts, sugars & baking','Crystals','Animal gifts'],
  ['Base waters','Oils, butters & waxes','Buttons','Threads & ribbons'],
  ['Resins & incense','Inks & paints','Wood & branches','Findings & tools']];
/* the word written on each door's painted label (short, the paper is small); the open cupboard shows the full name */
const PLATE={'Herbs & flowers':'Herbs','Spices':'Spices','Fruits':'Fruits','Pantry: salts, sugars & baking':'Pantry','Base waters':'Waters',
  'Oils, butters & waxes':'Oils','Resins & incense':'Resins','Inks & paints':'Inks','Candles':'Candles','Tarot':'Tarot',
  'Crystals':'Crystals','Animal gifts':'Critters','Buttons':'Buttons','Threads & ribbons':'Threads','Wood & branches':'Wood','Findings & tools':'Findings'};
const SHELFNAME={'Base waters':'Waters & bottles','Tarot':'Tarot cards'};
let openShelf='',shownShelf='';
/* how many things from this cupboard are on the table now */
function shelfOnTable(c){if(c==='Candles')return S.candle?1:0;if(c==='Tarot')return S.tarot?1:0;
  return D.items.filter(i=>i.c===c&&S.altar.includes(i.n)).length}
/* The doors are made once (so they can swing); after that only their open state and counts change. */
function buildDoors(){const pc=(v,of)=>(v/of*100).toFixed(3);
  $('#cubbies').innerHTML=SHELVES.map((row,r)=>row.map((c,k)=>{const [x,w,hinge,px]=DOOR_COLS[k],[y,h,py]=DOOR_ROWS[r];
    return `<button class="cubby hinge-${hinge}" data-shelf="${esc(c)}" data-side="${k<2?'L':'R'}" aria-label="${esc(SHELFNAME[c]||c)}" title="${esc(SHELFNAME[c]||c)}" `+
      `style="left:${pc(x,ROOM_W)}%;top:${pc(y,ROOM_H)}%;width:${pc(w,ROOM_W)}%;height:${pc(h,ROOM_H)}%;--x:${pc(x,ROOM_W)};--y:${pc(y,ROOM_H)}">`+
      `<span class="door"><span class="face"><span class="plate" style="left:${pc(px-x,w)}%;top:${pc(py-y,h)}%">${esc(PLATE[c])}</span><b class="count" style="left:${pc(px-x,w)}%;top:${pc(py-y,h)}%" hidden></b></span><span class="edge"></span></span></button>`}).join('')).join('')}
function renderShelves(){
  if(!$('#cubbies').childElementCount)buildDoors();
  let side='L';
  document.querySelectorAll('#cubbies .cubby').forEach(d=>{const c=d.dataset.shelf,n=shelfOnTable(c),on=openShelf===c,b=d.querySelector('b');
    d.classList.toggle('open',on);d.setAttribute('aria-expanded',on);b.hidden=!n;d.setAttribute('aria-label',(SHELFNAME[c]||c)+(n?`, ${n} on the table`:''));if(on)side=d.dataset.side});
  const box=$('#shelfOpen');if(!openShelf){box.hidden=true;box.innerHTML='';shownShelf='';return}
  box.hidden=false;box.className='shelfopen from'+side+(openShelf==='Tarot'?' wide':'');
  /* a newly opened cupboard plays its coming-out again */
  if(shownShelf!==openShelf){box.style.animation='none';void box.offsetWidth;box.style.animation='';shownShelf=openShelf}
  const was=box.querySelector('.cabinside'),top=was&&box.dataset.shelf===openShelf?was.scrollTop:0;box.dataset.shelf=openShelf;
  box.setAttribute('aria-label',SHELFNAME[openShelf]||openShelf);box.innerHTML=`<div class="cabinside"><div class="chips${SHELF_CATEGORIES.includes(openShelf)?' shelf':''}">${shelfItemsHTML(openShelf)}</div></div>`;
  /* No scrollbar: the cupboard scrolls, and its top or bottom edge falls into shadow while there is more that way.
     It keeps its place when a click redraws it. */
  const ins=box.querySelector('.cabinside');ins.scrollTop=top;
  const edges=()=>{const more=ins.scrollHeight-ins.clientHeight-ins.scrollTop;box.classList.toggle('moreup',ins.scrollTop>2);box.classList.toggle('moredown',more>2)};
  ins.addEventListener('scroll',edges,{passive:true});ins.addEventListener('load',edges,true);edges()}
/* how tall an ingredient stands (ITEM_SIZE in config.js) */
const sizeOf=n=>ITEM_SIZE[n]??ITEM_SIZE_BY_SHELF[ITEM[n]?.c]??.7;
function shelfItemsHTML(c){
  if(c==='Candles')return Object.keys(D.colours).map(k=>ASSETS.candles[k]?`<button class="chip jar ${S.candle===k?'on':''}" data-candle="${esc(k)}" title="${esc(k)} candle" aria-label="${esc(k)} candle" aria-pressed="${S.candle===k}"><span class="bot"><img src="${ASSETS.candles[k]}" alt="" loading="lazy" style="--h:.8"></span></button>`
    :`<button class="swatch ${S.candle===k?'on':''}" style="background:${COLOURHEX[k]}" data-candle="${esc(k)}" title="${esc(k)} candle" aria-label="${esc(k)} candle" aria-pressed="${S.candle===k}"></button>`).join('');
  if(c==='Tarot')return Object.keys(D.tarot).map(t=>`<button class="chip ${ASSETS.tarot[t]?'card':''} ${S.tarot===t?'on':''}" data-tarot="${esc(t)}" aria-pressed="${S.tarot===t}" title="${esc(t)}" aria-label="${esc(t)}">${ASSETS.tarot[t]?`<img src="${ASSETS.tarot[t]}" alt="" loading="lazy">`:`<span class="nm">${esc(t)}</span>`}</button>`).join('');  /* a card's picture has its name printed on it */
  const shelf=SHELF_CATEGORIES.includes(c);  /* bottles and jars stand on a plank */
  return D.items.filter(i=>i.c===c&&i.n!==BIRTHSTONE).map(i=>{  /* the birthstone is one of the crystals, by month */
    const pic=ASSETS.items[i.n],bottle=shelf&&pic;
    const pi=pic?`<span class="bot"><img src="${pic}" alt="" loading="lazy" style="--h:${sizeOf(i.n)}"></span>`:'';
    const img=!pic?'':bottle?`<span class="pic">${pi}</span>`:pi;
      /* a picture names itself (most have their name on the label), so only things without one show their name; hover shows it either way */
    return `<button class="chip ${pic?'jar':''} ${bottle?'vessel':''} ${S.altar.includes(i.n)?'on':''}" data-item="${esc(i.n)}" title="${esc(i.n)}" aria-label="${esc(i.n)}" aria-pressed="${S.altar.includes(i.n)}">${img}${pic?'':`<span class="nm">${esc(i.n)}</span>`}</button>`}).join('')}
function resultHTML(){const R=S.result;return `<div class="g">${R.test?'Test craft':'Given'}</div>${R.first?`<p style="margin:4px 0">${esc(R.first)}</p>`:''}${R.lines.map((l,i,A)=>typeof l==='string'?`<p style="margin:2px 0">${kw(l)}</p>`:`<p style="margin:2px 0${i&&A[i-1].k===l.k?';padding-left:14px':''}">${i&&A[i-1].k===l.k?'':`<span class="tag">${CLUETAG[l.k]}</span> `}${kw(l.t)}</p>`).join('')}`}
function knownRecipes(){return Object.values(D.recipes)}
function renderAltar(){
  const orderR=orderRecipe();
  const sel=$('#target');const rs=knownRecipes();
  /* choose the spell type first, then a recipe of that type (names only, no numbers) */
  if(S.target&&D.recipes[S.target])S.ttype=D.recipes[S.target].type;
  const types=[...new Set(rs.map(r=>r.type))].sort();
  $('#ttype').innerHTML='<option value="">Spell type\u2026</option>'+types.map(t=>`<option ${t===S.ttype?'selected':''}>${esc(t)}</option>`).join('');
  sel.innerHTML=S.ttype?'<option value="">Recipe\u2026</option>'+rs.filter(r=>r.type===S.ttype).sort((a,b)=>a.name.localeCompare(b.name)).map(r=>`<option value="${r.id}" ${String(r.id)===String(S.target)?'selected':''}>${esc(r.name)}</option>`).join(''):'<option value="">Recipe\u2026</option>';
  sel.disabled=!S.ttype;
  sel.value=S.target||'';
  /* what is laid out stands on the table; tap a thing to put it back */
  $('#plates').innerHTML=S.altar.length?S.altar.map(n=>`<button class="ontable" data-item="${esc(n)}" title="${esc(n)}: put it back" aria-label="Put ${esc(n)} back">${ASSETS.items[n]?`<img src="${ASSETS.items[n]}" alt="" style="--h:${sizeOf(n)}">`:`<i class="minijar"></i><span class="nm">${esc(n)}</span>`}</button>`).join(''):'';
  /* the candle stand is always on the altar; a chosen candle stands in its cup, behind the cup's front lip (a second copy
     of the stand, cut to just its front, laid over the candle). An empty stand opens the Candles cupboard. */
  const lit=S.candle?`<button class="ontable" data-candle="${esc(S.candle)}" title="${esc(S.candle)} candle: put it back" aria-label="Put the ${esc(S.candle)} candle back">${ASSETS.candles[S.candle]?`<img src="${ASSETS.candles[S.candle]}" alt="">`:`<i class="candle" style="--cc:${COLOURHEX[S.candle]}"></i>`}</button>`:'';
  $('#candleSlot').innerHTML=`<div class="stand">${S.candle?'':'<button class="standbtn" data-shelf="Candles" title="Choose a candle" aria-label="Choose a candle"></button>'}<img class="standpic" src="${ASSETS.candleStand}" alt="">${lit}<img class="standfront" src="${ASSETS.candleStand}" alt=""></div>`;
  /* the card lies flat on the table; with no card, an outline shows where it goes (clicking it opens the tarot cupboard) */
  $('#tarotSlot').innerHTML=S.tarot?`<button class="ontable laid" data-tarot="${esc(S.tarot)}" title="Put ${esc(S.tarot)} back" aria-label="${esc(S.tarot)}"><span class="cardbed">${ASSETS.tarot[S.tarot]?`<img src="${ASSETS.tarot[S.tarot]}" alt="">`:`<span class="nm">${esc(S.tarot)}</span>`}</span></button>`
    :'<button class="ontable laid" data-shelf="Tarot" title="Choose a tarot card" aria-label="Choose a tarot card"><span class="cardbed empty"></span></button>';
  $('#craftBell').classList.toggle('ready',!!(orderR&&S.altar.length&&S.target));
  const res=$('#result');
  if(S.result){res.hidden=false;res.innerHTML=resultHTML()}else res.hidden=true;
}
/* A tutorial is shown once: during the first visit of its kind, and never again after that visit. The × puts it away for good;
   "Skip tutorials" turns them all off (S.tutOff). */
function tutorial(kind,key){S.tut=S.tut||{};if(S.tutOff||S.tut[kind]&&S.tut[kind]!==key)return '';S.tut[kind]=key;
  return `<div class="coach"><button class="dclose" data-tutclose="${kind}" aria-label="Close this tutorial" title="Close this tutorial">×</button>${TUTORIAL[kind](visitByKey(key))}<button class="tutskip" data-tutskip="1">Skip tutorials</button></div>`}
const TUTORIAL={
  order:()=>`<b>Your first order</b><ol><li>Listen. Customers never name the recipe: what they say, what they do (in brackets) and the colour in the crystal ball all count.</li><li>Find the one recipe that fits in the books on the counter.</li><li>Take the arrow down to the altar. Choose the recipe, then lay out what it needs, its candle and its card.</li><li>Test craft from the Recipe Book as often as you like (<b>Test craft this</b>). When it is right, ring the <b>silver bell</b> on the altar to make it.</li><li>What you made waits on the counter. Click it to hand it over.</li></ol>`,
  advice:v=>`<b>Just a question</b><p>They only want your advice, not a spell. There is nothing to make.</p><ol><li>Listen for three things: what it is for (a keyword), who or what it is for (the body, the heart or the home) and how strong it should be.</li><li>Look it up in ${v.ask.cat==='Crystals'?'the Crystal Almanac':'the Herbiary'}.</li><li>Type its name below (after two letters, names from ${esc(v.ask.cat.toLowerCase())} are suggested) and press <b>Answer</b>.</li></ol>`};
/* Everything at the counter is in one speech balloon: what they do (the cue) in brackets first, then what they say.
   Nobody is labelled: who they are comes out in what they say and do. */
const balloon=(v,inner)=>`<div class="balloon">${v.cue?`<p class="cue">(${esc(v.cue)})</p>`:''}${inner}</div>`;
/* The counter: what the customer says, in a balloon over the shop window. Hidden when nobody is there,
   unless there is a result to read (advice answered at the counter). Tips go under the day info. */
function renderCounter(){fillCounter();balloonEnter();typeBalloon()}
/* Whenever someone new speaks, the balloon floats up and fades in. A customer walking in shows first (the picture fades
   in over 1.2s, see .customer in style.css) and the balloon follows a moment later; someone already standing there speaks straight away. */
let balloonKey='',balloonWho='';
function balloonEnter(){const q=S.queue,el=$('#counter');
  const key=q?(q.type==='report'?'report:'+q.at+q.who:q.key+(q.newsDone?':order':'')):S.parting?'parting:'+S.parting.who:'';
  if(key===balloonKey)return;
  const v=q?currentVisit():S.parting,who=v&&ASSETS.characters[v.pic||v.who]?(v.pic||v.who):'';
  const wait=who&&who!==balloonWho?1400:0;
  el.style.setProperty('--enter-delay',wait/1000+'s');balloonKey=key;balloonWho=who;typeFrom=Date.now()+wait+300;
  if(!key)return;el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter')}
/* The words in the balloon appear one letter at a time, starting as the balloon floats in. The counter is redrawn on
   every click, so each letter's delay is counted from typeFrom and the typing carries on where it was. Clicking the
   balloon shows the rest at once. */
let typeFrom=0;
const TYPE_STEP=.025;  /* seconds per letter */
function typeBalloon(){const b=$('#counter .balloon');if(!b||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const nodes=[],walk=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);while(walk.nextNode())nodes.push(walk.currentNode);
  const t=(typeFrom-Date.now())/1000,total=nodes.reduce((n,nd)=>n+[...nd.data].length,0);if(t+total*TYPE_STEP<=0)return;
  let i=0;nodes.forEach(nd=>{const f=document.createDocumentFragment();
    for(const c of nd.data){const s=document.createElement('span');s.className='ch';s.textContent=c;s.style.animationDelay=(t+i++*TYPE_STEP).toFixed(3)+'s';f.append(s)}
    nd.replaceWith(f)});
  /* "I don't know how to make this", and the advice answer (the name box and Answer), wait until the customer has finished speaking. */
  const after=$('#counter .after-words'),wait=t+total*TYPE_STEP+.6;if(after)after.style.animation=`afterWords .4s ease-out ${wait.toFixed(3)}s both`;
  /* the witch's thought at an advice question comes last: after the words, and after the name box has come up */
  const note=$('#sceneNote');if(note.dataset.thought&&!note.hidden)note.style.animation=`subIn .6s ease-out ${(wait+.7).toFixed(3)}s both`;
  b.onclick=()=>{typeFrom=0;b.querySelectorAll('.ch').forEach(s=>s.style.animation='none');if(after)after.style.animation='none';if(note.dataset.thought)note.style.animation=`subIn .6s ease-out .5s both`}}
function fillCounter(){const tip=dayTip(),tp=$('#tip');tp.hidden=!tip;tp.innerHTML=tip;
  const q=currentVisitor();renderMade(q);const el=$('#counter');el.hidden=false;el.classList.remove('plain');
  /* News about earlier customers comes first, on its own, so it is never read as part of this customer's order. */
  if(q&&q.type==='report'){const r=S.reports.find(r=>r.at===q.at&&r.who===q.who);
    el.innerHTML=`${balloon({cue:`back to tell you how ${r.what||'it'} went`},kw(r.text))}<div class="row"><button class="main" id="reportBtn">Thank you for telling me</button></div>`;return}
  if(q&&(q.tales||[]).length&&!q.newsDone){const v=visitByKey(q.key);
    el.innerHTML=`${balloon({cue:'before anything else, they pass on some news'},talesHTML(q))}<div class="row"><button class="main" id="newsBtn">And what can I do for you?</button></div>`;return}
  if(!q){if(S.parting){el.innerHTML=balloon({},`<p>${kw(S.parting.text)}</p>`);return}
    if(S.result&&!S.result.test){el.classList.add('plain');el.innerHTML=resultHTML()}else{el.hidden=true;el.innerHTML=''}return}
  const v=visitByKey(q.key);
  if(v.kind==='advice'){
    /* The answer is typed. The counter is redrawn on clicks, so what was typed (and the focus) is kept in adviceDraft. */
    const focused=document.activeElement&&document.activeElement.id==='adviceIn';
    if(adviceDraft.key!==q.key)adviceDraft={key:q.key,text:'',hi:-1};
    el.innerHTML=`${balloon(v,`<p>“${esc(v.line)} ${esc(v.question)}”</p>`)}${tutorial('advice',q.key)}<div class="row after-words"><div class="askwrap"><input id="adviceIn" type="text" autocomplete="off" spellcheck="false" placeholder="Type a name…" aria-label="Your answer" aria-autocomplete="list" aria-controls="adviceList"><div class="suggest" id="adviceList" role="listbox" hidden></div></div><button class="main" id="adviceBtn">Answer</button></div>`;
    const inp=$('#adviceIn');inp.value=adviceDraft.text;fillSuggest();if(focused){inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length)}return}
  /* Every order can be made while the customer waits. */
  S.activeNow=q.key;
  el.innerHTML=`${balloon(v,`<p>“${esc(v.line)}”</p>`)}${tutorial('order',q.key)}${S.made?'':`<div class="row after-words"><button class="main" id="cantBtn" title="Let them go. They leave empty-handed.">I don’t know how to make this</button></div>`}`}
/* What was made at the altar stands on the counter until it is given; it goes if its customer does. */
function renderMade(q){if(S.made&&(!q||q.type!=='report'&&S.made.for!==visitorId(q)))S.made=null;
  const b=$('#madeBtn'),m=S.made;b.hidden=!m;if(!m)return;
  $('#madeTag').textContent=m.name;b.title=b.ariaLabel=`Give them the ${m.type.toLowerCase()}`}
function sendAway(){const q=S.queue;if(!q||q.type!=='new')return;const v=visitByKey(q.key);S.seen[q.key]=true;S.stats.missed++;record('Missed',v.who,'No sale',q.key);S.activeNow=null;S.queue=null}
function dayTip(){if(S.day===1&&S.h===0&&!S.tutOff&&!S.letters.every(Boolean))return 'There are three emails waiting. Click the <b>computer</b> on the counter and open <b>Moonpost</b>.';
  return ''}
function render(){if(Date.now()>=dawnUntil)checkMail();  /* post waits until the dawn card has gone */
  renderTop();renderScene();renderShelves();renderCounter();renderAltar();save();autoTick()}
let autoT=null;
function hourDone(){return !currentVisitor()&&!S.altar.length&&!S.candle&&!S.tarot}
/* Time never moves by itself. While a customer is at the counter, time waits. Once nobody is waiting, the bar says
   whether anything is left to do this hour and offers Next hour; at Nightfall it offers Close for the night. */
/* A quiet hour gets one line of mood from the hour, a full moon and the festival. */
/* The witch thinking to herself while an advice customer waits: it only narrows the answer to the right kind of thing. */
function adviceThought(v){const c=v.ask.cat;
  if(c==='Crystals')return 'A crystal that does just that… I’ve read about one somewhere.';
  if(c==='Herbs & flowers')return 'There’s a herb for that… it was in one of the books, wasn’t it?';
  return `Something from ${c.toLowerCase()} for that… I’ve seen it somewhere.`}
/* On a festival's days the shop has its own pictures, lit differently (mist, snow, candles), so the mood line
   describes that picture instead of the everyday one. */
const FESTIVAL_MOOD={
  Samhain:{Sunrise:'Mist hangs over the fallen leaves; the candles are still lit.',Noon:'Autumn light lies across the cloth, and leaves drift past the glass.',
    Twilight:'The candles burn brighter as the day goes dim.',Nightfall:'Lanterns glow in the dark garden. The veil is thin tonight.'},
  Yule:{Sunrise:'A pink winter dawn over the snow.',Noon:'Snow light fills the shop, pale and quiet.',
    Twilight:'The snow turns lilac as the day goes.',Nightfall:'Snow falls in the dark; the sconces glow by the door.'},
  Imbolc:{Sunrise:'Low gold sun streams in across the cloth.',Noon:'The snow outside is bright; snowdrops stand in the vases.',
    Twilight:'Blue snow light, and the first candles lit.',Nightfall:'A cold blue night. Candles burn for the returning light.'},
  Ostara:{Sunrise:'Pink dawn through the blossom.',Noon:'A clear spring sky, and blossom at every window.',
    Twilight:'The blossom glows pink in the evening light.',Nightfall:'Fairy lights twinkle over the door; the garden sleeps.'},
  Beltane:{Sunrise:'Soft morning light through the roses round the windows.',Noon:'The garden is green and gold, and the roses are open.',
    Twilight:'Candles flicker among the flowers as the sky turns blue.',Nightfall:'Candlelight and roses. The May night is warm.'},
  Litha:{Sunrise:'The longest day begins in gold.',Noon:'Midsummer sun on a meadow full of flowers.',
    Twilight:'The light lingers; it barely wants to go.',Nightfall:'Every candle in the shop is lit for the short night.'},
  Lughnasadh:{Sunrise:'Sunrise warms the clouds over the fields.',Noon:'The fields shine gold, ready for the harvest.',
    Twilight:'A purple evening; the candles are lit beside the bread.',Nightfall:'A dark harvest night, warm with candlelight.'},
  Mabon:{Sunrise:'Peach light over the orchard.',Noon:'A golden afternoon; the apples are in.',
    Twilight:'The lanterns are lit as the evening cools.',Nightfall:'Lantern light and apples. The year is turning.'}};
function moodLine(){const T=today(),h=HOURS[S.h];
  if(T.named&&h==='Nightfall')return `The ${T.named} fills the window.`;
  if(FESTIVAL_MOOD[T.sabbat])return FESTIVAL_MOOD[T.sabbat][h];
  return {Sunrise:'Sun spills across the counter.',Noon:'The shop is warm and bright.',Twilight:'The light goes gold, then grey.',Nightfall:'Stars are coming out over the lane.'}[h]}
function autoTick(){return;clearTimeout(autoT);const bar=$('#autoBar'),msg=$('#autoMsg'),stay=$('#stayBtn'),move=$('#moveBtn');
  const busy=$('#books').classList.contains('open')||$('#dayEnd').classList.contains('open');
  if(busy||currentVisitor()){bar.hidden=true;return}
  bar.hidden=false;stay.hidden=true;move.hidden=false;
  if(S.altar.length||S.candle||S.tarot)msg.textContent='No one is waiting. Something is still laid out on the altar.';
  else msg.textContent=moodLine()+' Nothing more to do this hour.';
  move.textContent=S.h>=3?'Close for the night':`Next hour: ${HOURS[S.h+1]}`}
