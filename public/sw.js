
// Use a cache name that includes the version to manage updates
const CACHE_NAME = 'routineflow-v1';
const scheduledNotifications = new Map();

self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  // Perform activate steps
  console.log('Service Worker activating.');
});

self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  if (type === 'show-notification') {
    const { title, options } = payload;
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }

  if (type === 'schedule-notification') {
    const { id, title, options, time } = payload;
    const delay = time - Date.now();

    if (delay > 0) {
      const timerId = setTimeout(() => {
        self.registration.showNotification(title, { ...options, tag: id });
        scheduledNotifications.delete(id);
      }, delay);
      scheduledNotifications.set(id, timerId);
    }
  }

  if (type === 'cancel-notification') {
    const { id } = payload;
    if (scheduledNotifications.has(id)) {
      clearTimeout(scheduledNotifications.get(id));
      scheduledNotifications.delete(id);
    }
  }
});
