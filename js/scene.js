/* Rendering: the shop scene, the counter, shelves and altar. */
/* ---------- rendering ---------- */
/* Unread emails show a badge on the computer. */
const unreadLetters=()=>S.letters.filter(x=>!x).length+Object.values(S.mail||{}).filter(x=>!x).length;
function renderBadge(){const n=unreadLetters(),bd=$('#booksBadge');bd.hidden=!n;bd.textContent=n;$('#pcBtn').setAttribute('aria-label',n?`Computer: email, ${n} unread`:'Computer: email')}
/* ---------- the shop scene: every counter object is a button ---------- */

/* The book stack: each book cut from the stack picture along its drawn outline (659x672): left, top, width in that frame. */
const STACK=[['Recipe Book','book-recipe-book',78,0,508],['Book of Making','book-book-of-making',35,75,595],['Grimoire of Craft','book-grimoire-of-craft',6,155,653],
  ['Almanac of Sky & Seasons','book-almanac-of-sky-seasons',0,235,659],['Tarot Companion','book-tarot-companion',6,320,616],['Gentle Bestiary','book-gentle-bestiary',20,380,629],
  ['Crystal Almanac','book-crystal-almanac',19,433,637],['Herbiary','book-herbiary',19,494,631]];
function buildScene(){
  document.querySelectorAll('#scene img[data-img]').forEach(i=>i.src=ASSETS.objects[i.dataset.img]);
  $('#bookStack').innerHTML=STACK.map(([b,img,x,y,w])=>`<button data-openbook="${esc(b)}" aria-label="Open the ${esc(b)}" style="left:${x/659*100}%;top:${y/672*100}%;width:${w/659*100}%"><img src="${ASSETS.objects[img]}" alt=""></button>`).join('');
  /* preload and decode ahead, so the fades and the slide down to the workroom don't stall on a big picture */
  [...Object.values(ASSETS.backgrounds),...Object.values(ASSETS.characters),ASSETS.altarRoom,ASSETS.cabinetInside].forEach(src=>{const im=new Image();im.src=src;im.decode?.().catch(()=>{})});
}
/* Two full-screen views, one above the other: the shop counter, and the altar below it.
   The down arrow slides the world up to show the altar; the up arrow slides it back. */
let view='shop';
function goTo(v){view=v;$('#world').classList.toggle('down',v==='altar');$('#shopView').inert=v!=='shop';$('#altarView').inert=v!=='altar'}
function setView(v){goTo(v);render()}
/* Backgrounds: one picture per hour, plus dawn before the shop opens. Two layers cross-fade.
   The workroom below has its own picture (ASSETS.altarRoom). */
let bgNow='',bgTop='bgA',dawnUntil=0;
function setBackground(key){if(key===bgNow)return;bgNow=key;
  fadeLight(key);
  const next=bgTop==='bgA'?'bgB':'bgA';$('#'+next).style.backgroundImage=`url("${ASSETS.backgrounds[key]}")`;
  const room=$('#room');room.style.backgroundImage=`url("${ASSETS.altarRoom}")`;
  /* full address: a url() in a variable is read from the stylesheet's folder */
  room.style.setProperty('--room-img',`url("${new URL(ASSETS.altarRoom,location.href).href}")`);
  room.style.setProperty('--wall-l',`url("${new URL(ASSETS.altarWallL,location.href).href}")`);
  room.style.setProperty('--wall-r',`url("${new URL(ASSETS.altarWallR,location.href).href}")`);
  room.style.setProperty('--inside-img',`url("${new URL(ASSETS.cabinetInside,location.href).href}")`);
  $('#'+next).classList.add('on');$('#'+bgTop).classList.remove('on');bgTop=next}
/* The light on the objects: red, green and blue for each hour (other hours are Noon's 1, 1, 1). It moves from the
   old hour's light to the new one over the same time the background takes to fade (1.2s in style.css). */
