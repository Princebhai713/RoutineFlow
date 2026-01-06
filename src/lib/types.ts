export type Routine = {
  id: string;
  attempt: string;
  startTime: string;
  endTime: string;
  work: string;
  hours: number;
  completed: boolean;
  score: number;
  notificationId?: number;
};
