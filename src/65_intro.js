/* =====================================================================
   CRESTMOOR · intro: a taxi ride into town, late at night, in the rain
   Its own little scene, rendered on the same canvas while the town waits (INTRO_ON pauses the main loop).
   ===================================================================== */
const INTRO_LINES=[
 'Xa lộ 26, gần nửa đêm. Mưa Oregon không ồn ào. Nó chỉ không bao giờ dừng.',
 'Ethan Cole, 18 tuổi. Một chiếc vali cũ, một chiếc ba lô, và tờ giấy báo nhập học Đại học Crestmoor gấp làm tư trong túi áo.',
 'Mẹ tiễn cậu ở bến xe Portland. Bà dặn đủ thứ, trừ điều cậu muốn hỏi nhất: người bố tên John, người đã bỏ đi khi cậu còn quá nhỏ để nhớ mặt.',
 '"Lần đầu tới Crestmoor hả?" ông tài xế taxi hỏi, mắt vẫn nhìn đường. "Thị trấn nhỏ, nhưng tai mắt thì nhiều. Cậu sẽ quen thôi."',
 'Giá thuê nhà ở thành phố cao đến mức cậu bật cười khi đọc. Rồi cậu thấy một mẩu tin nhỏ: "Cho thuê một phòng ngủ trong nhà riêng, dùng chung bếp. Liên hệ: Sara Whitfield."',
 'Tấm biển chào mừng lướt qua trong ánh đèn pha. Ai đó đã xịt sơn đỏ lên góc biển: một bông hồng nhỏ, nét vẽ vội.',
 'Đêm đó cậu ngủ ở nhà nghỉ cạnh bến xe. Chiều hôm sau, trời tạnh.'];