const LIGHT={Dawn:[.88,.88,1.02],Sunrise:[1,.93,.91],Twilight:[.95,.85,.88],Nightfall:[.9,.8,.86]},LIGHT_FADE_MS=1200;
let lightNow=[1,1,1];
function fadeLight(key){const from=lightNow,to=LIGHT[key]||[1,1,1],t0=performance.now();
  cancelAnimationFrame(fadeLight.raf);
  const step=t=>{const k=Math.min(1,(t-t0)/LIGHT_FADE_MS),e=k*k*(3-2*k);  /* eased like the background */
    lightNow=from.map((v,i)=>+(v+(to[i]-v)*e).toFixed(3));
    $('#lightMatrix').setAttribute('values',`${lightNow[0]} 0 0 0 0  0 ${lightNow[1]} 0 0 0  0 0 ${lightNow[2]} 0 0  0 0 0 1 0`);
    if(k<1)fadeLight.raf=requestAnimationFrame(step)};
  fadeLight.raf=requestAnimationFrame(step)}
/* A new day opens at dawn: the day's name shows for a moment, then the morning light comes in. */
function showDawn(){const T=today();dawnUntil=Date.now()+DAWN_MS;
  $('#dayCard').innerHTML=`<img src="${ASSETS.logo}" alt="">Day ${S.day}<small>${esc(T.weekday)}${T.sabbat?' \u00B7 '+esc(T.sabbat):''}</small>`;$('#dayCard').classList.add('on');
  render();setTimeout(()=>{$('#dayCard').classList.remove('on');render()},DAWN_MS)}
/* The hour is not shown as a label; the background shows it. A quiet hour's mood line runs along the bottom
   of the scene like a film subtitle. Bottles that can be filled are not pointed out here: the tutorial will
   teach that, and later the bottles themselves will be clickable in the scene. */
function renderScene(){renderAura();renderCustomer();setBackground(Date.now()<dawnUntil?'Dawn':HOURS[S.h]);
  const v=currentVisitor(),note=$('#sceneNote');
  if(v||Date.now()<dawnUntil||$('#dayEnd').classList.contains('open')){note.hidden=true;return}
  const line=moodLine();if(note.hidden||note.textContent!==line){note.textContent=line;note.hidden=false;note.classList.remove('in');void note.offsetWidth;note.classList.add('in')}}
/* The bell brings the next customer: time moves on to the next hour with someone (or something) in it. */
function ringBell(){const bell=$('#bellBtn');
  if(currentVisitor()){bell.classList.remove('nope');void bell.offsetWidth;bell.classList.add('nope');toast('Someone is already at the counter.');return}
  bell.classList.remove('ring');void bell.offsetWidth;bell.classList.add('ring');
  if(S.h>=3){nextHour();return}
  const mail0=Object.keys(S.mail||{}).length;
  do{nextHour(true)}while(S.h<3&&!currentVisitor()&&Object.keys(S.mail||{}).length===mail0&&!GATHER.some(([n,ok])=>ok()&&!S.gathered[S.day+'-'+n]));
  S.result=null;render()}
function openInfo(title,html){$('#infoTitle').textContent=title;$('#infoBody').innerHTML=html;$('#info').classList.add('open')}
/* The aura is read from the colour glowing around the crystal ball, never as words.
   Clicking the ball only explains what the colours mean. */
function currentVisit(){const v=currentVisitor();if(!v)return null;
  return v.type==='return'?visitByKey(S.orders.find(o=>o.id===v.oid).key):v.type==='report'?S.reports.find(r=>r.at===v.at&&r.who===v.who):visitByKey(v.key)}
function renderAura(){const cur=currentVisit(),a=cur&&X.auras[cur.aura],ball=$('#crystalBtn');
  ball.classList.toggle('glowing',!!a);ball.dataset.aura=a?cur.aura:'';if(a)ball.style.setProperty('--aura-glow',a[0])}
/* The customer stands behind the counter. Only people with a picture in ASSETS.characters are drawn. */
function renderCustomer(){const cur=currentVisit(),src=cur&&ASSETS.characters[cur.who],box=$('#customer'),img=box.querySelector('img');
  if(src&&img.getAttribute('src')!==src)img.src=src;box.classList.toggle('on',!!src)}
