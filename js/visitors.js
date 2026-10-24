/* Visitors: who is at the counter this hour. */
/* ---------- visitors ---------- */
function slotVisitors(){const d=S.day,h=HOURS[S.h];
  const v=X.visits.filter(x=>x.day===d&&x.hour===h&&!S.seen[x.day+'-'+x.hour+'-'+x.who]);
  const back=S.orders.filter(o=>o.status==='waiting'&&o.day===d&&o.hour===h);
  return{new:v,back}}
function currentVisitor(){
  const sv=slotVisitors();
  if(S.queue){return S.queue}
  if(S.parting)return null;  /* the last customer is still saying goodbye; the next one waits */
  if(!S.rung)return null;S.rung=false;  /* nobody comes in until the bell is rung */
  const busy=sv.back.length||sv.new.length,rp=dueReport(busy);
  if(rp){S.queue={type:'report',at:rp.at,who:rp.who};return S.queue}
  if(sv.back.length){const o=sv.back[0];S.queue={type:'return',oid:o.id};S.queue.tales=pullTales(visitByKey(o.key));return S.queue}
  if(sv.new.length){const v=sv.new[0];S.queue={type:'new',key:v.day+'-'+v.hour+'-'+v.who};S.queue.tales=pullTales(v);
    /* Morwenna always brings a bottle of sea water from Caldwell-on-Sea; it can't be had anywhere else. */
    if(v.gift){S.stock[v.gift]=(S.stock[v.gift]||0)+1;setTimeout(()=>toast(`+1 ${v.gift}, from ${v.who.split(' ')[0]}`),300)}
    return S.queue}
  return null}
/* Which visit something made at the altar is for: a new customer, or one back for their order. */
/* A customer who got just what they needed lingers to pass on a hint, in their own balloon, until the player clicks
   away or rings the bell. */
function part(v){S.parting={who:v.who,pic:v.pic,text:v.hint.text}}
const visitorId=q=>q.type==='return'?'order:'+q.oid:q.key;
function visitByKey(k){return X.visits.find(v=>v.day+'-'+v.hour+'-'+v.who===k)}
/* Star rating is the average of the last 20 deliveries and advice answers. */
const SCORE={Perfect:5,Good:4,Clumsy:2,Failed:1,Missed:1};
/* Grades stay internal: the player sees them only as stars on tonight's receipts. */
function record(g,who,item){S.pend.push({g,who,item,hour:HOURS[S.h]})}
/* Results are told later, always by the customer themselves: a regular on their next visit,
   a walk-in by coming back in a quiet hour (or, after two days, before the next customer). */
function tell(v,text,what){if(v.usual){S.tales.push({who:v.who,text,what,regular:true});return}
  (S.reports=S.reports||[]).push({who:v.who,aura:v.aura,text,what,at:S.day*4+S.h})}
function dueReport(busy){const now=S.day*4+S.h;return (S.reports||[]).find(r=>r.at<now&&(!busy||now-r.at>=8))}
/* whether someone would come in if the bell were rung now */
function someoneDue(){const sv=slotVisitors(),busy=sv.back.length||sv.new.length;return !!(busy||dueReport(busy))}
function pullTales(v){const own=S.tales.filter(t=>t.who===v.who),gossip=S.tales.find(t=>!t.regular&&t.who!==v.who);
  const out=[...own.map(t=>({own:true,...t})),...(gossip?[{own:false,...gossip}]:[])];S.tales=S.tales.filter(t=>!out.some(o=>o.who===t.who&&o.text===t.text));return out}
function talesHTML(q){return (q.tales||[]).map(t=>`<p class="tale">${t.own?'<b>About last time:</b> ':`<b>News of ${esc(t.who.replace(/^(A|An|Two) /,m=>m.toLowerCase()))}${t.what?` and ${esc(t.what)}`:''}:</b> `}${kw(t.text)}</p>`).join('')}
function rating(){return S.hist.length?S.hist.reduce((a,b)=>a+b,0)/S.hist.length:3}
