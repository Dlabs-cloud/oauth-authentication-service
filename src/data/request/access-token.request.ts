import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenRequest {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}