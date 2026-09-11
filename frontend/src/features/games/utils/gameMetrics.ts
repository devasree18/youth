export function calculateAverageReaction(times: number[]): number {
  if (!times || times.length === 0) return 0;
  const sum = times.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / times.length);
}

export function calculateReactionConsistency(
  times: number[]
): 'steady' | 'variable' | 'rhythmic' {
  if (!times || times.length < 3) return 'steady';
  const avg = calculateAverageReaction(times);
  const variance =
    times.reduce((acc, curr) => acc + Math.pow(curr - avg, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev < 180) return 'steady';
  if (stdDev < 320) return 'rhythmic';
  return 'variable';
}

export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
