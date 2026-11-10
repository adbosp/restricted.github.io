/* =====================================================================
   CRESTMOOR, OREGON · map data
   Roads: Main St z=0 · Oak Ave x=0 · Elm St z=-60 · Cedar Ln z=60 · West Rd x=-95 · East Rd x=95
   ===================================================================== */
const RW=4.5,SWK=7.5;                  // road half width, sidewalk outer edge
const XR=[-95,0,95],ZR=[-60,0,60];     // road centre lines
const ROADS=[{ax:'x',c:0,name:'Main St'},{ax:'x',c:-60,name:'Elm St'},{ax:'x',c:60,name:'Cedar Ln'},{ax:'z',c:0,name:'Oak Ave'},{ax:'z',c:-95,name:'West Rd'},{ax:'z',c:95,name:'East Rd'}];
const WX0=-128,WX1=128,WZ0=-82,WZ1=82;  // world bounds

/* Buildings. front = side with the entrance (n/s/e/w), at = entrance position along that side.
   band = depth of the back strip that holds the rooms (rooms open onto the lobby in front).
   rooms[].a = span along the front axis. lock: open if any of hours / items / flag is satisfied. */
const BLD={
 hall:{name:'Tòa Thị Chính Crestmoor',x0:10,x1:36,z0:-32,z1:-9,h:8.5,front:'s',at:23,style:'civic',floor:'wood',band:13,lock:{hours:[8,18]},
  lobby:{name:'Sảnh Tòa thị chính',zone:'public'},auth:['dave','melania'],
  rooms:[{id:'h_mayor',name:'Văn phòng Thị trưởng Keller',a:[10,19],zone:'staff',lock:{items:['__never']},kind:'mayor',floor:'carpet'},
         {id:'h_council',name:'Phòng họp Hội đồng',a:[19,36],zone:'public',kind:'council',lock:{hours:[8,18]}}]},
 bank:{name:'Ngân hàng Pryce',x0:40,x1:54,z0:-26,z1:-9,h:6.5,front:'s',at:47,style:'stone',floor:'tile',band:8,lock:{hours:[9,17]},
  lobby:{name:'Sảnh Ngân hàng Pryce',zone:'public'},auth:['morgan'],
  rooms:[{id:'b_office',name:'Phòng CEO Morgan Pryce',a:[40,47],zone:'staff',lock:{items:['__never']},kind:'office2',floor:'carpet'},
         {id:'b_vault',name:'Kho tiền',a:[47,54],zone:'secure',lock:{items:['__never']},kind:'vault'}]},
 diner:{name:'Crestmoor Diner',x0:58,x1:72,z0:-24,z1:-9,h:4.6,front:'s',at:65,style:'diner',floor:'tile',band:6,lock:{hours:[6,23]},
  lobby:{name:'Crestmoor Diner',zone:'public'},auth:[],
  rooms:[{id:'d_kitchen',name:'Bếp quán',a:[58,66],zone:'staff',kind:'kitchen'},{id:'d_wc',name:'Nhà vệ sinh',a:[66,72],zone:'public',kind:'wc'}]},
 police:{name:'Đồn Cảnh sát Crestmoor',x0:74,x1:86,z0:-28,z1:-9,h:6.5,front:'s',at:80,style:'brick',floor:'tile',band:8,
  lobby:{name:'Sảnh đồn cảnh sát',zone:'public'},auth:['lynda','natasha'],
  rooms:[{id:'p_office',name:'Phòng Đại úy Ford',a:[74,80],zone:'staff',kind:'office'},
         {id:'p_evid',name:'Kho tang vật',a:[80,86],zone:'secure',lock:{items:['__never']},kind:'evidence'}]},
 clinic:{name:'Phòng khám Crestmoor',x0:10,x1:26,z0:-51,z1:-38,h:4.8,front:'n',at:18,style:'plaster',floor:'tile',band:6,lock:{hours:[8,18]},
  lobby:{name:'Phòng chờ phòng khám',zone:'public'},auth:[],
  rooms:[{id:'c_exam',name:'Phòng khám bệnh',a:[10,18],zone:'semi',kind:'exam'},{id:'c_pharm',name:'Quầy thuốc',a:[18,26],zone:'staff',kind:'pharm'}]},
 college:{name:'Đại học Crestmoor',x0:34,x1:72,z0:-51,z1:-36,h:7.5,front:'n',at:53,style:'brick',floor:'wood',band:7,lock:{hours:[7,19]},
  lobby:{name:'Hành lang Đại học Crestmoor',zone:'public'},auth:['bancroft','laura'],
  rooms:[{id:'k_class1',name:'Giảng đường năm nhất',a:[34,45],zone:'public',kind:'class'},{id:'k_chem',name:'Phòng thí nghiệm Hóa',a:[45,56],zone:'public',kind:'class'},
         {id:'k_dean',name:'Văn phòng Hiệu trưởng Bancroft',a:[56,63],zone:'staff',kind:'office2',floor:'carpet'},{id:'k_lib',name:'Thư viện',a:[63,72],zone:'public',kind:'library'}]},
 mart:{name:'Crestmoor Mart',x0:10,x1:24,z0:9,z1:24,h:4.6,front:'n',at:17,style:'shop',floor:'tile',band:6,lock:{hours:[7,22]},
  lobby:{name:'Crestmoor Mart',zone:'public'},auth:[],
  rooms:[{id:'m_store',name:'Kho hàng',a:[17,24],zone:'staff',kind:'storage'}]},
 hardware:{name:'Tiệm kim khí Crestmoor',x0:28,x1:42,z0:9,z1:24,h:4.8,front:'n',at:33,style:'brickred',floor:'wood',band:6,lock:{hours:[8,18]},
  lobby:{name:'Tiệm kim khí',zone:'public'},auth:[],
  rooms:[{id:'w_back',name:'Kho sau tiệm',a:[34,42],zone:'staff',kind:'storage'}]},
 flowers:{name:'Tiệm hoa Willow',x0:46,x1:56,z0:9,z1:20,h:4.4,front:'n',at:51,style:'pastel',floor:'wood',band:0,lock:{hours:[8,18]},
  lobby:{name:'Tiệm hoa',zone:'public'},auth:[],rooms:[]},
 studio:{name:'Đài tin tức KCRM-TV',x0:60,x1:78,z0:9,z1:26,h:6.5,front:'n',at:64,style:'modern',floor:'carpet',band:8,lock:{hours:[8,21]},
  lobby:{name:'Sảnh đài KCRM',zone:'public'},auth:['jeanie'],
  rooms:[{id:'t_news',name:'Phòng tin tức',a:[60,69],zone:'semi',kind:'news'},{id:'t_ctrl',name:'Phòng điều khiển',a:[69,78],zone:'staff',kind:'control'}]},
 inn:{name:'Quán bar Red Lantern',x0:12,x1:32,z0:36,z1:51,h:7,front:'s',at:22,style:'inn',floor:'wood',band:7,lock:{hours:[16,3]},
  lobby:{name:'Quầy bar Red Lantern',zone:'public'},auth:['williams'],
  rooms:[{id:'i_r1',name:'Phòng VIP',a:[12,19],zone:'secure',lock:{items:['__never']},kind:'bedroom'},
         {id:'i_r2',name:'Kho rượu',a:[19,26],zone:'staff',lock:{items:['__never']},kind:'storage'}]},
 gas:{name:'Trạm xăng Crestmoor',x0:74,x1:86,z0:40,z1:50,h:4.2,front:'s',at:80,style:'shop',floor:'tile',band:0,lock:{hours:[6,22]},
  lobby:{name:'Cửa hàng trạm xăng',zone:'public'},auth:[],rooms:[]},
 church:{name:'Nhà thờ Crestmoor',x0:-42,x1:-24,z0:-52,z1:-30,h:7,front:'s',at:-33,style:'church',floor:'wood',band:7,lock:{hours:[6,21]},
  lobby:{name:'Gian chính nhà thờ',zone:'public'},auth:[],
  rooms:[{id:'ch_office',name:'Văn phòng nhà thờ',a:[-42,-36],zone:'semi',kind:'office2'},
         {id:'ch_arch',name:'Kho lưu trữ',a:[-30,-24],zone:'secure',lock:{items:['__never']},kind:'archive'}]},
 shed:{name:'Kho đồ cũ sau công viên',x0:-87,x1:-78,z0:-51,z1:-44,h:3.8,front:'s',at:-82.5,style:'wood',floor:'wood',band:0,lock:{hours:[14,22]},
  lobby:{name:'Kho đồ cũ của Paul',zone:'semi'},auth:['paul'],rooms:[]},
 whit:{name:'Nhà Whitfield · số 14',x0:-32,x1:-14,z0:10,z1:26,h:6.4,front:'n',at:-23,style:'house',tint:0xf4f1ea,floor:'wood',band:7,home:1,lock:{flag:'movedIn'},
  lobby:{name:'Phòng khách nhà Whitfield',zone:'public'},auth:['sara','rossie'],
  rooms:[{id:'w_kitchen',name:'Bếp nhà Whitfield',a:[-32,-21],zone:'public',kind:'wkitchen'},{id:'w_stair',name:'Chân cầu thang',a:[-21,-14],zone:'public',kind:'stairs'}]},
 // upstairs of the Whitfield house: a sealed shell reached only by the staircase (see STAIRS)
 whit2:{name:'Tầng 2 nhà Whitfield',x0:110,x1:122,z0:20,z1:40,h:3.6,front:'w',at:30,style:'house',tint:0xf4f1ea,floor:'wood',band:7,home:1,upper:1,lock:{items:['__never']},
  lobby:{name:'Hành lang tầng 2',zone:'public'},auth:['sara','rossie'],
  rooms:[{id:'w_ethan',name:'Phòng của Ethan',a:[20,25],zone:'public',kind:'ethan'},{id:'w_rossie',name:'Phòng của Rossie',a:[25,30],zone:'semi',kind:'rossie'},
         {id:'w_wc',name:'Nhà vệ sinh chung',a:[30,34],zone:'public',kind:'wc'},{id:'w_sara',name:'Phòng ngủ của Sara',a:[34,40],zone:'semi',kind:'sara'}]},
 dawson:{name:'Nhà Dawson',x0:-54,x1:-40,z0:10,z1:24,h:6,front:'n',at:-47,style:'house',tint:0xe8d6c0,floor:'wood',band:6,lock:{items:['__never']},
  lobby:{name:'Phòng khách nhà Dawson',zone:'staff'},auth:['may'],
  rooms:[{id:'r_may',name:'Phòng ngủ nhà Dawson',a:[-54,-47],zone:'staff',lock:{items:['__never']},kind:'bedroom2'},{id:'r_study',name:'Phòng làm việc của Hert',a:[-47,-40],zone:'staff',lock:{items:['__never']},kind:'office2'}]},
 apts:{name:'Chung cư sinh viên Pine Court',x0:-34,x1:-12,z0:34,z1:51,h:9.6,front:'s',at:-23,style:'brick',floor:'wood',band:7,lock:{hours:[6,23]},
  lobby:{name:'Sảnh chung cư',zone:'public'},auth:[],
  rooms:[{id:'ap_a',name:'Căn hộ A (Lucy)',a:[-34,-27],zone:'staff',lock:{items:['__never']},kind:'bedroom'},
         {id:'ap_b',name:'Căn hộ B (Lily)',a:[-27,-20],zone:'staff',lock:{items:['__never']},kind:'bedroom'},
         {id:'ap_c',name:'Căn hộ C (Max & Evan)',a:[-20,-12],zone:'staff',lock:{items:['__never']},kind:'teen'}]},
 mill:{name:'Xưởng cũ gần trường',x0:-122,x1:-106,z0:-36,z1:-14,h:7,front:'e',at:-24,style:'mill',floor:'concrete',band:7,lock:{items:['__never']},
  lobby:{name:'Xưởng bỏ hoang',zone:'secure'},auth:['williams'],
  rooms:[{id:'ml_office',name:'Văn phòng công trường',a:[-36,-25],zone:'secure',kind:'site'}]},
 // closed houses (facade only)
 h3:{name:'Nhà Ames',x0:-76,x1:-62,z0:10,z1:24,h:6,front:'n',at:-69,style:'house',tint:0xd8e4cf,closed:1},
 h4:{name:'Nhà Keller',x0:-62,x1:-46,z0:36,z1:51,h:6,front:'s',at:-54,style:'house',tint:0xe9d2d2,closed:1},
 h5:{name:'Nhà Ortega',x0:-86,x1:-70,z0:36,z1:51,h:6,front:'s',at:-78,style:'house',tint:0xd9d2ea,closed:1},
 h6:{name:'Nhà kho Cedar',x0:40,x1:56,z0:36,z1:50,h:5,front:'s',at:48,style:'brickred',closed:1},
};
// outdoor places: node + wander rect [x0,z0,x1,z1]
const OUT={
 green:{name:'Công viên Crestmoor',node:[-52,-16],rect:[-62,-22,-44,-11]},
 pond:{name:'Bờ hồ công viên',node:[-66,-16],rect:[-74,-18,-60,-15]},
 gazebo:{name:'Vọng lâu',node:[-52,-40],rect:[-55,-43,-49,-37]},
 gaspump:{name:'Cột bơm xăng',node:[66,45],rect:[62,41,71,49]},
 busstop:{name:'Trạm xe buýt Main St',node:[-10,6],rect:[-13,5,-9,7]},
 square:{name:'Quảng trường trước Tòa thị chính',node:[23,-6.5],rect:[16,-7,30,-5.5]},
 mayfence:{name:'Hàng rào nhà Dawson',node:[-41.5,7.4],rect:[-43.5,7.1,-39.5,7.7]},
};
const STAIRS={down:[-17.6,23.4],up:[112.5,38.4]};
const ZONE_NAME={public:'',semi:' · RIÊNG TƯ',staff:' · CHỈ NHÂN VIÊN',secure:' · KHU CẤM'};

