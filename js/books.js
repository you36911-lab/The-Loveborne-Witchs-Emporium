/* Books: the bookshelf, entries, blanks and the word bank. */
/* ---------- books ---------- */
const BOOKS=['Herbiary','Crystal Almanac','Gentle Bestiary','Tarot Companion','Almanac of Sky & Seasons','Grimoire of Craft','Book of Making','Recipe Book'];
const az=a=>[...a].sort((x,y)=>x.localeCompare(y));
/* Almanac categories (alphabetical); entries keep their natural order where there is one. */
const ALMANAC=[['Festivals',D.sabbats.map(s=>s[0])],['Magic Hours',HOURS],
 ['Full Moons',['Full Moon','Wolf Moon','Snow Moon','Worm Moon','Pink Moon','Flower Moon','Strawberry Moon','Buck Moon','Sturgeon Moon','Harvest Moon',"Hunter's Moon",'Beaver Moon','Cold Moon']],
 ['Sky Events',az(['Blue Moon','Clear starry night','Lunar Eclipse','Rainbow','Shooting stars'])],
 ['Weekdays',D.days.map(d=>d[0])]];
let curBook='Herbiary',shelfBook='Herbiary',selWord=null;
/* The notebook on the counter (my notes) opens in the same book view: no cover, no tabs, search or word bank,
   just its ruled pages, where the player writes, turned like any other book. */
const DIARY='My notes';
const searchOf=()=>'';  /* the search box is gone; the index always lists everything */
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
/* ---------- books as pages: an index, one entry per page, up to MAX_MARKS bookmarks ---------- */
const MARKCOL=['#E2483D','#F59A3B','#5DBB6A','#4C7BD9','#9B5FD0'];
const MAX_MARKS=30;  /* the bookmarks column scrolls */
/* An ingredient's entry just completed: its page, on paper like the book's, with its picture (as the book prints it) or,
   without one, what it looks like; everything it is for, and its line. A click anywhere closes it. */
function showEntryDone(e){const it=ITEM[e.k],pic=ASSETS.items[e.k];
  $('#ingNoteBody').innerHTML=`<p class="in-cat">${esc(CATLABEL[it.c]||it.c)}</p><h3>${esc(e.k)}</h3>`+
    `<p class="in-kw">${dispOrder(e).map(esc).join(' · ')}</p>`+
    (pic?`<img class="in-pic" src="${pic}" alt="">`:it.look?`<p class="in-look">${esc(it.look)}</p>`:'')+
    (it.line?`<p class="in-line">${esc(it.line)}</p>`:'')+`<p class="in-done">✦ Complete</p>`;
  $('#ingNote').classList.add('open')}
/* A recipe just solved (every blank written, from the book or by a perfect test craft): its page comes up the same way,
   with the spell's picture as the Recipe Book prints it (only its outline until it has been made just right), what it is
   for, and everything that goes into it. */
function showRecipeDone(id){const r=D.recipes[id],seen=(S.spellArt||{})[id],pic=seen?ASSETS.spells[id]:ASSETS.spellOutlines[id];
  const row=(k,v)=>`<p class="in-row"><b>${k}</b> ${esc(v)}</p>`;
  $('#ingNoteBody').innerHTML=`<p class="in-cat">${esc(r.type)}</p><h3>${esc(r.name)}</h3><p class="in-intent">${esc(r.intent)}.</p>`+
    `<p class="in-kw">${r.themes.map(esc).join(' · ')}</p>`+
    (pic?`<img class="in-pic${seen?'':' outline'}" src="${pic}" alt="">`:'')+
    `<div class="in-rows">${row('Ingredients',r.ing.join(', '))}${r.candle?row('Candle',r.candle):''}${r.tarot?row('Card',r.tarot):''}${r.conds.length?row('When',r.conds.map(condName).join(', ')):''}</div>`+
    `<p class="in-done">✦ Recipe solved</p>`;
  $('#ingNote').classList.add('open')}
