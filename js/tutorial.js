/* The tutorial (see TUTORIAL_PLAN.md). Each lesson is taught once, when it first matters, in three ways:
   - the shopkeeper's own thought, as a subtitle at the bottom (#guideLine), never saying "you";
   - a circle drawn by hand in the books' dark ink round the next thing to click (#guideRing, laid over it);
   - Hester's handwritten notes (#hNote) for rules worth keeping.
   A step is done when the player does the thing, never by a Next button; steps already done (the player got ahead)
   are passed over. Nothing is blocked: the thought and the glow simply wait.
   S.guide keeps where each lesson is: a step number while it runs, 'done' after. A replay has none (S.tutOff). */

/* the visits the first lessons belong to */
const vkey=v=>v.day+'-'+v.hour+'-'+v.who;
const FIRST_ORDER=vkey(X.visits.find(v=>v.kind!=='advice'));
const HESTER_DAY1='1-Twilight-Hester';
const NURSE='1-Nightfall-A night-shift nurse';
const FIRST_ADVICE=vkey(X.visits.find(v=>v.kind==='advice'));

/* small helpers the lessons read */
const isOpen=id=>$('#'+id).classList.contains('open');
const bookOpen=b=>isOpen('books')&&curBook===b;
const atCounter=k=>S.queue&&S.queue.key===k;
const afterDawn=()=>Date.now()>=dawnUntil+MAIL_AFTER_DAWN_MS;
const pcApp=a=>isOpen('pc')&&!winOf(a).hidden;
/* every blank of a recipe written in */
function allWritten(id){const r=D.recipes[id],n=S.notes[id];if(!r||!n)return false;
  return n.ing.filter(Boolean).length>=r.ing.length&&(!r.candle||n.candle)&&(!r.tarot||n.tarot)&&n.when.filter(Boolean).length>=r.conds.length}
/* the first visible element that matches (inside an open book, only the open spread) */
function seen(sel){for(const el of document.querySelectorAll(sel)){const r=el.getBoundingClientRect();if(r.width&&r.height&&!el.closest('[hidden]'))return el}return null}

/* Hester's notes: short rules in her own hand */
const HESTER_NOTES={
  aura:{title:'The crystal ball',lines:['The crystal ball shows what they don’t say. Gold: joy. Grey: sadness. Pale blue: worry. Red: anger. Pink: longing; bright pink, embarrassment.','Watch it, dear. People rarely ask for what they need.']},
  tests:{title:'Test crafts',lines:['A test shows what’s missing, shelf by shelf. Try the same one again and it tells you more.','But every wrong test puts out a black candle. Five out, and the street smells it.']}};

/* The lessons, in the order they are taught. when: it may start; until: it is over (marked done); steps run in order.
   A step: glow (a selector, or a function giving one), say (the thought), done (when it is passed), wait (ms: done after
   this long), note (one of Hester's notes, shown when the step is reached, done when it is closed). */
