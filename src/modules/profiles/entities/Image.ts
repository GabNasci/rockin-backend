import { Profile } from './Profile';

interface ImageProps {
  id?: number;
  url: string;
  profile_id: number;
  profile: Profile;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Image {
  private _id?: number;
  private _url: string;
  private _profile_id: number;
  private _profile: Profile;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: ImageProps) {
    this._id = props.id;
    this._url = props.url;
    this._profile_id = props.profile_id;
    this._profile = props.profile;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id;
  }

  get url(): string {
    return this._url;
  }

  set url(url: string) {
    this._url = url;
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

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  set createdAt(createdAt: Date | undefined) {
    this._createdAt = createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date | undefined) {
    this._updatedAt = updatedAt;
  }
}
