export class CreateUserResponseDTO {
  id: number;
  email: string;
  created_at: Date;

  constructor(props: CreateUserResponseDTO) {
    this.id = props.id;
    this.email = props.email;
    this.created_at = props.created_at;
  }
}
