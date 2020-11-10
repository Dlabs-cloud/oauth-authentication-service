import { ModelFactory } from '@tss/nest-test-starter';
import { PortalUserIdentificationVerification } from '../entity/portal-user-identification-verification.entity';
import { PortalUserIdentifierVerificationFactory } from './portal-user-identifier-verification.factory';
import { PortalUserIdentifier } from '../entity/portal-user-identifier.entity';
import { PortalUserIdentifierFactory } from './portal-user-identifier.factory';
import { PortalUser } from '../entity/portal-user.entity';
import { PortalUserFactory } from './portal-user.factory';

export class ModelFactoryRoster {
  static register(modelFactory: ModelFactory) {
    modelFactory.register(PortalUserIdentificationVerification, PortalUserIdentifierVerificationFactory);
    modelFactory.register(PortalUserIdentifier, PortalUserIdentifierFactory);
    modelFactory.register(PortalUser, PortalUserFactory);
  }
}
