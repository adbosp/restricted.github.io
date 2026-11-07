/* =====================================================================
   MAPLE HOLLOW · state, time, cast, schedules, people movement
   ===================================================================== */
const SAVE_KEY='ra_city1';
const START_REL={celine:20,sam:10,dex:15,bella:5,mia:5,kim:0,richard:5,marlowe:-10,simon:-15,linh:5,sloane:0,lan:5,sofia:0,mai:5,bennett:0,jess:0,pastor:5};
function fresh(){return{min:9*60,pos:[-10,6.2],cash:30,inv:{},flags:{},q:{home:1},rel:Object.assign({},START_REL),trouble:0,records:0,taken:{},chatDay:{},giftDay:{},lastDay:1};}
let S=fresh();
const day=()=>Math.floor(S.min/1440)+1;
const hour=()=>(S.min%1440)/60;
const DAYS=['Thứ Sáu','Thứ Bảy','Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm'];
const weekday=()=>(day()-1)%7;
const inHours=(h0,h1)=>{const h=hour();return h0<=h1?h>=h0&&h<h1:h>=h0||h<h1;};
const has=i=>(S.inv[i]||0)>0;
function give(i,n=1){S.inv[i]=(S.inv[i]||0)+n;toast('+ '+ITEMS[i].n);}
function take(i){if(S.inv[i])S.inv[i]--;if(!S.inv[i])delete S.inv[i];}
const hm=h=>{const m=Math.round(h*60);return String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};

/* ---------- the cast (everyone is an adult) ----------
   sched rows: [hour, place]. place = room id | building id (lobby) | OUT key | '@patrol' | 'away'.
   sat/sun rows replace the default list on those days. hearing:1 = attends the Sunday hearing. */
