/* =====================================================================
   CRESTMOOR · state, time, cast, schedules, people movement
   ===================================================================== */
const SAVE_KEY='ra_crest1';
const START_REL={sara:50,rossie:15,may:-20,dave:0,melania:0,jeanie:5,bancroft:0,laura:0,maria:0,chloe:-10,morgan:0,lucy:5,lily:-10,max:-10,evan:5,natasha:0,lynda:0,marcus:0,paul:0,williams:-5};
function fresh(){return{min:16*60,pos:[-23,5.2],cash:60,inv:{},flags:{},q:{},c1:0,mayS:30,note:{rules:[],found:[],people:{}},rel:Object.assign({},START_REL),trouble:0,records:0,taken:{},chatDay:{},giftDay:{},lastDay:1};}
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
   Story characters keep their own routine: they stay at home or at work and only go out when the
   routine (classes, work, errands) or the story needs it. Background townsfolk live in PEDS below.
   sched rows: [hour, place]. place = room id | building id (lobby) | OUT key | '@patrol' | 'away'.
   d = weekdays (classes run Mon-Fri), sat/sun replace it on weekends. */
const NPCS=[
 {id:'sara',name:'Sara Whitfield',age:40,fem:1,job:'Chủ nhà · góa phụ',look:{skin:0xf0cdb4,shirt:0x8e8e92,pants:0x3a3a4a,hair:0x6a4228,style:'bun'},
  sched:{d:[[0,'w_sara'],[6.5,'w_kitchen'],[8,'whit'],[10,'mart'],[11,'w_kitchen'],[13,'whit'],[17.5,'w_kitchen'],[20,'whit'],[22,'w_sara']],
   sun:[[0,'w_sara'],[8,'w_kitchen'],[9.5,'church'],[11.5,'whit'],[17.5,'w_kitchen'],[20,'whit'],[22,'w_sara']]}},
 {id:'rossie',name:'Rossie Whitfield',age:19,fem:1,job:'Con gái Sara · sinh viên năm ba',look:{skin:0xf2d2bb,shirt:0x2b2b38,pants:0x34405a,hair:0x14110f,style:'pony'},
  sched:{d:[[0,'w_rossie'],[7.5,'w_kitchen'],[8.3,'k_class1'],[12,'diner'],[13,'k_chem'],[15.5,'green'],[16.3,'w_rossie'],[18.8,'w_kitchen'],[20,'w_rossie'],[22.5,'inn']],
   sat:[[0,'inn'],[2,'w_rossie'],[12,'w_kitchen'],[13,'w_rossie'],[16,'mart'],[17,'w_rossie'],[18.8,'w_kitchen'],[20,'w_rossie'],[22,'inn']],
   sun:[[0,'inn'],[2,'w_rossie'],[12,'w_kitchen'],[13,'w_rossie'],[18.8,'w_kitchen'],[20,'w_rossie']]}},
 {id:'may',name:'May Dawson',age:42,fem:1,job:'Hàng xóm nhà bên',look:{skin:0xf2d0bb,shirt:0xc0392b,pants:0x3a3a3a,hair:0xe8cf8a,style:'bob'},
  sched:{d:[[0,'r_may'],[7,'dawson'],[9.5,'mayfence'],[10,'mart'],[11,'dawson'],[15.5,'mayfence'],[16.6,'dawson'],[22,'r_may']]}},
 {id:'dave',name:'Thị trưởng Dave Keller',age:58,job:'Thị trưởng Crestmoor',look:{skin:0xeac2a2,shirt:0x1b2430,pants:0x1b2430,hair:0xc9cbd0,style:'short'},
  sched:{d:[[0,'away'],[8,'h_mayor'],[12,'diner'],[13,'h_mayor'],[17,'inn'],[18.5,'away']],sat:[[0,'away'],[11,'square'],[12,'away']],sun:[[0,'away']]}},
 {id:'melania',name:'Melania Keller',age:55,fem:1,job:'Vợ Thị trưởng',look:{skin:0xefcfb8,shirt:0x6a1a2b,pants:0x2a1a1a,hair:0xd8d2c8,style:'bob'},
  sched:{d:[[0,'away'],[10,'h_mayor'],[11.5,'flowers'],[12.5,'away']],sun:[[0,'away'],[9.5,'church'],[11.5,'away']]}},
 {id:'jeanie',name:'Jeanie Blaine',age:37,fem:1,job:'MC kênh tin KCRM-TV',look:{skin:0xe8bd9a,shirt:0xb3222c,pants:0x1a1a1a,hair:0x14110f,style:'long'},
  sched:{d:[[0,'away'],[8,'t_news'],[12,'diner'],[13,'college'],[14,'t_news'],[19,'inn'],[21,'away']],sat:[[0,'away'],[11,'t_news'],[15,'away']],sun:[[0,'away']]}},
 {id:'bancroft',name:'Hiệu trưởng Bancroft',age:44,fem:1,job:'Hiệu trưởng Đại học Crestmoor',look:{skin:0xecc7ac,shirt:0x40454d,pants:0x40454d,hair:0x9a9590,style:'bun',glasses:1},
  sched:{d:[[0,'away'],[7.5,'k_dean'],[18,'away']],sat:[[0,'away']],sun:[[0,'away']]}},
 {id:'laura',name:'Cô Laura Hanley',age:35,fem:1,job:'Giáo viên Hóa học',look:{skin:0xe9c3a6,shirt:0xf7f7f4,pants:0x2a3a4a,hair:0x1a1410,style:'long',glasses:1},
  sched:{d:[[0,'away'],[7.8,'k_chem'],[12,'college'],[13,'k_chem'],[17,'away']],sat:[[0,'away']],sun:[[0,'away']]}},
 {id:'maria',name:'Maria Ortega',age:39,fem:1,job:'Doanh nhân · cổ đông lớn nhất của trường',look:{skin:0xd9a37a,shirt:0xead7bf,pants:0x2a2420,hair:0x2a1a10,style:'long'},
  sched:{d:[[0,'away'],[10,'k_dean'],[11,'away'],[12,'diner'],[13.5,'away']],sat:[[0,'away']],sun:[[0,'away']]}},
 {id:'chloe',name:'Chloe Ames',age:42,fem:1,job:'Bạn thân của Sara',look:{skin:0xf0cdb4,shirt:0x3a7a6a,pants:0x3a3a3a,hair:0xb98a58,style:'bob'},
  sched:{d:[[0,'away'],[12,'diner'],[13,'away']],sat:[[0,'away'],[10,'whit'],[11.5,'away']],sun:[[0,'away'],[9.5,'church'],[11.5,'away']]}},
 {id:'morgan',name:'Morgan Pryce',age:62,job:'CEO Ngân hàng Pryce',look:{skin:0xe8c0a0,shirt:0x262626,pants:0x262626,hair:0xeeeeee,style:'short'},
  sched:{d:[[0,'away'],[9,'b_office'],[12.5,'diner'],[13.5,'b_office'],[17,'inn'],[19,'away']],sat:[[0,'away']],sun:[[0,'away'],[9.5,'church'],[11.5,'away']]}},
 {id:'lucy',name:'Lucy Reed',age:19,fem:1,job:'Bạn cùng lớp',look:{skin:0xf2d2bb,shirt:0xf2a7b8,pants:0x5a6a8a,hair:0x7a4a24,style:'long',skirt:1},
  sched:{d:[[0,'ap_a'],[8.3,'k_class1'],[12,'k_lib'],[13,'k_chem'],[15.5,'k_lib'],[17.5,'ap_a']],sat:[[0,'ap_a'],[11,'green'],[13,'ap_a'],[17,'diner'],[19,'ap_a']],sun:[[0,'ap_a']]}},
 {id:'lily',name:'Lily',age:18,fem:1,job:'Bạn cùng lớp',look:{skin:0xf4d3bd,shirt:0xd94f8a,pants:0x1a1a1a,hair:0x14110f,style:'bob',skirt:1},
  sched:{d:[[0,'ap_b'],[8.3,'k_class1'],[12,'diner'],[13,'k_chem'],[15.5,'ap_b'],[20,'inn'],[23,'ap_b']],sat:[[0,'ap_b'],[14,'mart'],[15,'ap_b'],[20,'inn'],[23.5,'ap_b']],sun:[[0,'ap_b']]}},
 {id:'max',name:'Max',age:19,job:'Bạn cùng lớp',look:{skin:0xf0c49a,shirt:0x2a4a8a,pants:0x2a2a2a,hair:0xc79b52,style:'short'},
  sched:{d:[[0,'ap_c'],[8.3,'k_class1'],[12,'diner'],[13,'k_chem'],[15.5,'ap_c'],[20,'inn'],[23.5,'ap_c']],sat:[[0,'ap_c'],[12,'gaspump'],[13,'ap_c'],[20,'inn'],[23.5,'ap_c']],sun:[[0,'ap_c']]}},
 {id:'evan',name:'Evan Shaw',age:18,job:'Bạn cùng lớp',look:{skin:0xefcaa8,shirt:0x3a3a3a,pants:0x34557a,hair:0x8a3d1c,style:'messy'},
  sched:{d:[[0,'ap_c'],[8.3,'k_class1'],[12,'k_lib'],[13,'k_chem'],[15.5,'ap_c'],[21,'inn'],[22.5,'ap_c']],sat:[[0,'ap_c'],[21,'inn'],[22.5,'ap_c']],sun:[[0,'ap_c']]}},
 {id:'natasha',name:'Cảnh sát Natasha Brooks',age:27,fem:1,job:'Cảnh sát tuần tra',auth:1,police:1,look:{skin:0xf6d7c5,shirt:0x1f2f4f,pants:0x1f2f4f,hair:0x8a2f1d,style:'pony'},
  sched:{d:[[0,'@patrol'],[3,'away'],[14,'police'],[15,'@patrol'],[19,'diner'],[19.5,'@patrol']]}},
 {id:'lynda',name:'Đại úy Lynda Ford',age:38,fem:1,job:'Đại úy cảnh sát · điều tra Red Mafia',auth:1,police:1,look:{skin:0xe0aa84,shirt:0x1f2f4f,pants:0x1f2f4f,hair:0x5a3a22,style:'bun'},
  sched:{d:[[0,'away'],[8,'p_office'],[12,'diner'],[13,'p_office'],[19,'away']],sun:[[0,'away']]}},
 {id:'marcus',name:'Marcus Vale',age:25,job:'Thám tử tự do',look:{skin:0xc48a5e,shirt:0x5a4a3a,pants:0x2a2a2a,hair:0x16110e,style:'short'},
  sched:{d:[[0,'away'],[11,'diner'],[12,'away'],[20,'inn'],[23,'away']]}},
 {id:'paul',name:'Paul',age:25,job:'Trung gian chợ đen',look:{skin:0xf0c8a4,shirt:0x2f4a3a,pants:0x34557a,hair:0x2a1a10,style:'cap'},
  sched:{d:[[0,'away'],[14,'shed'],[22,'away']]}},
 {id:'williams',name:'Williams',age:50,job:'Trùm băng Red Mafia',look:{skin:0xd9a37a,shirt:0x111111,pants:0x111111,hair:0x1a1a1a,style:'bald'},
  sched:{d:[[0,'away'],[15,'ml_office'],[18,'inn'],[23,'away']],sun:[[0,'away']]}},
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
npc('natasha').look.badge=npc('lynda').look.badge=1;

/* ---------- schedules → goals ---------- */
function schedRows(n){const w=weekday();return(w===1&&n.sched.sat)||(w===2&&n.sched.sun)||n.sched.d;}
function schedPlace(n){const h=hour(),rows=schedRows(n);let cur=rows[rows.length-1];for(const r of rows)if(r[0]<=h)cur=r;
 const st=storyPlace(n);if(st)return st;
 return cur[1];}
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
 if(tx!==undefined&&stairJump(n,tx,tz)){if(n.path.length)n.path.shift();return;}
 if(tx!==undefined){const dx=tx-n.x,dz=tz-n.z,d=Math.hypot(dx,dz);const far=Math.hypot(n.x-P.x,n.z-P.z)>38;const sp=(n.police&&g.patrol?1.5:1.55)*(far?9:1)*dt;
  if(d<=sp+.02){n.x=tx;n.z=tz;if(n.path.length)n.path.shift();else{n.final=null;n.idleT=rnd(4,12);}
   if(!n.path.length&&!n.final){if(g.away){n.away=true;}else if(g.patrol){n.patrolI=(n.patrolI+1)%PATROL_PTS.length;planTo(n,PATROL_PTS[n.patrolI]);}}}
  else{n.x+=dx/d*sp;n.z+=dz/d*sp;n.face=Math.atan2(dx,dz);moving=true;}}
 else if(g.rect&&(n.idleT-=dt)<=0){n.final=randIn(g.rect);}
 if(n.talkT>0){n.talkT-=dt;moving=false;}
 n.moving=moving;if(n.emoteT>0)n.emoteT-=dt;}
