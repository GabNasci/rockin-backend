export interface SearchBody {
  skip: number;
  take: number;
  search?: string | undefined;
  radius?: number | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
}
