import { UserDataApiRequest } from './user-data-api.request';
import {
  IsArray,
  IsBooleanString,
  IsEmail,
  isEmail,
  IsEnum,
  IsNotEmpty, IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../../domain/constants/gender.constant';
import { EntityValidator } from '@tss/common/validators/entity-constraint.validator';
import { PortalUser } from '../../domain/entity/portal-user.entity';
import { Type } from 'class-transformer';

export class UserRegistrationApiRequest {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  otherNames?: string;

  @IsOptional()
  @IsEmail()
  @EntityValidator({
    isExist: false,
    entity: PortalUser,
    column: 'email',
  })
  phoneNumber?: string;

  phoneNumberVerificationCode?: string;

  @IsBooleanString()
  isPasswordUpdateRequired: boolean;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEmail()
  @EntityValidator({
    isExist: false,
    entity: PortalUser,
    column: 'email',
  })
  email?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDataApiRequest)
  data?: UserDataApiRequest[];

}