$('#ingNote').addEventListener('click',()=>$('#ingNote').classList.remove('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#ingNote').classList.contains('open')){$('#ingNote').classList.remove('open');e.stopImmediatePropagation()}},true);
function entryHTML(e){
  if(e.method)return `<div class="entry method"><b>${esc(e.k)}</b><span class="muted">${esc(e.where)}</span><span class="bookline" style="font-style:normal;color:var(--ink)">${esc(e.how)}</span>${e.bases.length?`<span class="bookline">Base: ${e.bases.map(esc).join(', ')}.</span>`:''}</div>`;
  const h=hiddenOf(e),f=S.fills[e.sk]||[];
  /* a finished entry reads like the rest of the book: its words as plain print, no blanks left */
  /* an open blank unfolds a short list under it, like the Recipe Book's: the words in the word bank (and, if it holds one,
     a way to rub it out) */
  const lk=entryLocked(e),sh=shownOf(e),blank=i=>{if(lk)return `<span class="blank done">${esc(f[i])}</span>`;
    const key=`kw|${e.sk}|${i}`,open=pickOpen===key;
    return `<span class="kwpick"><button class="blank ${f[i]?'filled':''} ${open?'open':''}" data-entry="${esc(e.sk)}" data-i="${i}" aria-label="${f[i]?'Filled blank: choose another word':'Blank: choose a word'}" aria-expanded="${open}">${f[i]?esc(f[i]):' '}</button>${open?wordIndex(key,f[i]):''}</span>`};
  const slots=(e.always?e.props:dispOrder(e)).map(p=>sh.includes(p)?kw(p):blank(h.indexOf(p))).join(' · ');
  return `<div class="entry ${lk?'locked':''}"><b>${esc(e.k)}</b>${slots}${e.note?`<span class="muted" style="margin-left:auto;font-size:13px">${esc(e.note)}</span>`:''}${e.sk.startsWith('item:')&&ITEM[e.k]?.line?`<span class="bookline">${esc(ITEM[e.k].line)}</span>`:''}${(()=>{/* the picture where there is one; otherwise a short description stands in for it */
    const pic=e.sk.startsWith('item:')?ASSETS.items[e.k]:e.sk.startsWith('tarot:')?ASSETS.tarot[e.k]:'';
    if(e.k===BIRTHSTONE)return `<span class="bookline months">${Object.entries(BIRTHSTONES).map(([m,s])=>`<span>${m}</span><b>${esc(s)}</b>`).join('')}</span>`;
    if(pic)return `<img class="entrypic ${e.sk.startsWith('tarot:')?'card':''}" src="${pic}" alt="">`;
    const lk=e.sk.startsWith('item:')?ITEM[e.k]?.look:e.sk.startsWith('tarot:')?CARDLOOK[e.k]:'';return lk?`<span class="look">\u{1F5BC} ${esc(lk)}</span>`:''})()}</div>`}
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
/* ---------- the book on screen: the cover swings open onto a spread, two pages at a time, and pages turn ---------- */
const INDEX_LINES=20;            /* index lines on one page (rows are roomy; 20 fills the shortest pages, the Recipe Book's, without overflow); a heading takes three */
const OPEN_MS=1100,TURN_MS=850;  /* the cover opening (match style.css) and a page turning, in ms */
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let turning=false,openTimer=0;
/* Every page of the book in order: the index (split over as many pages as it needs, filtered by the search), then one entry per page. */
function allPages(book){if(book===DIARY)return diaryPages();
  const entries=bookPages(book),q=searchOf().toLowerCase(),marks=S.marks||[];
  const list=entries.filter(p=>!q||p.find.some(x=>x&&x.toLowerCase().includes(q)));
  const intro=book==='Book of Making'?'<p class="muted">How each kind of spell is made, and the base it needs. Paper and ink can go in any spell.</p>':'';
  const chunks=[];let cur=[],lines=intro?7:4,lc=null;  /* the first page starts under the title */
  list.forEach(p=>{if(lines+(p.cat&&p.cat!==lc?3:1)>INDEX_LINES&&cur.length){chunks.push(cur);cur=[];lines=0;lc=null}
    const head=!!p.cat&&p.cat!==lc;lines+=head?3:1;lc=p.cat;cur.push({p,head})});
  chunks.push(cur);
  const idx=chunks.map((rows,i)=>({key:'index:'+i,index:true,html:()=>
    (i===0?`<h2 class="idx">${esc(book)}</h2><p class="muted idxsub">Index${q?` · matching “${esc(searchOf())}”`:''}</p>${intro}`:'')+
    (rows.length?rows.map(({p,head})=>{const m=marks.find(x=>x.book===book&&x.key===p.key);
      return (head?`<h3 class="cat">${esc(p.cat)}</h3>`:'')+`<button class="idxrow" data-go="${esc(p.key)}"><span class="t">${esc(p.title)}</span>${m?`<i class="dot" style="background:var(--kw)"></i>`:''}<span class="muted">${p.done?' ✦':p.started?' •':''}</span></button>`}).join(''):'<p class="muted">Nothing matches.</p>')}));
  /* the Recipe Book gives each recipe a spread: the recipe on the left page, the spell's illustration on the right (a
     blank page after the index, if needed, so every recipe starts on a left page) */
  if(book==='Recipe Book'){const pad=idx.length%2?[{key:'index:pad',index:true,html:()=>''}]:[];
    return [...idx,...pad,...entries.flatMap(e=>[e,{key:'art:'+e.key.slice(7),plain:true,html:()=>spellArtHTML(e.key.slice(7))}])]}
  return [...idx,...entries]}
/* A spell's illustration: only its outline until the spell has been made perfectly (a perfect test craft counts), then the
   picture itself. No caption. */
function spellArtHTML(id){const r=D.recipes[id],seen=(S.spellArt||{})[id],pic=ASSETS.spells[id];
  /* locked: only the picture's outline, drawn on the page, with a question mark (an empty dashed frame until the picture exists) */
  if(!seen){const ol=ASSETS.spellOutlines[id];return `<div class="artpage locked"><div class="artframe${ol?' outlined':''}">${ol?`<img src="${ol}" alt="">`:''}<span class="artq">?</span></div></div>`}
  return `<div class="artpage"><div class="artframe${pic?' shown':''}">${pic?`<img src="${pic}" alt="${esc(r.name)}">`:'<span class="artsoon">✦</span>'}</div></div>`}
