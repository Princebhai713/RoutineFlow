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

const routineSchema = z.object({
  attempt: z.string({ required_error: "Please select an attempt." }).min(1, "Please select an attempt."),
  time: z.string().min(1, { message: "Time is required." }),
  work: z.string().min(1, { message: "Work/Subject is required." }),
  hours: z.coerce.number().min(0, { message: "Hours must be a positive number." }).default(0),
  completed: z.boolean().default(false),
});

type RoutineFormValues = z.infer<typeof routineSchema>;
type NewRoutineData = Omit<Routine, 'id'>;

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
      time: "",
      work: "",
      hours: 0,
      completed: false,
    },
  });

  useEffect(() => {
    if (routineToEdit) {
      form.reset(routineToEdit);
    } else {
      form.reset({
        attempt: "",
        time: "",
        work: "",
        hours: 0,
        completed: false,
      });
    }
  }, [routineToEdit, form, isOpen]);

  function onSubmit(data: RoutineFormValues) {
    onAddRoutine(data);
    onOpenChange(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{routineToEdit ? "Edit Routine" : "Add New Routine"}</SheetTitle>
          <SheetDescription>
            {routineToEdit ? "Update the details of your routine." : "Fill in the details of your new routine."}
          </SheetDescription>
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
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8am - 10am" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g., 2" {...field} />
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
