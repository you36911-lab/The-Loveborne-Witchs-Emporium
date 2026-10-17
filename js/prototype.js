/* Prototype only: jump to any week, day and hour, or straight to a customer, to look at it.
   Turn it off with PROTOTYPE_TOOLS in config.js. Jumping keeps the rest of the save as it is. */
const WEEKS=Math.ceil(D.cal.length/7);
const visitLabel=v=>`Day ${v.day} ${v.hour}: ${v.who}`;
function protoDays(w){const out=[];for(let d=(w-1)*7+1;d<=Math.min(w*7,D.cal.length);d++){const T=D.cal[d-1];
  out.push(`<option value="${d}">Day ${d} · ${esc(T.weekday)}${T.sabbat?' · '+esc(T.sabbat):''}${d>LAST_PLAYABLE_DAY?' (no customers yet)':''}</option>`)}return out.join('')}
/* The menus start from where the game is now. */
function fillProto(){const w=Math.ceil(S.day/7);
  $('#protoWeek').innerHTML=Array.from({length:WEEKS},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join('');$('#protoWeek').value=w;
  $('#protoDay').innerHTML=protoDays(w);$('#protoDay').value=S.day;
  $('#protoHour').innerHTML=HOURS.map((h,i)=>`<option value="${i}">${h}</option>`).join('');$('#protoHour').value=S.h;
  $('#protoWho').innerHTML='<option value="">Customer (optional)</option>'+X.visits.map((v,i)=>`<option value="${i}">${esc(visitLabel(v))}</option>`).join('')}
/* Whoever is booked for that hour comes in again, even if you have already served them. */
function jumpTo(day,h){clearTimeout(autoT);
  S.day=day;S.h=h;S.queue=null;S.activeNow=null;S.result=null;
  X.visits.forEach(v=>{if(v.day===day&&v.hour===HOURS[h])delete S.seen[v.day+'-'+v.hour+'-'+v.who]});
  $('#dayEnd').classList.remove('open');dawnUntil=0;$('#dayCard').classList.remove('on');
  log('Jumped here (prototype).');render();fillProto()}
if(PROTOTYPE_TOOLS){$('#proto').hidden=false;fillProto();
  $('#protoWeek').onchange=e=>{$('#protoDay').innerHTML=protoDays(+e.target.value)};
  $('#protoWho').onchange=e=>{const v=X.visits[e.target.value];if(!v)return;
    $('#protoWeek').value=Math.ceil(v.day/7);$('#protoDay').innerHTML=protoDays(Math.ceil(v.day/7));$('#protoDay').value=v.day;$('#protoHour').value=HOURS.indexOf(v.hour)};
  $('#protoGo').onclick=()=>jumpTo(+$('#protoDay').value,+$('#protoHour').value);
  $('#protoDawn').onclick=()=>{jumpTo(+$('#protoDay').value,0);showDawn()}}
