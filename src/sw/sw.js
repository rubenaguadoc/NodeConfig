workbox.core.setCacheNameDetails({prefix: "my-app"});
workbox.skipWaiting();
workbox.clientsClaim();

// Custom SW, to see some templates, auto generate them trough the webpack config runtimecching: [{...}]

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "directoryIndex": "index.html"
});