/* ---------- derive rooms, lobbies, doors ---------- */
const ROOMS=[],RM={};
const SIDE_N={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]};
Object.entries(BLD).forEach(([id,b])=>{b.id=id;const f=b.front,nz=SIDE_N[f];b.nx=nz[0];b.nz=nz[1];
 // entrance point on the facade
 b.ex=f==='e'?b.x1:f==='w'?b.x0:b.at;b.ez=f==='s'?b.z1:f==='n'?b.z0:b.at;
 if(b.closed)return;
 const band=b.band||0;let L={x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1};
 if(f==='s')L.z0=b.z0+band;else if(f==='n')L.z1=b.z1-band;else if(f==='e')L.x0=b.x0+band;else L.x1=b.x1-band;
 b.lob=Object.assign({id:id+'_lobby',b:id,lobby:1,zone:b.lobby.zone,name:b.lobby.name,kind:'lobby'},L);ROOMS.push(b.lob);RM[b.lob.id]=b.lob;
 b.rooms.forEach(r=>{r.b=id;const[a0,a1]=r.a;
  if(f==='s'){Object.assign(r,{x0:a0,x1:a1,z0:b.z0,z1:b.z0+band});r.door=['s',(a0+a1)/2];}
  else if(f==='n'){Object.assign(r,{x0:a0,x1:a1,z0:b.z1-band,z1:b.z1});r.door=['n',(a0+a1)/2];}
  else if(f==='e'){Object.assign(r,{z0:a0,z1:a1,x0:b.x0,x1:b.x0+band});r.door=['e',(a0+a1)/2];}
  else {Object.assign(r,{z0:a0,z1:a1,x0:b.x1-band,x1:b.x1});r.door=['w',(a0+a1)/2];}
  ROOMS.push(r);RM[r.id]=r;});});
function roomAt(x,z){for(const r of ROOMS)if(!r.lobby&&x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1)return r;for(const r of ROOMS)if(r.lobby&&x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1)return r;return null;}
function bldAt(x,z){for(const id in BLD){const b=BLD[id];if(!b.closed&&x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1)return id;}return null;}
function footprintAt(x,z,pad=0){for(const id in BLD){const b=BLD[id];if(x>b.x0-pad&&x<b.x1+pad&&z>b.z0-pad&&z<b.z1+pad)return id;}return null;}

/* =====================================================================
   COLLISION (static rects in a grid + doors + dynamic circles)
   ===================================================================== */
const SOL=[],GRID={},GS=8;
function solid(x0,x1,z0,z1,tag){const r={x0:Math.min(x0,x1),x1:Math.max(x0,x1),z0:Math.min(z0,z1),z1:Math.max(z0,z1),tag};SOL.push(r);
 for(let gx=Math.floor(r.x0/GS);gx<=Math.floor(r.x1/GS);gx++)for(let gz=Math.floor(r.z0/GS);gz<=Math.floor(r.z1/GS);gz++){const k=gx+','+gz;(GRID[k]||(GRID[k]=[])).push(r);}return r;}
const CIRC=[];// static circles {x,z,r}
function circleHit(px,pz,pr,r){const cx=clamp(px,r.x0,r.x1),cz=clamp(pz,r.z0,r.z1);return (px-cx)**2+(pz-cz)**2<pr*pr;}

/* =====================================================================
   BUILDINGS
   ===================================================================== */
const WALLMESH=[],DOORS=[],ROOF={},WINDOWS=[],FXG={},IGRP={};
const winMat=new THREE.MeshLambertMaterial({map:TX.window,emissive:0x000000});
// all windows live in one instanced mesh; a wall hides its windows by scaling them to zero
const WIN_LIST=[];let WIN_IM=null;const _wm=new THREE.Matrix4(),_wq=new THREE.Quaternion(),_wp=new THREE.Vector3(),_ws=new THREE.Vector3();
function setWinM(i){const w=WIN_LIST[i];_wp.set(w[0],w[1],w[2]);_ws.set(w[6]?w[3]:0,w[6]?w[4]:0,w[6]?w[5]:0);_wm.compose(_wp,_wq,_ws);WIN_IM.setMatrixAt(i,_wm);WIN_IM.instanceMatrix.needsUpdate=true;}
function winDeco(x,y,z,sx,sy,sz){const i=WIN_LIST.length;WIN_LIST.push([x,y,z,sx,sy,sz,true]);return{position:{y},_i:i,set visible(v){const w=WIN_LIST[this._i];if(w[6]===v)return;w[6]=v;if(WIN_IM)setWinM(this._i);}};}
const STYLE={
 civic:{ext:'brick',tint:0xe9ddd0,trim:0xf6f2ea},stone:{ext:'stone',tint:0xf2efe8,trim:0xe8e2d6},diner:{ext:'facade',tint:0xd6eef0,trim:0xd84a3a},
 brick:{ext:'brick',tint:0xffffff,trim:0xeee6d8},brickred:{ext:'brick',tint:0xf0c8b8,trim:0x2f4a3a},plaster:{ext:'plaster',tint:0xf4f0ea,trim:0x3a6a8a},
 shop:{ext:'facade',tint:0xf0efe6,trim:0x2f6b8f},pastel:{ext:'clap',tint:0xf6d8e2,trim:0xffffff},modern:{ext:'facade',tint:0xcfd6de,trim:0xc0392b},
 inn:{ext:'clap',tint:0xd8e6d0,trim:0xffffff},church:{ext:'clap',tint:0xffffff,trim:0xffffff},wood:{ext:'siding',tint:0xc9a879,trim:0x6b4a2a},
 house:{ext:'clap',tint:0xffffff,trim:0xffffff},mill:{ext:'brick',tint:0x9a8070,trim:0x4a3a30}};
function extMats(b,nx,nz){const st=STYLE[b.style];return(len,h)=>{const ex=mat(st.ext,len/4,h/3,b.tint||st.tint),inn=mat('plaster',len/3,1),top=C(0xe2e4df);
 const m=[ex,ex,top,top,ex,ex];m[nx>0?1:nx<0?0:nz>0?5:4]=inn;return m;};}
const intMats=(len,h)=>{const p=mat('plaster',len/3,1);return[p,p,C(0xe2e4df),C(0xe2e4df),p,p];};
// one straight wall from a to b along ax at constant c; gaps: [{pos,w,door}]
function wallRun(bid,ax,c,a,z,opt){const gs=(opt.gaps||[]).filter(g=>g.pos>a&&g.pos<z).sort((p,q)=>p.pos-q.pos);let s=a;const pieces=[];
 gs.forEach(g=>{pieces.push([s,g.pos-g.w/2]);s=g.pos+g.w/2;});pieces.push([s,z]);const T=opt.t||.22;
 pieces.forEach(([p0,p1])=>{if(p1-p0<.05)return;const h=opt.h||WH;
  const x0=ax==='x'?p0:c-T/2,x1=ax==='x'?p1:c+T/2,z0=ax==='z'?p0:c-T/2,z1=ax==='z'?p1:c+T/2;
  const len=p1-p0;const o=new THREE.Mesh(B(x1-x0,h,z1-z0),opt.mats(len,h));o.position.set((x0+x1)/2,h/2,(z0+z1)/2);o.castShadow=o.receiveShadow=true;(opt.parent||WORLD).add(o);
  const e={m:o,b:bid,ext:!!opt.ext,nx:opt.nx||0,nz:opt.nz||0,s:1,h,deco:[],x0,x1,z0,z1};WALLMESH.push(e);solid(x0,x1,z0,z1,'wall');
  if(opt.ext&&!opt.noWin){// windows: ground row + upper rows
   const rows=Math.max(1,Math.floor((h-.6)/3.1));const n=Math.floor(len/3.2);
   for(let row=0;row<rows;row++)for(let i=0;i<n;i++){const t=p0+(i+.5)*len/n;if(row===0&&opt.doorAt!==undefined&&Math.abs(t-opt.doorAt)<2.2)continue;
    const big=row===0&&opt.shop;const ww=big?2.4:1.4,wh=big?2:1.3,wy=row===0?(big?1.5:1.7):1.9+row*3.1;if(wy+wh/2>h-.3)continue;
    const wx=ax==='x'?t:c+opt.nx*(T/2+.03),wz=ax==='z'?t:c+opt.nz*(T/2+.03);
    e.deco.push(winDeco(wx,wy,wz,ax==='x'?ww:.05,wh,ax==='z'?ww:.05));
    // shutters on houses
    if(opt.shutter&&row>=0&&!big){[-1,1].forEach(sd=>{const sx=ax==='x'?t+sd*(ww/2+.22):wx,sz=ax==='z'?t+sd*(ww/2+.22):wz;const s2=new THREE.Mesh(B(ax==='x'?.36:.06,wh,ax==='z'?.36:.06),C(opt.shutter));s2.position.set(sx,wy,sz);WORLD.add(s2);e.deco.push(s2);});}}}});}
