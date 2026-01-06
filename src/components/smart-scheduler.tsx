"use client";

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getSmartSuggestions } from '@/lib/actions';
import type { Routine } from '@/lib/types';
import type { SmartScheduleOutput } from '@/ai/flows/smart-schedule-suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SmartScheduler({ routines }: { routines: Routine[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartScheduleOutput | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (routines.length < 3) {
      toast({
        variant: "default",
        title: "More Data Needed",
        description: "Add at least 3 routines for more accurate smart suggestions.",
      });
    }
    
    setIsLoading(true);
    setIsOpen(true);
    setSuggestions(null);

    const result = await getSmartSuggestions(routines);
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setIsOpen(false);
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Button onClick={handleGetSuggestions} variant="outline" size="sm" disabled={routines.length === 0}>
        <Lightbulb className="mr-2 h-4 w-4" />
        Get Suggestions
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Smart Schedule Suggestions</DialogTitle>
            <DialogDescription>
              Based on your past performance, here are some suggestions to optimize your routine.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 min-h-[20vh]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your routines...</p>
              </div>
            )}
            {suggestions && (
              <div className="grid gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{suggestion.work}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{suggestion.suggestedTime}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
