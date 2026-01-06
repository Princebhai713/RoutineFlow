"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AddRoutineSheet } from "@/components/add-routine-sheet";
import { RoutineTable } from "@/components/routine-table";
import { Button } from "@/components/ui/button";
import type { Routine } from "@/lib/types";

type NewRoutineData = Omit<Routine, 'id'>;

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const addRoutine = (data: NewRoutineData) => {
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      ...data,
    };
    setRoutines((prevRoutines) => [...prevRoutines, newRoutine]);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader routines={routines} />
      <main className="container py-8">
        <RoutineTable routines={routines} />
      </main>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsSheetOpen(true)}
        aria-label="Add new routine"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <AddRoutineSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onAddRoutine={addRoutine}
      />
    </div>
  );
}
