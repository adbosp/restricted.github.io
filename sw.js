/* Change the version whenever any shipped game asset changes. */
const CACHE='ashgrove-mobile-v2';
const ROOT=new URL('./',self.location.href);
const GAME=new URL('RestrictedAccess.html',ROOT).href;
const ASSETS=['RestrictedAccess.html','vendor/three.r128.min.js','mobile.css','mobile.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new URL(path,ROOT).href)))));
// An update takes over on the next launch, avoiding mixed game versions in an active session.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('ashgrove-mobile-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.href.startsWith(ROOT.href))return;
 if(event.request.mode==='navigate'&&(url.pathname===new URL(GAME).pathname||url.pathname===ROOT.pathname)){
  // One coherent cached release, including launch URLs with ?source=pwa.
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(GAME))||fetch(event.request)));return;
 }
 if(!ASSETS.some(path=>new URL(path,ROOT).pathname===url.pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(new Request(url.origin+url.pathname)))||fetch(event.request)));
});
