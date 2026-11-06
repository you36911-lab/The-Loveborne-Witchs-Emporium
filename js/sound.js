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
/* The silver desk bell on the altar: one bright "ding!" as its button is struck, higher than the shop bell and ringing
   on longer. A tiny click of the striker, then two tones a few Hz apart (they shimmer against each other) and a few
   fainter metal tones above them. */
function playAltarBell(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  const c=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),cg=ctx.createGain();c.buffer=noiseBuffer(ctx,.03);
  hp.type='highpass';hp.frequency.value=4000;cg.gain.setValueAtTime(.12,t);cg.gain.exponentialRampToValueAtTime(0.0001,t+.03);
  c.connect(hp).connect(cg).connect(ctx.destination);c.start(t);
  [[2350,.13,2.4],[2357,.09,2.2],[2350*2.32,.04,.9],[2350*4.25,.02,.4]].forEach(([f,v,dec])=>{
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.003);g.gain.exponentialRampToValueAtTime(0.0001,t+dec);
    o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+dec+.05)})}
/* The till printing the day's receipts: a few short bursts of the print head buzzing over the paper (a hum from the little
   motor under a rattle of ticks), one per stretch of slip, then the slip torn off. More receipts, a little longer. */
function playReceiptPrint(n){const ctx=audio();if(!ctx)return;let t=ctx.currentTime+.02;
  const bursts=Math.min(3+n,7);
  for(let i=0;i<bursts;i++){const len=.16+Math.random()*.06;
    /* the motor: a low buzzing hum */
    const o=ctx.createOscillator(),lp=ctx.createBiquadFilter(),og=ctx.createGain();o.type='square';o.frequency.value=180+Math.random()*20;
    lp.type='lowpass';lp.frequency.value=900;og.gain.setValueAtTime(0.0001,t);og.gain.exponentialRampToValueAtTime(.05,t+.01);
    og.gain.setValueAtTime(.05,t+len-.02);og.gain.exponentialRampToValueAtTime(0.0001,t+len);
    o.connect(lp).connect(og).connect(ctx.destination);o.start(t);o.stop(t+len+.02);
    /* the print head: a fast rattle of ticks (noise, pulsed many times a second) */
    const s=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),sg=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
    s.buffer=noiseBuffer(ctx,len);bp.type='bandpass';bp.frequency.value=3200;bp.Q.value=1.4;
    sg.gain.value=.05;lfo.type='square';lfo.frequency.value=55;lg.gain.value=.05;lfo.connect(lg).connect(sg.gain);
    s.connect(bp).connect(sg).connect(ctx.destination);s.start(t);lfo.start(t);s.stop(t+len);lfo.stop(t+len);
    t+=len+.06+Math.random()*.04}
  breath(ctx,t+.12,.16,1800,5000,.9,.16,.3)}  /* the slip torn off: a quick rising rip */
/* A customer comes in: the shop door swings shut behind them, "kkiik... tak". The hinge creaks (a thin, rising and
   falling squeak that judders as the hinge sticks and slips), then the door meets its frame with a short, crisp knock and
   the latch clicks. */
