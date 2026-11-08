/* The computer on the counter, like a real one: app icons on a wallpaper, windows that open out of their icon (and can be
   moved, maximised, minimised to the taskbar or closed), and a taskbar with the open apps and the date: the day, the
   weekday, and any festival, full moon or sky event. Moonpost (email.js) holds the emails; My Shop holds the reviews
   customers leave each night, and the shop's rating. */
const PC_ICONS={
  /* Moonpost: an envelope sealed with a crescent moon */
  mail:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="15" width="52" height="36" rx="6" fill="#FFF8EE" stroke="#B9A4C6" stroke-width="2"/><path d="M8 19l24 18 24-18" fill="none" stroke="#B9A4C6" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="37" r="10" fill="#E070AE"/><circle cx="30.5" cy="37" r="5.6" fill="#FFEFA8"/><circle cx="33.2" cy="35.2" r="4.8" fill="#E070AE"/></svg>',
  /* My Shop: a little shopfront with a fuchsia and pink striped awning (pink, not cream, so the stripes stand out from the wall) */
  shop:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="11" y="24" width="42" height="30" rx="2" fill="#FFF8EE" stroke="#B9A4C6" stroke-width="2"/><rect x="15" y="34" width="16" height="12" rx="1.5" fill="#D6E8F6" stroke="#B9A4C6" stroke-width="1.5"/><rect x="36" y="35" width="12" height="19" rx="1.5" fill="#F8CCE3"/><path d="M42 40.5c-1-1.6-3.4-1-3.4.8 0 1.5 2 2.7 3.4 3.8 1.4-1.1 3.4-2.3 3.4-3.8 0-1.8-2.4-2.4-3.4-.8z" fill="#FFF8EE"/><rect x="8" y="16" width="8" height="10" fill="#E070AE"/><circle cx="12" cy="26" r="4" fill="#E070AE"/><rect x="16" y="16" width="8" height="10" fill="#F4A7C6"/><circle cx="20" cy="26" r="4" fill="#F4A7C6"/><rect x="24" y="16" width="8" height="10" fill="#E070AE"/><circle cx="28" cy="26" r="4" fill="#E070AE"/><rect x="32" y="16" width="8" height="10" fill="#F4A7C6"/><circle cx="36" cy="26" r="4" fill="#F4A7C6"/><rect x="40" y="16" width="8" height="10" fill="#E070AE"/><circle cx="44" cy="26" r="4" fill="#E070AE"/><rect x="48" y="16" width="8" height="10" fill="#F4A7C6"/><circle cx="52" cy="26" r="4" fill="#F4A7C6"/><rect x="7" y="12" width="50" height="5" rx="2.5" fill="#D9559E"/></svg>'};
const PC_NAMES={mail:'Moonpost',shop:'My Shop'};
let pcOpen=[];  /* the open apps, the bottom window first */
const pcMin=new Set();  /* the ones minimised to the taskbar */
const winOf=app=>$(`#pc [data-win="${app}"]`),iconOf=app=>$(`#desk .dicon[data-app="${app}"]`),tbOf=app=>$(`#tbApps [data-tb="${app}"]`);
const topApp=()=>[...pcOpen].reverse().find(a=>!pcMin.has(a))||'';
document.querySelectorAll('#pc [data-icon]').forEach(el=>el.innerHTML=PC_ICONS[el.dataset.icon]);
/* (the wallpaper path is made absolute: a relative url() in a CSS variable would be read from the css folder) */
function openPC(app){$('#pcScreen').style.setProperty('--wall',`url("${new URL(ASSETS.pcWallpaper,location.href).href}")`);$('#pc').classList.add('open');
  if(app)openApp(app);else renderPCBar()}
function closePC(){$('#pc').classList.remove('open');render()}
function renderPC(){pcOpen.forEach(fillApp);renderPCBar()}
function fillApp(app){if(app==='mail')renderLetters();if(app==='shop'){S.reviewsSeen=S.reviews.length;save();renderBadge();renderShop()}}
/* A window grows out of where it comes from (its desktop icon, or its taskbar button) and shrinks back into it. */
function zoom(win,from,opening,then){
  if(calm()||!from||!win.animate){if(then)then();return}
  const w=win.getBoundingClientRect(),f=from.getBoundingClientRect();
  const k=`translate(${f.left+f.width/2-(w.left+w.width/2)}px,${f.top+f.height/2-(w.top+w.height/2)}px) scale(${Math.max(.04,f.width/w.width)})`;
  const frames=[{transform:k,opacity:0},{transform:'none',opacity:1}];
  const an=win.animate(opening?frames:frames.reverse(),{duration:opening?300:200,easing:opening?'cubic-bezier(.2,.9,.25,1)':'ease-in',fill:opening?'none':'forwards'});
  an.onfinish=()=>{if(then)then();if(!opening)an.cancel()}}
function openApp(app){const win=winOf(app);
  if(pcOpen.includes(app)&&!pcMin.has(app)){fillApp(app);focusApp(app);return}
  const from=pcMin.has(app)?tbOf(app):iconOf(app);
  if(!pcOpen.includes(app))pcOpen.push(app);pcMin.delete(app);
  fillApp(app);win.hidden=false;focusApp(app);zoom(win,from,true)}
function focusApp(app){pcOpen=[...pcOpen.filter(a=>a!==app),app];pcOpen.forEach((a,i)=>winOf(a).style.zIndex=2+i);renderPCBar()}
function minApp(app){const win=winOf(app);pcMin.add(app);renderPCBar();zoom(win,tbOf(app),false,()=>{if(pcMin.has(app))win.hidden=true})}
function closeApp(app){const win=winOf(app);pcOpen=pcOpen.filter(a=>a!==app);pcMin.delete(app);renderPCBar();
  zoom(win,iconOf(app),false,()=>{if(!pcOpen.includes(app)){win.hidden=true;win.classList.remove('max');win.style.left=win.style.top=''}})}
/* A day in My Shop's reviews: "Day 9 · Tuesday · December" over the list (a game year is 72 days, about six to a month, so
   the days have no date of the month); the list of days on the left just says "Day 9". */
const dayLabel=d=>{const c=D.cal[d-1];return c?`Day ${d} · ${c.weekday} · ${c.month}`:`Day ${d}`};
/* The taskbar: the open apps only (pressed: the one in front), and the date in the corner. */
function renderPCBar(){const T=today(),fest=[T.sabbat,T.named,T.event].filter(Boolean).join(', '),top=topApp();
  $('#pcDate').innerHTML=`<b>Day ${S.day}</b><span class="tb-sep" aria-hidden="true">·</span><small>${esc(T.weekday)}${fest?` · <span class="tb-fest">${esc(fest)}</span>`:''}</small>`;
  $('#tbApps').innerHTML=pcOpen.map(a=>`<button class="tb-app" data-tb="${a}" aria-pressed="${a===top}" aria-label="${PC_NAMES[a]}">${PC_ICONS[a]}</button>`).join('');
  [['#mailIconBadge',unreadLetters()],['#shopIconBadge',newReviews()]].forEach(([id,n])=>{const b=$(id);b.hidden=!n;b.textContent=n})}
/* Windows move by their title bar, and a double-click on it maximises them. */
let drag=null;
$('#desk').addEventListener('pointerdown',e=>{const win=e.target.closest('.pcwin');if(!win)return;focusApp(win.dataset.win);
  const bar=e.target.closest('.pcbar');if(!bar||e.target.closest('button')||win.classList.contains('max'))return;
  const r=win.getBoundingClientRect(),d=$('#desk').getBoundingClientRect();
  drag={win,dx:e.clientX-r.left,dy:e.clientY-r.top,d,w:r.width};bar.setPointerCapture(e.pointerId)});
$('#desk').addEventListener('pointermove',e=>{if(!drag)return;const {win,d}=drag;
  win.style.left=Math.min(Math.max(e.clientX-drag.dx-d.left,80-drag.w),d.width-80)+'px';win.style.top=Math.min(Math.max(e.clientY-drag.dy-d.top,0),d.height-40)+'px'});
$('#desk').addEventListener('pointerup',()=>{drag=null});
$('#desk').addEventListener('dblclick',e=>{const bar=e.target.closest('.pcbar');if(bar&&!e.target.closest('button'))bar.parentElement.classList.toggle('max')});

let reviewDay=0;  /* the day My Shop shows; 0 is every day */
/* ---------- reviews ---------- */
/* At closing every receipt becomes a review. A customer who got just what they needed writes their own (review in
   story.js) and adds, as a P.S., what they let slip at the counter (the hint). Everyone else writes a line that fits their stars. */
const REVIEW_LINES={
  Good:['Nearly perfect. Not quite what I needed, but close.','Lovely little shop. It worked, mostly.','Good, just not quite right. I would come back.'],
  Clumsy:['It did something. Not the thing I asked for.','Friendly witch, but the spell went a bit sideways.','Interesting results. Not good ones.'],
  Failed:['That was not what I asked for at all.','It didn’t work. Sorry, but I can’t recommend it.'],
  Missed:['I waited at the counter and went home with nothing.','Came in for help and left empty-handed.']};
const SPOILED={who:'A neighbour',text:'The whole street smelled of burnt herbs again today. Something in that back room keeps going wrong.'};
function pickOf(list,seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;return list[h%list.length]}
function postReviews(list){list.forEach(x=>{const v=x.key&&visitByKey(x.key),best=x.g==='Perfect'&&v,spoiled=x.who==='Spoiled test batches';
  S.reviews.push({day:S.day,hour:x.hour,who:spoiled?SPOILED.who:x.who,g:x.g,item:x.item,
    text:best?v.review:spoiled?SPOILED.text:pickOf(REVIEW_LINES[x.g]||REVIEW_LINES.Good,x.who+S.day),hint:best&&v.hint?v.hint.text:''})})}
const unquote=t=>t.replace(/^["“]|["”]$/g,'');
function reviewHTML(r){const bought=r.item==='No sale'?'Left without buying':r.item;
  return `<article class="rv"><header class="rv-head">${avatarHTML({name:r.who})}<div><b>${esc(r.who)}</b><small class="muted">Day ${r.day}, ${esc(r.hour)}</small></div>
    <span class="rv-stars" aria-label="${SCORE[r.g]} of 5 stars">${stars(SCORE[r.g])}</span></header>
    ${bought?`<p class="rv-item">${esc(bought)}</p>`:''}${r.text?`<p>${kw(r.text)}</p>`:''}${r.hint?`<p class="rv-ps">P.S. ${kw(unquote(r.hint))}</p>`:''}</article>`}
/* My Shop: the shop's name and logo, the rating and the days on the left, that day's reviews (or every day's, newest first) on the right. */
function renderShop(){const rt=rating(),days=[...new Set(S.reviews.map(r=>r.day))].sort((a,b)=>b-a);
  if(reviewDay&&!days.includes(reviewDay))reviewDay=0;
  const count=d=>S.reviews.filter(r=>!d||r.day===d).length;
  const shown=days.filter(d=>!reviewDay||d===reviewDay).map(d=>`<h3 class="sh-day">${esc(dayLabel(d))}</h3>`+
    S.reviews.filter(r=>r.day===d).reverse().map(reviewHTML).join('')).join('');
  $('#shopApp').innerHTML=`<aside class="sh-side">
      <div class="sh-brand"><img src="${ASSETS.logo}" alt=""><b>The Loveborne Witch’s Emporium</b></div>
      <div class="sh-rating"><div class="sh-big">${rt.toFixed(1)}</div><div class="sh-stars">${stars(Math.round(rt))}</div>
        <small class="muted">${S.hist.length?`Average of the last ${S.hist.length} of up to 20 reviews`:'No reviews yet'}</small></div>
      <nav class="sh-days" aria-label="Days">${[0,...days].map(d=>`<button data-rday="${d}" aria-pressed="${d===reviewDay}">${d?`Day ${d}`:'All days'}<span class="muted">${count(d)}</span></button>`).join('')}</nav>
    </aside>
    <div class="sh-list">${shown||'<p class="muted sh-empty">No reviews yet. Customers leave their reviews when the shop closes for the night.</p>'}</div>`}

$('#pc').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.collect)return;const d=b.dataset;
  if(d.app)openApp(d.app);
  else if(d.tb){if(d.tb===topApp())minApp(d.tb);else openApp(d.tb)}
  else if(d.winmin)minApp(d.winmin);
  else if(d.winmax)winOf(d.winmax).classList.toggle('max');
  else if(d.winclose)closeApp(d.winclose);
  else if(d.desktop)pcOpen.filter(a=>!pcMin.has(a)).forEach(minApp);
  else if(d.rday!==undefined){reviewDay=+d.rday;renderShop();$('#shopApp .sh-list').scrollTop=0}});
/* Escape closes the window in front, then the computer. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||!$('#pc').classList.contains('open'))return;const a=topApp();if(a)closeApp(a);else closePC()});
