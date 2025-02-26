import { User } from 'src/modules/user/entities/User';
import { Genre } from './Genre';
import { ProfileType } from './ProfileType';

interface ProfileProps {
  id?: number;
  name: string;
  handle: string;
  about?: string;
  avatar?: string;
  spotify_id?: string;
  user_id: number;
  profile_type_id: number;
  profile_type?: ProfileType;
  genres: Genre[];
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Profile {
  private _id?: number;
  private _name: string;
  private _handle: string;
  private _about?: string;
  private _avatar?: string;
  private _spotify_id?: string;
  private _user_id: number;
  private _profile_type_id: number;
  private _genres: Genre[];
  private _profile_type?: ProfileType;
  private _user?: User;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: ProfileProps) {
    this._id = props.id;
    this._name = props.name;
    this._handle = props.handle;
    this._about = props.about;
    this._avatar = props.avatar;
    this._spotify_id = props.spotify_id;
    this._user_id = props.user_id;
    this._profile_type_id = props.profile_type_id;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._genres = props.genres;
    this._profile_type = props.profile_type;
    this._user = props.user;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(value: number | undefined) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get handle(): string {
    return this._handle;
  }

  set handle(value: string) {
    this._handle = value;
  }

  get about(): string | undefined {
    return this._about;
  }

  set about(value: string | undefined) {
    this._about = value;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  set avatar(value: string | undefined) {
    this._avatar = value;
  }

  get spotify_id(): string | undefined {
    return this._spotify_id;
  }

  set spotify_id(value: string | undefined) {
    this._spotify_id = value;
  }

  get user_id(): number {
    return this._user_id;
  }

  set user_id(value: number) {
    this._user_id = value;
  }

  get profile_type_id(): number {
    return this._profile_type_id;
  }

  set profile_type_id(value: number) {
    this._profile_type_id = value;
  }

  get musician_genres(): Genre[] | undefined {
    return this._genres;
  }

  set musician_genres(value: Genre[]) {
    this._genres = value;
  }

  get profile_type(): ProfileType | undefined {
    return this._profile_type;
  }

  set profile_type(value: ProfileType | undefined) {
    this._profile_type = value;
  }

  get user(): User | undefined {
    return this._user;
  }

  set user(value: User | undefined) {
    this._user = value;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  set createdAt(value: Date | undefined) {
    this._createdAt = value;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
  }
}

/* model profiles {
  id                    Int                     @id @default(autoincrement())
  name                  String
  handle                String                  @unique
  about                 String?
  avatar                String?
  spotify_id            String?
  profile_type_id       Int
  user_id               Int?
  bands                 bands?
  profile_type          profile_types?          @relation(fields: [profile_type_id], references: [id])
  user                  users?                  @relation(fields: [user_id], references: [id])
  images                images[]
  locations             locations?
  supports              supports[]
  posts                 posts[]
  tagged_profiles_posts tagged_profiles_posts[]
  musician_bands        musician_bands[]
  musician_genres       musician_genres[]
  musician_specialities musician_specialities[]
  recomendations        recomendations[]
  conversation_profiles conversation_profiles[]
  created_at            DateTime                @default(now())
  updated_at            DateTime                @updatedAt
}
*/