function playIntro(done){
 window.INTRO_ON=true;document.body.classList.add('intro');
 const isc=new THREE.Scene();isc.background=new THREE.Color(0x04060b);isc.fog=new THREE.Fog(0x060910,6,110);
 const icam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.03,300);icam.position.set(.08,1.3,1.75);icam.lookAt(-.1,1.0,-12);
 const onRs=()=>{icam.aspect=innerWidth/innerHeight;icam.updateProjectionMatrix();};addEventListener('resize',onRs);
 isc.add(new THREE.AmbientLight(0x1c2638,.9));isc.add(new THREE.HemisphereLight(0x22324a,0x0a0a0a,.35));
 const dash=new THREE.PointLight(0x4f9cff,.7,2.2);dash.position.set(-.45,.98,-.55);isc.add(dash);
 const hl=new THREE.SpotLight(0xfff0cc,2.6,70,.42,.55,1.1);hl.position.set(0,.75,-2.2);hl.target.position.set(-.3,0,-34);isc.add(hl,hl.target);
 const SPEED=21;const movers=[];
 // wet road with lane markings
 const rc=document.createElement('canvas');rc.width=256;rc.height=256;{const g=rc.getContext('2d');g.fillStyle='#17181b';g.fillRect(0,0,256,256);
  for(let i=0;i<2500;i++){g.fillStyle=Math.random()<.5?'#202226':'#111214';g.fillRect(Math.random()*256,Math.random()*256,2,2);}
  g.fillStyle='#d8d4c8';g.fillRect(14,0,5,256);g.fillRect(237,0,5,256);g.fillStyle='#d9b23a';g.fillRect(124,0,4,256);g.fillRect(130,0,4,256);}
 const rt=new THREE.CanvasTexture(rc);rt.wrapS=rt.wrapT=THREE.RepeatWrapping;rt.repeat.set(1,30);rt.encoding=THREE.sRGBEncoding;
 const road=new THREE.Mesh(new THREE.PlaneGeometry(15,420),new THREE.MeshPhongMaterial({map:rt,shininess:90,specular:0x555a66}));road.rotation.x=-Math.PI/2;road.position.set(-1.9,0,-190);isc.add(road);
 const gnd=new THREE.Mesh(new THREE.PlaneGeometry(400,420),new THREE.MeshLambertMaterial({color:0x0b130d}));gnd.rotation.x=-Math.PI/2;gnd.position.set(0,-.02,-190);isc.add(gnd);
 // pines both sides
 const pine=new THREE.InstancedMesh(new THREE.ConeGeometry(1.8,7,7),new THREE.MeshLambertMaterial({color:0x0f2416}),90);const pM=new THREE.Matrix4();const pines=[];
 for(let i=0;i<90;i++){const side=i%2?1:-1;pines.push({x:side*(10+Math.random()*24),z:-Math.random()*200,s:.7+Math.random()*.8});}isc.add(pine);
 // street lamps on the right shoulder, two real lights recycled ahead of the car
 const lamps=[];for(let i=0;i<9;i++){const g=new THREE.Group();g.position.set(5.6,0,-i*26);
  {const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,6,6),new THREE.MeshLambertMaterial({color:0x22262c}));pole.position.y=3;g.add(pole);}
  const arm=new THREE.Mesh(new THREE.BoxGeometry(1.6,.07,.07),new THREE.MeshLambertMaterial({color:0x22262c}));arm.position.set(-.8,5.95,0);g.add(arm);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:0xffd9a0}));bulb.position.set(-1.5,5.85,0);g.add(bulb);
  isc.add(g);lamps.push(g);}
 const LL=[0,1].map(()=>{const l=new THREE.PointLight(0xffc98a,1.6,24,1.6);isc.add(l);return l;});
 // oncoming cars + a tail light far ahead
 const glow=c=>new THREE.MeshBasicMaterial({color:c});
 const onc=new THREE.Group();[-.55,.55].forEach(x=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),glow(0xfff6dc));m.position.set(x,.7,0);onc.add(m);});
 const oncL=new THREE.PointLight(0xfff0d0,1.4,18,1.4);oncL.position.set(0,1,-1);onc.add(oncL);onc.position.set(-3.8,0,-220);isc.add(onc);
 const tail=new THREE.Group();[-.5,.5].forEach(x=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.3,.12,.05),glow(0xff2a1a));m.position.set(x,.8,0);tail.add(m);});tail.position.set(0,0,-70);isc.add(tail);
 // welcome sign with a red spray-painted rose
 const sc2=document.createElement('canvas');sc2.width=512;sc2.height=256;{const g=sc2.getContext('2d');g.fillStyle='#1f4a33';g.fillRect(0,0,512,256);g.strokeStyle='#f2efe6';g.lineWidth=8;g.strokeRect(10,10,492,236);
  g.fillStyle='#f2efe6';g.textAlign='center';g.font='bold 34px Georgia,serif';g.fillText('CHÀO MỪNG ĐẾN',256,78);g.font='bold 64px Georgia,serif';g.fillText('CRESTMOOR',256,148);g.font='bold 26px Georgia,serif';g.fillText('DÂN SỐ 8.400 · OREGON',256,206);
  g.strokeStyle='#d0241a';g.lineWidth=7;g.lineCap='round';g.beginPath();g.arc(452,64,16,0,Math.PI*1.7);g.stroke();g.beginPath();g.arc(452,64,7,0,Math.PI*1.5);g.stroke();g.beginPath();g.moveTo(452,82);g.quadraticCurveTo(446,104,454,122);g.stroke();
  g.beginPath();g.moveTo(450,100);g.lineTo(436,92);g.stroke();g.fillStyle='rgba(208,36,26,.8)';g.fillRect(470,70,3,22);}
 const st=new THREE.CanvasTexture(sc2);st.encoding=THREE.sRGBEncoding;const sign=new THREE.Group();
 const board=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.8,.08),[0,0,0,0].map(()=>new THREE.MeshLambertMaterial({color:0x1a2a20})).concat([new THREE.MeshLambertMaterial({map:st}),new THREE.MeshLambertMaterial({color:0x1a2a20})]));board.position.y=2.4;sign.add(board);
 [-1.4,1.4].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.1,2.4,.1),new THREE.MeshLambertMaterial({color:0x555555}));p.position.set(x,1.2,0);sign.add(p);});
 sign.position.set(6.4,0,-400);sign.rotation.y=-.35;isc.add(sign);let signOn=false;
 // falling rain outside
 const RN=1600,rp=new Float32Array(RN*6);const rain=[];for(let i=0;i<RN;i++)rain.push([Math.random()*30-15,Math.random()*9,-Math.random()*60]);
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(rp,3));const rainL=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0x8fa4c0,transparent:true,opacity:.35}));isc.add(rainL);
 // car interior (fixed around the camera)
 const ink=c=>new THREE.MeshLambertMaterial({color:c});const add=(geo,m,x,y,z,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);isc.add(o);return o;};
 add(new THREE.BoxGeometry(1.9,.32,.6),ink(0x15161a),0,.82,-.78);add(new THREE.BoxGeometry(1.9,.06,.4),ink(0x1d1f24),0,.99,-.62,-.25);
 add(new THREE.BoxGeometry(.32,.06,.01),new THREE.MeshBasicMaterial({color:0x3f8cff}),-.42,.99,-.43,-.9);
 add(new THREE.BoxGeometry(.22,.07,.01),new THREE.MeshBasicMaterial({color:0x5ae08a}),.12,1.0,-.44,-.9);
 add(new THREE.TorusGeometry(.19,.025,8,24),ink(0x0d0d0f),-.42,1.02,-.5,-.45);
 add(new THREE.SphereGeometry(.12,12,10),ink(0x0b0b0d),-.42,1.45,-.08);add(new THREE.BoxGeometry(.46,.26,.26),ink(0x101114),-.42,1.25,-.02);
 add(new THREE.BoxGeometry(2,.8,3.6),ink(0x050608),0,.4,.4);add(new THREE.BoxGeometry(1.8,.22,.5),ink(0x1c1814),0,.9,1.65);[-.42,.42].forEach(x=>{add(new THREE.BoxGeometry(.48,.5,.1),ink(0x241f1b),x,.98,.12);add(new THREE.BoxGeometry(.24,.18,.1),ink(0x241f1b),x,1.32,.12);});
 add(new THREE.BoxGeometry(.16,.06,.04),ink(0x1a1a1a),0,1.43,-.42);
 add(new THREE.BoxGeometry(2,.05,2.8),ink(0x0b0c0f),0,1.56,.85);
 [-1,1].forEach(s=>{add(new THREE.BoxGeometry(.07,.78,.07),ink(0x111215),s*.86,1.2,-.6,0,0,s*.38);add(new THREE.BoxGeometry(.05,.42,3.4),ink(0x08090c),s*.98,1.0,.5);add(new THREE.BoxGeometry(.06,.62,.08),ink(0x0c0d10),s*.97,1.27,.62);});
 // windshield rain: drops grow after each wiper pass and are cleared by the next one
 const WU={uTime:{value:0},uGlow:{value:0},uPer:{value:1.7}};
 const ws=new THREE.Mesh(new THREE.PlaneGeometry(1.72,.7),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:WU,
  vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:`uniform float uTime,uGlow,uPer;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){vec2 p=vU*vec2(26.0,11.0);vec2 c=floor(p),f=fract(p);float a=0.0;float hi=0.0;
   for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 q=c+vec2(float(i),float(j));vec2 o=vec2(h(q),h(q+7.3))*.8+.1;float r=.12+.22*h(q+3.1);
    float sweep=(q.x/26.0)*.32;float ph=fract((uTime/uPer)-sweep);float on=step(h(q+9.7)*.85,ph);
    float d=length(f-vec2(float(i),float(j))-o);float drop=(1.0-smoothstep(r*.55,r,d))*on;a=max(a,drop*.55);hi=max(hi,(1.0-smoothstep(0.0,r*.35,length(f-vec2(float(i),float(j))-o+vec2(.04,-.05))))*on);}
   vec3 col=mix(vec3(.55,.65,.8),vec3(1.0,.86,.6),uGlow)*(.35+.65*hi);gl_FragColor=vec4(col,a*(.45+.55*uGlow)+hi*.25);}`}));
 ws.position.set(0,1.18,-.62);ws.rotation.x=-.62;isc.add(ws);
 const wip=[-.45,.3].map(x=>{const g=new THREE.Group();g.position.set(x,.92,-.74);g.rotation.x=-.62;const b=new THREE.Mesh(new THREE.BoxGeometry(.03,.62,.02),ink(0x050505));b.position.y=.31;g.add(b);isc.add(g);return g;});
 // ---- overlay UI
 const ui=document.createElement('div');ui.id='introUI';ui.innerHTML='<button id="iSkip">Bỏ qua ▸▸</button><div id="iSub"><p id="iTxt"></p><small id="iHint">Chạm hoặc nhấn E để tiếp tục</small></div><div id="iCard" hidden><div><small>CHƯƠNG 1</small><h1>Ngày dọn vào</h1><p>Crestmoor, Oregon · đầu tháng Chín</p></div></div><div id="iFade"></div>';
 document.body.appendChild(ui);const txt=ui.querySelector('#iTxt');let li=-1,shown=0,full='',finished=false;
 // ---- sound: rain hiss, engine hum, wiper thump (starts on the first tap)
 let AC=null,master=null;function audio(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.0;master.connect(AC.destination);master.gain.linearRampToValueAtTime(.9,AC.currentTime+1.5);
  const buf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=buf.getChannelData(0);let b=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;b=(b+.02*w)/1.02;d[i]=w*.35+b*2.5;}
  const src=AC.createBufferSource();src.buffer=buf;src.loop=true;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;const g=AC.createGain();g.gain.value=.22;src.connect(lp).connect(g).connect(master);src.start();
  const osc=AC.createOscillator();osc.type='sawtooth';osc.frequency.value=48;const ol=AC.createBiquadFilter();ol.type='lowpass';ol.frequency.value=140;const og=AC.createGain();og.gain.value=.05;osc.connect(ol).connect(og).connect(master);osc.start();}catch(e){AC=null;}}
 function thump(){if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(50,t+.12);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(master);o.start(t);o.stop(t+.2);}
 function next(){audio();if(finished)return;if(li>=0&&shown<full.length){shown=full.length;txt.textContent=full;return;}li++;if(li>=INTRO_LINES.length)return end();full=INTRO_LINES[li];shown=0;if(li===5)signOn=true;}
 function end(){if(finished)return;finished=true;ui.querySelector('#iSub').hidden=true;ui.querySelector('#iSkip').hidden=true;const fd=ui.querySelector('#iFade');fd.style.opacity=1;
  if(AC){master.gain.linearRampToValueAtTime(0,AC.currentTime+2.2);}
  setTimeout(()=>{ui.querySelector('#iCard').hidden=false;},1200);
  setTimeout(()=>{ui.querySelector('#iCard').classList.add('out');},4200);
  setTimeout(()=>{stop=true;removeEventListener('resize',onRs);removeEventListener('keydown',kd,true);ui.remove();document.body.classList.remove('intro');window.INTRO_ON=false;if(AC)setTimeout(()=>AC.close(),400);last=performance.now();done&&done();},5200);}
 const kd=e=>{const k=e.key.toLowerCase();if(k==='e'||k===' '||k==='enter'){e.preventDefault();e.stopImmediatePropagation();next();}if(k==='escape'){e.stopImmediatePropagation();end();}};
 addEventListener('keydown',kd,true);ui.addEventListener('pointerdown',e=>{if(e.target.id==='iSkip'){audio();end();}else next();});
 // ---- loop
 let stop=false,t0=performance.now(),prev=t0,lastWipe=0;
 function loop(now){if(stop)return;requestAnimationFrame(loop);const dt=Math.min(.05,(now-prev)/1000);prev=now;const t=(now-t0)/1000;
  if(li<0&&t>1.2)next();
  if(li>=0&&shown<full.length){shown=Math.min(full.length,shown+dt*34);txt.textContent=full.slice(0,Math.floor(shown));}
  const mv=SPEED*dt;rt.offset.y+=mv/14;
  pines.forEach((p,i)=>{p.z+=mv;if(p.z>6)p.z-=200;pM.makeScale(p.s,p.s,p.s);pM.setPosition(p.x,3.5*p.s,p.z);pine.setMatrixAt(i,pM);});pine.instanceMatrix.needsUpdate=true;
  lamps.forEach(g=>{g.position.z+=mv;if(g.position.z>8)g.position.z-=26*lamps.length;});
  const ahead=lamps.filter(g=>g.position.z<4).sort((a,b)=>b.position.z-a.position.z).slice(0,2);ahead.forEach((g,i)=>{LL[i].position.set(g.position.x-1.5,5.6,g.position.z);});
  const nearL=Math.max(0,...ahead.map(g=>1-Math.min(1,Math.abs(g.position.z+2)/14)));WU.uGlow.value=nearL*.9;
  onc.position.z+=(SPEED+18)*dt;if(onc.position.z>12)onc.position.z=-260-Math.random()*200;
  tail.position.z+=(Math.sin(t*.3)*1.5)*dt;
  if(signOn){sign.position.z+=mv;if(sign.position.z<-150)sign.position.z=-150;}
  for(let i=0;i<RN;i++){const r=rain[i];r[1]-=dt*18;r[2]+=mv*.9;if(r[1]<0||r[2]>-1.3){r[0]=Math.random()*30-15;r[1]=4+Math.random()*6;r[2]=-Math.random()*60;}const k=i*6;rp[k]=r[0];rp[k+1]=r[1];rp[k+2]=r[2];rp[k+3]=r[0];rp[k+4]=r[1]+.45;rp[k+5]=r[2]-.35;}
  rg.attributes.position.needsUpdate=true;
  WU.uTime.value=t;const per=WU.uPer.value,ph=(t/per)%1;const sw=ph<.32?ph/.32:ph<.64?1-(ph-.32)/.32:0;wip.forEach(w=>{w.rotation.set(-.62,0,Math.PI/2-sw*1.7);});
  if(Math.floor(t/per)!==lastWipe){lastWipe=Math.floor(t/per);thump();}
  icam.position.y=1.3+Math.sin(t*9)*.004+Math.sin(t*1.7)*.006;
  ren.render(isc,icam);}
 requestAnimationFrame(loop);}
