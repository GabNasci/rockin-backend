import { Profile } from 'src/modules/profiles/entities/Profile';
import { Post } from './Post';

interface SupportProps {
  id: number;
  postid: number;
  profileid: number;
  post: Post;
  profile: Profile;
  created_at: Date;
  updated_at: Date | null;
}

export class Support {
  private id: number;
  private postid: number;
  private profileid: number;
  private post: Post;
  private profile: Profile;
  private created_at: Date;
  private updated_at: Date | null;

  constructor(props: SupportProps) {
    this.id = props.id;
    this.postid = props.postid;
    this.profileid = props.profileid;
    this.post = props.post;
    this.profile = props.profile;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
