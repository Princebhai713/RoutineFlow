
"use client";

import { useState, useEffect, useCallback } from 'react';

function postMessageToServiceWorker(message: any) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

// A simple way to generate unique IDs for notifications
let notificationIdCounter = 0;
const generateId = () => {
  notificationIdCounter += 1;
  return notificationIdCounter;
};


export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.error("This browser does not support desktop notification");
      return false;
    }
    
    // If permission is already granted or denied, don't ask again
    if (Notification.permission !== 'default') {
      setPermission(Notification.permission);
      return Notification.permission === 'granted';
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);
    return newPermission === 'granted';
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    postMessageToServiceWorker({
      type: 'show-notification',
      payload: {
        title,
        options: {
          ...options,
          icon: '/logo.png',
          sound: '/silent.mp3', // Request sound playback
          vibrate: [200, 100, 200],
        },
      }
    });
  }, []);

  const scheduleNotification = useCallback((title: string, scheduleTime: Date, options?: NotificationOptions): number | undefined => {
    if (permission !== 'granted') {
        console.log('Notification permission not granted.');
        return undefined;
    }

    const notificationId = generateId();
    const time = scheduleTime.getTime();

    if (time < Date.now()) {
        console.log('Cannot schedule notification for a past time.');
        return undefined;
    }
    
    postMessageToServiceWorker({
        type: 'schedule-notification',
        payload: {
            id: notificationId,
            title,
            options: {
                ...options,
                icon: '/logo.png',
                sound: '/silent.mp3', // Request sound playback
                vibrate: [200, 100, 200],
            },
            time,
        },
    });

    return notificationId;
  }, [permission]);

  const cancelNotification = useCallback((notificationId: number) => {
    postMessageToServiceWorker({
        type: 'cancel-notification',
        payload: { id: notificationId },
    });
  }, []);


  return { permission, requestPermission, showNotification, scheduleNotification, cancelNotification };
}
