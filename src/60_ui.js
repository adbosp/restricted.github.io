/* =====================================================================
   CRESTMOOR · player, input, camera, UI, main loop
   ===================================================================== */
const ETHAN={skin:0xf0c49a,shirt:0x3a4a5e,pants:0x34557a,hair:0x6a3a1e,style:'messy'};
const P={rig:makePerson(ETHAN),x:S.pos[0],z:S.pos[1],yaw:Math.PI,face:0,crouch:false,b:null,room:null};
function tp(x,z){P.x=x;P.z=z;}
const K={};

/* ---------- collision ---------- */
const PR=.32;
function doorBlocks(d){if(!d.lock||lockOk(d.lock))return false;if(d.entr&&P.b===d.b)return false;if(d.room&&P.room===d.room)return false;return true;}
let bumpT=0;
function blocked(x,z){if(x<WX0+1||x>WX1-1||z<WZ0+1||z>WZ1-1)return true;
 for(let gx=Math.floor((x-1)/GS);gx<=Math.floor((x+1)/GS);gx++)for(let gz=Math.floor((z-1)/GS);gz<=Math.floor((z+1)/GS);gz++){const L=GRID[gx+','+gz];if(L)for(const r of L)if(circleHit(x,z,PR,r))return true;}
 for(const c of CIRC)if((x-c.x)**2+(z-c.z)**2<(c.r+PR)**2)return true;
 for(const d of DOORS)if(circleHit(x,z,PR,d.box)&&doorBlocks(d)){if(bumpT<=0){bumpT=2.5;toast((d.room?d.room.name:BLD[d.b].name)+': khóa · '+lockWhy(d.lock));}return true;}
 for(const c of CARS){for(const k of[-.55,0,.55]){const cx=c.x+c.dx*c.L*k*1.4,cz=c.z+c.dz*c.L*k*1.4;if((x-cx)**2+(z-cz)**2<(1.15+PR)**2)return true;}}
 return false;}
function unstuck(){for(let r=.5;r<12;r+=.5)for(let a=0;a<16;a++){const x=P.x+Math.cos(a/16*Math.PI*2)*r,z=P.z+Math.sin(a/16*Math.PI*2)*r;if(!blocked(x,z)){tp(x,z);toast('Đã đưa bạn ra chỗ thoáng.');return;}}tp(OUT.busstop.node[0],OUT.busstop.node[1]);}

/* ---------- who is watching ---------- */
function zoneNow(){if(P.room){const r=P.room;if(r.perm&&S.flags[r.perm])return'public';if(r.lobby&&BLD[r.b].home)return'public';return r.zone;}
 if(P.x<-103.4&&P.z>-38.5&&P.z<-11.5)return'secure';return'public';}
function isAuth(n){if(n.police)return true;return !!(P.b&&BLD[P.b].auth&&BLD[P.b].auth.includes(n.id));}
function canSee(n){if(n.away||!isAuth(n))return false;const nb=bldAt(n.x,n.z);if(nb!==P.b)return false;
 if(P.b){const rn=roomAt(n.x,n.z);if(rn!==P.room)return false;}
 const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz),range=P.b?(P.crouch?6:11):(P.crouch?8:15);if(d>range)return false;
 if(d>1.6&&(dx*Math.sin(n.face)+dz*Math.cos(n.face))/d<.25)return false;
 if(!P.b){for(const id in BLD){const b=BLD[id];if(segRect(n.x,n.z,P.x,P.z,b,0))return false;}}
 return true;}
function watchers(){return NPCS.filter(canSee);}

/* ---------- input ---------- */
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(e.key==='F5'||e.key==='F9')e.preventDefault();
 if(!sc.hidden){if(k==='e'||k===' '||k==='enter'){e.preventDefault();nextLine();}return;}
 if(!modal.hidden){if(k==='escape')closeModal();return;}
 K[k]=1;if(k==='e')interact();if(k==='c')P.crouch=!P.crouch;if(k==='i')inv();if(k==='m')showMap();if(k==='j')questLog();if(k==='l')library();if(k==='p')pictures();if(k==='t')waitHalf();
 if(e.key==='F5')save();if(e.key==='F9')load();});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);
addEventListener('blur',()=>{for(const k in K)K[k]=0;});
let zoom=1,camPitch=.72;
// drag to orbit (mouse or one finger on the 3D view), wheel / pinch to zoom
{const pts=new Map();let pinch0=0,z0=1;
 cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId);}catch(_){}if(pts.size===2){const[a,b]=[...pts.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);z0=zoom;}});
 cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;
  if(pts.size===2){p.x=e.clientX;p.y=e.clientY;const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch0)zoom=clamp(z0*pinch0/d,.45,1.8);return;}
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;P.yaw-=dx*.006;camPitch=clamp(camPitch+dy*.004,.25,1.25);});
 const up=e=>{pts.delete(e.pointerId);pinch0=0;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{zoom=clamp(zoom*(e.deltaY>0?1.1:.9),.45,1.8);e.preventDefault();},{passive:false});
 cv.addEventListener('contextmenu',e=>e.preventDefault());}
// virtual joystick (touch)
const JOY={x:0,y:0,on:false};
{const base=document.getElementById('joy'),knob=document.getElementById('knob');let id=null,cx=0,cy=0;
 const set=(x,y)=>{const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy),m=46,k=d>m?m/d:1;knob.style.transform=`translate(${dx*k}px,${dy*k}px)`;JOY.x=dx*k/m;JOY.y=dy*k/m;JOY.on=true;};
 base.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;try{base.setPointerCapture(e.pointerId);}catch(_){}const r=base.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;set(e.clientX,e.clientY);});
 base.addEventListener('pointermove',e=>{if(e.pointerId===id)set(e.clientX,e.clientY);});
 const end=e=>{if(e.pointerId!==id)return;id=null;JOY.x=JOY.y=0;JOY.on=false;knob.style.transform='';};base.addEventListener('pointerup',end);base.addEventListener('pointercancel',end);
 document.getElementById('aE').addEventListener('pointerdown',e=>{e.preventDefault();interact();});
 document.getElementById('aC').addEventListener('pointerdown',e=>{e.preventDefault();P.crouch=!P.crouch;document.getElementById('aC').classList.toggle('on',P.crouch);});}

