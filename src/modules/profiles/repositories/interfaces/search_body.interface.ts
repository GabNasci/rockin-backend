export interface SearchBody {
  skip: number;
  take: number;
  search?: string | undefined;
  radius?: number | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  profileTypes?: string[] | undefined;
  specialities?: string[] | undefined;
  genres?: string[] | undefined;
  profileId: number | undefined;
}
