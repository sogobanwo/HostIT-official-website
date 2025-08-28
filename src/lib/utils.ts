import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertDateFormat(dateStr: string) {
  // Parse the input date string (MM/DD/YY)
  const parts = dateStr.split('/');
  
  if (parts.length !== 3) {
    return "Invalid date format. Please use MM/DD/YY format.";
  }
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);
  
  // Convert 2-digit year to 4-digit year
  if (year < 100) {
    // If year is less than 50, assume it's 20xx, otherwise 19xx
    year = year < 50 ? 2000 + year : 1900 + year;
  }
  
  // Validate date
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return "Invalid date values. Please check month and day ranges.";
  }
  
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Get ordinal suffix for the day
  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  
  // Format the date
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${monthNames[month - 1]}, ${year}`;
  
  return formattedDate;
}