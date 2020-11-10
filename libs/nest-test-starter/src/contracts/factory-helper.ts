import FakerStatic = Faker.FakerStatic;
import {ModelFactory} from './model-factory';

export interface FactoryHelper<T> {
    apply(faker: FakerStatic, modelFactory: ModelFactory): Promise<T>;
}
