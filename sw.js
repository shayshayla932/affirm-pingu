const CACHE = "affirm-pingu-v106";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./assets/icon-trash.svg",
  "./assets/icon-pencil.svg",
  "./assets/icon-plus.svg",
  "./assets/nav-crystal.svg",
  "./assets/nav-calendar.svg",
  "./assets/nav-folder.svg",
  "./assets/nav-diary.svg",
  "./assets/nav-story.svg",
  "./assets/nav-home.svg",
  "./assets/buddy-nunu.png",
  "./assets/curly-cat-animated.gif",
  "./assets/sky-home.png",
  "./v2.css",
  "./app.js",
  "./manifest.webmanifest",
  "./coach/manifestation-coach.md",
  "./assets/pingu-sprite.png",
  "./assets/pingu-wave-blink.gif",
  "./assets/crystal-ball-pink-glow.gif",
  "./assets/chiwawa.png",
  "./assets/xuebi1.png",
  "./assets/xuebi2.png",
  "./assets/pingu-head.png",
  "./assets/chat-pingu.png",
  "./assets/home-bg.jpeg",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req, { cache: "no-store" })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
