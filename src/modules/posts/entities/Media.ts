import { Post } from './Post';

interface MediaProps {
  id: number;
  url: string;
  post_id: number;
  post: Post;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Media {
  private _id: number;
  private _url: string;
  private _post_id: number;
  private _post: Post;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: MediaProps) {
    this._id = props.id;
    this._url = props.url;
    this._post_id = props.post_id;
    this._post = props.post;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get url(): string {
    return this._url;
  }

  set url(url: string) {
    this._url = url;
  }

  get post_id(): number {
    return this._post_id;
  }

  set post_id(post_id: number) {
    this._post_id = post_id;
  }

  get post(): Post {
    return this._post;
  }

  set post(post: Post) {
    this._post = post;
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
