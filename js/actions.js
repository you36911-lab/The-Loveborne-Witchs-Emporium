/* Actions: clicks, the bell, giving orders, and the end of the day. */
/* ---------- actions ---------- */
document.addEventListener('click',e=>{if(e.target.closest('#receiptsView')){$('#receiptsView').classList.remove('open');return}
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.openbook){curBook=b.dataset.openbook;openBooks();return}
  if(b.dataset.collect){collect(b.dataset.collect);if($('#books').classList.contains('open'))renderBooks();if($('#letters').classList.contains('open'))renderLetters();render();return}
  if(b.dataset.item){const n=b.dataset.item;const i=S.altar.indexOf(n);if(i>=0)S.altar.splice(i,1);else S.altar.push(n);render();return}
  if(b.dataset.candle!==undefined){S.candle=S.candle===b.dataset.candle?'':b.dataset.candle;render();return}
  if(b.dataset.tarot!==undefined){S.tarot=S.tarot===b.dataset.tarot?'':b.dataset.tarot;render();return}
  if(b.dataset.gather){const n=b.dataset.gather;S.stock[n]=(S.stock[n]||0)+1;S.gathered[S.day+'-'+n]=true;toast(`+1 ${n}`);render();return}
  /* a shelf row opens (or closes again); the open shelf has its own close button */
  if(b.dataset.shelf){openShelf=openShelf===b.dataset.shelf?'':b.dataset.shelf;renderShelves();return}
  /* tutorials: close this one for good, or skip them all */
  if(b.dataset.tutclose){S.tut[b.dataset.tutclose]='closed';render();return}
  if(b.dataset.tutskip){S.tutOff=true;render();return}
  switch(b.id){
    case 'clearBtn':S.altar=[];S.candle='';S.tarot='';S.result=null;render();break;
    case 'testBtn':doCraft(true);break;
    case 'giveBtn':doCraft(false);break;
    case 'madeBtn':giveMade();break;
    case 'toAltar':case 'toAltar2':setView('altar');break;
    case 'toShop':setView('shop');break;
    case 'okBtn':takeOrder(visitByKey(S.queue.key));render();break;
    case 'adviceBtn':{const v=visitByKey(S.queue.key);const a=$('#adviceSel').value;if(!a){toast('Choose an answer first.');break}
      const it=ITEM[a],k=v.ask,has=it.props.includes(k.kw);
      const grade=has&&it.t===k.t&&it.s===k.s?'Perfect':has?'Good':'Clumsy';
      record(grade,v.who,'Advice (no charge)');S.stats.advice++;S.seen[S.queue.key]=true;S.queue=null;
      if(grade==='Perfect'){S.result={grade,first:'',lines:[v.hint.text],test:false};noteHint(v)}
      else if(grade==='Good'){const kind=it.t!==k.t?k.t+'>'+it.t:(k.s==='Gentle'?'strong':'weak');tell(v,reactionFor(v,null,kind),`your advice to use ${a.toLowerCase()}`);S.result={grade,first:'',lines:['They thank you and hurry off.'],test:false}}
      else{tell(v,v.oops,`your advice to use ${a.toLowerCase()}`);S.result={grade,first:'',lines:['They thank you and hurry off.'],test:false}}
      render();break}
    case 'letGo':{const o=S.orders.find(o=>o.id===S.queue.oid);o.status='missed';S.stats.missed++;record('Missed',visitByKey(o.key).who,'No sale');S.queue=null;render();break}
    case 'reportBtn':{const q=S.queue;S.reports=S.reports.filter(r=>!(r.at===q.at&&r.who===q.who));S.queue=null;render();break}
    case 'newsBtn':S.queue.newsDone=true;render();break;
    case 'bellBtn':ringBell();break;
    case 'pcBtn':openLetters();break;
    case 'tillBtn':openReceipts();break;
    case 'crystalBtn':openInfo('Crystal ball',auraInfo());break;
    case 'notebookBtn':openDiary();break;
    case 'mailRead':{$('#mailFx').hidden=true;const m=mailIn().reverse().find(m=>!S.mail[m.i]);openLetters(m?'mail:'+m.i:'');break}
    case 'mailLater':$('#mailFx').hidden=true;break;
    case 'moveBtn':clearTimeout(autoT);nextHour();break;
    case 'cantBtn':if(b.dataset.sure){sendAway();render()}else{b.dataset.sure='1';b.textContent='They\u2019ll leave empty-handed. Tap again to let them go';b.classList.add('main');setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent='I don\u2019t know how to make this';b.classList.remove('main')}},4000)}break;
    case 'restartBtn':if(b.dataset.sure){S=fresh();sanitize();delete b.dataset.sure;b.textContent='Restart';render()}else{b.dataset.sure='1';b.textContent='Tap again to restart';setTimeout(()=>{delete b.dataset.sure;b.textContent='Restart'},3000)}break;
    case 'stayBtn':S.stay=S.day+'-'+S.h;autoTick();break;
  }});
