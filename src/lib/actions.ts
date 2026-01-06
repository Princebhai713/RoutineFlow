'use server';

import { suggestOptimalSchedule, SmartScheduleInput } from '@/ai/flows/smart-schedule-suggestions';
import type { Routine } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export async function getSmartSuggestions(routines: Routine[]) {
  if (!routines || routines.length === 0) {
    return { error: 'No routine data available to generate suggestions.' };
  }

  const formattedRoutines: SmartScheduleInput = routines.map(r => ({
    attempt: r.attempt,
    time: `${formatTime(r.startTime)} - ${formatTime(r.endTime)}`,
    work: r.work,
    score: r.score ?? 0, 
  }));

  try {
    const suggestions = await suggestOptimalSchedule(formattedRoutines);
    return { suggestions };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate smart suggestions. Please try again later.' };
  }
}
