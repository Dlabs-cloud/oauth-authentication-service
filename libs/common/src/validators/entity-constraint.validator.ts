import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
} from 'class-validator';
import { getConnection } from 'typeorm';
import { GenericStatus } from '@tss/common';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export function EntityValidator(param: EntityConstraintParam, options?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      constraints: [param],
      options,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const param = args.constraints[0] as EntityConstraintParam;
          if (!value) {
            return Promise.resolve(true);

          }
          const isExists = param.isExist;
          return getConnection()
            .getRepository(param.entity)
            .createQueryBuilder('entity')
            .where(`entity.${param.column} = :column`)
            .andWhere(`entity.status = :status`)
            .setParameter('column', value)
            .setParameter('status', GenericStatus.ACTIVE)
            .getCount().then(count => {
              return isExists && count ? true :
                isExists && !count ? false :
                  !isExists && count ? false :
                    !isExists && !count ? true : !!count;
            });

        },
      },

    });
  };

}


export interface EntityConstraintParam {
  entity: EntityTarget<any>;
  column: string,
  isExist: boolean
  status?: GenericStatus;
}