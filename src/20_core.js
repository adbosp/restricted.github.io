/* =====================================================================
   MAPLE HOLLOW · core: renderer, textures, materials, helpers
   Coordinates: x = east, z = south, y = up. Every interior is one storey (y=0).
   ===================================================================== */
const WH=3.2;            // interior wall height
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cv=document.getElementById('c');
const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
ren.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?1.25:1.6));
ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.outputEncoding=THREE.sRGBEncoding;
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xa8d0f0,80,190);
const cam=new THREE.PerspectiveCamera(48,1,.1,500);
const hemi=new THREE.HemisphereLight(0xe6f2ff,0x6a5a48,.95);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2d8,.9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:160});sun.shadow.bias=-.0006;scene.add(sun,sun.target);
const plamp=new THREE.PointLight(0xffe2b0,0,16,1.5);scene.add(plamp);
function resize(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

/*__TX__*/

TX.road=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#4a4c50';g.fillRect(0,0,w,h);speck(g,w,h,7000,['#34363a','#6a6c70'],2,.5);});
TX.walk=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#bdb6a8';g.fillRect(0,0,w,h);speck(g,w,h,3000,['#9a9488','#d8d2c4'],2,.35);
 g.strokeStyle='rgba(80,70,60,.35)';g.lineWidth=3;for(let i=0;i<=w;i+=128){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}});
TX.gravel=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#c9b48e';g.fillRect(0,0,w,h);speck(g,w,h,6000,['#a8936d','#e2d2ae','#8f7c5c'],2,.5);});
TX.leaves=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#6f9a3e';g.fillRect(0,0,w,h);
 for(let i=0;i<3000;i++){const v=Math.random();g.strokeStyle=v<.5?'#5d8a33':v<.8?'#86b155':'#4d7a2a';g.globalAlpha=.6;const x=Math.random()*w,y=Math.random()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-2,2),y-rnd(3,7));g.stroke();}
 for(let i=0;i<160;i++){g.globalAlpha=.85;g.fillStyle=['#e0752a','#c8432a','#f2b33a','#a8521f'][i%4];g.beginPath();g.ellipse(Math.random()*w,Math.random()*h,3,2,Math.random()*3,0,7);g.fill();}g.globalAlpha=1;});
TX.clap=canvasTex(256,256,(g,w,h)=>{for(let y=0;y<h;y+=16){g.fillStyle=y/16%2?'#f4f1ea':'#ece8de';g.fillRect(0,y,w,16);g.fillStyle='rgba(60,50,40,.28)';g.fillRect(0,y+14,w,2);}});

const matCache={};
function mat(key,rx=1,ry=1,tint=0xffffff){const k=key+'|'+rx.toFixed(2)+'|'+ry.toFixed(2)+'|'+tint;if(matCache[k])return matCache[k];
 const t=TX[key].clone();t.name=key;t.needsUpdate=true;t.repeat.set(rx,ry);return matCache[k]=new THREE.MeshLambertMaterial({map:t,color:tint});}
const colCache={};const C=(c,e)=>colCache[c+'|'+(e||0)]||(colCache[c+'|'+(e||0)]=new THREE.MeshLambertMaterial({color:c,emissive:e||0}));
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const WORLD=new THREE.Group();scene.add(WORLD);
let PUT=WORLD;
function mesh(geo,m,x,y,z,parent=PUT,shadow=true){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;parent.add(o);return o;}
function grp(x,z,rot=0,parent=PUT){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;parent.add(g);return g;}
function plane(w,d,m,x,y,z,parent=PUT){const p=mesh(new THREE.PlaneGeometry(w,d),m,x,y,z,parent,false);p.rotation.x=-Math.PI/2;return p;}
const MODEL_SLOTS=[];
/*__FURN__*/
F.bench=function(x,z,r=0){const g=grp(x,z,r);const w=mat('wood',1,1,0x8a5a3a),m=C(0x2b2f36);mesh(B(1.8,.08,.5),w,0,.46,0,g);mesh(B(1.8,.4,.06),w,0,.78,-.24,g);
 for(const a of[-.75,.75]){mesh(B(.08,.46,.5),m,a,.23,0,g);}MODEL_SLOTS.push({g,kind:'bench',args:[x,z,r]});return g;};

/* ---------- text signs ---------- */
function signTex(text,bg='#2b1d3a',fg='#fff6e4',w=512,h=128,font='bold 58px Georgia, serif'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(8,8,w-16,h-16);g.fillStyle=fg;g.font=font;g.textAlign='center';g.textBaseline='middle';
 let fs=parseInt(font.match(/(\d+)px/)[1]);while(g.measureText(text).width>w-40&&fs>14){fs-=2;g.font=font.replace(/\d+px/,fs+'px');}
 g.fillText(text,w/2,h/2+2);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function sign(text,x,y,z,ry,w=4,h=1,bg,fg){const m=new THREE.MeshLambertMaterial({map:signTex(text,bg,fg)});const o=mesh(B(w,h,.12),[C(0x2b1d3a),C(0x2b1d3a),C(0x2b1d3a),C(0x2b1d3a),m,m],x,y,z,PUT,false);o.rotation.y=ry;return o;}

/* ---------- small math ---------- */
const v3=new THREE.Vector3();
function segRect(ax,az,bx,bz,r,pad=0){// does segment a-b cross rect r (x0..x1,z0..z1)?
 let t0=0,t1=1;const dx=bx-ax,dz=bz-az;const P=[-dx,dx,-dz,dz],Q=[ax-(r.x0-pad),(r.x1+pad)-ax,az-(r.z0-pad),(r.z1+pad)-az];
 for(let i=0;i<4;i++){if(Math.abs(P[i])<1e-9){if(Q[i]<0)return false;continue;}const t=Q[i]/P[i];if(P[i]<0){if(t>t1)return false;if(t>t0)t0=t;}else{if(t<t0)return false;if(t<t1)t1=t;}}return true;}
