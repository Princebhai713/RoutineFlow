"use client";

import { useState, useEffect } from 'react';
import { BrainCircuit, Bell } from 'lucide-react'
import type { Routine } from '@/lib/types';
import { SmartScheduler } from './smart-scheduler';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parseTimeString, formatDistanceToNow } from '@/lib/utils';

export function AppHeader({ routines }: { routines: Routine[] }) {
  const [currentDate, setCurrentDate] = useState('');
  const [nextRoutine, setNextRoutine] = useState<{ routine: Routine, timeUntil: string } | null>(null);
  const { permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentDate(new Date().toDateString());
  }, []);

  useEffect(() => {
    const findNextRoutine = () => {
      const now = new Date();
      const upcomingRoutines = routines
        .filter(r => !r.completed)
        .map(r => ({
          routine: r,
          scheduledTime: parseTimeString(r.time)
        }))
        .filter(r => r.scheduledTime > now)
        .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

      if (upcomingRoutines.length > 0) {
        const next = upcomingRoutines[0];
        setNextRoutine({
          routine: next.routine,
          timeUntil: formatDistanceToNow(next.scheduledTime)
        });
      } else {
        setNextRoutine(null);
      }
    };

    findNextRoutine();
    const interval = setInterval(findNextRoutine, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [routines]);

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
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/" className="flex items-center space-x-2 flex-shrink-0">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">RoutineFlow</span>
          </a>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <p className="hidden sm:block text-sm text-muted-foreground whitespace-nowrap">{currentDate}</p>
          {permission === 'granted' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Next Notification</h4>
                    <p className="text-sm text-muted-foreground">
                      Here is your next scheduled routine reminder.
                    </p>
                  </div>
                  {nextRoutine ? (
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <span className="col-span-1 text-sm font-semibold">Routine:</span>
                        <span className="col-span-2 text-sm">{nextRoutine.routine.work}</span>
                      </div>
                       <div className="grid grid-cols-3 items-center gap-4">
                        <span className="col-span-1 text-sm font-semibold">Time:</span>
                        <span className="col-span-2 text-sm">{nextRoutine.routine.time}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <span className="col-span-1 text-sm font-semibold">In:</span>
                        <span className="col-span-2 text-sm">{nextRoutine.timeUntil}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming notifications scheduled.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button onClick={handlePermissionRequest} variant="outline" size="sm" className="flex-shrink-0">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Enable Notifications</span>
              <span className="sm:hidden">Notify</span>
            </Button>
          )}
          <SmartScheduler routines={routines} />
        </div>
      </div>
    </header>
  );
}
