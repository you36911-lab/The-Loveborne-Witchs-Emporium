/* Rendering: the shop scene, the counter, shelves and altar. */
/* ---------- rendering ---------- */
/* Unread emails show a badge on the computer. */
const unreadLetters=()=>S.letters.filter(x=>!x).length+Object.values(S.mail||{}).filter(x=>!x).length;
function renderBadge(){const n=unreadLetters(),bd=$('#booksBadge');bd.hidden=!n;bd.textContent=n;$('#pcBtn').setAttribute('aria-label',n?`Computer: email, ${n} unread`:'Computer: email')}
/* ---------- the shop scene: every counter object is a button ---------- */

const STACK=[['Recipe Book','book-recipe-book',104,0,480],['Book of Making','book-book-of-making',65,85,543],['Grimoire of Craft','book-grimoire-of-craft',19,160,640],
  ['Almanac of Sky & Seasons','book-almanac-of-sky-seasons',0,248,659],['Tarot Companion','book-tarot-companion',38,338,602],['Gentle Bestiary','book-gentle-bestiary',20,405,624],
  ['Crystal Almanac','book-crystal-almanac',19,462,637],['Herbiary','book-herbiary',32,540,610]];
function buildScene(){
  document.querySelectorAll('#scene img[data-img]').forEach(i=>i.src=ASSETS.objects[i.dataset.img]);
  $('#bookStack').innerHTML=STACK.map(([b,img,x,y,w])=>`<button data-openbook="${esc(b)}" aria-label="Open the ${esc(b)}" style="left:${x/659*100}%;top:${y/672*100}%;width:${w/659*100}%"><img src="${ASSETS.objects[img]}" alt=""></button>`).join('');
  [...Object.values(ASSETS.backgrounds),...Object.values(ASSETS.characters)].forEach(src=>{const im=new Image();im.src=src});  /* preload so the fades are smooth */
}
/* Two full-screen views, one above the other: the shop counter, and the altar below it.
   The down arrow slides the world up to show the altar; the up arrow slides it back. */
let view='shop';
function goTo(v){view=v;$('#world').classList.toggle('down',v==='altar');$('#shopView').inert=v!=='shop';$('#altarView').inert=v!=='altar'}
function setView(v){goTo(v);render()}
/* Backgrounds: one picture per hour, plus dawn before the shop opens. Two layers cross-fade.
   The altar view shows the same picture, blurred, behind the cabinets. */
let bgNow='',bgTop='bgA',dawnUntil=0;
function setBackground(key){if(key===bgNow)return;bgNow=key;
  /* The lighting can't fade, so it changes halfway through the background's fade. See style.css. */
  clearTimeout(setBackground.t);setBackground.t=setTimeout(()=>{$('#scene').dataset.light=key},600);
  const next=bgTop==='bgA'?'bgB':'bgA';$('#'+next).style.backgroundImage=$('#altarBg').style.backgroundImage=`url("${ASSETS.backgrounds[key]}")`;
  $('#'+next).classList.add('on');$('#'+bgTop).classList.remove('on');bgTop=next}
