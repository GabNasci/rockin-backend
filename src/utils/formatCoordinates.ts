export default function formatCoordinates(
  coordinates: string | undefined,
): number | undefined {
  return coordinates !== undefined && !isNaN(Number(coordinates))
    ? Number(coordinates)
    : undefined;
}
