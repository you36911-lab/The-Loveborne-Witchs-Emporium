/* Email: the computer on the counter opens Moonpost, the shop's webmail.
   Folders on the left, the message list in the middle, the open email on the right.
   (In the story data and the design document these are still called letters.) */
let mailFolder='inbox',letterSel='',mailQuery='';
const MY_ADDRESS='shop@loveborne.owl';
const AVATARS=['#F7A8C8','#B9A6F2','#9FD8C4','#F6C98B','#A9C8F2','#E7A7E0','#C9DE9A'];
const slug=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'');
/* "Mill Lane Apothecary, Wrenmoor" is sent from millaneapothecary@wrenmoor.owl. */
function senderOf(from){const [who,where]=from.split(/,\s*/);return {name:who,addr:`${slug(who)}@${where?slug(where):'moonpost'}.owl`}}
function avatarOf(name){let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))>>>0;return AVATARS[h%AVATARS.length]}
/* Every email, newest first. The three from H. were waiting in the inbox when the shop became yours. */
function allMail(){return [
  ...mailIn().reverse().map(m=>({key:'mail:'+m.i,...senderOf(m.from),subject:m.title,lines:m.lines,open:S.mail[m.i],when:`Day ${m.day}`,whenFull:`Day ${m.day}, ${m.hour}`})),
  ...D.letters.map((l,i)=>({key:'start:'+i,name:'H.',addr:'h@moonpost.owl',subject:l.title,lines:l.lines,open:S.letters[i],when:'Earlier',whenFull:'Before you came'}))]}
function hintsMail(){const h=S.hints||[];return h.length?[{key:'hints',name:'Your notebook',addr:'',subject:'What customers told me',open:true,when:`Day ${h[h.length-1].day}`,whenFull:'Written down as they said it',
  lines:h.map(x=>`Day ${x.day}, ${x.hour} · ${x.who}: ${x.text}`)}]:[]}
function folderMail(f){const arc=S.archive||(S.archive=[]),all=allMail();
  return f==='notes'?hintsMail():all.filter(x=>arc.includes(x.key)===(f==='archive'))}
function openLetters(sel){mailFolder='inbox';mailQuery='';$('#wmSearch').value='';letterSel=sel||'';if(sel)markOpen(sel);$('#letters').classList.add('open');renderLetters()}
/* Opening an email for the first time. H.'s third email also writes three recipes into the Recipe Book. */
function markOpen(key){const [kind,n]=key.split(':'),i=+n;
  if(kind==='mail'){S.mail[i]=true}
  else if(kind==='start'&&!S.letters[i]){S.letters[i]=true;
    if(i===2){[[95,true],[153,true],[111,false]].forEach(([id,full])=>{const r=D.recipes[id],n=noteOf(id);
      if(full){n.ing=[...r.ing];n.candle=r.candle;n.tarot=r.tarot;n.when=r.conds.map(condName)}else{n.ing=['Ash wood','Ink','Raven feather'];n.candle='Purple'}})}}
  save();renderBadge()}
const avatarHTML=x=>`<i class="wm-av" style="background:${avatarOf(x.name)}" aria-hidden="true">${esc(x.name[0])}</i>`;
function renderLetters(){
  const unread=allMail().filter(x=>!x.open&&!S.archive.includes(x.key)).length;
  const folders=[['inbox','Inbox',unread],['archive','Archive',0],['notes','Notes',0]];
  $('#wmSide').innerHTML=folders.map(([f,label,n])=>`<button class="wm-folder" data-folder="${f}" aria-pressed="${f===mailFolder}">${label}${n?`<span class="wm-count">${n}</span>`:''}</button>`).join('');
  const q=mailQuery.toLowerCase(),list=folderMail(mailFolder).filter(x=>!q||[x.name,x.addr,x.subject,...x.lines].some(t=>t.toLowerCase().includes(q)));
  const empty={inbox:'Your inbox is empty.',archive:'Nothing archived. Emails you no longer need can be moved here.',notes:'Nothing noted yet. When a happy customer lets something slip, it is written down here.'}[mailFolder];
  $('#letterList').innerHTML=list.length?list.map(x=>`<button class="wm-row ${x.open?'':'unread'}" data-lsel="${x.key}" aria-pressed="${x.key===letterSel}">${avatarHTML(x)}
    <span class="wm-from">${esc(x.name)}</span><span class="wm-when">${esc(x.when)}</span>
    <span class="wm-subj">${esc(x.subject)}</span><span class="wm-snip">${esc(x.lines.slice(x.lines.length>1?1:0).join(' '))}</span></button>`).join('')
    :`<p class="muted wm-empty">${q?'No emails match your search.':empty}</p>`;
  const x=list.find(l=>l.key===letterSel),el=$('#letterRead');
  $('#webmail').classList.toggle('reading',!!x);
  if(!x){el.innerHTML=`<div class="wm-none"><span aria-hidden="true">✉</span><p class="muted">${list.length?'Select an email to read it.':''}</p></div>`;return}
  const act=x.key==='hints'?'':`<button data-arc="${x.key}">${mailFolder==='archive'?'Move to Inbox':'Archive'}</button>`;
  el.innerHTML=`<div class="wm-tools"><button class="wm-back" data-back="1">← Back</button>${act}</div>
    <h2 class="wm-title">${esc(x.subject)}</h2>
    <div class="wm-meta">${avatarHTML(x)}<div><b>${esc(x.name)}</b>${x.addr?` <span class="muted">&lt;${esc(x.addr)}&gt;</span>`:''}<br><small class="muted">to me</small></div><small class="muted wm-date">${esc(x.whenFull)}</small></div>
    <div class="wm-text">${x.lines.map(t=>`<p>${kw(t)}</p>`).join('')}</div>`}
$('#letters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.collect)return;
  if(b.dataset.folder){mailFolder=b.dataset.folder;letterSel='';renderLetters();return}
  if(b.dataset.lsel){letterSel=b.dataset.lsel;if(letterSel!=='hints')markOpen(letterSel);renderLetters();$('#letterRead').scrollTop=0;return}
  if(b.dataset.back){letterSel='';renderLetters();return}
  if(b.dataset.arc){const k=b.dataset.arc,a=S.archive;a.includes(k)?a.splice(a.indexOf(k),1):a.push(k);toast(a.includes(k)?'Archived':'Moved to Inbox');letterSel='';save();renderLetters();return}
  if(b.id==='closeLetters'){$('#letters').classList.remove('open');render()}});
$('#wmSearch').addEventListener('input',e=>{mailQuery=e.target.value;renderLetters()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#letters').classList.contains('open')){$('#letters').classList.remove('open');render()}});
