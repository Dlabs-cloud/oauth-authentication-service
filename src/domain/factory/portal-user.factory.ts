
import { PortalUser } from '../entity/portal-user.entity';
import { Gender } from '../constants/gender.constant';
import { FactoryHelper, ModelFactory } from '@tss/test-starter';

export class PortalUserFactory implements FactoryHelper<PortalUser> {
  apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<PortalUser> {
    let portalUser = new PortalUser();
    portalUser.firstName = faker.name.firstName();
    portalUser.lastName = faker.name.lastName();
    portalUser.gender = faker.random.arrayElement(Object.values(Gender));
    portalUser.password = faker.random.uuid();
    portalUser.displayName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    portalUser.otherName = faker.name.lastName();
    portalUser.passwordLastUpdatedOn = new Date();
    portalUser.passwordUpdateRequired = faker.random.boolean();
    portalUser.publishedOn = new Date();
    return Promise.resolve(portalUser);
  }

}