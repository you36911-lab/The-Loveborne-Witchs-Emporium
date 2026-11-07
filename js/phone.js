/* The phone on the altar (right of the candle stand). A test craft's result comes to it: the phone buzzes with a
   notification sound and shows a badge; clicking it opens the phone, drawn as a real phone (bezel, notch, status bar), on
   its Test Craft app, whose title bar is like the computer's apps. The last result stays on it (S.lastTest). */
const GRADE_NOTE={Perfect:'Perfect',Good:'Nearly',Clumsy:'Clumsy',Failed:'Failed'};
/* the results kept on the phone, newest first (S.testLog, the last ten); phoneAt is the one shown (0 = the newest) */
let phoneAt=0;
const phoneLog=()=>S.testLog&&S.testLog.length?S.testLog:S.lastTest?[S.lastTest]:[];
function phoneHTML(){const R=phoneLog()[phoneAt];
  if(!R)return `<p class="ph-empty muted">No test crafts yet.<br>Test craft a recipe from the Recipe Book (the little bottle) and the result comes here.</p>`;
  /* the clue lines grouped by what they are about (ingredients, candle, card...), each group under its label; words for
     the word bank are dotted and can be collected here, as anywhere */
  const groups=[];R.lines.forEach(l=>{if(typeof l==='string')l={k:'',t:l};const g=groups[groups.length-1];
    if(g&&g.k===l.k)g.t.push(l.t);else groups.push({k:l.k,t:[l.t]})});
  const rows=groups.map(g=>`<section class="ph-sec" data-k="${g.k}">${g.k&&CLUETAG[g.k]?`<h4 class="ph-lab">${CLUETAG[g.k]}</h4>`:''}${g.t.map(t=>`<p class="ph-line">${kw(t)}</p>`).join('')}</section>`).join('');
  const score=R.total?`<div class="ph-score" title="Ingredients right"><b>${R.ok}</b>/${R.total} <small>ingredients</small></div>`:'';
  return `<div class="ph-head"><div><b class="ph-name">${phoneTitle(R.name||'Test craft')}</b>${R.type?`<small class="muted">${esc(R.type)}</small>`:''}</div>
    <span class="ph-grade g-${R.grade}">${GRADE_NOTE[R.grade]||esc(R.grade)}</span></div>
    <div class="ph-card">${score}${rows}</div>`}
/* a title breaks like the Recipe Book's: a short word (the, a, of...) never ends a line ("Another Orbit Around / the Sun") */
function phoneTitle(name){return name.split(' ').reduce((g,w,i,A)=>{if(i&&SMALL_WORDS.has(A[i-1].toLowerCase()))g[g.length-1]+=' '+w;else g.push(w);return g},[]).map(s=>esc(s).replace(/ /g,'\u00a0')).join(' ')}
function renderPhoneHist(){const n=phoneLog().length,b=$('#phoneHist');b.hidden=n<2;$('#phoneHistN').textContent=phoneAt+1;
  b.title=phoneAt?'Result '+(phoneAt+1)+' (earlier). Again for an earlier one':'An earlier result'}
function renderPhoneBadge(){const n=S.phoneNew||0,b=$('#phoneBadge');b.hidden=!n;b.textContent=n}
function openPhone(){phoneAt=0;$('#phoneTime').textContent='Day '+S.day;$('#phoneApp').innerHTML=phoneHTML();renderPhoneHist();$('#phoneApp').scrollTop=0;
  S.phoneNew=0;save();renderPhoneBadge();$('#phoneView').classList.add('open')}
function closePhone(){$('#phoneView').classList.remove('open')}
/* A new result: after a moment (a black candle going out first, if one does) the phone buzzes on the table, chimes, and
   its badge counts the results not looked at yet. */
function phoneNotify(wait){setTimeout(()=>{const ph=$('#phoneBtn');S.phoneNew=(S.phoneNew||0)+1;save();renderPhoneBadge();
  ph.classList.remove('buzz');void ph.offsetWidth;ph.classList.add('buzz');playPhone()},wait||0)}
$('#phoneBtn').addEventListener('click',openPhone);

$('#phoneIco').src=ASSETS.iconPhoneApp;
$('#phoneView').addEventListener('click',e=>{if(e.target.id==='phoneView'){closePhone();return}  /* outside the phone closes it, like every popup */
  if(e.target.closest('#phoneHist')){phoneAt=(phoneAt+1)%phoneLog().length;$('#phoneApp').innerHTML=phoneHTML();$('#phoneApp').scrollTop=0;renderPhoneHist()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#phoneView').classList.contains('open'))closePhone()});
