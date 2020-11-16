import { FactoryHelper } from './factory-helper';
import { EntityFactoryBuilder } from './entity-factory-builder';
import { ObjectType } from 'typeorm';

export interface ModelFactory {
  create<T>(entity: ObjectType<T>): Promise<T>;

  register<Entity, Mocker extends FactoryHelper<Entity>>(entity: ObjectType<Entity>, type: (new () => Mocker));

  createMany<T>(count: number, entity: ObjectType<T>): Promise<T[]>;

  upset<Entity>(entity: ObjectType<Entity>): EntityFactoryBuilder<Entity>;

  makeMany<T>(count: number, entity: ObjectType<T>): Promise<T[]>;

  make<T>(entity: ObjectType<T>): Promise<T>;

}
