import { Profile } from '@prisma/client';

export class SearchResponseBodyDTO {
  profiles: Profile[];
  page: number;
  limit: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}