/* ---------- modal helpers ---------- */
const modal=document.getElementById('modal'),mbox=document.getElementById('mbox'),sc=document.getElementById('scene');
let paused=false;
function openModal(html){mbox.innerHTML=html;modal.hidden=false;paused=true;}
function closeModal(){mbox.classList.remove('wide');modal.hidden=true;paused=!sc.hidden;}
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
function optButtons(o,opts){opts.forEach(([t,f,cls])=>{const b=document.createElement('button');b.textContent=t;if(cls)b.className=cls;b.onclick=()=>{closeModal();f&&f();};o.appendChild(b);});}
function pick(title,text,opts){openModal(`<div class="who">${title}</div><p>${text}</p><div class="opts"></div>`);const o=mbox.querySelector('.opts');optButtons(o,opts);o.firstChild&&o.firstChild.focus();}
let sq=[],sdone=null;
function scenePlay(who,lines,done){if(!modal.hidden)closeModal();sq=lines.slice();sdone=done||null;sWho=who;document.getElementById('sw').textContent=who;sc.hidden=false;paused=true;nextLine();}
let sWho='';
function nextLine(){if(!sq.length){sc.hidden=true;paused=!modal.hidden;const d=sdone;sdone=null;d&&d();return;}const ln=sq.shift(),pv=document.getElementById('spv'),sw=document.getElementById('sw');
 if(Array.isArray(ln)){const[id,t]=ln;const n=npc(id);sw.textContent=n?n.name:'Ethan';pv.hidden=false;const g=pv.getContext('2d');g.clearRect(0,0,144,144);g.drawImage(id==='ethan'?portrait(ETHAN,144,'ethan'):portrait(npcLook(n),144,id),0,0,144,144);document.getElementById('st').textContent=t;}
 else{sw.textContent=sWho;pv.hidden=true;document.getElementById('st').textContent=ln;}}
document.getElementById('sn').onclick=nextLine;
const toastsEl=document.getElementById('toasts');
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;toastsEl.appendChild(d);setTimeout(()=>d.remove(),4500);while(toastsEl.children.length>3)toastsEl.firstChild.remove();}

/* ---------- portraits ---------- */
const PCACHE={};const hexC=c=>'#'+c.toString(16).padStart(6,'0');
function portrait(L,size=160,key){const k=(key||JSON.stringify(L))+size;if(PCACHE[k])return PCACHE[k];const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),s=size/160;
 const bg=g.createLinearGradient(0,0,0,size);bg.addColorStop(0,'#2b3445');bg.addColorStop(1,'#151a23');g.fillStyle=bg;g.fillRect(0,0,size,size);g.save();g.scale(s,s);
 g.fillStyle=hexC(L.shirt);g.beginPath();g.moveTo(22,160);g.quadraticCurveTo(30,112,80,108);g.quadraticCurveTo(130,112,138,160);g.fill();g.fillStyle=hexC(L.skin);g.fillRect(71,92,18,20);
 g.beginPath();g.ellipse(80,72,28,33,0,0,7);g.fill();g.fillStyle=hexC(L.hair);g.beginPath();g.ellipse(80,50,30,17,0,Math.PI,0);g.fill();
 g.fillStyle='#1a1a1a';[68,92].forEach(x=>{g.beginPath();g.arc(x,72,2.6,0,7);g.fill();});g.strokeStyle='#8a3a3a';g.lineWidth=2.5;g.beginPath();g.arc(80,86,6,.2,Math.PI-.2);g.stroke();g.restore();return PCACHE[k]=c;}
function cv2(src,w){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;c.getContext('2d').drawImage(src,0,0);if(w){c.style.width=w;c.style.height=w;}return c;}
const npcLook=n=>Object.assign({fem:n.fem},n.look);
function relStatus(v){return v<=-20?['Thù ghét','var(--danger)']:v<0?['Khó chịu','#d86a3a']:v<15?['Người quen','var(--dim)']:v<35?['Thân thiện','var(--ok)']:v<60?['Thân thiết','var(--accent)']:['Say nắng','var(--accent2)'];}

/* ---------- talking ---------- */
function talk(n){const[txt,opts]=dlg[n.id]();n.face=Math.atan2(P.x-n.x,P.z-n.z);n.talkT=6;const v=S.rel[n.id]||0,[st,col]=relStatus(v);
 openModal(`<div class="talk"><div id="tp"></div><div><div class="who">${n.job}</div><h2>${n.name} <small style="font:600 12px var(--mono);color:var(--dim)">${n.age} tuổi</small></h2>
 <div class="hearts"><span style="color:${col}">${st}</span><div class="hb"><i style="width:${clamp(v,0,100)}%"></i></div><span>${v}</span></div></div></div>
 <p style="margin-top:12px">${txt}</p><div class="opts" id="dopts"></div>`);
 mbox.querySelector('#tp').appendChild(cv2(portrait(npcLook(n),192,n.id),'96px'));const o=mbox.querySelector('#dopts');
 const extra=[];
 if(S.chatDay[n.id]!==day())extra.push(['Trò chuyện vài câu (+thiện cảm)',()=>{S.chatDay[n.id]=day();R(n.id,3);toast(`${n.name} vui vẻ trò chuyện với bạn. Thiện cảm +3`);},'alt']);
 const gifts=GIFTS.filter(has);if(gifts.length&&S.giftDay[n.id]!==day())extra.push(['Tặng quà',()=>giftMenu(n,gifts),'alt']);
 if(romOk(n.id)){const v2=S.rel[n.id]||0;
  if(v2>=40&&!S.flags.lover&&S.flags['date_'+n.id]!==day()&&inHours(16,23))extra.push(['Rủ đi chơi tối nay ♥',()=>{S.flags['date_'+n.id]=day();S.flags['dated_'+n.id]=1;R(n.id,10);passTime(90);scenePlay('Hẹn hò · '+n.name,[ROM[n.id].date,'Thiện cảm +10.']);},'alt']);
  if(v2>=70&&!S.flags.lover&&S.flags['dated_'+n.id])extra.push(['Nói thật lòng mình ♥',()=>{S.flags.lover=n.id;R(n.id,10);scenePlay(n.name,[ROM[n.id].confess,'(Màn hình tối dần.)','Hai người bắt đầu hẹn hò.']);},'alt']);}
 extra.push(['Xem hồ sơ nhân vật',()=>library(n.id),'alt']);
 optButtons(o,opts.slice(0,-1).concat(extra).concat([opts[opts.length-1]]));o.firstChild&&o.firstChild.focus();}
