self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { self.clients.claim(); });

self.addEventListener('message', event => {
  const data = event.data || {};
  if(data.type === 'show-notif'){
    self.registration.showNotification(data.title || 'Reminder', { body: data.body || '' });
  }
});
