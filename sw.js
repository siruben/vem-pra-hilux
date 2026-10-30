/* Vem prá Hilux: cache offline com atualização segura. */
const V = 'hilux-v2';
const CORE_ASSETS = ['./', 'index.html', 'manifest.webmanifest'];
const OPTIONAL_ASSETS = [
  'assets/img/avatar-celia.jpg','assets/img/avatar-neide.jpg','assets/img/avatar-rubinho.jpg',
  'assets/img/avatar-ze.jpg','assets/img/capa-og.jpg','assets/img/capa.jpg',
  'assets/img/final-boleia.jpg','assets/img/final-bolo.jpg','assets/img/final-dueto.jpg',
  'assets/img/final-sobe.jpg','assets/img/final-tampa.jpg','assets/img/fundo-chat.jpg',
  'assets/img/hilux-lado.png','assets/img/selfie-celia.jpg','assets/audio/fundo.mp3',
  'assets/audio/original.mp3','assets/audio/voz-celia-1.mp3','assets/audio/voz-celia-2.mp3',
  'assets/audio/voz-rubinho-1.mp3','assets/icons/icon-192.png','assets/icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(V);
    await cache.addAll(CORE_ASSETS);
    await Promise.allSettled(OPTIONAL_ASSETS.map(async path => {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Falha ao guardar ' + path);
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== V).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
function rangeResponse(hit, range) {
  return hit.arrayBuffer().then(buffer => {
    const size = buffer.byteLength;
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    let start, end;
    if (!match[1]) {
      const suffixLength = Number(match[2]);
      if (!suffixLength) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
      start = Math.max(0, size - suffixLength); end = size - 1;
    } else {
      start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    }
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    const headers = new Headers(hit.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(buffer.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
  });
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(V);
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put('index.html', response.clone());
        return response;
      } catch (error) {
        return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
      }
    }
    const cached = await cache.match(request);
    if (cached) {
      const range = request.headers.get('range');
      return range ? rangeResponse(cached, range) : cached;
    }
    try {
      const response = await fetch(request);
      if (response.ok && response.status === 200) await cache.put(request, response.clone());
      return response;
    } catch (error) { return Response.error(); }
  })());
});
