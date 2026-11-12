/* Sounds: recordings in assets/sounds (from Pixabay, under the Pixabay Content License; listed in ASSETS.sounds and in
   DESIGN_NOTES.md). */

/* ---------- recordings ---------- */
/* Played with plain audio elements, so they also work when the game is opened straight from the file. Each is loaded
   once and copied to play, so two can overlap. The volumes even them out: the recordings came at very different levels. */
const SFX_CACHE={};
function sfx(name,vol,ms,from,fade){try{const base=SFX_CACHE[name]||(SFX_CACHE[name]=new Audio(ASSETS.sounds[name]));const a=base.cloneNode();const v=Math.min(1,vol*SET.volume);a.volume=v;  /* SET.volume: the Settings slider (menu.js) */if(from)a.currentTime=from;a.play().catch(()=>{});
  if(ms&&fade){setTimeout(()=>{const t0=Date.now(),f=setInterval(()=>{const k=1-(Date.now()-t0)/fade;if(k<=0){clearInterval(f);a.pause()}else a.volume=v*k},25)},ms-fade)}
  else if(ms)setTimeout(()=>a.pause(),ms)}catch(e){}}  /* ms: stop it after this long (for a recording with a long quiet tail); fade: the last this-many ms of that fade out softly; from: skip a quiet start */
/* every recording is loaded as the game starts, so the first time one plays it is not late */
Object.entries(ASSETS.sounds).forEach(([n,src])=>{try{const a=SFX_CACHE[n]=new Audio(src);a.preload='auto'}catch(e){}});
/* The shop's hand bell, rung to call the next customer: "Bell Ring" (Universfield). */
function playBell(){sfx('shopBell',.45)}
/* The silver desk bell on the altar, struck to make what is laid out: "Clear Bell Chime" (Universfield). */
function playAltarBell(){sfx('altarBell',1)}
/* Something new on the computer (an email, the night's reviews): "New Notification 012" (Universfield). */
function playNotify(){sfx('notify',.5)}
/* The till, as receipts come out (clicked, when there are any, and at closing): "cash drawer and receipt" (freesound_community). */
function playReceiptPrint(){sfx('receipt',.9)}
/* A customer comes in: the shop's old door creaks open and swings shut behind them. "Creaking Door 03" (Universfield),
   then "Close Door" (DRAGON-STUDIO) as the creak fades. */
function playDoorClose(){sfx('doorCreak',.6);setTimeout(()=>sfx('doorClose',.55),1150)}
/* A test-craft candle going out: "wind magic (5)" (Yodguard), a soft magical whoosh. The file runs 8 seconds but the
   sound is over in about one; the rest is near silence, so it stops at 1.8s. */
function playCandleOut(){sfx('candleOut',.3,1800)}
/* A test craft's result comes to the phone on the altar: "New Notification 057" (Universfield). */
function playPhone(){sfx('phoneNotify',.5)}
/* Crafting on the altar (a test craft or the real thing): "Magic Spell" (Soumages), chosen by the designer. */
function playCraft(){sfx('craft',.6,0,.3)}  /* its first 0.35s is quiet */
/* A cupboard door in the workroom swinging open, and shut: "Cabinet Door Open" and "Cabinet Door Close" (freesound_community). */
function playCabinetOpen(){sfx('cabinetOpen',.5,0,.52)}  /* the recordings start with a pause (0.58s, 0.8s): skip it, so the sound comes with the door */
function playCabinetClose(){sfx('cabinetClose',.5,0,.74)}
/* A button on the title screen: a clear little ding, "Ding" (freesound_community). The recording rings on for 2.7s;
   its first 0.45s plays as it is, then it fades out over 0.35s. */
function playDing(){sfx('ding',.45,800,0,350)}
/* The computer: a mouse click for every click on its screen (apps, icons, windows, the email list, the taskbar) and on a
   new email's card buttons; not for the computer on the counter itself. The path is taken as the click began, since a click
   on the screen often redraws what was clicked (the email list does) before this hears it. A click the tutorial holds back
   makes no sound (it never gets this far). */
function playClick(){sfx('mouseClick',.5,0,.15)}  /* the recording starts with 0.15s of silence: skip it, so the click lands with the finger */
document.addEventListener('click',e=>{if(e.composedPath().some(n=>n.id==='pcScreen'||(n.matches&&n.matches('#mailFx button'))))playClick()});
