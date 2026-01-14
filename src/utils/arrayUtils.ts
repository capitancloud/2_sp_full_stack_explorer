/**
 * Confronta due array per uguaglianza (più efficiente di JSON.stringify)
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};
