
import Me from "./assets/me-compressed.jpg";
import ChewbaccaChatImage from "./assets/chewbacca-chat.png";
import TicTacToeImage from "./assets/tic-tac-toe.jpg";

const currentCacheName = "BHCache-" + Me.split(".")[1]
    + ChewbaccaChatImage.split(".")[1] + TicTacToeImage.split(".")[1];
const cacheItems = [
    Me,
    ChewbaccaChatImage,
    TicTacToeImage
];

self.addEventListener("install", evt => {
    console.log("Installing.");
    evt.waitUntil(
        caches.open(currentCacheName).then(cache => {
            cache.addAll(cacheItems);
        })
    );
});

self.addEventListener("activate", evt => {
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => cacheName !== currentCacheName);
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});


self.addEventListener("fetch", evt => {
    evt.respondWith(
        caches.open(currentCacheName).then(cache => {
            return cache.match(evt.request).then(response => {
                if (response) {
                    console.log("Getting from cache");
                }
                return response || fetch(evt.request).then(response => {
                    // console.log("Adding to cache");
                    // cache.put(evt.request, response.clone());
                    return response;
                });
            });
        })
    );
});