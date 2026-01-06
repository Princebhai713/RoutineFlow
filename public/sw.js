// public/sw.js

// A map to store active timers for scheduled notifications
const scheduledNotifications = new Map();

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  if (type === 'show-notification') {
    const { title, options } = payload;
    event.waitUntil(
      self.registration.showNotification(title, {
        ...options,
        // Ensure sound is requested
        sound: options.sound || '/silent.mp3', // A silent file can be used if no custom sound, but most browsers play a default sound.
        vibrate: [200, 100, 200], // Add vibration for mobile devices
      })
    );
  } else if (type === 'schedule-notification') {
    const { id, title, options, time } = payload;
    const delay = time - Date.now();

    if (delay > 0) {
      const timerId = setTimeout(() => {
        self.registration.showNotification(title, {
          ...options,
          // Ensure sound is requested for scheduled notifications as well
          sound: options.sound || '/silent.mp3',
          vibrate: [200, 100, 200],
          actions: [
            { action: 'snooze', title: 'Snooze (5 min)' },
            { action: 'dismiss', title: 'Dismiss' }
          ],
          data: { id, originalTime: time, title, options } // Store original data for snooze
        });
        scheduledNotifications.delete(id);
      }, delay);
      scheduledNotifications.set(id, timerId);
    }
  } else if (type === 'cancel-notification') {
    const { id } = payload;
    if (scheduledNotifications.has(id)) {
      clearTimeout(scheduledNotifications.get(id));
      scheduledNotifications.delete(id);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;

  if (event.action === 'snooze') {
    const snoozeTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    
    // Re-schedule the notification
    const newTimerId = setTimeout(() => {
      self.registration.showNotification(`Snoozed: ${notificationData.title}`, {
        ...notificationData.options,
        sound: notificationData.options.sound || '/silent.mp3',
        vibrate: [200, 100, 200],
        actions: [
            { action: 'snooze', title: 'Snooze (5 min)' },
            { action: 'dismiss', title: 'Dismiss' }
        ],
        data: notificationData // Pass the same data again
      });
      scheduledNotifications.delete(notificationData.id);
    }, snoozeTime - Date.now());

    scheduledNotifications.set(notificationData.id, newTimerId);

  } else if (event.action === 'dismiss') {
    // Just close the notification, which is the default behavior.
    // No further action needed.
  } else {
    // Default action (if user just clicks the notification body)
    // Focus or open the app window
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});