function stairJump(o,tx,tz){const U=STAIRS.up,D=STAIRS.down;const near=(x,z,p)=>Math.hypot(x-p[0],z-p[1])<.6;
 if((near(o.x,o.z,D)&&near(tx,tz,U))||(near(o.x,o.z,U)&&near(tx,tz,D))){o.x=tx;o.z=tz;return true;}return false;}
function nearestPatrol(n){let b=0,bd=1e9;PATROL_PTS.forEach((p,i)=>{const d=Math.hypot(NODES[p].x-n.x,NODES[p].z-n.z);if(d<bd){bd=d;b=i;}});return b;}
function emote(n,e,t=4){n.emote=e;n.emoteT=t;}

/* ---------- background townsfolk (not part of the story) ----------
   Each one has a home (an edge of town or the student flats), a job and a daily routine like a small
   GTA-style crowd: commute in the morning, lunch at noon, errands after work, a night out, then home.
   At home off the edge of town they are hidden, so the streets fill at rush hour and empty at night. */
const PEDS=[];
const PED_JOBS=['mart','hardware','flowers','diner','bank','hall','clinic','college','gas','studio','church','police'];
const PED_LUNCH=['diner','green','square','mart','gazebo','pond'];
const PED_ERR=['mart','gas','flowers','hardware','diner','busstop'];
const PED_EVE=['inn','diner','green','square','pond'];
function pedSched(i){const R=k=>((i*7919+k*104729)%1000)/1000;const pk=(a,k)=>a[Math.floor(R(k)*a.length)];const kind=i%10<6?'work':i%10<8?'student':'retired';
 const home=i%4===3?'apts':'@home';const job=pk(PED_JOBS,1),lunch=pk(PED_LUNCH,2),err=pk(PED_ERR,3),eve=pk(PED_EVE,4),j=R(5)*1.2;
 if(kind==='student')return{kind,d:[[0,home],[7.6+j*.4,'college'],[12,lunch],[13,'college'],[15.5+j,pk(['green','mart','diner','pond'],6)],[17.5+j,home],[20+j,R(7)<.5?'inn':'diner'],[22.5+j,home]],
  we:[[0,home],[10+j*2,pk(['green','pond','mart','gazebo'],8)],[13,lunch],[15,pk(['green','square','mart'],9)],[18,home],[20,eve],[23,home]]};
 if(kind==='retired')return{kind,d:[[0,home],[8+j,pk(['green','pond','gazebo'],10)],[10+j,pk(['church','mart','flowers','clinic'],11)],[12,lunch],[14,pk(['gazebo','green','square','pond'],12)],[16.5+j,home]],
  we:[[0,home],[9+j,pk(['church','green','pond'],13)],[12,lunch],[14,pk(['green','square','gazebo'],14)],[17,home]]};
 return{kind,d:[[0,home],[6.8+j,job],[12,lunch],[13,job],[17+j*.6,err],[18+j,home],...(R(15)<.6?[[19.5+j,eve],[21.5+j,home]]:[])],
  we:[[0,home],[9.5+j*2,pk(['mart','green','pond','gas','flowers'],16)],[12.5,lunch],[14+j,pk(['green','square','pond','gazebo'],17)],[17,home],...(R(18)<.7?[[20,eve],[22.5+j,home]]:[])]};}
{const skins=[0xf0c49a,0xe0aa84,0xc48a5e,0x8d5a3a,0xf4d3bd,0xd9a37a],shirts=[0x3a6ea5,0xc0392b,0x27ae60,0xf39c12,0x8e44ad,0x7f8c8d,0xe67e22,0x16a085,0xd35400,0x2c3e50],hairs=[0x2a1a10,0x5a3a22,0xc79b52,0x1a1a1a,0x8a5a3a,0xd8d8d8];
 const fn=['Hannah','Ruth','Grace','Olivia','Emma','June','Ava','Nora','Dottie','Claire','Ivy','Megan','Rosa','Tess','Paige','Wendy','Abby'],mn=['Walt','Ben','Hank','Tyler','Gus','Noah','Frank','Earl','Cody','Jake','Luis','Owen','Reggie','Sam','Theo','Wade','Duke'];
 for(let i=0;i<34;i++){const fem=i%2===0;const sch=pedSched(i);const old=sch.kind==='retired';
  const L={fem,skin:skins[i%6],shirt:shirts[(i*3)%10],pants:[0x34557a,0x2a2a2a,0x6b5a3a,0x4a4a6a][i%4],hair:old?0xd8d8d8:hairs[(i*5)%6],style:fem?['long','bob','pony','bun'][i%4]:['short','cap','messy','bald','short'][i%5],skirt:fem&&i%3===0};
  const nm=fem?fn[(i/2|0)%fn.length]:mn[(i/2|0)%mn.length];
  const p={rig:makePerson(L),x:0,z:0,path:[],face:0,sp:old?rnd(.9,1.15):rnd(1.15,1.6),wait:0,active:false,goal:null,final:null,idleT:0,sch,
   name:(old?(fem?'Bà ':'Ông '):(sch.kind==='student'?'':(fem?'Cô ':'Anh ')))+nm,kind:sch.kind,home:sch.d[0][1]};
  p.exit=EXITS[i%EXITS.length];PEDS.push(p);}}