function makeDoor(d){// d:{x,z,ax,w,b,lock,entr}
 const piv=new THREE.Group();const w=d.w;
 if(d.ax==='x')piv.position.set(d.x-w/2,0,d.z);else{piv.position.set(d.x,0,d.z-w/2);piv.rotation.y=-Math.PI/2;}(d.parent||WORLD).add(piv);
 const locked=!!d.lock,col=d.entr?0x7a4a2a:locked?0xa0523a:0x7fae8a;
 const pm=d.glass?new THREE.MeshLambertMaterial({color:0x9fc9e8,transparent:true,opacity:.55}):mat('wood',1,1,col);
 mesh(B(w,2.3,.07),pm,w/2,1.15,0,piv,false);mesh(new THREE.SphereGeometry(.06,8,6),C(0xe0c050),w-.15,1.1,.08,piv,false);
 if(locked&&!d.entr){mesh(B(.16,.24,.1),C(0x333333,0x220000),w-.15,1.42,.09,piv,false);mesh(B(.05,.05,.02),C(0,0xff3322),w-.15,1.48,.15,piv,false);}
 d.piv=piv;d.ang=0;d.box={x0:d.ax==='x'?d.x-w/2:d.x-.15,x1:d.ax==='x'?d.x+w/2:d.x+.15,z0:d.ax==='z'?d.z-w/2:d.z-.15,z1:d.ax==='z'?d.z+w/2:d.z+.15};DOORS.push(d);return d;}

function gable(cx,cz,W,D,tex,rise,along,tint=0xffffff,parent=PUT,endMat){const g=new THREE.Group();g.position.set(cx,0,cz);parent.add(g);
 const span=along==='x'?D:W,len=along==='x'?W:D,slope=Math.hypot(span/2,rise),ang=Math.atan2(rise,span/2),m=mat(tex,len/3,slope/3,tint);
 for(const s of[-1,1]){if(along==='x'){const p=mesh(B(len+.8,.22,slope+.5),m,0,rise/2,s*span/4,g);p.rotation.x=s*ang;}
  else{const p=mesh(B(slope+.5,.22,len+.8),m,s*span/4,rise/2,0,g);p.rotation.z=-s*ang;}}
 const sh=new THREE.Shape();sh.moveTo(-span/2,0);sh.lineTo(span/2,0);sh.lineTo(0,rise);sh.lineTo(-span/2,0);
 for(const e of[-len/2,len/2]){const gm=mesh(new THREE.ShapeGeometry(sh),endMat||new THREE.MeshLambertMaterial({map:TX.clap,side:THREE.DoubleSide}),along==='x'?e:0,0,along==='x'?0:e,g,false);if(along==='x')gm.rotation.y=Math.PI/2;}
 return g;}

function buildBuilding(id){const b=BLD[id],st=STYLE[b.style],W=b.x1-b.x0,D=b.z1-b.z0,cx=(b.x0+b.x1)/2,cz=(b.z0+b.z1)/2,h=b.h;PUT=WORLD;
 const f=b.front,frontAx=(f==='n'||f==='s')?'x':'z';const FX=new THREE.Group();WORLD.add(FX);FXG[id]=FX;
 // floor
 if(!b.closed)plane(W,D,mat(b.floor||'tile',W/4,D/4),cx,.03,cz);
 // exterior walls
 const sides=[['n','x',b.z0,b.x0,b.x1,0,-1],['s','x',b.z1,b.x0,b.x1,0,1],['w','z',b.x0,b.z0,b.z1,-1,0],['e','z',b.x1,b.z0,b.z1,1,0]];
 sides.forEach(([s,ax,c,a,z,nx,nz])=>{const gaps=[];const isF=s===f;
  if(isF&&!b.closed&&!b.upper)gaps.push({pos:b.at,w:2.2});
  wallRun(id,ax,c,a,z,{ext:1,nx,nz,h,t:.3,gaps,doorAt:isF?b.at:undefined,shop:isF&&['shop','diner','brickred','pastel','modern'].includes(b.style),
   shutter:b.style==='house'?0x2f4a5a:b.style==='inn'?0x3a5a3a:0,noWin:b.style==='mill'&&s!=='e'?0:0,mats:extMats(b,nx,nz)});
  if(isF&&!b.upper){// entrance door (+ fake door on closed houses)
   const ex=b.ex+nx*.16,ez=b.ez+nz*.16;
   if(b.closed){const dm=mesh(B(ax==='x'?1.3:.08,2.3,ax==='z'?1.3:.08),mat('wood',1,1,0x7a3a2a),ex,1.15,ez,WORLD,false);}
   else makeDoor({x:ax==='x'?b.at:c,z:ax==='z'?b.at:c,ax,w:2.2,b:id,lock:b.lock,entr:1,glass:['shop','diner','modern','stone','plaster','brickred','pastel'].includes(b.style),bld:b});
   // stoop + awning + sign
   plane(ax==='x'?3:1.4,ax==='z'?3:1.4,mat('concrete',1,1),b.ex+nx*.8,.05,b.ez+nz*.8);
   PUT=FX;const sy=Math.min(h-.7,3.5),sw=Math.min(8,(ax==='x'?W:D)*.6);
   sign(b.name,b.ex+nx*.25+(ax==='x'?0:0),sy,b.ez+nz*.25,ax==='x'?(nz>0?0:Math.PI):(nx>0?Math.PI/2:-Math.PI/2),sw,.9,b.style==='diner'?'#d84a3a':b.style==='modern'?'#c0392b':'#2b1d3a','#fff6e4');
   PUT=WORLD;if(['shop','diner','brickred','pastel','inn'].includes(b.style)){const aw=mesh(B(ax==='x'?3.4:1.4,.12,ax==='z'?3.4:1.4),C(st.trim),b.ex+nx*.7,2.75,b.ez+nz*.7,FX);aw.rotation[ax==='x'?'x':'z']=(ax==='x'?nz:-nx)*.25;}
  }});
 // cornice / trim
 const tm=C(st.trim);[[W+.5,.3,.5,cx,b.z0],[W+.5,.3,.5,cx,b.z1],[.5,.3,D+.5,b.x0,cz],[.5,.3,D+.5,b.x1,cz]].forEach(([w,hh,d,x,z])=>{const o=mesh(B(w,hh,d),tm,x,h-.15,z,WORLD,false);WALLMESH.push({m:o,b:id,ext:1,trim:1,nx:0,nz:0,s:1,h:h,deco:[],x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,cornice:1});});
 // roof (own group: hidden when the player is inside or the camera looks through it)
 const R=new THREE.Group();R.position.y=h;WORLD.add(R);ROOF[id]=R;PUT=R;
 const flatTop=()=>{mesh(B(W+.2,.25,D+.2),[C(0xc8c8c0),C(0xc8c8c0),mat('roofflat',W/4,D/4),C(0xc8c8c0),C(0xc8c8c0),C(0xc8c8c0)],cx,-.12,cz,R,false);
  [[W,.7,.25,cx,b.z0+.12],[W,.7,.25,cx,b.z1-.12],[.25,.7,D,b.x0+.12,cz],[.25,.7,D,b.x1-.12,cz]].forEach(([w,hh,d,x,z])=>mesh(B(w,hh,d),mat(st.ext,w/4,.3,b.tint||st.tint),x,.35,z,R));};
 const along=W>=D?'x':'z';
 if(['house','inn','church','wood','pastel','mill'].includes(b.style)){
  const tex=b.style==='mill'?'bluemetal':'shingle';mesh(B(W+.2,.12,D+.2),C(0xd8d8d0),cx,-.06,cz,R,false);
  gable(cx,cz,W,D,tex,b.style==='church'?4.2:b.style==='mill'?2.6:Math.min(4,Math.min(W,D)*.32),b.style==='church'?'z':along,b.style==='house'?[0x6b5a4e,0x5a4a5e,0x4e5a6b][(Math.abs(b.x0)|0)%3]:0xffffff,R,
   new THREE.MeshLambertMaterial({map:TX[STYLE[b.style].ext==='brick'?'brick':'clap'],color:b.tint||st.tint,side:THREE.DoubleSide}));
  if(b.style==='house'){mesh(B(.8,2.2,.8),mat('brick',1,1),b.x0+2,1.6,cz,R);}
 } else flatTop();
 if(id==='hall'){// cupola + clock + portico columns
  mesh(B(4,2.2,4),C(0xf6f2ea),cx,1.1,cz,R);mesh(new THREE.CylinderGeometry(.3,2.6,2.6,8),C(0x4a6a5a),cx,3.5,cz,R);
  const cl=mesh(new THREE.CylinderGeometry(.9,.9,.12,24),C(0xfdf8e8),cx,1.2,cz+2.05,R,false);cl.rotation.x=Math.PI/2;
  PUT=FX;for(let i=-2;i<=2;i++){if(i===0)continue;mesh(new THREE.CylinderGeometry(.32,.36,5.2,12),C(0xf6f2ea),b.at+i*2.6,2.6,b.z1+1.6);}
  mesh(B(13,.5,2.4),C(0xf6f2ea),b.at,5.4,b.z1+1.2);plane(13,3,mat('concrete',3,1),b.at,.06,b.z1+1.5);
  const sh=new THREE.Shape();sh.moveTo(-6.6,0);sh.lineTo(6.6,0);sh.lineTo(0,1.6);sh.lineTo(-6.6,0);mesh(new THREE.ShapeGeometry(sh),C(0xf6f2ea),b.at,5.65,b.z1+2.41,FX,false);PUT=WORLD;
 }
 if(id==='church'){// steeple at the front-left corner (hidden with the roof when the player is inside)
  const tx=b.x0+2.3,tz=b.z1-2.2;const T=new THREE.Group();T.position.y=-h;R.add(T);PUT=T;mesh(B(4.2,h+5,4.2),mat('clap',2,3),tx,(h+5)/2,tz,T);
  const bel=grp(tx,tz,0,T);bel.position.y=h+5;mesh(B(3.6,3,3.6),C(0xffffff),0,1.5,0,bel);mesh(B(2,2,3.8),C(0x2b2b2b),0,1.5,0,bel,false);mesh(B(3.8,2,2),C(0x2b2b2b),0,1.5,0,bel,false);
  window.CHURCH_BELL=mesh(new THREE.CylinderGeometry(.35,.8,1.1,14,1,true),C(0xc49a3a),0,1.4,0,bel,false);
  mesh(new THREE.ConeGeometry(2.6,8,4),mat('shingle',2,3,0x5a5a62),0,7,0,bel).rotation.y=Math.PI/4;mesh(B(.15,1.4,.15),C(0xd4af37),0,11.6,0,bel,false);mesh(B(.8,.15,.15),C(0xd4af37),0,11.8,0,bel,false);
  solid(tx-2.1,tx+2.1,tz-2.1,tz+2.1,'wall');PUT=WORLD;
  // a short stub of the tower stays visible when the roof is hidden
  mesh(B(4.2,1.2,4.2),mat('clap',2,1),tx,.6,tz,WORLD);
 }
 if(b.closed)solid(b.x0,b.x1,b.z0,b.z1,'house');
 PUT=WORLD;
 if(b.closed)return;
 const IG=new THREE.Group();WORLD.add(IG);IGRP[id]=IG;IG.visible=false;
 // interior partitions: front line of the band, with a door per room, plus walls between rooms
 const band=b.band;if(band&&b.rooms.length){
  const lineC=f==='s'?b.z0+band:f==='n'?b.z1-band:f==='e'?b.x0+band:b.x1-band;
  b.rooms.forEach((r,i)=>{const[a0,a1]=r.a;r.doorPos=r.door[1];
   wallRun(id,frontAx,lineC,a0,a1,{mats:intMats,parent:IG,gaps:[{pos:r.doorPos,w:1.5}]});
   const dd=makeDoor({x:frontAx==='x'?r.doorPos:lineC,z:frontAx==='z'?r.doorPos:lineC,ax:frontAx,w:1.5,b:id,lock:r.lock,room:r,parent:IG});r.dObj=dd;
   // side partitions (skip building edges and shared edges already built)
   [a0,a1].forEach((p,k)=>{const edge=frontAx==='x'?(Math.abs(p-b.x0)<.05||Math.abs(p-b.x1)<.05):(Math.abs(p-b.z0)<.05||Math.abs(p-b.z1)<.05);if(edge)return;
    if(k===0&&b.rooms.some(o=>o!==r&&Math.abs(o.a[1]-p)<.05))return;
    const lo=f==='s'||f==='e'?(frontAx==='x'?b.z0:b.x0):lineC,hi=f==='s'||f==='e'?lineC:(frontAx==='x'?b.z1:b.x1);
    wallRun(id,frontAx==='x'?'z':'x',p,lo,hi,{mats:intMats,parent:IG});});
   plane(r.x1-r.x0-.2,r.z1-r.z0-.2,mat(r.floor||b.floor||'wood',(r.x1-r.x0)/4,(r.z1-r.z0)/4),(r.x0+r.x1)/2,.036,(r.z0+r.z1)/2,IG);
   furnish(r);});}
 furnish(b.lob);PUT=WORLD;}

