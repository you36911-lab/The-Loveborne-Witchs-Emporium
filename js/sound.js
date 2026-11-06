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
/* A customer comes in: the shop's old door swings shut behind them, "kkiiiiik... tak". The hinge lets out a long,
   drawn-out squeal, like a chair dragged across a wooden floor, then the door meets its frame with a weighty wooden
   knock and the latch clicks. */
function playDoorClose(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02,cr=1.25;
  /* the squeal: a reedy tone whose pitch slides up and settles, wavering a little, roughened by fast stick-slip pulses
     (the grain of wood dragging on wood), sung through two narrow resonances; a breath of scraping friction under it */
  const o=ctx.createOscillator(),vib=ctx.createOscillator(),vg=ctx.createGain(),b1=ctx.createBiquadFilter(),b2=ctx.createBiquadFilter(),
    mix=ctx.createGain(),j=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain(),env=ctx.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(390,t);o.frequency.linearRampToValueAtTime(540,t+cr*.35);o.frequency.linearRampToValueAtTime(500,t+cr*.7);o.frequency.linearRampToValueAtTime(440,t+cr);
  vib.frequency.value=5.5;vg.gain.value=14;vib.connect(vg).connect(o.frequency);
  b1.type='bandpass';b1.frequency.value=1250;b1.Q.value=7;b2.type='bandpass';b2.frequency.value=2300;b2.Q.value=9;
  lfo.type='square';lfo.frequency.setValueAtTime(62,t);lfo.frequency.linearRampToValueAtTime(40,t+cr);lg.gain.value=.35;j.gain.value=.65;
  lfo.connect(lg).connect(j.gain);
  env.gain.setValueAtTime(0.0001,t);env.gain.exponentialRampToValueAtTime(.8,t+.25);env.gain.setValueAtTime(.8,t+cr*.8);env.gain.exponentialRampToValueAtTime(0.0001,t+cr);
  o.connect(b1).connect(mix);o.connect(b2).connect(mix);mix.connect(j).connect(env).connect(ctx.destination);
  o.start(t);vib.start(t);lfo.start(t);o.stop(t+cr+.02);vib.stop(t+cr+.02);lfo.stop(t+cr+.02);
  const f=ctx.createBufferSource(),fb=ctx.createBiquadFilter(),fg=ctx.createGain();f.buffer=noiseBuffer(ctx,cr);fb.type='bandpass';fb.frequency.value=1600;fb.Q.value=1.5;
  fg.gain.setValueAtTime(0.0001,t);fg.gain.exponentialRampToValueAtTime(.05,t+.25);fg.gain.exponentialRampToValueAtTime(0.0001,t+cr);
  f.connect(fb).connect(fg).connect(ctx.destination);f.start(t);f.stop(t+cr);
  /* the "tak": the heavy door meeting its frame, a woody knock with some weight under it */
  const k=t+cr+.05;
  const n=ctx.createBufferSource(),nb=ctx.createBiquadFilter(),ng=ctx.createGain();n.buffer=noiseBuffer(ctx,.05);
  nb.type='bandpass';nb.frequency.value=950;nb.Q.value=1.1;ng.gain.setValueAtTime(.3,k);ng.gain.exponentialRampToValueAtTime(0.0001,k+.045);
  n.connect(nb).connect(ng).connect(ctx.destination);n.start(k);
  const w=ctx.createOscillator(),wg=ctx.createGain();w.type='triangle';w.frequency.setValueAtTime(300,k);w.frequency.exponentialRampToValueAtTime(170,k+.08);
  wg.gain.setValueAtTime(0.0001,k);wg.gain.exponentialRampToValueAtTime(.22,k+.003);wg.gain.exponentialRampToValueAtTime(0.0001,k+.08);
  w.connect(wg).connect(ctx.destination);w.start(k);w.stop(k+.1);
  const lo=ctx.createOscillator(),log=ctx.createGain();lo.frequency.setValueAtTime(85,k);lo.frequency.exponentialRampToValueAtTime(55,k+.12);
  log.gain.setValueAtTime(0.0001,k);log.gain.exponentialRampToValueAtTime(.2,k+.005);log.gain.exponentialRampToValueAtTime(0.0001,k+.18);
  lo.connect(log).connect(ctx.destination);lo.start(k);lo.stop(k+.12);
  /* the latch: one small metal click just after */
  const l=k+.05,c=ctx.createBufferSource(),cb=ctx.createBiquadFilter(),cg=ctx.createGain();c.buffer=noiseBuffer(ctx,.015);
  cb.type='bandpass';cb.frequency.value=4200;cb.Q.value=4;cg.gain.setValueAtTime(.12,l);cg.gain.exponentialRampToValueAtTime(0.0001,l+.015);
  c.connect(cb).connect(cg).connect(ctx.destination);c.start(l)}
/* Something new on the computer (an email, the night's reviews): a soft, clear "ti-ring", like a small glass bell.
   Two pure tones a fifth apart (C6, then G6), each with only a whisper of its octave above, a gentle start rather than a
   click, and a lowpass to take off any edge. The second rings a little longer, with a faint twin a couple of Hz off so it
   breathes. */
function chimeNote(ctx,at,f,dur,vol,out){
  [[1,1,dur],[2,.1,dur*.35]].forEach(([r,v,dec])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*r;
    g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol*v,at+.015);g.gain.exponentialRampToValueAtTime(0.0001,at+dec);
    o.connect(g).connect(out);o.start(at);o.stop(at+dec+.05)})}
function playNotify(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3500;lp.Q.value=.5;lp.connect(ctx.destination);
  chimeNote(ctx,t,1046.5,.55,.09,lp);         /* ti (C6) */
  chimeNote(ctx,t+.14,1568,1.3,.085,lp);      /* ring (G6), ringing out */
  chimeNote(ctx,t+.14,1570,1.1,.03,lp)}       /* its faint twin */
