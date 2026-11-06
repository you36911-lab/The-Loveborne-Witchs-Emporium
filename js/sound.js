/* Sounds. There are no sound files yet: each sound is made here with the browser's Web Audio, from soft noise shaped
   through a filter. A real recording can replace one later (new Audio('assets/sounds/....mp3').play()). */
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
/* The shop's silver hand bell: a few bell-like tones (not in tune with each other, as a real bell's aren't) that ring
   out and fade, the high ones fastest, and a soft second ring as the bell swings back. */
function bellTone(ctx,at,freq,vol){[[1,1,1.6],[2.76,.45,.9],[5.4,.22,.5],[8.93,.1,.3]].forEach(([r,v,dec])=>{
  const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=freq*r;
  g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol*v,at+.004);g.gain.exponentialRampToValueAtTime(0.0001,at+dec);
  o.connect(g).connect(ctx.destination);o.start(at);o.stop(at+dec+.05)})}
function playBell(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  bellTone(ctx,t,1320,.16);bellTone(ctx,t+.2,1324,.08)}
