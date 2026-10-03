const {chromium}=require('C:/Users/ROPY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {execFileSync}=require('node:child_process');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const endpoint=execFileSync('cmd.exe',['/d','/s','/c','npx --yes agent-browser get cdp-url'],{encoding:'utf8'}).trim();const browser=await chromium.connectOverCDP(endpoint);
 const page=browser.contexts()[0].pages().find(p=>p.url().includes('RestrictedAccess.html'));const errors=[];page.on('pageerror',e=>errors.push(e.message));let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};
 try{
  await page.setViewportSize({width:1440,height:900});await page.reload();await page.waitForFunction(()=>typeof applyRoomPrivacy==='function');
  await page.evaluate(()=>{while(!sc.hidden)nextLine();paused=true;S.min=600;document.getElementById('toasts').replaceChildren();});
  // Render from eight directions and both zoom limits, around each exterior side of the dorm.
  for(const [x,z] of[[-36,5],[-60,5],[-50,27],[-50,-15],[-6,4],[34,10]])for(const yaw of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const value of[.55,1.7]){
   await page.evaluate(({x,z,yaw,value})=>{tp(x,z,0);P.yaw=camYaw=yaw;zoom=value;paused=true;},{x,z,yaw,value});await page.waitForTimeout(35);
   check(await page.evaluate(()=>Object.values(ROOM_CONTENT).every(g=>!g.visible)&&WALLMESH.every(w=>w.s===1)&&Object.values(ROOM_CEILINGS).every(g=>g.visible)),'Exterior orbit cannot disclose any indoor room');
   check(await page.evaluate(()=>!Object.entries(BLD).some(([id,b])=>!b.fence&&cam.position.x>b.x0&&cam.position.x<b.x1&&cam.position.z>b.z0&&cam.position.z<b.z1&&cam.position.y>=0&&cam.position.y<b.floors*FH)),'Orbit camera does not enter a foreign building');
   check(await page.evaluate(()=>cam.position.y-P.f*FH>6),'Camera collision preserves useful overhead framing');
  }
  await page.evaluate(()=>{tp(-36,5,0);P.yaw=camYaw=-Math.PI/2;zoom=1;});await page.waitForTimeout(60);await page.screenshot({path:'privacy-outside.png'});
  // Every enclosed room, including basement/attic/old building, isolates its own contents.
  const ids=await page.evaluate(()=>ROOMS.filter(isEnclosedRoom).map(r=>r.id));
  for(const id of ids){
   await page.evaluate(id=>{const r=RM[id];tp((r.x0+r.x1)/2,(r.z0+r.z1)/2,r.f);paused=true;P.yaw=camYaw=0;},id);await page.waitForTimeout(25);
   check(await page.evaluate(id=>{const visible=Object.entries(ROOM_CONTENT).filter(([id,g])=>g.visible).map(([id])=>id);return visible.length===1&&visible[0]===id&&!ROOM_CEILINGS[id].visible&&Object.entries(ROOM_CEILINGS).every(([other,g])=>other===id||g.visible);},id),'Only occupied room is open: '+id);
  }
  await page.evaluate(()=>{tp(-50,17,0);P.yaw=camYaw=0;});await page.waitForTimeout(100);await page.screenshot({path:'privacy-inside.png'});
  // A neighboring room and its NPCs remain private from the corridor, even within interaction range.
  await page.evaluate(()=>{tp(-40.5,5,0);const n=npc('lopez');n.x=-42.3;n.z=5;n.f=0;n.b='dorm';n.away=false;paused=true;});await page.waitForTimeout(70);
  check(await page.evaluate(()=>Object.values(ROOM_CONTENT).every(g=>!g.visible)&&!npc('lopez').rig.g.visible&&npc('lopez').tag.hidden),'Corridor hides room furniture, NPC mesh and label');
  check(await page.evaluate(()=>nearest()?.npc?.id!=='lopez'),'Cannot talk to an NPC through the wall');
  await page.screenshot({path:'privacy-corridor.png'});
  // Leaving closes the previously open room in the very next frame, without fading.
  await page.evaluate(()=>{tp(-50,5,0);paused=true;});await page.waitForTimeout(80);await page.evaluate(()=>{tp(-36,5,0);paused=true;});await page.waitForTimeout(30);
  check(await page.evaluate(()=>!ROOM_CONTENT.laundry.visible&&ROOM_CEILINGS.laundry.visible&&WALLMESH.filter(w=>w.rooms.includes('laundry')).every(w=>w.s===1)),'Leaving instantly closes the room');
  // Real window view renders pixels while the world camera still hides that room.
  const windowObserver=await page.evaluate(()=>{const o=INT.find(o=>o.windowView&&o.label.includes('Phòng giặt'));return{x:o.x,z:o.z,f:o.f};});check(!!windowObserver,'Laundry has a reachable window');
  await page.evaluate(o=>{tp(o.x,o.z,o.f);paused=false;},windowObserver);await page.evaluate(()=>interact());
  check(await page.locator('#room-view').isVisible(),'E at a window opens the dedicated room camera');
  await page.waitForTimeout(250);
  check(await page.evaluate(()=>{const c=roomView.canvas,px=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let lo=255,hi=0;for(let i=0;i<px.length;i+=16){lo=Math.min(lo,px[i]);hi=Math.max(hi,px[i]);}return hi-lo>40;}),'Window camera produces a real nonblank 3D image');
  check(await page.evaluate(()=>!ROOM_CONTENT.laundry.visible&&ROOM_CEILINGS.laundry.visible&&playerRoom()===null),'Window view does not grant world-camera cutaway access');
  await page.screenshot({path:'privacy-window.png'});
  await page.keyboard.press('Escape');check(await page.evaluate(()=>!roomView&&modal.hidden),'Esc closes and releases the view');
  // Peek sites retain their existing story action after displaying the room view.
  await page.evaluate(()=>{tp(12,-15.4,0);openRoomView('lab',{x:12,z:-15.4,f:0},labPeek);});await page.waitForTimeout(200);
  check(await page.locator('#room-view-story').isVisible(),'Story peek retains its original narrative action');await page.screenshot({path:'privacy-peek.png'});
  await page.locator('#room-view-story').click();check(await page.evaluate(()=>!roomView),'Narrative action releases the inspection renderer');
  await page.evaluate(()=>{while(!sc.hidden)nextLine();closeModal();paused=true;});
  // A remote API call, rotating/zooming, or moving away cannot grant inspection access.
  await page.evaluate(()=>{tp(-6,30,0);openRoomView('laundry',{x:-59.3,z:5,f:0});});check(await page.evaluate(()=>!roomView&&modal.hidden),'Remote observation is rejected');
  await page.evaluate(()=>{openRoomView('laundry',{x:P.x,z:P.z,f:P.f});});check(await page.evaluate(()=>!roomView&&modal.hidden),'An arbitrary nearby point cannot grant room access');
  await page.evaluate(o=>{tp(o.x,o.z,1);openRoomView('laundry',o);},windowObserver);check(await page.evaluate(()=>!roomView&&modal.hidden),'A window on a different floor cannot grant access');
  await page.evaluate(o=>{tp(o.x,o.z,o.f);openRoomView('laundry',o);},windowObserver);await page.evaluate(()=>{P.x=-6;P.z=30;});await page.waitForTimeout(150);
  check(await page.evaluate(()=>!roomView&&modal.hidden),'Moving away revokes the observation');
  // Window permission is transient and is never stored in saves.
  await page.evaluate(o=>{tp(o.x,o.z,o.f);openRoomView('laundry',o);save(true);},windowObserver);
  check(await page.evaluate(()=>!Object.keys(JSON.parse(localStorage.getItem('ra_save3'))).some(k=>/view|privacy/i.test(k))),'Save contains no permanent viewing permission');await page.evaluate(()=>closeModal());
  await page.setViewportSize({width:390,height:844});await page.evaluate(o=>{tp(o.x,o.z,o.f);openRoomView('laundry',o);},windowObserver);await page.waitForTimeout(150);
  const box=await page.locator('#room-view').boundingBox();check(box.x>=0&&box.x+box.width<=390,'Mobile window view fits width');await page.screenshot({path:'privacy-window-mobile.png'});
  await page.evaluate(()=>closeModal());await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{localStorage.removeItem('ra_save3');tp(-36,5,0);P.yaw=camYaw=-Math.PI/2;zoom=1;paused=false;});
  check(errors.length===0,'No runtime errors: '+errors.join('; '));fs.writeFileSync('room-privacy-results.json',JSON.stringify({status:'passed',checks,roomsChecked:ids.length,errors,screenshots:['privacy-outside.png','privacy-inside.png','privacy-corridor.png','privacy-window.png','privacy-peek.png','privacy-window-mobile.png']},null,2));console.log(JSON.stringify({status:'passed',checks,roomsChecked:ids.length,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
