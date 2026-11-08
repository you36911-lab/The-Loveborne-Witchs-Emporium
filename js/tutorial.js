/* The tutorial (see TUTORIAL_PLAN.md). Each lesson is taught once, when it first matters, in three ways:
   - the shopkeeper's own thought, as a subtitle at the bottom (#guideLine), never saying "you";
   - a mark on the next thing to click (#guideRing; several ways are being tried, see MARKS below);
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
let ringEl=null,ringSel='';
function show(st){const line=$('#guideLine');
  const say=st&&st.say||'',toastUp=$('#toast').style.display==='block';
  if(line.dataset.say!==say){line.dataset.say=say;line.textContent=say;line.classList.remove('in');if(say){void line.offsetWidth;line.classList.add('in')}}
  line.hidden=!say||toastUp;
  $('#sceneNote').classList.toggle('guided',!line.hidden);  /* the mood line steps aside */
  let sel=st&&st.glow;if(typeof sel==='function')sel=sel();
  ringEl=sel?(typeof sel==='string'?seen(sel):sel):null;ringSel=typeof sel==='string'?sel:'';ringFor=ringEl?String(st.glow)+'|'+guideNow:'';placeRing()}

/* How the next thing to click is marked. Four ways are being tried (prototype: the "Mark" menu in the prototype bar,
   remembered in this browser):
   glow      the thing itself glows along its own outline, breathing, with small sparkles twinkling round it;
   star      a small star floats over it, bobbing gently;
   spotlight the rest of the screen dims a little, and a soft pool of light rests on it;
   hand      a circle drawn by hand in the books' ink round it (three "noticed" strokes by something big). */
const MARKS={glow:'Glow and sparkles',star:'Floating star',spotlight:'Spotlight',hand:'Hand-drawn'};
let markMode='glow';try{markMode=localStorage.getItem('guideMark')||markMode}catch(e){}
if(!MARKS[markMode])markMode='glow';
function setMarkMode(m){markMode=m;try{localStorage.setItem('guideMark',m)}catch(e){}clearMarks()}
let ringFor='',ringDrawn='',glowEl=null,sparkT=0;
function clearMarks(){const ring=$('#guideRing');ring.hidden=true;ring.innerHTML='';ring.className='guidering';ringDrawn='';
  if(glowEl){glowEl.classList.remove('guide-glow');glowEl=null}$('#guideSpot').hidden=true}
function placeRing(){const ring=$('#guideRing');const r=ringEl&&ringEl.isConnected&&ringEl.getBoundingClientRect();
  if(!r||!r.width){clearMarks();return}
  ({glow:markGlow,star:markStar,spotlight:markSpot,hand:markHand})[markMode](ring,r)}
/* the part of the box the picture really fills (NOTICE_INSET), for marks placed by its middle */
function drawn(r){const [ix,iy]=NOTICE_INSET[ringSel]||[0,0],left=r.left+r.width*ix,top=r.top+r.height*iy;
  return {left,top,right:r.right,bottom:r.bottom,width:r.right-left,height:r.bottom-top}}

