import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetApiRequest {
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsBoolean()
  invalidateOtherSession: boolean;
}