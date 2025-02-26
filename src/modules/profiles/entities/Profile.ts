import { User } from 'src/modules/user/entities/User';
import { Genre } from './Genre';
import { ProfileType } from './ProfileType';

interface ProfileProps {
  id?: number;
  name: string;
  handle: string;
  about?: string;
  avatar?: string;
  spotifyid?: string;
  userid: number;
  profiletypeid: number;
  profiletype?: ProfileType;
  genres: Genre[];
  user?: User;
  created_at?: Date;
  updated_at?: Date | null;
}

export class Profile {
  private id?: number;
  private name: string;
  private handle: string;
  private about?: string;
  private avatar?: string;
  private spotifyid?: string;
  private userid: number;
  private profiletypeid: number;
  private genres: Genre[];
  private profiletype?: ProfileType;
  private user?: User;
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: ProfileProps) {
    this.id = props.id;
    this.name = props.name;
    this.handle = props.handle;
    this.about = props.about;
    this.avatar = props.avatar;
    this.spotifyid = props.spotifyid;
    this.userid = props.userid;
    this.profiletypeid = props.profiletypeid;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.genres = props.genres;
    this.profiletype = props.profiletype;
    this.user = props.user;
  }

  getId(): number | undefined {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getHandle(): string {
    return this.handle;
  }

  setHandle(handle: string): void {
    this.handle = handle;
  }

  getAbout(): string | undefined {
    return this.about;
  }

  setAbout(about: string): void {
    this.about = about;
  }

  getAvatar(): string | undefined {
    return this.avatar;
  }

  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  getSpotifyId(): string | undefined {
    return this.spotifyid;
  }

  setSpotifyId(spotifyid: string): void {
    this.spotifyid = spotifyid;
  }

  getUserId(): number {
    return this.userid;
  }

  setUserId(userid: number): void {
    this.userid = userid;
  }

  getProfileTypeId(): number {
    return this.profiletypeid;
  }

  setProfileTypeId(profiletypeid: number): void {
    this.profiletypeid = profiletypeid;
  }

  getGenres(): Genre[] {
    return this.genres;
  }

  setGenres(genres: Genre[]): void {
    this.genres = genres;
  }

  getProfileType(): ProfileType | undefined {
    return this.profiletype;
  }

  setProfileType(profiletype: ProfileType): void {
    this.profiletype = profiletype;
  }

  getUser(): User | undefined {
    return this.user;
  }

  setUser(user: User): void {
    this.user = user;
  }

  getCreatedAt(): Date | undefined {
    return this.created_at;
  }

  setCreatedAt(created_at: Date): void {
    this.created_at = created_at;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.updated_at;
  }

  setUpdatedAt(updated_at: Date | null): void {
    this.updated_at = updated_at;
  }
}
