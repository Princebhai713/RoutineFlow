"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, TestTube2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AddRoutineSheet } from "@/components/add-routine-sheet";
import { RoutineTable } from "@/components/routine-table";
import { Button } from "@/components/ui/button";
import type { Routine } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { parseTimeString } from "@/lib/utils";

type NewRoutineData = Omit<Routine, 'id' | 'notificationId'>;

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const { toast } = useToast();
  const { scheduleNotification, cancelNotification, permission, showNotification, requestPermission } = useNotifications();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedRoutines = localStorage.getItem("routines");
      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      }
    } catch (error) {
      console.error("Failed to parse routines from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("routines", JSON.stringify(routines));
    }
  }, [routines, isMounted]);

  const handleAddOrUpdateRoutine = (data: NewRoutineData) => {
    let notificationId: number | undefined;

    if (editingRoutine) {
      // Update
      const updatedRoutines = routines.map(r => {
        if (r.id === editingRoutine.id) {
           // Cancel previous notification if it existed
          if (r.notificationId) {
            cancelNotification(r.notificationId);
          }
           const scheduleTime = parseTimeString(data.time);
          if (!data.completed && scheduleTime > new Date()) {
             notificationId = scheduleNotification(
              "Routine Reminder",
              scheduleTime,
              { body: `It's time for: "${data.work}"` }
            );
          }
          return { ...r, ...data, notificationId };
        }
        return r;
      });
      setRoutines(updatedRoutines);
      toast({ title: "Routine Updated", description: `Your routine for "${data.work}" has been updated.` });
    } else {
      // Add new
      const scheduleTime = parseTimeString(data.time);
      if (!data.completed && scheduleTime > new Date() && permission === 'granted') {
        notificationId = scheduleNotification(
          "Routine Reminder",
          scheduleTime,
          { body: `It's time for: "${data.work}"` }
        );
      }

      const newRoutine: Routine = {
        id: crypto.randomUUID(),
        ...data,
        notificationId,
      };
      setRoutines((prevRoutines) => [...prevRoutines, newRoutine]);
      toast({ title: "Routine Added", description: `Your routine for "${data.work}" has been saved.` });
    }
    setEditingRoutine(null);
  };
  
  const toggleRoutineCompletion = (routineId: string) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        const updatedRoutine = { ...r, completed: !r.completed };
        // If marking as complete, cancel notification
        if (updatedRoutine.completed && updatedRoutine.notificationId) {
          cancelNotification(updatedRoutine.notificationId);
          updatedRoutine.notificationId = undefined;
        }
        // If un-marking, re-schedule if time is in future
        else if (!updatedRoutine.completed) {
          const scheduleTime = parseTimeString(r.time);
          if (scheduleTime > new Date()) {
            updatedRoutine.notificationId = scheduleNotification(
              "Routine Reminder",
              scheduleTime,
              { body: `It's time for: "${r.work}"` }
            );
          }
        }
        return updatedRoutine;
      }
      return r;
    }));
  };

  const deleteRoutine = (routineId: string) => {
    const routineToDelete = routines.find(r => r.id === routineId);
    if (routineToDelete && routineToDelete.notificationId) {
      cancelNotification(routineToDelete.notificationId);
    }
    setRoutines(routines.filter(r => r.id !== routineId));
    toast({
      title: "Routine Deleted",
      description: "The routine has been removed.",
    });
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingRoutine(null);
    setIsSheetOpen(true);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setEditingRoutine(null);
    }
  };

  const sendDemoNotification = async () => {
    let currentPermission = permission;
    if (currentPermission === 'default') {
      const granted = await requestPermission();
      currentPermission = granted ? 'granted' : 'denied';
    }

    if (currentPermission !== 'granted') {
      toast({
        variant: "destructive",
        title: "Notifications Blocked",
        description: "Click the lock icon in the address bar to enable notifications.",
      });
      return;
    }
    showNotification("Demo Routine: Sleep", {
      body: "Time: 12:00, Hours: 10, Attempt: First",
    });
     toast({
      title: "Demo Notification Sent",
      description: "Check your system notifications.",
    });
  };


  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <AppHeader routines={routines} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <RoutineTable 
            routines={routines} 
            onToggleComplete={toggleRoutineCompletion}
            onDeleteRoutine={deleteRoutine}
            onEditRoutine={handleEdit}
          />
        </div>
      </main>
       <Button
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        variant="secondary"
        onClick={sendDemoNotification}
        aria-label="Send demo notification"
      >
        <TestTube2 className="h-6 w-6" />
      </Button>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        onClick={handleAddNew}
        aria-label="Add new routine"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <AddRoutineSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        onAddRoutine={handleAddOrUpdateRoutine}
        routineToEdit={editingRoutine}
      />
    </div>
  );
}
