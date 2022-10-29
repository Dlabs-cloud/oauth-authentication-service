import { UserDataApiRequest } from './user-data-api.request';
import {
  IsArray, IsBoolean,
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../../domain/constants/gender.constant';
import { EntityValidator } from '@dlabs/common/validators/entity-constraint.validator';
import { PortalUser } from '../../domain/entity/portal-user.entity';
import { Type } from 'class-transformer';
import { IsValidPhoneNumber } from '@dlabs/common/validators/phone-number-constraint.validator';
import { PortalUserIdentifier } from '../../domain/entity/portal-user-identifier.entity';

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
  @IsValidPhoneNumber({
    message: 'Phone number is not valid',
  })
  @EntityValidator({
    isExist: false,
    entity: PortalUserIdentifier,
    column: 'identifier',
  }, {
    message: 'phone number has already been used',
  })
  phoneNumber?: string;

  @IsOptional()
  phoneNumberVerificationCode?: string;

  @IsOptional()
  emailVerificationCode?: string;

  @IsOptional()
  @IsBoolean()
  isPasswordUpdateRequired: boolean;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEmail()
  @EntityValidator({
    isExist: false,
    entity: PortalUserIdentifier,
    column: 'identifier',
  }, {
    message: 'Email has already been used',
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