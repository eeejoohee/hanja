// 한자 8급 놀이터 앱 설치용 서비스 워커 (항상 최신 파일을 받아오고, 인터넷이 끊기면 마지막 화면을 보여줌)
const CACHE = "hanja-v3";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.startsWith("/hanja/push/")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("/hanja/")))
  );
});