/* Every popup closes when you click outside it. The path is taken as the click began, since a click inside a popup can redraw it. */
document.addEventListener('click',e=>{const t=e.target,path=e.composedPath(),inside=id=>path.some(n=>n.id===id);
  if(t.id==='info')$('#info').classList.remove('open');
  if(t.id==='letters'){$('#letters').classList.remove('open');render()}
  if(t.matches('#books, #books .bookmain, #books .tomewrap, #books .bookbar')){$('#books').classList.remove('open');render()}
  if(t.id==='dayEnd')$('#dayGo')?.click();  /* the day's summary has one way out: on to the next day */
  const fx=$('#mailFx');if(!fx.hidden&&Date.now()-(+fx.dataset.at||0)>400&&!t.closest('.mailcard'))fx.hidden=true;
  if(openShelf&&!inside('shelfOpen')&&!t.closest('[data-shelf]')){openShelf='';renderShelves()}
  /* a result read at the counter (nobody there) */
  if(plainAtClick&&!inside('counter')&&!t.closest('.modal')){S.result=null;render()}});
/* whether that result was already showing before this click (so the click that brings it up does not close it) */
let plainAtClick=false;document.addEventListener('click',()=>{plainAtClick=$('#counter').classList.contains('plain')},true);
$('#target').addEventListener('change',e=>{S.target=e.target.value;render()});
$('#ttype').addEventListener('change',e=>{S.ttype=e.target.value;S.target='';render()});
function doCraft(test){const r=D.recipes[S.target];if(!r||!S.altar.length)return;
  if(!test){const lacking=S.altar.filter(n=>X.stock[n]!==undefined&&S.stock[n]<=0);
    if(lacking.length){toast(`No ${lacking[0]} left. Fill a bottle first.`);return}
    S.altar.forEach(n=>{if(X.stock[n]!==undefined)S.stock[n]--})}
  const ev=evaluate(r,test);
  /* Test crafts are unlimited, but every fifth one that isn't perfect spoils a batch: a one-star review that night. */
  if(test){if(ev.grade!=='Perfect'){S.failTests=(S.failTests||0)+1;if(S.failTests%5===0){record('Failed','Spoiled test batches','Five test crafts gone wrong');toast('Five test crafts gone wrong. That will cost you a star tonight.')}}
    /* A perfect test says so plainly and writes the recipe into the book, so the player is never left guessing. */
    if(ev.grade==='Perfect'){ev.lines.unshift({k:'done',t:'Nothing is off. This is the recipe, ready to give.'});
      const n=noteOf(r.id),was=recipeLocked(r.id);n.ing=[...r.ing];n.candle=r.candle;n.tarot=r.tarot;n.when=r.conds.map(condName);
      if(!was&&recipeLocked(r.id)){ev.lines.push({k:'done',t:'You write it into the Recipe Book.'});toast('Recipe solved \u2726')}}
    S.result={grade:ev.grade,first:pickLine(ev.grade),lines:ev.lines,test:true}}
  else{/* Made for real: it goes up to the counter, and is given when the player clicks it there (giveMade). */
    const q=S.queue;if(!q)return;
    S.made={for:visitorId(q),rid:r.id,name:r.name,type:r.type,ev};S.result=null;
    S.altar=[];S.candle='';S.tarot='';setView('shop');return}
  if(!test){S.altar=[];S.candle='';S.tarot=''}  /* a test craft leaves the altar laid out */
  render()}
/* Hand over what was made: the grade was settled when it was made. */
function giveMade(){const m=S.made,q=S.queue;if(!m||!q||m.for!==visitorId(q))return;const r=D.recipes[m.rid],ev=m.ev;S.made=null;
  {let v;
    if(q.type==='return'){const o=S.orders.find(o=>o.id===q.oid);o.status='done';v=visitByKey(o.key)}else{v=visitByKey(q.key);S.seen[q.key]=true;S.activeNow=null}
    /* Every order has exactly one right recipe; making a different one fails, however well it is made. */
    if(String(v.rid)!==String(r.id))ev.grade='Failed';
    S.stats[ev.grade.toLowerCase()]++;record(ev.grade,v.who,`${r.name} (${r.type})`);
    const lines=[];
    if(ev.grade==='Perfect'){lines.push(v.hint.text);noteHint(v)}
    else{tell(v,ev.grade==='Good'?reactionFor(v,r,missKind(ev)):v.oops,`the ${r.type.toLowerCase()} you made them`);lines.push('They thank you and take it home.')}
    S.result={grade:ev.grade,first:'',lines,test:false};S.queue=null}
  render()}
