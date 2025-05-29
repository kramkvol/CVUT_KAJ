const CACHE_NAME = "todo-list-cache-v1";
const FILES_TO_CACHE = [
    '/',
    '/index.php',
    '/login.php',
    '/register.php',
    '/css/styles.css',
    '/js/app.js',
    '/js/auth.js',
    '/partials/header.html',
    '/partials/footer.html'
];

// Install event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("[Service Worker] Caching app shell");
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// Activate event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("[Service Worker] Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