/* The notebook's pages: the player writes on them (S.memo, one text per page). Each page is a box that sits on the ruled
   lines; the first page has the title on its top line. There is always a blank spread after the last page written on. */
const memoWritten=()=>{const m=S.memo;let n=m.length;while(n&&!m[n-1])n--;return n};
/* The first page is Hester's: her notes are taped onto it, whole, just as she gave them, to read again. The player's
   own pages follow it. */
function diaryPages(){const n=memoWritten(),count=1+Math.max(1,n+1);
  const pages=[{key:'diary:0',plain:true,html:hesterPageHTML},
    ...Array.from({length:count-1},(_,m)=>({key:'diary:'+(m+1),plain:true,html:()=>`<textarea class="memo" data-memo="${m}" aria-label="My notes, page ${m+1}" spellcheck="false">${esc(S.memo[m]||'')}</textarea>`}))];
  if(pages.length%2)pages.push({key:'diary:'+pages.length,plain:true,html:()=>`<textarea class="memo" data-memo="${count-1}" aria-label="My notes, page ${count}" spellcheck="false">${esc(S.memo[count-1]||'')}</textarea>`});
  return pages}
function hesterPageHTML(){const notes=Object.keys(HESTER_NOTES).filter(k=>(S.guideNotes||{})[k]);
  return `<p class="dtitle">My notes</p>`+(notes.length?notes.map(k=>`<div class="hslip" role="note" aria-label="Hester’s note: ${esc(HESTER_NOTES[k].title)}"><i class="tape"></i><div class="hpaper">${noteHTML(k)}</div></div>`).join(''):'')}
/* Writing: a page holds only what fits on its lines; past that, the last letters are taken off again. */
$('#books').addEventListener('input',e=>{const t=e.target;if(t.dataset.memo===undefined)return;
  if(t.scrollHeight>t.clientHeight+1){while(t.value&&t.scrollHeight>t.clientHeight+1)t.value=t.value.slice(0,-1);toast('This page is full. I\u2019ll write on the next one.')}
  S.memo[+t.dataset.memo]=t.value;save();
  const s=pageAt(diaryPages())>>1;$('#turnNext').disabled=$('#turnLast').disabled=2*s+2>=diaryPages().length})
/* The page the reader is on (S.page keeps its key per book), and the spread that holds it. */
function pageAt(pages){const i=pages.findIndex(p=>p.key===pageOf());return i<0?0:i}
function pageHTML(pages,i){const p=pages[i];if(!p)return '';
  const m=!p.index&&(S.marks||[]).find(x=>x.book===curBook&&x.key===p.key);
  return (p.index||p.plain?'':`<button class="ribbon ${m?'on':''}" data-bm="${esc(p.key)}" aria-label="${m?'Remove the bookmark':'Bookmark this page'}"></button>${p.cat?`<div class="pcat">${esc(p.cat)}</div>`:''}`)+
    `<div class="pbody">${p.html()}</div><div class="pnum">${i+1}</div>`}
/* Dress the book: the spread, the paper, and the cover (a picture, or a plain cover with the title). */
function setArt(){const a=ASSETS.books[curBook],tome=$('#tome'),img=$('#spreadImg');
  /* no open picture yet: the spread is drawn in CSS from the book's colour and paper */
  if(a.open){tome.removeAttribute('data-drawn');img.onload=()=>tome.style.setProperty('--ar',img.naturalWidth/img.naturalHeight);img.src=a.open}
  else{tome.dataset.drawn='';img.onload=null;img.removeAttribute('src');tome.style.setProperty('--ar',1.42);tome.style.setProperty('--book-bg',a.color)}
  [['--pt',0],['--po',1],['--pb',2]].forEach(([v,i])=>tome.style.setProperty(v,a.page[i]+'%'));tome.style.setProperty('--paper-c',a.paper);
  /* the page flags follow this book's edges (flags in config.js); without measurements, a guess from the margin */
  const fl=a.flags||[[0,a.page[1]/2,a.page[1]],[0,a.page[1]/2,a.page[1]]];['l','r'].forEach((s,k)=>['c','s','p'].forEach((v,i)=>tome.style.setProperty(`--f${s}${v}`,fl[k][i]+'%')));
  const [front,back,side]=$('#cover').children;
  /* the cover's edge, seen as it swings: the fur's colour, or the cover picture squeezed into a strip */
  /* a fur cover shows no edge as it swings: any solid strip there sticks out past the fur tips */
  side.style.display=a.core?'none':'';side.style.background=a.core?'':(a.cover?`url("${a.cover}") center/600% 100%`:a.color||'#5A3A28');back.style.backgroundImage=a.open?`url("${a.open}")`:'';back.classList.toggle('drawn',!a.open);
  if(a.cover){front.style.background=a.core?`url("${a.cover}") center/100% 100% no-repeat,linear-gradient(${a.core},${a.core}) center/90% 93% no-repeat`:'';
    if(!a.core)front.style.backgroundImage=`url("${a.cover}")`;front.innerHTML='';front.className='face front'}
  else{front.style.backgroundImage='';front.style.background=a.color;front.style.color=a.ink;front.className='face front plain';front.innerHTML=`<span>${esc(curBook)}</span>`}
  $('#cover').setAttribute('aria-label','Open the '+curBook)}
