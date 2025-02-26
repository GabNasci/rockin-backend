export class CreateUserResponseDTO {
  id: number;
  email: string;
  createdAt: Date;

  constructor(user: { id: number; email: string; createdAt: Date }) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