/* A new day opens at dawn: the day's name shows for a moment, then the morning light comes in. */
function showDawn(){const T=today();dawnUntil=Date.now()+DAWN_MS;
  $('#dayCard').innerHTML=`Day ${S.day}<small>${esc(T.weekday)}${T.sabbat?' \u00B7 '+esc(T.sabbat):''}</small>`;$('#dayCard').classList.add('on');
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
function hintsHTML(){const h=S.hints||[];return h.length?h.map(x=>`<p><span class="muted" style="font-size:13px">Day ${x.day}, ${esc(x.hour)} \u00B7 ${esc(x.who)}</span><br>${kw(x.text)}</p>`).join(''):'<p class="muted">Nothing yet. When a customer is happy with what you made, they sometimes let something slip. It is written down here.</p>'}
function receiptsHTML(){return S.pend.length?`<p class="muted">Today so far. The stars count towards your rating at closing.</p><div class="receipts">${S.pend.map(receiptHTML).join('')}</div>`:'<p class="muted">No receipts yet today.</p>'}
function renderTop(){renderBadge();const T=today();
  const fest=[T.sabbat,T.named,T.event].filter(Boolean).join(', ');
  $('#sky').innerHTML=`<span class="px">Day ${S.day}</span><span>${T.weekday}</span><span>\u263E ${T.phase}</span><span>${T.weather}${HOURS[S.h]==='Nightfall'?` (night ${T.night})`:''}</span>${fest?`<span>\u2726 ${esc(fest)}</span>`:''}
<span title="Every fifth test craft that isn't perfect costs a one-star review">Failed tests: ${S.failTests%5}/5</span>`;
  const rt=rating(),full=Math.round(rt);$('#stars').textContent='\u2605'.repeat(full)+'\u2606'.repeat(5-full)+' '+rt.toFixed(1);
  $('#stars').title=S.hist.length?`Average of the last ${S.hist.length} of up to 20 reviews`:'No reviews yet'}
function shelfHTML(side){
  const cats=[...new Set(D.items.filter(i=>i.p===side).map(i=>i.c))];
  let h='';
  if(side==='left'){h+=`<details open><summary>Bottles to fill</summary><div class="chips">${gatherButtons()}</div></details>`}
  cats.forEach((c,ix)=>{const its=D.items.filter(i=>i.c===c);
    const shelf=SHELF_CATEGORIES.includes(c);  /* bottles and jars stand on a plank */
    h+=`<details${ix<1?' open':''}><summary>${esc(c)} <span class="muted">(${its.length})</span></summary><div class="chips${shelf?' shelf':''}">${its.map(i=>{
      const st=X.stock[i.n]!==undefined?`<span class="n">${S.stock[i.n]}</span>`:'';
      const pic=ASSETS.items[i.n],bottle=shelf&&pic;
      const img=!pic?'':bottle?`<span class="pic"><img src="${pic}" alt="" loading="lazy" style="width:${SHELF_BOTTLE_WIDTH}px"></span>`:`<img src="${pic}" alt="" loading="lazy">`;
      return `<button class="chip ${pic?'jar':''} ${bottle?'vessel':''} ${S.altar.includes(i.n)?'on':''}" data-item="${esc(i.n)}" aria-pressed="${S.altar.includes(i.n)}">${img}<span class="nm">${esc(i.n)}</span>${st}</button>`}).join('')}</div></details>`});
  if(side==='right'){
    h=`<details open><summary>Candles</summary><div class="chips">${Object.keys(D.colours).map(c=>`<button class="swatch ${S.candle===c?'on':''}" style="background:${COLOURHEX[c]}" data-candle="${esc(c)}" title="${esc(c)} candle" aria-label="${esc(c)} candle" aria-pressed="${S.candle===c}"></button>`).join('')}</div></details>
    <details open><summary>Tarot (Major Arcana)</summary><div class="chips">${Object.keys(D.tarot).map(t=>`<button class="chip ${S.tarot===t?'on':''}" data-tarot="${esc(t)}" aria-pressed="${S.tarot===t}">${esc(t)}</button>`).join('')}</div></details>`+h}
  return h}
const GATHER=[['Moonwater',()=>today().phase==='Full Moon'&&HOURS[S.h]==='Nightfall','Full Moon, Nightfall'],
 ['New Moon Water',()=>today().phase==='New Moon'&&HOURS[S.h]==='Nightfall','New Moon, Nightfall'],
 ['Sunwater',()=>today().weather==='Clear & sunny'&&HOURS[S.h]==='Noon','Clear day, Noon'],
 ['Rainwater',()=>today().weather==='Rain','Rain'],['Storm Water',()=>today().weather==='Thunderstorm','Thunderstorm'],
 ['Snow Water',()=>today().weather==='Snow','Snow'],['Dawn dew',()=>HOURS[S.h]==='Sunrise'&&!['Rain','Snow','Thunderstorm'].includes(today().weather),'Sunrise, dry'],
 ['Web Dew',()=>HOURS[S.h]==='Sunrise'&&today().weather==='Fog / Mist','Sunrise, mist']];
function gatherButtons(){return GATHER.map(([n,ok,when])=>{const done=S.gathered[S.day+'-'+n];
  return `<button class="chip" data-gather="${esc(n)}" ${ok()&&!done?'':'disabled'} title="${esc(when)}">Fill ${esc(n)}</button>`}).join('')}
function renderShelves(){$('#leftBody').innerHTML=shelfHTML('left');$('#rightBody').innerHTML=shelfHTML('right')}
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
  $('#plates').innerHTML=S.altar.length?S.altar.map(n=>`<button class="chip on" data-item="${esc(n)}">${ASSETS.items[n]?`<img src="${ASSETS.items[n]}" alt="">`:''}${esc(n)} \u00D7</button>`).join(''):'<span class="muted">Tap ingredients in the cabinets to lay them here.</span>';
  $('#candleSlot').innerHTML=S.candle?`<span class="swatch" style="display:inline-block;vertical-align:middle;background:${COLOURHEX[S.candle]}"></span> ${esc(S.candle)} candle <button class="chip" data-candle="${esc(S.candle)}">\u00D7</button>`:'<span class="muted">No candle</span>';
  $('#tarotSlot').innerHTML=S.tarot?`${esc(S.tarot)} <button class="chip" data-tarot="${esc(S.tarot)}">\u00D7</button>`:'<span class="muted">No card</span>';
  $('#testBtn').disabled=!S.altar.length||!S.target;$('#testBtn').textContent='Test craft';
  $('#giveBtn').disabled=!orderR||!S.altar.length||!S.target;
  const res=$('#result');
  if(S.result){res.hidden=false;res.innerHTML=resultHTML()}else res.hidden=true;
  /* The order being made, as a reminder above the altar. */
  const ov=orderR&&(q.type==='return'?visitByKey(S.orders.find(o=>o.id===q.oid).key):visitByKey(q.key));
  $('#orderNote').innerHTML=ov?`<b>${esc(ov.who)}</b> asked: “${esc(ov.line)}”`:'';
  $('#log').innerHTML=S.log.map(l=>`<div>${esc(l)}</div>`).join('');
}
/* Advice is a quick question, not an order: say so, and the first time explain what to listen for. */
function adviceGuide(v){const first=!S.stats.advice,where=v.ask.cat==='Crystals'?'the Crystal Almanac':'the Herbiary';
  return `<div class="guide"><b>Just a question.</b> They only want your advice, not a spell. Nothing to make: choose one ingredient from ${esc(v.ask.cat)} and press Answer.`+
    (first?`<br><small>Listen for three things: what it is for (a keyword), who or what it is for (the body, the heart or the home) and how strong it should be. Then look it up in ${where}.</small>`:'')+`</div>`}
