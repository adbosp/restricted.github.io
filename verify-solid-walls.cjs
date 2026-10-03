const {chromium}=require('C:/Users/ROPY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {execFileSync}=require('node:child_process'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const raw=execFileSync('cmd.exe',['/d','/s','/c','npx --yes agent-browser get cdp-url'],{encoding:'utf8'});
 const browser=await chromium.connectOverCDP(raw.slice(raw.indexOf('ws://')).trim());
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];let checks=0;
 page.on('pageerror',e=>errors.push(e.message));const check=(value,message)=>{assert.ok(value,message);checks++;};
 try{
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:8765/RestrictedAccess.html');
  await page.waitForFunction(()=>typeof cameraWallActive==='function');
  await page.evaluate(()=>{while(!sc.hidden)nextLine();S.min=600;paused=true;});
  // Each enclosed room keeps walls, their windows and doors at every camera pitch/yaw.
  const roomIds=await page.evaluate(()=>ROOMS.filter(isEnclosedRoom).map(r=>r.id));
  for(const id of roomIds){
   await page.evaluate(id=>{const r=RM[id];tp((r.x0+r.x1)/2,(r.z0+r.z1)/2,r.f);P.yaw=camYaw=Math.PI/2;P.pitch=camPitch=.08;},id);await page.waitForFunction(id=>!ROOM_CEILINGS[id].visible&&Object.entries(ROOM_CEILINGS).every(([other,c])=>other===id||c.visible),id);
   check(await page.evaluate(()=>WALLMESH.every(w=>w.s===1&&w.m.scale.y===1&&w.m.position.y===w.h/2&&w.deco.every(d=>d.visible))),'Full-height walls/windows remain in '+id);
   check(await page.evaluate(()=>DOORS.every(d=>d.piv.visible)&&LEDGE.every(l=>l.m.visible)),'Door leaves and facade bands remain in '+id);
   check(await page.evaluate(id=>!ROOM_CEILINGS[id].visible&&Object.entries(ROOM_CEILINGS).every(([other,c])=>other===id||c.visible),id),'Only occupied ceiling hides in '+id);
  }
  // Isolate the camera solver: doorway rays use physical openings and are independent of door animation.
  const metrics=await page.evaluate(()=>{
   const paths=[{name:'KTX entrance',x:-38,z:5,axis:'x',yaw:Math.PI/2},{name:'Main entrance',x:-6,z:0,axis:'z',yaw:0},{name:'Laundry door',x:-42,z:5,axis:'x',yaw:Math.PI/2},{name:'Math classroom',x:-25,z:-5,axis:'z',yaw:0}];
   const rows=[];
   for(const path of paths)for(const direction of[-1,1]){
    let previous=null,maxStep=0,minClearance=1,leafInfluence=0,passedDoor=false;
    for(let i=0;i<=80;i++){
     const t=direction*(-1+i*.025),x=path.x+(path.axis==='x'?t:0),z=path.z+(path.axis==='z'?t:0);
     tp(x,z,0);P.yaw=camYaw=path.yaw;P.pitch=camPitch=.08;zoom=1;
     const start=new THREE.Vector3(x,1.4,z),eye=new THREE.Vector3(x+Math.sin(path.yaw)*Math.cos(.08)*7.2,1.45+Math.sin(.08)*7.2,z+Math.cos(path.yaw)*Math.cos(.08)*7.2);
     if(i===0){camClearance=1;camAnchor={x,z,f:0};}
     cam.position.copy(eye);avoidClosedBuildings(1/60);const sample=cam.position.clone();minClearance=Math.min(minClearance,camClearance);
     if(previous)maxStep=Math.max(maxStep,sample.distanceTo(previous));previous=sample;
     if(path.axis==='x'?x<path.x&&sample.x>path.x||x>path.x&&sample.x<path.x:z<path.z&&sample.z>path.z||z>path.z&&sample.z<path.z)passedDoor=true;
     const savedClearance=camClearance,savedAnchor={...camAnchor};
     DOORS.forEach(d=>d.piv.rotation.y+=1.5);cam.position.copy(eye);avoidClosedBuildings(0);leafInfluence=Math.max(leafInfluence,sample.distanceTo(cam.position));DOORS.forEach(d=>d.piv.rotation.y-=1.5);camClearance=savedClearance;camAnchor=savedAnchor;
    }
    rows.push({name:path.name,direction,maxStep,minClearance,leafInfluence,passedDoor});
   }
   return rows;
  });
  for(const row of metrics){check(row.passedDoor,'Camera crosses aperture at '+row.name);check(row.maxStep<.12,'No camera jump across '+row.name+' '+row.direction+' (step '+row.maxStep+')');check(row.leafInfluence<1e-8,'Opening/closing door does not move camera at '+row.name);}
  await page.evaluate(()=>{tp(-50,5,0);P.yaw=camYaw=Math.PI/2;P.pitch=camPitch=.6;zoom=.8;camClearance=1;document.getElementById('toasts').replaceChildren();});await page.waitForTimeout(250);await page.screenshot({path:'solid-walls-inside.png'});
  await page.evaluate(()=>{tp(-39,5,0);P.yaw=camYaw=Math.PI/2;P.pitch=camPitch=.08;zoom=1;});await page.waitForTimeout(250);await page.screenshot({path:'doorway-camera.png'});
  check(await page.evaluate(()=>Object.values(ROOM_CONTENT).every(g=>!g.visible)),'Passing camera through entrance never grants room visibility');
  // Actual keyboard crossing confirms room entry leaves the walls upright and the camera stable.
  await page.evaluate(()=>{tp(-41,5,0);P.yaw=camYaw=Math.PI/2;P.pitch=camPitch=.08;paused=false;});await page.keyboard.down('w');await page.waitForFunction(()=>P.x<-42.4,{timeout:10000});await page.keyboard.up('w');
  check(await page.evaluate(()=>P.x<-42&&playerRoom()?.id==='laundry'),'Keyboard walks through actual laundry doorway');
  check(await page.evaluate(()=>WALLMESH.every(w=>w.s===1&&w.m.scale.y===1)&&!ROOM_CEILINGS.laundry.visible),'Live doorway crossing hides ceiling and keeps walls upright');
  check(errors.length===0,'No runtime errors');
  fs.writeFileSync('solid-walls-results.json',JSON.stringify({checks,errors,metrics,url:process.env.GAME_URL||'local',screenshots:['solid-walls-inside.png','doorway-camera.png']},null,2));console.log(JSON.stringify({checks,errors,metrics}));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
