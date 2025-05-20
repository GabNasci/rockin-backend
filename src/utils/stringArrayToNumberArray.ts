export function stringArrayToNumberArray(stringArray: string[]): number[] {
  return stringArray.map((str) => Number(str));
}
