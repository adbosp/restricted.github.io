/* Change the version whenever any shipped game asset changes. */
const CACHE='ashgrove-mobile-v5';
const ROOT=new URL('./',self.location.href);
const GAME=new URL('RestrictedAccess.html',ROOT).href;
const ASSETS=['RestrictedAccess.html','index.html','vendor/three.r128.min.js','mobile.css','mobile.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(path=>new URL(path,ROOT).href));await self.skipWaiting();})()));
// Activate updated assets immediately; open pages use the latest version on their next navigation.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('ashgrove-mobile-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.href.startsWith(ROOT.href))return;
 if(event.request.mode==='navigate'&&(url.pathname===new URL(GAME).pathname||url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname)){
  // Prefer the newest deployed game on navigation; keep the cached release as offline fallback.
  event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const fresh=await fetch(event.request,{cache:'no-store'});if(fresh&&fresh.ok)await cache.put(GAME,fresh.clone());return fresh;}catch{return(await cache.match(GAME))||Response.error();}})());return;
 }
 if(!ASSETS.some(path=>new URL(path,ROOT).pathname===url.pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(new Request(url.origin+url.pathname)))||fetch(event.request)));
});
