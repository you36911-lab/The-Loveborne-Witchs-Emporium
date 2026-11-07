/* The phone on the altar (left of the candle stand). A test craft's result comes to it: the phone buzzes with a
   notification, then opens on its Test Craft app, which looks like the computer's apps (a window with a title bar). The
   last result stays on the phone (S.lastTest); clicking the phone opens it again. */
const GRADE_NOTE={Perfect:'Perfect',Good:'Nearly',Clumsy:'Clumsy',Failed:'Failed'};
function phoneHTML(){const R=S.lastTest;
  if(!R)return `<p class="ph-empty muted">No test crafts yet.<br>Test craft a recipe from the Recipe Book (the little bottle) and the result comes here.</p>`;
  const rows=R.lines.map((l,i,A)=>typeof l==='string'?`<p class="ph-line">${kw(l)}</p>`
    :`<p class="ph-line${i&&A[i-1].k===l.k?' cont':''}">${i&&A[i-1].k===l.k?'':`<span class="tag">${CLUETAG[l.k]}</span> `}${kw(l.t)}</p>`).join('');
  return `<div class="ph-head"><div><b class="ph-name">${esc(R.name||'Test craft')}</b>${R.type?`<small class="muted">${esc(R.type)}</small>`:''}</div>
    <span class="ph-grade g-${R.grade}">${GRADE_NOTE[R.grade]||esc(R.grade)}</span></div>
    ${R.first?`<p class="ph-first">${esc(R.first)}</p>`:''}<div class="ph-card">${rows}</div>`}
function openPhone(){$('#phoneApp').innerHTML=phoneHTML();$('#phoneBtn').classList.remove('new');$('#phoneView').classList.add('open')}
function closePhone(){$('#phoneView').classList.remove('open')}
/* A new result: the phone buzzes on the table (after the slide down to the workroom, if there is one), then opens. */
let phoneTimer=0;
function phoneNotify(){clearTimeout(phoneTimer);const ph=$('#phoneBtn'),moving=$('#world').getAnimations?.().length>0;
  phoneTimer=setTimeout(()=>{ph.classList.add('new');ph.classList.remove('buzz');void ph.offsetWidth;ph.classList.add('buzz');playNotify();
    phoneTimer=setTimeout(openPhone,calm()?0:750)},moving?950:150)}
$('#phoneIco').src=ASSETS.iconBottle;
$('#phoneView').addEventListener('click',e=>{if(e.target.id==='phoneView'||e.target.closest('#phoneClose'))closePhone()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#phoneView').classList.contains('open'))closePhone()});
