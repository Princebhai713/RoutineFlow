
"use client";

import { useState, useEffect, useCallback } from 'react';

function postMessageToServiceWorker(message: any) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

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
        },
      }
    });
  }, []);

  const scheduleNotification = useCallback((title: string, scheduleTime: Date, options?: NotificationOptions): number | undefined => {
    if (permission !== 'granted') {
      return undefined;
    }

    const now = new Date().getTime();
    const timeUntilNotification = scheduleTime.getTime() - now;

    if (timeUntilNotification < 0) {
      console.log("Cannot schedule notification for a past time.");
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      showNotification(title, options);
    }, timeUntilNotification);

    return timeoutId;
  }, [permission, showNotification]);

  const cancelNotification = useCallback((timeoutId: number) => {
    window.clearTimeout(timeoutId);
  }, []);


  return { permission, requestPermission, showNotification, scheduleNotification, cancelNotification };
}