const NPCS=[
 {id:'celine',name:'Dì Celine',age:47,fem:1,job:'Dì giám hộ của Leo · làm bánh tại nhà',look:{skin:0xefc9ac,shirt:0x0f4a36,pants:0x3a3a3a,hair:0xc3bfbc,style:'bob',skirt:1},
  sched:{d:[[0,'a_celine'],[7,'a_kitchen'],[10,'mart'],[11,'aunt'],[15,'green'],[17,'a_kitchen'],[22,'a_celine']],sun:[[0,'a_celine'],[7,'a_kitchen'],[9,'church'],[12,'aunt'],[15,'green'],[17,'aunt'],[22,'a_celine']]},hearing:1},
 {id:'richard',name:'Thị trưởng Lang',age:58,job:'Thị trưởng Maple Hollow',auth:1,look:{skin:0xeac2a2,shirt:0x1b2430,pants:0x1b2430,hair:0xd6d7dc,style:'short'},
  sched:{d:[[0,'away'],[8,'h_mayor'],[12,'diner'],[13,'h_mayor'],[16.5,'ml_office'],[18,'inn'],[21,'away']],sat:[[0,'away'],[9,'square'],[10,'pond'],[11,'h_mayor'],[12,'diner'],[13,'h_mayor'],[16,'inn'],[20,'away']],
   sun:[[0,'away'],[9,'church'],[11,'h_mayor'],[13,'diner'],[14,'h_mayor'],[22,'away']]},hearing:1},
 {id:'marlowe',name:'Marlowe Vance',age:46,fem:1,job:'Chủ tịch Vance Development',look:{skin:0xf0cdb4,shirt:0x1d1f27,pants:0x1d1f27,hair:0x1b1714,style:'bun'},
  sched:{d:[[0,'i_r1'],[8,'inn'],[9,'ml_office'],[12,'diner'],[13,'h_mayor'],[14,'ml_office'],[19,'inn'],[23,'i_r1']]},hearing:1},
 {id:'simon',name:'Cảnh sát Simon',age:24,job:'Cảnh sát viên, ca chiều và đêm',auth:1,police:1,look:{skin:0xefcaa8,shirt:0x1f2f4f,pants:0x1f2f4f,hair:0x5b3a22,style:'cap',glasses:1},
  sched:{d:[[0,'@patrol'],[3,'away'],[10,'police'],[11,'diner'],[12,'@patrol'],[15,'police'],[17,'@patrol'],[19,'police'],[20,'@patrol']]},hearing:1},
 {id:'kim',name:'Trung sĩ Kim',age:42,fem:1,job:'Trung sĩ cảnh sát, ca ngày',auth:1,police:1,look:{skin:0xe0aa84,shirt:0x1f2f4f,pants:0x1f2f4f,hair:0x6a4222,style:'pony'},
  sched:{d:[[0,'away'],[7,'p_office'],[9,'@patrol'],[12,'diner'],[13,'p_office'],[15,'@patrol'],[18,'police'],[19,'away']]},hearing:1},
 {id:'sam',name:'Sam Reyes',age:22,fem:1,job:'Thư ký Tòa thị chính',look:{skin:0xefc9a8,shirt:0x2b4a7a,pants:0x2a2a3a,hair:0x6b3b22,style:'pony'},
  sched:{d:[[0,'ap_a'],[8,'hall'],[12,'green'],[13,'hall'],[17,'mart'],[18,'diner'],[20,'ap_a']],sat:[[0,'ap_a'],[10,'green'],[13,'diner'],[15,'flowers'],[17,'ap_a']]},hearing:1},
 {id:'dex',name:'Dex Reed',age:20,job:'Hàng xóm · thợ ở trạm xăng',look:{skin:0xc48a5e,shirt:0x2a9d8f,pants:0x34557a,hair:0x16110e,style:'messy'},
  sched:{d:[[0,'r_dex'],[9,'gaspump'],[13,'gas'],[14,'gaspump'],[17,'green'],[19,'diner'],[21,'r_dex']]},hearing:1},
 {id:'bella',name:'Bella Moore',age:21,fem:1,job:'Phục vụ quán Hollow Diner',look:{skin:0xf4d3bd,shirt:0xfbf5ee,pants:0xd33a3a,hair:0xe8c27a,style:'long',skirt:1},
  sched:{d:[[0,'ap_b'],[7,'diner'],[15,'green'],[17,'diner'],[22,'ap_b']]}},
 {id:'mia',name:'Mia Torres',age:20,fem:1,job:'Kiểm lâm công viên Town Green',look:{skin:0xe3ae85,shirt:0x3a7a4a,pants:0x6b5a3a,hair:0x7a4a24,style:'bun'},
  sched:{d:[[0,'ap_c'],[6,'pond'],[8,'shed'],[10,'green'],[12,'diner'],[13,'gazebo'],[16,'shed'],[19,'ap_c']]}},
 {id:'linh',name:'MC Linh Tran',age:30,fem:1,job:'MC kênh truyền hình WMHV-TV',look:{skin:0xe8bd9a,shirt:0xb3222c,pants:0x1a1a1a,hair:0x14110f,style:'bob'},
  sched:{d:[[0,'i_r2'],[8,'t_news'],[12,'diner'],[14,'t_news'],[17,'square'],[19,'inn'],[23,'i_r2']]},hearing:1},
 {id:'sloane',name:'Cô Sloane',age:41,fem:1,job:'Giáo viên Lịch sử, Cao đẳng Maple Hollow',look:{skin:0xecc7ac,shirt:0x40454d,pants:0x40454d,hair:0x4a3426,style:'bun',glasses:1},
  sched:{d:[[0,'away'],[8,'k_class1'],[12,'k_lounge'],[13,'k_class1'],[16,'k_lib'],[18,'away']],sat:[[0,'away'],[10,'k_lib'],[13,'green'],[15,'away']],sun:[[0,'away'],[9,'church'],[11,'away']]}},
 {id:'lan',name:'Cô Lan',age:36,fem:1,job:'Giáo viên Văn học, Cao đẳng Maple Hollow',look:{skin:0xf2d2bb,shirt:0xf6f2ea,pants:0x5a4a3a,hair:0xb98a58,style:'long',skirt:1},
  sched:{d:[[0,'away'],[8,'k_class2'],[12,'diner'],[13,'k_lib'],[17,'green'],[19,'away']],sat:[[0,'away'],[10,'flowers'],[11,'green'],[14,'k_lib'],[17,'away']]}},
 {id:'sofia',name:'Bác sĩ Sofia',age:29,fem:1,job:'Bác sĩ phòng khám Maple',look:{skin:0xe9c3a6,shirt:0xf7f7f4,pants:0x2a8c92,hair:0x8a3d1c,style:'long',glasses:1},
  sched:{d:[[0,'away'],[8,'c_exam'],[12,'diner'],[13,'c_exam'],[18,'away']],sat:[[0,'away'],[9,'pond'],[11,'c_exam'],[14,'away']],sun:[[0,'away'],[10,'green'],[12,'away']]}},
 {id:'mai',name:'Mai Lin',age:33,fem:1,job:'Chủ tiệm hoa Petal & Stem',look:{skin:0xf1cdb2,shirt:0xe5a7a0,pants:0x5a3a3a,hair:0x33201a,style:'long'},
  sched:{d:[[0,'away'],[8,'flowers'],[18,'inn'],[20,'away']],sun:[[0,'away'],[9,'church'],[11,'flowers'],[16,'away']]}},
 {id:'bennett',name:'Bà Bennett',age:38,fem:1,job:'Giám đốc Ngân hàng Maple Hollow',look:{skin:0xf6d7c5,shirt:0xead7bf,pants:0x3a2a2a,hair:0x8a2f1d,style:'bob'},
  sched:{d:[[0,'away'],[9,'b_office'],[12,'diner'],[13,'b_office'],[17,'inn'],[20,'away']],sat:[[0,'away'],[11,'green'],[13,'away']],sun:[[0,'away'],[9,'church'],[11,'away']]}},
 {id:'jess',name:'Jess Walker',age:31,job:'Chủ tiệm kim khí Walker',look:{skin:0xf0c8a4,shirt:0xc0392b,pants:0x34557a,hair:0xc79b52,style:'short'},
  sched:{d:[[0,'away'],[8,'hardware'],[12,'w_back'],[13,'hardware'],[18,'diner'],[20,'away']],sun:[[0,'away'],[12,'green'],[15,'away']]}},
 {id:'pastor',name:'Mục sư Avery',age:62,job:'Mục sư nhà thờ Thánh Giles',look:{skin:0xe8c0a0,shirt:0x1a1a1a,pants:0x1a1a1a,hair:0xe8e8e8,style:'short'},
  sched:{d:[[0,'away'],[7,'church'],[12,'diner'],[13,'ch_office'],[17,'green'],[19,'ch_office'],[21,'away']],sun:[[0,'away'],[7,'church'],[13,'ch_office'],[16,'green'],[21,'away']]},hearing:1},
];
const npc=id=>NPCS.find(n=>n.id===id);

