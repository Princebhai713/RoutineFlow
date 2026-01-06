"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import type { Routine } from "@/lib/types";
import { calculateHours } from "@/lib/utils";


const routineSchema = z.object({
  attempt: z.string({ required_error: "Please select an attempt." }).min(1, "Please select an attempt."),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  work: z.string().min(1, { message: "Work/Subject is required." }),
  completed: z.boolean().default(false),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

type RoutineFormValues = Omit<z.infer<typeof routineSchema>, 'hours'>;
type NewRoutineData = Omit<Routine, 'id' | 'notificationId'>;

interface AddRoutineSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoutine: (data: NewRoutineData) => void;
  routineToEdit: Routine | null;
}

export function AddRoutineSheet({ isOpen, onOpenChange, onAddRoutine, routineToEdit }: AddRoutineSheetProps) {
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      attempt: "",
      startTime: "",
      endTime: "",
      work: "",
      completed: false,
    },
  });

  useEffect(() => {
    if (routineToEdit) {
      form.reset(routineToEdit);
    } else {
      form.reset({
        attempt: "",
        startTime: "",
        endTime: "",
        work: "",
        completed: false,
      });
    }
  }, [routineToEdit, form, isOpen]);

  function onSubmit(data: RoutineFormValues) {
    const hours = calculateHours(data.startTime, data.endTime);
    onAddRoutine({ ...data, hours });
    onOpenChange(false);
  }

  const sheetTitle = routineToEdit ? "Edit Routine" : "Add New Routine";
  const sheetDescription = routineToEdit 
    ? "Update the details of your routine and save the changes." 
    : "Fill in the details for a new routine to add to your schedule.";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="attempt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attempt</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an attempt" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="First">First</SelectItem>
                      <SelectItem value="Second">Second</SelectItem>
                      <SelectItem value="Third">Third</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="work"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work / Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Study Physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                   <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mark as completed
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Routine</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
