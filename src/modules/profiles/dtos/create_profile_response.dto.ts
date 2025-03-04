import { CreateUserResponseDTO } from '@modules/user/dtos/createUserResponse.dto';

export class CreateProfileResponseDTO {
  user: CreateUserResponseDTO;
  profileTypeId: number;
  name: string;
  handler: string;

  constructor(
    user: CreateUserResponseDTO,
    profileTypeId: number,
    name: string,
    handler: string,
  ) {
    this.user = user;
    this.profileTypeId = profileTypeId;
    this.name = name;
    this.handler = handler;
  }
}
