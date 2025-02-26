import { Profile } from 'src/modules/profiles/entities/Profile';
import { Support } from './Support';
import { Media } from './Media';

interface PostProps {
  id: number;
  text?: string;
  link?: string;
  profileid: number;
  profile: Profile;
  taggedprofiles: Profile[];
  supports: Support[];
  medias: Media[];
  created_at: Date;
  updated_at: Date | null;
}

export class Post {
  private id: number;
  private text?: string;
  private link?: string;
  private profileid: number;
  private profile: Profile;
  private taggedprofiles: Profile[];
  private supports: Support[];
  private medias: Media[];
  private created_at: Date;
  private updated_at: Date | null;

  constructor(props: PostProps) {
    this.id = props.id;
    this.text = props.text;
    this.link = props.link;
    this.profileid = props.profileid;
    this.profile = props.profile;
    this.taggedprofiles = props.taggedprofiles;
    this.supports = props.supports;
    this.medias = props.medias;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
