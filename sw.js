const CACHE='mi-entrenamiento-v5-2';
const PREFIX='mi-entrenamiento-';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  const assets=ASSETS.map(path=>new URL(path,self.registration.scope).href);
  if(request.mode!=='navigate'&&!assets.includes(url.href))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}
    catch{const cached=await cache.match(request);if(cached)return cached;if(request.mode==='navigate')return cache.match('./index.html');return Response.error()}
  })());
});
