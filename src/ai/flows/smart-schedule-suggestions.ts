'use server';

/**
 * @fileOverview AI-powered flow to suggest optimal times for scheduling activities based on past routine data and scores.
 *
 * - suggestOptimalSchedule - A function that takes routine data as input and returns suggestions for optimal scheduling.
 * - SmartScheduleInput - The input type for the suggestOptimalSchedule function.
 * - SmartScheduleOutput - The return type for the suggestOptimalSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartScheduleInputSchema = z.array(
  z.object({
    attempt: z.string().describe('The attempt number for the routine.'),
    time: z.string().describe('The time slot for the routine (e.g., 8am - 10am).'),
    work: z.string().describe('The work or subject for the routine.'),
    score: z.number().describe('The score achieved for the routine (0-10).'),
  })
).describe('An array of routine data objects, each containing attempt, time, work, and score.');

export type SmartScheduleInput = z.infer<typeof SmartScheduleInputSchema>;

const SmartScheduleOutputSchema = z.array(
  z.object({
    work: z.string().describe('The work or subject for the routine.'),
    suggestedTime: z.string().describe('The suggested optimal time slot for the routine.'),
    reasoning: z.string().describe('The reasoning behind the suggested time.'),
  })
).describe('An array of suggested optimal schedules for each work item, including reasoning.');

export type SmartScheduleOutput = z.infer<typeof SmartScheduleOutputSchema>;

export async function suggestOptimalSchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  return smartScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSchedulePrompt',
  input: {schema: SmartScheduleInputSchema},
  output: {schema: SmartScheduleOutputSchema},
  prompt: `You are an AI-powered scheduling assistant. Analyze the user's past routine data and scores to suggest optimal times for each activity.

Here is the user's routine data:

{{#each this}}
- Attempt: {{attempt}}, Time: {{time}}, Work: {{work}}, Score: {{score}}
{{/each}}

Based on this data, provide a suggested optimal schedule for each activity. Include reasoning for each suggestion.

Output should be an array of objects, where each object contains the work/subject, suggested time, and reasoning.
`,
});

const smartScheduleFlow = ai.defineFlow(
  {
    name: 'smartScheduleFlow',
    inputSchema: SmartScheduleInputSchema,
    outputSchema: SmartScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