/* ---------- furniture per room kind ---------- */
function furnish(r){PUT=IGRP[r.b]||WORLD;const{x0,x1,z0,z1}=r,cx=(x0+x1)/2,cz=(z0+z1)/2,W=x1-x0,D=z1-z0;const b=BLD[r.b];
 const back=r.lobby?null:r.door[0];// rooms face the door; put things at the far side
 const far=(t)=>back==='s'?z0+t:back==='n'?z1-t:back==='e'?x0+t:x1-t;
 const rotIn=back==='s'?0:back==='n'?Math.PI:back==='e'?Math.PI/2:-Math.PI/2;
 const ax=back==='s'||back==='n'?'x':'z';const P2=(along,depth)=>ax==='x'?[along,far(depth)]:[far(depth),along];
 const ca=ax==='x'?cx:cz,span=ax==='x'?W:D;
 const add=(fn,along,depth,...rest)=>{const[x,z]=P2(along,depth);return F[fn](x,z,rotIn,...rest);};
 switch(r.kind){
  case'mayor':{const[x,z]=P2(ca,1.8);F.lux('rug_exec',x,z,rotIn,.03,5,.02,3,0x7a2a2a);F.lux('exec_desk',x,z,rotIn,0,3,.78,1.1,0x6b4530);const[x2,z2]=P2(ca,.9);F.lux('exec_chair',x2,z2,rotIn,0,.7,1.3,.7,0x5a2a2a);
   add('shelf',x0+1.3>ca-span/2+1.3?ca-span/2+1.3:ca,.35);const[x3,z3]=P2(ca+span/2-1,.7);F.lux('big_plant',x3,z3,0,0,.6,1.6,.6,0x3f8a2c);const[x4,z4]=P2(ca,.15);F.lux('artwork',x4,z4,rotIn,1.4,1.6,1,.08,0x8a6a3a);
   const fl=mesh(new THREE.CylinderGeometry(.03,.03,2.4,6),C(0x999999),...P2(ca-span/2+.6,.6).flatMap((v,i)=>i?[1.2,v]:[v]));break;}
  case'council':{for(let i=0;i<3;i++)for(let j=-2;j<=2;j++)add('chair',ca+j*1.4,D-2.2-i*1.4,0x6a2a2a);// public seats facing the dais
   const[x,z]=P2(ca,1.4);F.longtable(x,z,6,ax==='x'?0:Math.PI/2);sign('HỘI ĐỒNG THỊ TRẤN',...P2(ca,.13).flatMap((v,i)=>i?[2.4,v]:[v]),rotIn,5,.7,'#3a2a1a','#f6e2b0');
   const[px,pz]=P2(ca,3.6);mesh(B(.8,1.1,.6),mat('wood',1,1,0x7a5030),px,.55,pz);break;}
  case'office':for(let i=-1;i<=1;i+=2){add('desk',ca+i*span/4,1.6);add('computer',ca+i*span/4,1.6);add('chair',ca+i*span/4,2.3,0x34495e);}add('cabinet',ca+span/2-.6,.4);break;
  case'office2':add('desk',ca,1.5);add('computer',ca,1.5);add('chair',ca,.9,0x5a3a2a);add('shelf',ca-span/2+1.1,.3);add('plant',ca+span/2-.6,.5);add('cabinet',ca+span/2-.7,1.8);break;
  case'vault':{const[x,z]=P2(ca,1.2);F.safe(x,z,rotIn);F.safe(...P2(ca-1.6,1.2),rotIn);F.safe(...P2(ca+1.6,1.2),rotIn);break;}
  case'kitchen':add('stove',ca-1.5,.5);add('counter',ca+1,.45,3);add('cabinet',ca+span/2-.6,1.8);break;
  case'wc':add('cabinet',ca,.35);break;
  case'evidence':for(let i=-1;i<=1;i++)add('shelf',ca+i*1.8,.3,0x6f7a80);add('locker',ca,2.2,0x556070);break;
  case'exam':add('examBed',ca-1,1.3);add('cabinet',ca+span/2-.6,.4);add('desk',ca+1.8,2);break;
  case'pharm':add('shelf',ca-1.6,.3,0xf0f0f0);add('shelf',ca+.2,.3,0xf0f0f0);add('counter',ca,2.6,3.6);break;
  case'class':{const[bx,bz]=P2(ca,.15);F.board(bx,bz,rotIn);for(let i=-1;i<=1;i++)for(let j=0;j<2;j++){add('desk',ca+i*2.6,2.6+j*1.8);add('chair',ca+i*2.6,3.2+j*1.8,0x2f6f4f);}add('desk',ca,1.2);break;}
  case'lounge':add('sofa',ca,.7,0x8e5d4a);add('table',ca,2.6,2,0x16a085);add('counter',ca+span/2-.6,1.8,2);break;
  case'library':for(let i=-1;i<=1;i++)add('shelf',ca+i*2.4,.3);add('longtable',ca,3.4,Math.min(5,span-2));break;
  case'storage':for(let i=-1;i<=1;i++){add('crate',ca+i*1.8,.8,1);add('crate',ca+i*1.8+.4,1.9,.8);}add('shelf',ca+span/2-1,.3,0x7f8c8d);break;
  case'news':add('desk',ca-1.6,1.6);add('computer',ca-1.6,1.6);add('desk',ca+1.6,1.6);add('computer',ca+1.6,1.6);add('chair',ca-1.6,2.2,0x222222);add('chair',ca+1.6,2.2,0x222222);add('tv',ca,.3);break;
  case'control':for(let i=-1;i<=1;i++){add('computer',ca+i*1.3,.6);}add('counter',ca,.6,4.6,'metal');add('rack',ca+span/2-.7,1.8);break;
  case'bedroom':add('bed',ca-span/4,1.3,0x3a6ea5);add('shelf',ca+span/4,.3,0x8a6a4a);add('plant',ca+span/2-.6,D-1);break;
  case'bedroom2':add('bed',ca,1.3,0x8e44ad);add('cabinet',ca+span/2-.6,.4);break;
  case'teen':add('bed',ca-span/4,1.3,0x2a9d8f);add('desk',ca+span/4,.6);add('computer',ca+span/4,.6);add('chair',ca+span/4,1.2,0x222222);break;
  case'homekitchen':add('stove',ca-1.2,.5);add('counter',ca+1,.45,2.4);add('table',ca,3.6,2,0xc0392b);break;
  case'wkitchen':F.stove(-31.2,25,Math.PI);F.counter(-28.4,25.4,3.2,Math.PI,'wood');F.locker(-22,25.4,Math.PI,0xf2f2ee);F.table(-26.5,22.6,2,0x8a5a3a);
   for(const[cx,cz,cr]of[[-27.6,22.6,Math.PI/2],[-25.4,22.6,-Math.PI/2]])F.chair(cx,cz,cr,0x7a5030);
   {const ck=mesh(new THREE.CylinderGeometry(.32,.32,.06,20),C(0xfdf8e8),-31.86,2.2,22.6,PUT,false);ck.rotation.z=Math.PI/2;mesh(B(.04,.24,.03),C(0x222222),-31.82,2.27,22.6,PUT,false);mesh(B(.04,.03,.18),C(0x222222),-31.82,2.2,22.66,PUT,false);}
   mesh(B(.5,.3,.4),C(0x3a3a3a),-29.2,1.1,25.3,PUT,false);break;
  case'stairs':for(let i=0;i<8;i++){mesh(B(.55,.3*(i+1),1.4),mat('wood',1,1,0x8a5a3a),-20.4+i*.55,.15*(i+1),25.2);}mesh(B(4.6,.08,.08),C(0x5a3a22),-18.3,2.6,24.45,PUT,false);solid(-20.7,-16.1,24.5,26,'prop');
   F.shelf(-15,20,0,0x6b4a2a);break;
  case'ethan':F.bed(120.6,21.3,-Math.PI/2,0x5a6e8a);F.locker(117.6,20.5,0,0x9a7a5a);F.desk(121.3,24,-Math.PI/2);F.chair(120.5,24,Math.PI/2,0x6b4a2a);F.shelf(116.8,24.6,Math.PI,0x8a6a4a);
   mesh(new THREE.CylinderGeometry(.03,.05,.4,8),C(0x444444),121.5,1,24.5,PUT,false);mesh(new THREE.ConeGeometry(.2,.22,12,1,true),C(0xf2e6c8,0x332a10),121.5,1.25,24.5,PUT,false);break;
  case'rossie':F.bed(120.6,26.3,-Math.PI/2,0x7a3a8a);F.desk(121.3,29,-Math.PI/2);F.computer(121.3,29,-Math.PI/2);F.chair(120.5,29,Math.PI/2,0x222222);F.rug(118.4,27.5,2.2,1.8,0x2a2a3a);break;
  case'sara':F.bed(120.4,36.6,-Math.PI/2,0x8a7a6a);F.cabinet(116.6,39.4,Math.PI);F.plant(121.4,39.4);break;
  case'archive':for(let i=-1;i<=1;i++)add('shelf',ca+i*1.8,.3,0x5a4030);add('cabinet',ca,2.4);break;
  case'site':add('desk',ca,1.6);add('cabinet',ca-span/2+.7,.4);add('crate',ca+span/2-1,.9,1.2);sign('CRESTMOOR HEIGHTS · PRYCE',...P2(ca,.13).flatMap((v,i)=>i?[2.2,v]:[v]),rotIn,4,.7,'#1d1f27','#e0b45a');break;
  case'lobby':furnishLobby(r,b);break;}}
