import { Profile } from 'src/modules/profiles/entities/Profile';
import { Support } from './Support';
import { Media } from './Media';

interface PostProps {
  id: number;
  text?: string;
  link?: string;
  profile_id: number;
  profile: Profile;
  tagged_profiles: Profile[];
  supports: Support[];
  medias: Media[];
  created_at: Date;
  updated_at: Date;
}

export class Post {
  private _id: number;
  private _text?: string;
  private _link?: string;
  private _profile_id: number;
  private _profile: Profile;
  private _tagged_profiles: Profile[];
  private _supports: Support[];
  private _medias: Media[];
  private _created_at: Date;
  private _updated_at: Date;

  constructor(props: PostProps) {
    this._id = props.id;
    this._text = props.text;
    this._link = props.link;
    this._profile_id = props.profile_id;
    this._profile = props.profile;
    this._tagged_profiles = props.tagged_profiles;
    this._supports = props.supports;
    this._medias = props.medias;
    this._created_at = props.created_at;
    this._updated_at = props.updated_at;
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get text(): string | undefined {
    return this._text;
  }

  set text(text: string | undefined) {
    this._text = text;
  }

  get link(): string | undefined {
    return this._link;
  }

  set link(link: string | undefined) {
    this._link = link;
  }

  get profile_id(): number {
    return this._profile_id;
  }

  set profile_id(profile_id: number) {
    this._profile_id = profile_id;
  }

  get profile(): Profile {
    return this._profile;
  }

  set profile(profile: Profile) {
    this._profile = profile;
  }

  get tagged_profiles(): Profile[] {
    return this._tagged_profiles;
  }

  set tagged_profiles(tagged_profiles: Profile[]) {
    this._tagged_profiles = tagged_profiles;
  }

  get supports(): Support[] {
    return this._supports;
  }

  set supports(supports: Support[]) {
    this._supports = supports;
  }

  get medias(): Media[] {
    return this._medias;
  }

  set medias(medias: Media[]) {
    this._medias = medias;
  }

  get created_at(): Date {
    return this._created_at;
  }

  set created_at(created_at: Date) {
    this._created_at = created_at;
  }
  get updated_at(): Date {
    return this._updated_at;
  }
}
