import { PortalUserIdentifierVerificationService } from './portal-user-identifier-verification.service';
import { forwardRef, Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationServiceImpl } from '../service-impl/portal-user-identifier-verification.service-impl';
import { ServiceImplModule } from '../service-impl/service-impl.module';
import { VerificationEmailSenderService } from './verification-email-sender.service';
import { VerificationEmailSenderServiceImpl } from '../service-impl/verification-email-sender.service-impl';
import { PortalUserRegistrationServiceImpl } from '../service-impl/portal-user-registration.service-impl';
import { PortalUserRegistrationService } from './portal-user-registration.service';

let portalUserIdentifierService = {
  provide: PortalUserIdentifierVerificationService,
  useExisting: PortalUserIdentifierVerificationServiceImpl,
};

let verificationEmailSenderService = {
  provide: VerificationEmailSenderService,
  useExisting: VerificationEmailSenderServiceImpl,
};

let portalUserRegistrationService = {
  provide: PortalUserRegistrationService,
  useExisting: PortalUserRegistrationServiceImpl,
};

@Module({
  imports: [
    forwardRef(() => ServiceImplModule),
  ],
  providers: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
  ],
  exports: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
  ],
})
export class ServiceModule {
}