function pedPlace(p){const h=hour(),w=weekday(),rows=w===1||w===2?p.sch.we:p.sch.d;let cur=rows[0];for(const r of rows)if(r[0]<=h)cur=r;return cur[1];}
function pedTarget(p,pl){if(pl==='@home')return{key:pl,nid:p.exit,hide:1};
 if(OUT[pl]){const o=OUT[pl];return{key:pl,nid:o.nid,rect:o.rect};}const r=BLD[pl]&&BLD[pl].lob;if(!r)return{key:pl,nid:p.exit,hide:1};
 return{key:pl,nid:r.nid,rect:[r.x0+1,r.z0+1,r.x1-1,r.z1-1]};}
function pedPlan(p,nid){const from=nearestNode(p.x,p.z);const path=dijkstra(from,nid);p.path=path?path.map(k=>[NODES[k].x+(NODES[k].tag==='walk'?rnd(-.7,.7):0),NODES[k].z+(NODES[k].tag==='walk'?rnd(-.7,.7):0)]):[];}
function pedSpawn(p){const g=pedTarget(p,pedPlace(p));p.goal=g.key;p.path=[];p.final=null;
 if(g.hide){p.active=false;const e=NODES[p.exit];p.x=e.x;p.z=e.z;return;}p.active=true;const[x,z]=randIn(g.rect);p.x=x;p.z=z;p.idleT=rnd(2,20);}
