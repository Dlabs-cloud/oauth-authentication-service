import { FactoryHelper, ModelFactory } from '@tss/nest-test-starter';
import { PortalUserIdentificationVerification } from '../entity/portal-user-identification-verification.entity';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';

export class PortalUserIdentifierVerificationFactory implements FactoryHelper<PortalUserIdentificationVerification> {

  apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<PortalUserIdentificationVerification> {
    let verification = new PortalUserIdentificationVerification();
    verification.verificationCode = faker.random.number(5).toString();
    verification.identifier = faker.internet.email();
    verification.verificationCodeHash = faker.random.uuid();
    verification.expiresOn = faker.date.future();
    verification.deactivatedOn = faker.date.future();
    verification.usedOn = faker.date.future();
    verification.identifierType = faker.random.arrayElement(Object.values(UserIdentifierType));
    return Promise.resolve(verification);
  }

}