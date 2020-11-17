import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  identifier: string;
  @IsNotEmpty()
  password: string;
}