/* Show a book closed, then let the cover swing open by itself (or at a click). */
function showBook(b){curBook=b;if(b!==DIARY)shelfBook=b;setArt();clearTimeout(openTimer);
  const tome=$('#tome'),diary=b===DIARY;$('#books').classList.toggle('diary',diary);
  /* the diary has no cover to open: it is already open */
  if(diary){tome.className='tome open opened diary';renderBooks();return}
  /* a new book starts closed at once (the last one's cover does not swing back first) */
  /* the cover waits, all but invisible, until its picture is decoded and drawn, then fades in: otherwise it shows a rough
     version for a frame or two first (it is drawn in 3D, for the swing) */
  const cover=$('#cover');tome.style.transition=cover.style.transition='none';tome.className='tome closed waiting';void tome.offsetWidth;tome.style.transition=cover.style.transition='';
  renderBooks();
  /* the cover only swings once its pictures are decoded, so the swing is never skipped while a big picture loads */
  const t0=Date.now();decodeBook(b).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{tome.classList.remove('waiting');if(curBook!==b||!tome.classList.contains('closed'))return;
    openTimer=setTimeout(openTome,Math.max(0,(calm()?0:650)-(Date.now()-t0)))})))}
const decoded={},DECODED_IMGS=[];  /* the decoded pictures are kept, so the browser keeps them ready */
function decodeBook(b){const a=ASSETS.books[b]||{};return decoded[b]||(decoded[b]=Promise.all([a.cover,a.open].filter(Boolean).map(src=>{const im=new Image();im.src=src;DECODED_IMGS.push(im);return im.decode().catch(()=>{})})))}
/* every book's cover and spread are decoded in the background soon after the game starts, one book at a time */
setTimeout(()=>BOOKS.reduce((p,bk)=>p.then(()=>decodeBook(bk)),Promise.resolve()),2500);
function openTome(){const tome=$('#tome');if(!tome.classList.contains('closed'))return;clearTimeout(openTimer);
  if(calm()){tome.className='tome open opened';return}
  tome.className='tome open';setTimeout(()=>{if(tome.classList.contains('open'))tome.classList.add('opened')},OPEN_MS)}
function openBooks(){if(curBook===DIARY)curBook=shelfBook;$('#books').classList.add('open');showBook(curBook);autoTick();
  setTimeout(()=>BOOKS.forEach(decodeBook),1500)}  /* the other books get ready in the background, for quick switching */
/* The notebook opens on the last page written on. */
function openDiary(){$('#books').classList.add('open');showBook(DIARY);(S.page||(S.page={}))[DIARY]='diary:'+memoWritten();renderBooks();autoTick()}  /* the last page written on (page 0 is Hester's) */
/* Turn to page i: one sheet of paper turns over, whichever way and however far. The sheet is cut into thin strips, each
   hinged to the one before, so it bends as it turns: the free edge lags behind and the paper curves, then lies flat again. */
const STRIPS=12,BEND=9;  /* how many strips, and how far each bends from the last at mid-turn, in degrees */
function leafHTML(fwd,frontHTML,backHTML){
  /* front: the page being lifted; back: the page that lands on the other side. Each strip shows its own slice of both. */
  const fs=fwd?'right':'left',bs=fwd?'left':'right';let h='';
  for(let k=STRIPS-1;k>=0;k--){
    const fo=fwd?k:STRIPS-1-k,bo=fwd?STRIPS-1-k:k;
    /* --mx places the page-shape mask and edge line on this slice. A face is 1px wider than its strip (inset:0 -.5px, so no seams),
       so the copy is laid out at exactly the page's width, or its lines would wrap differently and jump when the turn ends. */
    const fm=`style="--mx:${fo/(STRIPS-1)*100}%"`,bm=`style="--mx:${bo/(STRIPS-1)*100}%"`,cp=o=>`left:calc(${-o} * (100% - 1px) + .5px);width:calc(${STRIPS} * (100% - 1px))`;
    h=`<div class="strip${k?'':' root'}"><div class="sface front p${fs[0]}" ${fm}><div class="pcopy ${fs}" style="${cp(fo)}">${frontHTML}</div><i class="shade"></i></div>`+
      `<div class="sface back p${bs[0]}" ${bm}><div class="pcopy ${bs}" style="${cp(bo)}">${backHTML}</div><i class="shade"></i></div>${h}</div>`}
  return h}
