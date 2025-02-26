import { Profile } from 'src/modules/profiles/entities/Profile';
import { Post } from './Post';

interface SupportProps {
  id: number;
  post_id: number;
  profile_id: number;
  post: Post;
  profile: Profile;
  created_at: Date;
}

export class Support {
  private _id: number;
  private _post_id: number;
  private _profile_id: number;
  private _post: Post;
  private _profile: Profile;
  private _created_at: Date;

  constructor(props: SupportProps) {
    this._id = props.id;
    this._post_id = props.post_id;
    this._profile_id = props.profile_id;
    this._post = props.post;
    this._profile = props.profile;
    this._created_at = props.created_at;
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get post_id(): number {
    return this._post_id;
  }

  set post_id(post_id: number) {
    this._post_id = post_id;
  }

  get profile_id(): number {
    return this._profile_id;
  }

  set profile_id(profile_id: number) {
    this._profile_id = profile_id;
  }

  get post(): Post {
    return this._post;
  }

  set post(post: Post) {
    this._post = post;
  }

  get profile(): Profile {
    return this._profile;
  }

  set profile(profile: Profile) {
    this._profile = profile;
  }

  get created_at(): Date {
    return this._created_at;
  }

  set created_at(created_at: Date) {
    this._created_at = created_at;
  }
}
