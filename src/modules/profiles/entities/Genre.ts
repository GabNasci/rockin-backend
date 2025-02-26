import { Profile } from './Profile';

interface GenreProps {
  id?: number;
  name: string;
  profiles: Profile[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Genre {
  private _id?: number;
  private _name: string;
  private _profiles?: Profile[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: GenreProps) {
    this._id = props.id;
    this._name = props.name;
    this._profiles = props.profiles;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get profiles(): Profile[] | undefined {
    return this._profiles;
  }

  set profiles(profiles: Profile[] | undefined) {
    this._profiles = profiles;
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
