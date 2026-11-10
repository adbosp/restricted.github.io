/* =====================================================================
   CRESTMOOR · rigged people + vehicle models (assets/*.glb)
   Loaded at runtime; until they arrive (or if fetch fails, e.g. file://) the blocky fallbacks stay.
   People: Quaternius-style rigs with Walk/Run/Idle clips. Sleep and shower poses are built on top.
   ===================================================================== */
const AS={human:{},car:{},ready:false};
const HUMAN_TARGET=1.85;
function parallelTraverse(a,b,cb){cb(a,b);for(let i=0;i<a.children.length;i++)parallelTraverse(a.children[i],b.children[i],cb);}
function skClone(src){const sL=new Map(),cL=new Map(),cl=src.clone();parallelTraverse(src,cl,(a,b)=>{sL.set(b,a);cL.set(a,b);});
 cl.traverse(n=>{if(!n.isSkinnedMesh)return;const sm=sL.get(n);n.skeleton=sm.skeleton.clone();n.bindMatrix.copy(sm.bindMatrix);n.skeleton.bones=sm.skeleton.bones.map(b=>cL.get(b));n.bind(n.skeleton,n.bindMatrix);});return cl;}
function glbLoad(url){return fetch(url).then(r=>{if(!r.ok)throw new Error(url);return r.arrayBuffer();}).then(buf=>new Promise((res,rej)=>new THREE.GLTFLoader().parse(buf,'',res,rej)));}

/* which body each character wears */
const BODY_OF={ethan:'main',sara:'woman2',rossie:'woman2',lucy:'woman2',lily:'woman2',natasha:'woman2',
 may:'woman1',melania:'woman1',jeanie:'woman1',laura:'woman1',maria:'woman1',chloe:'woman1',lynda:'woman1',
 dave:'suit',morgan:'suit',williams:'suit',bancroft:'suit',marcus:'suit',max:'man',evan:'man',paul:'man'};
const CLIP_ALIAS={idle:['Idle','Man_Idle'],idle2:['Idle_Neutral','Man_Standing'],walk:['Walk','Man_Walk'],run:['Run','Man_Run'],wave:['Wave','Man_Clapping'],interact:['Interact','Man_Standing'],sit:['Man_Sitting']};
function clipFor(clips,alias){for(const nm of CLIP_ALIAS[alias])for(const c of clips){const s=c.name.split('|').pop();if(s===nm)return c;}return null;}

/* recolour clothes per character so the same body reads as different people */
const MATC={};
function dressed(model,key,L){model.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];
  const out=mats.map(m=>{const nm=m.name||'',mn=o.name||'';let col=null;
   if(nm==='Skin')col=L.skin;else if(/Hair/.test(nm))col=L.hair;
   else if(nm==='Shirt'||(/Body/.test(mn)&&!/^(White|Black|Eye|Eyes|Eyebrows|Gold)$/.test(nm)))col=L.shirt;
   else if(nm==='Pants'||(/Legs/.test(mn)&&!/^(White|Black|Skin|Gold)$/.test(nm)))col=L.pants;
   if(col==null)return m;const k=key+'|'+nm+'|'+col;if(!MATC[k]){MATC[k]=m.clone();MATC[k].color.setHex(col);}return MATC[k];});
  o.material=Array.isArray(o.material)?out:out[0];o.castShadow=true;o.frustumCulled=false;});}

function attachBody(rig,body){const src=AS.human[body];if(!src||rig.mx)return;
 const m=skClone(src.scene);m.scale.setScalar(src.s);dressed(m,body+(rig.L.id||''),rig.L);
 const piv=new THREE.Group();piv.add(m);rig.g.add(piv);
 rig.g.children.forEach(c=>{if(c!==piv&&!(c.geometry&&c.geometry.type==='CircleGeometry'))c.visible=false;});
 const mx=new THREE.AnimationMixer(m),acts={};for(const a in CLIP_ALIAS){const c=clipFor(src.clips,a);if(c)acts[a]=mx.clipAction(c);}
 rig.mx=mx;rig.acts=acts;rig.piv=piv;rig.model=m;rig.cur=null;rig.idleT=rnd(3,9);playAct(rig,'idle',0);rig.mx.update(rnd(0,2));}
function playAct(rig,name,fade=.25){if(!rig.acts[name])name='idle';if(rig.cur===name)return;const nx=rig.acts[name];if(!nx)return;
 nx.reset();nx.enabled=true;nx.setEffectiveTimeScale(1);nx.setEffectiveWeight(1);nx.play();
 if(rig.cur&&rig.acts[rig.cur]){if(fade>0)rig.acts[rig.cur].crossFadeTo(nx,fade,false);else rig.acts[rig.cur].stop();}rig.cur=name;}
