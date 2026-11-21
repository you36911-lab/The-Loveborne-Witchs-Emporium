/* Core: save state, helpers, letters and post, and the calendar conditions. */
const HOURS=['Sunrise','Noon','Twilight','Nightfall'];
const KEY=SAVE_KEY;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ITEM=Object.fromEntries(D.items.map(i=>[i.n,i]));
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
  seen:{},letters:[false,false,false],mail:{},archive:[],reviews:[],reviewsSeen:0,memo:[],reports:[],result:null,queue:null,
  tut:{},stats:{perfect:0,good:0,clumsy:0,failed:0,advice:0,missed:0}}}
let S;
/* Whether a game is saved (the title screen offers Continue only then). Nothing saves until the game starts. */
const hasSave=()=>{try{return [KEY,...OLD_SAVE_KEYS].some(k=>localStorage.getItem(k))}catch(e){return false}};
/* Load the save; an older prototype save is picked up once and carried over. */
/* Things renamed or merged since: an older save's notes and altar are renamed as they load ("Ink" is now "Plain ink";
   the dark-glass compact, the black satin pouch and the copper disc were merged into the Clamshell compact, the Fabric pouch and the Wooden disc;
   the buttons are all plural now, and the rainbow threads one Rainbow thread like the other threads;
   Fennel seed, Paintbrush bristle, Glass bead, Silver bead, Wooden die, Tiny bell, Small key, Teacup charm and Quill are plural now;
   the Wax seal is Sealing wax). */
const RENAMED={'Ink':'Plain ink','Clamshell compact (dark glass)':'Clamshell compact','Satin pouch (black)':'Fabric pouch','Copper disc':'Wooden disc',
  'Brass button':'Brass buttons','Gold button':'Gold buttons','Heart-shaped button':'Heart-shaped buttons','Mismatched button':'Mismatched buttons',
  'Square button':'Square buttons','Star-shaped button':'Star-shaped buttons','Vintage button':'Vintage buttons','Rainbow threads':'Rainbow thread',
  'Fennel seed':'Fennel seeds','Paintbrush bristle':'Paintbrush bristles',
  'Glass bead':'Glass beads','Silver bead':'Silver beads','Wooden die':'Wooden dice','Tiny bell':'Tiny bells','Wax seal':'Sealing wax','Small key':'Small keys','Teacup charm':'Teacup charms','Quill':'Quills'};
const renameOld=raw=>Object.entries(RENAMED).reduce((t,[a,b])=>t.split(JSON.stringify(a)).join(JSON.stringify(b)).split(JSON.stringify('item:'+a)).join(JSON.stringify('item:'+b)),raw);
/* Prototype only (PROTOTYPE_TOOLS; the real game keeps a single save): backups of the game, kept in this browser beside the save (the menu's Backups puts one back, or saves the game to a file):
   one at the start of each day, and one just before anything replaces the game (a new game, Restart, a roll back, putting
   a backup back, or a save that will not load). The newest BACKUP_MAX are kept. */
const BACKUP_KEY=SAVE_KEY+'-backups',BACKUP_MAX=12;
function backups(){try{return JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]')}catch(e){return []}}
function keepBackup(why,raw){if(!PROTOTYPE_TOOLS)return;raw=raw||JSON.stringify(S);let o=null;try{o=JSON.parse(raw)}catch(e){}
  if(o&&o.day===1&&o.h===0&&!(o.hist||[]).length&&why!=='day')return;  /* nothing played yet: nothing to keep */
  const list=[{at:Date.now(),why,day:o?o.day:0,h:o?o.h:0,gid:o&&o.gid||'',data:raw},...backups()].slice(0,BACKUP_MAX);
  while(list.length){try{localStorage.setItem(BACKUP_KEY,JSON.stringify(list));return}catch(e){list.pop()}}}  /* storage full: the oldest go first */
let rawLoad='';
try{rawLoad=localStorage.getItem(KEY)||OLD_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean)||'';S=JSON.parse(rawLoad?renameOld(rawLoad):null)||fresh()}
catch(e){keepBackup('unreadable',rawLoad);try{localStorage.setItem(KEY+'-unreadable',rawLoad)}catch(e2){}S=fresh()}  /* never lost: kept aside, untouched */
const BASE_ADDED=[3,13,23,45,55,57,61,77,102,104,106,115,124,135,143,149,153,158,171,176,180,191,193,198,215,217,219,240];
/* These had Spring water put in front for a while (2026-11-21) and are back as they were: a save that moved its notes
   along for them moves them back. */