function playDoorClose(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02,cr=.55;
  /* the creak: a buzzy tone through two narrow bands, its pitch swinging up then down, juddered by a fast pulse */
  const o=ctx.createOscillator(),b1=ctx.createBiquadFilter(),b2=ctx.createBiquadFilter(),mix=ctx.createGain(),j=ctx.createGain(),
    lfo=ctx.createOscillator(),lg=ctx.createGain(),env=ctx.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(420,t);o.frequency.linearRampToValueAtTime(560,t+cr*.45);o.frequency.linearRampToValueAtTime(470,t+cr);
  b1.type='bandpass';b1.frequency.value=1400;b1.Q.value=5;b2.type='bandpass';b2.frequency.value=2600;b2.Q.value=6;
  lfo.type='square';lfo.frequency.setValueAtTime(32,t);lfo.frequency.linearRampToValueAtTime(22,t+cr);lg.gain.value=.5;j.gain.value=.5;
  lfo.connect(lg).connect(j.gain);
  env.gain.setValueAtTime(0.0001,t);env.gain.exponentialRampToValueAtTime(.07,t+.07);env.gain.setValueAtTime(.07,t+cr*.7);env.gain.exponentialRampToValueAtTime(0.0001,t+cr);
  o.connect(b1).connect(mix);o.connect(b2).connect(mix);mix.connect(j).connect(env).connect(ctx.destination);
  o.start(t);lfo.start(t);o.stop(t+cr+.02);lfo.stop(t+cr+.02);
  /* the "tak": a crisp wooden knock (a short bright burst and a quick woody tone), with only a little weight under it */
  const k=t+cr+.03;
  const n=ctx.createBufferSource(),nb=ctx.createBiquadFilter(),ng=ctx.createGain();n.buffer=noiseBuffer(ctx,.05);
  nb.type='bandpass';nb.frequency.value=1700;nb.Q.value=1.3;ng.gain.setValueAtTime(.32,k);ng.gain.exponentialRampToValueAtTime(0.0001,k+.045);
  n.connect(nb).connect(ng).connect(ctx.destination);n.start(k);
  const w=ctx.createOscillator(),wg=ctx.createGain();w.type='triangle';w.frequency.setValueAtTime(520,k);w.frequency.exponentialRampToValueAtTime(300,k+.06);
  wg.gain.setValueAtTime(0.0001,k);wg.gain.exponentialRampToValueAtTime(.22,k+.003);wg.gain.exponentialRampToValueAtTime(0.0001,k+.08);
  w.connect(wg).connect(ctx.destination);w.start(k);w.stop(k+.1);
  const lo=ctx.createOscillator(),log=ctx.createGain();lo.frequency.setValueAtTime(110,k);lo.frequency.exponentialRampToValueAtTime(70,k+.08);
  log.gain.setValueAtTime(0.0001,k);log.gain.exponentialRampToValueAtTime(.09,k+.004);log.gain.exponentialRampToValueAtTime(0.0001,k+.1);
  lo.connect(log).connect(ctx.destination);lo.start(k);lo.stop(k+.12);
  /* the latch: one small metal click just after */
  const l=k+.05,c=ctx.createBufferSource(),cb=ctx.createBiquadFilter(),cg=ctx.createGain();c.buffer=noiseBuffer(ctx,.015);
  cb.type='bandpass';cb.frequency.value=4200;cb.Q.value=4;cg.gain.setValueAtTime(.12,l);cg.gain.exponentialRampToValueAtTime(0.0001,l+.015);
  c.connect(cb).connect(cg).connect(ctx.destination);c.start(l)}
/* Something new on the computer (an email, the night's reviews): a bright, glassy "ti-ring!". A short high "ti", then a
   higher "ring" that rings out, made of two tones a few Hz apart so it shimmers, with a faint sparkle above. */
function chimeNote(ctx,at,f,dur,vol,shimmer){
  [[1,1,dur],[2,.28,dur*.45],[3,.08,.12]].forEach(([r,v,dec])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*r;
    g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol*v,at+.004);g.gain.exponentialRampToValueAtTime(0.0001,at+dec);
    o.connect(g).connect(ctx.destination);o.start(at);o.stop(at+dec+.05)});
  if(shimmer){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f+shimmer;
    g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol*.45,at+.006);g.gain.exponentialRampToValueAtTime(0.0001,at+dur*.9);
    o.connect(g).connect(ctx.destination);o.start(at);o.stop(at+dur)}}
function playNotify(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  chimeNote(ctx,t,1568,.32,.11,0);           /* ti (G6), short */
  chimeNote(ctx,t+.1,2093,1.1,.11,4)}         /* ring (C7), ringing out */