/* rig.pose: null | 'sleep' | 'shower' | 'sit' */
function animGLB(rig,moving,dt,speed){const pv=rig.piv;
 if(rig.pose==='sleep'){pv.rotation.set(-Math.PI/2,0,0);pv.position.set(0,rig.bedY||.62,0);playAct(rig,'idle2',.4);rig.acts[rig.cur]&&rig.acts[rig.cur].setEffectiveTimeScale(.12);}
 else{pv.rotation.set(0,0,0);pv.position.set(0,0,0);
  if(rig.pose==='sit'&&rig.acts.sit)playAct(rig,'sit');
  else if(moving)playAct(rig,(rig.run||speed>1.5)?'run':'walk',.18);
  else if(rig.pose==='shower'){playAct(rig,'idle2',.3);}
  else{rig.idleT-=dt;if(rig.idleT<=0){rig.idleT=rnd(5,12);const r=Math.random();playAct(rig,r<.55?'idle':r<.85?'idle2':'wave',.4);}
   else if(rig.cur==='walk'||rig.cur==='run'||rig.cur==='sit')playAct(rig,'idle',.2);
   if(rig.cur==='wave'&&rig.acts.wave&&rig.acts.wave.time>rig.acts.wave.getClip().duration*.95)playAct(rig,'idle',.3);}
  if(rig.acts[rig.cur])rig.acts[rig.cur].setEffectiveTimeScale(moving&&rig.cur==='walk'?Math.min(1.5,.85*speed):1);}
 // skip skeleton work for people far from the player or hidden
 if(!rig.g.visible||Math.hypot(rig.g.position.x-P.x,rig.g.position.z-P.z)>70)return;rig.mx.update(dt);}

/* ---------- vehicles ---------- */
const CAR_BODY={bus:'bus',police:'police',truck:['truck','pickup'],car:['taxi','convertible','pickup','ambulance','motorcycle','taxi','convertible']};
let carPick=0;
function carModel(name){const src=AS.car[name];if(!src)return null;const m=src.scene.clone(true);
 const box=new THREE.Box3().setFromObject(m),sz=box.getSize(new THREE.Vector3());
 const holder=new THREE.Group(),inner=new THREE.Group();holder.add(inner);inner.add(m);
 if(sz.x>sz.z)inner.rotation.y=Math.PI/2;
 const len=Math.max(sz.x,sz.z);m.position.set(-(box.min.x+box.max.x)/2,-box.min.y,-(box.min.z+box.max.z)/2);
 if(src.flip)inner.rotation.y+=Math.PI;
 holder.userData.len=len;m.traverse(o=>{if(o.isMesh){o.castShadow=true;}});return holder;}
function dressCar(c,kind){if(c.glb)return;let nm=CAR_BODY[kind]||'taxi';if(Array.isArray(nm))nm=nm[(carPick++)%nm.length];
 const h=carModel(nm);if(!h)return;const want=c.L*2*(nm==='motorcycle'?.55:1);h.scale.setScalar(want/h.userData.len);
 c.g.children.forEach(o=>{o.visible=false;});if(c.bar)c.bar.forEach(b=>{b.visible=true;b.position.y=nm==='police'?1.32:b.position.y;});
 c.g.add(h);c.glb=nm;}
const PARKED=window.PARKED_Q||[];

/* ---------- load everything ---------- */
async function loadAssets(){if(!THREE.GLTFLoader||location.protocol==='file:')return;
 const H=['main','woman1','woman2','suit','man'],Cc=['bus','police','truck','pickup','taxi','convertible','ambulance','motorcycle'];
 await Promise.all(H.map(async k=>{try{const g=await glbLoad('assets/human/'+k+'.glb');const b=new THREE.Box3().setFromObject(g.scene);
   AS.human[k]={scene:g.scene,clips:g.animations,s:HUMAN_TARGET/Math.max(.01,b.max.y-b.min.y)};}catch(e){console.warn('asset',k,e);}}));
 await Promise.all(Cc.map(async k=>{try{const g=await glbLoad('assets/car/'+k+'.glb');AS.car[k]={scene:g.scene,flip:CAR_FLIP[k]};}catch(e){console.warn('asset',k,e);}}));
 AS.ready=true;
 P.rig.L.id='ethan';attachBody(P.rig,'main');
 NPCS.forEach(n=>{n.rig.L.id=n.id;attachBody(n.rig,BODY_OF[n.id]||(n.fem?'woman1':'man'));});
 PEDS.forEach((p,i)=>{p.rig.L.id='p'+i;attachBody(p.rig,p.rig.L.fem?((i>>1)%2?'woman1':'woman2'):(p.kind==='work'&&(i>>1)%2===0?'suit':'man'));});
 CARS.forEach(c=>dressCar(c,c.kind));PARKED.forEach(c=>dressCar(c,c.kind));}
const CAR_FLIP={};

loadAssets();
