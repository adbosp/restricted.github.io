const {chromium}=require('C:/Users/ROPY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const raw=execFileSync('cmd.exe',['/d','/s','/c','npx --yes agent-browser get cdp-url'],{encoding:'utf8'});
 const browser=await chromium.connectOverCDP(raw.slice(raw.indexOf('ws://')).trim());
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3,userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'});
 const page=await context.newPage(),errors=[];let checks=0,installability;
 page.on('pageerror',error=>errors.push(error.message));
 const check=(value,message)=>{assert.ok(value,message);checks++;};
 try{
  await page.goto('http://127.0.0.1:8765/RestrictedAccess.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof TOUCH!=='undefined'&&document.body.classList.contains('mobile-mode'));
  await page.evaluate(()=>{while(!sc.hidden)nextLine();S.min=600;tp(-6,11,0);});
  check(await page.locator('#mobile-controls').isVisible(),'Touch device automatically enables joystick');
  check(await page.evaluate(()=>ren.getPixelRatio()===1.5&&ren.info.render.calls>0),'Mobile caps render scale and renders 3D');
  check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Portrait has no horizontal overflow');
  const cdp=await context.newCDPSession(page);
  const send=async(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
  const box=await page.locator('#joystick').boundingBox(),cx=box.x+box.width/2,cy=box.y+box.height/2,r=box.width*.34;
  let a={id:1,x:cx,y:cy-r*.55};
  const before=await page.evaluate(()=>({x:P.x,z:P.z,yaw:P.yaw}));
  await send('touchStart',[a]);await page.waitForTimeout(300);
  check(await page.evaluate(()=>Math.hypot(TOUCH.x,TOUCH.y)>.3&&Math.hypot(TOUCH.x,TOUCH.y)<.7),'Joystick uses analog strength');
  check(await page.evaluate(old=>Math.hypot(P.x-old.x,P.z-old.z)>.1,before),'Joystick actually moves player');
  check(await page.evaluate(old=>P.yaw===old.yaw,before),'Joystick does not rotate camera');
  let b={id:2,x:210,y:380};await send('touchStart',[a,b]);b={...b,x:275};await send('touchMove',[a,b]);
  check(await page.evaluate(old=>Math.abs(P.yaw-old.yaw)>.1&&TOUCH.y<0,before),'Second finger rotates camera while joystick stays held');
  await send('touchEnd',[]);await page.waitForTimeout(100);
  check(await page.evaluate(()=>TOUCH.x===0&&TOUCH.y===0&&cameraPointers.size===0),'All fingers release cleanly');
  const stop=await page.evaluate(()=>[P.x,P.z]);await page.waitForTimeout(150);
  check(await page.evaluate(pos=>Math.hypot(P.x-pos[0],P.z-pos[1])<.01,stop),'Player stops after releasing joystick');
  // Pinch zoom on the scene, independent from the joystick.
  const prior=await page.evaluate(()=>zoom);let p1={id:3,x:185,y:365},p2={id:4,x:275,y:365};
  await send('touchStart',[p1,p2]);p2={...p2,x:335};await send('touchMove',[p1,p2]);
  check(await page.evaluate(z=>zoom<z,prior),'Pinch spread zooms closer');await send('touchEnd',[]);
  await send('touchStart',[a]);await send('touchCancel',[]);
  check(await page.evaluate(()=>TOUCH.x===0&&TOUCH.y===0),'Pointer cancellation clears joystick');
  await page.locator('#touch-crouch').tap();check(await page.evaluate(()=>P.crouch),'Touch crouch changes game state');
  check(await page.locator('#touch-crouch').getAttribute('aria-pressed')==='true','Crouch button shows state');
  await page.locator('#touch-crouch').tap();
  await send('touchStart',[a]);await page.evaluate(()=>openModal('<button onclick="closeModal()">Đóng</button>'));
  await page.waitForTimeout(80);check(await page.evaluate(()=>TOUCH.x===0&&TOUCH.y===0),'Dialog clears held movement');
  check(!await page.locator('#mobile-controls').isVisible(),'Dialog hides controls');await send('touchEnd',[]);await page.evaluate(()=>closeModal());
  // Touch interaction reaches the real encounter choices.
  await page.evaluate(()=>{const d=ENCOUNTER_TYPES.fence;beginEncounter({id:'mobile-fence',type:'fence',at:S.min,expires:S.min+105,status:'pending'});tp(d.x-1.3,d.z,0);});
  await page.locator('#touch-interact').tap();check(await page.locator('#help-encounter').isVisible(),'Touch interaction opens help/ignore encounter');
  await page.locator('#help-encounter').tap();await page.evaluate(()=>{while(!sc.hidden)nextLine();});
  check(await page.evaluate(()=>!encounterState().active&&encounterState().history.at(-1).outcome==='helped'),'Touch choice resolves encounter');
  // Mode choice persists, and keyboard remains functional.
  await page.locator('#bMobile').scrollIntoViewIfNeeded();await page.locator('#bMobile').tap();await page.locator('[data-mode=keyboard]').tap();await page.locator('#mobile-close').tap();
  check(!await page.locator('#mobile-controls').isVisible(),'Keyboard mode hides joystick');
  await page.evaluate(()=>{S.min=600;tp(-6,11,0);});const kBefore=await page.evaluate(()=>P.z);await page.keyboard.down('w');await page.waitForTimeout(250);await page.keyboard.up('w');
  check(await page.evaluate(z=>Math.abs(P.z-z)>.1,kBefore),'Keyboard movement still works');
  await page.reload();await page.waitForFunction(()=>typeof TOUCH!=='undefined');await page.evaluate(()=>{while(!sc.hidden)nextLine();});
  check(await page.evaluate(()=>localStorage.getItem('ra_controls')==='keyboard'&&!document.body.classList.contains('mobile-mode')),'Control preference survives reload');
  await page.locator('#bMobile').scrollIntoViewIfNeeded();await page.locator('#bMobile').tap();await page.locator('[data-mode=touch]').tap();await page.locator('#mobile-close').tap();
  check(await page.locator('#mobile-controls').isVisible(),'Manual mobile mode enables controls');
  await page.evaluate(()=>{TOUCH.x=.5;K.w=1;dispatchEvent(new Event('blur'));});
  check(await page.evaluate(()=>TOUCH.x===0&&!K.w),'Losing focus clears keyboard and touch');
  await page.evaluate(()=>{S.min=600;tp(-6,11,0);paused=true;});await page.screenshot({path:'mobile-portrait.png',scale:'css'});
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(150);await page.screenshot({path:'mobile-landscape.png',scale:'css'});
  check(await page.evaluate(()=>['joystick','touch-actions','btns'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})),'Landscape controls fit viewport');
  check(await page.evaluate(()=>{const a=document.getElementById('joystick').getBoundingClientRect(),b=document.getElementById('touch-actions').getBoundingClientRect();return a.right<b.left;}),'Landscape joystick and actions do not overlap');
  await page.evaluate(()=>paused=false);
  await page.locator('#bInstall').scrollIntoViewIfNeeded();await page.locator('#bInstall').tap();
  check((await page.locator('#mbox').textContent()).includes('Android'),'Android fallback explains browser install');await page.locator('#install-close').tap();
  await page.evaluate(()=>{window.installRequested=false;const e=new Event('beforeinstallprompt');e.prompt=async()=>{window.installRequested=true;};e.userChoice=Promise.resolve({outcome:'dismissed'});dispatchEvent(e);});
  await page.locator('#bInstall').tap();check(await page.evaluate(()=>window.installRequested),'Install button invokes browser prompt when available');
  await page.evaluate(()=>dispatchEvent(new Event('appinstalled')));check(await page.locator('#bInstall small').textContent()==='Đã cài','Install completion updates button');
  // Browser validates the manifest, including decoded 192/512 icons.
  const appManifest=await cdp.send('Page.getAppManifest');check(appManifest.errors.length===0,'Browser parses manifest without errors');
  const manifest=JSON.parse(appManifest.data);check(manifest.display==='standalone'&&manifest.start_url.includes('source=pwa'),'Manifest launches standalone game');
  for(const icon of manifest.icons){const bytes=fs.readFileSync(icon.src);check(bytes.readUInt32BE(16)===+icon.sizes.split('x')[0]&&bytes.readUInt32BE(20)===+icon.sizes.split('x')[1],'PNG dimensions match '+icon.src);}
  try{installability=await cdp.send('Page.getInstallabilityErrors');check(installability.installabilityErrors.every(e=>e.errorId==='in-incognito'),'Only isolated test profile blocks installation');const normalPage=browser.contexts()[0].pages().find(p=>p.url().includes('RestrictedAccess.html'));const normalCDP=await browser.contexts()[0].newCDPSession(normalPage);installability.normalProfile=await normalCDP.send('Page.getInstallabilityErrors');check(installability.normalProfile.installabilityErrors.length===0,'Normal Chrome profile has no installability errors');}catch(error){if(error.name==='AssertionError')throw error;installability={unavailable:error.message};}
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  check(await page.evaluate(async()=>{const c=await caches.open('ashgrove-mobile-v4');return (await c.keys()).length===10;}),'Service worker precaches all ten required resources');
  await page.evaluate(()=>{S.min=725;S.rep=17;save(true);});
  await context.setOffline(true);await page.goto('http://127.0.0.1:8765/RestrictedAccess.html?source=pwa',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof ren!=='undefined'&&ren.info.render.calls>0);
  check(await page.evaluate(()=>document.body.classList.contains('mobile-mode')),'Offline installed launch renders mobile game');
  await page.evaluate(()=>{while(!sc.hidden)nextLine();load();paused=true;});
  check(await page.evaluate(()=>S.rep===17&&S.min>=725&&S.min<726),'Save survives offline relaunch');
  await page.screenshot({path:'mobile-offline.png',scale:'css'});await context.setOffline(false);
  const apple=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
  const ios=await apple.newPage();await ios.goto('http://127.0.0.1:8765/RestrictedAccess.html');await ios.evaluate(()=>{while(!sc.hidden)nextLine();});await ios.locator('#bInstall').scrollIntoViewIfNeeded();await ios.locator('#bInstall').tap();
  check((await ios.locator('#mbox').textContent()).includes('Thêm vào Màn hình chính'),'iOS fallback explains Add to Home Screen');await apple.close();
  check(errors.length===0,'No runtime JavaScript errors');
  fs.writeFileSync('mobile-results.json',JSON.stringify({checks,errors,installability,screenshots:['mobile-portrait.png','mobile-landscape.png','mobile-offline.png'],tested:'Chrome desktop with Android/iOS touch emulation; real phone install not tested'},null,2));
  console.log(JSON.stringify({checks,errors,installability}));
 }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