function furnishLobby(r,b){const{x0,x1,z0,z1}=r,cx=(x0+x1)/2,cz=(z0+z1)/2,W=x1-x0,D=z1-z0;PUT=IGRP[r.b]||WORLD;
 // "inner" side = toward the band (away from the entrance)
 const f=b.front,inX=f==='s'||f==='n';const rot=f==='s'?0:f==='n'?Math.PI:f==='e'?Math.PI/2:-Math.PI/2;
 const deep=t=>f==='s'?z0+t:f==='n'?z1-t:f==='e'?x0+t:x1-t;// t from the inner edge
 const at=(a,t)=>inX?[a,deep(t)]:[deep(t),a];const ca=inX?cx:cz,span=inX?W:D,dep=inX?D:W;
 switch(b.id){
  case'hall':F.counter(...at(ca-6,2.2),4,rot===0||rot===Math.PI?0:Math.PI/2);F.plant(...at(ca+span/2-.8,.8));F.plant(...at(ca-span/2+.8,.8));F.bench(...at(ca+5,dep-2.5),rot);sign('CRESTMOOR: AN TOÀN · VĂN MINH',...at(ca+5,.13).flatMap((v,i)=>i?[2,v]:[v]),rot,4.6,1,'#1d4a6a','#fff6e4');break;
  case'bank':F.counter(...at(ca,1.5),8,0,'stone');F.plant(...at(ca+span/2-.8,dep-1));F.chair(...at(ca-4,dep-2),rot+Math.PI,0x2a3a5a);break;
  case'diner':F.counter(...at(ca+2,1.5),7,0,'metal');for(let i=-2;i<=2;i++)F.chair(...at(ca+2+i*1.3,2.4),rot+Math.PI,0xd84a3a);
   for(let i=0;i<3;i++){const[x,z]=at(ca-span/2+1.4+i*2.6,dep-1.3);F.table(x,z,2,0xd84a3a);}break;
  case'police':F.counter(...at(ca,2.6),5,0,'wood');F.desk(...at(ca-3,1.2),rot);F.chair(...at(ca-3,.6),rot,0x222244);F.chair(...at(ca+3,dep-1.5),rot+Math.PI,0x445566);F.chair(...at(ca+4,dep-1.5),rot+Math.PI,0x445566);break;
  case'clinic':for(let i=-2;i<=2;i++)F.chair(...at(ca+i*1.1,dep-1.4),rot,0x4a9a9a);F.counter(...at(ca+4,1.6),3);F.plant(...at(ca-span/2+.8,.8));break;
  case'college':F.bench(...at(ca-8,1),rot);F.bench(...at(ca+8,1),rot);F.plant(...at(ca,.8));break;
  case'mart':for(let i=-1;i<=1;i++)F.shelf(...at(ca-2+i*2.2,3),Math.PI/2,0xe0e0e0);F.counter(...at(ca+4,dep-2.2),2.4,Math.PI/2);break;
  case'hardware':for(let i=0;i<2;i++)F.shelf(...at(ca-4+i*2.2,2.6),Math.PI/2,0x6b4a2a);F.counter(...at(ca+3.5,dep-2.4),3,0,'wood');F.workbench(...at(ca+3.5,1.2),rot);break;
  case'flowers':for(let i=0;i<5;i++)F.plant(...at(ca-3.5+i*1.7,1));F.counter(...at(ca+2,dep-2.4),2.6,0,'wood');for(let i=0;i<3;i++)F.plant(...at(ca-3+i*1.5,4.5));break;
  case'studio':F.sofa(...at(ca-4,dep-1.4),rot+Math.PI,0xc0392b);F.counter(...at(ca+3,dep-2.2),3);F.tv(...at(ca,.25),rot);break;
  case'inn':F.counter(...at(ca+5,1.4),5,0,'wood');F.sofa(...at(ca-5,dep-2),rot+Math.PI,0x3a5a3a);F.table(...at(ca-1,dep-3),3,0x6b4a2a);F.piano(...at(ca-7,.6),rot);break;
  case'gas':F.shelf(...at(ca-2,1.2),rot,0xe0e0e0);F.counter(...at(ca+2,dep-2),2.4,0);break;
  case'church':{for(let i=0;i<5;i++)for(const s of[-1,1]){const[x,z]=at(ca+s*2.6,4+i*1.7);F.lux('bench',x,z,rot+Math.PI,0,3.2,.9,.6,0x6b4a2a);}
   const[ax,az]=at(ca,1.2);mesh(B(2.4,1,1),C(0xf6f2ea),ax,.5,az);mesh(B(.12,1.6,.12),C(0xd4af37),ax,1.8,az);mesh(B(.8,.12,.12),C(0xd4af37),ax,2.2,az);break;}
  case'shed':F.desk(...at(ca,1.2),rot);F.locker(...at(ca+3,.5),rot,0x3a6a3a);F.crate(...at(ca-3,1),.9);break;
  case'whit':F.sofa(-19.6,14.5,-Math.PI/2,0x8a6a5a);F.tv(-31.4,14.5,Math.PI/2);F.table(-24.6,14.5,2,0x6b4a2a);F.rug(-24.6,14.5,4,3,0x9a5a4a);F.lux('big_plant',-15,11,0,0,.6,1.6,.6,0x3f8a2c);F.cabinet(-31.4,11,Math.PI/2);break;
  case'whit2':F.rug(112.5,30,1.6,14,0x7a4a3a);F.plant(110.8,20.8);F.table(110.9,28,1,0x6b4a2a);mesh(B(.08,.9,4),C(0x5a3a22),114.4,.45,38.2,PUT,false);mesh(B(3.8,.08,.08),C(0x5a3a22),112.5,.9,36.2,PUT,false);solid(110.2,114.4,36.1,36.3,'prop');break;
  case'dawson':F.sofa(-47,13,0,0x3a5a7a);F.tv(-47,17,0);break;
  case'apts':for(let i=0;i<4;i++)F.locker(...at(ca-6+i*1,.4),rot,0x8a8a7a);F.plant(...at(ca+6,1));break;
  case'mill':for(let i=0;i<4;i++)F.crate(...at(cz-6+i*3.3,3+(i%2)*2),1.2);F.workbench(...at(cz+5,6),rot);break;}}

Object.keys(BLD).forEach(buildBuilding);
WIN_IM=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),winMat,WIN_LIST.length);WORLD.add(WIN_IM);WIN_LIST.forEach((w,i)=>setWinM(i));

/* =====================================================================
   STREETS, SIDEWALKS, PARK, PROPS
   ===================================================================== */
PUT=WORLD;
plane(WX1-WX0+60,WZ1-WZ0+60,mat('grass',(WX1-WX0)/8,(WZ1-WZ0)/8),0,0,0);
// park lawn (fallen maple leaves)
plane(80,44,mat('leaves',12,7),-47.5,.012,-30);
{const yl=new THREE.MeshBasicMaterial({color:0xf2c230}),wh=new THREE.MeshBasicMaterial({color:0xf2f2ea});
 ROADS.forEach((r,ri)=>{const L=r.ax==='x'?WX1-WX0:WZ1-WZ0,y=r.ax==='x'?.02:.024;
  const p=plane(r.ax==='x'?L:RW*2,r.ax==='x'?RW*2:L,mat('road',r.ax==='x'?L/8:1,r.ax==='x'?1:L/8),r.ax==='x'?0:r.c,y,r.ax==='x'?r.c:0);
  // centre dashes, skipping intersections
  const cross=r.ax==='x'?XR:ZR;const lo=r.ax==='x'?WX0:WZ0,hi=r.ax==='x'?WX1:WZ1;
  for(let t=lo+2;t<hi-2;t+=6){if(cross.some(c=>Math.abs(t-c)<RW+2))continue;const d=plane(r.ax==='x'?3:.18,r.ax==='x'?.18:3,yl,r.ax==='x'?t:r.c,y+.006,r.ax==='x'?r.c:t);}
  // crosswalk stripes at each intersection arm
  cross.forEach(c=>[-1,1].forEach(s=>{const at=c+s*(RW+1.2);for(let k=-3;k<=3;k++){const o=k*1.2;plane(r.ax==='x'?.9:.6,r.ax==='x'?.6:.9,wh,r.ax==='x'?at:r.c+o,y+.007,r.ax==='x'?r.c+o:at).scale.set(1,1,1);
   const q=plane(r.ax==='x'?.6:2.6,r.ax==='x'?2.6:.6,wh,r.ax==='x'?at:r.c+o,y+.007,r.ax==='x'?r.c+o:at);q.scale.set(r.ax==='x'?1.2:1,1,1);}}));});}
// sidewalks: x-roads take the corner squares, z-roads stop short of them
{const curb=mat('walk',1,1);const wk=(x0,x1,z0,z1)=>{const w=x1-x0,d=z1-z0;if(w<.2||d<.2)return;mesh(B(w,.14,d),[C(0xb0a898),C(0xb0a898),mat('walk',w/3,d/3),C(0xb0a898),C(0xb0a898),C(0xb0a898)],(x0+x1)/2,.07,(z0+z1)/2,WORLD,false).receiveShadow=true;};
 const cut=(lo,hi,holes,pad)=>{let segs=[[lo,hi]];holes.forEach(c=>{segs=segs.flatMap(([a,b])=>c+pad<=a||c-pad>=b?[[a,b]]:[[a,Math.max(a,c-pad)],[Math.min(b,c+pad),b]].filter(([p,q])=>q-p>.1));});return segs;};
 ZR.forEach(c=>[-1,1].forEach(s=>cut(WX0,WX1,XR,RW).forEach(([a,b])=>wk(a,b,s<0?c-SWK:c+RW,s<0?c-RW:c+SWK))));
 XR.forEach(c=>[-1,1].forEach(s=>cut(WZ0,WZ1,ZR,SWK).forEach(([a,b])=>wk(s<0?c-SWK:c+RW,s<0?c-RW:c+SWK,a,b))));}
// park paths (gravel) + church walk
{const gm=(w,d,x,z)=>plane(w,d,mat('gravel',w/4,d/4),x,.03,z);gm(3,22,-33,-19);gm(30,3,-52,-16);gm(3,22,-52,-27.5);gm(16,3,-64,-16);gm(3,8,-82.5,-44+4);}

