"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AddRoutineSheet } from "@/components/add-routine-sheet";
import { RoutineTable } from "@/components/routine-table";
import { Button } from "@/components/ui/button";
import type { Routine } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type NewRoutineData = Omit<Routine, 'id'>;

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const { toast } = useToast();

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
    if (editingRoutine) {
      setRoutines(routines.map(r => r.id === editingRoutine.id ? { ...r, ...data } : r));
      toast({ title: "Routine Updated", description: `Your routine for "${data.work}" has been updated.` });
    } else {
      const newRoutine: Routine = {
        id: crypto.randomUUID(),
        ...data,
      };
      setRoutines((prevRoutines) => [...prevRoutines, newRoutine]);
      toast({ title: "Routine Added", description: `Your routine for "${data.work}" has been saved.` });
    }
    setEditingRoutine(null);
  };
  
  const toggleRoutineCompletion = (routineId: string) => {
    setRoutines(routines.map(r => r.id === routineId ? {...r, completed: !r.completed} : r));
  };

  const deleteRoutine = (routineId: string) => {
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader routines={routines} />
      <main className="container py-8">
        <RoutineTable 
          routines={routines} 
          onToggleComplete={toggleRoutineCompletion}
          onDeleteRoutine={deleteRoutine}
          onEditRoutine={handleEdit}
        />
      </main>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
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
