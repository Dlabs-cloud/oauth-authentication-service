import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidatorTransformerPipe implements PipeTransform<any> {

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!value) {
      return value;
    }


    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException({
        message: 'Input data validation failed',
        errors: this.buildError(errors),
      }, HttpStatus.BAD_REQUEST);
    }
    return value;

  }


  private buildError(errors) {
    let result = {};
    errors.forEach(el => {
      if (el.children.length > 0) {
        result = { ...result, ...this.buildError(el.children) };
      } else {
        let prop = el.property;
        Object.entries(el.constraints).forEach(constraint => {
          result[prop] = `${constraint[1]}`;
        });
      }
    });
    return result;
  }


  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

}