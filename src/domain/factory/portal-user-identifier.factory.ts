import { FactoryHelper, ModelFactory } from '@tss/nest-test-starter';
import { PortalUserIdentifier } from '../entity/portal-user-identifier.entity';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';
import { PortalUserIdentificationVerification } from '../entity/portal-user-identification-verification.entity';
import { PortalUser } from '../entity/portal-user.entity';

export class PortalUserIdentifierFactory implements FactoryHelper<PortalUserIdentifier> {
  async apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<PortalUserIdentifier> {
    let portalUserIdentifier = new PortalUserIdentifier();
    portalUserIdentifier.verified = faker.random.boolean();
    portalUserIdentifier.identifier = faker.internet.email();
    portalUserIdentifier.dateVerified = new Date();
    portalUserIdentifier.portalUser = await modelFactory.create(PortalUser);
    portalUserIdentifier.identifierType = faker.random.arrayElement(Object.values(UserIdentifierType));
    portalUserIdentifier.verification = await modelFactory.create(PortalUserIdentificationVerification);
    return portalUserIdentifier;
  }

}