export function formatDurationMinutes(minutes: number) {
  let days = Math.floor(minutes / 60 / 24);
  let hours = Math.floor(minutes / 60 % 24);
  let remMinutes = Math.floor(minutes % 60);
  let ret = "";
  if (days > 0) {
    ret += `${days}d `;
  }
  ret += `${hours.toString().padStart(2, "0")}:${remMinutes.toString().padStart(2, "0")}h`;
  return ret;
}
