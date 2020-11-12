import { IsString } from 'class-validator';

export class UserDataApiRequest {
  @IsString()
  name: string;
  @IsString()
  value: string;
}