const LESSONS=[
  {id:'open',at:'1-Sunrise-',when:()=>S.day===1&&S.h===0&&afterDawn(),until:()=>S.h>0||!!S.queue,steps:[
    {glow:()=>!$('#mailFx').hidden?'#mailRead':'#pcBtn',say:'The computer’s chiming. Post, before I’ve even opened.',done:()=>isOpen('pc')},
    {glow:'[data-lsel="start:0"]',say:'From H.… She kept this shop before me.',done:()=>S.letters[0]},
    {glow:()=>!S.letters[1]?'[data-lsel="start:1"]':'[data-lsel="start:2"]',say:'There’s more from her. Best read it all.',done:()=>S.letters.every(Boolean)},
    {glow:'#pc .pcclose',say:'That’s plenty to start with.',done:()=>!isOpen('pc')},
    {note:'aura'},
    {glow:'#bellBtn',say:'Time to open. The bell calls the next one in.',done:()=>!!bellWait||!!S.queue||S.h>0}]},
  {id:'order1',at:FIRST_ORDER,when:()=>atCounter(FIRST_ORDER),until:()=>S.seen[FIRST_ORDER],end:()=>S.pend.some(p=>p.key===FIRST_ORDER&&p.g==='Perfect')?'One done. Her shoulders came down a little as she left.':'Made and given. We’ll see how it goes.',steps:[
    {glow:'#crystalBtn',say:'A charm for her pocket… and the ball’s pale blue. She’s worried, then.',wait:7500},
    {glow:'#bookStack [data-openbook="Recipe Book"]',say:'The Recipe Book will have it.',done:()=>bookOpen('Recipe Book')},
    {glow:()=>{const h=[...document.querySelectorAll('#books .pg h3.cat')].find(x=>x.textContent==='Charm');return h?h:'#turnNext'},say:'The index first. She wants a charm.',done:()=>pageOf().startsWith('recipe:')||!!S.target},
    {glow:'#books .pg .rpick',say:'If this is the one, I’ll tap its name to mark it.',done:()=>!!S.target},
    {glow:'#books .pg .wblank',say:'Blanks for what goes in, each with its shelf. The themes say what each must do.',done:()=>S.target&&noteOf(S.target).ing.some(Boolean)},
    {say:'Not sure what does what? The other books on the counter say: the Herbiary for herbs.',done:()=>S.target&&allWritten(S.target)},
    {glow:'#books .pg [data-layout]',say:'Written. The little bell lays it all out downstairs.',done:()=>S.altar.length>0&&view==='altar'},
    {glow:'#craftBell',say:'Everything’s on the table. The silver bell makes it.',done:()=>!!S.spell||!!S.made},
    {glow:'#spellBtn',say:'There it is. Up to the counter with it.',done:()=>!!S.made&&view==='shop'&&!S.spell},
    {glow:'#madeBtn',say:'Wrapped and waiting. Hand it over.',done:()=>S.seen[FIRST_ORDER]}]},
  /* Hester teaches test crafts herself (her tutorial line in story.js), then the steps follow it */
  {id:'hester',at:HESTER_DAY1,when:()=>atCounter(HESTER_DAY1),until:()=>S.seen[HESTER_DAY1],steps:[
    {say:'',wait:9000},
    {glow:'#bookStack [data-openbook="Recipe Book"]',say:'Test it first, she said. Her rune is in the Recipe Book; she wrote most of it in her email.',done:()=>bookOpen('Recipe Book')&&pageOf()==='recipe:111'||(S.testLog||[]).length>0},
    {glow:()=>pageOf()==='recipe:111'?'#books .pg [data-booktest="111"]':'[data-go="recipe:111"]',say:'The little bottle tests what’s written.',done:()=>(S.testLog||[]).length>0},
    {glow:'#phoneBtn',say:'The phone. That’s where a test tells me how it went.',done:()=>isOpen('phoneView')},
    {say:'',done:()=>!isOpen('phoneView')},
    {note:'tests'},
    {say:'Fill in what’s missing, test again, and ring the silver bell when it’s right.',done:()=>S.seen[HESTER_DAY1]}]},
  {id:'nurse',at:NURSE,when:()=>atCounter(NURSE),until:()=>S.seen[NURSE],steps:[{say:'On my own this time.',wait:5000}]},
  {id:'close1',at:'2-Sunrise-',when:()=>S.day===1&&isOpen('dayEnd'),until:()=>S.day>1||!isOpen('dayEnd'),steps:[
    {glow:'#dayEnd .receipts',say:'The day’s receipts. Everyone who came, and their stars.',done:()=>!isOpen('dayEnd')}]},
  {id:'reviews',at:'2-Sunrise-',when:()=>S.day===2&&S.h===0&&afterDawn()&&(S.reviews||[]).length>0,until:()=>S.h>0||!!S.queue,steps:[
    {glow:()=>isOpen('pc')?'#desk .dicon[data-app="shop"]':'#pcBtn',say:'Reviews came in overnight.',done:()=>pcApp('shop')},
    {glow:'#shopApp .rv-ps',say:'A P.S. at the bottom. Things they let slip tend to matter later.',wait:8000}]},
  {id:'advice1',at:FIRST_ADVICE,when:()=>atCounter(FIRST_ADVICE),until:()=>S.seen[FIRST_ADVICE],steps:[
    {say:'She only wants to know which herb. Nothing to make.',wait:8000},
    {glow:'#bookStack [data-openbook="Herbiary"]',say:'The Herbiary. Something for love, for the mind, and strong.',done:()=>bookOpen('Herbiary')},
    {glow:()=>isOpen('books')?'':'#adviceIn',say:'Then I tell her its name.',done:()=>S.seen[FIRST_ADVICE]}]},
  {id:'report',when:()=>S.queue&&S.queue.type==='report',until:()=>!S.queue||S.queue.type!=='report',steps:[
    {say:'Back to tell me how it went.',done:()=>!S.queue||S.queue.type!=='report'}]},
  /* taught where they first matter */
  {id:'words',when:()=>S.day>=2&&!S.bank.length&&!!seen('.kw'),until:()=>S.bank.length>0,steps:[
    {glow:'.kw',say:'That word, with the dots under it… worth keeping.',done:()=>S.bank.length>0}]},
  {id:'blanks',when:()=>S.bank.length>0&&isOpen('books')&&!!seen('#books .pg .blank'),until:()=>Object.values(S.fills).some(f=>(f||[]).some(Boolean)),steps:[
    {glow:'#bank .word',say:'A word I’ve kept. I pick it up…',done:()=>!!selWord},
    {glow:'#books .pg .blank:not(.filled)',say:'…and put it where it belongs.',done:()=>Object.values(S.fills).some(f=>(f||[]).some(Boolean))}]},
  {id:'candle',when:()=>(S.failTests||0)>0&&!(S.guideNotes||{}).tests,until:()=>(S.guideNotes||{}).tests,steps:[
    {glow:'#testCandles',say:'One candle out. Five, and the neighbours will smell it.',wait:6000},{note:'tests'}]},
  {id:'timing',when:()=>{const r=S.target&&D.recipes[S.target];return !!r&&r.conds.some(c=>c.t==='time')&&pageOf()==='recipe:'+S.target&&isOpen('books')},until:()=>false,steps:[
    {say:'It wants a particular hour. The light in the shop says which it is.',wait:7000}]},
  {id:'fullmoon',when:()=>S.day===6&&afterDawn()&&!S.queue,until:()=>S.day!==6,steps:[
    {glow:'#bookStack [data-openbook="Almanac of Sky & Seasons"]',say:'Full tonight. The Almanac knows which moon.',done:()=>bookOpen('Almanac of Sky & Seasons'),wait:15000}]},
  {id:'email',when:()=>S.day>1&&!$('#mailFx').hidden,until:()=>$('#mailFx').hidden,steps:[
    {glow:'#mailRead',say:'',done:()=>$('#mailFx').hidden}]}];

