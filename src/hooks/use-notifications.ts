
"use client";

import { useState, useEffect, useCallback } from 'react';

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

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);
    return newPermission === 'granted';
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      return;
    }
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        ...options,
        icon: '/logo.png', // It's good practice to have an icon
      });

      notification.onclick = () => {
        window.focus();
      };
    }
  }, []);

  const scheduleNotification = useCallback((title: string, scheduleTime: Date, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      return;
    }

    const now = new Date().getTime();
    const timeUntilNotification = scheduleTime.getTime() - now;

    if (timeUntilNotification < 0) {
      console.log("Cannot schedule notification for a past time.");
      return;
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
