const {chromium}=require('C:/Users/ROPY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const endpoint=execFileSync('cmd.exe',['/d','/s','/c','npx --yes agent-browser get cdp-url'],{encoding:'utf8'}).trim();
 const browser=await chromium.connectOverCDP(endpoint);const page=browser.contexts()[0].pages().find(p=>p.url().includes('RestrictedAccess.html'));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let checks=0;const check=(value,msg)=>{assert.ok(value,msg);checks++;};
 await page.setViewportSize({width:1440,height:900});await page.reload();await page.waitForFunction(()=>typeof ENCOUNTER_TYPES!=='undefined');
 check(await page.evaluate(()=>ren.info.render.calls>0),'WebGL draws the campus');
 await page.evaluate(()=>{while(!sc.hidden)nextLine();paused=true;});
 const reset=async()=>page.evaluate(()=>{closeModal();sc.hidden=true;sq=[];sdone=null;document.getElementById('toasts').replaceChildren();S=fresh();paused=true;S.lastDay=day();NPCS.forEach(n=>{n.ov=null;n.rig.g.rotation.set(0,0,0);spawnNPC(n);});});
 const start=async type=>page.evaluate(type=>{const def=ENCOUNTER_TYPES[type];const p={id:'test:'+type,type,at:S.min,expires:S.min+105,status:'pending'};encounterState().day=day();encounterState().plan=[p];beginEncounter(p);tp(def.x+(type==='washer'?1.3:-1.3),def.z,0);P.b=bldAt(P.x,P.z,P.f)||'yard';P.room=roomAt(P.x,P.z,P.f);P.space=spaceOf(P.x,P.z,P.f);},type);
 await reset();await page.evaluate(()=>planEncounters());
 const first=await page.evaluate(()=>JSON.stringify(encounterState().plan));check(JSON.parse(first).length===2,'First day provides both encounters');
 await page.evaluate(()=>planEncounters());check(await page.evaluate(()=>JSON.stringify(encounterState().plan))===first,'Schedule does not reroll');
 // Natural scheduling, waiting and NPC anchoring.
 await page.evaluate(()=>{S.min=570;encountersTick();stepNPC(npc('jade'),.05);});
 check(await page.evaluate(()=>encounterState().active?.type==='fence'&&npc('jade').x===38.85),'Fence encounter begins at scheduled time and holds the NPC');
 await page.evaluate(()=>{S.min+=110;encountersTick();});check(await page.evaluate(()=>!encounterState().active&&encounterState().history.at(-1).outcome==='expired'),'Timeout clears the NPC without rewards');
 check(await page.evaluate(()=>S.rep===0),'Timeout does not grant or subtract reputation');
 for(const type of['washer','fence']){
  await reset();await start(type);check(await page.evaluate(()=>nearest()?.o?.act===openEncounter),'Nearby E interaction prioritizes '+type);
  await page.evaluate(()=>{paused=false;interact();});check(await page.locator('#help-encounter').isVisible(),'Help choice renders for '+type);
  check(await page.locator('#leave-encounter').isVisible(),'Ignore choice renders for '+type);
  check(await page.evaluate(()=>paused),'Dialog pauses simulation');
  await page.screenshot({path:type+'-choice.png'});await page.locator('#help-encounter').click();
  check(await page.evaluate(type=>S.rep===ENCOUNTER_TYPES[type].rep&&S.rel[ENCOUNTER_TYPES[type].npc]===ENCOUNTER_TYPES[type].rel,type),'Help applies exact rewards for '+type);
  check(await page.evaluate(()=>!encounterState().active&&encounterState().history.length===1),'Help releases NPC and records outcome');
  await page.evaluate(()=>{endEncounter('helped');while(!sc.hidden)nextLine();paused=true;save(true);});
  const rep=await page.evaluate(()=>S.rep);await page.evaluate(()=>{S.rep=999;paused=false;load();paused=true;});
  check(await page.evaluate(()=>S.rep)===rep,'Resolved rewards survive load');
  check(await page.evaluate(()=>!encounterState().active),'Resolved encounter stays resolved after load');
  await reset();await start(type);await page.evaluate(()=>openEncounter());await page.locator('#leave-encounter').click();
  check(await page.evaluate(type=>S.rep===-2&&S.rel[ENCOUNTER_TYPES[type].npc]===-4&&!encounterState().active,type),'Ignore applies consequences and releases '+type);
 }
 // Active saves retain the exact occurrence and remaining timer.
 await reset();await start('washer');await page.evaluate(()=>save(true));const activeId=await page.evaluate(()=>encounterState().active.id);
 await page.evaluate(()=>{S=fresh();paused=false;load();paused=true;stepNPC(npc('lopez'),.05);});
 check(await page.evaluate(()=>encounterState().active.id)===activeId,'Active save retains encounter ID');
 check(await page.evaluate(()=>npc('lopez').x===-56.35),'Active save restores stuck pose');
 // Compatibility with the old ra_save3 save schema and legacy accident.
 await page.evaluate(()=>{const old=fresh();delete old.encounters;delete old.rel.jade;delete old.q.encounters;old.flags.lopezStuck=1;localStorage.setItem('ra_save3',JSON.stringify(old));paused=false;load();paused=true;encountersTick();});
 check(await page.evaluate(()=>S.rel.jade===0&&S.q.encounters===1&&encounterState().active?.type==='washer'),'Old saves migrate without losing the new character or accident');
 await reset();await page.evaluate(()=>{S.min=1085;planEncounters();encountersTick();stepNPC(npc('lopez'),.05);});
 check(await page.evaluate(()=>encounterState().active?.type==='washer'),'Evening laundry schedule triggers');
 // Day changes must not replay expired opportunities from previous days.
 await page.evaluate(()=>{S.min=1440+420;encountersTick();});check(await page.evaluate(()=>encounterState().day===2&&!encounterState().active),'New day expires previous encounter and replans');
 // UI navigation and rendering on desktop/mobile.
 await reset();await page.evaluate(()=>{S.min=10*60;tp(-6,11,0);P.b='yard';P.room=null;P.space='yard';paused=true;});await page.waitForTimeout(400);
 await page.evaluate(()=>document.getElementById('toasts').replaceChildren());await page.screenshot({path:'campus-updated.png'});
 check(await page.evaluate(()=>ren.toneMapping===THREE.ACESFilmicToneMapping&&!!scene.environment&&water.material.isMeshPhysicalMaterial),'PBR environment, tone mapping and water are active');
 await page.locator('#bC').click();check(await page.getByRole('button',{name:/Jade/}).count()>0,'Jade appears in character library');await page.evaluate(()=>closeModal());
 await page.locator('#bM').click();check(await page.locator('#mapc').isVisible(),'Map opens');await page.evaluate(()=>closeModal());
 await page.locator('#bQ').click();check(await page.locator('#mbox').innerText().then(x=>x.includes('Một bàn tay giúp đỡ')),'Encounter objective appears in journal');await page.evaluate(()=>closeModal());
 await page.setViewportSize({width:390,height:844});await reset();await start('fence');await page.evaluate(()=>{updateEncounterHUD();openEncounter();});
 const b=await page.locator('#help-encounter').boundingBox();check(b&&b.x>=0&&b.x+b.width<=390&&b.y+b.height<844,'Mobile choice fits viewport');
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile layout does not overflow horizontally');const portraitBox=await page.locator('#event-portrait canvas').boundingBox();const titleBox=await page.locator('.encounter-box h2').boundingBox();check(portraitBox.x+portraitBox.width<=titleBox.x,'Mobile portrait does not overlap the title');await page.screenshot({path:'mobile-choice.png'});
 await page.setViewportSize({width:1440,height:900});await reset();await start('fence');await page.evaluate(()=>{paused=true;updateEncounterHUD();document.getElementById('toasts').replaceChildren();});await page.waitForTimeout(400);await page.screenshot({path:'fence-updated.png'});
 await reset();await start('washer');await page.evaluate(()=>{S.min=18*60;encounterState().active.expires=S.min+105;paused=true;updateEncounterHUD();document.getElementById('toasts').replaceChildren();});await page.waitForTimeout(400);await page.screenshot({path:'laundry-updated.png'});
 check(errors.length===0,'No JavaScript runtime errors: '+errors.join('; '));
 fs.writeFileSync('verification-results.json',JSON.stringify({checks,errors,status:'passed',screenshots:['campus-updated.png','fence-choice.png','washer-choice.png','mobile-choice.png','fence-updated.png','laundry-updated.png']},null,2));
 await reset();await page.evaluate(()=>{localStorage.removeItem('ra_save3');S.min=600;tp(-6,11,0);P.b='yard';P.room=null;P.space='yard';paused=false;});
 console.log(JSON.stringify({status:'passed',checks,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
