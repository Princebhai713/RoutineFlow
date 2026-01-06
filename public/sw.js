
const CACHE_NAME = 'routineflow-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/silent.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('message', event => {
  if (event.data.type === 'show-notification') {
    const { title, options } = event.data.payload;
    event.waitUntil(self.registration.showNotification(title, {
      ...options,
      actions: [
        { action: 'snooze', title: 'Snooze 5 mins' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    }));
  } else if (event.data.type === 'schedule-notification') {
    const { id, title, options, time } = event.data.payload;
    const delay = time - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, { 
            ...options,
            tag: String(id), // Use ID as tag
            data: { id, originalTime: time, title, options },
            actions: [
                { action: 'snooze', title: 'Snooze 5 mins' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        });
      }, delay);
    }
  } else if (event.data.type === 'cancel-notification') {
      // This is harder to implement with setTimeout, but we can prevent future ones
      // For a real app, a more robust solution like IndexedDB would be needed.
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'snooze') {
    const fiveMinutes = 5 * 60 * 1000;
    const { title, options } = event.notification.data;
    
    self.registration.showNotification(`Snoozed: ${title}`, {
        ...options,
        tag: event.notification.tag,
        showTrigger: new self.TimestampTrigger(Date.now() + fiveMinutes),
        data: event.notification.data,
        actions: [
            { action: 'snooze', title: 'Snooze 5 mins' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    });
  } else if (event.action === 'dismiss') {
    // Just close the notification, which is the default behavior.
  } else {
    // Default action (clicking the notification body)
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