/* ---------- 3D cartoon rig ---------- */
function makePerson(L){const g=new THREE.Group();scene.add(g);const prev=PUT;PUT=g;
 const sk=C(L.skin),sh=C(L.shirt),pa=C(L.pants),ha=C(L.hair),dark=C(0x1a1a1a);
 const leg=sx=>{const p=new THREE.Group();p.position.set(sx,.85,0);g.add(p);mesh(B(.2,.78,.22),pa,0,-.39,0,p);mesh(B(.22,.1,.32),dark,0,-.8,.05,p);return p;};
 const arm=sx=>{const p=new THREE.Group();p.position.set(sx,1.48,0);g.add(p);mesh(B(.15,.55,.17),sh,0,-.27,0,p);mesh(new THREE.SphereGeometry(.09,8,6),sk,0,-.6,0,p);return p;};
 const lL=leg(-.13),lR=leg(.13);const tw=L.fem?.48:.56;mesh(B(tw,.7,.3),sh,0,1.2,0,g);if(L.fem){mesh(B(.42,.18,.2),sh,0,1.36,.08,g);}const aL=arm(-tw/2-.09),aR=arm(tw/2+.09);
 if(L.skirt)mesh(new THREE.CylinderGeometry(.24,.36,.42,12),pa,0,.72,0,g);
 const head=mesh(new THREE.SphereGeometry(.28,16,12),sk,0,1.85,0,g);head.scale.set(1,1.08,1);
 for(const ex of[-.1,.1]){mesh(new THREE.SphereGeometry(.045,8,6),C(0xffffff),ex,1.9,.24,g,false);mesh(new THREE.SphereGeometry(.025,6,5),dark,ex,1.9,.28,g,false);}
 if(L.glasses)for(const ex of[-.1,.1])mesh(new THREE.TorusGeometry(.065,.012,6,14),dark,ex,1.9,.29,g,false);
 const st=L.style;
 if(st!=='bald'){const cap=mesh(new THREE.SphereGeometry(.3,14,10,0,Math.PI*2,0,Math.PI/2),st==='cap'?C(0x1f2a40):ha,0,1.9,-.02,g);cap.scale.set(1,st==='messy'?1.05:.85,1.05);}
 if(st==='cap')mesh(B(.36,.04,.22),C(0x1f2a40),0,1.97,.26,g);
 if(st==='long')mesh(B(.52,.62,.18),ha,0,1.65,-.2,g);
 if(st==='bob'){const bb=mesh(new THREE.SphereGeometry(.33,14,10),ha,0,1.84,-.05,g);bb.scale.set(1,.9,1);}
 if(st==='pony')mesh(new THREE.CylinderGeometry(.07,.04,.5,8),ha,0,1.75,-.32,g).rotation.x=.4;
 if(st==='bun')mesh(new THREE.SphereGeometry(.13,10,8),ha,0,2.08,-.2,g);
 if(st==='messy')for(let i=0;i<5;i++)mesh(new THREE.ConeGeometry(.07,.18,5),ha,rnd(-.18,.18),2.12,rnd(-.18,.1),g).rotation.z=rnd(-.6,.6);
 if(st==='spiky')for(let i=0;i<7;i++)mesh(new THREE.ConeGeometry(.08,.22,5),ha,rnd(-.2,.2),2.1,rnd(-.2,.12),g).rotation.x=rnd(-.5,.3);
 if(L.badge)mesh(B(.1,.12,.02),C(0xd4af37,0x332200),.12,1.38,.16,g,false);
 if(L.collar)mesh(B(.1,.06,.02),C(0xffffff),0,1.52,.16,g,false);
 const blob=mesh(new THREE.CircleGeometry(.4,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.25}),0,.06,0,g,false);blob.rotation.x=-Math.PI/2;
 PUT=prev;return{g,lL,lR,aL,aR,ph:0};}