const BASE_TAKEN_BACK=[1,26,31,36,56,64,66,69,91,101,107,110,116,125,129,145,151,162,174,184,199,205,206,214,223,236,239];
/* Drop anything a save points at that this build no longer has (customers, recipes). */
function sanitize(){const vk=v=>v.day+'-'+v.hour+'-'+v.who,keys=new Set(X.visits.map(vk));
  delete S.orders;  /* orders taken for later belong to older builds */
  /* These recipes were given their base material as a new first ingredient (2026-11-21): what the player has written
     in their Recipe Book ingredients moves along one place, so each word stays with its ingredient. Done once per recipe. */
  S.baseAdded=S.baseAdded||[];
  BASE_ADDED.forEach(id=>{if(S.baseAdded.includes(id))return;const n=(S.notes||{})[id];
    if(n&&Array.isArray(n.ing)&&n.ing.length)n.ing.unshift('');S.baseAdded.push(id)});
  BASE_TAKEN_BACK.forEach(id=>{const k=S.baseAdded.indexOf(id);if(k<0)return;const n=(S.notes||{})[id];
    if(n&&Array.isArray(n.ing)&&n.ing.length)n.ing.shift();S.baseAdded.splice(k,1)});
  if(S.queue&&(S.queue.type==='new'?!keys.has(S.queue.key):S.queue.type!=='report'))S.queue=null;
  if(S.activeNow&&!keys.has(S.activeNow))S.activeNow=null;
  if(S.target&&!D.recipes[S.target])S.target='';
  /* hints used to be written in the notebook; they now come in the reviews on the computer, and the notebook is the player's own */
  if(!S.reviews)S.reviews=(S.hints||[]).map(h=>({day:h.day,hour:h.hour,who:h.who,g:'Perfect',item:'',text:'',hint:h.text}));
  delete S.hints;S.reviewsSeen=S.reviewsSeen||0;S.memo=S.memo||[];
  /* reviews already received show their customer's hint (and, for a perfect one, review) as this build words it */
  const byKey=Object.fromEntries(X.visits.map(v=>[vk(v),v]));
  S.reviews.forEach(r=>{const v=byKey[r.day+'-'+r.hour+'-'+r.who];if(!v)return;
    if(r.hint&&v.hint&&v.hint.text)r.hint=v.hint.text;if(r.g==='Perfect'&&v.review)r.text=v.review});
}
sanitize();
/* The game saves after everything the player does. The little save icon in the corner (#saveMark) shows only when
   something that matters is kept: a new hour or day, or a sale or an answer rung up. */
/* Saving is guarded: a tab that is out of date (the game was saved from another tab or window since) never saves over
   it, and a save that cannot be written (the browser's storage full) first makes room by dropping the prototype's own
   copies, and if it still fails, says so instead of failing silently. */
let savedAt='',backedDay='',staleTab=false,saveWarned=0;
addEventListener('storage',e=>{if(e.key!==KEY||staleTab)return;staleTab=true;
  if(document.hidden)location.reload();  /* in the background: it just picks up the newer game */
  else toast('This game was saved in another window. This one has stopped saving: reload it to carry on here.',{ms:15000})});
document.addEventListener('visibilitychange',()=>{if(staleTab&&!document.hidden)location.reload()});
function writeSave(){const t=JSON.stringify(S);
  try{localStorage.setItem(KEY,t);return true}catch(e){}
  for(const k of [SAVE_KEY+'-proto-snaps',BACKUP_KEY]){try{localStorage.removeItem(k);localStorage.setItem(KEY,t);return true}catch(e){}}
  return false}
function save(){if(staleTab)return;
  if(!S.gid)S.gid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);  /* which game this is */
  const dk=S.gid+'-'+S.day;if(PROTOTYPE_TOOLS&&dk!==backedDay){backedDay=dk;if(!backups().some(b=>b.why==='day'&&b.gid===S.gid&&b.day===S.day))keepBackup('day')}
  if(!writeSave()&&Date.now()-saveWarned>60000){saveWarned=Date.now();toast('The game could not be saved: this browser’s storage is full.',{ms:10000})}
  const mark=S.day+'-'+S.h+'-'+S.pend.length;if(savedAt&&mark!==savedAt)showSaved();savedAt=mark;
  if(S.day>profile().furthestDay)try{localStorage.setItem(PROFILE_KEY,JSON.stringify({...profile(),furthestDay:S.day}))}catch(e){}}
function profile(){try{return {furthestDay:0,...JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}}catch(e){return {furthestDay:0}}}
function showSaved(){const m=$('#saveMark');if(!m)return;m.classList.remove('on');void m.offsetWidth;m.classList.add('on')}
/* A new game: fresh, and without the tutorial if this player has played past it before (a replay). */
function newState(){if(hasSave())keepBackup('new game');S=fresh();if(profile().furthestDay>TUTORIAL_LAST_DAY)S.tutOff=true;sanitize()}
/* A short notice in the subtitle spot, styled like the scene's mood line: it floats in, stays a moment, then fades.
   The mood line steps aside while it shows, so the two never sit on top of each other. */
