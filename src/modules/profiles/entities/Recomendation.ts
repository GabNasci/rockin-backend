import { Profile } from './Profile';

interface RecomendationProps {
  id?: number;
  profile_id: number;
  profile?: Profile;
  created_at?: Date;
  updated_at?: Date | null;
}

export class Recomendation {
  private id?: number;
  private profile_id: number;
  private profile?: Profile;
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: RecomendationProps) {
    this.id = props.id;
    this.profile_id = props.profile_id;
    this.profile = props.profile;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getProfileId(): number {
    return this.profile_id;
  }

  public setProfileId(profile_id: number): void {
    this.profile_id = profile_id;
  }

  public getProfile(): Profile | undefined {
    return this.profile;
  }

  public setProfile(profile: Profile): void {
    this.profile = profile;
  }

  public getCreatedAt(): Date | undefined {
    return this.created_at;
  }

  public setCreatedAt(created_at: Date): void {
    this.created_at = created_at;
  }

  public getUpdatedAt(): Date | null | undefined {
    return this.updated_at;
  }

  public setUpdatedAt(updated_at: Date | null): void {
    this.updated_at = updated_at;
  }
}
