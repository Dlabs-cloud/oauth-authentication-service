import { getConnection } from 'typeorm';
import { ModelFactoryRoster } from './model-factory-roster';
import { ModelFactoryImpl, OrmAdapter } from '@tss/test-starter';


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