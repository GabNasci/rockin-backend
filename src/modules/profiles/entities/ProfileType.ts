import { Profile } from './Profile';

interface ProfileTypeProps {
  id?: number;
  name: string;
  profiles: Profile[];
  created_at?: Date;
  updated_at?: Date | null;
}

export class ProfileType {
  private id?: number;
  private name: string;
  private profiles: Profile[];
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: ProfileTypeProps) {
    this.id = props.id;
    this.name = props.name;
    this.profiles = props.profiles;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getProfiles(): Profile[] {
    return this.profiles;
  }

  public setProfiles(profiles: Profile[]): void {
    this.profiles = profiles;
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