function auraInfo(){
  const list=Object.entries(X.auras).map(([k,[c,t]])=>`<li style="margin:4px 0"><span class="aura" style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c};vertical-align:middle"></span> ${esc(t)}</li>`).join('');
  return `<p>When someone stands at the counter, the crystal ball glows with what they are feeling. Feelings bend what people say, so the colour tells you how far to trust their words.</p>
    <p class="muted" style="margin-bottom:2px">What the colours mean:</p><ul style="list-style:none;padding:0;margin:0">${list}</ul>`}
/* The till shows today's receipts on their own, laid over the shop; a click anywhere puts them away. */
function openReceipts(){if(!S.pend.length){toast('No receipts yet today.');return}
  const m=$('#receiptsView');m.innerHTML=`<div class="receipts">${S.pend.map(receiptHTML).join('')}</div>`;m.classList.add('open')}
function renderTop(){renderBadge();const T=today();
  const fest=[T.sabbat,T.named,T.event].filter(Boolean).join(', ');
  $('#sky').innerHTML=`<span class="px">Day ${S.day}</span><span>${T.weekday}</span><span>\u263E ${T.phase}</span><span>${T.weather}${HOURS[S.h]==='Nightfall'?` (night ${T.night})`:''}</span>${fest?`<span>\u2726 ${esc(fest)}</span>`:''}
<span title="Every fifth test craft that isn't perfect costs a one-star review">Failed tests: ${S.failTests%5}/5</span>`;
  const rt=rating(),full=Math.round(rt);$('#stars').textContent='\u2605'.repeat(full)+'\u2606'.repeat(5-full)+' '+rt.toFixed(1);
  $('#stars').title=S.hist.length?`Average of the last ${S.hist.length} of up to 20 reviews`:'No reviews yet'}
const GATHER=[['Moonwater',()=>today().phase==='Full Moon'&&HOURS[S.h]==='Nightfall','Full Moon, Nightfall'],
 ['New Moon Water',()=>today().phase==='New Moon'&&HOURS[S.h]==='Nightfall','New Moon, Nightfall'],
 ['Sunwater',()=>today().weather==='Clear & sunny'&&HOURS[S.h]==='Noon','Clear day, Noon'],
 ['Rainwater',()=>today().weather==='Rain','Rain'],['Storm Water',()=>today().weather==='Thunderstorm','Thunderstorm'],
 ['Snow Water',()=>today().weather==='Snow','Snow'],['Dawn dew',()=>HOURS[S.h]==='Sunrise'&&!['Rain','Snow','Thunderstorm'].includes(today().weather),'Sunrise, dry'],
 ['Web Dew',()=>HOURS[S.h]==='Sunrise'&&today().weather==='Fog / Mist','Sunrise, mist']];
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
    d.classList.toggle('open',on);d.setAttribute('aria-expanded',on);b.textContent=n||'';b.hidden=!n;if(on)side=d.dataset.side});
  const box=$('#shelfOpen');if(!openShelf){box.hidden=true;box.innerHTML='';shownShelf='';return}
  box.hidden=false;box.className='shelfopen from'+side+(openShelf==='Tarot'?' wide':'');
  /* a newly opened cupboard plays its coming-out again */
  if(shownShelf!==openShelf){box.style.animation='none';void box.offsetWidth;box.style.animation='';shownShelf=openShelf}
  box.innerHTML=`<div class="shelfhead"><h3>${esc(SHELFNAME[openShelf]||openShelf)}</h3></div><div class="cabinside"><div class="chips${SHELF_CATEGORIES.includes(openShelf)?' shelf':''}">${shelfItemsHTML(openShelf)}</div></div>`}