/* ---------- pond with a simple water shader ---------- */
const POND={x:-68,z:-32,r:9.5};
const WATER_U={uTime:{value:0},uSky:{value:new THREE.Color(0x9fd0f4)},uDeep:{value:new THREE.Color(0x2f5e5a)},uTint:{value:new THREE.Color(0xffffff)},uSunI:{value:1},uSunDir:{value:new THREE.Vector3(.4,.8,.3)}};
{const vs=`varying vec3 vW;\n#include <fog_pars_vertex>\nvoid main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}`;
 const fs=`uniform float uTime,uSunI;uniform vec3 uSky,uDeep,uTint,uSunDir;varying vec3 vW;\n#include <fog_pars_fragment>\nvoid main(){vec2 p=vW.xz;vec2 g=vec2(0.0);
  for(int i=0;i<5;i++){float fi=float(i);float a=fi*2.4+.5;vec2 d=vec2(cos(a),sin(a));float k=6.28/(3.0/(1.0+fi*.7));float th=dot(d,p)*k+uTime*(1.2+fi*.35);g+=0.03/(1.0+fi)*k*cos(th)*d*.12;}
  vec3 N=normalize(vec3(-g.x,1.0,-g.y));vec3 V=normalize(cameraPosition-vW);float F=0.03+0.97*pow(1.0-max(dot(N,V),0.0),5.0);
  vec3 R=reflect(-V,N);float sp=pow(max(dot(R,normalize(uSunDir)),0.0),180.0)*uSunI*2.5;float e=length(p-vec2(${POND.x.toFixed(1)},${POND.z.toFixed(1)}))/${POND.r.toFixed(1)};
  vec3 deep=mix(uDeep,uDeep*1.6+vec3(.05,.08,.04),smoothstep(.6,1.0,e))*uTint*(0.35+0.65*uSunI);vec3 c=mix(deep,uSky,F*.8)+sp;gl_FragColor=vec4(c,1.0);\n#include <fog_fragment>\n}`;
 const m=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,WATER_U]),vertexShader:vs,fragmentShader:fs,fog:true});Object.keys(WATER_U).forEach(k=>m.uniforms[k]=WATER_U[k]);
 const w=mesh(new THREE.CircleGeometry(POND.r,48),m,POND.x,.06,POND.z,WORLD,false);w.rotation.x=-Math.PI/2;window.POND_MESH=w;
 const rim=mesh(new THREE.RingGeometry(POND.r,POND.r+.9,48),mat('stone',6,1),POND.x,.07,POND.z,WORLD,false);rim.rotation.x=-Math.PI/2;
 for(let i=0;i<26;i++){const a=i/26*Math.PI*2+rnd(-.1,.1);if(Math.abs(Math.sin(a)-1)<.5)continue;const rr=POND.r+.2;mesh(new THREE.ConeGeometry(.12,rnd(.8,1.4),5),C(0x5d7a33),POND.x+Math.cos(a)*rr,.5,POND.z+Math.sin(a)*rr,WORLD,false);}
 CIRC.push({x:POND.x,z:POND.z,r:POND.r-.3});}
// ducks
const DUCKS=[];for(let i=0;i<4;i++){const g=grp(POND.x,POND.z,0,WORLD);mesh(new THREE.SphereGeometry(.28,10,8),C(i?0xf4f1ea:0x6a4a2a),0,.2,0,g,false).scale.set(1,.7,1.4);
 const hd=mesh(new THREE.SphereGeometry(.15,8,6),C(i?0xf4f1ea:0x2f6a3a),0,.45,.28,g,false);mesh(B(.1,.05,.14),C(0xf0a020),0,.42,.45,g,false);DUCKS.push({g,r:rnd(3,7),a:rnd(0,6),s:rnd(.08,.16)*(i%2?1:-1)});}

/* ---------- town green furniture ---------- */
// gazebo
{const g=grp(-52,-40,0,WORLD);const wh=C(0xf6f2ea);mesh(new THREE.CylinderGeometry(3.2,3.2,.4,8),mat('wood',3,1,0xd8c8a8),0,.2,0,g);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;mesh(new THREE.CylinderGeometry(.1,.1,2.8,8),wh,Math.cos(a)*2.9,1.8,Math.sin(a)*2.9,g);}
 mesh(new THREE.ConeGeometry(3.8,1.8,8),C(0x5a6a7a),0,4.1,0,g).rotation.y=Math.PI/8;mesh(new THREE.CylinderGeometry(3.25,3.25,.25,8),wh,0,3.2,0,g,false);}
// flagpole, statue, Founders' Day banner, benches
mesh(new THREE.CylinderGeometry(.08,.1,10,8),C(0xdddddd),-40,5,-16,WORLD);
{const fc=document.createElement('canvas');fc.width=96;fc.height=60;const g=fc.getContext('2d');for(let i=0;i<13;i++){g.fillStyle=i%2?'#fff':'#b22234';g.fillRect(0,i*60/13,96,60/13+.5);}g.fillStyle='#3c3b6e';g.fillRect(0,0,40,32);
 const t=new THREE.CanvasTexture(fc);t.encoding=THREE.sRGBEncoding;const fl=mesh(new THREE.PlaneGeometry(2.4,1.5),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}),-38.8,9.1,-16,WORLD,false);window.FLAG=fl;}
{const g=grp(-60,-10.5,0,WORLD);mesh(B(1.6,1.4,1.6),mat('stone',1,1),0,.7,0,g);mesh(new THREE.CylinderGeometry(.35,.4,1.6,10),C(0x6a7a6a),0,2.2,0,g);mesh(new THREE.SphereGeometry(.32,10,8),C(0x6a7a6a),0,3.2,0,g);solid(-60.8,-59.2,-11.3,-9.7,'prop');}
sign("CRESTMOOR · CHÀO MỪNG TÂN SINH VIÊN",0,5.2,-7.2,0,8,1.1,'#b22234','#fff6e4');
mesh(new THREE.CylinderGeometry(.12,.12,5.6,8),C(0x444444),-4.2,2.8,-7.2,WORLD);mesh(new THREE.CylinderGeometry(.12,.12,5.6,8),C(0x444444),4.2,2.8,-7.2,WORLD);
[[-56,-13.5,0],[-48,-13.5,0],[-70,-13.6,0],[-62,-13.6,0],[-30.5,-22,Math.PI/2],[-35.5,-22,-Math.PI/2],[-11,8.7,Math.PI],[20,-7.8,Math.PI],[26,-7.8,Math.PI]].forEach(([x,z,r])=>{F.bench(x,z,r);solid(x-.9,x+.9,z-.3,z+.3,'prop');});
// bus stop shelter
{const g=grp(-11,8.9,0,WORLD);mesh(B(3.4,.12,1.4),C(0x2f4a5a),0,2.5,0,g);mesh(B(3.4,2.4,.08),new THREE.MeshLambertMaterial({color:0xbfe3f5,transparent:true,opacity:.45}),0,1.25,.65,g,false);
 mesh(new THREE.CylinderGeometry(.05,.05,2.8,6),C(0x666666),2,1.4,-.6,g);sign('BUS',2,2.9,-.6,0,.8,.4,'#2a6ad0','#fff');solid(-12.7,-9.3,9.5,9.7,'prop');}
// gas station canopy + pumps
{const g=grp(66,45,0,WORLD);mesh(B(12,.5,9),C(0xf2f2f2),0,4.6,0,g);mesh(B(12.2,.6,9.2),C(0xd84a3a),0,4.2,0,g,false);
 for(const x of[-3,3]){mesh(new THREE.CylinderGeometry(.2,.2,4.2,8),C(0xdddddd),x,2.1,0,g);mesh(B(.8,1.6,.6),C(0xd84a3a),x,.8,1.2,g);mesh(B(.8,1.6,.6),C(0xd84a3a),x,.8,-1.2,g);
  solid(66+x-.4,66+x+.4,43.5,46.5,'prop');}
 sign('CRESTMOOR GAS · $4.29',66,6.2,49.6,0,5,1,'#d84a3a','#fff');plane(18,14,mat('concrete',4,3),66,.04,45);}
// picket fences in front of houses (gap at the walk)
['whit','dawson','h3'].forEach(id=>{const b=BLD[id];const z=b.z0-1.2,mx=b.ex;const fm=C(0xf6f6f0);
 [[b.x0,mx-1.2],[mx+1.2,b.x1]].forEach(([a,c])=>{const L=c-a;mesh(B(L,.08,.06),fm,(a+c)/2,.75,z,WORLD,false);mesh(B(L,.08,.06),fm,(a+c)/2,.35,z,WORLD,false);
  for(let x=a+.1;x<c;x+=.3)mesh(B(.08,.95,.04),fm,x,.47,z,WORLD,false);solid(a,c,z-.1,z+.1,'fence');});
 plane(2,1.4,mat('concrete',1,1),mx,.04,b.z0-.7);});
// Whitfield house: gravel walk, daisy pots by the steps, house number on the gate
{plane(1.8,2.8,mat('gravel',1,1),-23,.05,8.6);for(const x of[-24.4,-21.6]){mesh(new THREE.CylinderGeometry(.26,.2,.4,10),C(0xb5643a),x,.2,9.55);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;mesh(new THREE.SphereGeometry(.09,6,5),C(0xf2c230),x+Math.cos(a)*.13,.5,9.55+Math.sin(a)*.13,WORLD,false);}mesh(new THREE.SphereGeometry(.06,6,5),C(0x8a5a1a),x,.52,9.55,WORLD,false);}
 sign('14',-24.45,1.15,8.7,0,.5,.34,'#2b1d3a','#fff6e4');}
['h4','h5','apts','inn'].forEach(id=>{const b=BLD[id];plane(2,1.4,mat('concrete',1,1),b.ex,.04,b.z1+.7);});
// church yard: headstones
for(let i=0;i<10;i++){const x=-21+(i%2)*2.2-(i>5?0:0),z=-48+Math.floor(i/2)*3.4;if(z>-30)break;mesh(B(.7,1,.18),mat('stone',1,1),x,.5,z,WORLD);solid(x-.35,x+.35,z-.1,z+.1,'prop');}
// mill yard fence with gate at the entrance
{const b=BLD.mill,x=-103.6;const fm=mat('metal',1,1,0x8fa0a8);[[b.z0-2,b.at-1.4],[b.at+1.4,b.z1+2]].forEach(([a,c])=>{mesh(B(.1,2,c-a),fm,x,1,(a+c)/2,WORLD);solid(x-.1,x+.1,a,c,'fence');});
 [[b.z0-2],[b.z1+2]].forEach(([z])=>{mesh(B(b.x1+.3-x,2,.1),fm,(x+b.x1)/2,1,z,WORLD);solid(b.x1,x,z-.1,z+.1,'fence');});
 sign('KHÔNG PHẬN SỰ MIỄN VÀO · PRYCE HOLDINGS',x+.2,2.4,b.at-2.4,Math.PI/2,3.2,.7,'#b22234','#fff');}

