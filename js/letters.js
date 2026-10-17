/* Letters: the computer on the counter opens them in their own window, apart from the books.
   A list on the left (Letters or Archive), the open letter on the right. */
let letterView='in',letterSel='';
/* Every letter, newest post first. */
function allLetters(){return [...mailIn().reverse().map(m=>({key:'mail:'+m.i,title:m.title,sub:`Came in the post, Day ${m.day}`,lines:m.lines,open:S.mail[m.i]})),
  ...D.letters.map((l,i)=>({key:'start:'+i,title:l.title,sub:'Found in the drawer',lines:l.lines,open:S.letters[i]}))]}
function openLetters(sel){letterView='in';letterSel=sel||'';if(sel)markOpen(sel);$('#letters').classList.add('open');renderLetters()}
/* Opening a letter for the first time. The third drawer letter also writes three recipes into the Recipe Book. */
function markOpen(key){const [kind,n]=key.split(':'),i=+n;
  if(kind==='mail'){S.mail[i]=true}
  else if(kind==='start'&&!S.letters[i]){S.letters[i]=true;
    if(i===2){[[95,true],[153,true],[111,false]].forEach(([id,full])=>{const r=D.recipes[id],n=noteOf(id);
      if(full){n.ing=[...r.ing];n.candle=r.candle;n.tarot=r.tarot;n.when=r.conds.map(condName)}else{n.ing=['Ash wood','Ink','Raven feather'];n.candle='Purple'}})}}
  save();renderBadge()}
function renderLetters(){const arc=S.archive||(S.archive=[]),all=allLetters();
  const shown=all.filter(x=>arc.includes(x.key)===(letterView==='archive'));
  const hints=S.hints||[];
  if(letterView==='archive'&&hints.length)shown.unshift({key:'hints',title:'What customers told me',sub:'Written down as they said it. Kept here on its own.',open:true});
  $('#letterList').innerHTML=`<div class="row" style="margin-bottom:8px"><button aria-pressed="${letterView!=='archive'}" data-lview="in">Letters (${all.length-arc.length})</button><button aria-pressed="${letterView==='archive'}" data-lview="archive">Archive (${arc.length+(hints.length?1:0)})</button></div>`
    +(shown.length?shown.map(x=>`<button class="lrow ${x.open?'':'unread'}" data-lsel="${x.key}" aria-pressed="${x.key===letterSel}">${x.open?'':'<i class="dot" aria-label="Unread"></i>'}<b>${esc(x.title)}</b><small class="muted">${esc(x.sub)}</small></button>`).join('')
      :`<p class="muted">${letterView==='archive'?'The archive is empty. Letters you no longer need can be moved here.':'No letters here. Archived letters are under Archive.'}</p>`);
  const x=shown.find(l=>l.key===letterSel),el=$('#letterRead');
  if(!x){el.innerHTML=`<p class="muted">${shown.length?'Pick a letter to read it.':''}</p>`;return}
  if(x.key==='hints'){el.innerHTML=`<div class="letter"><h3>${esc(x.title)}</h3><p class="muted" style="font-size:13px">${esc(x.sub)}</p>${hints.map(h=>`<p><span class="muted" style="font-size:13px">Day ${h.day}, ${esc(h.hour)} · ${esc(h.who)}</span><br>${kw(h.text)}</p>`).join('')}</div>`;return}
  el.innerHTML=`<div class="letter"><h3>${esc(x.title)}</h3><p class="muted" style="font-size:13px">${esc(x.sub)}</p>${x.lines.map(t=>`<p>${kw(t)}</p>`).join('')}<button class="small" data-arc="${x.key}">${letterView==='archive'?'Take out of the archive':'Move to archive'}</button></div>`}
$('#letters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.collect)return;
  if(b.dataset.lview){letterView=b.dataset.lview;letterSel='';renderLetters();return}
  if(b.dataset.lsel){letterSel=b.dataset.lsel;if(letterSel!=='hints')markOpen(letterSel);renderLetters();$('#letterRead').scrollTop=0;return}
  if(b.dataset.arc){const k=b.dataset.arc,a=S.archive;a.includes(k)?a.splice(a.indexOf(k),1):a.push(k);toast(a.includes(k)?'Moved to the archive':'Taken out of the archive');letterSel='';save();renderLetters();return}
  if(b.id==='closeLetters'){$('#letters').classList.remove('open');render()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#letters').classList.contains('open')){$('#letters').classList.remove('open');render()}});
