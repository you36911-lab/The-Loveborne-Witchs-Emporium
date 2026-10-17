/* Books: the bookshelf, entries, blanks and the word bank. */
/* ---------- books ---------- */
const BOOKS=['Herbiary','Crystal Almanac','Gentle Bestiary','Tarot Companion','Almanac of Sky & Seasons','Grimoire of Craft','Book of Making','Recipe Book'];
const az=a=>[...a].sort((x,y)=>x.localeCompare(y));
/* Almanac categories (alphabetical); entries keep their natural order where there is one. */
const ALMANAC=[['Festivals',D.sabbats.map(s=>s[0])],['Magic Hours',HOURS],
 ['Moon Phases',['New Moon','Waxing Crescent','Waxing Gibbous','Full Moon','Waning Gibbous','Waning Crescent','Dark Moon']],
 ['Named Moons',['Wolf Moon','Snow Moon','Worm Moon','Pink Moon','Flower Moon','Strawberry Moon','Buck Moon','Sturgeon Moon','Harvest Moon',"Hunter's Moon",'Beaver Moon','Cold Moon']],
 ['Sky Events',az(['Blue Moon','Clear starry night','Lunar Eclipse','Rainbow','Shooting stars'])],
 ['Weather',az(['Clear & sunny','Rain','After Rain','Thunderstorm','Fog / Mist','Windy','Snow'])],
 ['Weekdays',D.days.map(d=>d[0])]];
let curBook='Herbiary',selWord=null;
/* Each book remembers its own search, across closing the shelf and switching books. */
const searchOf=()=>((S.search||(S.search={}))[curBook]||'');
function entryList(book){const L=[];const add=(k,props,note,always,ns='item')=>L.push({k,sk:ns+':'+k,props,note,always});
  const cats={Herbiary:['Base waters','Oils, butters & waxes','Herbs & flowers','Fruits','Spices','Pantry: salts, sugars & baking','Resins & incense'],'Crystal Almanac':['Crystals'],'Gentle Bestiary':['Animal gifts']};
  if(cats[book])D.items.filter(i=>cats[book].includes(i.c)).sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n)).forEach(i=>{add(i.n,i.props,i.base.length?'Base for '+i.base.join(', '):'',false);L[L.length-1].cat=cats[book].length>1?i.c:''});
  if(book==='Tarot Companion')Object.entries(D.tarot).forEach(([k,p])=>add(k,p,'',false,'tarot'));
  if(book==='Almanac of Sky & Seasons')ALMANAC.forEach(([cat,names])=>names.forEach(k=>{
    const sb=D.sabbats.find(x=>x[0]===k),dy=D.days.find(x=>x[0]===k);
    add(k,D.cond[k]||[],sb?sb[1]:dy?`${dy[1]}; colours ${dy[2].toLowerCase()}`:'',!D.condUsed.includes(k),'cond');L[L.length-1].cat=cat}));
  if(book==='Grimoire of Craft'){
    az(Object.keys(D.colours)).forEach(c=>{  /* name only the forms this colour really comes in */
      const forms=['candle',...[['thread',c+' thread'],['ink',(c==='Purple'?'Violet':c)+' ink'],['paint',c+' paint']].filter(([,n])=>ITEM[n]).map(([f])=>f)];
      add(c,D.colours[c],forms.length===1?'Candles only':'Comes as '+forms.join(', ').replace(/, ([^,]*)$/,' and $1'),false,'colour');L[L.length-1].cat='Colours'});
    D.items.filter(i=>['Buttons','Wood & branches','Findings & tools','Threads & ribbons'].includes(i.c)&&!/ thread$/.test(i.n)&&i.props.length&&!(/ ink$| paint$/.test(i.n))).sort((a,b)=>a.n.localeCompare(b.n)).forEach(i=>{add(i.n,i.props,'',false);L[L.length-1].cat='Symbols & Charms'})}
  if(book==='Book of Making')az(Object.keys(D.methods)).forEach(t=>{const m=D.methods[t];
    const bases=az(D.items.filter(i=>i.base.includes(t)).map(i=>i.n));
    L.push({k:t,props:[],method:true,where:m.where,how:m.how,bases})});
  return L}
/* Shown keywords are fixed (D.shown, the same every playthrough); entries with one keyword, or two keywords and only one or two recipes using them, show none. Others show their
   second most-used keyword, so the obvious link stays hidden; week-one puzzle parts show the
   keyword their recipe needs; entries with five or more keywords show two. */
