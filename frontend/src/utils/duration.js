export const formatDuration = (durationMinutes) => {
  const totalMinutes = Number(durationMinutes);
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "By consultation";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours) parts.push(`${hours} hr${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} min`);
  return parts.join(" ");
};