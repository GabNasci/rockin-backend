import { Profile } from '@prisma/client';

export class SearchResponseBodyDTO {
  profiles: Profile[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastpage: boolean;
}
