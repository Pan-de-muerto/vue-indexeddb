workbox.routing.registerRoute(

    /.*\.js/,
    workbox.strategies.networkFirst()
)

workbox.routing.registerRoute(
    /.*\.vue/,
    workbox.strategies.networkFirst()
)
  
// Use cache but update cache files in the background ASAP
workbox.routing.registerRoute(
    /.*\.css/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'css-cache'
    })
)

//Cache first, but defining duration and maximum files
workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    workbox.strategies.cacheFirst({
        cacheName: 'image-cache',
        plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 20,
            maxAgeSeconds: 7 * 24 * 60 * 60
        })
        ]
    })
)

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'googleapis',
        plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 30
        })
        ]
    })
)