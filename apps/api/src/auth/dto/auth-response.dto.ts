import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../roles';

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  tokenType!: 'Bearer';

  @ApiProperty()
  expiresIn!: number;

  @ApiProperty()
  user!: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}
