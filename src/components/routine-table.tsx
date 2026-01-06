"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Routine } from "@/lib/types";

interface RoutineTableProps {
  routines: Routine[];
}

export function RoutineTable({ routines }: RoutineTableProps) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold tracking-tight">No routines added yet</h3>
        <p className="text-muted-foreground mt-2">Click the '+' button to add your first routine and start tracking.</p>
      </div>
    );
  }

  const getStatusClass = (score: number) => {
    if (score >= 8) return "bg-chart-2/10";
    if (score >= 5) return "bg-chart-4/10";
    return "bg-chart-1/10";
  };
  
  const getDotClass = (score: number) => {
    if (score >= 8) return "text-chart-2";
    if (score >= 5) return "text-chart-4";
    return "text-chart-1";
  };

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
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routines.map((routine) => (
                <TableRow key={routine.id} className={cn(getStatusClass(routine.score))}>
                  <TableCell>{routine.attempt}</TableCell>
                  <TableCell>{routine.time}</TableCell>
                  <TableCell className="font-medium">{routine.work}</TableCell>
                  <TableCell className="text-right">{routine.score}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn("text-2xl font-bold", getDotClass(routine.score))}>•</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
