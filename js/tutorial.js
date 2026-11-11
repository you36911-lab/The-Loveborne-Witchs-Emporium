/* The tutorial (see TUTORIAL_PLAN.md). Each lesson is taught once, when it first matters, in three ways:
   - the shopkeeper's own thought, as a subtitle at the bottom (#guideLine), never saying "you";
   - a small star bobbing on the next thing to click (#guideRing), and only that can be clicked until it is done;
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
const R1=visitByKey(FIRST_ORDER).rid;  /* the first order's recipe, which the tutorial shows whole */
/* the first of its ingredient blanks still empty (-1 when all are written) */
const firstBlank=()=>{const n=noteOf(R1);return D.recipes[R1].ing.findIndex((_,i)=>!n.ing[i])};
/* why an ingredient fits a recipe: the one theme it brings. Each ingredient brings its own, none twice: the themes are
   shared out among the ingredients (Chamomile comfort, Blue thread calm, Small key opportunity). */
function themeShare(rid){const r=D.recipes[rid],ings=r.ing.filter(i=>ITEM[i]);let best={},most=-1;
  /* every way of sharing them out; the one that gives the most ingredients a theme wins (a base may bring none) */
  const go=(k,cur,n)=>{if(k===ings.length){if(n>most){most=n;best={...cur}}return}
    ITEM[ings[k]].props.filter(p=>r.themes.includes(p)&&!Object.values(cur).includes(p)).forEach(p=>go(k+1,{...cur,[ings[k]]:p},n+1));
    go(k+1,{...cur,[ings[k]]:''},n)};
  go(0,{},0);return best}
function whyFits(item,rid){return themeShare(rid)[item]||ITEM[item].props.find(p=>D.recipes[rid].themes.includes(p))||'this'}

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
  themes:{title:'What goes in',lines:['Every recipe says what it is for. Each thing in it carries one of those, and the books say what each thing carries.','A herb for healing, a stone for courage. Match them up, dear, and the recipe all but writes itself.']},
  tests:{title:'Test crafts',lines:['A test shows what’s missing, shelf by shelf. Try the same one again and it tells you more.','But every wrong test puts out a black candle. Five out, and the street smells it.']}};

/* The lessons, in the order they are taught. when: it may start; until: it is over (marked done); steps run in order.
   ensure: run while the step is current, to put back what it needs. A step: glow (where the star goes: a selector, or a function giving one), say (the thought), done (when it is passed),
   wait (ms: done after this long), note (one of Hester's notes, shown when the step is reached, done when it is closed),
   allow (while it waits, only the star's thing and these can be clicked or even hovered: a selector (that and all inside
   it), or {self: selector} (that element alone, e.g. a popup's backdrop, whose click closes it);
   a step without allow blocks nothing). */