/* glow: a class on the thing itself (its own outline glows, see .guide-glow), and sparkles laid round it */
function markGlow(ring,r){
  if(glowEl!==ringEl){if(glowEl)glowEl.classList.remove('guide-glow');glowEl=ringEl}
  if(!ringEl.classList.contains('guide-glow'))ringEl.classList.add('guide-glow');  /* again if the thing was redrawn */
  ring.hidden=false;ring.className='guidering sparks';Object.assign(ring.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  if(ringDrawn!=='glow'){ring.innerHTML='';ringDrawn='glow'}
  if(Date.now()>sparkT){sparkT=Date.now()+380+Math.random()*420;
    /* a sparkle somewhere along the edge, a little outside it */
    const side=Math.random()*4|0,u=Math.random(),out=.06+Math.random()*.08,x=side<2?u:side===2?-out:1+out,y=side<2?(side?1+out:-out):u;
    const g=document.createElement('i');g.style.left=x*100+'%';g.style.top=y*100+'%';g.style.setProperty('--s',(.5+Math.random()*.6).toFixed(2));
    ring.appendChild(g);setTimeout(()=>g.remove(),1600)}}
/* star: one small star over the middle of the thing (under it if it is at the very top of the screen) */
function markStar(ring,r){r=drawn(r);const below=r.top<70,size=34;
  ring.hidden=false;ring.className='guidering floatstar'+(below?' below':'');
  Object.assign(ring.style,{left:r.left+r.width/2-size/2+'px',top:(below?r.bottom+10:r.top-size-12)+'px',width:size+'px',height:size+'px'});
  if(ringDrawn!=='star'){ringDrawn='star';ring.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 1.5l2.6 7.1 7.4.3-5.8 4.6 2 7.2L12 16.6l-6.2 4.1 2-7.2L2 8.9l7.4-.3z"/></svg>'}}
/* spotlight: the screen dims round a soft pool of light on the thing */
function markSpot(ring,r){r=drawn(r);ring.hidden=true;const sp=$('#guideSpot');sp.hidden=false;
  const cx=r.left+r.width/2,cy=r.top+r.height/2,rx=r.width/2+40,ry=r.height/2+36;
  sp.style.background=`radial-gradient(${rx.toFixed(0)}px ${ry.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px,transparent 55%,rgba(14,6,20,.42) 100%)`}

/* hand: a circle drawn by hand in the books' dark ink round the thing: a loop that goes a little past where it began, a
   touch uneven, drawn in with the pen (stroke) when it appears, roughened like the Recipe Book's tick (the #ink filter).
   Drawn again only when it moves to something new or that thing changes size. */
function loopPath(w,h){const cx=w/2,cy=h/2,rx=w/2-6,ry=h/2-6,n=72,turn=2*Math.PI*1.1,start=-1.9;let d='';
  for(let i=0;i<=n;i++){const t=i/n,a=start+turn*t,wob=1+.035*Math.sin(3*a+1)+.02*Math.sin(5*a),
    sp=1-.06*t;  /* the pen drifts inward a little as it comes round, so the end passes inside the start */
    d+=(i?'L':'M')+(cx+Math.cos(a)*rx*wob*sp).toFixed(1)+' '+(cy+Math.sin(a)*ry*wob*sp).toFixed(1)}
  return d}
/* Something big (the computer, the receipts) gets three short strokes fanning out from its top corner instead, the marks
   of something being noticed. At the top right corner, or the top left when the thing is on the right of the screen.
   NOTICE_INSET: how far in from its box a picture's corner is (left, top, as parts of the box). */
const BIG_AREA=200*150,NOTICE_INSET={'#pcBtn':[.16,.0]};
function noticePaths(L){const ang=[-78,-42,-6],len=[.8,1,.8];  /* degrees from the right, upward; the middle one longest */
  return ang.map((a,i)=>{const t=a*Math.PI/180,c=Math.cos(t),s=Math.sin(t),d0=6,d1=d0+L*len[i],bend=(i-1)*1.5;
    const x0=d0*c,y0=d0*s,x1=d1*c,y1=d1*s,mx=(x0+x1)/2-s*bend,my=(y0+y1)/2+c*bend;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`})}
function markHand(ring,r){
  if(r.width*r.height>=BIG_AREA){const L=Math.round(Math.max(20,Math.min(34,r.height*.1))),box=L+16,left=r.left+r.width/2>innerWidth/2,[ix,iy]=NOTICE_INSET[ringSel]||[.04,.04];
    const cx=left?r.left+r.width*ix:r.right-r.width*ix,cy=r.top+r.height*iy;
    ring.hidden=false;ring.className='guidering';Object.assign(ring.style,{left:(left?cx-box:cx)+'px',top:cy-box+'px',width:box+'px',height:box+'px'});
    const key=ringFor+'|n'+L+(left?'l':'r');if(key===ringDrawn)return;ringDrawn=key;
    ring.innerHTML=`<svg class="notice${left?' left':''}" width="${box}" height="${box}" viewBox="${left?-box:0} ${-box} ${box} ${box}">`+
      noticePaths(L).map((d,i)=>`<path class="gr-ink" d="${d}" pathLength="1" style="--i:${i}"${left?' transform="scale(-1,1)"':''}/>`).join('')+'</svg>';return}
  /* an oval a little larger than the thing, so the ink goes round it and not over it */
  const px=Math.min(40,Math.max(12,r.width*.08)),py=Math.min(32,Math.max(10,r.height*.12)),w=Math.round(r.width+px*2),h=Math.round(r.height+py*2);
  ring.hidden=false;ring.className='guidering';Object.assign(ring.style,{left:r.left-px+'px',top:r.top-py+'px',width:w+'px',height:h+'px'});
  const key=ringFor+'|'+Math.round(w/8)+'x'+Math.round(h/8);if(key===ringDrawn)return;ringDrawn=key;
  ring.innerHTML=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path class="gr-ink" d="${loopPath(w,h)}" pathLength="1"/></svg>`}
/* the mark follows its thing as views slide and books open */
(function follow(){placeRing();requestAnimationFrame(follow)})();
/* prototype: the Mark menu in the prototype bar */
if(PROTOTYPE_TOOLS){const m=$('#protoMark');m.innerHTML=Object.entries(MARKS).map(([k,v])=>`<option value="${k}">Mark: ${v}</option>`).join('');m.value=markMode;m.onchange=()=>setMarkMode(m.value)}
setInterval(guideTick,250);

/* Hester's note: in the middle of the screen, in her hand; a click outside closes it, like every popup */
function openNote(id){const n=HESTER_NOTES[id];$('#hNoteBody').innerHTML=`<h3>${esc(n.title)}</h3>${n.lines.map(t=>`<p>${esc(t)}</p>`).join('')}<p class="hsig">— H.</p>`;
  $('#hNote').dataset.note=id;$('#hNote').classList.add('open')}
function closeNote(){const m=$('#hNote');if(!m.classList.contains('open'))return;(S.guideNotes||(S.guideNotes={}))[m.dataset.note]=true;save();m.classList.remove('open')}
$('#hNote').addEventListener('click',e=>{if(e.target.id==='hNote')closeNote()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen('hNote')){closeNote();e.stopImmediatePropagation()}},true);