/* ---------- street lamps + maple trees (instanced) ---------- */
const LAMP_POS=[],TREE_POS=[];
{const near=(x,z,d)=>Object.values(BLD).some(b=>x>b.x0-d&&x<b.x1+d&&z>b.z0-d&&z<b.z1+d);
 const nearDoor=(x,z)=>Object.values(BLD).some(b=>Math.hypot(b.ex-x,b.ez-z)<4.2)||Object.values(OUT).some(o=>Math.hypot(o.node[0]-x,o.node[1]-z)<2);
 ZR.forEach(c=>[-1,1].forEach(s=>{for(let x=WX0+8;x<WX1-6;x+=20){if(XR.some(v=>Math.abs(x-v)<10))continue;LAMP_POS.push([x,c+s*7]);
  const tx=x+10;if(!XR.some(v=>Math.abs(tx-v)<11)&&!nearDoor(tx,c+s*7))TREE_POS.push([tx,c+s*7.05]);}}));
 XR.forEach(c=>[-1,1].forEach(s=>{for(let z=WZ0+8;z<WZ1-6;z+=20){if(ZR.some(v=>Math.abs(z-v)<10))continue;LAMP_POS.push([c+s*7,z]);
  const tz=z+10;if(!ZR.some(v=>Math.abs(tz-v)<11)&&!nearDoor(c+s*7,tz))TREE_POS.push([c+s*7.05,tz]);}}));
 // park + yards
 const R=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647;})();
 for(let i=0;i<70;i++){const x=-87+R()*79,z=-52+R()*44;if(Math.hypot(x-POND.x,z-POND.z)<POND.r+3)continue;if(near(x,z,2.5))continue;if(Math.abs(x+33)<3&&z>-30)continue;if(Math.abs(z+16)<3||Math.hypot(x+52,z+40)<5||Math.hypot(x+52,z+16)<6)continue;
  if(Math.abs(x+52)<2.5&&z<-16&&z>-40)continue;if(z>-12&&z<-9)continue;TREE_POS.push([x,z]);}
 [[-86,30],[-58,29],[-38,30],[-8.5,30],[-60,-62.5],[-30,-66],[20,-66],[60,-66],[-36,66],[26,66],[110,-30],[-112,40],[-112,-50],[-6,-30],[-6,-46],[-6,40],[89,-34],[40,30],[58,30],[6,30]].forEach(p=>TREE_POS.push(p));
 // lamps
 const post=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.12,4.6,6),C(0x2b2f36),LAMP_POS.length),arm=new THREE.InstancedMesh(B(.9,.08,.08),C(0x2b2f36),LAMP_POS.length);
 const bulbMat=new THREE.MeshLambertMaterial({color:0xfff2c0,emissive:0x000000});const bulb=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,10,8),bulbMat,LAMP_POS.length);window.BULB_MAT=bulbMat;
 const M=new THREE.Matrix4();LAMP_POS.forEach(([x,z],i)=>{M.makeTranslation(x,2.3,z);post.setMatrixAt(i,M);M.makeTranslation(x,4.55,z);arm.setMatrixAt(i,M);M.makeTranslation(x,4.4,z);bulb.setMatrixAt(i,M);solid(x-.15,x+.15,z-.15,z+.15,'lamp');});
 post.castShadow=true;WORLD.add(post,arm,bulb);
 // trees: trunk + 2 crown blobs, autumn colours
 const N=TREE_POS.length,trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.32,3,7),C(0x6b4a2e),N),crown=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.9,1),new THREE.MeshLambertMaterial({color:0xffffff}),N*2);
 const cols=[0xd9541e,0xe8892a,0xc7342a,0xf2b33a,0x7a9a3a,0xb8481f].map(c=>new THREE.Color(c));const Q=new THREE.Quaternion(),S=new THREE.Vector3(),T=new THREE.Vector3();
 TREE_POS.forEach(([x,z],i)=>{const s=.85+((i*37)%10)/25;M.compose(T.set(x,1.5*s,z),Q.identity(),S.set(s,s,s));trunk.setMatrixAt(i,M);
  M.compose(T.set(x,3.7*s,z),Q.setFromEuler(new THREE.Euler(0,i,0)),S.set(s*1.1,s*.95,s*1.1));crown.setMatrixAt(i*2,M);crown.setColorAt(i*2,cols[i%cols.length]);
  M.compose(T.set(x+.5*s,4.9*s,z-.3*s),Q,S.set(s*.75,s*.7,s*.75));crown.setMatrixAt(i*2+1,M);crown.setColorAt(i*2+1,cols[(i+2)%cols.length]);
  CIRC.push({x,z,r:.38});});
 trunk.castShadow=crown.castShadow=true;crown.receiveShadow=true;WORLD.add(trunk,crown);}
// hydrants, mailboxes, trash cans
[[8,-7.2],[-8,7.2],[89,-7.2],[48,7.2],[-48,7.2]].forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.2,.24,.7,8),C(0xc0392b),x,.35,z,WORLD);CIRC.push({x,z,r:.3});});
[[40,-7.6],[-20,7.6],[70,7.6]].forEach(([x,z])=>{mesh(B(.5,1.1,.5),C(0x2a4a8a),x,.55,z,WORLD);mesh(new THREE.CylinderGeometry(.25,.25,.5,10,1,false,0,Math.PI),C(0x2a4a8a),x,1.1,z,WORLD).rotation.z=Math.PI/2;CIRC.push({x,z,r:.35});});
// bunting across Main St
for(const x of[-30,30,60]){const pts=[];for(let i=0;i<=16;i++){const t=i/16;pts.push(new THREE.Vector3(x,5.2-Math.sin(t*Math.PI)*.8,-7+t*14));}
 const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x333333}));WORLD.add(ln);
 pts.forEach((p,i)=>{if(i%2)return;const fl=mesh(new THREE.ConeGeometry(.25,.5,3),C([0xb22234,0xffffff,0x3c3b6e][i%3]),p.x,p.y-.3,p.z,WORLD,false);fl.rotation.x=Math.PI;});}
// world edge (soft forest ring)
{const ring=[];for(let i=0;i<90;i++){const a=i/90*Math.PI*2;ring.push([Math.cos(a)*150,Math.sin(a)*105]);}
 const fm=new THREE.InstancedMesh(new THREE.ConeGeometry(3,9,7),C(0x2f5a33),ring.length*3);const M=new THREE.Matrix4();let k=0;
 ring.forEach(([x,z])=>{for(let j=0;j<3;j++){M.makeTranslation(x+rnd(-8,8),4.5,z+rnd(-8,8));fm.setMatrixAt(k++,M);}});WORLD.add(fm);}

/* =====================================================================
   PEDESTRIAN GRAPH (sidewalk rings, crosswalks, building doors, park spots)
   ===================================================================== */
const NODES=[],ADJ=[],NKEY={};
function nodeAt(x,z,tag){const k=Math.round(x*2)+','+Math.round(z*2);if(NKEY[k]!==undefined)return NKEY[k];const id=NODES.length;NODES.push({id,x,z,tag});ADJ.push([]);NKEY[k]=id;return id;}
function link(a,b){if(a===b||ADJ[a].some(e=>e[0]===b))return;const w=Math.hypot(NODES[a].x-NODES[b].x,NODES[a].z-NODES[b].z);ADJ[a].push([b,w]);ADJ[b].push([a,w]);}
const SEGS=[];
{const ring=(x0,x1,z0,z1)=>{SEGS.push([x0,z0,x1,z0],[x1,z0,x1,z1],[x1,z1,x0,z1],[x0,z1,x0,z0]);};
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)ring(XR[i]+6,XR[i+1]-6,ZR[j]+6,ZR[j+1]-6);
 ring(XR[0]-6,XR[2]+6,ZR[0]-6,ZR[2]+6);
 SEGS.push([XR[0]-6,-6,WX0+4,-6],[XR[2]+6,6,WX1-4,6]);}
const SEGPTS=SEGS.map(s=>[[s[0],s[1]],[s[2],s[3]]]);
function onSeg(si,x,z){const[ax,az,bx,bz]=SEGS[si];const dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz;const t=((x-ax)*dx+(z-az)*dz)/L2;if(t<-1e-6||t>1+1e-6)return false;return Math.hypot(ax+dx*t-x,az+dz*t-z)<.05;}
function projSeg(x,z){let best=null;SEGS.forEach((s,si)=>{const[ax,az,bx,bz]=s;const dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz;const t=clamp(((x-ax)*dx+(z-az)*dz)/L2,0,1);const px=ax+dx*t,pz=az+dz*t,d=Math.hypot(px-x,pz-z);if(!best||d<best.d)best={si,x:px,z:pz,d};});return best;}
// crosswalk corners
const CROSS=[];XR.forEach(X=>ZR.forEach(Z=>{const c=[[X-6,Z-6],[X+6,Z-6],[X+6,Z+6],[X-6,Z+6]];CROSS.push([c[0],c[1]],[c[3],c[2]],[c[0],c[3]],[c[1],c[2]]);}));
CROSS.forEach(([a,b])=>[a,b].forEach(p=>SEGS.forEach((s,si)=>{if(onSeg(si,p[0],p[1]))SEGPTS[si].push(p);})));
// building doors and outdoor places hook onto the nearest sidewalk segment
const HOOKS=[];
Object.values(BLD).forEach(b=>{if(b.closed||b.upper)return;const ox=b.ex+b.nx*1.3,oz=b.ez+b.nz*1.3;const p=projSeg(ox,oz);SEGPTS[p.si].push([p.x,p.z]);HOOKS.push({b:b.id,out:[ox,oz],foot:[p.x,p.z]});});
Object.entries(OUT).forEach(([k,o])=>{const p=projSeg(o.node[0],o.node[1]);SEGPTS[p.si].push([p.x,p.z]);HOOKS.push({out:k,node:o.node,foot:[p.x,p.z]});});
// build ring nodes
SEGS.forEach((s,si)=>{const[ax,az,bx,bz]=s,L=Math.hypot(bx-ax,bz-az);const pts=SEGPTS[si].map(([x,z])=>[x,z,((x-ax)*(bx-ax)+(z-az)*(bz-az))/L]).sort((p,q)=>p[2]-q[2]);
 const ids=[];for(let i=0;i<pts.length;i++){if(i>0){const gap=pts[i][2]-pts[i-1][2];const n=Math.floor(gap/12);for(let k=1;k<=n;k++){const t=pts[i-1][2]+gap*k/(n+1);ids.push(nodeAt(ax+(bx-ax)*t/L,az+(bz-az)*t/L,'walk'));}}ids.push(nodeAt(pts[i][0],pts[i][1],'walk'));}
 for(let i=1;i<ids.length;i++)link(ids[i-1],ids[i]);});