function turnTo(i){if(turning)return;const pages=allPages(curBook),from=pageAt(pages)>>1;i=Math.max(0,Math.min(i,pages.length-1));
  S.page[curBook]=pages[i].key;save();const to=i>>1;
  if(to===from||calm()||!$('#tome').classList.contains('opened')){renderBooks();return}
  const leaf=$('#leaf'),fwd=to>from,dir=fwd?-1:1;
  leaf.className='leaf '+(fwd?'fwd':'bwd');
  leaf.innerHTML=leafHTML(fwd,pageHTML(pages,fwd?2*from+1:2*from),pageHTML(pages,fwd?2*to:2*to+1));
  if(fwd)$('#pgR').innerHTML=pageHTML(pages,2*to+1);else $('#pgL').innerHTML=pageHTML(pages,2*to);
  const strips=[...leaf.querySelectorAll('.strip')],shades=strips.map(s=>[...s.children].filter(c=>c.classList.contains('sface')).map(f=>f.lastElementChild));
  leaf.hidden=false;turning=true;
  const t0=performance.now(),ease=t=>t<.5?2*t*t:1-2*(1-t)*(1-t);
  const frame=now=>{const t=Math.min(1,(now-t0)/TURN_MS),e=ease(t),A=180*e,b=BEND*Math.sin(Math.PI*e)*(1-.35*e);
    let total=0,prev=null;
    strips.forEach((s,k)=>{const a=k?-b:A;total+=a;s.style.transform=`rotateY(${dir*a}deg)`;
      /* paper turned away from the light darkens; each strip shades smoothly from its neighbour's tone to its own, so the curve reads as one sheet */
      const dark=Math.abs(Math.sin(total*Math.PI/180)),from=prev===null?dark:prev;prev=dark;
      const g=(side,m)=>`linear-gradient(to ${side},rgba(58,37,48,${(from*m).toFixed(3)}),rgba(58,37,48,${(dark*m).toFixed(3)}))`;
      shades[k][0].style.background=g(fwd?'right':'left',.4);shades[k][1].style.background=g(fwd?'left':'right',.3)});
    if(t<1)requestAnimationFrame(frame);else done()};
  let ended=false;const done=()=>{if(ended)return;ended=true;leaf.hidden=true;leaf.innerHTML='';leaf.className='leaf';turning=false;renderBooks()};
  requestAnimationFrame(frame);setTimeout(done,TURN_MS+400)}  /* finishes even if the window stops drawing frames */
function turnBy(d){const pages=allPages(curBook),s=pageAt(pages)>>1;turnTo(2*(s+d))}
function renderBooks(){
  const marks=S.marks||(S.marks=[]);
  $('#marks').innerHTML=marks.length?marks.map((m,i)=>`<button class="mark" data-mark="${i}">${esc(m.title)}</button>`).join(''):'<span class="muted" style="font-size:13px">No bookmarks yet. Tap the ribbon at the top of a page to keep your place.</span>';
  const bank=S.bank.filter(w=>!usedUp(w));if(selWord&&usedUp(selWord))selWord=null;
  /* only the words themselves; how the word bank works will be taught by the tutorial (to come) */
  $('#bank').innerHTML=(bank.length?bank.slice().sort().map(w=>`<button class="word ${selWord===w?'sel':''}" data-word="${esc(w)}">${esc(w)}</button>`).join(''):'');
  const pages=allPages(curBook),s=pageAt(pages)>>1;
  $('#pgL').innerHTML=pageHTML(pages,2*s);$('#pgR').innerHTML=pageHTML(pages,2*s+1);
  $('#turnPrev').disabled=$('#turnFirst').disabled=s===0;$('#turnNext').disabled=$('#turnLast').disabled=2*s+2>=pages.length}
/* Each ingredient slot shows which shelf its ingredient comes from. */
const CATLABEL={'Base waters':'Water','Oils, butters & waxes':'Oil, butter or wax','Herbs & flowers':'Herb or flower','Fruits':'Fruit','Spices':'Spice','Pantry: salts, sugars & baking':'Pantry','Resins & incense':'Resin','Crystals':'Crystal','Animal gifts':'Animal gift','Buttons':'Button','Threads & ribbons':'Thread or ribbon','Wood & branches':'Wood','Findings & tools':'Finding','Inks & paints':'Ink or paint'};
const CONDKIND={day:'Weekday',full:'Moon',time:'Magic Hour',starry:'Sky Event',sabbat:'Festival',named:'Moon',event:'Sky Event',afterfull:'Special',sabset:'Festival',special:'Special'};
const KINDOPTS={'Weekday':D.days.map(d=>d[0]),
 'Magic Hour':HOURS,'Sky Event':az(['Blue Moon','Clear starry night','Lunar Eclipse','Rainbow','Shooting stars']),
 'Festival':[...D.sabbats.map(s=>s[0]),'Any equinox','Any equinox or solstice'],'Moon':ALMANAC[2][1],
 'Special':['Morning after a Full Moon',"The customer's birthday","The day of the customer's milestone",'A full week, starting on a Monday']};
/* A blank in a recipe is a ruled line in the book: tapping it unfolds a short index, in text, of what could go there
   (names only: the keywords are for the player to look up in the books). */
