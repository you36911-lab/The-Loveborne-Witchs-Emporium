/* Actions: clicks, the bell, giving orders, and the end of the day. */
/* ---------- actions ---------- */
document.addEventListener('click',e=>{if(e.target.closest('#receiptsView')){$('#receiptsView').classList.remove('open');return}
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.openbook){curBook=b.dataset.openbook;openBooks();return}
  if(b.dataset.collect){collect(b.dataset.collect);if($('#books').classList.contains('open'))renderBooks();if($('#pc').classList.contains('open'))renderPC();if($('#phoneView').classList.contains('open'))$('#phoneApp').innerHTML=phoneHTML();  /* the phone keeps the result it shows */render();return}
  if(b.dataset.item){const n=b.dataset.item;const i=S.altar.indexOf(n);if(i>=0)S.altar.splice(i,1);else if(S.altar.length>=ALTAR_MAX){toast('The altar is full. Seven things are all it holds.');return}else{S.altar.push(n);
    if(ITEM[n]&&ITEM[n].c==='Crystals')toast(n)}  /* crystals look alike: taking one out, its name shows as a subtitle */
    render();return}
  if(b.dataset.candle!==undefined){S.candle=S.candle===b.dataset.candle?'':b.dataset.candle;render();return}
  if(b.dataset.tarot!==undefined){S.tarot=S.tarot===b.dataset.tarot?'':b.dataset.tarot;render();return}
  /* a shelf row opens (or closes again); the open shelf has its own close button */
  if(b.dataset.shelf){openShelf=openShelf===b.dataset.shelf?'':b.dataset.shelf;renderShelves();return}
  switch(b.id){
    case 'craftBell':ringAltarBell();break;
    case 'spellBtn':takeSpell();break;
    /* the name of what is being made: little pink stars burst from it, then the Recipe Book opens on its page */
    case 'makingBtn':starBurst(b);setTimeout(()=>{curBook='Recipe Book';if(S.target){(S.page||(S.page={}))['Recipe Book']='recipe:'+S.target}openBooks()},calm()?0:420);break;
    case 'madeBtn':giveMade();break;
    case 'toAltar':setView('altar');break;
    case 'toShop':setView('shop');break;
    case 'adviceBtn':{const v=visitByKey(S.queue.key);const a=adviceAnswer(v);if(!a)break;adviceDraft={key:'',text:'',hi:-1};
      const it=ITEM[a],k=v.ask,has=it.props.includes(k.kw);
      const grade=has&&it.t===k.t&&it.s===k.s?'Perfect':has?'Good':'Clumsy';
      record(grade,v.who,'Advice (no charge)',S.queue.key);S.stats.advice++;S.seen[S.queue.key]=true;S.queue=null;
      if(grade==='Perfect')part(v);
      else if(grade==='Good'){const kind=it.t!==k.t?k.t+'>'+it.t:(k.s==='Gentle'?'strong':'weak');tell(v,reactionFor(v,null,kind),`your advice to use ${a.toLowerCase()}`);S.result={grade,first:'',lines:['They thank you and hurry off.'],test:false}}
      else{tell(v,v.oops,`your advice to use ${a.toLowerCase()}`);S.result={grade,first:'',lines:['They thank you and hurry off.'],test:false}}
      render();break}
    case 'reportBtn':{const q=S.queue;S.reports=S.reports.filter(r=>!(r.at===q.at&&r.who===q.who));S.queue=null;render();break}
    case 'newsBtn':S.queue.newsDone=true;render();break;
    case 'bellBtn':ringBell();break;
    case 'pcBtn':openPC();break;
    case 'tillBtn':if(S.pend.length)playTill();openReceipts();break;  /* the till prints them as it opens, whenever there are any */
    case 'notebookBtn':openDiary();break;
    case 'mailRead':{$('#mailFx').hidden=true;const m=mailIn().reverse().find(m=>!S.mail[m.i]);
      /* in the first morning's tutorial it opens the inbox, so H.'s emails are read first, oldest first */
      openLetters(m&&!(S.guide&&typeof S.guide.open==='number')?'mail:'+m.i:'');break}
    case 'mailLater':$('#mailFx').hidden=true;render();break;  /* the mood line may come back now */
    case 'moveBtn':clearTimeout(autoT);nextHour();break;
    case 'cantBtn':if(b.dataset.sure){sendAway();render()}else{b.dataset.sure='1';b.textContent='Let them go';toast('They\u2019ll leave empty-handed\u2026 Should I really let them go?',{thought:true,ms:4000});setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent='I don\u2019t know how to make this'}},4000)}break;
    case 'stayBtn':S.stay=S.day+'-'+S.h;autoTick();break;
  }});
