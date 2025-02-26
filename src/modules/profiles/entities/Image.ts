import { Profile } from './Profile';

interface ImageProps {
  id?: number;
  url: string;
  profileid: number;
  profile: Profile;
  created_at?: Date;
  updated_at?: Date | null;
}

export class Image {
  private id?: number;
  private url: string;
  private profileid: number;
  private profile: Profile;
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: ImageProps) {
    this.id = props.id;
    this.url = props.url;
    this.profileid = props.profileid;
    this.profile = props.profile;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
