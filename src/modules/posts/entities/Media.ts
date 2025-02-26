import { Post } from './Post';

interface MediaProps {
  id: number;
  url: string;
  postid: number;
  post: Post;
  created_at?: Date;
  updated_at?: Date | null;
}

export class Media {
  private id: number;
  private url: string;
  private postid: number;
  private post: Post;
  private created_at?: Date;
  private updated_at?: Date | null;

  constructor(props: MediaProps) {
    this.id = props.id;
    this.url = props.url;
    this.postid = props.postid;
    this.post = props.post;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
