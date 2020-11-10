import { getConnection } from 'typeorm';
import { ModelFactoryImpl, OrmAdapter } from '@tss/nest-test-starter';
import { ModelFactoryRoster } from './model-factory-roster';


export function factory() {
  const ormAdapter: OrmAdapter = {
    save<T>(entity: T): Promise<T> {
      return getConnection().transaction(entityManager => {
        return entityManager.save(entity);
      });
    },
  };
  const modelFactory = new ModelFactoryImpl(ormAdapter);
  ModelFactoryRoster.register(modelFactory);
  return modelFactory;
}