function animate(rig,moving,dt,speed=1){if(moving)rig.ph+=dt*9*speed;else rig.ph*=.85;const s=Math.sin(rig.ph)*(moving?.6:0);
 rig.lL.rotation.x=s;rig.lR.rotation.x=-s;rig.aL.rotation.x=-s*.8;rig.aR.rotation.x=s*.8;}
npc('simon').look.badge=npc('kim').look.badge=1;npc('pastor').look.collar=1;

/* ---------- schedules → goals ---------- */
function schedRows(n){const w=weekday();return(w===1&&n.sched.sat)||(w===2&&n.sched.sun)||n.sched.d;}
function schedPlace(n){const h=hour(),rows=schedRows(n);let cur=rows[rows.length-1];for(const r of rows)if(r[0]<=h)cur=r;
 if(n.hearing&&hearingTime()&&!S.flags.ending)return'h_council';
 return cur[1];}
function hearingTime(){return weekday()===2&&day()===3&&hour()>=17.5&&hour()<21;}
function goalOf(n){if(n.ov&&S.min<n.ov.until)return n.ov.place;n.ov=null;return schedPlace(n);}
function targetOf(place){
 if(place==='away')return{key:'away',away:1};
 if(place==='@patrol')return{key:'@patrol',patrol:1};
 if(OUT[place]){const o=OUT[place];return{key:place,nid:o.nid,rect:o.rect};}
 const r=BLD[place]?BLD[place].lob:RM[place];if(!r)return{key:'away',away:1};
 const pad=1;return{key:place,nid:r.nid,rect:[r.x0+pad,r.z0+pad,r.x1-pad,r.z1-pad],room:r};}
