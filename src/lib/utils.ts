import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
