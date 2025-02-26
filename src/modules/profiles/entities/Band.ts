import { Genre } from './Genre';
import { Profile } from './Profile';

interface BandProps {
  id: number;
  profile_id: number;
  profile: Profile;
  genres: Genre[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Band {
  private _id: number;
  private _profile_id: number;
  private _profile: Profile;
  private _genres: Genre[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: BandProps) {
    this._id = props.id;
    this._profile_id = props.profile_id;
    this._profile = props.profile;
    this._genres = props.genres;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
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

  get genres(): Genre[] {
    return this._genres;
  }

  set genres(genres: Genre[]) {
    this._genres = genres;
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
