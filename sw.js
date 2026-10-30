/* Vem prá Hilux: funciona offline. Muda a versão quando mudares imagens ou áudios. */
const V = 'hilux-v1';
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/img/avatar-celia.jpg",
  "assets/img/avatar-neide.jpg",
  "assets/img/avatar-rubinho.jpg",
  "assets/img/avatar-ze.jpg",
  "assets/img/capa-og.jpg",
  "assets/img/capa.jpg",
  "assets/img/final-boleia.jpg",
  "assets/img/final-bolo.jpg",
  "assets/img/final-dueto.jpg",
  "assets/img/final-sobe.jpg",
  "assets/img/final-tampa.jpg",
  "assets/img/fundo-chat.jpg",
  "assets/img/hilux-lado.png",
  "assets/img/selfie-celia.jpg",
  "assets/audio/fundo.mp3",
  "assets/audio/original.mp3",
  "assets/audio/voz-celia-1.mp3",
  "assets/audio/voz-celia-2.mp3",
  "assets/audio/voz-rubinho-1.mp3",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function rangeResponse(hit, range) {
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const s = m[1] ? +m[1] : 0;
  const en = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  const part = buf.slice(s, en + 1);
  return new Response(part, {
    status: 206, statusText: 'Partial Content',
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': 'bytes ' + s + '-' + en + '/' + buf.byteLength,
      'Content-Length': String(part.byteLength)
    }
  });
}

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(V);
    if (r.mode === 'navigate') {            // página: rede primeiro, cache se estiver offline
      try { const res = await fetch(r); if (res.ok) c.put('index.html', res.clone()); return res; }
      catch (err) { return (await c.match('index.html')) || (await c.match('./')) || Response.error(); }
    }
    const hit = await c.match(r.url);        // restantes ficheiros: cache primeiro
    if (hit) { const rg = r.headers.get('range'); return rg ? rangeResponse(hit, rg) : hit; }
    try { const res = await fetch(r); if (res.ok && res.status === 200) c.put(r, res.clone()); return res; }
    catch (err) { return Response.error(); }
  })());
});
