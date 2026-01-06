'use server';

import { suggestOptimalSchedule, SmartScheduleInput } from '@/ai/flows/smart-schedule-suggestions';
import type { Routine } from '@/lib/types';

export async function getSmartSuggestions(routines: Routine[]) {
  if (!routines || routines.length === 0) {
    return { error: 'No routine data available to generate suggestions.' };
  }

  // The AI flow expects a score, let's use hours as a proxy or adjust the flow.
  // For now, we'll map hours to score, assuming more hours might not mean better score.
  // A better approach would be to update the AI prompt to understand "hours".
  // Let's create a synthetic score for the AI.
  const formattedRoutines: SmartScheduleInput = routines.map(r => ({
    attempt: r.attempt,
    time: r.time,
    work: r.work,
    score: r.completed ? 10 : 2, // simple logic: completed is a high score, not completed is low
  }));

  try {
    const suggestions = await suggestOptimalSchedule(formattedRoutines);
    return { suggestions };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate smart suggestions. Please try again later.' };
  }
}
