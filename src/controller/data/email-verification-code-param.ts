import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailVerificationCodeParam {

  @IsEmail()
  @IsNotEmpty()
  email: string;
}