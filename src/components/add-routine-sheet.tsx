"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const routineSchema = z.object({
  attempt: z.string({ required_error: "Please select an attempt." }).min(1, "Please select an attempt."),
  time: z.string().min(1, { message: "Time is required." }),
  work: z.string().min(1, { message: "Work/Subject is required." }),
  score: z.coerce.number().min(0, { message: "Score must be at least 0." }).max(10, { message: "Score must be at most 10." }),
});

type RoutineFormValues = z.infer<typeof routineSchema>;

interface AddRoutineSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoutine: (data: RoutineFormValues) => void;
}

export function AddRoutineSheet({ isOpen, onOpenChange, onAddRoutine }: AddRoutineSheetProps) {
  const { toast } = useToast();
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      attempt: "",
      time: "",
      work: "",
      score: undefined,
    },
  });

  function onSubmit(data: RoutineFormValues) {
    onAddRoutine(data);
    toast({
      title: "Routine Added",
      description: `Your routine for "${data.work}" has been saved.`,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Routine</SheetTitle>
          <SheetDescription>
            Fill in the details of your routine. Click save when you're done.
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
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score (0-10)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="10" placeholder="e.g., 8" {...field} />
                  </FormControl>
                  <FormMessage />
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