/* how tall an ingredient stands (ITEM_SIZE in config.js) */
const sizeOf=n=>ITEM_SIZE[n]??ITEM_SIZE_BY_SHELF[ITEM[n]?.c]??.7;
function shelfItemsHTML(c){
  if(c==='Candles')return Object.keys(D.colours).map(k=>`<button class="swatch ${S.candle===k?'on':''}" style="background:${COLOURHEX[k]}" data-candle="${esc(k)}" title="${esc(k)} candle" aria-label="${esc(k)} candle" aria-pressed="${S.candle===k}"></button>`).join('');
  if(c==='Tarot')return Object.keys(D.tarot).map(t=>`<button class="chip ${ASSETS.tarot[t]?'card':''} ${S.tarot===t?'on':''}" data-tarot="${esc(t)}" aria-pressed="${S.tarot===t}" title="${esc(t)}" aria-label="${esc(t)}">${ASSETS.tarot[t]?`<img src="${ASSETS.tarot[t]}" alt="" loading="lazy">`:`<span class="nm">${esc(t)}</span>`}</button>`).join('');  /* a card's picture has its name printed on it */
  /* the waters cupboard also keeps the empty bottles: the ones that can be filled right now show first */
  const fill=c==='Base waters'?GATHER.filter(([n,ok])=>ok()&&!S.gathered[S.day+'-'+n]).map(([n,,when])=>`<button class="chip" data-gather="${esc(n)}" title="${esc(when)}">Fill a bottle: ${esc(n)}</button>`).join(''):'';
  const shelf=SHELF_CATEGORIES.includes(c);  /* bottles and jars stand on a plank */
  return (fill?`<div class="fillnow">${fill}</div>`:'')+D.items.filter(i=>i.c===c&&i.n!==BIRTHSTONE).map(i=>{  /* the birthstone is one of the crystals, by month */
    const st=X.stock[i.n]!==undefined?`<span class="n">${S.stock[i.n]}</span>`:'';
    const pic=ASSETS.items[i.n],bottle=shelf&&pic;
    const img=!pic?'':bottle?`<span class="pic"><img src="${pic}" alt="" loading="lazy" style="--h:${sizeOf(i.n)}"></span>`:`<img src="${pic}" alt="" loading="lazy" style="--h:${sizeOf(i.n)}">`;
      /* a picture names itself (most have their name on the label), so only things without one show their name; hover shows it either way */
    return `<button class="chip ${pic?'jar':''} ${bottle?'vessel':''} ${S.altar.includes(i.n)?'on':''}" data-item="${esc(i.n)}" title="${esc(i.n)}" aria-label="${esc(i.n)}" aria-pressed="${S.altar.includes(i.n)}">${img}${pic?'':`<span class="nm">${esc(i.n)}</span>`}${st}</button>`}).join('')}
