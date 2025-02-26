import { Genre } from './Genre';
import { Profile } from './Profile';

interface BandProps {
  id: number;
  profileid: number;
  profile: Profile;
  genres: Genre[];
  created_at?: Date;
  updated_at?: Date | null;
}

export class Band {
  private id: number;
  private profile_id: number;
  private profile: Profile;
  private genres: Genre[];
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: BandProps) {
    this.id = props.id;
    this.profile_id = props.profileid;
    this.profile = props.profile;
    this.genres = props.genres;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