PEDS.forEach(pedSpawn);
function pedTick(dt){PEDS.forEach(p=>{const g=pedTarget(p,pedPlace(p));
  if(p.goal!==g.key){p.goal=g.key;p.final=null;if(!p.active){const e=NODES[p.exit];p.x=e.x;p.z=e.z;p.active=true;}pedPlan(p,g.nid);if(g.rect)p.final=randIn(g.rect);}
  p.rig.g.visible=p.active;if(!p.active)return;
  let tx,tz;if(p.path.length)[tx,tz]=p.path[0];else if(p.final)[tx,tz]=p.final;
  let moving=false;
  if(tx!==undefined){const dx=tx-p.x,dz=tz-p.z,d=Math.hypot(dx,dz),far=Math.hypot(p.x-P.x,p.z-P.z)>38,sp=p.sp*(far?9:1)*dt;
   if(d<=sp+.02){p.x=tx;p.z=tz;if(p.path.length)p.path.shift();else{p.final=null;p.idleT=rnd(5,25);}
    if(!p.path.length&&!p.final&&g.hide){p.active=false;}}
   else{p.x+=dx/d*sp;p.z+=dz/d*sp;p.face=Math.atan2(dx,dz);moving=true;}}
  else if(g.rect&&(p.idleT-=dt)<=0)p.final=randIn(g.rect);
  const rg=p.rig.g;rg.position.set(p.x,0,p.z);let df=p.face-rg.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));rg.rotation.y+=df*.2;animate(p.rig,moving&&!paused,dt,1);});}