function giftMenu(n,gifts){pick('Tặng quà cho '+n.name,'Chọn món quà:',gifts.map(g=>[ITEMS[g].n,()=>{const[lk,dl]=LIKES[n.id]||[[],[]];take(g);S.giftDay[n.id]=day();let d=3,msg='nhận quà, lịch sự cảm ơn.';
 if(lk.includes(g)){d=10;msg='mắt sáng lên. Đúng thứ họ thích!';}else if(dl.includes(g)){d=-6;msg='nhăn mặt. Họ không thích thứ này.';}R(n.id,d);emote(n,d>0?'♥':'!',4);toast(`${n.name} ${msg} Thiện cảm ${d>0?'+':''}${d}`);}]).concat([['Thôi']]));}

/* ---------- character codex ---------- */
const CODEX={
 sara:'Góa phụ 40 tuổi, chủ căn nhà gỗ trắng số 14. Cứng rắn nhưng mệt mỏi. Chồng bà, Mark, chết trong một vụ tai nạn xe hơi mà cảnh sát chưa bao giờ làm rõ.',
 rossie:'Con gái Sara, 19 tuổi, sinh viên năm ba. Cọc cằn, lười biếng, thích đi chơi đêm. Có vẻ biết về tình hình tài chính nhà mình nhiều hơn mẹ cô tưởng.',
 may:'Hàng xóm nhà bên, 42 tuổi. Ghét Ethan từ ngày đầu, hay mách Sara. Chồng bà, Hert, thường đi công tác xa.',
 dave:'Thị trưởng Crestmoor, 58 tuổi. Nụ cười tranh cử luôn bật sẵn. Người ta đồn ông có quan hệ với những người không nên có quan hệ.',
 melania:'Vợ Thị trưởng, 55 tuổi. Quyền lực, thích kiểm soát. Nhiều người nói bà mới là người quyết định trong nhà Keller.',
 jeanie:'MC kênh tin tức KCRM-TV, 37 tuổi. Cá tính, hay phá luật, chuyên đào bới bê bối của trường đại học.',
 bancroft:'Hiệu trưởng Đại học Crestmoor, 44 tuổi. Khó tính, thích kiểm soát, nhưng công bằng. Ghét Jeanie Blaine hơn bất kỳ ai.',
 laura:'Giáo viên Hóa học, 35 tuổi. Cấp dưới trung thành của Hiệu trưởng Bancroft, sống theo quy tắc.',
 maria:'Nữ doanh nhân, 39 tuổi, cổ đông lớn nhất của trường. Lịch sự nhưng khó đoán. Con gái bà, Diana, đang đi du lịch dài hạn.',
 chloe:'Bạn thân của Sara, 42 tuổi. Liên tục khuyên Sara đuổi người thuê nhà đi.',
 morgan:'CEO Ngân hàng Pryce, 62 tuổi. Gần như kiểm soát cả thị trấn qua những khoản vay.',
 lucy:'Bạn cùng lớp, 19 tuổi. Dễ thương, hòa đồng, nhưng luôn giữ một khoảng cách.',
 lily:'Bạn cùng lớp, 18 tuổi. Hay coi thường và trêu chọc người mới.',
 max:'Bạn cùng lớp, 19 tuổi. Cao to, thích bắt nạt, luôn đi cùng Lily.',
 evan:'Bạn cùng lớp, 18 tuổi. Tỏ ra tốt bụng, lúc nào cũng muốn giúp đỡ. Hỏi rất nhiều câu.',
 natasha:'Cảnh sát tuần tra, 27 tuổi. Cá tính, cứng rắn, không ngại va chạm.',
 lynda:'Đại úy cảnh sát, 38 tuổi. Đang điều tra băng Red Mafia. Hơi chậm, nhưng kiên trì.',
 marcus:'Thám tử tự do, 25 tuổi. Không thuộc phe nào. Có thể là đồng minh, cũng có thể là mối nguy.',
 paul:'Trung gian chợ đen, 25 tuổi. Kiếm được hầu như mọi thứ, với giá không rẻ.',
 williams:'Người đàn ông mặc đồ đen ở quán Red Lantern. Ai trong thị trấn cũng biết tên, nhưng không ai muốn nói to.'};
