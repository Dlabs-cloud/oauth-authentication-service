import { forwardRef, Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationServiceImpl } from './portal-user-identifier-verification.service-impl';
import { ServiceModule } from '../service/service.module';
import { VerificationEmailSenderServiceImpl } from './verification-email-sender.service-impl';
import { PortalUserRegistrationServiceImpl } from './portal-user-registration.service-impl';
import { ImplicitAuthenticationServiceImpl } from './implicit-authentication.service-impl';
import { RefreshTokenServiceImpl } from './refresh-token.service-impl';
import { LoginAuthenticationServiceImpl } from './login-authentication.service-impl';
import { PasswordResetEmailSenderServiceImpl } from './password-reset-email-sender.service-impl';
import { PasswordResetRequestServiceImpl } from './password-reset-request.service-impl';
import { PasswordUpdateServiceImpl } from './password-update.service-impl';


@Module({
  imports: [
    forwardRef(() => ServiceModule),
  ],
  providers: [
    PortalUserIdentifierVerificationServiceImpl,
    VerificationEmailSenderServiceImpl,
    PortalUserRegistrationServiceImpl,
    ImplicitAuthenticationServiceImpl,
    RefreshTokenServiceImpl,
    LoginAuthenticationServiceImpl,
    PasswordResetEmailSenderServiceImpl,
    PasswordResetRequestServiceImpl,
    PasswordUpdateServiceImpl,
  ],
  exports: [
    PortalUserIdentifierVerificationServiceImpl,
    VerificationEmailSenderServiceImpl,
    PortalUserRegistrationServiceImpl,
    ImplicitAuthenticationServiceImpl,
    LoginAuthenticationServiceImpl,
    RefreshTokenServiceImpl,
    PasswordResetEmailSenderServiceImpl,
    PasswordResetRequestServiceImpl,
    PasswordUpdateServiceImpl,
  ],
})
export class ServiceImplModule {
}