let pickOpen='';
function wblank(key,label){return `<button class="wblank ${pickOpen===key?'open':''}" data-pick="${key}" aria-label="${esc(label)}: choose" aria-expanded="${pickOpen===key}"><span>${esc(label)}</span><i></i></button>`}
function windex(key,opts){return `<div class="windex" role="listbox">${opts.map(o=>`<button data-choose="${key}" data-val="${esc(o)}" role="option"><span>${esc(o)}</span></button>`).join('')}</div>`}
/* The open index sits right under the blank that was tapped (above it, if the page has no room below). */
function placeIndex(){const bl=$('#books .wblank.open'),w=$('#books .windex');if(!bl||!w)return;const g=w.parentElement.getBoundingClientRect(),r=bl.getBoundingClientRect(),
  pg=bl.closest('.pg,.leaf')?.getBoundingClientRect()||g,ww=w.offsetWidth,wh=w.offsetHeight;
  w.style.left=Math.max(0,Math.min(r.left-g.left,g.width-ww))+'px';
  const below=r.bottom+4+wh<=pg.bottom-8;w.style.top=(below?r.bottom-g.top+4:r.top-g.top-wh-4)+'px'}
/* short words that never end a line in a recipe title (see recipeHTML) */
const SMALL_WORDS=new Set(['a','an','the','of','to','in','on','at','for','and','by','with','from','your','my']);
function noteOf(id){return S.notes[id]||(S.notes[id]={ing:[],candle:'',tarot:'',when:[]})}
function recipeLocked(id){const r=D.recipes[id],n=S.notes[id];if(!n)return false;const same=(a,b)=>[...a].sort().join('|')===[...b].sort().join('|');
  return same(n.ing.filter(Boolean),r.ing)&&n.candle===(r.candle||'')&&n.tarot===(r.tarot||'')&&same(n.when.filter(Boolean),r.conds.map(condName))}
function recipeHTML(r){const n=noteOf(r.id);const lk=recipeLocked(r.id);const N=r.ing.length,M=r.conds.length;
  /* a written-in value: in handwriting, tap to rub it out (once the recipe is solved it stays) */
  const written=(v,rm)=>lk?`<span class="chip hand on">${esc(v)}</span>`:`<button class="chip hand" ${rm}>${esc(v)} \u00D7</button>`;
  /* the open index, if it belongs to this row: [key, options, keyword namespace] */
  const open=pickOpen.split('|'),openFor=row=>open[0]===row&&open[1]===String(r.id);
  let ingList='',ccList='',whenList='';
  if(openFor('ing')){const cat=ITEM[r.ing[+open[2]]].c;ingList=windex(pickOpen,az(D.items.filter(x=>x.c===cat).map(x=>x.n)),'item:')}
  if(openFor('candle'))ccList=windex(pickOpen,az(Object.keys(D.colours)),'colour:');
  if(openFor('tarot'))ccList=windex(pickOpen,Object.keys(D.tarot),'tarot:');
  if(openFor('when'))whenList=windex(pickOpen,KINDOPTS[CONDKIND[r.conds[+open[2]].t]],'cond:');
  /* a slot: what is written there, or a ruled blank naming what kind of thing goes there */
  /* tapping the title chooses this recipe as what is being made: a handwritten tick appears beside it. The page's two
     actions are small one-colour icons on the title line (the tutorial says what they do): the altar bell lays out what is
     written here on the altar, the bottle test crafts it */
  const mk=String(S.target)===String(r.id);
  /* line breaks in a title: a short word (the, a, of, to…) never ends a line, it stays with the word after it (so "Another
     Orbit Around the Sun" breaks before "the Sun"); the last group and the tick (or the solved star) stay together too */
  const groups=r.name.split(' ').reduce((g,w,i,A)=>{const prev=A[i-1];if(i&&SMALL_WORDS.has(prev.toLowerCase()))g[g.length-1]+=' '+w;else g.push(w);return g},[]),last=groups.pop(),after=(lk?' ✦':'')+(mk?'<svg class="tick" viewBox="0 0 36 32" role="img" aria-label="chosen"><path d="M2.93 16.08L3.43 16.55L4.00 16.98L4.51 17.61L5.10 18.24L5.72 18.96L6.32 19.81L7.01 20.68L7.71 21.66L8.41 22.75L9.24 23.84L10.00 25.10L12.04 27.05L13.84 24.85L14.35 23.64L14.83 22.41L15.38 21.21L16.02 20.06L16.60 18.86L17.35 17.76L18.06 16.62L18.84 15.51L19.72 14.48L20.59 13.41L21.54 12.38L22.56 11.41L23.56 10.38L24.69 9.48L25.81 8.53L26.99 7.62L28.27 6.80L29.54 5.94L30.88 5.13L32.29 4.39L33.69 3.57L33.51 3.23L32.03 3.91L30.64 4.72L29.28 5.50L27.93 6.29L26.68 7.16L25.41 7.99L24.18 8.84L23.05 9.79L21.87 10.65L20.81 11.63L19.76 12.59L18.72 13.57L17.78 14.62L16.82 15.65L15.89 16.71L15.08 17.85L14.20 18.94L13.46 20.13L12.71 21.32L11.99 22.53L11.38 23.81L12.16 24.15L12.45 23.45L11.52 22.25L10.70 21.05L9.80 20.03L8.95 19.07L8.13 18.19L7.27 17.47L6.48 16.78L5.71 16.19L4.89 15.77L4.19 15.34L3.47 15.12Z"/></svg>':'');
  const nb=s=>esc(s).replace(/ /g,' ');
  const titleHTML=(groups.length?groups.map(nb).join(' ')+' ':'')+`<span class="tickword${mk?' on':''}">${nb(last)}${after}</span>`;
  const acts=`<span class="bookicons"><button class="bookico" data-layout="${r.id}" aria-label="Lay out on the altar" ${n.ing.some(Boolean)?'':'disabled'}><img src="${ASSETS.iconBell}" alt=""></button>${lk?'':`<button class="bookico" data-booktest="${r.id}" aria-label="Test craft this" ${n.ing.some(Boolean)?'':'disabled'}><img src="${ASSETS.iconBottle}" alt=""></button>`}</span>`;
  const slot=(lab,v,rm,key)=>v?written(v,rm):lk?'':wblank(key,lab);
  const none='<span class="muted">none needed</span>';
  return `<div class="recipe ${lk?'locked':''}"><div class="rtitle"><h3><button class="rpick" data-choose-recipe="${r.id}">${titleHTML}</button></h3>${acts}</div><div class="muted">${esc(r.type)}. ${esc(r.intent)}.</div>
  <div class="rbody"><div class="wrow"><b>Themes:</b><span class="wvals plain">${r.themes.map(t=>kw(t)).join(', ')}</span></div>
  <div class="wgroup"><div class="wrow"><b>Ingredients:</b><span class="wvals">${r.ing.map((want,i)=>{const cat=ITEM[want].c;return slot(CATLABEL[cat]||cat,n.ing[i],`data-rm-ing="${r.id}|${i}"`,`ing|${r.id}|${i}`)}).join(' ')}</span></div>${ingList}</div>
  <div class="wgroup"><div class="wrow"><b>Candle:</b><span class="wvals">${r.candle?slot('Candle',n.candle,`data-rm-candle="${r.id}"`,`candle|${r.id}`):none}</span></div>${pickOpen.startsWith('candle|')?ccList:''}</div>
  <div class="wgroup"><div class="wrow"><b>Card:</b><span class="wvals">${r.tarot?slot('Card',n.tarot,`data-rm-tarot="${r.id}"`,`tarot|${r.id}`):none}</span></div>${pickOpen.startsWith('tarot|')?ccList:''}</div>
  <div class="wgroup"><div class="wrow"><b>When:</b><span class="wvals">${M?r.conds.map((c,i)=>slot(CONDKIND[c.t],n.when[i],`data-rm-when="${r.id}|${i}"`,`when|${r.id}|${i}`)).join(' '):'<span class="muted">any time</span>'}</span></div>${whenList}</div></div>
  </div>`}
