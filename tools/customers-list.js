/* Writes CUSTOMERS.md: every walk-in and advice visitor, in order, from js/data/story.js (node tools/customers-list.js).
   No answers: what each one comes for is left out. Ethnicity is recorded for customers written from week three on. */
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');global.window=global;
for(const f of ['js/config.js','js/data/game-data.js','js/data/story.js'])eval(fs.readFileSync(path.join(root,f),'utf8').replace(/^(const|let) /mg,'var '));
const REG=new Set(['Hester','Edmund Thorne','Dottie Plum','Rosalind Larkin','Marigold "Goldie" Ashby','Morwenna Hale','Noor Haddad','Felix Marlow','Ivy Delacroix','Sam Okafor']);
const H=['Sunrise','Noon','Twilight','Nightfall'];
const W=X.visits.filter(v=>!REG.has(v.who)).sort((a,b)=>a.day-b.day||H.indexOf(a.hour)-H.indexOf(b.hour));
const pic=v=>ASSETS.characters[v.pic||v.who]?'✅':'—';
const esc=s=>String(s||'').replace(/\|/g,'\|');
const feel=v=>{const a=X.auras[v.aura];return a?a[1].split(':').slice(1).join(':').trim():v.aura};
const WORD=['one','two','three','four','five','six','seven','eight','nine','ten','eleven'];
let o='# Walk-in customers (extras)\n\nEvery walk-in and advice visitor in the game, in order (written by `node tools/customers-list.js` from `js/data/story.js`, where each has an "about" line the game does not show; regulars are not listed).\n**No answers here**: what each one needs is left out, so the puzzles can still be played.\n**Feeling** is what they come in with (the crystal ball shows it as their aura). **Ethnicity** is recorded for customers written from week three on. **Picture** ✅ = in the game, — = still to draw.\n\n';
o+='**'+W.length+' walk-ins, '+W.filter(v=>!ASSETS.characters[v.pic||v.who]).length+' still without a picture.**\n';
const weeks=[...new Set(W.map(v=>Math.ceil(v.day/7)))];
for(const wk of weeks){o+='\n## Week '+(WORD[wk-1]||wk)+'\n\n| Day | Hour | Receipt name | Ethnicity | Visit | Story | Feeling | Look and manner (cue) | Picture |\n|---|---|---|---|---|---|---|---|---|\n';
  W.filter(v=>Math.ceil(v.day/7)===wk).forEach(v=>{o+='| '+v.day+' | '+v.hour+' | '+esc(X.names[v.who])+' | '+esc(v.ethnicity)+' | '+(v.kind==='advice'?'Advice':'Order')+' | '+esc(v.about)+' | '+esc(feel(v))+' | '+esc(v.cue)+' | '+pic(v)+' |\n'})}
fs.writeFileSync(path.join(root,'CUSTOMERS.md'),o);console.log('CUSTOMERS.md:',W.length,'walk-ins');