function library(sel){const list=NPCS;sel=sel||library.last||list[0].id;library.last=sel;const n=npc(sel),v=S.rel[n.id]||0,[st,col]=relStatus(v),[lk,dl]=LIKES[n.id]||[[],[]];
 const chip=(x,cls)=>`<span class="chip ${cls||''}">${ITEMS[x]?ITEMS[x].n:x}</span>`;const placeName=p=>p==='away'?'Ngoài thị trấn':p==='@patrol'?'Tuần tra Main St':OUT[p]?OUT[p].name:BLD[p]?BLD[p].name:RM[p]?RM[p].name:p;
 const sched=schedRows(n).map(e=>`${hm(e[0])} ${placeName(e[1])}`).join(' → ');const w=null;
 openModal(`<div class="who">Nhân vật · ${list.length} người ở Crestmoor</div><div class="lib"><div class="list" id="ll"></div>
 <div class="page"><div class="head"><div id="lp"></div><div><h2>${n.name}</h2><div style="color:var(--dim)">${n.job} · ${n.age} tuổi</div>
  <div class="sec"><span class="status" style="background:${col}">${st}</span>${w?` <span class="chip ${w[2]()?'':'lock'}">${w[2]()?'Sẽ làm chứng':'Chưa sẵn sàng làm chứng'}</span>`:''}${romOk(n.id)?' <span class="chip" style="background:#ffd6e8;color:#8a1d4a">♥ có thể hẹn hò</span>':''}</div>
  <div class="hearts" style="margin-top:8px"><span>Thiện cảm</span><div class="hb"><i style="width:${clamp(v,0,100)}%"></i></div><span>${v}/100</span></div></div></div>
 <div class="sec"><h4>Câu chuyện</h4><div>${CODEX[n.id]||''}</div></div>${S.note.people[n.id]?`<div class="sec"><h4>Ethan ghi chú</h4><div>${S.note.people[n.id]}</div></div>`:''}
 <div class="sec"><h4>Thích</h4><div class="chips">${lk.map(x=>chip(x)).join('')||'<span class="chip lock">Không rõ</span>'}</div></div>
 <div class="sec"><h4>Không thích</h4><div class="chips">${dl.map(x=>chip(x,'no')).join('')||'<span class="chip lock">Không rõ</span>'}</div></div>
 <div class="sec"><h4>Lịch hôm nay</h4><div style="color:var(--dim);font-size:12px">${sched}</div></div>
 </div></div><div class="opts"><button id="xc">Đóng</button></div>`);
 mbox.classList.add('wide');mbox.querySelector('#lp').appendChild(cv2(portrait(npcLook(n),280,n.id),'140px'));
 const ll=mbox.querySelector('#ll');list.forEach(m=>{const b=document.createElement('button');b.className='row'+(m.id===n.id?' sel':'');const[s2,c2]=relStatus(S.rel[m.id]||0);
  b.appendChild(cv2(portrait(npcLook(m),80,m.id),'40px'));const d=document.createElement('div');d.innerHTML=`<b>${m.name}</b><small style="color:${c2}">${s2} · ${S.rel[m.id]||0}</small>`;b.appendChild(d);b.onclick=()=>library(m.id);ll.appendChild(b);});
 document.getElementById('xc').onclick=closeModal;}

/* ---------- pictures ---------- */
const PICS=[
 {f:()=>S.c1>=1,t:'Ngày dọn vào',d:'Căn nhà gỗ trắng số 14 và một người phụ nữ cầm khăn lau bát.',bg:['#c9b48e','#6a5a44'],who:['sara']},
 {f:()=>S.c1>=3,t:'Thằng thuê phòng',d:'Rossie ngồi trên quầy bếp, nhai kẹo cao su.',bg:['#3a3a4a','#14110f'],who:['rossie']},
 {f:()=>S.c1>=3,t:'Áo khoác đỏ bên hàng rào',d:'May Dawson không quên chuyện gì cả.',bg:['#c0392b','#3a1a1a'],who:['may']},
 {f:()=>S.c1>=4,t:'Bữa tối im lặng',d:'Một chiếc điện thoại úp xuống bàn, rung hai lần.',bg:['#f2b33a','#5a3a22'],who:['sara','rossie']},
 {f:()=>S.c1>=6,t:'Bóng người sau rèm',d:'Ngọn đèn vàng ở tầng hai nhà bên.',bg:['#1a2433','#0a0d14'],who:['may']}];
function picCanvas(p,w=400){const c=document.createElement('canvas');c.width=w;c.height=w*.625;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,w,c.height);gr.addColorStop(0,p.bg[0]);gr.addColorStop(1,p.bg[1]);g.fillStyle=gr;g.fillRect(0,0,w,c.height);
 p.who.forEach((id,i)=>{const n=npc(id);const s=w*.36;const x=w/2-(p.who.length*s*.8)/2+i*s*.8;g.save();g.beginPath();g.arc(x+s/2,c.height*.52,s/2,0,7);g.clip();g.drawImage(portrait(npcLook(n),Math.round(s),id),x,c.height*.52-s/2,s,s);g.restore();
  g.strokeStyle='#2b1d3a';g.lineWidth=4;g.beginPath();g.arc(x+s/2,c.height*.52,s/2,0,7);g.stroke();});return c;}
function pictures(){const got=PICS.filter(p=>p.f());openModal(`<div class="who">Album · ${got.length}/${PICS.length} ảnh</div><h2>Ảnh kỷ niệm</h2><div class="gal" id="gal"></div><div class="opts"><button id="xc">Đóng</button></div>`);mbox.classList.add('wide');
 const gal=mbox.querySelector('#gal');if(!got.length)gal.innerHTML='<p>Chưa có ảnh nào. Cứ sống ở Crestmoor, rồi sẽ có.</p>';
 got.forEach(p=>{const b=document.createElement('button');b.className='pic';b.appendChild(picCanvas(p));const d=document.createElement('div');d.innerHTML=`<b>${p.t}</b><small>${p.d}</small>`;b.appendChild(d);gal.appendChild(b);});
 document.getElementById('xc').onclick=closeModal;}

/* ---------- inventory, quests ---------- */
function inv(){if(!modal.hidden)return closeModal();const ks=Object.keys(S.inv);
 openModal(`<div class="who">Túi đồ · ${S.cash} đô · biên bản cảnh sát ${S.records}/3</div><h2>Trong túi</h2>`+(ks.length?ks.map(k=>`<div class="item"><div><svg class="i ico"><use href="#i-${ITEMS[k].ico}"/></svg><div><b>${ITEMS[k].n}</b>${S.inv[k]>1?' ×'+S.inv[k]:''}<small>${ITEMS[k].d}</small></div></div></div>`).join(''):'<p>Trống trơn.</p>')+'<div class="opts"><button id="xc">Đóng</button></div>');
 document.getElementById('xc').onclick=closeModal;}