CROSS.forEach(([a,b])=>{const na=nodeAt(a[0],a[1],'walk'),nb=nodeAt(b[0],b[1],'walk');link(na,nb);NODES[na].cross=NODES[nb].cross=1;});
const WALKN=NODES.map(n=>n.id);// pure sidewalk nodes (for ambient pedestrians)
// buildings: out -> in -> lobby/door nodes -> room nodes
Object.values(BLD).forEach(b=>{if(b.closed)return;let inn;if(b.upper){inn=nodeAt(STAIRS.up[0],STAIRS.up[1],'in');}else{const h=HOOKS.find(k=>k.b===b.id);const foot=nodeAt(h.foot[0],h.foot[1],'walk');const out=nodeAt(h.out[0],h.out[1],'out');link(foot,out);
 inn=nodeAt(b.ex-b.nx*1.4,b.ez-b.nz*1.4,'in');link(out,inn);b.outN=out;}b.inN=inn;b.lob.nid=inn;const lobN=[inn];
 b.rooms.forEach(r=>{const[s,pos]=r.door;const n=SIDE_N[s];const lx=s==='n'||s==='s'?pos:(s==='e'?r.x1:r.x0),lz=s==='e'||s==='w'?pos:(s==='s'?r.z1:r.z0);
  const dOut=nodeAt(lx+n[0]*.9,lz+n[1]*.9,'door'),dIn=nodeAt(lx-n[0]*.9,lz-n[1]*.9,'door'),cen=nodeAt((r.x0+r.x1)/2,(r.z0+r.z1)/2,'room');
  link(dOut,dIn);link(dIn,cen);r.nid=cen;lobN.push(dOut);});
 for(let i=0;i<lobN.length;i++)for(let j=i+1;j<lobN.length;j++)link(lobN[i],lobN[j]);
 // church: the steeple stands inside the entrance, walk around its middle
});
// staircase: ground floor <-> upper floor (NPCs jump across this edge)
{const a=nodeAt(STAIRS.down[0],STAIRS.down[1],'room');link(a,RM.w_stair.nid);link(a,nodeAt(STAIRS.up[0],STAIRS.up[1],'in'));const L=ADJ[a].find(e=>e[0]===NKEY[Math.round(STAIRS.up[0]*2)+','+Math.round(STAIRS.up[1]*2)]);if(L)L[1]=3;const Lb=ADJ[NKEY[Math.round(STAIRS.up[0]*2)+','+Math.round(STAIRS.up[1]*2)]].find(e=>e[0]===a);if(Lb)Lb[1]=3;}
Object.entries(OUT).forEach(([k,o])=>{const h=HOOKS.find(q=>q.out===k);const foot=nodeAt(h.foot[0],h.foot[1],'walk');const n=nodeAt(o.node[0],o.node[1],'place');link(foot,n);o.nid=n;});
const EXITS=[nodeAt(WX0+4,-6,'exit'),nodeAt(WX1-4,6,'exit')];
function dijkstra(a,b){if(a==null||b==null)return null;if(a===b)return[a];const N=NODES.length,dist=new Float64Array(N).fill(Infinity),prev=new Int32Array(N).fill(-1),done=new Uint8Array(N);dist[a]=0;
 for(;;){let u=-1,best=Infinity;for(let i=0;i<N;i++)if(!done[i]&&dist[i]<best){best=dist[i];u=i;}if(u<0||u===b)break;done[u]=1;for(const[v,w]of ADJ[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;}}
 if(prev[b]<0)return null;const p=[b];while(p[0]!==a)p.unshift(prev[p[0]]);return p;}
function nearestNode(x,z){const r=roomAt(x,z);if(r&&!r.lobby)return r.nid;if(r&&r.lobby){return r.nid;}let best=null,bd=1e9;
 NODES.forEach(n=>{if(n.tag==='room'||n.tag==='door'||n.tag==='in')return;const d=Math.hypot(n.x-x,n.z-z);if(d<bd){bd=d;best=n.id;}});return best;}
const PATROL_PTS=[[6,-6],[89,-6],[89,6],[6,6],[-6,6],[-89,6],[-89,-6],[-6,-6]].map(([x,z])=>nodeAt(x,z,'walk'));

/* =====================================================================
   VEHICLES
   ===================================================================== */
const headMat=new THREE.MeshLambertMaterial({color:0xfff6d0,emissive:0x000000}),tailMat=new THREE.MeshLambertMaterial({color:0x8a1010,emissive:0x220000});
function makeCar(col,kind){const g=new THREE.Group();WORLD.add(g);const body=C(col);const _put=PUT;PUT=g;
 if(kind==='bus'){mesh(B(2.5,2.6,9),body,0,1.7,0,g);mesh(B(2.52,.9,8.6),new THREE.MeshLambertMaterial({color:0x223344}),0,2.3,.1,g,false);sign('CRESTMOOR TRANSIT',1.27,1.2,0,Math.PI/2,6,.5,'#f2b33a','#2b1d3a');}
 else if(kind==='truck'){mesh(B(2,1,4.8),body,0,.8,0,g);mesh(B(1.9,.8,1.8),body,0,1.7,.9,g);mesh(B(1.86,.6,1.7),new THREE.MeshLambertMaterial({color:0x223344}),0,1.75,.95,g,false);mesh(B(1.9,.5,2.4),C(0x333333),0,1.45,-1.1,g);}
 else{mesh(B(1.9,.75,4.3),body,0,.75,0,g);mesh(B(1.7,.65,2.2),body,0,1.45,-.2,g);mesh(B(1.72,.5,2.1),new THREE.MeshLambertMaterial({color:0x223344}),0,1.48,-.2,g,false);}
 const L=kind==='bus'?4.4:kind==='truck'?2.35:2.1,Wd=kind==='bus'?1.2:.95;
 for(const sx of[-Wd,Wd])for(const sz of[-L+.8,L-.8]){const w=mesh(new THREE.CylinderGeometry(.38,.38,.3,12),C(0x1a1a1a),sx,.38,sz,g,false);w.rotation.z=Math.PI/2;}
 for(const sx of[-.6,.6]){mesh(B(.35,.2,.05),headMat,sx,.85,L+.02,g,false);mesh(B(.35,.2,.05),tailMat,sx,.85,-L-.02,g,false);}
 let bar=null;if(kind==='police'){mesh(B(1.92,.3,1.6),C(0x111111),0,.95,0,g,false);bar=[mesh(B(.6,.18,.3),C(0xff2020,0x000000),-.35,1.86,-.2,g,false),mesh(B(.6,.18,.3),C(0x2040ff,0x000000),.35,1.86,-.2,g,false)];
  bar.forEach(b=>b.material=b.material.clone());sign('POLICE',.96,.95,1.2,Math.PI/2,1.6,.35,'#ffffff','#1a2a5a');}
 PUT=_put;g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return{g,L,bar};}
const LANE=2.2;
const LOOPS=[[[-95,-60],[95,-60],[95,60],[-95,60]],[[0,0],[95,0],[95,-60],[0,-60]],[[0,0],[0,60],[-95,60],[-95,0]],[[-95,0],[95,0],[95,60],[-95,60]],[[-95,-60],[-95,60],[95,60],[95,-60]],[[0,-60],[0,60],[95,60],[95,-60]],[[-95,0],[-95,-60],[0,-60],[0,0]]];
function offsetLoop(pts){const n=pts.length;return pts.map((p,i)=>{const a=pts[(i-1+n)%n],b=pts[(i+1)%n];
 const d1=[p[0]-a[0],p[1]-a[1]],d2=[b[0]-p[0],b[1]-p[1]];const l1=Math.hypot(...d1),l2=Math.hypot(...d2);const r1=[-d1[1]/l1,d1[0]/l1],r2=[-d2[1]/l2,d2[0]/l2];
 return[p[0]+(r1[0]+r2[0])*LANE,p[1]+(r1[1]+r2[1])*LANE];});}
const CARS=[];
[[0,0x2a6ad0,'car',.0],[0,0xf2b33a,'bus',.5],[1,0xc0392b,'car',.2],[1,0xffffff,'police',.7],[2,0x3a7a4a,'truck',.1],[3,0x8a8a92,'car',.4],[3,0x5a3a7a,'car',.85],[4,0xe8e0d0,'car',.3],[5,0x1a1a1a,'car',.6],[6,0xd86a2a,'truck',.35]].forEach(([li,col,kind,t0],i)=>{
 const pts=offsetLoop(LOOPS[li]);const segs=pts.map((p,k)=>{const q=pts[(k+1)%pts.length];return{a:p,b:q,len:Math.hypot(q[0]-p[0],q[1]-p[1])};});const tot=segs.reduce((s,q)=>s+q.len,0);
 const c=makeCar(col,kind);CARS.push(Object.assign(c,{segs,tot,d:t0*tot,v:0,vmax:kind==='bus'?7:kind==='police'?9:8.5,x:0,z:0,dx:0,dz:1,yaw:0,stopT:0,kind,police:kind==='police'}));});
// parked cars (static)
[[-10.5,15,0x9a2a2a,0],[-10.5,21,0x2a5a8a,0],[-36.5,15,0xd8d8d0,0],[38,-34,0x4a4a52,Math.PI/2],[44,-34,0x2a4a2a,Math.PI/2],[50,-34,0xc0a060,Math.PI/2],[84,-31,0xffffff,Math.PI/2,'police'],[78,45,0x7a2a2a,0],[-108,-10,0x5a5a5a,0,'truck'],[30,30,0x2a2a6a,0]].forEach(([x,z,col,ry,kind])=>{
 const c=makeCar(col,kind||'car');c.g.position.set(x,0,z);c.g.rotation.y=ry;const hl=c.L,hw=1.1;const ax=Math.abs(Math.sin(ry))>.5;solid(x-(ax?hl:hw),x+(ax?hl:hw),z-(ax?hw:hl),z+(ax?hw:hl),'car');});
function carTick(dt,agents){CARS.forEach(c=>{// position on loop
 let d=c.d%c.tot,i=0;while(d>c.segs[i].len){d-=c.segs[i].len;i++;}const s=c.segs[i],t=d/s.len;const dx=(s.b[0]-s.a[0])/s.len,dz=(s.b[1]-s.a[1])/s.len;
 c.x=s.a[0]+(s.b[0]-s.a[0])*t;c.z=s.a[1]+(s.b[1]-s.a[1])*t;c.dx=dx;c.dz=dz;
 // look ahead for people / cars
 let stop=false,why=null;const look=c.L+5;
 for(const a of agents){const ox=a.x-c.x,oz=a.z-c.z,al=ox*dx+oz*dz;if(al<0||al>look+1)continue;const lat=Math.abs(ox*dz-oz*dx);if(lat<1.7){stop=true;why=a;break;}}
 if(!stop)for(const o of CARS){if(o===c)continue;const ox=o.x-c.x,oz=o.z-c.z,al=ox*dx+oz*dz;if(al<=0||al>c.L+o.L+3.5)continue;const lat=Math.abs(ox*dz-oz*dx);if(lat<1.6&&(o.dx*dx+o.dz*dz)>.3){stop=true;break;}}
 // slow down near corners
 const toEnd=s.len-d,corner=toEnd<10?.45+toEnd/18:1;
 const target=stop?0:c.vmax*Math.min(1,corner);c.v+=(target-c.v)*Math.min(1,dt*(stop?6:1.4));if(c.v<.05&&stop)c.v=0;c.d+=c.v*dt;
 c.stopT=stop&&why&&why.player?c.stopT+dt:0;
 // mesh: smooth heading
 const yw=Math.atan2(dx,dz);let df=yw-c.yaw;df=Math.atan2(Math.sin(df),Math.cos(df));c.yaw+=df*Math.min(1,dt*5);c.g.position.set(c.x,0,c.z);c.g.rotation.y=c.yaw;
 if(c.bar){const on=Math.floor(performance.now()/250)%2;c.bar[0].material.emissive.setHex(on?0xff2020:0x220000);c.bar[1].material.emissive.setHex(on?0x000822:0x2040ff);}});}