function nextHour(auto){
  if(S.queue&&S.queue.type==='report')S.queue=null;  /* an unheard report waits for another hour */
  if(S.queue){const q=S.queue;
    if(q.type==='new'&&visitByKey(q.key).back&&S.activeNow!==q.key)takeOrder(visitByKey(q.key));
    else if(q.type==='new'){const v=visitByKey(q.key);S.seen[q.key]=true;
      if(S.activeNow===q.key||v.kind!=='advice'){S.stats.missed++;record('Missed',v.who,'No sale')}S.activeNow=null}
    else{const o=S.orders.find(o=>o.id===q.oid);o.status='missed';S.stats.missed++;record('Missed',visitByKey(o.key).who,'No sale')}
    S.queue=null}
  if(!auto)S.result=null;
  if(S.h<3){S.h++;render();return}
  endDay()}
const stars=n=>'\u2605'.repeat(n)+'\u2606'.repeat(5-n);
/* A receipt is written by hand on the shop's printed slip (ASSETS.receipt), one thing per ruled line (--r counts the lines):
   what was sold, to whom, the stars, and when. */
function receiptHTML(x){const who=(x.who||'a customer').replace(/^A(n?) /,'a$1 ');
  /* an order reads 'Name (Type)': the name gets the first line, and the type goes with who it was for ("Charm for a student");
     advice and spoiled batches keep their own wording */
  const m=String(x.item||'').match(/^(.*) \((.*)\)$/),order=m&&m[2]!=='no charge';
  const l1=order?m[1]:x.item||'',l2=order?m[2]+' for '+who:m?'for '+who:x.who||'';
  return `<div class="receipt" style="background-image:url('${ASSETS.receipt}')">`+
    `<span class="ln" style="--r:0">${esc(l1)}</span><span class="ln who" style="--r:1">${esc(l2)}</span>`+
    `<span class="ln rs" style="--r:2" aria-label="${SCORE[x.g]} of 5 stars">${stars(SCORE[x.g])}</span>`+
    `<span class="ln when" style="--r:4">Day ${S.day}, ${esc(x.hour)}</span></div>`}
function endDay(){const before=rating(),reviews=S.pend.splice(0);
  reviews.forEach(x=>S.hist.push(SCORE[x.g]));S.hist=S.hist.slice(-20);const after=rating();
  const body=$('#dayEndBody');
  const last=S.day>=LAST_PLAYABLE_DAY;
  body.innerHTML=`<h2>${last?'End of the first week':'The shop closes for the night'}</h2>
  <h3>Today's receipts</h3>${reviews.length?`<div class="receipts">${reviews.map(receiptHTML).join('')}</div>`:'<p class="muted">No sales today.</p>'}
  <p>Rating: ${before.toFixed(1)} \u2192 <b>${after.toFixed(1)}</b> of 5 (${S.hist.length?`average of the last ${S.hist.length} review${S.hist.length===1?'':'s'}`:'no reviews yet'}; Good work tops out at 4)</p>
  <p class="muted">How things turned out, customers will tell you when they next come in.</p>
  ${last?summaryHTML():''}
  <div class="row"><button class="main" id="dayGo">${last?'Start over':'Open the shop on Day '+(S.day+1)}</button></div>`;
  $('#dayEnd').classList.add('open');
  $('#dayGo').onclick=()=>{$('#dayEnd').classList.remove('open');
    if(last){S=fresh();sanitize()}else{S.day++;S.h=0;S.altar=[];S.candle='';S.tarot=''}
    showDawn()}}
function summaryHTML(){const s=S.stats;const locked=Object.keys(D.recipes).filter(id=>recipeLocked(id)).length;
  const pend=S.orders.filter(o=>o.status==='waiting').map(o=>D.recipes[o.rid].name);
  return `<h3>Your week</h3><p>Orders by stars: \u2605\u2605\u2605\u2605\u2605 ${s.perfect}, \u2605\u2605\u2605\u2605 ${s.good}, \u2605\u2605 ${s.clumsy}, \u2605 ${s.failed}. Advice given ${s.advice}. Customers who left empty-handed ${s.missed}.</p>
  <p>Words collected: ${S.bank.length}. Recipes solved in the Recipe Book: ${locked} of ${Object.keys(D.recipes).length}.</p>
  ${pend.length?`<p>Still to collect: ${pend.map(esc).join(', ')} (Tobias will fetch it next week).</p>`:''}
  ${S.tales.length?`<p>Stories you haven't heard yet: ${S.tales.length}. They'll come up next week.</p>`:''}`}
/* Escape closes an open shelf in the workroom, or the receipts. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;$('#receiptsView').classList.remove('open');$('#info').classList.remove('open');if(openShelf){openShelf='';renderShelves()}});