/* opts.thought: the witch's own thought, set in italics; opts.ms: how long it stays (2.2s by default). */
function toast(t,opts={}){const el=$('#toast'),note=$('#sceneNote');el.textContent=t;el.classList.toggle('thought',!!opts.thought);el.style.display='block';el.classList.remove('in','out');void el.offsetWidth;el.classList.add('in');
  if(note)note.style.visibility='hidden';
  clearTimeout(toast.t);clearTimeout(toast.h);toast.t=setTimeout(()=>{el.classList.remove('in');el.classList.add('out');toast.h=setTimeout(()=>{el.style.display='none';el.classList.remove('in','out');if(note)note.style.visibility=''},400)},opts.ms||2200)}
/* Keywords not yet collected show a dotted underline; tapping one adds it to the word bank and picks it. Collected ones read as plain text. */
const KWRE=new RegExp('\\b('+[...D.vocab].sort((a,b)=>b.length-a.length).map(w=>w.replace('-','\\-')).join('|')+')\\b','gi');
function kw(text){const s=String(text);let out='',last=0;s.replace(KWRE,(m0,w,i)=>{out+=esc(s.slice(last,i))+(S.bank.includes(w.toLowerCase())?esc(m0):`<button class="kw" data-collect="${esc(w.toLowerCase())}">${esc(m0)}</button>`);  /* already collected: plain text */last=i+m0.length;return m0});return out+esc(s.slice(last))}
/* Words in a speech balloon need no quotation marks around them (some lines are written with them in the data). */
const bare=t=>String(t).trim().replace(/^["“]|["”]$/g,'');
function collect(w){if(!S.bank.includes(w))S.bank.push(w);selWord=w;save()}  /* no subtitle: the word simply appears in the word bank */
function addWords(ws){const n=[];ws.forEach(w=>{if(w&&!S.bank.includes(w)){S.bank.push(w);n.push(w)}});if(n.length)toast('New words: '+n.join(', '));return n}
const today=()=>D.cal[S.day-1];
/* Post: a letter turns up at a set hour, some time before the order it helps with. It arrives as an email on the computer. */
const mailIn=()=>X.mail.map((m,i)=>({...m,i})).filter(m=>m.day<S.day||(m.day===S.day&&HOURS.indexOf(m.hour)<=S.h));
/* A new email drops in with a little animation; the badge on the computer stays until it is opened. */
function showMailFx(m){const fx=$('#mailFx');fx.dataset.at=Date.now();$('#mailFrom').textContent=m.from;fx.hidden=false;fx.classList.remove('go');void fx.offsetWidth;fx.classList.add('go')}
function checkMail(){S.mail=S.mail||{};mailIn().forEach(m=>{if(!(m.i in S.mail)){S.mail[m.i]=false;showMailFx(m)}})}
const prev=()=>S.day>1?D.cal[S.day-2]:null;

/* ---------- conditions ---------- */
function met(c){const T=today(),hr=HOURS[S.h];
  switch(c.t){
    case 'day':return T.weekday===c.v;
    case 'full':return !!T.named;  /* every sixth day is a full moon, and each one has a name */
    case 'time':return hr===c.v;
    case 'starry':return (T.event||'').includes('Clear starry night')&&hr==='Nightfall';
    case 'sabbat':return T.sabbat===c.v;
    case 'named':return T.named===c.v;
    case 'event':return (T.event||'').includes(c.v);
    case 'afterfull':{const p=prev();return !!p&&!!p.named}
    case 'sabset':return c.v.split('|').includes(T.sabbat);
    case 'special':return false;}  /* customer-specific days are never met yet */
  return false}
function condName(c){return ({day:c.v,full:'Full Moon',time:c.v,starry:'Clear starry night',sabbat:c.v,named:c.v,event:c.v,afterfull:'Morning after a Full Moon',sabset:c.v==='Ostara|Mabon'?'Any equinox':'Any equinox or solstice',special:c.v})[c.t]}
function condClue(c,themes){const hr=S.h;
  switch(c.t){
    case 'day':{const p=(D.cond[c.v]||[]).find(x=>themes.includes(x));return[`It feels like it belongs to another day, a day of ${p||'something else'}.`,p?[p]:[]]}
    case 'full':return['It glows faintly, waiting for a full moon.',[]];
    case 'time':{const need=HOURS.indexOf(c.v);return[hr<need?'It feels half-awake. Too early in the day?':'It feels sleepy. Too late in the day?',[]]}
    case 'starry':return['It longs for an open, starry sky.',[]];
    case 'sabbat':return['It hums like a festival song, but not today\u2019s.',[]];
    case 'named':return['It is waiting for one particular full moon.',[]];
    case 'event':return['It seems to be waiting for something rare in the sky.',[]];
    case 'afterfull':return['It wants the first light after a full moon.',[]];
    case 'sabset':return['It hums like a festival song, but not today\u2019s.',[]];
    case 'special':return['It is waiting for a day that belongs to someone.',[]];}
  return['Something about the moment is wrong.',[]]}
