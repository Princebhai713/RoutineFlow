"use client";

import { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import type { Routine } from '@/lib/types';
import { SmartScheduler } from './smart-scheduler';

export function AppHeader({ routines }: { routines: Routine[] }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toDateString());
  }, []);

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
          <SmartScheduler routines={routines} />
        </div>
      </div>
    </header>
  );
}