function shownOf(e){if(e.always)return e.props;if(e.method||e.props.length<=1)return[];
  return e.props.filter(p=>(D.shown[e.sk]||[]).includes(p))}
/* Keywords and blanks are laid out in a fixed shuffled order, so the shown one is not always first. */
function dispOrder(e){let x=2166136261;for(const ch of 'order|'+e.sk){x^=ch.charCodeAt(0);x=Math.imul(x,16777619)}
  const a=[...e.props];for(let i=a.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;const j=(x>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function hiddenOf(e){if(e.always||e.method||!e.props.length)return[];if(e.props.length===1)return[e.props[0]];const s=shownOf(e);return e.props.filter(p=>!s.includes(p))}
function entryLocked(e){const h=hiddenOf(e);if(!h.length)return false;const f=(S.fills[e.sk]||[]);return h.every(w=>f.includes(w))&&f.filter(Boolean).length===h.length}
function openBooks(){$('#books').classList.add('open');$('#search').value=searchOf();renderBooks();autoTick()}
/* ---------- books as pages: an index, one entry per page, up to five bookmarks ---------- */
const MARKCOL=['#E2483D','#F59A3B','#5DBB6A','#4C7BD9','#9B5FD0'];
function entryHTML(e){
  if(e.method)return `<div class="entry method"><b>${esc(e.k)}</b><span class="muted">${esc(e.where)}</span><span class="bookline" style="font-style:normal;color:var(--ink)">${esc(e.how)}</span>${e.bases.length?`<span class="bookline">Base: ${e.bases.map(esc).join(', ')}.</span>`:''}</div>`;
  const h=hiddenOf(e),f=S.fills[e.sk]||[];
  const lk=entryLocked(e),sh=shownOf(e),blank=i=>`<button class="blank ${f[i]?'filled':''}" data-entry="${esc(e.sk)}" data-i="${i}" aria-label="${f[i]?'Filled blank: tap to clear':'Blank'}" ${lk?'disabled':''}>${f[i]?esc(f[i]):' '}</button>`;
  const slots=(e.always?e.props:dispOrder(e)).map(p=>sh.includes(p)?kw(p):blank(h.indexOf(p))).join(' · ');
  return `<div class="entry ${lk?'locked':''}"><b>${esc(e.k)}</b>${slots}${e.note?`<span class="muted" style="margin-left:auto;font-size:13px">${esc(e.note)}</span>`:''}${e.sk.startsWith('item:')&&ITEM[e.k]?.line?`<span class="bookline">${esc(ITEM[e.k].line)}</span>`:''}${(()=>{const lk=e.sk.startsWith('item:')?ITEM[e.k]?.look:e.sk.startsWith('tarot:')?CARDLOOK[e.k]:'';return lk?`<span class="look" title="Stands in for the picture">\u{1F5BC} ${esc(lk)}</span>`:''})()}</div>`}
/* Every page of a book, in reading order: key, title, category, status and how to draw it. */
function bookPages(book){
  if(book==='Recipe Book')return Object.values(D.recipes).sort((a,b)=>a.type.localeCompare(b.type)||a.name.localeCompare(b.name)).map(r=>{const n=noteOf(r.id);
    return {key:'recipe:'+r.id,title:r.name,cat:r.type,done:recipeLocked(r.id),started:n.ing.some(Boolean)||!!n.candle||!!n.tarot||n.when.some(Boolean),
      find:[r.name,r.type,r.intent,...r.themes,...n.ing,n.candle,n.tarot,...n.when],html:()=>recipeHTML(r)}});
  return entryList(book).map(e=>({key:e.sk||('method:'+e.k),title:e.k,cat:e.cat||'',done:entryLocked(e),started:(S.fills[e.sk]||[]).some(Boolean),
    find:[e.k,...shownOf(e),...(S.fills[e.sk]||[]).filter(Boolean)],html:()=>entryHTML(e)}))}
const pageOf=()=>((S.page||(S.page={}))[curBook]||'');
/* A word leaves the word bank once every blank in every book that needs it holds it. */
let NEEDS=null;
function needsOf(w){if(!NEEDS){NEEDS={};BOOKS.filter(b=>!['Book of Making','Recipe Book'].includes(b)).forEach(b=>entryList(b).forEach(e=>hiddenOf(e).forEach(p=>(NEEDS[p]=NEEDS[p]||[]).push(e.sk))))}return NEEDS[w]||[]}
const usedUp=w=>needsOf(w).every(sk=>(S.fills[sk]||[]).includes(w));
function renderBooks(){
  $('#booktabs').innerHTML=BOOKS.map(b=>`<button aria-pressed="${b===curBook}" data-book="${esc(b)}">${esc(b)}</button>`).join('');
  const marks=S.marks||(S.marks=[]);
  $('#marks').innerHTML=marks.length?marks.map((m,i)=>`<button class="mark" style="--mc:${m.color}" data-mark="${i}" title="${esc(m.book)}: ${esc(m.title)}">${esc(m.title)}</button>`).join(''):'<span class="muted" style="font-size:13px">No bookmarks yet. Bookmark a page to come back to it.</span>';
  const bank=S.bank.filter(w=>!usedUp(w));if(selWord&&usedUp(selWord))selWord=null;
  $('#bank').innerHTML=(bank.length?bank.slice().sort().map(w=>`<button class="word ${selWord===w?'sel':''}" data-word="${esc(w)}">${esc(w)}</button>`).join(''):(S.bank.length?'<span class="muted">Every word you have collected is used up. Tap dotted words to collect more.</span>':'<span class="muted">No words yet. Tap a dotted word in an email, a result or a book to collect it.</span>'));
  const el=$('#entries'),sb=$('#search');
  const pages=bookPages(curBook),key=pageOf(),at=pages.findIndex(p=>p.key===key);
  if(at<0){ /* the index */
    sb.hidden=false;const q=(sb.value||'').toLowerCase();let lc=null;
    const list=pages.filter(p=>!q||p.find.some(x=>x&&x.toLowerCase().includes(q)));
    const intro=curBook==='Book of Making'?'<p class="muted">How each kind of spell is made, and the base it needs. Paper and ink can go in any spell.</p>':'';
    el.innerHTML=`<h2 class="idx">Index</h2>${intro}`+(list.map(p=>{const m=marks.find(x=>x.book===curBook&&x.key===p.key);
      return (p.cat!==lc?`<h3 class="cat">${esc(lc=p.cat)||'&nbsp;'}</h3>`:'')+`<button class="idxrow" data-go="${esc(p.key)}">${m?`<i class="dot" style="background:${m.color}"></i>`:''}${esc(p.title)}<span class="muted">${p.done?' ✦':p.started?' •':''}</span></button>`}).join('')||'<p class="muted">Nothing matches.</p>');return}
  sb.hidden=true;const p=pages[at],m=marks.find(x=>x.book===curBook&&x.key===p.key);
  el.innerHTML=`<div class="pagenav"><button data-nav="index">← Index</button><button data-nav="prev" ${at>0?'':'disabled'}>‹ Prev</button><span class="muted">${esc(p.cat)} · page ${at+1} of ${pages.length}</span><button data-nav="next" ${at<pages.length-1?'':'disabled'}>Next ›</button>
    <button data-bm="${esc(p.key)}" class="bm" style="${m?`--mc:${m.color}`:''}">${m?'★ Bookmarked':'☆ Bookmark'}</button></div><div class="page">${p.html()}</div>`}
/* Each ingredient slot shows which shelf its ingredient comes from. */
const CATLABEL={'Base waters':'Water','Oils, butters & waxes':'Oil, butter or wax','Herbs & flowers':'Herb or flower','Fruits':'Fruit','Spices':'Spice','Pantry: salts, sugars & baking':'Pantry','Resins & incense':'Resin','Crystals':'Crystal','Animal gifts':'Animal gift','Buttons':'Button','Threads & ribbons':'Thread or ribbon','Wood & branches':'Wood','Findings & tools':'Finding','Inks & paints':'Ink or paint'};
const CONDKIND={day:'Weekday',phase:'Moon Phase',pg:'Moon Phase',dark:'Moon Phase',time:'Magic Hour',weather:'Weather',afterrain:'Weather',starry:'Sky Event',sabbat:'Festival',named:'Named Moon',event:'Sky Event',afterfull:'Special',sabset:'Festival',special:'Special'};
const KINDOPTS={'Weekday':D.days.map(d=>d[0]),'Moon Phase':['New Moon','Waxing Crescent','Waxing Gibbous','Full Moon','Waning Gibbous','Waning Crescent','Waxing Moon','Waning Moon','Dark Moon'],
 'Magic Hour':HOURS,'Weather':['after Rain','Clear & sunny','Fog / Mist','Rain','Snow','Thunderstorm','Windy'],'Sky Event':az(['Blue Moon','Clear starry night','Lunar Eclipse','Rainbow','Shooting stars']),
 'Festival':[...D.sabbats.map(s=>s[0]),'Any equinox','Any equinox or solstice'],'Named Moon':ALMANAC[3][1],
 'Special':['Morning after a Full Moon',"The customer's birthday","The day of the customer's milestone",'A full week, starting on a Monday']};
function noteOf(id){return S.notes[id]||(S.notes[id]={ing:[],candle:'',tarot:'',when:[]})}
function recipeLocked(id){const r=D.recipes[id],n=S.notes[id];if(!n)return false;const same=(a,b)=>[...a].sort().join('|')===[...b].sort().join('|');
  return same(n.ing.filter(Boolean),r.ing)&&n.candle===(r.candle||'')&&n.tarot===(r.tarot||'')&&same(n.when.filter(Boolean),r.conds.map(condName))}
function recipeHTML(r){const n=noteOf(r.id);const lk=recipeLocked(r.id);const N=r.ing.length,M=r.conds.length;
  const chips=(arr,attr)=>arr.map(x=>lk?`<span class="chip on">${esc(x)}</span>`:`<button class="chip" data-${attr}="${r.id}|${esc(x)}">${esc(x)} ×</button>`).join(' ');
  const pick=(attr,label,opts)=>`<select data-${attr}="${r.id}" aria-label="${label}"><option value="">add…</option>${opts.map(o=>`<option>${esc(o)}</option>`).join('')}</select>`;
  const one=(attr,want,val,opts,label)=>!want?'<span class="muted">none needed</span>':lk?esc(val):`<select data-${attr}="${r.id}" aria-label="${label}"><option value="">?</option>${opts.map(c=>`<option ${val===c?'selected':''}>${esc(c)}</option>`).join('')}</select>`;
  return `<div class="recipe ${lk?'locked':''}"><h3 style="margin-top:0">${esc(r.name)}${lk?' ✦':''}</h3><div class="muted">${esc(r.type)}. ${esc(r.intent)}.</div><div><b>Themes:</b> ${r.themes.map(t=>kw(t)).join(', ')}</div>
  <div><b>Ingredients (${n.ing.filter(Boolean).length}/${N}):</b> ${r.ing.map((want,i)=>{const cat=ITEM[want].c,lab=CATLABEL[cat]||cat,v=n.ing[i];
    return v?(lk?`<span class="chip on">${esc(v)}</span>`:`<button class="chip" data-rm-ing="${r.id}|${i}">${esc(v)} \u00D7</button>`)
      :`<select data-add-ing="${r.id}|${i}" aria-label="${esc(lab)}"><option value="">${esc(lab)}\u2026</option>${az(D.items.filter(x=>x.c===cat).map(x=>x.n)).map(o=>`<option>${esc(o)}</option>`).join('')}</select>`}).join(' ')}</div>
  <div class="row"><b>Candle:</b>${one('set-candle',r.candle,n.candle,Object.keys(D.colours),'Candle')}
  <b>Card:</b>${one('set-tarot',r.tarot,n.tarot,Object.keys(D.tarot),'Card')}</div>
  <div><b>When${M?` (${n.when.filter(Boolean).length}/${M})`:''}:</b> ${M?r.conds.map((c,i)=>{const kind=CONDKIND[c.t],v=n.when[i];
    return v?(lk?`<span class="chip on">${esc(v)}</span>`:`<button class="chip" data-rm-when="${r.id}|${i}">${esc(v)} \u00D7</button>`)
      :`<select data-add-when="${r.id}|${i}" aria-label="${kind}"><option value="">${kind}\u2026</option>${KINDOPTS[kind].map(o=>`<option>${esc(o)}</option>`).join('')}</select>`}).join(' '):'<span class="muted">any time</span>'}</div>${r.conds.some(c=>c.t==='named')?'<div class="muted" style="font-size:13px">Needs one particular full moon, chosen by name. A plain Full Moon won\u2019t do.</div>':''}
  <div class="row" style="margin-top:6px"><button data-layout="${r.id}" ${n.ing.some(Boolean)?'':'disabled'}>Lay out on altar</button>${lk?'':`<button class="main" data-booktest="${r.id}" ${n.ing.some(Boolean)?'':'disabled'}>Test craft this</button>`}</div></div>`}
$('#books').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.collect)return;
  /* Recipe Book shortcut: put what the player has written for a recipe onto the altar, optionally test it straight away. */
  if(b.dataset.layout||b.dataset.booktest){const id=b.dataset.layout||b.dataset.booktest,n=noteOf(id);
    S.target=String(id);S.altar=[...new Set(n.ing.filter(Boolean))];S.candle=n.candle||'';S.tarot=n.tarot||'';S.result=null;
    $('#books').classList.remove('open');
    if(b.dataset.booktest)doCraft(true);else{render();toast(`Laid out ${D.recipes[id].name} on the altar.`)}
    return}
  if(b.dataset.go){S.page[curBook]=b.dataset.go;save();renderBooks();$('#entries').scrollTop=0;return}
  if(b.dataset.nav){const pages=bookPages(curBook),at=pages.findIndex(p=>p.key===pageOf());
    S.page[curBook]=b.dataset.nav==='index'?'':(pages[at+(b.dataset.nav==='next'?1:-1)]||pages[at]).key;save();renderBooks();return}
  if(b.dataset.mark!==undefined){const m=S.marks[+b.dataset.mark];curBook=m.book;S.page[curBook]=m.key;$('#search').value=searchOf();save();renderBooks();return}
  if(b.dataset.bm){const k=b.dataset.bm,i=S.marks.findIndex(x=>x.book===curBook&&x.key===k);
    if(i>=0)S.marks.splice(i,1);else if(S.marks.length>=5){toast('You can keep five bookmarks. Remove one first.');return}
    else{const used=S.marks.map(x=>x.color),p=bookPages(curBook).find(x=>x.key===k);S.marks.push({book:curBook,key:k,title:p.title,color:MARKCOL.find(c=>!used.includes(c))})}
    save();renderBooks();return}
  if(b.dataset.book){curBook=b.dataset.book;$('#search').value=searchOf();renderBooks();return}
  if(b.dataset.word){selWord=selWord===b.dataset.word?null:b.dataset.word;renderBooks();return}
  if(b.dataset.entry){const k=b.dataset.entry,i=+b.dataset.i;const f=S.fills[k]||(S.fills[k]=[]);
    if(selWord){const w=selWord;f[i]=w;const e=entryList(curBook).find(x=>x.sk===k);if(e&&entryLocked(e)){toast(`${e.k} is complete \u2726`)}
      if(usedUp(w))setTimeout(()=>toast(`\u201C${w}\u201D is used up: every blank that needs it is filled.`),e&&entryLocked(e)?2300:0)}else if(f[i]){f[i]=undefined}else{toast('Pick a word from the word bank first.')}
    save();renderBooks();return}
  if(b.dataset.rmIng){const[id,i]=b.dataset.rmIng.split('|');noteOf(id).ing[+i]='';save();renderBooks();return}
  if(b.dataset.rmWhen){const[id,i]=b.dataset.rmWhen.split('|');noteOf(id).when[+i]='';save();renderBooks();return}
});
$('#books').addEventListener('change',e=>{const t=e.target;
  if(t.id==='search')return;  /* the search box's change-on-blur would redraw the tabs mid-click */
  if(t.dataset.addIng&&t.value){const[iid,ii]=t.dataset.addIng.split('|');noteOf(iid).ing[+ii]=t.value}
  if(t.dataset.addWhen&&t.value){const[wid,wi]=t.dataset.addWhen.split('|');noteOf(wid).when[+wi]=t.value}
  if(t.dataset.setCandle!==undefined)noteOf(t.dataset.setCandle).candle=t.value;
  if(t.dataset.setTarot!==undefined)noteOf(t.dataset.setTarot).tarot=t.value;
  const id=(t.dataset.addIng||'').split('|')[0]||(t.dataset.addWhen||'').split('|')[0]||t.dataset.setCandle||t.dataset.setTarot;
  if(id&&recipeLocked(id))toast('Recipe solved \u2726')
  save();renderBooks()});
$('#search').addEventListener('input',e=>{(S.search||(S.search={}))[curBook]=e.target.value;save();renderBooks()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#books').classList.remove('open');render()}});
