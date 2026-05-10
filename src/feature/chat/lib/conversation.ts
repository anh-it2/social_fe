export function buildDmId(userIdA: string, userIdB: string): string {
  return `dm:${[userIdA, userIdB].sort().join(":")}`;
}
