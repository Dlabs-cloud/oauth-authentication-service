import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '@tss/common';
import { PortalUserIdentifierVerificationServiceImpl } from './portal-user-identifier-verification.service-impl';
import { SecurityModule } from '@tss/security';
import { ServiceModule } from '../service/service.module';
import { ConfModule } from '../conf/conf.module';
import { VerificationEmailSenderServiceImpl } from './verification-email-sender.service-impl';


@Module({
  imports: [
    CommonModule,
    forwardRef(() => ServiceModule),
    SecurityModule,
    ConfModule,
  ],
  providers: [
    PortalUserIdentifierVerificationServiceImpl,
    VerificationEmailSenderServiceImpl,
  ],
  exports: [
    PortalUserIdentifierVerificationServiceImpl,
    VerificationEmailSenderServiceImpl,
  ],
})
export class ServiceImplModule {
}
