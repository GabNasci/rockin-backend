export class LoginUserResponseDTO {
  token: string;
  user: {
    id: number;
    email: string;
    profileId: number;
  };
}