function questLog(){if(!sc.hidden)return;if(!modal.hidden)return closeModal();const c=C1[Math.floor(S.c1)]||C1[6];
 const li=a=>a.length?a.map(x=>`<div class="item"><div><div><small style="font-size:13px;color:var(--ink)">• ${x}</small></div></div></div>`).join(''):'<p style="color:var(--dim)">Chưa có gì.</p>';
 const ppl=Object.entries(S.note.people).map(([id,t])=>`<div class="item"><div><div><b>${npc(id).name}</b><small>${t}</small></div></div><span class="status" style="background:var(--accent)">${id==='sara'?'Tin cậy: '+trustLabel():id==='rossie'?'Thiện cảm: '+rossieLabel():id==='may'?'Nghi ngờ: '+mayLabel():relStatus(S.rel[id]||0)[0]}</span></div>`).join('');
 openModal(`<div class="who">Sổ ghi chú của Ethan</div><h2>${c.t}</h2><p style="color:var(--dim)">${c.o()}</p>
 <div class="sec"><h4>Quy tắc nhà</h4>${li(S.note.rules)}</div><div class="sec"><h4>Các mối quan hệ</h4>${ppl||'<p style="color:var(--dim)">Chưa quen ai.</p>'}</div>
 <div class="sec"><h4>Những điều đã phát hiện</h4>${li(S.note.found)}</div><div class="opts"><button id="xc">Đóng</button></div>`);mbox.classList.add('wide');document.getElementById('xc').onclick=closeModal;}
function waitHalf(){if(!modal.hidden||!sc.hidden)return;if(S.flags.ending)return;passTime(30);toast('Bạn chờ 30 phút.');}

/* ---------- map ---------- */
const MAPB={x0:-128,x1:128,z0:-82,z1:82};
function drawMap(g,W,H,big,cx,cz,span){g.save();g.fillStyle='#3e6a34';g.fillRect(0,0,W,H);let s,X,Z;
 if(big){s=Math.min(W/(MAPB.x1-MAPB.x0),H/(MAPB.z1-MAPB.z0));const ox=(W-(MAPB.x1-MAPB.x0)*s)/2,oz=(H-(MAPB.z1-MAPB.z0)*s)/2;X=x=>ox+(x-MAPB.x0)*s;Z=z=>oz+(z-MAPB.z0)*s;}
 else{s=W/span;X=x=>W/2+(x-cx)*s;Z=z=>H/2+(z-cz)*s;}
 g.fillStyle='#8a6a3a';g.fillRect(X(-87.5),Z(-52.5),80*s,45*s);g.fillStyle='#6e8a3a';g.fillRect(X(-87.5),Z(-52.5),80*s,45*s);
 g.fillStyle='#bdb6a8';ROADS.forEach(r=>{if(r.ax==='x')g.fillRect(X(MAPB.x0),Z(r.c-SWK),(MAPB.x1-MAPB.x0)*s,SWK*2*s);else g.fillRect(X(r.c-SWK),Z(MAPB.z0),SWK*2*s,(MAPB.z1-MAPB.z0)*s);});
 g.fillStyle='#4a4c50';ROADS.forEach(r=>{if(r.ax==='x')g.fillRect(X(MAPB.x0),Z(r.c-RW),(MAPB.x1-MAPB.x0)*s,RW*2*s);else g.fillRect(X(r.c-RW),Z(MAPB.z0),RW*2*s,(MAPB.z1-MAPB.z0)*s);});
 g.fillStyle=S.flags.pondPink?'#ff8fc8':'#3f8fb0';g.beginPath();g.arc(X(POND.x),Z(POND.z),POND.r*s,0,7);g.fill();
 const ZC={public:'#e8dcc0',semi:'#e6c27a',staff:'#e09a5a',secure:'#d0584e'};
 Object.values(BLD).forEach(b=>{if(b.upper)return;g.fillStyle=b.closed?'#9a8f84':'#c9bfae';g.fillRect(X(b.x0),Z(b.z0),(b.x1-b.x0)*s,(b.z1-b.z0)*s);
  if(!b.closed&&(big||s>2)){ROOMS.filter(r=>r.b===b.id).forEach(r=>{g.fillStyle=ZC[r.perm&&S.flags[r.perm]?'public':r.zone];g.globalAlpha=r.lobby?.55:.9;g.fillRect(X(r.x0)+1,Z(r.z0)+1,(r.x1-r.x0)*s-2,(r.z1-r.z0)*s-2);g.globalAlpha=1;});
   g.fillStyle=lockOk(b.lock)?'#2ecc71':'#e74c3c';g.fillRect(X(b.ex)-3,Z(b.ez)-3,6,6);}
  g.strokeStyle='#2b1d3a';g.lineWidth=big?1.5:1;g.strokeRect(X(b.x0),Z(b.z0),(b.x1-b.x0)*s,(b.z1-b.z0)*s);});
 if(big){g.fillStyle='#fff';g.font='bold 11px "Be Vietnam Pro",sans-serif';g.textAlign='center';g.strokeStyle='#2b1d3a';g.lineWidth=3;
  Object.values(BLD).forEach(b=>{if(b.closed||b.upper)return;const t=b.name;g.strokeText(t,X((b.x0+b.x1)/2),Z((b.z0+b.z1)/2)+4);g.fillText(t,X((b.x0+b.x1)/2),Z((b.z0+b.z1)/2)+4);});
  g.font='bold 12px "Baloo 2",sans-serif';g.fillStyle='#ffe9c2';[['MAIN ST',-60,0],['ELM ST',-50,-60],['CEDAR LN',-50,60],['OAK AVE',0,-30],['WEST RD',-95,40],['EAST RD',95,40],['CÔNG VIÊN',-62,-46]].forEach(([t,x,z])=>{g.strokeText(t,X(x),Z(z)+4);g.fillText(t,X(x),Z(z)+4);});}
 CARS.forEach(c=>{g.fillStyle=c.police?'#2040ff':'#ddd';g.fillRect(X(c.x)-2,Z(c.z)-2,4,4);});
 NPCS.forEach(n=>{if(n.away)return;g.fillStyle=n.police?'#3a6aff':'#ff8cc0';g.beginPath();g.arc(X(n.x),Z(n.z),big?4.5:3,0,7);g.fill();if(big){g.fillStyle='#fff';g.font='10px sans-serif';g.strokeStyle='#000';g.lineWidth=2.5;g.strokeText(n.name,X(n.x),Z(n.z)-7);g.fillText(n.name,X(n.x),Z(n.z)-7);}});
 g.fillStyle='#ffc531';g.strokeStyle='#2b1d3a';g.lineWidth=2;g.beginPath();g.arc(X(P.x),Z(P.z),big?7:5,0,7);g.fill();g.stroke();
 const fx=Math.sin(P.face),fz=Math.cos(P.face);g.beginPath();g.moveTo(X(P.x)+fx*11,Z(P.z)+fz*11);g.lineTo(X(P.x)+fz*4,Z(P.z)-fx*4);g.lineTo(X(P.x)-fz*4,Z(P.z)+fx*4);g.closePath();g.fill();g.stroke();
 g.restore();}
