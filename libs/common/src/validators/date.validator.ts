import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { DateTime, Duration } from 'luxon';

export function IsDateFormat(param: DateValidator, options?: ValidationOptions) {

  return function(object: Object, propertyName: string) {
    registerDecorator({
      constraints: [param],
      options,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const param = args.constraints[0] as DateValidator;
          if (!value) {
            return Promise.resolve(true);
          }
          let luxonDate = DateTime.fromFormat(value, param.format);

          if (param.isBefore) {
            return luxonDate.isValid && luxonDate < DateTime.local();
          }
          return luxonDate.isValid && luxonDate >= DateTime.local();
        },
      },
    });
  };
}


export class DateValidator {
  isBefore: boolean;
  format: string;
}