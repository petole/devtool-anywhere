this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v0.0.1').then(function(cache) {
        debugger;
      return cache.addAll([
          '/chrome-devtools-frontend/front_end/index.html',
          '/chrome-devtools-frontend/front_end/',
          '/chrome-devtools-frontend/front_end/timeline/timelinePanel.js',
          '/chrome-devtools-frontend/front_end/timeline/module.json',
          'index.html',
          'timeline/timelinePanel.js',
          'timeline/module.json',
      ]);
    })
  );
});

this.addEventListener('activate', function(event) {
    console.log("sw::activate");
});

this.addEventListener('message', function(msg) {
    console.log("sw::message:" + msg);
});

this.addEventListener('fetch', function(event) {
    console.log("sw::in fetch " , event.request);
    var response;
    event.respondWith(caches.match(event.request).catch(function() {
        debugger;
        console.log("sw::cache miss" , event.request);
        return fetch(event.request);
    }).then(function(r) {
        if (r === undefined) {
            console.error("sw: no response for " + event.request.url);
            throw new Error("No response for request");
        }
        console.log("sw::going to cache" , event.request, r);
        debugger;
        response = r;
        caches.open('v0.0.1').then(function(cache) {
            console.log("sw::caching " , event.request, r);
            cache.put(event.request, response);
        });
        return response.clone();
    }).catch(function(err) {
        console.error("sw::error could not get nor fetch: ", event, err)
    }));
});

console.log('sw::coucou')
