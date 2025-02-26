import { Profile } from './Profile';

interface GenreProps {
  id?: number;
  name: string;
  profiles?: Profile[];
  created_at?: Date;
  updated_at?: Date | null;
}

export class Genre {
  private id?: number;
  private name: string;
  private profiles?: Profile[];
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: GenreProps) {
    this.id = props.id;
    this.name = props.name;
    this.profiles = props.profiles;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
