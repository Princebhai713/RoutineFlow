"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Routine } from "@/lib/types";

interface RoutineTableProps {
  routines: Routine[];
  onToggleComplete: (id: string) => void;
  onDeleteRoutine: (id: string) => void;
  onEditRoutine: (routine: Routine) => void;
}

export function RoutineTable({ routines, onToggleComplete, onDeleteRoutine, onEditRoutine }: RoutineTableProps) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold tracking-tight">No routines added yet</h3>
        <p className="text-muted-foreground mt-2">Click the '+' button to add your first routine and start tracking.</p>
      </div>
    );
  }

  const totalHours = routines.reduce((sum, routine) => sum + Number(routine.hours), 0);

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
                <TableHead className="text-right w-[50px]">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEditRoutine(routine)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteRoutine(routine.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">Total Hours</TableCell>
                <TableCell className="text-right font-bold">{totalHours.toFixed(2)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
