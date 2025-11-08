// Minimal service worker to show notifications if the page posts a message.
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { self.clients.claim(); });

self.addEventListener('message', event => {
  const data = event.data || {};
  if(data.type === 'show-notif'){
    self.registration.showNotification(data.title || 'Reminder', { body: data.body || '' });
  }
});

// Note: This service worker does not implement push subscriptions. To receive notifications while
// the browser is closed you need a push-server and permission flow. This worker only helps display
// notifications while the browser supports service workers and the site is open or in background.