function randIn(rect){return[rnd(rect[0],rect[2]),rnd(rect[1],rect[3])];}
function nearestExit(x,z){let b=EXITS[0],bd=1e9;EXITS.forEach(e=>{const d=Math.hypot(NODES[e].x-x,NODES[e].z-z);if(d<bd){bd=d;b=e;}});return b;}

const tagLayer=document.body;
function initNPC(n){n.rig=makePerson(Object.assign({fem:n.fem},n.look));n.x=0;n.z=0;n.face=0;n.path=[];n.final=null;n.goal=null;n.idleT=0;n.away=false;n.emoteT=0;n.patrolI=0;
 n.tag=document.createElement('div');n.tag.className='tag';n.tag.hidden=true;tagLayer.appendChild(n.tag);}
NPCS.forEach(initNPC);
function spawnNPC(n){const g=targetOf(goalOf(n));n.goal=g.key;n.path=[];n.final=null;
 if(g.away){n.away=true;const e=NODES[EXITS[0]];n.x=e.x;n.z=e.z;return;}n.away=false;
 if(g.patrol){const i0=(NPCS.indexOf(n)*3)%PATROL_PTS.length;const nd=NODES[PATROL_PTS[i0]];n.x=nd.x;n.z=nd.z;n.patrolI=(i0+1)%PATROL_PTS.length;planTo(n,PATROL_PTS[n.patrolI]);return;}
 const[x,z]=randIn(g.rect);n.x=x;n.z=z;}
function planTo(n,nid){const from=nearestNode(n.x,n.z);const p=dijkstra(from,nid);n.path=p?p.map(i=>[NODES[i].x,NODES[i].z]):[];}
function stepNPC(n,dt){const place=goalOf(n),g=targetOf(place);
 if(n.goal!==g.key){n.goal=g.key;n.final=null;
  if(n.away&&!g.away){// re-enter town from the nearest edge
   const e=NODES[nearestExit(...(g.nid!=null?[NODES[g.nid].x,NODES[g.nid].z]:[0,0]))];n.x=e.x;n.z=e.z;n.away=false;}
  if(g.away)planTo(n,nearestExit(n.x,n.z));else if(g.patrol){n.patrolI=nearestPatrol(n);planTo(n,PATROL_PTS[n.patrolI]);}else{planTo(n,g.nid);n.final=randIn(g.rect);}}
 if(n.away)return;
 let tx,tz,moving=false;
 if(n.path.length){[tx,tz]=n.path[0];}else if(n.final){[tx,tz]=n.final;}
 if(tx!==undefined){const dx=tx-n.x,dz=tz-n.z,d=Math.hypot(dx,dz);const far=Math.hypot(n.x-P.x,n.z-P.z)>38;const sp=(n.police&&g.patrol?1.5:1.55)*(far?9:1)*dt;
  if(d<=sp+.02){n.x=tx;n.z=tz;if(n.path.length)n.path.shift();else{n.final=null;n.idleT=rnd(4,12);}
   if(!n.path.length&&!n.final){if(g.away){n.away=true;}else if(g.patrol){n.patrolI=(n.patrolI+1)%PATROL_PTS.length;planTo(n,PATROL_PTS[n.patrolI]);}}}
  else{n.x+=dx/d*sp;n.z+=dz/d*sp;n.face=Math.atan2(dx,dz);moving=true;}}
 else if(g.rect&&(n.idleT-=dt)<=0){n.final=randIn(g.rect);}
 if(n.talkT>0){n.talkT-=dt;moving=false;}
 n.moving=moving;if(n.emoteT>0)n.emoteT-=dt;}
