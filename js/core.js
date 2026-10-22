/* Core: save state, helpers, letters and post, and the calendar conditions. */
const HOURS=['Sunrise','Noon','Twilight','Nightfall'];
const KEY=SAVE_KEY;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ITEM=Object.fromEntries(D.items.map(i=>[i.n,i]));
const WAX=['Waxing Crescent','Waxing Gibbous'], WAN=['Waning Gibbous','Waning Crescent'];  /* a moon cycle is six days */
const COLOURHEX={White:'#FFFFFF',Black:'#2A2233',Red:'#E2483D',Pink:'#FF9FCB',Orange:'#F59A3B',Yellow:'#FFE15A',Gold:'#D9A82E',Green:'#5DBB6A','Light blue':'#A9D6F5',Blue:'#4C7BD9',Purple:'#9B5FD0',Lavender:'#C8B2F0',Silver:'#C9CDD6',Brown:'#9A6B45',Grey:'#9A97A8'};
/* Swap clue lines, keyed by kind of miss: 'Needed>Got' target, too strong, too weak, or same feel. */
const CLUETAG={ing:'Ingredients',candle:'Candle',card:'Card',when:'Timing',came:'Came through',done:'Done',sum:'Overall'};
const WALKIN={
 'Body>Mind':'“Still aching, but honestly? I don’t mind any more.”','Body>Space':'“Still feel rotten, but the house has never been so peaceful.”',
 'Mind>Body':'“Slept like a log and woke up glowing. Still worried sick, though.”','Mind>Space':'“The flat feels wonderful. I, however, do not.”',
 'Space>Body':'“I feel great! The house is still a disaster.”','Space>Mind':'“Nothing changed, but somehow I’ve stopped caring?”',
 strong:'“It worked. A bit too well. We’re still recovering.”',weak:'“I think it worked? For about ten minutes.”'};

/* ---------- state ---------- */
function fresh(){return{day:1,h:0,hist:[],pend:[],tales:[],failTests:0,altar:[],candle:'',tarot:'',target:'',bank:[],fills:{},notes:{},
  orders:[],seen:{},gathered:{},stock:{...X.stock},letters:[false,false,false],mail:{},archive:[],hints:[],reports:[],log:[],result:null,queue:null,
  tut:{},stats:{perfect:0,good:0,clumsy:0,failed:0,advice:0,missed:0}}}
let S;
/* Load the save; an older prototype save is picked up once and carried over. */
try{S=JSON.parse(localStorage.getItem(KEY)||OLD_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean))||fresh()}catch(e){S=fresh()}
/* Drop anything a save points at that this build no longer has (customers, orders, recipes). */
function sanitize(){const vk=v=>v.day+'-'+v.hour+'-'+v.who,keys=new Set(X.visits.map(vk));
  S.orders=(S.orders||[]).filter(o=>keys.has(o.key)&&D.recipes[o.rid]);
  if(S.queue&&(S.queue.type==='new'?!keys.has(S.queue.key):!S.orders.some(o=>o.id===S.queue.oid)))S.queue=null;
  if(S.activeNow&&!keys.has(S.activeNow))S.activeNow=null;
  if(S.target&&!D.recipes[S.target])S.target='';
}
sanitize();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function toast(t){const el=$('#toast');el.textContent=t;el.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.display='none',2200)}
function log(t){S.log.unshift(`Day ${S.day}, ${HOURS[S.h]}: ${t}`);S.log=S.log.slice(0,40)}
/* Keywords not yet collected show a dotted underline; tapping one adds it to the word bank and picks it. Collected ones read as plain text. */
const KWRE=new RegExp('\\b('+[...D.vocab].sort((a,b)=>b.length-a.length).map(w=>w.replace('-','\\-')).join('|')+')\\b','gi');
function kw(text){const s=String(text);let out='',last=0;s.replace(KWRE,(m0,w,i)=>{out+=esc(s.slice(last,i))+(S.bank.includes(w.toLowerCase())?esc(m0):`<button class="kw" data-collect="${esc(w.toLowerCase())}">${esc(m0)}</button>`);  /* already collected: plain text */last=i+m0.length;return m0});return out+esc(s.slice(last))}
function collect(w){if(!S.bank.includes(w)){S.bank.push(w);toast(`Collected \u201C${w}\u201D`)}selWord=w;save()}
function addWords(ws){const n=[];ws.forEach(w=>{if(w&&!S.bank.includes(w)){S.bank.push(w);n.push(w)}});if(n.length)toast('New words: '+n.join(', '));return n}
const today=()=>D.cal[S.day-1];
/* Post: a letter turns up at a set hour, some time before the order it helps with. It arrives as an email on the computer. */
const mailIn=()=>X.mail.map((m,i)=>({...m,i})).filter(m=>m.day<S.day||(m.day===S.day&&HOURS.indexOf(m.hour)<=S.h));
/* Hints customers let slip are copied, in order, into one page in the Notes folder of the email. */
function noteHint(v){S.hints=S.hints||[];if(S.hints.some(h=>h.who===v.who&&h.text===v.hint.text))return;
  S.hints.push({day:S.day,hour:HOURS[S.h],who:v.who,text:v.hint.text});setTimeout(()=>toast('Noted in your archive: what they told you'),2400)}
