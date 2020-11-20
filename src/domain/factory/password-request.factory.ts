import { FactoryHelper, ModelFactory } from '@tss/test-starter';
import { PasswordResetRequest } from '../entity/password-reset-request.entity';
import { PortalUserIdentifier } from '../entity/portal-user-identifier.entity';


export class PasswordRequestFactory implements FactoryHelper<PasswordResetRequest> {
  async apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<PasswordResetRequest> {
    let passwordResetRequest = new PasswordResetRequest();
    passwordResetRequest.expiresOn = faker.date.future();
    passwordResetRequest.portalUserIdentifier = await modelFactory.create(PortalUserIdentifier);
    passwordResetRequest.resetCode = faker.random.alphaNumeric(5);
    passwordResetRequest.resetCodeHash = faker.random.uuid();
    passwordResetRequest.deactivatedOn = faker.date.future();
    passwordResetRequest.userAgent = faker.internet.userAgent();
    passwordResetRequest.ipAddress = faker.internet.ip();
    return passwordResetRequest;

  }

}