/* Prototype jumps: a lesson whose visit (at: its key, day-hour-who) comes before the place jumped to counts as done;
   one at or after it starts again. (close1's "2-Sunrise-" means it is over once Day 2 has begun.) */
function guideSkipBefore(day,h){const g=guideState(),pos=k=>{const [d,hr]=k.split('-');return +d*4+HOURS.indexOf(hr)};
  LESSONS.forEach(l=>{if(!l.at)return;if(pos(l.at)<day*4+h)g[l.id]='done';else delete g[l.id]})}
/* ---------- running it ---------- */
let guideStepAt=0,guideNow='';  /* when the current step began (for waits), and which lesson/step that was */
function guideState(){return S.guide||(S.guide={})}
/* Lessons tied to a moment (at) come first: one under way carries on, or the first that may start. The ones taught where
   they first matter (no at) show only while their situation is on screen (when), and wait, part-way if need be, while a
   lesson tied to a moment runs. */
function current(){const g=guideState(),open=l=>typeof g[l.id]==='number'||!g[l.id];
  return LESSONS.find(l=>l.at&&typeof g[l.id]==='number')||LESSONS.find(l=>l.at&&!g[l.id]&&l.when())||
    LESSONS.find(l=>!l.at&&open(l)&&l.when())}
function guideTick(){
  if(S.tutOff||titleOpen()||menuOpen()){show(null);return}
  const g=guideState();let L=current();
  for(let n=0;L&&n<LESSONS.length;n++){
    if(g[L.id]===undefined){g[L.id]=0;save()}
    if(L.until()){finish(L);L=current();continue}
    let i=g[L.id],st=L.steps[i];const key=L.id+':'+i;
    if(guideNow!==key){guideNow=key;guideStepAt=Date.now()}
    const passed=st.note?(S.guideNotes||{})[st.note]:(st.done&&st.done())||(st.wait&&Date.now()-guideStepAt>=st.wait);
    if(passed){g[L.id]=i+1;save();if(g[L.id]>=L.steps.length){finish(L);L=current()}continue}
    if(st.note){if(!isOpen('hNote'))openNote(st.note);show(null);return}
    show(st);return}
  show(null)}
