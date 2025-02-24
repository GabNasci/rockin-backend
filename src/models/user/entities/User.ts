interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User {
  private _id?: number;
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: UserProps) {
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