/* A blank's list: the words in the word bank (those not used up), A to Z; a blank that holds a word can also be rubbed out. */
function wordIndex(key,has){const words=S.bank.filter(w=>!usedUp(w)||w===has).sort();
  return `<div class="windex kwindex" role="listbox">${has?`<button data-choose="${esc(key)}" data-val="" role="option" class="rub"><span>Rub it out</span></button>`:''}`+
    (words.length?words.map(w=>`<button data-choose="${esc(key)}" data-val="${esc(w)}" role="option"${w===has?' aria-selected="true"':''}><span>${esc(w)}</span></button>`).join('')
      :'<p class="kwnone">No words kept yet. Dotted words, tapped, go into the word bank.</p>')+'</div>'}
/* Write a word into an entry's blank (an empty word rubs it out). A finished ingredient entry brings up its page. */
function fillBlank(k,i,w){const f=S.fills[k]||(S.fills[k]=[]);
  if(!w){f[i]=undefined;save();renderBooks();return}
  f[i]=w;const e=entryList(curBook).find(x=>x.sk===k),done=e&&entryLocked(e);
  /* an ingredient's entry complete: its page comes up on its own, picture and all; anything else just says so */
  if(done){if(e.sk.startsWith('item:'))setTimeout(()=>showEntryDone(e),350);else toast(`${e.k} is complete ✦`)}
  if(usedUp(w)){if(selWord===w)selWord=null;setTimeout(()=>toast(`“${w}” is used up: every blank that needs it is filled.`),done?2300:0)}
  save();renderBooks()}
