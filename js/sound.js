/* Sounds. Most are recordings in assets/sounds (from Pixabay, under the Pixabay Content License; listed in ASSETS.sounds
   and in DESIGN_NOTES.md). The candle going out is still made here in code with the browser's Web Audio. */

/* ---------- recordings ---------- */
/* Played with plain audio elements, so they also work when the game is opened straight from the file. Each is loaded
   once and copied to play, so two can overlap. The volumes even them out: the recordings came at very different levels. */
const SFX_CACHE={};
function sfx(name,vol){try{const base=SFX_CACHE[name]||(SFX_CACHE[name]=new Audio(ASSETS.sounds[name]));const a=base.cloneNode();a.volume=vol;a.play().catch(()=>{})}catch(e){}}
/* The shop's hand bell, rung to call the next customer: "Bell Ring" (Universfield). */
function playBell(){sfx('shopBell',.45)}
/* The silver desk bell on the altar, struck to make what is laid out: "Clear Bell Chime" (Universfield). */
function playAltarBell(){sfx('altarBell',1)}
/* Something new on the computer (an email, the night's reviews): "New Notification 012" (Universfield). */
function playNotify(){sfx('notify',.5)}
/* The till at closing, as the day's receipts come out: "cash drawer and receipt" (freesound_community). */
function playReceiptPrint(){sfx('receipt',.9)}
/* A customer comes in: the shop's old door creaks open and swings shut behind them. "Creaking Door 03" (Universfield),
   then "Close Door" (DRAGON-STUDIO) as the creak fades. */
function playDoorClose(){sfx('doorCreak',.6);setTimeout(()=>sfx('doorClose',.55),1150)}

/* ---------- made in code ---------- */
let audioCtx=null;
function audio(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch(e){return null}}
/* a burst of white noise, `sec` long */
function noiseBuffer(ctx,sec){const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*sec),ctx.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
/* noise through a band of sound that slides from `f0` to `f1` Hz, swelling to `vol` and fading out */
function breath(ctx,at,sec,f0,f1,q,vol,rise){const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
  src.buffer=noiseBuffer(ctx,sec);f.type='bandpass';f.Q.value=q;
  f.frequency.setValueAtTime(f0,at);f.frequency.exponentialRampToValueAtTime(f1,at+sec);
  g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+sec*rise);g.gain.exponentialRampToValueAtTime(0.0001,at+sec);
  src.connect(f).connect(g).connect(ctx.destination);src.start(at);src.stop(at+sec)}
/* A candle blown out: a soft whoosh of breath (휘이), then the little "fff" of the flame going out. */
function playCandleOut(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  breath(ctx,t,.75,500,1500,1.2,.22,.45);      /* the whoosh, rising */
  breath(ctx,t+.55,.28,2600,900,2.5,.12,.15)}  /* the flame snuffed: a short, falling puff */
