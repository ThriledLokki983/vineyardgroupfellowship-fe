/**
 * Get time-based greeting
 * Returns "Good morning", "Good afternoon", or "Good evening" based on current time
 */
export function useGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}