function showMap(){if(!modal.hidden)return closeModal();openModal(`<div class="who">Bản đồ · trực tiếp · ô vuông xanh = cửa đang mở, đỏ = đang khóa</div><h2>Crestmoor, Oregon</h2><canvas id="mapc" width="1100" height="720"></canvas>
 <p style="color:var(--dim);font-size:11px">Màu phòng: kem = công cộng · vàng = riêng tư · cam = chỉ nhân viên · đỏ = khu cấm. Chấm hồng = người quen, xanh = cảnh sát.</p><div class="opts"><button id="xc">Đóng</button></div>`);
 mbox.classList.add('wide');drawMap(document.getElementById('mapc').getContext('2d'),1100,720,true);document.getElementById('xc').onclick=closeModal;}

/* ---------- save / load ---------- */
function save(quiet){S.pos=[P.x,P.z];try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));quiet||toast('Đã lưu.');}catch(e){toast('Không lưu được: trình duyệt chặn bộ nhớ.');}}
function applyWorldState(){if(S.flags.pondPink){WATER_U.uTint.value.set(0xff8fc8);WATER_U.uDeep.value.set(0x9a3a6a);}else{WATER_U.uTint.value.set(0xffffff);WATER_U.uDeep.value.set(0x2f5e5a);}}
function load(){try{const d=localStorage.getItem(SAVE_KEY);if(!d)return toast('Chưa có bản lưu.');const o=JSON.parse(d),fr=fresh();S=Object.assign(fr,o);S.rel=Object.assign(fr.rel,o.rel);S.q=Object.assign({},o.q);S.note=Object.assign(fr.note,o.note);
 tp(S.pos[0],S.pos[1]);NPCS.forEach(n=>{n.ov=null;spawnNPC(n);});applyWorldState();closeModal();sc.hidden=true;paused=false;toast('Đã tải: '+DAYS[weekday()]+' '+hm(hour())+'.');}catch(e){toast('Không tải được bản lưu.');}}
function endScreen(title,text){openModal(`<div class="who">Crestmoor</div><h2>${title}</h2><p>${text}</p><p style="color:var(--dim)">Biên bản ${S.records} · Ảnh ${PICS.filter(p=>p.f()).length}/${PICS.length}</p><div class="opts"><button id="eR">Chơi lại từ đầu</button><button id="eL">Tải bản lưu</button><button id="eC" class="alt">Tiếp tục đi dạo thị trấn</button></div>`);
 document.getElementById('eR').onclick=()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}location.reload();};document.getElementById('eL').onclick=()=>{closeModal();load();};document.getElementById('eC').onclick=closeModal;}

bC.onclick=()=>library();bP.onclick=pictures;bI.onclick=inv;bM.onclick=showMap;bQ.onclick=questLog;bT.onclick=waitHalf;bS.onclick=()=>save();bL.onclick=load;bU.onclick=unstuck;

/* ---------- interaction ---------- */
function nearest(){let best=null,bd=2.3;
 for(const o of INT){if(!o.pri||(o.hide&&o.hide()))continue;const d=Math.hypot(o.x-P.x,o.z-P.z);if(d<1.9&&bldAt(o.x,o.z)===P.b)return{o};}
 NPCS.forEach(n=>{if(n.away)return;const d=Math.hypot(n.x-P.x,n.z-P.z);if(d<bd&&bldAt(n.x,n.z)===P.b){bd=d;best={npc:n};}});
 INT.forEach(o=>{if(o.hide&&o.hide())return;const d=Math.hypot(o.x-P.x,o.z-P.z);if(d<Math.min(bd,1.9)){bd=d;best={o};}});
 if(!best)PEDS.forEach(p=>{if(!p.active)return;const d=Math.hypot(p.x-P.x,p.z-P.z);if(d<1.6&&d<bd){bd=d;best={ped:p};}});
 return best;}
const PED_LINES=['"Sinh viên mới hả? Mùa mưa ở đây kéo dài tới tháng Năm, mua ủng đi."','"Đừng gửi tiền ở Ngân hàng Pryce. Vào thì dễ, ra thì khó."','"Lại có xe đen đậu trước Red Lantern cả đêm. Năm nay nhiều hơn năm ngoái."','"Cà phê ở Diner ngon nhất Crestmoor. Cũng là duy nhất."','"Thị trưởng Keller lại hứa sửa đường Elm St. Năm thứ ba rồi."','"Nhà Whitfield à? Tội nghiệp Sara. Từ sau vụ tai nạn của Mark..."','"Trời tạnh rồi đấy, tranh thủ phơi đồ đi."','"Cậu thấy bà Dawson nhà bên chưa? Bà ấy thấy cậu rồi đấy."'];
function interact(){if(paused)return;const nb=nearest();if(!nb)return;if(nb.npc)return talk(nb.npc);if(nb.o)return nb.o.act();if(nb.ped){toast(nb.ped.name+': '+PED_LINES[(PEDS.indexOf(nb.ped)+day())%PED_LINES.length]);}}

