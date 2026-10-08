/* Install-as-app support: service worker + "Cài game" button (Android/desktop prompt, iOS instructions). */
(()=>{
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
 const standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone===true;
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 let deferred=null;
 const btn=document.createElement('button');
 btn.id='bInstall';btn.title='Cài game';btn.hidden=true;
 btn.innerHTML='<svg class="i"><use href="#i-phone"/></svg><small>Cài game</small>';
 const bar=document.getElementById('btns');if(bar)bar.insertBefore(btn,bar.firstChild);
 const say=t=>(typeof toast==='function'?toast(t):alert(t));
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;btn.hidden=false;});
 addEventListener('appinstalled',()=>{deferred=null;btn.hidden=true;say('Đã cài game ra màn hình chính.');});
 if(!standalone&&ios)btn.hidden=false;
 btn.onclick=async()=>{
  if(deferred){deferred.prompt();const r=await deferred.userChoice.catch(()=>null);deferred=null;if(!r||r.outcome!=='accepted')btn.hidden=false;else btn.hidden=true;return;}
  if(ios)say('Trên iPhone/iPad: mở bằng Safari, bấm nút Chia sẻ rồi chọn "Thêm vào MH chính".');
  else say('Mở menu trình duyệt (⋮) và chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".');
 };
})();