function finish(L){guideState()[L.id]='done';save();const t=L.end&&L.end();if(t)toast(t,{thought:true,ms:4200})}

/* ---------- on screen ---------- */
let ringEl=null;
function show(st){const line=$('#guideLine'),ring=$('#guideRing');
  const say=st&&st.say||'',toastUp=$('#toast').style.display==='block';
  if(line.dataset.say!==say){line.dataset.say=say;line.textContent=say;line.classList.remove('in');if(say){void line.offsetWidth;line.classList.add('in')}}
  line.hidden=!say||toastUp;
  $('#sceneNote').classList.toggle('guided',!line.hidden);  /* the mood line steps aside */
  let sel=st&&st.glow;if(typeof sel==='function')sel=sel();
  ringEl=sel?(typeof sel==='string'?seen(sel):sel):null;ringFor=ringEl?String(st.glow)+'|'+guideNow:'';placeRing()}
/* The mark is a circle drawn by hand in the books' dark ink round the thing: a loop that goes a little past where it began, a touch
   uneven, drawn in with the pen (stroke) when it appears, roughened like the Recipe Book's tick (the #ink filter). It is
   drawn again only when it moves to something new or that thing changes size. */
let ringFor='',ringDrawn='';
function loopPath(w,h){const cx=w/2,cy=h/2,rx=w/2-6,ry=h/2-6,n=72,turn=2*Math.PI*1.1,start=-1.9;let d='';
  for(let i=0;i<=n;i++){const t=i/n,a=start+turn*t,wob=1+.035*Math.sin(3*a+1)+.02*Math.sin(5*a),
    sp=1-.06*t;  /* the pen drifts inward a little as it comes round, so the end passes inside the start */
    d+=(i?'L':'M')+(cx+Math.cos(a)*rx*wob*sp).toFixed(1)+' '+(cy+Math.sin(a)*ry*wob*sp).toFixed(1)}
  return d}
function placeRing(){const ring=$('#guideRing');const r=ringEl&&ringEl.isConnected&&ringEl.getBoundingClientRect();
  if(!r||!r.width){ring.hidden=true;ringDrawn='';return}
  /* an oval a little larger than the thing, so the ink goes round it and not over it */
  const px=Math.min(40,Math.max(12,r.width*.08)),py=Math.min(32,Math.max(10,r.height*.12)),w=Math.round(r.width+px*2),h=Math.round(r.height+py*2);
  ring.hidden=false;ring.style.left=r.left-px+'px';ring.style.top=r.top-py+'px';ring.style.width=w+'px';ring.style.height=h+'px';
  const key=ringFor+'|'+Math.round(w/8)+'x'+Math.round(h/8);if(key===ringDrawn)return;ringDrawn=key;
  ring.innerHTML=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path class="gr-ink" d="${loopPath(w,h)}" pathLength="1"/></svg>`}
/* the ring follows its thing as views slide and books open */
(function follow(){placeRing();requestAnimationFrame(follow)})();
setInterval(guideTick,250);

/* Hester's note: in the middle of the screen, in her hand; a click outside closes it, like every popup */
function openNote(id){const n=HESTER_NOTES[id];$('#hNoteBody').innerHTML=`<h3>${esc(n.title)}</h3>${n.lines.map(t=>`<p>${esc(t)}</p>`).join('')}<p class="hsig">— H.</p>`;
  $('#hNote').dataset.note=id;$('#hNote').classList.add('open')}
function closeNote(){const m=$('#hNote');if(!m.classList.contains('open'))return;(S.guideNotes||(S.guideNotes={}))[m.dataset.note]=true;save();m.classList.remove('open')}
$('#hNote').addEventListener('click',e=>{if(e.target.id==='hNote')closeNote()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen('hNote')){closeNote();e.stopImmediatePropagation()}},true);