/* =====================================================================
   MAIN LOOP
   ===================================================================== */
const mini=document.getElementById('mini').getContext('2d');let last=performance.now(),camYaw=0,miniT=0;
const skyDay=new THREE.Color(0x9fd0f4),skyDusk=new THREE.Color(0xf0a070),skyNight=new THREE.Color(0x0e1630),tmpC=new THREE.Color();
const LAMP_LIGHTS=[0,1,2,3,4,5].map(()=>{const l=new THREE.PointLight(0xffd8a0,0,22,1.6);scene.add(l);return l;});
const clockEl=document.getElementById('clock'),locEl=document.getElementById('loc'),tbar=document.getElementById('tbar'),tlab=document.getElementById('tlab'),questEl=document.getElementById('quest'),promptEl=document.getElementById('prompt');
let lastSeer=null,honkT=0;
function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;requestAnimationFrame(tick);if(window.INTRO_ON)return;bumpT-=dt;
 let pMoving=false;
 if(!paused){S.min+=dt;
  if(K.q)P.yaw+=dt*2;if(K.r)P.yaw-=dt*2;
  let mx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),mz=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0);
  if(JOY.on){mx=JOY.x;mz=JOY.y;}
  const mag=Math.min(1,Math.hypot(mx,mz));
  if(mag>.12){pMoving=true;const sp=(P.crouch?2.3:K.shift?7.5:5.2)*dt*(JOY.on?Math.max(.45,mag):1),l=Math.hypot(mx,mz),s=Math.sin(P.yaw),c=Math.cos(P.yaw);
   const dx=(mx*c+mz*s)/l*sp,dz=(-mx*s+mz*c)/l*sp;if(!blocked(P.x+dx,P.z))P.x+=dx;if(!blocked(P.x,P.z+dz))P.z+=dz;P.face=Math.atan2(dx,dz);}
  P.b=bldAt(P.x,P.z);P.room=P.b?roomAt(P.x,P.z):null;
  NPCS.forEach(n=>stepNPC(n,dt));pedTick(dt);
  const agents=[{x:P.x,z:P.z,player:1}];NPCS.forEach(n=>{if(!n.away)agents.push(n);});PEDS.forEach(p=>{if(p.active)agents.push(p);});carTick(dt,agents);
  if(CARS.some(c=>c.stopT>2.5)&&(honkT-=dt)<=0){honkT=9;toast('BÍP BÍP! "Này cậu, đứng giữa đường làm gì thế?"');}
  // suspicion
  let gain=0,seer=null;const z=zoneNow();NPCS.forEach(n=>n.sees=false);
  if(!S.flags.ending)NPCS.forEach(n=>{if(!canSee(n))return;let g=0;
   if(z==='secure')g=32;else if(z==='staff')g=22;else if(z==='semi'&&!n.police)g=8;
   if(g){n.sees=true;gain+=g;seer=n;}});
  if(seer)lastSeer=seer;
  S.trouble=clamp(S.trouble+(gain?gain*dt:-7*dt),0,100);
  if(S.trouble>=100&&seer&&!paused)caught(seer);
  storyTick(dt);
  if(day()!==S.lastDay){S.lastDay=day();}
 }
 // player rig
 const pg=P.rig.g;pg.position.set(P.x,0,P.z);let df=P.face-pg.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));pg.rotation.y+=df*.25;pg.scale.y=P.crouch?.72:1;animate(P.rig,pMoving,dt,P.crouch?.6:1.2);
 // NPC rigs
 NPCS.forEach(n=>{const g=n.rig.g;g.visible=!n.away;if(n.away)return;g.position.set(n.x,0,n.z);let d=n.face-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*.2;animate(n.rig,n.moving&&!paused,dt);});
 // camera
 let dyw=P.yaw-camYaw;dyw=Math.atan2(Math.sin(dyw),Math.cos(dyw));camYaw+=dyw*.15;const ind=!!P.b;
 const dist=(ind?9:13)*zoom,cp=ind?Math.max(camPitch,.85):camPitch;const hz=Math.cos(cp)*dist,hy=Math.sin(cp)*dist+1.2;
 cam.position.set(P.x+Math.sin(camYaw)*hz,hy,P.z+Math.cos(camYaw)*hz);cam.lookAt(P.x,1,P.z);if(window.CAMOVR){cam.position.set(...CAMOVR.p);cam.lookAt(...CAMOVR.t);}
 // cutaway: the player's building + anything between camera and player
 const cut=new Set();for(let i=0;i<=12;i++){const t=i/12,b=footprintAt(cam.position.x+(P.x-cam.position.x)*t,cam.position.z+(P.z-cam.position.z)*t,.4);if(b)cut.add(b);}
 if(P.b)cut.add(P.b);
 for(const id in ROOF)ROOF[id].visible=!cut.has(id);for(const id in FXG)FXG[id].visible=!cut.has(id);for(const id in IGRP)IGRP[id].visible=cut.has(id);
 const cdx=cam.position.x-P.x,cdz=cam.position.z-P.z,cl=Math.hypot(cdx,cdz)||1;
 WALLMESH.forEach(w=>{let tgt=1;if(cut.has(w.b)){if(w.b===P.b){tgt=w.cornice?0:.12;if(w.ext&&!w.cornice&&(w.nx*cdx+w.nz*cdz)/cl<-.2)tgt=Math.min(1,3.4/w.h);}else{tgt=w.cornice?0:(w.ext?(segRect(cam.position.x,cam.position.z,P.x,P.z,w,.6)||(w.nx*cdx+w.nz*cdz)/cl>.2?.12:Math.min(1,3.4/w.h)):.12);}}
  if(tgt===0){w.m.visible=false;return;}w.m.visible=true;
  if(Math.abs(w.s-tgt)>.005){w.s+=(tgt-w.s)*.25;w.m.scale.y=w.s;w.m.position.y=w.h*w.s/2;w.deco.forEach(d=>d.visible=d.position.y<w.h*w.s);}});
 DOORS.forEach(d=>{const near=(Math.hypot(P.x-d.x,P.z-d.z)<2.4&&!doorBlocks(d))||NPCS.some(n=>!n.away&&Math.hypot(n.x-d.x,n.z-d.z)<2.2);d.ang+=((near?-1.5:0)-d.ang)*.15;d.piv.rotation.y=(d.ax==='z'?-Math.PI/2:0)+d.ang;});
 // time of day
 const h=hour(),dl=clamp(Math.sin((h-6)/12*Math.PI)*1.4,0,1),dusk=Math.max(0,1-Math.abs(h-18.5)/1.5)+Math.max(0,1-Math.abs(h-6.5)/1.2);
 hemi.intensity=.25+.75*dl;sun.intensity=.95*dl;tmpC.copy(skyNight).lerp(skyDay,dl).lerp(skyDusk,Math.min(.6,dusk*.6));scene.background=tmpC;scene.fog.color.copy(tmpC);
 const sa=(h-6)/12*Math.PI;sun.position.set(P.x+Math.cos(sa)*40,8+Math.max(0,Math.sin(sa))*45,P.z+18);sun.target.position.set(P.x,0,P.z);
 const lampOn=dl<.35;BULB_MAT.emissive.setHex(lampOn?0xffd27a:0);winMat.emissive.setHex(lampOn?0x6a5020:0);headMat.emissive.setHex(lampOn?0xfff2b0:0);
 if(lampOn){const near=LAMP_POS.map(p=>[p,(p[0]-P.x)**2+(p[1]-P.z)**2]).sort((a,b)=>a[1]-b[1]).slice(0,LAMP_LIGHTS.length);LAMP_LIGHTS.forEach((l,i)=>{const p=near[i][0];l.position.set(p[0],4.2,p[1]);l.intensity=1.1;});}else LAMP_LIGHTS.forEach(l=>l.intensity=0);
 plamp.position.set(P.x,2.8,P.z);plamp.intensity=ind?(dl<.6?1:.45):0;
 WATER_U.uTime.value=now/1000;WATER_U.uSunI.value=Math.min(1.2,sun.intensity/.95);WATER_U.uSky.value.copy(tmpC).lerp(new THREE.Color(1,1,1),.2);
 DUCKS.forEach(d=>{d.a+=d.s*dt;d.g.position.set(POND.x+Math.cos(d.a)*d.r,0,POND.z+Math.sin(d.a)*d.r);d.g.rotation.y=-d.a+(d.s>0?0:Math.PI);});
 if(window.FLAG)FLAG.rotation.y=Math.sin(now/700)*.25;
 if(S.bellT>0&&window.CHURCH_BELL){S.bellT-=dt;CHURCH_BELL.rotation.z=Math.sin(now/120)*.5*Math.min(1,S.bellT);}
 // markers
 INT.forEach(o=>{const vis=!(o.hide&&o.hide())&&Math.hypot(o.x-P.x,o.z-P.z)<7&&(bldAt(o.x,o.z)===P.b);o.mark.visible=vis;if(vis){o.mark.rotation.y+=dt*2;o.mark.position.y=2.1+Math.sin(now/300)*.1;}});
 ren.render(scene,cam);
 // name tags
 NPCS.forEach(n=>{const d=Math.hypot(n.x-P.x,n.z-P.z);if(n.away||d>28||bldAt(n.x,n.z)!==P.b){n.tag.hidden=true;return;}
  v3.set(n.x,2.45,n.z).project(cam);if(v3.z>1||Math.abs(v3.x)>1.1||Math.abs(v3.y)>1.1){n.tag.hidden=true;return;}n.tag.hidden=false;n.tag.style.left=(v3.x+1)/2*innerWidth+'px';n.tag.style.top=(1-v3.y)/2*innerHeight+'px';
  const e=n.sees?'<em>!</em>':n.emoteT>0?`<em class="${n.emote==='?'?'q':n.emote==='♥'?'h':''}">${n.emote}</em>`:'';const html=e+n.name;if(n.tag._h!==html){n.tag.innerHTML=html;n.tag._h=html;}});
 // HUD
 const hh=Math.floor(h),mm=Math.floor(S.min%60);clockEl.textContent=`${DAYS[weekday()]} · ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
 const where=P.room?P.room.name:(P.x<-103.4&&P.z>-38.5&&P.z<-11.5)?'Sân xưởng cũ':nearRoadName();
 const lt=where+(ZONE_NAME[zoneNow()]||'')+(P.crouch?' · đang cúi':'');if(locEl._t!==lt){locEl.textContent=lt;locEl._t=lt;}
 const t=S.trouble;tbar.style.width=t+'%';tbar.style.background=t<40?'var(--ok)':t<70?'var(--accent)':'var(--danger)';
 tlab.textContent=t<20?'Bình thường':t<40?'Bị để ý':t<60?'Bị nghi ngờ':t<80?'Bị chất vấn':'Sắp bị bắt!';
 const qt=questText();if(questEl._t!==qt){questEl.innerHTML=qt;questEl._t=qt;}
 const nb=paused?null:nearest();
 if(nb){const txt=nb.npc?'Nói chuyện với '+nb.npc.name:nb.o?nb.o.label:'Chào '+nb.ped.name;if(promptEl._t!==txt){promptEl.textContent=txt;promptEl._t=txt;}promptEl.hidden=false;}else promptEl.hidden=true;
 document.getElementById('aE').classList.toggle('ready',!!nb);
 if((miniT-=dt)<0){miniT=.2;drawMap(mini,400,300,false,P.x,P.z,110);}}
function nearRoadName(){let best='Crestmoor',bd=9;ROADS.forEach(r=>{const d=Math.abs((r.ax==='x'?P.z:P.x)-r.c);if(d<bd){bd=d;best=r.name;}});
 if(P.x>-87.5&&P.x<-7.5&&P.z>-52.5&&P.z<-7.5)best='Công viên Crestmoor';return best;}
