import { PortalUserIdentifierVerificationService } from './portal-user-identifier-verification.service';
import { forwardRef, Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationServiceImpl } from '../service-impl/portal-user-identifier-verification.service-impl';
import { ServiceImplModule } from '../service-impl/service-impl.module';
import { VerificationEmailSenderService } from './verification-email-sender.service';
import { VerificationEmailSenderServiceImpl } from '../service-impl/verification-email-sender.service-impl';

let portalUserIdentifierService = {
  provide: PortalUserIdentifierVerificationService,
  useExisting: PortalUserIdentifierVerificationServiceImpl,
};

let verificationEmailSender = {
  provide: VerificationEmailSenderService,
  useExisting: VerificationEmailSenderServiceImpl,
};

@Module({
  imports: [
    forwardRef(() => ServiceImplModule),
  ],
  providers: [
    portalUserIdentifierService,
    verificationEmailSender,
  ],
  exports: [
    portalUserIdentifierService,
    verificationEmailSender,
  ],
})
export class ServiceModule {
}