function resultHTML(){const R=S.result;return `<div class="g">${R.test?'Test craft':'Given'}</div>${R.first?`<p style="margin:4px 0">${esc(R.first)}</p>`:''}${R.lines.map((l,i,A)=>typeof l==='string'?`<p style="margin:2px 0">${kw(l)}</p>`:`<p style="margin:2px 0${i&&A[i-1].k===l.k?';padding-left:14px':''}">${i&&A[i-1].k===l.k?'':`<span class="tag">${CLUETAG[l.k]}</span> `}${kw(l.t)}</p>`).join('')}`}
function knownRecipes(){return Object.values(D.recipes)}
function renderAltar(){
  const q=currentVisitor();let orderR=null;
  if(q){if(q.type==='return'){const o=S.orders.find(o=>o.id===q.oid);orderR=o&&D.recipes[o.rid]}
    else if(q.type==='new'&&S.activeNow===q.key){const v=visitByKey(q.key);orderR=D.recipes[v.rid]}}
  const sel=$('#target');const rs=knownRecipes();
  /* choose the spell type first, then a recipe of that type (names only, no numbers) */
  if(S.target&&D.recipes[S.target])S.ttype=D.recipes[S.target].type;
  const types=[...new Set(rs.map(r=>r.type))].sort();
  $('#ttype').innerHTML='<option value="">Spell type\u2026</option>'+types.map(t=>`<option ${t===S.ttype?'selected':''}>${esc(t)}</option>`).join('');
  sel.innerHTML=S.ttype?'<option value="">Recipe\u2026</option>'+rs.filter(r=>r.type===S.ttype).sort((a,b)=>a.name.localeCompare(b.name)).map(r=>`<option value="${r.id}" ${String(r.id)===String(S.target)?'selected':''}>${esc(r.name)}</option>`).join(''):'<option value="">Recipe\u2026</option>';
  sel.disabled=!S.ttype;
  sel.value=S.target||'';
  /* what is laid out stands on the table; tap a thing to put it back */
  $('#plates').innerHTML=S.altar.length?S.altar.map(n=>`<button class="ontable" data-item="${esc(n)}" title="${esc(n)}: put it back" aria-label="Put ${esc(n)} back">${ASSETS.items[n]?`<img src="${ASSETS.items[n]}" alt="" style="--h:${sizeOf(n)}">`:`<i class="minijar"></i><span class="nm">${esc(n)}</span>`}</button>`).join(''):'<span class="hint">Open a shelf and pick what to lay on the table.</span>';
  $('#candleSlot').innerHTML=S.candle?`<button class="ontable" data-candle="${esc(S.candle)}" title="Put the candle back"><i class="candle" style="--cc:${COLOURHEX[S.candle]}"></i><span class="nm">${esc(S.candle)} candle</span></button>`:'<span class="hint">No candle</span>';
  /* the card lies flat on the table; with no card, an outline shows where it goes (clicking it opens the tarot cupboard) */
  $('#tarotSlot').innerHTML=S.tarot?`<button class="ontable laid" data-tarot="${esc(S.tarot)}" title="Put ${esc(S.tarot)} back" aria-label="${esc(S.tarot)}"><span class="cardbed">${ASSETS.tarot[S.tarot]?`<img src="${ASSETS.tarot[S.tarot]}" alt="">`:`<span class="nm">${esc(S.tarot)}</span>`}</span></button>`
    :'<button class="ontable laid" data-shelf="Tarot" title="Choose a tarot card" aria-label="Choose a tarot card"><span class="cardbed empty"></span></button>';
  $('#testBtn').disabled=!S.altar.length||!S.target;$('#testBtn').textContent='Test craft';
  $('#giveBtn').disabled=!orderR||!S.altar.length||!S.target;
  const res=$('#result');
  if(S.result){res.hidden=false;res.innerHTML=resultHTML()}else res.hidden=true;
  /* The order being made, as a reminder above the altar. */
  const ov=orderR&&(q.type==='return'?visitByKey(S.orders.find(o=>o.id===q.oid).key):visitByKey(q.key));
  $('#orderNote').innerHTML=ov?`<b>${esc(ov.who)}</b> asked: “${esc(ov.line)}”`:'';
  $('#log').innerHTML=S.log.map(l=>`<div>${esc(l)}</div>`).join('');
}
/* A tutorial is shown once: during the first visit of its kind, and never again after that visit. The × puts it away for good;
   "Skip tutorials" turns them all off (S.tutOff). */
function tutorial(kind,key){S.tut=S.tut||{};if(S.tutOff||S.tut[kind]&&S.tut[kind]!==key)return '';S.tut[kind]=key;
  return `<div class="coach"><button class="dclose" data-tutclose="${kind}" aria-label="Close this tutorial" title="Close this tutorial">×</button>${TUTORIAL[kind](visitByKey(key))}<button class="tutskip" data-tutskip="1">Skip tutorials</button></div>`}
const TUTORIAL={
  order:()=>`<b>Your first order</b><ol><li>Listen. Customers never name the recipe: what they say, what they do (in brackets) and the colour in the crystal ball all count.</li><li>Find the one recipe that fits in the books on the counter.</li><li>Take the arrow down to the altar. Choose the recipe, then lay out what it needs, its candle and its card.</li><li>Test craft as often as you like. When it is right, press <b>Make it</b>.</li><li>What you made waits on the counter. Click it to hand it over.</li></ol>`,
  back:v=>`<b>Some orders take time</b><p>This one can’t be made while they wait, so they will come back. Have it ready by then: when they return, make it at the altar and give it.</p>`,
  advice:v=>`<b>Just a question</b><p>They only want your advice, not a spell. There is nothing to make.</p><ol><li>Listen for three things: what it is for (a keyword), who or what it is for (the body, the heart or the home) and how strong it should be.</li><li>Look it up in ${v.ask.cat==='Crystals'?'the Crystal Almanac':'the Herbiary'}.</li><li>Choose one thing from ${esc(v.ask.cat)} below and press <b>Answer</b>.</li></ol>`};