/* The counter: what the customer says, in a box over the shop window. Hidden when nobody is there,
   unless there is a result to read (advice answered at the counter). Tips go under the day info. */
function renderCounter(){const tip=dayTip(),tp=$('#tip');tp.hidden=!tip;tp.innerHTML=tip;
  const q=currentVisitor();const el=$('#counter');el.hidden=false;
  /* News about earlier customers comes first, on its own, so it is never read as part of this customer's order. */
  if(q&&q.type==='report'){const r=S.reports.find(r=>r.at===q.at&&r.who===q.who);
    el.innerHTML=`${whoHTML({who:r.who,aura:r.aura})}<p class="muted">They\u2019ve come back to tell you how ${esc(r.what||'it')} went.</p><p class="tale">${kw(r.text)}</p><div class="row"><button class="main" id="reportBtn">Thank you for telling me</button></div>`;return}
  if(q&&(q.tales||[]).length&&!q.newsDone){const v=q.type==='return'?visitByKey(S.orders.find(o=>o.id===q.oid).key):visitByKey(q.key);
    el.innerHTML=`${whoHTML(v)}<p class="muted">Before anything else, they pass on some news:</p>${talesHTML(q)}<div class="row"><button class="main" id="newsBtn">And what can I do for you?</button></div>`;return}
  if(!q){if(S.result&&!S.result.test){el.innerHTML=`<button class="dclose" id="dismissResult" aria-label="Close">×</button>${resultHTML()}`}else{el.hidden=true;el.innerHTML=''}return}
  if(q.type==='return'){const o=S.orders.find(o=>o.id===q.oid);const v=visitByKey(o.key);const r=D.recipes[o.rid];
    el.innerHTML=`${whoHTML(v)}<p class="say">\u201CI\u2019m back for my order.\u201D</p><div class="req">${v.cue?`<p class="cue" style="margin:0 0 4px">(${esc(v.cue)})</p>`:''}<span class="muted">They asked:</span> \u201C${esc(v.line)}\u201D</div><div class="row"><button id="letGo">They can\u2019t wait any longer</button></div>`;return}
  const v=visitByKey(q.key);
  if(v.kind==='advice'){
    const opts='<option value="">Choose\u2026</option>'+az(D.items.filter(i=>i.c===v.ask.cat).map(i=>i.n)).map(n=>`<option>${esc(n)}</option>`).join('');
    el.innerHTML=`${whoHTML(v)}${v.cue?`<p class="cue">(${esc(v.cue)})</p>`:''}<p class="say">\u201C${esc(v.line)} ${esc(v.question)}\u201D</p>${adviceGuide(v)}<div class="row"><select id="adviceSel" aria-label="Your answer">${opts}</select><button class="main" id="adviceBtn">Answer</button></div>`;return}
  const r=D.recipes[v.rid];
  if(S.activeNow===q.key){el.innerHTML=`${whoHTML(v)}<div class="req">${v.cue?`<p class="cue" style="margin:0 0 4px">(${esc(v.cue)})</p>`:''}<span class="muted">They asked:</span> \u201C${esc(v.line)}\u201D</div><p class="muted">They\u2019re waiting while you make it. Choose the recipe that fits, lay it out on the altar and press Make and give.</p><div class="row"><button class="main" id="toAltar2">Go to the altar</button><button id="cantBtn" title="Let them go. They leave empty-handed.">I don\u2019t know how to make this</button></div>`;return}
  const say=`${whoHTML(v)}${v.cue?`<p class="cue">(${esc(v.cue)})</p>`:''}<p class="say">\u201C${esc(v.line)}\u201D</p>`;
  /* The customer decides: they either wait while you make it, or say when they will be back. */
  if(v.back){el.innerHTML=`${say}<p class="say">\u201C${esc(backLine(v))}\u201D</p><div class="row"><button class="main" id="okBtn">All right</button></div>`;return}
  el.innerHTML=`${say}<p class="muted">They\u2019ll wait while you make it.</p><div class="row"><button class="main" id="nowBtn">Start making it</button></div>`}
function sendAway(){const q=S.queue;if(!q||q.type!=='new')return;const v=visitByKey(q.key);S.seen[q.key]=true;S.stats.missed++;record('Missed',v.who,'No sale');log(`${v.who} left without anything.`);S.activeNow=null;S.queue=null}
function backLine(v){const b=v.back;if(b.line)return b.line;  /* the day only; the hour is left vague */
  if(b.day===S.day)return 'I\u2019ll come back later today.';
  return b.day<=D.cal.length?`I\u2019ll come back on ${D.cal[b.day-1].weekday}.`:`I\u2019ll come back on Day ${b.day}.`}
function takeOrder(v){S.orders.push({id:Date.now()+Math.random(),key:S.queue.key,rid:v.rid,day:v.back.day,hour:v.back.hour,status:'waiting'});S.seen[S.queue.key]=true;
  log(`${v.who} will come back on Day ${v.back.day} at ${v.back.hour}.`);S.queue=null}
function whoHTML(v){return `<div class="who"><div><b>${esc(v.who)}</b></div></div>`}
function dayTip(){if(S.day===1&&S.h===0&&!S.letters.every(Boolean))return 'There are three emails waiting. Click the <b>computer</b> on the counter to read them.';
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
