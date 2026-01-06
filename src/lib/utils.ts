import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTimeString(timeString: string): Date {
  const now = new Date();
  
  // Handles "HH:mm" (24-hour) format from <input type="time">
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const scheduleDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
       // If the time is for the past today, schedule it for tomorrow
      if (scheduleDate < now) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }
      return scheduleDate;
    }
  }

  // Fallback for formats like "8am", "10pm"
  const ampmMatch = timeString.toLowerCase().match(/(\d+)(am|pm)?/);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    const isPm = ampmMatch[2] === 'pm';
    
    if (isPm && hour < 12) {
      hour += 12;
    } else if (!isPm && hour === 12) { // Midnight case "12am"
      hour = 0;
    }
    
    const scheduleDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0);
    if (scheduleDate < now) {
      scheduleDate.setDate(scheduleDate.getDate() + 1);
    }
    return scheduleDate;
  }
  
  // Default to now if parsing fails
  return now;
}

export function formatDistanceToNow(date: Date): string {
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function calculateHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);

  if (end <= start) {
    // If end time is on the next day
    end.setDate(end.getDate() + 1);
  }

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return parseFloat(diffHours.toFixed(2));
}

export function formatTime(timeString: string) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'pm' : 'am';
  const formattedHour = h % 12 || 12; // convert 0 to 12
  return `${formattedHour}:${minutes}${ampm}`;
}