/* ---------- the advice answer: typed, with suggestions ----------
   The player types the name. From two letters, names from the asked-for kind (crystals, herbs…) are suggested.
   Only an exact name counts (capitals, spaces and accents do not matter). A misspelt or unknown name does nothing
   but bring up a thought along the bottom, like a subtitle. */
let adviceDraft={key:'',text:'',hi:-1};
const normName=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function adviceCat(){const q=S.queue,v=q&&q.key&&visitByKey(q.key);return v&&v.kind==='advice'?v.ask.cat:''}
function suggestions(text){const t=normName(text),cat=adviceCat();if(t.length<2||!cat)return [];
  const pool=D.items.filter(i=>i.c===cat).map(i=>i.n),words=n=>n.split(/[\s\-']+/).map(normName);
  /* names that start with it first, then names with a later word that starts with it, then names that contain it */
  const rank=n=>normName(n).startsWith(t)?0:words(n).some(w=>w.startsWith(t))?1:normName(n).includes(t)?2:3;
  return az(pool).map(n=>[rank(n),n]).filter(x=>x[0]<3).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).slice(0,6)}
function fillSuggest(){const list=$('#adviceList');if(!list)return;const s=suggestions(adviceDraft.text);
  if(adviceDraft.hi>=s.length)adviceDraft.hi=s.length-1;
  list.hidden=!s.length||(s.length===1&&normName(s[0])===normName(adviceDraft.text));
  list.innerHTML=s.map((n,i)=>`<button type="button" role="option" data-advpick="${esc(n)}"${i===adviceDraft.hi?' class="hi" aria-selected="true"':''}>${esc(n)}</button>`).join('')}
function pickSuggest(n){if(!n)return;adviceDraft.text=n;adviceDraft.hi=-1;const inp=$('#adviceIn');inp.value=n;inp.focus();fillSuggest()}
/* the name typed, if it is one of the asked-for kind; otherwise a thought, and nothing happens */
function adviceAnswer(v){const t=normName(adviceDraft.text);
  if(!t){toast('What was it called again…');return ''}
  const hit=D.items.find(i=>normName(i.n)===t);
  if(hit&&hit.c===v.ask.cat)return hit.n;
  if(hit){const kind={'Crystals':'a crystal','Herbs & flowers':'a herb or a flower'}[v.ask.cat]||'from '+v.ask.cat.toLowerCase();
    toast(`${hit.n}? No, that isn’t ${kind}.`);return ''}
  toast('Hmm. Did I spell that right?');return ''}
{const c=$('#counter');
  c.addEventListener('input',e=>{if(e.target.id!=='adviceIn')return;adviceDraft.text=e.target.value;adviceDraft.hi=-1;fillSuggest()});
  c.addEventListener('keydown',e=>{if(e.target.id!=='adviceIn')return;const list=$('#adviceList'),open=!list.hidden,s=open?suggestions(adviceDraft.text):[],d=adviceDraft;
    if(e.key==='ArrowDown'&&open){e.preventDefault();d.hi=(d.hi+1)%s.length;fillSuggest()}
    else if(e.key==='ArrowUp'&&open){e.preventDefault();d.hi=d.hi<=0?s.length-1:d.hi-1;fillSuggest()}
    else if(open&&(e.key==='Tab'||e.key==='Enter'&&d.hi>=0)){e.preventDefault();pickSuggest(s[Math.max(0,d.hi)])}
    else if(e.key==='Enter'){e.preventDefault();$('#adviceBtn').click()}
    else if(e.key==='Escape'&&open){e.stopPropagation();list.hidden=true}});
  c.addEventListener('pointerdown',e=>{if(e.target.closest('#adviceList'))e.preventDefault()});  /* picking keeps the typing focus */
  c.addEventListener('click',e=>{const b=e.target.closest('[data-advpick]');if(b)pickSuggest(b.dataset.advpick)});
  c.addEventListener('focusin',e=>{if(e.target.id==='adviceIn')fillSuggest()});
  c.addEventListener('focusout',e=>{if(e.target.id==='adviceIn'){const l=$('#adviceList');if(l)l.hidden=true}})}
/* Every popup closes when you click outside it. The path is taken as the click began, since a click inside a popup can redraw it. */
document.addEventListener('click',e=>{const t=e.target,path=e.composedPath(),inside=id=>path.some(n=>n.id===id);
  if(t.id==='info')$('#info').classList.remove('open');
  if(t.id==='pc')closePC();
  /* a book closes at a click anywhere outside it (the bookmarks and word bank columns too), except on a control */
  if(inside('books')&&!path.some(n=>n.matches?.('.tome, button, input, select, textarea, a'))){$('#books').classList.remove('open');render()}
  if(t.id==='dayEnd')$('#dayGo')?.click();  /* the day's summary has one way out: on to the next day */
  const fx=$('#mailFx');if(!fx.hidden&&Date.now()-(+fx.dataset.at||0)>400&&!t.closest('.mailcard')){fx.hidden=true;render()}
  if(openShelf&&!inside('shelfOpen')&&!t.closest('[data-shelf]')){openShelf='';renderShelves()}
  /* a result read at the counter (nobody there) */
  if(plainAtClick&&!inside('counter')&&!t.closest('.modal')){S.result=null;render()}});
/* whether that result was already showing before this click (so the click that brings it up does not close it) */
let plainAtClick=false;document.addEventListener('click',()=>{plainAtClick=$('#counter').classList.contains('plain')},true);
/* A test craft: what was written is laid out on the altar, it is crafted (craftAnim), and only then is it judged: a black
   candle goes out if it isn't perfect, and the result comes to the phone (a sound and a badge; the phone shows it
   when clicked). Either way what was laid out is used up and the finished spell stands on the altar (S.spell):
   - made with the bell, or a perfect test of what the customer at the counter ordered: clicking it takes it up to the
     counter, where it is given;
   - any other test: clicking it clears it away. */
function doCraft(test){const r=D.recipes[S.target];if(!r||!S.altar.length)return;
  if(test){render();craftAnim(()=>judgeTest(r));return}  /* judged at the top of the crafting, as the finished spell comes down */
  judge(r,false)}
function judgeTest(r){const before=S.failTests||0;judge(r,true);phoneNotify((S.failTests||0)>before?1100:300)}
/* the finished spell takes the place of what was laid out */
function makeSpell(r,give){S.spell={rid:r.id,name:r.name,type:r.type,give};S.altar=[];S.candle='';S.tarot=''}
function takeSpell(){const s=S.spell;if(!s)return;S.spell=null;if(s.give&&S.made)setView('shop');else render()}
function judge(r,test){
  const tries=S.tests||(S.tests={}),ev=evaluate(r,test,test?tries[r.id]||0:1);  /* S.tests: test crafts of each recipe gone wrong */
  if(ev.grade==='Perfect')(S.spellArt||(S.spellArt={}))[r.id]=true;  /* made just right: its illustration in the Recipe Book unlocks */
  /* Test crafts are unlimited, but every fifth one that isn't perfect spoils a batch: a one-star review that night. */
  if(test){if(ev.grade!=='Perfect')tries[r.id]=(tries[r.id]||0)+1;
    if(ev.grade!=='Perfect'){S.failTests=(S.failTests||0)+1;if(S.failTests%5===0&&!(typeof tutorialTest==='function'&&tutorialTest())){record('Failed','Spoiled test batches','Five test crafts gone wrong');toast('Five test crafts gone wrong. That will cost me a star tonight.')}}
    /* A perfect test says so plainly and writes the recipe into the book, so the player is never left guessing. */
    if(ev.grade==='Perfect'){ev.lines.unshift({k:'done',t:'Nothing is off. This is the recipe, ready to give.'});
      const n=noteOf(r.id),was=recipeLocked(r.id);n.ing=[...r.ing];n.candle=r.candle;n.tarot=r.tarot;n.when=r.conds.map(condName);
      if(!was&&recipeLocked(r.id)){ev.lines.push({k:'done',t:'You write it into the Recipe Book.'});setTimeout(()=>showRecipeDone(r.id),1600)}}  /* once the crafting has settled, its page comes up (books.js) */
    S.lastTest={grade:ev.grade,lines:ev.lines,name:r.name,type:r.type,ok:ev.ok,total:ev.total};S.testLog=[S.lastTest,...(S.testLog||[])].slice(0,10);  /* the result goes to the phone (phone.js) */
    /* a perfect test of what the waiting customer ordered is ready to give, as if made with the bell */
    const o=orderRecipe(),give=ev.grade==='Perfect'&&o&&String(o.id)===String(r.id)&&S.queue;
    if(give)S.made={for:visitorId(S.queue),rid:r.id,name:r.name,type:r.type,ev};
    makeSpell(r,!!give)}
  else{/* Made for real: the spell stands on the altar; clicking it takes it up to the counter, where it is given (giveMade). */
    const q=S.queue;if(!q)return;
    S.made={for:visitorId(q),rid:r.id,name:r.name,type:r.type,ev};S.result=null;makeSpell(r,true)}
  render()}
/* The silver bell on the altar makes what is laid out, for the customer at the counter. (Test crafts are made from the
   Recipe Book only.) If it can't be made yet, the bell gives a little shake and says why. It rings out before the view goes
   up to the counter, so it is seen and heard. */
let bellBusy=false;
function ringAltarBell(){const b=$('#craftBell');if(bellBusy)return;
  const why=!orderRecipe()?'Nobody is waiting on an order right now.':!S.target?'I haven\u2019t chosen what I\u2019m making yet. The Recipe Book first.':!S.altar.length?'Nothing is laid out on the altar yet.':'';
  if(why){b.classList.remove('nope','ring');void b.offsetWidth;b.classList.add('nope');playAltarBell();toast(why);return}
  b.classList.remove('ring','nope');void b.offsetWidth;b.classList.add('ring');playAltarBell();bellBusy=true;
  setTimeout(()=>craftAnim(()=>{bellBusy=false;doCraft(false)}),450)}  /* it is crafted (the same as a test craft); the spell then waits on the altar */
/* Hand over what was made: the grade was settled when it was made. */
function giveMade(){const m=S.made,q=S.queue;if(!m||!q||m.for!==visitorId(q)||(S.spell&&S.spell.give))return;const r=D.recipes[m.rid],ev=m.ev;S.made=null;
  {const v=visitByKey(q.key);S.seen[q.key]=true;S.activeNow=null;
    /* Every order has exactly one right recipe; making a different one fails, however well it is made. */
    if(String(v.rid)!==String(r.id))ev.grade='Failed';
    S.stats[ev.grade.toLowerCase()]++;record(ev.grade,v.who,`${r.name} (${r.type})`,q.key);
    if(ev.grade==='Perfect')part(v);
    else{tell(v,ev.grade==='Good'?reactionFor(v,r,missKind(ev)):v.oops,`the ${r.type.toLowerCase()} you made them`);S.result={grade:ev.grade,first:'',lines:['They thank you and take it home.'],test:false}}
    S.queue=null}
  render()}
function nextHour(auto){
  if(S.queue&&S.queue.type==='report')S.queue=null;  /* an unheard report waits for another hour */
  if(S.queue){const q=S.queue;
    const v=visitByKey(q.key);S.seen[q.key]=true;
    if(S.activeNow===q.key||v.kind!=='advice'){S.stats.missed++;record('Missed',v.who,'No sale',q.key)}S.activeNow=null;
    S.queue=null}
  S.parting=null;
  if(!auto)S.result=null;
  if(S.h<3){S.h++;render();return}
  endDay()}
const stars=n=>'\u2605'.repeat(n)+'\u2606'.repeat(5-n);
/* A receipt is written by hand on the shop's printed slip (ASSETS.receipt), one thing per ruled line (--r counts the lines):
   what was sold, to whom, the stars, and when. */
/* a ruled line holds about 27 letters; a longer sale goes onto two lines, its (Type) on the second when the name fits the first */
const RECEIPT_LINE=27;
function receiptLines(t){if(t.length<=RECEIPT_LINE)return[t];
  const m=t.match(/^(.*) (\(.*\))$/);if(m&&m[1].length<=RECEIPT_LINE)return[m[1],m[2]];
  const w=t.split(' ');let a='';while(w.length&&(a?a+' '+w[0]:w[0]).length<=RECEIPT_LINE)a=a?a+' '+w.shift():w.shift();
  return[a,w.join(' ')]}
function receiptHTML(x,i=0){
  /* what was sold, as 'Name (Type)' ("Advice (no charge)", "No sale"), then the customer, the stars, and when on the last line */
  const rows=[...receiptLines(x.item||''),(X.names||{})[x.who]||x.who||'A customer'];  /* a walk-in by their own name */
  /* each slip sits a hair off straight, differently, and its stamp lands at its own angle, as paper and a hand stamp do */
  const tilt=[-.8,.6,-.4,.9,-.6,.3][i%6],stamp=[-2.5,1.5,-1,2,-2,1][i%6];
  return `<div class="receipt" style="background-image:url('${ASSETS.receipt}');--tilt:${tilt}deg;--stamp:${stamp}deg">`+
    rows.map((t,i)=>`<span class="ln${i===rows.length-1?' who':''}" style="--r:${i}">${esc(t)}</span>`).join('')+
    `<span class="ln rs" style="--r:${rows.length}" aria-label="${SCORE[x.g]} of 5 stars"><span class="stamp">${stars(SCORE[x.g])}</span></span>`+
    `<span class="ln when" style="--r:4">Day ${x.day||S.day}, ${esc(x.hour)}</span></div>`}
/* closing: the day's receipts and how the rating moved since the shop opened (the reviews came in during the day) */
function endDay(){const reviews=S.pend.splice(0),after=rating(),before=S.openRating!=null?S.openRating:after;  /* the first day had no rating to move from */
  const body=$('#dayEndBody');
  const last=S.day>=LAST_PLAYABLE_DAY;
  /* a paper card, like the shop's other papers: the day, the title, the day's receipts in a row, the rating as it moved */
  const T=today(),d=after-before,move=Math.abs(d)<.05?'':`<span class="de-move ${d>0?'up':'down'}">${d>0?'\u25b2':'\u25bc'} ${Math.abs(d).toFixed(1)}</span>`;
  body.innerHTML=`<p class="de-day">Day ${S.day} \u00b7 ${esc(T.weekday)}${T.sabbat?' \u00b7 '+esc(T.sabbat):''}</p>
  <h2>${last?'End of the first week':'The shop closes for the night'}</h2>
  ${reviews.length?`<div class="receipts">${reviews.map(receiptHTML).join('')}</div>`:'<p class="de-none">No sales today.</p>'}
  <div class="de-rating" aria-label="Rating ${after.toFixed(1)} of 5"><span class="de-stars">${stars(Math.round(after))}</span><b>${after.toFixed(1)}</b>${move}</div>
  ${last?summaryHTML():''}
  <button class="main" id="dayGo">${last?'Start over':'Open the shop on Day '+(S.day+1)}</button>`;
  $('#dayEnd').classList.add('open');
  if(reviews.length)playReceiptPrint(reviews.length);  /* the till prints the day's receipts as the card comes up (sound.js) */
  $('#dayGo').onclick=openNextDay}
/* the end-of-day card's button: on to the next day (or, after the last playable day, a new game) */
function openNextDay(){$('#dayEnd').classList.remove('open');
  if(S.day>=LAST_PLAYABLE_DAY){S=fresh();sanitize()}else{S.day++;S.h=0;S.altar=[];S.candle='';S.tarot='';S.openRating=rating()}
  S.ui=null;showDawn()}
function summaryHTML(){const s=S.stats;const locked=Object.keys(D.recipes).filter(id=>recipeLocked(id)).length;
  return `<h3>Your week</h3><p>Orders by stars: \u2605\u2605\u2605\u2605\u2605 ${s.perfect}, \u2605\u2605\u2605\u2605 ${s.good}, \u2605\u2605 ${s.clumsy}, \u2605 ${s.failed}. Advice given ${s.advice}. Customers who left empty-handed ${s.missed}.</p>
  <p>Words collected: ${S.bank.length}. Recipes solved in the Recipe Book: ${locked} of ${Object.keys(D.recipes).length}.</p>
  ${S.tales.length?`<p>Stories you haven't heard yet: ${S.tales.length}. They'll come up next week.</p>`:''}`}
/* Escape closes an open shelf in the workroom, or the receipts. */
/* A button clicked with the mouse lets go of the keyboard focus, so a key pressed later (Space while reading, say) does
   not press it again, nor light it up as if the pointer were on it. Pressed from the keyboard (detail 0), it keeps it. */
document.addEventListener('click',e=>{if(e.detail>0){const b=e.target.closest&&e.target.closest('button');if(b)setTimeout(()=>b.blur(),0)}});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;$('#receiptsView').classList.remove('open');$('#info').classList.remove('open');if(openShelf){openShelf='';renderShelves()}});
/* A burst of little pink stars from the middle of an element, flying out in a ring and fading (none with reduced motion). */
function starBurst(el){if(calm())return;const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,n=8;
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+Math.random()*.5,d=Math.max(r.width*.35,40)+Math.random()*30,s=document.createElement('span');
    s.className='burst';s.textContent='✦';s.setAttribute('aria-hidden','true');
    s.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d*.55}px;--sz:${12+Math.random()*10}px;animation-delay:${Math.random()*60}ms`;
    s.addEventListener('animationend',()=>s.remove());document.body.appendChild(s)}}
/* Crafting what is laid out: a magic circle draws itself on the cloth under it and slowly turns, a soft light rises on the
   wall behind, the things take on a pink rim of light and drift in toward the middle, turning a little, while tiny motes
   of light rise off the cloth and gather over them; at the peak a burst of stars, and they settle back. Nothing can be clicked meanwhile. If the view is still
   sliding down to the workroom, it waits for that first. */
const CRAFT_PEAK_MS=2500,SPELL_DROP_MS=1500;  /* the rise to the top; the finished spell's coming down */
let spellDrop=false,craftRise=0;  /* craftRise: how far up (px) the things went, where the spell appears */  /* the next finished spell drawn on the altar comes down from where the things rose to */
function craftAnim(done){const moving=$('#world').getAnimations?.().length>0;
  if(calm()){setTimeout(()=>{playCraft();done()},moving?950:0);return}
  document.body.classList.add('crafting');
  setTimeout(()=>{const plates=$('#plates'),pr=plates.getBoundingClientRect(),cx=pr.left+pr.width/2,glow=$('#craftGlow');
    const mc=$('#magicCircle'),x=(cx-glow.parentElement.getBoundingClientRect().left)+'px';glow.style.left=mc.style.left=x;  /* both centred on what is laid out */
    [glow,mc].forEach(e=>{e.classList.remove('on');void e.getBoundingClientRect();e.classList.add('on')});playCraft();plates.classList.add('charging');craftMotes(pr,cx);
    /* the things rise slowly, drawing in and turning, and stay up there a moment */
    craftRise=Math.round(pr.height*1.1);const up=craftRise;  /* how high they rise: a good way above the table, whatever their size */
    plates.querySelectorAll('.ontable').forEach((el,i)=>{const r=el.getBoundingClientRect(),dx=(cx-(r.left+r.width/2))*.55,turn=i%2?7:-7;
      el.animate([{transform:'none'},{transform:`translate(${dx*.5}px,${-up*.3}px) scale(.93) rotate(${turn/2}deg)`,offset:.4},
        {transform:`translate(${dx}px,${-up*.92}px) scale(.84) rotate(${turn}deg)`,offset:.85},{transform:`translate(${dx}px,${-up}px) scale(.84) rotate(${-turn}deg)`}],
        {duration:CRAFT_PEAK_MS,easing:'ease-in-out',fill:'forwards'})});
    setTimeout(()=>craftBurst(plates),CRAFT_PEAK_MS-300);
    /* at the top, with the burst, they become the finished spell, which comes down in their place (spellDrop, scene.js) */
    setTimeout(()=>{plates.classList.remove('charging');spellDrop=true;done();if(spellDrop){spellDrop=false;render()}},CRAFT_PEAK_MS);
    setTimeout(()=>{glow.classList.remove('on');mc.classList.remove('on');document.body.classList.remove('crafting')},CRAFT_PEAK_MS+SPELL_DROP_MS)},moving?1150:150)}
/* the burst at the peak of crafting: a big ring of stars flying wide from over the middle, then a second, smaller wave */
function craftBurst(el){const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.4-craftRise;  /* up where the things have risen to */
  const wave=(n,dmin,dmax,smin,smax,dur,delay)=>{for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+Math.random()*.4,d=dmin+Math.random()*(dmax-dmin),s=document.createElement('span');
    s.className='burst';s.textContent='\u2726';s.setAttribute('aria-hidden','true');
    s.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d*.7-20}px;--sz:${smin+Math.random()*(smax-smin)}px;animation-duration:${dur}ms;animation-delay:${delay+Math.random()*80}ms`;
    s.addEventListener('animationend',()=>s.remove());document.body.appendChild(s)}};
  wave(18,r.width*.3,r.width*.62,16,34,1150,0);wave(12,r.width*.12,r.width*.32,10,20,900,220)}
/* motes of light rising off the cloth around what is laid out and drifting in over its middle, each at its own pace */
function craftMotes(pr,cx){const top=pr.top+pr.height*.25;
  for(let i=0;i<34;i++){const m=document.createElement('span');m.className='mote';m.setAttribute('aria-hidden','true');
    const x=pr.left+Math.random()*pr.width,y=pr.bottom-Math.random()*pr.height*.35,s=3+Math.random()*4;
    m.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px`;document.body.appendChild(m);
    const tx=(cx-x)*(.55+Math.random()*.35)+(Math.random()-.5)*30,ty=top-y-Math.random()*pr.height*.25;
    m.animate([{transform:'translate(0,0)',opacity:0},{opacity:.95,offset:.25},{transform:`translate(${tx*.5}px,${ty*.55}px)`,opacity:.9,offset:.6},
      {transform:`translate(${tx}px,${ty}px) scale(.4)`,opacity:0}],{duration:1700+Math.random()*700,delay:Math.random()*900,easing:'ease-in-out',fill:'both'})
      .onfinish=()=>m.remove()}}
