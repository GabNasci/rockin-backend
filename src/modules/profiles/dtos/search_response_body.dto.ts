import { Profile } from '@prisma/client';

export class SearchResponseBodyDTO {
  profiles: Profile[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