/* What someone says goes in a speech balloon; what they do (the cue) is written above it, like a stage direction. */
const balloon=(v,inner)=>`${whoHTML(v)}${v.cue?`<p class="cue">${esc(v.cue)}</p>`:''}<div class="balloon">${inner}</div>`;
/* The counter: what the customer says, in a balloon over the shop window. Hidden when nobody is there,
   unless there is a result to read (advice answered at the counter). Tips go under the day info. */
function renderCounter(){const tip=dayTip(),tp=$('#tip');tp.hidden=!tip;tp.innerHTML=tip;
  const q=currentVisitor();renderMade(q);const el=$('#counter');el.hidden=false;el.classList.remove('plain');
  /* News about earlier customers comes first, on its own, so it is never read as part of this customer's order. */
  if(q&&q.type==='report'){const r=S.reports.find(r=>r.at===q.at&&r.who===q.who);
    el.innerHTML=`${whoHTML({who:r.who})}<p class="cue">back to tell you how ${esc(r.what||'it')} went</p><div class="balloon">${kw(r.text)}</div><div class="row"><button class="main" id="reportBtn">Thank you for telling me</button></div>`;return}
  if(q&&(q.tales||[]).length&&!q.newsDone){const v=q.type==='return'?visitByKey(S.orders.find(o=>o.id===q.oid).key):visitByKey(q.key);
    el.innerHTML=`${whoHTML(v)}<p class="cue">before anything else, they pass on some news</p><div class="balloon">${talesHTML(q)}</div><div class="row"><button class="main" id="newsBtn">And what can I do for you?</button></div>`;return}
  if(!q){if(S.result&&!S.result.test){el.classList.add('plain');el.innerHTML=resultHTML()}else{el.hidden=true;el.innerHTML=''}return}
  if(q.type==='return'){const o=S.orders.find(o=>o.id===q.oid);const v=visitByKey(o.key);
    el.innerHTML=`${balloon({...v,desc:""},`<p>“I’m back for my order.”</p><p class="asked">They asked: “${esc(v.line)}”</p>`)}<div class="row"><button id="letGo">They can’t wait any longer</button></div>`;return}
  const v=visitByKey(q.key);
  if(v.kind==='advice'){
    const opts='<option value="">Choose…</option>'+az(D.items.filter(i=>i.c===v.ask.cat).map(i=>i.n)).map(n=>`<option>${esc(n)}</option>`).join('');
    el.innerHTML=`${balloon(v,`<p>“${esc(v.line)} ${esc(v.question)}”</p>`)}${tutorial('advice',q.key)}<div class="row"><select id="adviceSel" aria-label="Your answer">${opts}</select><button class="main" id="adviceBtn">Answer</button></div>`;return}
  /* The customer decides: they either say when they will be back, or wait while you make it. */
  if(v.back&&S.activeNow!==q.key){el.innerHTML=`${balloon(v,`<p>“${esc(v.line)}”</p><p>“${esc(backLine(v))}”</p>`)}${tutorial('back',q.key)}<div class="row"><button class="main" id="okBtn">All right</button></div>`;return}
  S.activeNow=q.key;
  el.innerHTML=`${balloon(v,`<p>“${esc(v.line)}”</p>`)}${tutorial('order',q.key)}${S.made?'':`<div class="row"><button class="main" id="toAltar2">Go to the altar</button><button id="cantBtn" title="Let them go. They leave empty-handed.">I don’t know how to make this</button></div>`}`}
/* What was made at the altar stands on the counter until it is given; it goes if its customer does. */
function renderMade(q){if(S.made&&(!q||q.type!=='report'&&S.made.for!==visitorId(q)))S.made=null;
  const b=$('#madeBtn'),m=S.made;b.hidden=!m;if(!m)return;
  $('#madeTag').textContent=m.name;b.title=b.ariaLabel=`Give them the ${m.type.toLowerCase()}`}
