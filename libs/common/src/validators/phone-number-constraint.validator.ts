import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions, ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

@ValidatorConstraint({ async: true })
export class PhoneNumberConstraintValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!phoneNumber) {
      return false;
    }
    if (phoneNumber && !phoneNumber.trim().length) {
      return false;
    }

    try {
      const phoneNumberUtil = PhoneNumberUtil.getInstance();
      phoneNumberUtil.parse(phoneNumber);
      return true;
    } catch (e) {
      return false;
    }
  }

}


export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PhoneNumberConstraintValidator,
    });
  };
}
