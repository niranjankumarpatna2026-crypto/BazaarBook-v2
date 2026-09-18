export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Raat ka waqt';       // 12am–5am
  if (h < 12) return 'Suprabhat';           // 5am–12pm
  if (h < 17) return 'Namaste';             // 12pm–5pm
  if (h < 21) return 'Shubh Sandhya';       // 5pm–9pm
  return 'Shubh Ratri';                     // 9pm–12am
}

export function getTodayHi(): string {
  return new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}