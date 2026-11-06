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
/* A customer comes in: the shop door swings shut behind them. A short creak of the hinge, a soft wooden thump, and the
   click of the latch. */
function playDoorClose(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  /* the hinge: a short, low creak (a buzzy tone wobbling in pitch, through a narrow band) */
  const c=ctx.createOscillator(),cb=ctx.createBiquadFilter(),cg=ctx.createGain(),w=ctx.createOscillator(),wg=ctx.createGain();
  c.type='sawtooth';c.frequency.setValueAtTime(240,t);c.frequency.linearRampToValueAtTime(170,t+.32);
  w.frequency.value=23;wg.gain.value=14;w.connect(wg).connect(c.frequency);
  cb.type='bandpass';cb.frequency.value=900;cb.Q.value=6;
  cg.gain.setValueAtTime(0.0001,t);cg.gain.exponentialRampToValueAtTime(.035,t+.08);cg.gain.exponentialRampToValueAtTime(0.0001,t+.34);
  c.connect(cb).connect(cg).connect(ctx.destination);c.start(t);w.start(t);c.stop(t+.36);w.stop(t+.36);
  /* the door meeting its frame: a low wooden thump */
  const th=t+.36,o=ctx.createOscillator(),og=ctx.createGain();o.type='sine';
  o.frequency.setValueAtTime(130,th);o.frequency.exponentialRampToValueAtTime(55,th+.18);
  og.gain.setValueAtTime(0.0001,th);og.gain.exponentialRampToValueAtTime(.35,th+.006);og.gain.exponentialRampToValueAtTime(0.0001,th+.25);
  o.connect(og).connect(ctx.destination);o.start(th);o.stop(th+.28);
  const n=ctx.createBufferSource(),nl=ctx.createBiquadFilter(),ng=ctx.createGain();n.buffer=noiseBuffer(ctx,.08);
  nl.type='lowpass';nl.frequency.value=700;ng.gain.setValueAtTime(.18,th);ng.gain.exponentialRampToValueAtTime(0.0001,th+.08);
  n.connect(nl).connect(ng).connect(ctx.destination);n.start(th);
  /* the latch: two small metal clicks */
  [th+.03,th+.075].forEach((at,i)=>{const k=ctx.createBufferSource(),kh=ctx.createBiquadFilter(),kg=ctx.createGain();k.buffer=noiseBuffer(ctx,.02);
    kh.type='bandpass';kh.frequency.value=3800-i*700;kh.Q.value=3;kg.gain.setValueAtTime(.16-i*.06,at);kg.gain.exponentialRampToValueAtTime(0.0001,at+.02);
    k.connect(kh).connect(kg).connect(ctx.destination);k.start(at)})}
/* Something new on the computer (an email, the night's reviews): the soft two-note "di-ring" of a notification, the second
   note higher. Round tones with a little sparkle on top. */
function playNotify(){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+.02;
  [[1318.5,0],[1975.5,.13]].forEach(([f,d])=>{const at=t+d;
    [[1,'triangle',.11,.6],[2,'sine',.025,.25]].forEach(([r,type,v,dec])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f*r;
      g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(v,at+.008);g.gain.exponentialRampToValueAtTime(0.0001,at+dec);
      o.connect(g).connect(ctx.destination);o.start(at);o.stop(at+dec+.05)})})}
