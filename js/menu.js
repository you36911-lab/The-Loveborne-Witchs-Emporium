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
function openSettings(){fillSettings();$('#settings').classList.add('open')}
/* a side panel slides back out, then closes (see .modal.side in style.css) */
function closePanel(m,then){if(!m.classList.contains('open')||m.classList.contains('closing'))return;m.classList.add('closing');
  setTimeout(()=>{m.classList.remove('open','closing');if(then)then()},220)}
function closeSettings(){closePanel($('#settings'))}
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
/* Quiet movement while the title waits: the splash floats a little, light motes drift up through the shop, and small
   glints twinkle on the silver frame (at the GLINTS spots, in % of the splash picture). See .titlescreen in style.css. */
const GLINTS=[[50,7],[31,12],[69,12],[17,30],[83,30],[8,52],[92,52],[22,78],[78,78],[38,93],[62,93],[50,99]];
let glintT=0;
function glint(){const box=$('#tsGlints'),[x,y]=GLINTS[Math.floor(Math.random()*GLINTS.length)],g=document.createElement('i');
  g.style.left=x+'%';g.style.top=y+'%';g.style.setProperty('--s',(.6+Math.random()*.7).toFixed(2));box.appendChild(g);
  setTimeout(()=>g.remove(),1800);glintT=setTimeout(glint,700+Math.random()*1300)}
function makeMotes(){const box=$('#tsMotes');if(box.childElementCount)return;
  for(let i=0;i<22;i++){const m=document.createElement('i');
    m.style.cssText=`left:${(Math.random()*100).toFixed(1)}%;--d:${(14+Math.random()*14).toFixed(1)}s;--w:${(-30-Math.random()*30).toFixed(1)}s;--z:${(2+Math.random()*4).toFixed(1)}px;--x:${(Math.random()*60-30).toFixed(0)}px`;
    box.appendChild(m)}}
function showTitle(){const t=$('#title'),saved=hasSave();
  /* the shop as the player left it: the saved day's hour (a festival's own picture on its days); twilight before any game */
  $('#tsBg').style.backgroundImage=`url("${saved?bgSrc(HOURS[S.h]):ASSETS.backgrounds.Twilight}")`;$('#tsSplash').src=ASSETS.splash;makeMotes();
  clearTimeout(glintT);glintT=setTimeout(glint,1200);
  $('#tsContinue').hidden=!saved;
  if(saved)$('#tsWhere').textContent=`Day ${S.day} · ${today().weekday}, ${HOURS[S.h]}`;
  $('#tsQuit').hidden=!DESKTOP_BUILD;
  $('#tsMenu').hidden=false;$('#tsConfirm').hidden=true;
  $('#world').inert=true;t.hidden=false;t.classList.remove('gone')}
/* Leaving the title: the shop is drawn behind it first, its background shown at once (no fade) once the picture has
   loaded, and only then does the title fade away, so the counter is never seen half-built. */
function leaveTitle(start){const t=$('#title'),scene=$('#scene');
  scene.classList.add('nofade');start();
  const im=new Image();im.src=bgNow;
  Promise.race([im.decode().catch(()=>{}),new Promise(r=>setTimeout(r,1500))]).then(()=>requestAnimationFrame(()=>{
    void scene.offsetWidth;scene.classList.remove('nofade');$('#world').inert=false;t.classList.add('gone');
    setTimeout(()=>{t.hidden=true;clearTimeout(glintT)},TITLE_FADE_MS)}))}
/* a new game opens like the first one: the dawn picture behind the fading title, then the day card, then the post */
function newGame(){leaveTitle(()=>{newState();showDawn(TITLE_FADE_MS+150)})}
$('#tsContinue').onclick=()=>leaveTitle(()=>{if(S.day===1&&S.h===0&&!S.hist.length)showDawn(TITLE_FADE_MS+150);else render()});
$('#tsNew').onclick=()=>{if(!hasSave())return newGame();$('#tsMenu').hidden=true;$('#tsConfirm').hidden=false};
$('#tsYes').onclick=newGame;
$('#tsNo').onclick=()=>{$('#tsConfirm').hidden=true;$('#tsMenu').hidden=false};
$('#tsSettings').onclick=openSettings;
$('#tsQuit').onclick=()=>window.close();

/* ---------- the menu in play ---------- */
/* Esc opens it when nothing else is open (a book, the computer, the phone, the receipts, an open cupboard, a new email);
   otherwise Esc closes that first, as before. While it is open the shop behind cannot be clicked. */
const menuOpen=()=>$('#gameMenu').classList.contains('open');
function somethingOpen(){return ['books','pc','phoneView','receiptsView','info'].some(id=>$('#'+id).classList.contains('open'))||!$('#mailFx').hidden||!!openShelf}
function openMenu(){$('#gmList').hidden=false;$('#gmConfirm').hidden=true;$('#gmQuit').hidden=!DESKTOP_BUILD;
  $('#gameMenu').classList.add('open');$('#world').inert=true}
function closeMenu(){closePanel($('#gameMenu'),()=>{if(!titleOpen())$('#world').inert=false})}
$('#gmResume').onclick=closeMenu;
$('#gmSettings').onclick=openSettings;
$('#gmRestart').onclick=()=>{$('#gmList').hidden=true;$('#gmConfirm').hidden=false};
$('#gmNo').onclick=()=>{$('#gmConfirm').hidden=true;$('#gmList').hidden=false};
$('#gmYes').onclick=()=>{closeMenu();newState();showDawn()};  /* a new game opens like the first one: the day card, then the post */
$('#gmTitle').onclick=()=>{save();$('#gameMenu').classList.remove('open');showTitle()};
$('#gmQuit').onclick=()=>{save();window.close()};
$('#gameMenu').onclick=e=>{if(e.target.id==='gameMenu')closeMenu()};  /* a click beside the panel resumes */

/* Esc: Settings first, then the title screen, then the menu; anything else open handles its own Esc. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;
  const stop=()=>{e.stopImmediatePropagation();e.preventDefault()};
  if($('#settings').classList.contains('open')){closeSettings();return stop()}
  if(titleOpen()){if(!$('#tsConfirm').hidden)$('#tsNo').click();return stop()}
  if(menuOpen()){if(!$('#gmConfirm').hidden)$('#gmNo').click();else closeMenu();return stop()}
  if(somethingOpen())return;
  openMenu();stop()},true);