$('#books').addEventListener('click',e=>{const b=e.target.closest('button');
  /* a click anywhere else folds an open index away */
  if(pickOpen&&!(b&&(b.dataset.pick||b.dataset.choose||b.dataset.entry))&&!e.target.closest('.windex')){pickOpen='';if(!b){renderBooks();return}}
  if(!b||b.dataset.collect)return;
  if(b.dataset.pick){pickOpen=pickOpen===b.dataset.pick?'':b.dataset.pick;renderBooks();
    if(pickOpen)placeIndex();return}
  if(b.dataset.choose&&b.dataset.choose.startsWith('kw|')){const[,k,i]=b.dataset.choose.split('|');pickOpen='';fillBlank(k,+i,b.dataset.val);return}
  if(b.dataset.choose){const[row,id,i]=b.dataset.choose.split('|'),v=b.dataset.val,n=noteOf(id);
    if(row==='ing')n.ing[+i]=v;else if(row==='when')n.when[+i]=v;else if(row==='candle')n.candle=v;else if(row==='tarot')n.tarot=v;
    pickOpen='';if(recipeLocked(id))setTimeout(()=>showRecipeDone(id),350);save();renderBooks();return}
  if(b.dataset.chooseRecipe){const id=b.dataset.chooseRecipe;S.target=String(S.target)===id?'':id;save();renderBooks();render();return}
  if(b.dataset.rmCandle){noteOf(b.dataset.rmCandle).candle='';save();renderBooks();return}
  if(b.dataset.rmTarot){noteOf(b.dataset.rmTarot).tarot='';save();renderBooks();return}
  /* Recipe Book shortcut: put what the player has written for a recipe onto the altar, optionally test it straight away. */
  if(b.dataset.layout||b.dataset.booktest){const id=b.dataset.layout||b.dataset.booktest,n=noteOf(id);
    S.target=String(id);S.result=null;
    if(n.ing.some(Boolean)){S.altar=[...new Set(n.ing.filter(x=>x&&x!==BIRTHSTONE))];S.candle=n.candle||'';S.tarot=n.tarot||''}
    $('#books').classList.remove('open');goTo('altar');
    if(b.dataset.booktest)doCraft(true);else{render();toast(`Laid out ${D.recipes[id].name} on the altar.`)}
    return}
  if(b.id==='cover'){openTome();return}
  if(b.id==='turnPrev'||b.id==='turnNext'){turnBy(b.id==='turnNext'?1:-1);return}
  if(b.dataset.go){const pages=allPages(curBook);turnTo(pages.findIndex(p=>p.key===b.dataset.go));return}
  if(b.id==='turnFirst'||b.id==='turnLast'){turnTo(b.id==='turnFirst'?0:allPages(curBook).length-1);return}
  if(b.dataset.mark!==undefined){const m=S.marks[+b.dataset.mark];
    if(m.book!==curBook){S.page[m.book]=m.key;save();showBook(m.book)}else turnTo(allPages(curBook).findIndex(p=>p.key===m.key));return}
  if(b.dataset.bm){const k=b.dataset.bm,i=S.marks.findIndex(x=>x.book===curBook&&x.key===k);
    if(i>=0)S.marks.splice(i,1);else if(S.marks.length>=MAX_MARKS){toast('No room for another bookmark. I\u2019ll have to take one out first.');return}
    else{const p=bookPages(curBook).find(x=>x.key===k);S.marks.push({book:curBook,key:k,title:p.title,color:MARKCOL[S.marks.length%MARKCOL.length]})}
    save();renderBooks();return}
  if(b.dataset.book){if(b.dataset.book!==curBook)showBook(b.dataset.book);return}
  if(b.dataset.word){selWord=selWord===b.dataset.word?null:b.dataset.word;renderBooks();return}
  /* a blank: with a word picked up from the word bank, it goes straight in; otherwise the blank's list unfolds (or folds) */
  if(b.dataset.entry){const k=b.dataset.entry,i=+b.dataset.i,key=`kw|${k}|${i}`;
    if(selWord){pickOpen='';fillBlank(k,i,selWord);return}
    pickOpen=pickOpen===key?'':key;renderBooks();return}
  if(b.dataset.rmIng){const[id,i]=b.dataset.rmIng.split('|');noteOf(id).ing[+i]='';save();renderBooks();return}
  if(b.dataset.rmWhen){const[id,i]=b.dataset.rmWhen.split('|');noteOf(id).when[+i]='';save();renderBooks();return}
});
$('#books').addEventListener('change',e=>{const t=e.target;
  if(t.dataset.addIng&&t.value){const[iid,ii]=t.dataset.addIng.split('|');noteOf(iid).ing[+ii]=t.value}
  if(t.dataset.addWhen&&t.value){const[wid,wi]=t.dataset.addWhen.split('|');noteOf(wid).when[+wi]=t.value}
  if(t.dataset.setCandle!==undefined)noteOf(t.dataset.setCandle).candle=t.value;
  if(t.dataset.setTarot!==undefined)noteOf(t.dataset.setTarot).tarot=t.value;
  const id=(t.dataset.addIng||'').split('|')[0]||(t.dataset.addWhen||'').split('|')[0]||t.dataset.setCandle||t.dataset.setTarot;
  if(id&&recipeLocked(id))setTimeout(()=>showRecipeDone(id),350)
  save();renderBooks()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(pickOpen){pickOpen='';renderBooks();return}$('#books').classList.remove('open');render()}
  /* the arrow keys turn the pages, unless a box or list has the keyboard */
  if($('#books').classList.contains('open')&&/^Arrow(Left|Right)$/.test(e.key)&&!e.target.closest('input,select,textarea')){e.preventDefault();turnBy(e.key==='ArrowRight'?1:-1)}});
/* the word bank stands as tall as the book */
new ResizeObserver(()=>$('#books').style.setProperty('--tome-h',$('#tome').offsetHeight+'px')).observe($('#tome'));