function nearestPatrol(n){let b=0,bd=1e9;PATROL_PTS.forEach((p,i)=>{const d=Math.hypot(NODES[p].x-n.x,NODES[p].z-n.z);if(d<bd){bd=d;b=i;}});return b;}
function emote(n,e,t=4){n.emote=e;n.emoteT=t;}

/* ---------- ambient townsfolk ---------- */
const PEDS=[];
{const skins=[0xf0c49a,0xe0aa84,0xc48a5e,0x8d5a3a,0xf4d3bd,0xd9a37a],shirts=[0x3a6ea5,0xc0392b,0x27ae60,0xf39c12,0x8e44ad,0x7f8c8d,0xe67e22,0x16a085,0xd35400,0x2c3e50],hairs=[0x2a1a10,0x5a3a22,0xc79b52,0x1a1a1a,0x8a5a3a,0xd8d8d8],styles=['short','long','bob','pony','bun','cap','messy','bald'];
 for(let i=0;i<18;i++){const fem=i%2===0;const L={fem,skin:skins[i%6],shirt:shirts[i%10],pants:[0x34557a,0x2a2a2a,0x6b5a3a,0x4a4a6a][i%4],hair:hairs[(i*5)%6],style:fem?['long','bob','pony','bun'][i%4]:['short','cap','messy','bald','short'][i%5],skirt:fem&&i%3===0};
  const p={rig:makePerson(L),x:0,z:0,path:[],face:0,sp:rnd(1.1,1.6),wait:0,active:true,name:fem?['Cô Hannah','Bà Ruth','Cô Grace','Chị Olivia','Cô Emma','Bà June','Chị Ava','Cô Lily','Bà Dottie'][i/2|0]:['Ông Walt','Anh Ben','Chú Hank','Anh Tyler','Ông Gus','Anh Noah','Chú Frank','Ông Earl','Anh Cody'][i/2|0]};
  const nd=NODES[WALKN[(i*37)%WALKN.length]];p.x=nd.x+rnd(-.5,.5);p.z=nd.z+rnd(-.5,.5);PEDS.push(p);}}
function pedTick(dt){const h=hour(),want=h>=7&&h<21?PEDS.length:h>=21&&h<23?8:h>=6&&h<7?6:2;
 PEDS.forEach((p,i)=>{p.active=i<want;p.rig.g.visible=p.active;if(!p.active)return;
  if(p.wait>0){p.wait-=dt;animate(p.rig,false,dt);return;}
  if(!p.path.length){const dest=WALKN[Math.floor(Math.random()*WALKN.length)];const from=nearestNode(p.x,p.z);const path=dijkstra(from,dest);p.path=path?path.map(k=>[NODES[k].x+rnd(-.6,.6),NODES[k].z+rnd(-.6,.6)]):[];p.wait=rnd(1,6);return;}
  const[tx,tz]=p.path[0],dx=tx-p.x,dz=tz-p.z,d=Math.hypot(dx,dz),sp=p.sp*dt;
  // politely stop if a car is right in front while crossing
  if(d<=sp){p.x=tx;p.z=tz;p.path.shift();}else{p.x+=dx/d*sp;p.z+=dz/d*sp;p.face=Math.atan2(dx,dz);}
  const g=p.rig.g;g.position.set(p.x,0,p.z);let df=p.face-g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));g.rotation.y+=df*.2;animate(p.rig,d>sp,dt,1);});}
