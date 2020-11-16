import { PortalUserIdentificationVerification } from '../entity/portal-user-identification-verification.entity';
import { PortalUserIdentifierVerificationFactory } from './portal-user-identifier-verification.factory';
import { PortalUserIdentifier } from '../entity/portal-user-identifier.entity';
import { PortalUserIdentifierFactory } from './portal-user-identifier.factory';
import { PortalUser } from '../entity/portal-user.entity';
import { PortalUserFactory } from './portal-user.factory';
import { ModelFactory } from '@tss/test-starter';
import { RefreshToken } from '../entity/refresh-token.entity';
import { RefreshTokenFactory } from './refresh-token.factory';
import { PortalUserAuthentication } from '../entity/portal-user-authentication.entity';
import { PortalUserAuthenticationFactory } from './portal-user-authentication.factory';

export class ModelFactoryRoster {
  static register(modelFactory: ModelFactory) {
    modelFactory.register(PortalUserIdentificationVerification, PortalUserIdentifierVerificationFactory);
    modelFactory.register(PortalUserIdentifier, PortalUserIdentifierFactory);
    modelFactory.register(PortalUser, PortalUserFactory);
    modelFactory.register(RefreshToken, RefreshTokenFactory);
    modelFactory.register(PortalUserAuthentication, PortalUserAuthenticationFactory);
  }
}
