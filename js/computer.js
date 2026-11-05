/* The computer on the counter: a desktop with two apps and a taskbar, like a real computer.
   Moonpost (email.js) holds the emails; My Shop holds the reviews customers leave each night, and the shop's rating.
   The taskbar shows the date: the day, the weekday, and any festival, full moon or sky event. */
let pcApp='';  /* the open app: 'mail', 'shop', or '' for the desktop */
let reviewDay=0;  /* the day My Shop shows; 0 is every day */
const PC_APPS=[['mail','☾','Moonpost'],['shop','♥','My Shop']];
function openPC(app){$('#pc').classList.add('open');showApp(app||'')}
function closePC(){$('#pc').classList.remove('open');render()}
function showApp(app){pcApp=app;$('#mailWin').hidden=app!=='mail';$('#shopWin').hidden=app!=='shop';
  if(app==='mail')renderLetters();
  if(app==='shop'){S.reviewsSeen=S.reviews.length;save();renderBadge();renderShop()}
  renderPCBar()}
function renderPC(){if(pcApp==='mail')renderLetters();if(pcApp==='shop')renderShop();renderPCBar()}
/* The taskbar and the badges on the desktop icons. */
function renderPCBar(){const T=today(),fest=[T.sabbat,T.named,T.event].filter(Boolean).join(', ');
  $('#pcDate').innerHTML=`<b>Day ${S.day}</b><span>${esc(T.weekday)}</span>${fest?`<span class="tb-fest">✦ ${esc(fest)}</span>`:''}`;
  [['#mailIconBadge',unreadLetters()],['#shopIconBadge',newReviews()]].forEach(([id,n])=>{const b=$(id);b.hidden=!n;b.textContent=n});
  $('#tbApps').innerHTML=PC_APPS.map(([a,icon,name])=>`<button class="tb-app" data-app="${a}" aria-pressed="${pcApp===a}" title="${name}" aria-label="${name}">${icon}</button>`).join('')}

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
/* My Shop: the rating and the days on the left, that day's reviews (or every day's, newest first) on the right. */
function renderShop(){const rt=rating(),days=[...new Set(S.reviews.map(r=>r.day))].sort((a,b)=>b-a);
  if(reviewDay&&!days.includes(reviewDay))reviewDay=0;
  const count=d=>S.reviews.filter(r=>!d||r.day===d).length;
  const shown=days.filter(d=>!reviewDay||d===reviewDay).map(d=>`<h3 class="sh-day">Day ${d} <span class="muted">${esc(D.cal[d-1].weekday)}</span></h3>`+
    S.reviews.filter(r=>r.day===d).reverse().map(reviewHTML).join('')).join('');
  $('#shopApp').innerHTML=`<aside class="sh-side">
      <div class="sh-rating"><div class="sh-big">${rt.toFixed(1)}</div><div class="sh-stars">${stars(Math.round(rt))}</div>
        <small class="muted">${S.hist.length?`Average of the last ${S.hist.length} of up to 20 reviews`:'No reviews yet'}</small></div>
      <nav class="sh-days" aria-label="Days">${[0,...days].map(d=>`<button data-rday="${d}" aria-pressed="${d===reviewDay}">${d?`Day ${d}`:'All days'}<span class="muted">${count(d)}</span></button>`).join('')}</nav>
    </aside>
    <div class="sh-list">${shown||'<p class="muted sh-empty">No reviews yet. Customers leave their reviews when the shop closes for the night.</p>'}</div>`}

$('#pc').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.collect)return;
  if(b.dataset.app){showApp(b.dataset.app);return}
  if(b.dataset.closeapp){showApp('');return}
  if(b.dataset.rday!==undefined){reviewDay=+b.dataset.rday;renderShop();$('#shopApp .sh-list').scrollTop=0}});
/* Escape closes the open app first, then the computer. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||!$('#pc').classList.contains('open'))return;if(pcApp)showApp('');else closePC()});