/* A new email drops in with a little animation; the badge on the computer stays until it is opened. */
function showMailFx(m){const fx=$('#mailFx');fx.dataset.at=Date.now();$('#mailFrom').textContent=m.from;fx.hidden=false;fx.classList.remove('go');void fx.offsetWidth;fx.classList.add('go')}
function checkMail(){S.mail=S.mail||{};mailIn().forEach(m=>{if(!(m.i in S.mail)){S.mail[m.i]=false;log(`A new email came in: ${m.title}.`);showMailFx(m)}})}
const prev=()=>S.day>1?D.cal[S.day-2]:null;

/* ---------- conditions ---------- */
function met(c){const T=today(),hr=HOURS[S.h];
  switch(c.t){
    case 'day':return T.weekday===c.v; case 'phase':return T.phase===c.v;
    case 'pg':return (c.v==='waxing'?WAX:WAN).includes(T.phase);
    case 'dark':return T.phase==='New Moon'&&hr==='Nightfall';
    case 'time':return hr===c.v; case 'weather':return T.weather===c.v;
    case 'afterrain':{const p=prev();return !!p&&['Rain','Thunderstorm'].includes(p.weather)&&T.weather!=='Rain'}
    case 'starry':return T.night==='clear'&&hr==='Nightfall';
    case 'sabbat':return T.sabbat===c.v;
    case 'named':return T.named===c.v;
    case 'event':return (T.event||'').includes(c.v);
    case 'afterfull':{const p=prev();return !!p&&p.phase==='Full Moon'}
    case 'sabset':return c.v.split('|').includes(T.sabbat);
    case 'special':return false;}  /* customer-specific days are never met yet */
  return false}
function condName(c){return ({day:c.v,phase:c.v,pg:c.v==='waxing'?'Waxing Moon':'Waning Moon',dark:'Dark Moon',time:c.v,weather:c.v,afterrain:'after Rain',starry:'Clear starry night',sabbat:c.v,named:c.v,event:c.v,afterfull:'Morning after a Full Moon',sabset:c.v==='Ostara|Mabon'?'Any equinox':'Any equinox or solstice',special:c.v})[c.t]}
const WEATHERLINE={'Rain':'the smell of rain','Snow':'snow','Fog / Mist':'mist','Windy':'a wind','Thunderstorm':'thunder','Clear & sunny':'sunshine'};
function condClue(c,themes){const hr=S.h;
  switch(c.t){
    case 'day':{const p=(D.cond[c.v]||[]).find(x=>themes.includes(x));return[`It feels like it belongs to another day, a day of ${p||'something else'}.`,p?[p]:[]]}
    case 'phase':case 'pg':case 'dark':{let w='a different moon';const v=c.t==='pg'?c.v:c.v;
      if(c.t==='dark'||v==='New Moon')w='a new moon';else if(v==='Full Moon')w='a full moon';else if(c.v==='waxing'||WAX.includes(v))w='a growing moon';else if(c.v==='waning'||WAN.includes(v))w='a shrinking moon';
      return[`It glows faintly, waiting for ${w}.`,[]]}
    case 'time':{const need=HOURS.indexOf(c.v);return[hr<need?'It feels half-awake. Too early in the day?':'It feels sleepy. Too late in the day?',[]]}
    case 'weather':return[`It longs for ${WEATHERLINE[c.v]||'different weather'}.`,[]];
    case 'afterrain':return['It longs for the fresh air after rain.',[]];
    case 'starry':return['It longs for an open, starry sky.',[]];
    case 'sabbat':return['It hums like a festival song, but not today\u2019s.',[]];
    case 'named':return['It is waiting for one particular full moon.',[]];
    case 'event':return['It seems to be waiting for something rare in the sky.',[]];
    case 'afterfull':return['It wants the first light after a full moon.',[]];
    case 'sabset':return['It hums like a festival song, but not today\u2019s.',[]];
    case 'special':return['It is waiting for a day that belongs to someone.',[]];}
  return['Something about the moment is wrong.',[]]}
