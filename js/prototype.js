/* Prototype only: jump to any week, day and hour, or straight to a customer, to look at it.
   Turn it off with PROTOTYPE_TOOLS in config.js. Jumping keeps the rest of the save as it is, unless "Roll back" is ticked:
   then jumping back to an earlier hour puts the whole game back as it was then (see the snapshots below). */
const WEEKS=Math.ceil(D.cal.length/7);
const visitLabel=v=>`Day ${v.day} ${v.hour}: ${v.who}`;
function protoDays(w){const out=[];for(let d=(w-1)*7+1;d<=Math.min(w*7,D.cal.length);d++){const T=D.cal[d-1];
  out.push(`<option value="${d}">Day ${d} · ${esc(T.weekday)}${T.sabbat?' · '+esc(T.sabbat):''}${d>LAST_PLAYABLE_DAY?' (no customers yet)':''}</option>`)}return out.join('')}
/* The menus start from where the game is now. */
function fillProto(){const w=Math.ceil(S.day/7);
  $('#protoWeek').innerHTML=Array.from({length:WEEKS},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join('');$('#protoWeek').value=w;
  $('#protoDay').innerHTML=protoDays(w);$('#protoDay').value=S.day;
  $('#protoHour').innerHTML=HOURS.map((h,i)=>`<option value="${i}">${h}</option>`).join('');$('#protoHour').value=S.h;
  $('#protoWho').innerHTML='<option value="">Customer (optional)</option>'+X.visits.map((v,i)=>`<option value="${i}">${esc(visitLabel(v))}</option>`).join('')}
/* Snapshots for rolling back: the game as it stood at the start of each hour played (the first save in that hour), kept
   in this browser under their own key, for this game only (S.gid; a new game starts afresh). The last 60 hours are kept. */
const SNAP_KEY=SAVE_KEY+'-proto-snaps',SNAP_MAX=60;
const hourNo=(d,h)=>(d-1)*4+h;
function snaps(){try{const o=JSON.parse(localStorage.getItem(SNAP_KEY)||'null');return o&&o.gid===S.gid?o:{gid:S.gid,at:{}}}catch(e){return{gid:S.gid,at:{}}}}
function putSnaps(o){const ks=Object.keys(o.at).map(Number).sort((a,b)=>a-b);ks.slice(0,Math.max(0,ks.length-SNAP_MAX)).forEach(k=>delete o.at[k]);
  try{localStorage.setItem(SNAP_KEY,JSON.stringify(o))}catch(e){}}
if(PROTOTYPE_TOOLS){const save0=save;
  save=function(){if(!S.gid)S.gid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const o=snaps(),k=hourNo(S.day,S.h);if(!(k in o.at)){o.at[k]=JSON.stringify(S);putSnaps(o)}
    save0()}}
/* Back to an earlier hour with everything as it was: the latest snapshot at or before it (or a new game, if none), and
   the snapshots after it are dropped, as that future is gone. The tutorial setting stays as it is. */
function rollBack(day,h){const o=snaps(),k=hourNo(day,h),tutOff=S.tutOff,gid=S.gid;
  const best=Object.keys(o.at).map(Number).filter(x=>x<=k).sort((a,b)=>b-a)[0];
  if(best!==undefined)S=JSON.parse(o.at[best]);else{S=fresh();S.gid=gid}
  S.tutOff=tutOff;sanitize();
  Object.keys(o.at).map(Number).filter(x=>x>k).forEach(x=>delete o.at[x]);putSnaps(o);
  ['#books','#pc','#phoneView','#receiptsView','#ingNote'].forEach(s=>$(s)?.classList.remove('open'));
  if(typeof renderCandles==='function')renderCandles();if(typeof renderPhoneBadge==='function')renderPhoneBadge();
  return best!==undefined}
/* Whoever is booked for that hour comes in again, even if you have already served them. */
function jumpTo(day,h){clearTimeout(autoT);
  const back=hourNo(day,h)<hourNo(S.day,S.h);
  if(back&&$('#protoRoll')?.checked){const had=rollBack(day,h);
    toast(had?`Rolled back to Day ${day}, ${HOURS[h]}: the game as it was then.`:'Nothing kept from that far back: a new game from there.')}
  /* the till holds only the open day's receipts: jumping to another day drops the ones that day never closed */
  if(day!==S.day)S.pend=[];
  S.day=day;S.h=h;S.queue=null;S.activeNow=null;S.result=null;S.parting=null;S.rung=true;  /* a jump rings the bell for you */
  X.visits.forEach(v=>{if(v.day===day&&v.hour===HOURS[h])delete S.seen[v.day+'-'+v.hour+'-'+v.who]});
  /* lessons whose visit comes before this point count as done (jumping back before it brings it back) */
  guideSkipBefore(day,h);
  $('#dayEnd').classList.remove('open');dawnUntil=0;$('#dayCard').classList.remove('on');document.body.classList.remove('dawning');
  render();fillProto()}
if(PROTOTYPE_TOOLS){$('#proto').hidden=false;fillProto();
  $('#protoWeek').onchange=e=>{$('#protoDay').innerHTML=protoDays(+e.target.value)};
  $('#protoWho').onchange=e=>{const v=X.visits[e.target.value];if(!v)return;
    $('#protoWeek').value=Math.ceil(v.day/7);$('#protoDay').innerHTML=protoDays(Math.ceil(v.day/7));$('#protoDay').value=v.day;$('#protoHour').value=HOURS.indexOf(v.hour)};
  $('#protoGo').onclick=()=>jumpTo(+$('#protoDay').value,+$('#protoHour').value);
  /* the tutorial on or off for this game (a lock never reaches this bar: it is in ALWAYS_FREE, tutorial.js) */
  const tutLabel=()=>{const b=$('#protoTut');b.textContent='Tutorial: '+(S.tutOff?'off':'on');b.setAttribute('aria-pressed',String(!S.tutOff))};tutLabel();
  $('#proto').addEventListener('pointerenter',tutLabel);  /* a new game may have changed it */
  /* "Roll back" (remembered in this browser): jumping back also puts the game data back */
  try{$('#protoRoll').checked=localStorage.getItem('protoRoll')==='1'}catch(e){}
  $('#protoRoll').onchange=e=>{try{localStorage.setItem('protoRoll',e.target.checked?'1':'')}catch(err){}};
  $('#protoTut').onclick=()=>{S.tutOff=!S.tutOff;save();tutLabel();if(typeof guideTick==='function')guideTick()};
  $('#protoDawn').onclick=()=>{jumpTo(+$('#protoDay').value,0);showDawn()};
  /* fold the bar away to its label (remembered in this browser); the ` key does it too */
  const fold=on=>{$('#proto').classList.toggle('folded',on);$('#protoFold').setAttribute('aria-expanded',String(!on));try{localStorage.setItem('protoFolded',on?'1':'')}catch(e){}};
  let was='';try{was=localStorage.getItem('protoFolded')||''}catch(e){}fold(!!was);
  $('#protoFold').onclick=()=>fold(!$('#proto').classList.contains('folded'));
  document.addEventListener('keydown',e=>{if(e.key==='`'&&!e.target.closest('input,textarea,select,[contenteditable]'))fold(!$('#proto').classList.contains('folded'))})}
