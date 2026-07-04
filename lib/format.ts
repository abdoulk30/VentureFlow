// Shared number formatting so every count in the app displays consistently
// (e.g. 1234 -> "1,234"). Use this anywhere a raw integer count is shown.
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}