const TURNS=['#turnPrev','#turnNext','#turnFirst','#turnLast'];  /* turning a book's pages */
const READING=['#letterRead .wm-text'];  /* the open email: scrolled and read, its dotted words tapped */
const THEMES='#books .pg .recipe .wvals.plain';  /* a recipe's themes, on its page */
const LESSONS=[
  {id:'open',at:'1-Sunrise-',when:()=>S.day===1&&S.h===0&&afterDawn(),until:()=>S.h>0||!!S.queue,steps:[
    {glow:()=>!$('#mailFx').hidden?'#mailRead':'#pcBtn',say:'The computer’s chiming. Post, before I’ve even opened.',done:()=>isOpen('pc'),allow:[],
      /* came back to it (a reload) with the email still unread: its card comes up again, as it was */
      ensure:()=>{if(isOpen('pc')||!$('#mailFx').hidden)return;const m=mailIn().find(m=>S.mail&&S.mail[m.i]===false);if(m)showMailFx(m)}},
    /* H.'s three, the oldest first (at the bottom of the inbox), then the apothecary's. The email that is open can always
       be read (scrolled, its dotted words tapped): READING. The word bank is taught in her second email, whose first
       dotted word is scrolled into view. */
    {glow:'[data-lsel="start:0"]',say:'Three from H., from before I came. The oldest first.',done:()=>!!S.letters[0],allow:[]},
    {glow:'[data-lsel="start:1"]',say:'She kept this shop before me. Best read all she left.',done:()=>!!S.letters[1]&&letterSel==='start:1',allow:READING},
    {glow:'#letterRead .kw',say:'A word with dots under it… worth keeping. Tapped, it goes into my word bank, by the books.',done:()=>S.bank.length>0,allow:READING,
      ensure:()=>{const k=$('#letterRead .kw');if(k&&!k.dataset.shown){k.dataset.shown=1;k.scrollIntoView({block:'center',behavior:'smooth'})}}},
    {glow:'[data-lsel="start:2"]',say:'And her last.',done:()=>S.letters.every(Boolean),allow:READING},
    {glow:'[data-lsel="mail:0"]',say:'And the one that just came, from the apothecary.',done:()=>S.mail&&S.mail[0]===true,allow:READING},
    /* the computer closes at a click outside it, like every popup: only that click works here (and reading on) */
    {say:'That’s plenty to start with. Back to the counter.',done:()=>!isOpen('pc'),allow:[{self:'#pc'},...READING]},
    {note:'aura'},
    /* where Hester's notes are kept: beside the notebook, as slips, to read again */
    {glow:'#notebookBtn',say:'Her note goes in my notebook, to keep.',done:()=>isOpen('books')&&curBook===DIARY,allow:[]},
    /* the star on the slip goes once the pointer has been over it */
    {glow:()=>slipSeen?'':'#books .pg .hslip',say:'There. Taped in the front of my notebook, whenever I need it again.',wait:4500,allow:[],
      ensure:()=>{if(isOpen('books')&&curBook===DIARY&&pageOf()!=='diary:0'&&!turning)turnTo(0)}},
    /* the rest of the notebook is the player's own: they may write in it, and a click beside it closes it */
    {glow:()=>memoTyped?'':'#books .pg .memo',say:'The rest of the pages are mine. Anything worth remembering, I can write here.',  /* the star goes once something is written */done:()=>!isOpen('books'),allow:['#books .pg .memo',{self:'#books'},{self:'#books .bookmain'}]},
    {glow:'#bellBtn',say:'Time to open. The bell calls the next one in.',done:()=>!!bellWait||!!S.queue||S.h>0,allow:[]}]},
  {id:'order1',at:FIRST_ORDER,when:()=>atCounter(FIRST_ORDER),until:()=>S.seen[FIRST_ORDER]&&!S.parting,end:()=>S.pend.some(p=>p.key===FIRST_ORDER&&p.g==='Perfect')?'One done. Her shoulders came down a little as she left.':'Made and given. We’ll see how it goes.',steps:[
    /* listening: only the balloon (a click shows the rest of the words at once) */
    {glow:()=>wordsDone()?'#crystalBtn':'',say:()=>wordsDone()?'A charm for her pocket… and the ball’s pale blue. She’s worried, then.':'',done:()=>spokenFor(4000),allow:['#counter .balloon']},
    {glow:'#bookStack [data-openbook="Recipe Book"]',say:'The Recipe Book will have it.',done:()=>bookOpen('Recipe Book'),allow:[]},
    /* The first order is shown whole: the star goes to the right recipe in the index, then to each blank and the right
       name in its list, with why it fits. Working it out from the books is for the orders after this one. */
    {glow:()=>seen(`[data-go="recipe:${R1}"]`)?`[data-go="recipe:${R1}"]`:'#turnNext',say:()=>`The index first. A charm, for an easier day: ${D.recipes[R1].name}.`,done:()=>pageOf()==='recipe:'+R1,allow:[...TURNS]},
    {glow:`#books .pg [data-choose-recipe="${R1}"]`,say:'That’s the one. I’ll tap its name to mark it as what I’m making.',done:()=>String(S.target)===String(R1),allow:[]},
    /* what the recipe is for: everything in it carries one of these (the link between the books and the recipes) */
    {glow:THEMES,say:()=>`What it’s for: ${D.recipes[R1].themes.join(', ')}. Everything that goes in carries one of those.`,wait:6500,allow:[]},
    /* each blank in turn: the star on the blank, then on the right name in the list it opens */
    {glow:()=>{const i=firstBlank();if(i<0)return '';const key=`ing|${R1}|${i}`;
        return pickOpen===key?`#books .windex [data-choose="${key}"][data-val="${D.recipes[R1].ing[i]}"]`:`#books .pg [data-pick="${key}"]`},
      say:()=>{const i=firstBlank();if(i<0)return '';const want=D.recipes[R1].ing[i],c=ITEM[want].c;
        return `${CATLABEL[c]||c}: ${want}, for ${whyFits(want,R1)}.`},
      done:()=>allWritten(R1),allow:[],
      ensure:()=>{const o=seen('#books .windex [data-choose][data-val]')&&ringEl&&ringEl.closest('.windex');if(o&&!ringEl.dataset.shown){ringEl.dataset.shown=1;ringEl.scrollIntoView({block:'nearest'})}}},
    {glow:'#books .pg [data-layout]',say:'Written. Next time I’ll work it out from the books myself. The little bell lays it all out downstairs.',done:()=>S.altar.length>0&&view==='altar',allow:[]},
    {glow:'#craftBell',say:'Everything’s on the table. The silver bell makes it.',done:()=>!!S.spell||!!S.made,allow:[]},
    {glow:'#spellBtn',say:'There it is. Up to the counter with it.',done:()=>!!S.made&&view==='shop'&&!S.spell,allow:[]},
    {glow:'#madeBtn',say:'Wrapped and waiting. Hand it over.',done:()=>S.seen[FIRST_ORDER],allow:[]},
    /* what she lets slip as she goes (the hint): it comes back in her review on the computer, after closing */
    {glow:()=>S.parting&&wordsDone()?'#counter .balloon':'',say:()=>S.parting&&wordsDone()?'What she let slip… I’ll find it again in her review on the computer.':'',done:()=>!S.parting,allow:[],holdCustomer:4000}]},
  /* after the first sale: its receipt at the till, then her review, which comes in as she leaves, with what she let slip */
  {id:'sale1',at:'1-Noon-~sale',when:()=>guideState().order1==='done'&&!S.queue&&!S.parting&&S.reviews.length>0,until:()=>!!S.queue||S.day>1,steps:[
    {glow:'#tillBtn',say:'The till printed her receipt. What she had, and her stars.',done:()=>isOpen('receiptsView'),allow:[]},
    {say:'',done:()=>!isOpen('receiptsView'),allow:['#receiptsView']},
    {glow:()=>isOpen('pc')?'#desk .dicon[data-app="shop"]':'#pcBtn',say:'And her review’s come in already.',done:()=>pcApp('shop'),allow:[]},
    {glow:'#shopApp .rv-ps',say:'A P.S. at the bottom. What they let slip tends to matter, sometimes for the very next order.',wait:8000,allow:['#shopApp .sh-list']},
    {say:'Every review comes in as they leave. My rating is the average of their stars.',done:()=>!isOpen('pc'),allow:[{self:'#pc'},'#shopApp .sh-list']}]},
  /* Hester teaches test crafts herself (her tutorial line in story.js), then the steps follow it */
  {id:'hester',at:HESTER_DAY1,when:()=>atCounter(HESTER_DAY1),until:()=>S.seen[HESTER_DAY1],steps:[
    {say:'',done:()=>spokenFor(1500),allow:['#counter .balloon']},
    {glow:'#bookStack [data-openbook="Recipe Book"]',say:'Test it first, she said. Her rune is in the Recipe Book; she wrote most of it in her email.',done:()=>bookOpen('Recipe Book'),allow:[]},
    {glow:()=>seen('[data-go="recipe:111"]')?'[data-go="recipe:111"]':'#turnFirst',say:'The Language of Ravens.',done:()=>pageOf()==='recipe:111'||(S.testLog||[]).length>0,allow:[...TURNS]},
    {glow:'#books .pg [data-booktest="111"]',say:'The little bottle tests what’s written.',done:()=>(S.testLog||[]).length>0,allow:[]},
    {glow:'#phoneBtn',say:'The phone. That’s where a test tells me how it went.',done:()=>isOpen('phoneView'),allow:[]},
    /* the result on the phone, part by part; then it closes at a click outside it */
    {glow:'#phoneApp .ph-grade',say:'How it came out, at the top.',wait:4000,allow:['#phoneApp']},
    {glow:()=>seen('#phoneApp .ph-score')?'#phoneApp .ph-score':'',say:'How many of the ingredients were right…',wait:4500,allow:['#phoneApp']},
    {glow:'#phoneApp .ph-sec[data-k]:not([data-k=""])',say:'…and what’s off, under each heading: the ingredients, the candle, the card.',wait:6500,allow:['#phoneApp']},
    {say:'',done:()=>!isOpen('phoneView'),allow:[{self:'#phoneView'},'#phoneApp']},
    {note:'tests'},
    {say:'That one goes in my notebook too.',wait:3500},
    {say:'Fill in what’s missing, test again, and ring the silver bell when it’s right.',done:()=>S.seen[HESTER_DAY1]}]},
  {id:'nurse',at:NURSE,when:()=>atCounter(NURSE),until:()=>S.seen[NURSE],steps:[{say:'On my own this time.',wait:5000},
    /* once her recipe is open: what it is for, and how that leads to what goes in */
    {say:'',done:()=>bookOpen('Recipe Book')&&pageOf()==='recipe:'+visitByKey(NURSE).rid},
    {glow:THEMES,say:()=>`${D.recipes[visitByKey(NURSE).rid].themes.join(', ')}. Each thing in it carries one of those, and the books say what each thing carries.`,wait:7000},
    {note:'themes'}]},
  {id:'close1',at:'2-Sunrise-',when:()=>S.day===1&&isOpen('dayEnd'),until:()=>S.day>1||!isOpen('dayEnd'),steps:[
    {glow:'#dayEnd .receipts',say:'The day’s receipts. Everyone who came, and their stars.',done:()=>!isOpen('dayEnd')}]},
  {id:'advice1',at:FIRST_ADVICE,when:()=>atCounter(FIRST_ADVICE),until:()=>S.seen[FIRST_ADVICE],steps:[
    {say:()=>wordsDone()?'She only wants to know which herb. Nothing to make.':'',done:()=>spokenFor(3500),allow:['#counter .balloon']},
    {glow:'#bookStack [data-openbook="Herbiary"]',say:'The Herbiary. Something for love, for the mind, and strong.',done:()=>bookOpen('Herbiary'),allow:[]},
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
/* the notebook steps: once the player has looked at the slip (the pointer over it), or written something, the star has
   done its job and goes */
let slipSeen=false;$('#books').addEventListener('pointerover',e=>{if(e.target.closest('.hslip'))slipSeen=true});
let memoTyped=false;$('#books').addEventListener('input',e=>{if(e.target.dataset.memo!==undefined)memoTyped=true});
/* Whether the customer has finished speaking: their words type out letter by letter (typeBalloon in scene.js), or all at
   once when the balloon is clicked (wordsDone, in scene.js). spokenFor(ms): they finished at least this long ago (counted within the current step). */
let spokeAt=0;
function spokenFor(ms){if(!wordsDone()){spokeAt=0;return false}if(!spokeAt)spokeAt=Date.now();return Date.now()-spokeAt>=ms}
/* a step with holdCustomer keeps a parting customer that much longer, so its thought can be read */
function partingExtra(){return ringStep&&ringStep.holdCustomer||0}
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
    if(!st){finish(L);L=current();continue}  /* never stall on a step that is not there (an older save, a hole) */
    if(guideNow!==key){guideNow=key;guideStepAt=Date.now();spokeAt=0}
    const passed=st.note?(S.guideNotes||{})[st.note]:(st.done&&st.done())||(st.wait&&Date.now()-guideStepAt>=st.wait);
    if(passed){g[L.id]=i+1;save();if(g[L.id]>=L.steps.length){finish(L);L=current()}continue}
    if(st.ensure)st.ensure();  /* a step can put back what it needs on screen (after a reload, say) */
    if(postFirst()){show(null);return}
    if(st.note){if(!isOpen('hNote'))openNote(st.note);show(null);return}
    show(st);return}
  show(null)}
/* Post comes first: nothing from the tutorial shows while an email is about to arrive at dawn, or while a new email's
   card is still dropping in (until its buttons appear). */
function postFirst(){const fx=$('#mailFx'),waiting=mailIn().some(m=>!(m.i in (S.mail||{})));
  return (waiting&&Date.now()<dawnUntil+MAIL_AFTER_DAWN_MS+300)||(!fx.hidden&&Date.now()-(+fx.dataset.at||0)<500)}  /* the card's words and buttons fade in from 0.5s (style.css): the star comes with them */
function finish(L){guideState()[L.id]='done';save();const t=L.end&&L.end();if(t)toast(t,{thought:true,ms:4200})}

/* ---------- on screen ---------- */
let ringEl=null,ringSel='',ringStep=null,ringWanted=false;
function show(st){const line=$('#guideLine');ringStep=st;
  const say=(st&&(typeof st.say==='function'?st.say():st.say))||'',toastUp=$('#toast').style.display==='block';
  if(line.dataset.say!==say){line.dataset.say=say;line.textContent=say;line.classList.remove('in');if(say){void line.offsetWidth;line.classList.add('in')}}
  let sel=st&&st.glow;if(typeof sel=='function')sel=sel();
  ringEl=sel?(typeof sel==='string'?seen(sel):sel):null;ringSel=typeof sel==='string'?sel:'';ringWanted=!!sel;  /* (a step's glow can be empty for a while: no star yet, but the lock holds) */
  /* inside a book, the star waits until the book has opened and while a page turns, so it lands straight on its thing */
  if(ringEl&&ringEl.closest('#books')&&(!$('#tome').classList.contains('opened')||turning)){ringEl=null}
  /* post comes first: while a new email's card is up, the thought waits, unless it is about that email */
  const mailUp=!$('#mailFx').hidden&&!(ringEl&&ringEl.closest('#mailFx'));
  line.hidden=!say||toastUp||mailUp;
  $('#sceneNote').classList.toggle('guided',!line.hidden);  /* the mood line steps aside */
  placeRing()}

/* The mark: a bright gold star that sits on the top edge of the next thing to click, bobbing gently (on its bottom edge
   when the thing is at the very top of the screen; at the left end of a row or a line). DRAWN_INSET: how far in from its box a picture really starts (left,
   top, as parts of the box), so the star sits over the picture and not over empty space. */
const DRAWN_INSET={'#pcBtn':[.16,.03]};  /* the monitor's top edge slants down a little toward its left */
function placeRing(){const ring=$('#guideRing');let r=ringEl&&ringEl.isConnected&&ringEl.getBoundingClientRect();
  if(!r||!r.width){ring.hidden=true;return}
  const [ix,iy]=DRAWN_INSET[ringSel]||[0,0],left=r.left+r.width*ix,top=r.top+r.height*iy,size=r.height<36?38:56,  /* smaller over a word or a short line */below=top<50;
  /* something wide and low (a row in a list, a line of text) gets its star at its left end instead, so it does not sit on the row above */
  const wide=r.width>r.height*2.6&&r.height<90;
  ring.hidden=false;ring.classList.toggle('below',below&&!wide);
  if(wide){Object.assign(ring.style,{left:left-size*.45+'px',top:(top+r.bottom)/2-size/2+'px',width:size+'px',height:size+'px'});return}
  Object.assign(ring.style,{left:(left+r.right)/2-size/2+'px',top:(below?r.bottom-size*.5:top-size*.5)+'px',width:size+'px',height:size+'px'})}
/* the star follows its thing as views slide and books open */
function follow(){placeRing();markLock();requestAnimationFrame(follow)}  /* started at the end of this file */
setInterval(guideTick,250);  /* the tutorial looks at where things stand four times a second */

/* While a step waits for something to be done, only that works: the star's thing, and what the step's allow list names.
   Any other click does nothing (the star gives a small pulse), and Esc does not close what is open. Always free: the menu,
   the prototype bar, Hester's note, and a new email that arrives meanwhile (post comes first). It can never get stuck:
   if the star's thing is not on screen, or something lies over it, nothing is blocked until it can be reached. */
const ALWAYS_FREE='#guideLine, #hNote, #ingNote, #proto, #title, #gameMenu, #settings';
/* the star's thing can be reached: it is on screen, and no open popup lies over it (it is inside the topmost one) */
const OVERLAYS=['#hNote','#ingNote','#mailFx','#dayEnd','#phoneView','#receiptsView','#info','#pc','#books'];
function reachable(el){if(!el||!el.isConnected)return false;const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;
  const over=OVERLAYS.map(q=>$(q)).find(m=>m&&(m.id==='mailFx'?!m.hidden:m.classList.contains('open')));return !over||over.contains(el)}
function locked(){const st=ringStep;if(!st||!st.allow||S.tutOff||titleOpen()||menuOpen()||isOpen('hNote'))return false;
  if(ringWanted&&!reachable(ringEl))return false;
  return true}
function stepAllows(t){if(!locked())return true;
  if(t.closest(ALWAYS_FREE))return true;
  if(t.closest('#mailFx')&&!(ringEl&&ringEl.closest('#mailFx')))return true;
  if(ringEl&&ringEl.contains(t))return true;
  return ringStep.allow.some(a=>typeof a==='string'?t.closest(a):t.matches(a.self))}
/* a blocked click: the subtitle stays as it is, and the star gives one small pulse to show where to click */
document.addEventListener('click',e=>{if(stepAllows(e.target))return;e.stopImmediatePropagation();e.preventDefault();
  const ring=$('#guideRing');ring.classList.remove('nudge');void ring.offsetWidth;ring.classList.add('nudge')},true);
/* Hover too: while locked, everything but the star's thing and what the step allows ignores the mouse (body.guide-locked
   in style.css), so nothing else even lights up under the pointer. The allowed things are marked each frame. */
let okMarked=new Set();
function markLock(){const on=locked();document.body.classList.toggle('guide-locked',on);const want=new Map();
  if(on){const add=(el,cls)=>{if(el)want.set(el,cls)};
    document.querySelectorAll(ALWAYS_FREE).forEach(el=>add(el,'guide-ok'));
    if(!$('#mailFx').hidden&&!(ringEl&&ringEl.closest('#mailFx')))add($('#mailFx'),'guide-ok');
    ringStep.allow.forEach(a=>document.querySelectorAll(typeof a==='string'?a:a.self).forEach(el=>add(el,typeof a==='string'?'guide-ok':'guide-ok-self')));
    add(ringEl,'guide-ok')}
  okMarked.forEach(el=>{if(!want.has(el))el.classList.remove('guide-ok','guide-ok-self')});
  want.forEach((cls,el)=>{if(!el.classList.contains(cls))el.classList.add(cls)});okMarked=new Set(want.keys())}
/* (Esc during a step opens the menu over everything, see menu.js; it does not close what is open) */

/* Hester's note: in the middle of the screen, in her hand; a click outside closes it, like every popup */
/* a note's words, the same in the popup and taped into the notebook */
function noteHTML(id){const n=HESTER_NOTES[id];return `<h3>${esc(n.title)}</h3>${n.lines.map(t=>`<p>${esc(t)}</p>`).join('')}<p class="hsig">— H.</p>`}
function openNote(id){$('#hNoteBody').innerHTML=noteHTML(id);
  $('#hNote').dataset.note=id;$('#hNote').classList.add('open')}
function closeNote(){const m=$('#hNote');if(!m.classList.contains('open'))return;(S.guideNotes||(S.guideNotes={}))[m.dataset.note]=true;save();m.classList.remove('open')}
$('#hNote').addEventListener('click',e=>{if(e.target.id==='hNote')closeNote()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen('hNote')){closeNote();e.stopImmediatePropagation()}},true);

follow();  /* the star and the lock follow every frame (started last, once everything above is defined) */
