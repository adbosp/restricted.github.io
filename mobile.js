/* Mobile UI uses the same game state, collisions, room privacy and actions as keyboard play. */
(()=>{
 const $=id=>document.getElementById(id),controls=$('mobile-controls'),stick=$('joystick'),thumb=$('joystick-thumb');
 const coarse=matchMedia('(any-pointer:coarse)'),narrow=matchMedia('(max-width:1100px)');
 let preference='auto',stickPointer=null,installPrompt=null,installed=matchMedia('(display-mode:standalone)').matches||navigator.standalone===true;
 try{preference=localStorage.getItem('ra_controls')||'auto';}catch{}
 function resetStick(){stickPointer=null;TOUCH.x=TOUCH.y=0;thumb.style.transform='';stick.classList.remove('active');}
 TOUCH.reset=resetStick;
 function syncControls(){controls.hidden=!document.body.classList.contains('mobile-mode')||!modal.hidden||!sc.hidden;$('touch-crouch').setAttribute('aria-pressed',String(P.crouch));}
 function applyMode(){
  const on=preference==='touch'||preference==='auto'&&(coarse.matches||navigator.maxTouchPoints>0&&narrow.matches);
  clearGameInput();document.body.classList.toggle('mobile-mode',on);$('bMobile').setAttribute('aria-pressed',String(on));
  ren.setPixelRatio(Math.min(devicePixelRatio||1,on?1.5:2));resize();syncControls();
 }
 coarse.addEventListener('change',applyMode);narrow.addEventListener('change',applyMode);
 new MutationObserver(syncControls).observe(modal,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(syncControls).observe(sc,{attributes:true,attributeFilter:['hidden']});
 function moveStick(e){
  const rect=stick.getBoundingClientRect(),radius=rect.width*.34;
  let x=(e.clientX-rect.left-rect.width/2)/radius,y=(e.clientY-rect.top-rect.height/2)/radius;
  const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}
  thumb.style.transform=`translate(${x*radius}px,${y*radius}px)`;
  const amount=Math.hypot(x,y),strength=Math.max(0,(amount-.12)/.88);
  TOUCH.x=amount?x/amount*strength:0;TOUCH.y=amount?y/amount*strength:0;
 }
 stick.addEventListener('pointerdown',e=>{if(paused||stickPointer!==null)return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('active');moveStick(e);});
 stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer){e.preventDefault();moveStick(e);}});
 for(const event of['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,e=>{if(e.pointerId===stickPointer)resetStick();});
 $('touch-interact').onclick=()=>{resetStick();interact();};
 $('touch-crouch').onclick=()=>{if(paused)return;P.crouch=!P.crouch;syncControls();};
 $('touch-zoom-in').onclick=()=>zoom=Math.max(.55,zoom-.15);
 $('touch-zoom-out').onclick=()=>zoom=Math.min(1.7,zoom+.15);
 function settings(){
  openModal(`<div class="mobile-settings"><div class="who">Điều khiển · điện thoại & máy tính</div><h2>Chơi theo cách của bạn</h2><p>Joystick bên trái để đi; kéo trên cảnh 3D để xoay camera. Chụm hai ngón để zoom, hoặc dùng nút − / +. Bấm Tương tác khi đến gần người, cửa hoặc vật thể.</p><div class="opts">${[['auto','Tự động theo thiết bị'],['touch','Mobile · joystick cảm ứng'],['keyboard','Máy tính · bàn phím & chuột']].map(([mode,label])=>`<button data-mode="${mode}" class="${preference===mode?'on':''}" aria-pressed="${preference===mode}">${label}</button>`).join('')}<button id="mobile-fullscreen">⛶ Toàn màn hình</button><button id="mobile-close">Quay lại game</button></div><p class="hint">Chơi được cả dọc và ngang. Xoay ngang để có góc nhìn rộng hơn. Vuốt thanh công cụ để tìm Lưu, Tải và Cài game.</p></div>`);
  mbox.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{preference=button.dataset.mode;try{localStorage.setItem('ra_controls',preference);}catch{}applyMode();settings();});
  $('mobile-close').onclick=closeModal;
  $('mobile-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Mở game đã cài để chơi toàn màn hình trên thiết bị này.');}catch{toast('Trình duyệt này chưa cho phép fullscreen. Mở game đã cài để có màn hình rộng hơn.');}closeModal();};
 }
 $('bMobile').onclick=settings;
 function installStatus(){const button=$('bInstall');button.querySelector('small').textContent=installed?'Đã cài':'Cài game';button.title=installed?'Game đã chạy ở chế độ ứng dụng':'Cài Ashgrove lên thiết bị';}
 addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installStatus();});
 addEventListener('appinstalled',()=>{installed=true;installPrompt=null;installStatus();toast('Đã cài Ashgrove. Mở game từ màn hình chính.');});
 matchMedia('(display-mode:standalone)').addEventListener('change',event=>{installed=event.matches||navigator.standalone===true;installStatus();});
 $('bInstall').onclick=async()=>{
  if(installPrompt){const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();await prompt.userChoice;}catch{installGuide();}return;}
  installGuide();
 };
 function installGuide(){
  const apple=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
  const android=/Android/.test(navigator.userAgent);
  const steps=installed?'Game đã chạy dưới dạng ứng dụng. Bạn có thể mở lại từ biểu tượng Ashgrove trên màn hình chính.':apple?'Trên iPhone / iPad: mở menu Chia sẻ, chọn Thêm vào Màn hình chính, bật Mở dưới dạng ứng dụng nếu có, rồi bấm Thêm.':android?'Trên Android: mở menu ⋮ của Chrome, chọn Cài đặt ứng dụng hoặc Thêm vào màn hình chính, rồi xác nhận Cài đặt.':'Trong Chrome / Edge: bấm biểu tượng Cài đặt cạnh thanh địa chỉ, hoặc mở menu trình duyệt → Cài đặt Ashgrove.';
  const insecure=!isSecureContext;
  openModal(`<div class="mobile-settings"><div class="who">Ashgrove · ứng dụng web</div><h2>${installed?'Game đã được cài':'Cài game lên thiết bị'}</h2><p>${steps}</p><p>${insecure?'Đường dẫn này chưa hỗ trợ cài đặt và lưu ngoại tuyến. Mở game bằng địa chỉ HTTPS để cài trên điện thoại.':location.protocol==='file:'?'Chạy game qua máy chủ web với HTTPS để cài ứng dụng trên điện thoại.':'Sau lần tải đầy đủ, game lưu các tài nguyên cần thiết để mở lại khi mất mạng. Tiến trình dùng nút Lưu / Tải trên cùng thiết bị và địa chỉ web.'}</p><p id="offline-status" class="hint">${offlineMessage}</p><div class="opts"><button id="install-close">Quay lại game</button></div></div>`);
  $('install-close').onclick=closeModal;
 }
 let offlineMessage='Đang chuẩn bị tài nguyên ngoại tuyến…';
 function offlineStatus(message){offlineMessage=message;const el=$('offline-status');if(el)el.textContent=message;}
 if('serviceWorker'in navigator&&isSecureContext&&/^https?:$/.test(location.protocol)){
  navigator.serviceWorker.register('./sw.js').then(async registration=>{
   const worker=registration.installing||registration.waiting;
   if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='redundant')offlineStatus('Chưa lưu được tài nguyên ngoại tuyến. Kiểm tra mạng rồi mở lại game.');});
   await navigator.serviceWorker.ready;
   offlineStatus('Đã sẵn sàng chơi ngoại tuyến.');
   registration.addEventListener('updatefound',()=>{const update=registration.installing;if(update)update.addEventListener('statechange',()=>{if(update.state==='installed'&&navigator.serviceWorker.controller)toast('Có bản cập nhật. Đóng các cửa sổ game rồi mở lại để cập nhật.');});});
  }).catch(()=>offlineStatus('Chưa bật được chế độ ngoại tuyến. Kiểm tra mạng và quyền lưu của trình duyệt.'));
 }else offlineStatus('Cài đặt và chơi ngoại tuyến cần địa chỉ HTTPS (hoặc localhost trên máy tính).');
 installStatus();applyMode();
})();
