/* The phone on the altar (right of the candle stand). A test craft's result comes to it: the phone buzzes with a
   notification sound and shows a badge; clicking it opens the phone, drawn as a real phone (bezel, notch, status bar), on
   its Test Craft app, whose title bar is like the computer's apps. The last result stays on it (S.lastTest). */
/* a small line icon for each kind of clue (label style 1) */
const CLUEICO={ing:'<path d="M9.5 3h5M10.5 3v5.2a6.5 6.5 0 1 0 3 0V3"/>',candle:'<path d="M9.5 11h5v10h-5zM12 3.5c1.6 2 1.8 3.4 0 5-1.8-1.6-1.6-3 0-5z"/>',
  card:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>',when:'<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.5 7 7 0 0 1-5-13.5z"/>',
  came:'<path d="M12 3l1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/>',done:'<path d="M5 12.5l4.5 4.5L19 7.5"/>'};
const GRADE_NOTE={Perfect:'Perfect',Good:'Nearly',Clumsy:'Clumsy',Failed:'Failed'};
function phoneHTML(){const R=S.lastTest;
  if(!R)return `<p class="ph-empty muted">No test crafts yet.<br>Test craft a recipe from the Recipe Book (the little bottle) and the result comes here.</p>`;
  /* the clue lines grouped by what they are about (ingredients, candle, card...), each group under its label; plain text
     (no word-bank words to collect here) */
  const groups=[];R.lines.forEach(l=>{if(typeof l==='string')l={k:'',t:l};const g=groups[groups.length-1];
    if(g&&g.k===l.k)g.t.push(l.t);else groups.push({k:l.k,t:[l.t]})});
  const rows=groups.map(g=>`<section class="ph-sec" data-k="${g.k}">${g.k&&CLUETAG[g.k]?`<h4 class="ph-lab"><svg viewBox="0 0 24 24" aria-hidden="true">${CLUEICO[g.k]||''}</svg><span>${CLUETAG[g.k]}</span></h4>`:''}${g.t.map(t=>`<p class="ph-line">${esc(t)}</p>`).join('')}</section>`).join('');
  const score=R.total?`<div class="ph-score" title="Ingredients right"><b>${R.ok}</b>/${R.total} <small>ingredients</small></div>`:'';
  return `<div class="ph-head"><div><b class="ph-name">${esc(R.name||'Test craft')}</b>${R.type?`<small class="muted">${esc(R.type)}</small>`:''}</div>
    <span class="ph-grade g-${R.grade}">${GRADE_NOTE[R.grade]||esc(R.grade)}</span></div>
    <div class="ph-card">${score}${rows}</div>`}
function renderPhoneBadge(){const n=S.phoneNew||0,b=$('#phoneBadge');b.hidden=!n;b.textContent=n;$('#phoneBtn').classList.toggle('new',!!n)}
function openPhone(){$('#phoneTime').textContent='Day '+S.day;$('#phoneApp').innerHTML=phoneHTML();$('#phoneApp').scrollTop=0;
  S.phoneNew=0;save();renderPhoneBadge();renderLabelSwitch();$('#phoneView').classList.add('open')}
function closePhone(){$('#phoneView').classList.remove('open')}
/* A new result: after a moment (a black candle going out first, if one does) the phone buzzes on the table, chimes, and
   its badge counts the results not looked at yet. */
function phoneNotify(wait){setTimeout(()=>{const ph=$('#phoneBtn');S.phoneNew=(S.phoneNew||0)+1;save();renderPhoneBadge();
  ph.classList.remove('buzz');void ph.offsetWidth;ph.classList.add('buzz');playPhone()},wait||0)}
$('#phoneBtn').addEventListener('click',openPhone);
/* Prototype only: four ways to label the clue sections, to choose between (1 icon and name, 2 small heading, 3 coloured
   bar, 4 serif heading). The choice is kept in this browser. */
const LABEL_STYLES=['Icon','Heading','Bar','Serif'];
let labelStyle=1;try{labelStyle=+localStorage.getItem('phoneLabelStyle')||1}catch(e){}
function renderLabelSwitch(){const app=$('#phoneApp');LABEL_STYLES.forEach((_,i)=>app.classList.toggle('lbl'+(i+1),labelStyle===i+1));
  const p=$('#phoneProto');p.hidden=!PROTOTYPE_TOOLS;if(!PROTOTYPE_TOOLS)return;
  p.innerHTML='Labels '+LABEL_STYLES.map((n,i)=>`<button data-lbl="${i+1}" aria-pressed="${labelStyle===i+1}" title="${n}">${i+1}</button>`).join('')}
$('#phoneProto').addEventListener('click',e=>{const b=e.target.closest('[data-lbl]');if(!b)return;labelStyle=+b.dataset.lbl;
  try{localStorage.setItem('phoneLabelStyle',labelStyle)}catch(e){}renderLabelSwitch()});
$('#phoneIco').src=ASSETS.iconPhoneApp;
$('#phoneView').addEventListener('click',e=>{if(e.target.id==='phoneView'||e.target.closest('#phoneClose'))closePhone()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#phoneView').classList.contains('open'))closePhone()});
