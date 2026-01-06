"use client";

import { useState, useEffect } from 'react';
import { BrainCircuit, Bell, BellOff } from 'lucide-react';
import type { Routine } from '@/lib/types';
import { SmartScheduler } from './smart-scheduler';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';

export function AppHeader({ routines }: { routines: Routine[] }) {
  const [currentDate, setCurrentDate] = useState('');
  const { permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentDate(new Date().toDateString());
  }, []);

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Notifications Enabled",
        description: "You will now receive reminders for your routines.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Notifications Blocked",
        description: "You need to enable notifications in your browser settings.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">RoutineFlow</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <p className="hidden sm:block text-sm text-muted-foreground">{currentDate}</p>
          {permission !== 'granted' && (
            <Button onClick={handlePermissionRequest} variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          )}
          {permission === 'granted' && (
             <Button variant="outline" size="icon" disabled>
              <BellOff className="h-4 w-4" />
            </Button>
          )}
          <SmartScheduler routines={routines} />
        </div>
      </div>
    </header>
  );
}