function sendAway(){const q=S.queue;if(!q||q.type!=='new')return;const v=visitByKey(q.key);S.seen[q.key]=true;S.stats.missed++;record('Missed',v.who,'No sale');log(`${v.who} left without anything.`);S.activeNow=null;S.queue=null}
function backLine(v){const b=v.back;if(b.line)return b.line;  /* the day only; the hour is left vague */
  if(b.day===S.day)return 'I\u2019ll come back later today.';
  return b.day<=D.cal.length?`I\u2019ll come back on ${D.cal[b.day-1].weekday}.`:`I\u2019ll come back on Day ${b.day}.`}
function takeOrder(v){S.orders.push({id:Date.now()+Math.random(),key:S.queue.key,rid:v.rid,day:v.back.day,hour:v.back.hour,status:'waiting'});S.seen[S.queue.key]=true;
  log(`${v.who} will come back on Day ${v.back.day} at ${v.back.hour}.`);S.queue=null}
/* A regular's first visit shows what you see (desc in story.js); they say their name in that visit, and from then on it is used. */
function whoHTML(v){return `<div class="who"><b>${esc(v.desc||v.who)}</b></div>`}
function dayTip(){if(S.day===1&&S.h===0&&!S.tutOff&&!S.letters.every(Boolean))return 'There are three emails waiting. Click the <b>computer</b> on the counter to read them.';
  if(Object.values(S.mail||{}).includes(false))return 'A new email came in. Click the <b>computer</b> to read it.';return ''}
function render(){if(Date.now()>=dawnUntil)checkMail();  /* post waits until the dawn card has gone */
  renderTop();renderScene();renderShelves();renderCounter();renderAltar();save();autoTick()}
let autoT=null;
function hourDone(){return !currentVisitor()&&!S.altar.length&&!S.candle&&!S.tarot&&!GATHER.some(([n,ok])=>ok()&&!S.gathered[S.day+'-'+n])}
/* Time never moves by itself. While a customer is at the counter, time waits. Once nobody is waiting, the bar says
   whether anything is left to do this hour and offers Next hour; at Nightfall it offers Close for the night. */
/* A quiet hour gets one line of mood from the day's weather, moon and festival, and offers any bottle that can be filled now. */
function moodLine(){const T=today(),h=HOURS[S.h];
  if(T.phase==='Full Moon'&&h==='Nightfall')return 'The full moon fills the window.';
  if(T.phase==='New Moon'&&h==='Nightfall')return 'No moon tonight; the lane is very dark.';
  const W={'Rain':'Rain taps on the window.','Snow':'Snow muffles the lane. Nobody is coming out in this.','Thunderstorm':'Thunder rolls over the rooftops.',
    'Fog / Mist':'Fog presses at the glass.','Windy':'The wind rattles the shop sign.','Cloudy':'A grey, quiet hour.'}[T.weather]||
    {Sunrise:'Sun spills across the counter.',Noon:'The shop is warm and bright.',Twilight:'The light goes gold, then grey.',Nightfall:'Stars are coming out over the lane.'}[h];
  return W+(T.sabbat?` It is ${T.sabbat}; the village is busy elsewhere.`:'')}
function autoTick(){return;clearTimeout(autoT);const bar=$('#autoBar'),msg=$('#autoMsg'),stay=$('#stayBtn'),move=$('#moveBtn');
  const busy=$('#books').classList.contains('open')||$('#dayEnd').classList.contains('open');
  if(busy||currentVisitor()){bar.hidden=true;return}
  bar.hidden=false;stay.hidden=true;move.hidden=false;
  const fill=GATHER.find(([n,ok])=>ok()&&!S.gathered[S.day+'-'+n]);
  if(S.altar.length||S.candle||S.tarot)msg.textContent='No one is waiting. Something is still laid out on the altar.';
  else if(fill)msg.innerHTML=`${esc(moodLine())} A good hour to fill a bottle of ${esc(fill[0])}. <button class="chip" data-gather="${esc(fill[0])}">Fill ${esc(fill[0])}</button>`;
  else msg.textContent=moodLine()+' Nothing more to do this hour.';
  move.textContent=S.h>=3?'Close for the night':`Next hour: ${HOURS[S.h+1]}`}
