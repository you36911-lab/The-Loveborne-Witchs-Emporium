/* The title screen and Settings.
   The title screen is the first thing shown: Continue (only when a game was saved), New Game, Settings, and Quit (only in
   the desktop build). Its first click also lets the browser play sound, which it blocks until the player clicks.
   Settings are kept under their own key (SETTINGS_KEY in config.js), so starting a new game does not reset them. */

/* ---------- settings ---------- */
const SET_DEFAULT={volume:1,sub:1};  /* volume 0 to 1 (sfx() in sound.js multiplies by it); sub: subtitle and speech size */
let SET={...SET_DEFAULT};
try{SET={...SET_DEFAULT,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch(e){}
function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(SET))}catch(e){}}
function applySettings(){document.documentElement.style.setProperty('--sub',SET.sub)}
applySettings();

function fillSettings(){$('#setVol').value=Math.round(SET.volume*100);$('#setVolN').textContent=Math.round(SET.volume*100)+'%';
  $('#setSub').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.sub===SET.sub));
  $('#setFull').checked=!!document.fullscreenElement}
function openSettings(){fillSettings();$('#settings').classList.add('open');$('#setDone').focus()}
function closeSettings(){$('#settings').classList.remove('open')}
$('#setVol').oninput=e=>{SET.volume=e.target.value/100;$('#setVolN').textContent=e.target.value+'%';saveSettings()};
$('#setVol').onchange=()=>playBell();  /* let go of the slider: the shop bell rings at the new volume */
$('#setSub').onclick=e=>{const b=e.target.closest('[data-sub]');if(!b)return;SET.sub=+b.dataset.sub;saveSettings();applySettings();fillSettings()};
$('#setFull').onchange=e=>{try{if(e.target.checked)document.documentElement.requestFullscreen().catch(()=>{});else if(document.fullscreenElement)document.exitFullscreen()}catch(err){}};
document.addEventListener('fullscreenchange',()=>{$('#setFull').checked=!!document.fullscreenElement});
$('#setDone').onclick=closeSettings;
$('#settings').onclick=e=>{if(e.target.id==='settings')closeSettings()};  /* a click outside the sheet closes it */

/* ---------- title screen ---------- */
/* Quit only means something in the desktop build (Electron or Tauri); in a browser tab the tab is closed instead. */
const DESKTOP_BUILD=!!(window.__TAURI__||window.electronAPI);
const titleOpen=()=>!$('#title').hidden;
function showTitle(){const t=$('#title');
  $('#tsBg').style.backgroundImage=`url("${ASSETS.backgrounds.Twilight}")`;$('#tsLogo').src=ASSETS.logo;
  $('#tsContinue').hidden=!HAD_SAVE;
  if(HAD_SAVE)$('#tsWhere').textContent=`Day ${S.day} · ${today().weekday}, ${HOURS[S.h]}`;
  $('#tsQuit').hidden=!DESKTOP_BUILD;
  $('#tsMenu').hidden=false;$('#tsConfirm').hidden=true;
  $('#world').inert=true;t.hidden=false;t.classList.remove('gone');
  ($('#tsContinue').hidden?$('#tsNew'):$('#tsContinue')).focus()}
/* The title fades away, then the day begins behind it. */
function leaveTitle(start){const t=$('#title');t.classList.add('gone');$('#world').inert=false;
  setTimeout(()=>{t.hidden=true;start()},700)}
function newGame(){leaveTitle(()=>{S=fresh();sanitize();showDawn()})}  /* a new game opens like the first one: the day card, then the post */
$('#tsContinue').onclick=()=>leaveTitle(()=>{if(S.day===1&&S.h===0&&!S.hist.length)showDawn();else render()});
$('#tsNew').onclick=()=>{if(!HAD_SAVE)return newGame();$('#tsMenu').hidden=true;$('#tsConfirm').hidden=false;$('#tsNo').focus()};
$('#tsYes').onclick=newGame;
$('#tsNo').onclick=()=>{$('#tsConfirm').hidden=true;$('#tsMenu').hidden=false;$('#tsNew').focus()};
$('#tsSettings').onclick=openSettings;
$('#tsQuit').onclick=()=>window.close();
/* While the title or Settings is up, Esc belongs to them and the shop behind does not hear it. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;
  if($('#settings').classList.contains('open')){closeSettings();e.stopImmediatePropagation();return}
  if(titleOpen()){if(!$('#tsConfirm').hidden)$('#tsNo').click();e.stopImmediatePropagation()}},true);
