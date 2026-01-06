"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Routine } from "@/lib/types";

interface RoutineTableProps {
  routines: Routine[];
  onToggleComplete: (id: string) => void;
}

export function RoutineTable({ routines, onToggleComplete }: RoutineTableProps) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold tracking-tight">No routines added yet</h3>
        <p className="text-muted-foreground mt-2">Click the '+' button to add your first routine and start tracking.</p>
      </div>
    );
  }

  const totalHours = routines.reduce((sum, routine) => sum + routine.hours, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Routines</CardTitle>
        <CardDescription>A log of your completed routines and their scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attempt</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Work</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routines.map((routine) => (
                <TableRow key={routine.id}>
                  <TableCell>{routine.attempt}</TableCell>
                  <TableCell>{routine.time}</TableCell>
                  <TableCell className="font-medium">{routine.work}</TableCell>
                  <TableCell className="text-right">{routine.hours}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={routine.completed}
                      onCheckedChange={() => onToggleComplete(routine.id)}
                      aria-label="Toggle completion status"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">Total Hours</TableCell>
                <TableCell className="text-right font-bold">{totalHours.toFixed(2)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
